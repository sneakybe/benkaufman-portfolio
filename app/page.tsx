"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ─── Timecode ────────────────────────────────────────────────────────────────
const FPS = 24;
function formatTC(frames: number) {
  const f = frames % FPS;
  const s = Math.floor(frames / FPS) % 60;
  const m = Math.floor(frames / FPS / 60) % 60;
  const h = Math.floor(frames / FPS / 3600) % 24;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
}

// ─── Pill Box ─────────────────────────────────────────────────────────────────
function Pill({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <span
      style={{
        display: "block",
        background: "rgba(100,100,100,0.55)",
        padding: "2px 7px",
        fontSize: "9px",
        fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
        color: "white",
        lineHeight: "14px",
        letterSpacing: "0.05em",
        userSelect: "none",
        textAlign: center ? "center" : undefined,
      }}
    >
      {children}
    </span>
  );
}

// ─── Pill Category Header (EVF, CAM) — no box, bold label ────────────────────
function PillHeader({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "block",
        fontSize: "11px",
        fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
        fontWeight: 700,
        color: "white",
        letterSpacing: "0.1em",
        textAlign: "center",
        userSelect: "none",
        marginBottom: "2px",
      }}
    >
      {children}
    </span>
  );
}

// ─── HUD Label+Value pair ─────────────────────────────────────────────────────
function HUDItem({
  label,
  value,
  onClick,
  highlight,
}: {
  label: string;
  value: string;
  onClick?: () => void;
  highlight?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "4px",
        cursor: onClick ? "none" : undefined,
        pointerEvents: onClick ? "all" : "none",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
          fontSize: "9px",
          fontWeight: 400,
          color: highlight ? "rgba(255,180,0,0.9)" : "rgba(255,255,255,0.6)",
          letterSpacing: "0.08em",
          transition: "color 300ms ease",
          userSelect: "none",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
          fontSize: "11px",
          fontWeight: 600,
          color: highlight ? "rgba(255,200,0,1.0)" : "rgba(255,255,255,1.0)",
          letterSpacing: "0.06em",
          transition: "color 300ms ease",
          userSelect: "none",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── ARRI Alexa HUD ──────────────────────────────────────────────────────────
// TC starts at 01:07:23:00 — a realistic mid-shoot position
const TC_START_FRAMES =
  1 * 3600 * FPS + // 1 hour
  7 * 60 * FPS +   // 7 minutes
  23 * FPS;        // 23 seconds

function ArriHUD({
  visible,
  falseColour,
  onTCClick,
}: {
  visible: boolean;
  falseColour: boolean;
  onTCClick: () => void;
}) {
  const [frames, setFrames] = useState(TC_START_FRAMES);
  const [isRec, setIsRec] = useState(false);
  const [stbyPulse, setStbyPulse] = useState(1);
  const [pwr, setPwr] = useState(16.8);
  const pwrRef = useRef(16.8);
  const [shutterDisplay, setShutterDisplay] = useState(172.8);
  const shutterRef = useRef(172.8);

  // Live timecode via RAF
  useEffect(() => {
    let lastTime = performance.now();
    let accumulated = 0;
    let raf: number;
    const tick = (now: number) => {
      accumulated += now - lastTime;
      lastTime = now;
      const frameMs = 1000 / FPS;
      if (accumulated >= frameMs) {
        const ticks = Math.floor(accumulated / frameMs);
        accumulated -= ticks * frameMs;
        setFrames((f) => f + ticks);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // STBY → REC after 10s
  useEffect(() => {
    const t = setTimeout(() => setIsRec(true), 10000);
    return () => clearTimeout(t);
  }, []);

  // STBY pulse
  useEffect(() => {
    if (isRec) return;
    const id = setInterval(() => setStbyPulse((p) => (p === 1 ? 0.45 : 1)), 1000);
    return () => clearInterval(id);
  }, [isRec]);

  // PWR — random 0.1V drop every 20–30s, resets at floor
  useEffect(() => {
    let scheduleId: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      const delay = 20000 + Math.random() * 10000;
      scheduleId = setTimeout(() => {
        const next = parseFloat((pwrRef.current - 0.1).toFixed(1));
        const clamped = next < 14.2 ? 16.8 : next;
        pwrRef.current = clamped;
        setPwr(clamped);
        scheduleNext();
      }, delay);
    };
    scheduleNext();
    return () => clearTimeout(scheduleId);
  }, []);

  // SHUTTER — random drift ±0.3 every 8–14s, interpolated over 600ms
  useEffect(() => {
    let scheduleId: ReturnType<typeof setTimeout>;
    let driftRaf: number;

    const animateDrift = (from: number, to: number) => {
      const startTime = performance.now();
      const duration = 600;
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        setShutterDisplay(parseFloat((from + (to - from) * eased).toFixed(1)));
        if (t < 1) {
          driftRaf = requestAnimationFrame(tick);
        } else {
          shutterRef.current = to;
        }
      };
      driftRaf = requestAnimationFrame(tick);
    };

    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 6000;
      scheduleId = setTimeout(() => {
        const delta = Math.random() > 0.5 ? 0.3 : -0.3;
        const next = parseFloat(
          Math.min(176.0, Math.max(168.0, shutterRef.current + delta)).toFixed(1)
        );
        animateDrift(shutterRef.current, next);
        scheduleNext();
      }, delay);
    };
    scheduleNext();

    return () => {
      clearTimeout(scheduleId);
      cancelAnimationFrame(driftRaf);
    };
  }, []);

  const tc = formatTC(frames);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 0.82 : 0 }}
      transition={{ duration: 0.9, delay: 0.5 }}
      className="arri-hud"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      {/* ── TOP BAR — desktop: 28px (above nav, 0–52px zone); mobile: FPS only ── */}
      <div
        style={{
          position: "absolute",
          top: "28px",
          left: 0,
          right: 0,
          padding: "0 24px",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Desktop: all 6 items */}
          <span className="hud-desktop-only" style={{ display: "contents" }}>
            <HUDItem label="FPS" value="24.000" />
            <HUDItem label="SHUTTER" value={String(shutterDisplay)} />
            <HUDItem label="IRIS" value="T 2.8  0/10" />
            <HUDItem label="EI" value="800" />
            <HUDItem label="ND" value="0.6" />
            <HUDItem label="WB" value="5600K +0.0" />
          </span>

          {/* Mobile: FPS only */}
          <span className="hud-mobile-only">
            <HUDItem label="FPS" value="24.000" />
          </span>

          {/* FALSE COLOUR — absolute centre */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "35px",
              transform: "translateX(-50%)",
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.3em",
              color: "rgba(255,200,0,0.95)",
              opacity: falseColour ? 1 : 0,
              transition: "opacity 300ms ease",
              pointerEvents: "none",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            FALSE COLOUR
          </div>
        </div>
      </div>

      {/* ── TOP-LEFT CORNER pills — desktop only ── */}
      <div
        className="hud-desktop-only"
        style={{
          position: "absolute",
          top: "calc(10vh + 24px)",
          left: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <PillHeader>EVF</PillHeader>
        <Pill>LOG</Pill>
      </div>

      <div
        className="hud-desktop-only"
        style={{
          position: "absolute",
          top: "50vh",
          left: "14px",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <PillHeader>CAM</PillHeader>
        <Pill center>4K</Pill>
        <Pill center>RAW</Pill>
        <Pill>REC709</Pill>
      </div>

      {/* ── BOTTOM BAR — desktop: 5vh from bottom; mobile: TC + REC + PWR ── */}
      <div
        style={{
          position: "absolute",
          bottom: "5vh",
          left: 0,
          right: 0,
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Desktop bottom bar items */}
        <span className="hud-desktop-only" style={{ display: "contents" }}>
          <HUDItem label="FCL" value="47.0mm" />
          <HUDItem label="PWR" value={`${pwr}V`} />
          <HUDItem label="" value="A_0004  C001" />
        </span>

        {/* Mobile bottom bar: TC left, REC centre, PWR right */}
        <span className="hud-mobile-bottom">
          <HUDItem label="TC" value={tc} highlight={falseColour} />
        </span>

        {/* STBY / REC indicator — desktop + mobile centre */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: isRec ? "#FF3333" : "#00C16E",
              display: "inline-block",
              opacity: isRec ? 1 : stbyPulse,
              transition: isRec ? "none" : "opacity 800ms ease",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: "13px",
              fontWeight: 600,
              color: isRec ? "#FF3333" : "rgba(255,255,255,0.95)",
              letterSpacing: "0.06em",
              userSelect: "none",
            }}
          >
            {isRec ? "REC" : "STBY"}
          </span>
        </div>

        <span className="hud-desktop-only" style={{ display: "contents" }}>
          <HUDItem label="MEDIA" value="0:21h" />

          {/* TC — clickable for false colour; stopPropagation prevents background click counter */}
          <div
            onClick={(e) => { e.stopPropagation(); onTCClick(); }}
            style={{ pointerEvents: "all", cursor: "none" }}
          >
            <HUDItem label="TC" value={tc} highlight={falseColour} />
          </div>
        </span>

        {/* Mobile: PWR right */}
        <span className="hud-mobile-bottom">
          <HUDItem label="PWR" value={`${pwr}V`} />
        </span>
      </div>
    </motion.div>
  );
}

// ─── Slate — minimal BENKAUFMAN.CO ────────────────────────────────────────────
function Slate({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"hold" | "out">("hold");

  useEffect(() => {
    const tOut = setTimeout(() => setPhase("out"), 120);
    const tDone = setTimeout(() => onDone(), 420);
    return () => {
      clearTimeout(tOut);
      clearTimeout(tDone);
    };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "out" ? 0 : 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "28px",
          letterSpacing: "0.15em",
          color: "white",
          opacity: 0.9,
          userSelect: "none",
        }}
      >
        BENKAUFMAN.CO
      </span>
    </motion.div>
  );
}

// ─── False colour overlay ─────────────────────────────────────────────────────
function FalseColourOverlay({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            pointerEvents: "none",
            mixBlendMode: "color",
            background:
              "linear-gradient(to bottom, rgba(255,20,100,0.5) 0%, rgba(255,200,0,0.4) 25%, rgba(0,255,80,0.45) 50%, rgba(0,200,255,0.4) 75%, rgba(80,0,255,0.5) 100%)",
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ─── 2-pop audio ─────────────────────────────────────────────────────────────
function play2Pop() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 1000;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.005);
    gain.gain.setValueAtTime(0.3, ctx.currentTime + 0.06);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch {
    // Web Audio blocked — fail silently
  }
}

// ─── Film leader ──────────────────────────────────────────────────────────────
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23grain)'/%3E%3C/svg%3E")`;

type LeaderPhase = "flash" | "countdown" | "black" | "fadeout";

function FilmLeader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<LeaderPhase>("flash");
  const [countNum, setCountNum] = useState(8);
  const [twoPop, setTwoPop] = useState(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const add = (fn: () => void, delay: number) => {
      const t = setTimeout(fn, delay);
      timeouts.current.push(t);
    };

    // t=50: end flash, start countdown at 8
    add(() => { setPhase("countdown"); setCountNum(8); }, 50);

    // t=270,490,710,930,1150: hard-cut to 7,6,5,4,3
    [7, 6, 5, 4, 3].forEach((n, i) => {
      add(() => setCountNum(n), 50 + (i + 1) * 220);
    });

    // t=1370: cut to 2, fire 2-pop
    add(() => {
      setCountNum(2);
      play2Pop();
      setTwoPop(true);
      const t2 = setTimeout(() => setTwoPop(false), 40);
      timeouts.current.push(t2);
    }, 1370);

    // t=1590: cut to black
    add(() => setPhase("black"), 1590);

    // t=1790: start fade-out
    add(() => setPhase("fadeout"), 1790);

    // t=2090: done
    add(onDone, 2090);

    return () => timeouts.current.forEach(clearTimeout);
  }, [onDone]);

  const isFlash = phase === "flash";
  const isCountdown = phase === "countdown";
  const isBlack = phase === "black";
  const isFadeout = phase === "fadeout";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        pointerEvents: "none",
        opacity: isFadeout ? 0 : 1,
        transition: isFadeout ? "opacity 300ms ease" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Flash frame */}
      {isFlash && (
        <div style={{ position: "absolute", inset: 0, background: "#FFFFFF" }} />
      )}

      {/* Countdown frame */}
      {isCountdown && (
        <>
          {/* Full-screen background */}
          <div style={{ position: "absolute", inset: 0, background: "#0C0C0C" }} />
          {/* Crosshair horizontal */}
          <div style={{
            position: "absolute", top: "50%", left: 0, right: 0,
            height: "1px", background: "rgba(232,228,220,0.15)",
            transform: "translateY(-50%)", pointerEvents: "none",
          }} />
          {/* Crosshair vertical */}
          <div style={{
            position: "absolute", left: "50%", top: 0, bottom: 0,
            width: "1px", background: "rgba(232,228,220,0.15)",
            transform: "translateX(-50%)", pointerEvents: "none",
          }} />
          {/* 2-pop visual: brief white horizontal line */}
          {twoPop && (
            <div style={{
              position: "absolute", top: "50%", left: 0, right: 0,
              height: "2px", background: "#FFFFFF", opacity: 0.9,
              transform: "translateY(-50%)", zIndex: 2,
            }} />
          )}
          {/* Circle — in flex flow, centred by parent */}
          <div style={{
            position: "relative",
            width: "40vmin", height: "40vmin",
            borderRadius: "50%",
            border: "2px solid #E8E4DC",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            zIndex: 1,
          }}>
            <span style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "20vmin",
              lineHeight: 1,
              color: "#E8E4DC",
              textAlign: "center",
              userSelect: "none",
              position: "relative",
              top: "-0.06em",
            }}>
              {countNum}
            </span>
          </div>
          {/* Corner labels — absolute relative to root overlay */}
          <span style={{
            position: "absolute", top: "24px", left: "24px",
            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontSize: "10px", color: "rgba(232,228,220,0.4)",
            letterSpacing: "0.1em", userSelect: "none",
          }}>LFOA</span>
          <span style={{
            position: "absolute", bottom: "24px", left: "24px",
            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontSize: "10px", color: "rgba(232,228,220,0.4)",
            letterSpacing: "0.1em", userSelect: "none",
          }}>SYNC</span>
          <span style={{
            position: "absolute", bottom: "24px", right: "24px",
            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontSize: "10px", color: "rgba(232,228,220,0.4)",
            letterSpacing: "0.1em", userSelect: "none",
          }}>BK&nbsp;&nbsp;A&nbsp;&nbsp;001</span>
          {/* Grain */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.12,
            backgroundImage: GRAIN_SVG,
            backgroundRepeat: "repeat", backgroundSize: "300px 300px",
            pointerEvents: "none",
          }} />
          {/* Vignette */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
          }} />
        </>
      )}

      {/* Cut to black */}
      {(isBlack || isFadeout) && (
        <div style={{ position: "absolute", inset: 0, background: "#000000" }} />
      )}
    </div>
  );
}

// ─── Konami ───────────────────────────────────────────────────────────────────
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

function DirectorsCut({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9500,
        background: "rgba(0,0,0,0.97)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "28px",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        style={{
          fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
          fontSize: "8px",
          letterSpacing: "0.45em",
          color: "rgba(139,105,20,0.7)",
          textTransform: "uppercase",
        }}
      >
        KONAMI CODE ACTIVATED
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
        style={{
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: "clamp(56px, 9vw, 108px)",
          lineHeight: 0.9,
          letterSpacing: "0.06em",
          color: "#E8E4DC",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        Director&apos;s<br />Cut
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        style={{
          fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
          fontSize: "8px",
          letterSpacing: "0.35em",
          color: "rgba(232,228,220,0.2)",
          textTransform: "uppercase",
        }}
      >
        CLICK TO DISMISS
      </motion.div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [showSlate, setShowSlate] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [falseColour, setFalseColour] = useState(false);
  const [directorsCut, setDirectorsCut] = useState(false);
  const [filmLeader, setFilmLeader] = useState(false);
  const konamiBuffer = useRef<string[]>([]);
  const clickTimestamps = useRef<number[]>([]);
  const isLeaderPlaying = useRef(false);

  // Slate: once per session
  useEffect(() => {
    const seen = sessionStorage.getItem("slate-seen");
    if (!seen) {
      setShowSlate(true);
    } else {
      setVideoReady(true);
    }
  }, []);

  const handleSlateDone = useCallback(() => {
    sessionStorage.setItem("slate-seen", "1");
    setShowSlate(false);
    setVideoReady(true);
  }, []);

  // False colour — auto-reset after 2.1s
  const fcTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleTCClick = useCallback(() => {
    if (isLeaderPlaying.current) return;
    setFalseColour((fc) => {
      if (!fc) {
        if (fcTimer.current) clearTimeout(fcTimer.current);
        fcTimer.current = setTimeout(() => setFalseColour(false), 2100);
      }
      return !fc;
    });
  }, []);

  // Konami
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      konamiBuffer.current = [...konamiBuffer.current.slice(-9), e.key];
      if (konamiBuffer.current.join(",") === KONAMI.join(",")) {
        setDirectorsCut(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Triple-click / triple-tap → film leader
  const handleBackgroundClick = useCallback(() => {
    if (isLeaderPlaying.current) return;
    const now = Date.now();
    clickTimestamps.current = [...clickTimestamps.current, now].filter(
      (t) => now - t < 600
    );
    if (clickTimestamps.current.length >= 3) {
      clickTimestamps.current = [];
      isLeaderPlaying.current = true;
      setFilmLeader(true);
    }
  }, []);

  return (
    <main
      id="main-content"
      onClick={handleBackgroundClick}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#0C0C0C",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* ── Slate ── */}
      <AnimatePresence>{showSlate && <Slate onDone={handleSlateDone} />}</AnimatePresence>

      {/* ── Video + false-colour wrapper ── */}
      <motion.div
        initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
        animate={{ opacity: videoReady ? 1 : 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 1.4, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: 0,
          filter: falseColour
            ? "hue-rotate(90deg) saturate(4) contrast(1.4) brightness(0.9)"
            : "none",
          transition: "filter 200ms ease",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "177.778vh",
            minWidth: "100%",
            height: "56.25vw",
            minHeight: "100%",
          }}
        >
          <iframe
            src="https://player.vimeo.com/video/1057090009?background=1&autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0&dnt=1"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", pointerEvents: "none" }}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
        {/* False colour gradient overlay */}
        <FalseColourOverlay active={falseColour} />
      </motion.div>

      {/* ── Top gradient protection (nav legibility) ── */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "200px",
          background: "linear-gradient(to bottom, rgba(12,12,12,0.78) 0%, rgba(12,12,12,0.3) 65%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 8,
        }}
      />

      {/* ── Bottom gradient (hero text legibility) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(12,12,12,0.94) 0%, rgba(12,12,12,0.55) 40%, rgba(12,12,12,0.08) 70%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />

      {/* ── Framelines — 1px markers at 10vh / 10vh-from-bottom ── */}
      <div className="frameline frameline-top" />
      <div className="frameline frameline-bottom" />

      {/* ── ARRI HUD ── */}
      <ArriHUD visible={videoReady} falseColour={falseColour} onTCClick={handleTCClick} />

      {/* ── Hero text (between framelines) ── */}
      <div
        style={{
          position: "absolute",
          bottom: "calc(10vh + 72px)",
          left: "56px",
          right: "56px",
          zIndex: 15,
        }}
      >
        <motion.h1
          initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 36 }}
          animate={{ opacity: videoReady ? 1 : 0, y: videoReady ? 0 : 36 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.0, ease: "easeOut", delay: shouldReduceMotion ? 0 : 0.6 }}
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: "8vw",
            lineHeight: 0.9,
            letterSpacing: "0.04em",
            color: "#E8E4DC",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Ben Kaufman
        </motion.h1>
      </div>

      {/* ── Director's Cut overlay (Konami) ── */}
      <AnimatePresence>
        {directorsCut && <DirectorsCut onClose={() => setDirectorsCut(false)} />}
      </AnimatePresence>

      {/* ── Film leader (triple-click) ── */}
      {filmLeader && (
        <FilmLeader onDone={() => {
          setFilmLeader(false);
          isLeaderPlaying.current = false;
          clickTimestamps.current = [];
        }} />
      )}

      <style>{`
        .frameline {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255,255,255,0.25);
          pointer-events: none;
          z-index: 90;
        }
        .frameline-top { top: 10vh; }
        .frameline-bottom { bottom: 10vh; }
        /* Desktop shows all HUD items; mobile shows only the simplified ones */
        .hud-mobile-only { display: none; }
        .hud-mobile-bottom { display: none; }
        @media (max-width: 767px) {
          .hud-desktop-only { display: none !important; }
          .hud-mobile-only { display: inline; }
          .hud-mobile-bottom { display: inline; }
        }
      `}</style>
    </main>
  );
}
