"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Player from "@vimeo/player";

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
        fontFamily: "var(--font-data)",
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
        fontFamily: "var(--font-data)",
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
          fontFamily: "var(--font-data)",
          fontSize: "9px",
          fontWeight: 400,
          color: highlight ? "rgba(255,200,0,0.9)" : "rgba(255,255,255,0.6)",
          letterSpacing: "0.08em",
          transition: "color 300ms ease",
          userSelect: "none",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-data)",
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

// ─── IRIS aspect ratio helpers ───────────────────────────────────────────────
const IRIS_RATIOS = ["16:9", "2.39:1", "1.85:1"] as const;
type IrisRatio = (typeof IRIS_RATIOS)[number];

function getClipPath(ratio: IrisRatio, containerW: number, containerH: number): string {
  if (ratio === "16:9") return "inset(0% 0%)";
  const targetAR = ratio === "2.39:1" ? 2.39 : 1.85;
  const contentH = containerW / targetAR;
  if (contentH <= containerH) {
    // Letterbox: symmetric bars top + bottom
    const barPct = (((containerH - contentH) / 2 / containerH) * 100).toFixed(3);
    return `inset(${barPct}% 0px round 0px)`;
  } else {
    // Pillarbox: symmetric bars left + right (e.g. 1.85:1 on wide viewport)
    const contentW = containerH * targetAR;
    const barPct = (((containerW - contentW) / 2 / containerW) * 100).toFixed(3);
    return `inset(0px ${barPct}% round 0px)`;
  }
}

// ─── ARRI Alexa HUD ──────────────────────────────────────────────────────────
// TC starts at 01:07:23:00 — a realistic mid-shoot position
const TC_START_FRAMES =
  1 * 3600 * FPS + // 1 hour
  7 * 60 * FPS +   // 7 minutes
  23 * FPS;        // 23 seconds

function ArriHUD({
  visible,
  irisRatio,
  onIrisClick,
}: {
  visible: boolean;
  irisRatio: IrisRatio;
  onIrisClick: (e: React.MouseEvent) => void;
}) {
  const [frames, setFrames] = useState(TC_START_FRAMES);
  const [isRec, setIsRec] = useState(false);
  const [stbyPulse, setStbyPulse] = useState(1);
  const [pwr, setPwr] = useState(16.8);
  const pwrRef = useRef(16.8);
  const [shutterDisplay, setShutterDisplay] = useState(172.8);
  const shutterRef = useRef(172.8);
  const [irisHover, setIrisHover] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const irisLabel =
    irisRatio === "2.39:1" ? "T 2.39  SCOPE" :
    irisRatio === "1.85:1" ? "T 1.85  FLAT"  :
    "T 2.8  0/10";

  // Live timecode via RAF. A camera keeps rolling, but there is no reason to
  // re-render 24 times a second into a tab nobody is looking at.
  useEffect(() => {
    let lastTime = performance.now();
    let accumulated = 0;
    let raf = 0;

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

    const start = () => {
      if (raf) return;
      lastTime = performance.now();
      accumulated = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
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
      initial={{ opacity: shouldReduceMotion ? 0.82 : 0 }}
      animate={{ opacity: visible ? 0.82 : 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.9, delay: shouldReduceMotion ? 0 : 0.5 }}
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
          {/* Desktop: all items */}
          <span className="hud-desktop-only" style={{ display: "contents" }}>
            <HUDItem label="FPS" value="24.000" />
            <HUDItem label="SHUTTER" value={String(shutterDisplay)} />
            {/* The one readout that is also a control: matting the frame is a
                real film-craft gesture, so it is a real button. */}
            <button
              onClick={onIrisClick}
              onMouseEnter={() => setIrisHover(true)}
              onMouseLeave={() => setIrisHover(false)}
              onFocus={() => setIrisHover(true)}
              onBlur={() => setIrisHover(false)}
              aria-label={`Aspect ratio: ${irisRatio}. Activate to change.`}
              data-cursor="nav"
              style={{
                pointerEvents: "all",
                background: "none",
                border: "none",
                padding: 0,
                font: "inherit",
                textAlign: "left",
                opacity: irisHover ? 1 : 0.7,
                transition: "opacity 200ms ease",
              }}
            >
              <HUDItem label="IRIS" value={irisLabel} highlight={irisRatio !== "16:9"} />
            </button>
            {irisRatio !== "16:9" && (
              <HUDItem label="AR" value={irisRatio} highlight />
            )}
            <HUDItem label="EI" value="800" />
            <HUDItem label="ND" value="0.6" />
            <HUDItem label="WB" value="5600K +0.0" />
          </span>

          {/* Mobile: FPS only */}
          <span className="hud-mobile-only">
            <HUDItem label="FPS" value="24.000" />
          </span>
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
          <HUDItem label="REEL" value="A_0004  C001" />
        </span>

        {/* Mobile bottom bar: TC left, REC centre, PWR right */}
        <span className="hud-mobile-bottom">
          <HUDItem label="TC" value={tc} />
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
              fontFamily: "var(--font-data)",
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

          <HUDItem label="TC" value={tc} />
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
  const shouldReduceMotion = useReducedMotion();
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
      transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeOut" }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-serif)",
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

// ─── 2-pop audio — one shared context, resumed per screening ─────────────────
let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!sharedAudioCtx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === "suspended") void sharedAudioCtx.resume();
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

function play2Pop() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
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

  // Escape or a click ends the leader immediately. A 2s sequence a visitor
  // triggered by accident must always be interruptible.
  useEffect(() => {
    const abort = () => onDone();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") abort();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", abort);
    window.addEventListener("touchstart", abort);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", abort);
      window.removeEventListener("touchstart", abort);
    };
  }, [onDone]);

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
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: "clamp(4rem, 20vmin, 12rem)",
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
            fontFamily: "var(--font-data)",
            fontSize: "10px", color: "rgba(232,228,220,0.4)",
            letterSpacing: "0.1em", userSelect: "none",
          }}>LFOA</span>
          <span style={{
            position: "absolute", bottom: "24px", left: "24px",
            fontFamily: "var(--font-data)",
            fontSize: "10px", color: "rgba(232,228,220,0.4)",
            letterSpacing: "0.1em", userSelect: "none",
          }}>SYNC</span>
          <span style={{
            position: "absolute", bottom: "24px", right: "24px",
            fontFamily: "var(--font-data)",
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
        <div style={{ position: "absolute", inset: 0, background: "#0a0a0a" }} />
      )}
    </div>
  );
}

// ─── Konami ───────────────────────────────────────────────────────────────────
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

function DirectorsCut({ onClose }: { onClose: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  // It can only be opened from the keyboard, so it must be closable from the
  // keyboard. Focus moves in, is held, and is handed back on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Director's Cut"
      initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: shouldReduceMotion ? 1 : 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.9 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9500,
        background: "rgba(10,10,10,0.97)",
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
        initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: shouldReduceMotion ? 0 : 0.7 }}
        style={{
          fontFamily: "var(--font-data)",
          fontSize: "10px",
          letterSpacing: "0.45em",
          color: "rgba(139,105,20,0.7)",
          textTransform: "uppercase",
        }}
      >
        REEL 01 — ALT TAKE
      </motion.div>
      <motion.div
        initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.5, duration: shouldReduceMotion ? 0 : 0.9, ease: "easeOut" }}
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 300,
          fontSize: "clamp(2rem, 4vw, 4rem)",
          lineHeight: 0.9,
          letterSpacing: "0.06em",
          color: "#E8E4DC",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        Director&apos;s<br />Cut
      </motion.div>
      <motion.button
        ref={closeRef}
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldReduceMotion ? 0 : 1.1, duration: shouldReduceMotion ? 0 : 0.6 }}
        style={{
          background: "none",
          border: "none",
          padding: "8px",
          fontFamily: "var(--font-data)",
          fontSize: "10px",
          letterSpacing: "0.35em",
          color: "rgba(232,228,220,0.45)",
          textTransform: "uppercase",
        }}
      >
        Esc to cut
      </motion.button>
    </motion.div>
  );
}

// ─── QUIET ON SET idle overlay ────────────────────────────────────────────────
function QuietOnSet() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      className="quiet-overlay"
      aria-hidden="true"
      initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: shouldReduceMotion ? 0 : 0.3 } }}
      transition={{ duration: shouldReduceMotion ? 0 : 1.2 }}
      style={{
        position: "fixed",
        inset: 0,
        // Below the header (z-100): the card quiets the reel, it never covers
        // the only route to the work.
        zIndex: 95,
        background: "rgba(10,10,10,0.92)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "28px",
        pointerEvents: "none",
      }}
    >
      <motion.div
        initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.5, duration: shouldReduceMotion ? 0 : 0.9, ease: "easeOut" }}
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 300,
          fontSize: "clamp(2rem, 4vw, 4rem)",
          letterSpacing: "0.12em",
          color: "#E8E4DC",
          textTransform: "uppercase",
          userSelect: "none",
        }}
      >
        Quiet on Set
      </motion.div>
      <motion.div
        initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldReduceMotion ? 0 : 1.1, duration: shouldReduceMotion ? 0 : 0.6 }}
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "10px",
          letterSpacing: "0.4em",
          color: "#E8E4DC",
          textTransform: "uppercase",
          userSelect: "none",
          animation: "quietPulse 2.4s ease-in-out infinite",
        }}
      >
        [ MOVE TO ROLL ]
      </motion.div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [showSlate, setShowSlate] = useState(false);
  const [slateDone, setSlateDone] = useState(false);
  // "cueing" until the player reports; "stalled" means the poster carries the
  // page. Both are legitimate states — neither is a blank screen.
  const [reelState, setReelState] = useState<"cueing" | "playing" | "stalled">("cueing");
  const [directorsCut, setDirectorsCut] = useState(false);
  const [filmLeader, setFilmLeader] = useState(false);
  const [idleActive, setIdleActive] = useState(false);
  const [irisRatio, setIrisRatio] = useState<IrisRatio>("16:9");
  const konamiBuffer = useRef<string[]>([]);
  const clickTimestamps = useRef<number[]>([]);
  const isLeaderPlaying = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // The page is dressed once the slate is out of the way and the reel has
  // reported one way or the other.
  const videoReady = slateDone && reelState !== "cueing";

  // Slate: once per session. Storage throws in Safari Private Mode, and a
  // blocked read must never be the reason the page stays black.
  useEffect(() => {
    let seen: string | null = null;
    try {
      seen = sessionStorage.getItem("slate-seen");
    } catch {
      seen = null;
    }
    setShowSlate(!seen);
    if (seen) setSlateDone(true);
  }, []);

  const handleSlateDone = useCallback(() => {
    try {
      sessionStorage.setItem("slate-seen", "1");
    } catch {
      // non-fatal — the slate simply plays again next time
    }
    setShowSlate(false);
    setSlateDone(true);
  }, []);

  // ── The reel reports for itself ────────────────────────────────────────────
  // The picture is revealed when the player says it is running, not when a
  // timer says it should be. If it never reports — blocked embed, refused
  // autoplay, dead network — the poster frame stands in and the page is
  // never an empty black rectangle.
  useEffect(() => {
    const el = iframeRef.current;
    if (!el) return;

    let settled = false;
    let player: Player | null = null;
    const settle = (state: "playing" | "stalled") => {
      if (settled) return;
      settled = true;
      setReelState(state);
    };

    try {
      player = new Player(el);
      player.on("play", () => settle("playing"));
      player.on("playing", () => settle("playing"));
      player.on("bufferend", () => settle("playing"));
      player.ready().then(
        () => { player?.play().catch(() => settle("stalled")); },
        () => settle("stalled")
      );
    } catch {
      settle("stalled");
    }

    const fallback = setTimeout(() => settle("stalled"), 4000);
    return () => {
      clearTimeout(fallback);
      try {
        player?.off("play");
        player?.off("playing");
        player?.off("bufferend");
      } catch {
        // player already torn down
      }
    };
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

  // Idle overlay — 150s inactivity, desktop only (CSS hides on mobile).
  // A tab parked deliberately is a good sign, so returning to the tab counts
  // as activity and resets the clock rather than landing on the card.
  const resetIdle = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setIdleActive(false);
    idleTimerRef.current = setTimeout(() => setIdleActive(true), 150000);
  }, []);

  useEffect(() => {
    resetIdle();
    const events = ["mousemove", "mousedown", "keydown", "touchstart"] as const;
    events.forEach((ev) => window.addEventListener(ev, resetIdle, { passive: true }));
    const onVisibility = () => { if (!document.hidden) resetIdle(); };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", resetIdle);
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetIdle));
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", resetIdle);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdle]);

  // IRIS ratio click
  const handleIrisClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIrisRatio((r) => {
      const idx = IRIS_RATIOS.indexOf(r);
      return IRIS_RATIOS[(idx + 1) % IRIS_RATIOS.length];
    });
  }, []);

  // IRIS clip-path — direct DOM mutation (avoids Framer Motion transition conflicts)
  useEffect(() => {
    const el = videoWrapperRef.current;
    if (!el) return;
    el.style.overflow = "hidden";
    // Animated on ratio change
    el.style.transition = "clip-path 600ms ease";
    const { width, height } = el.getBoundingClientRect();
    el.style.clipPath = getClipPath(irisRatio, width, height);
    // Resize: instant update, no clip-path transition
    const observer = new ResizeObserver(() => {
      el.style.transition = "none";
      const { width: w, height: h } = el.getBoundingClientRect();
      el.style.clipPath = getClipPath(irisRatio, w, h);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [irisRatio]);

  // Triple-click / triple-tap → film leader. It only listens on the picture
  // itself: clicking the HUD, the name or the route to the work must never
  // start a two-second sequence nobody asked for. Reduced motion opts out.
  const handleReelClick = useCallback((e: React.MouseEvent) => {
    if (shouldReduceMotion || isLeaderPlaying.current) return;
    if ((e.target as HTMLElement).closest("a, button")) return;
    const now = Date.now();
    clickTimestamps.current = [...clickTimestamps.current, now].filter(
      (t) => now - t < 600
    );
    if (clickTimestamps.current.length >= 3) {
      clickTimestamps.current = [];
      isLeaderPlaying.current = true;
      setFilmLeader(true);
    }
  }, [shouldReduceMotion]);

  return (
    <main
      id="main-content"
      style={{
        position: "relative",
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        background: "#0C0C0C",
      }}
    >
      {/* ── Slate ── */}
      <AnimatePresence>{showSlate && <Slate onDone={handleSlateDone} />}</AnimatePresence>

      {/* ── The picture, and everything that belongs to it ──
           The scrims and framelines live inside the matted wrapper, so when
           IRIS mattes to 2.39:1 the bars are actual black bars rather than a
           gradient smudge running past the edge of the frame. */}
      <motion.div
        ref={videoWrapperRef}
        onClick={handleReelClick}
        initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
        animate={{ opacity: videoReady ? 1 : 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 1.4, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          // The still stands in whenever the player can't: blocked embed,
          // refused autoplay, slow network. The page is never empty.
          backgroundImage: "url(/images/reel-poster.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
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
            opacity: reelState === "playing" ? 1 : 0,
            transition: "opacity 900ms ease",
          }}
        >
          <iframe
            ref={iframeRef}
            src="https://player.vimeo.com/video/1057090009?background=1&autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0&dnt=1"
            title="Ben Kaufman — showreel"
            tabIndex={-1}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", pointerEvents: "none" }}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>

        {/* Top scrim — nav legibility */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "200px",
            background: "linear-gradient(to bottom, rgba(12,12,12,0.78) 0%, rgba(12,12,12,0.3) 65%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 8,
          }}
        />

        {/* Bottom scrim — hero legibility */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(12,12,12,0.94) 0%, rgba(12,12,12,0.55) 40%, rgba(12,12,12,0.08) 70%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />

        {/* Framelines — 1px markers at 10vh / 10vh-from-bottom */}
        <div className="frameline frameline-top" />
        <div className="frameline frameline-bottom" />
      </motion.div>

      {/* ── ARRI HUD ── */}
      <ArriHUD
        visible={videoReady}
        irisRatio={irisRatio}
        onIrisClick={handleIrisClick}
      />

      {/* ── Hero text (between framelines) ── */}
      <div
        className="hero-block"
        style={{
          position: "absolute",
          bottom: "calc(10vh + 72px)",
          left: "56px",
          right: "56px",
          zIndex: 15,
        }}
      >
        <motion.h1
          className="hero-name"
          initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 36 }}
          animate={{ opacity: videoReady ? 1 : 0, y: videoReady ? 0 : 36 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.0, ease: "easeOut", delay: shouldReduceMotion ? 0 : 0.6 }}
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            // The rem floor keeps the name the largest thing on the page at
            // 320px and under zoom, where a bare 8vw shrank below the nav.
            fontSize: "clamp(2.75rem, 8vw, 7.25rem)",
            lineHeight: 0.9,
            letterSpacing: "0.04em",
            color: "#E8E4DC",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Ben Kaufman
        </motion.h1>

        {/* The way in. A slate card names the reel and what follows it; this
            page had no route to the work at all until it did. */}
        <motion.div
          initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
          animate={{ opacity: videoReady ? 1 : 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: "easeOut", delay: shouldReduceMotion ? 0 : 1.2 }}
          style={{ marginTop: "18px", display: "flex", alignItems: "baseline", gap: "14px" }}
        >
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "10px",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "rgba(232,228,220,0.55)",
            }}
          >
            Executive Producer
          </span>
          <span aria-hidden="true" style={{ width: "18px", height: "1px", background: "#8B6914", opacity: 0.7 }} />
          <Link
            href="/commercials"
            data-cursor="nav"
            className="hero-route"
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "11px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#E8E4DC",
              textDecoration: "none",
              opacity: 0.85,
              transition: "opacity 400ms ease",
            }}
          >
            Selected work — 29 films
          </Link>
        </motion.div>
      </div>

      {/* ── Quiet on Set idle overlay ── */}
      <AnimatePresence>
        {idleActive && <QuietOnSet />}
      </AnimatePresence>

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
        /* On a phone the name is too wide to hold one line at a size that
           still outranks the navigation, so it breaks and stays the largest
           thing on the screen. */
        @media (max-width: 640px) {
          .hero-block { left: 24px !important; right: 24px !important; }
          .hero-name { white-space: normal !important; line-height: 0.95 !important; }
        }
        .hero-route:hover, .hero-route:focus-visible { opacity: 1 !important; }
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
