"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
          fontSize: "10px",
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
          fontSize: "13px",
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
function ArriHUD({
  visible,
  falseColour,
  onTCClick,
}: {
  visible: boolean;
  falseColour: boolean;
  onTCClick: () => void;
}) {
  const [frames, setFrames] = useState(0);
  const [isRec, setIsRec] = useState(false);
  const [stbyPulse, setStbyPulse] = useState(1);
  // PWR drains from 16.8V → 14.2V over 20 min (1200s)
  const [pwr, setPwr] = useState(16.8);
  const startRef = useRef(Date.now());

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

  // PWR drain every 30s
  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const drained = (elapsed / 1200) * (16.8 - 14.2);
      setPwr(Math.max(14.2, parseFloat((16.8 - drained).toFixed(1))));
    }, 30000);
    return () => clearInterval(id);
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
      {/* ── TOP BAR — space-between mirrors bottom bar; FALSE COLOUR pulled out of flex ── */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: 0,
          right: 0,
          padding: "0 24px",
        }}
      >
        {/* position: relative so FALSE COLOUR absolute is contained here */}
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <HUDItem label="FPS" value="24.000" />
          <HUDItem label="SHUTTER" value="172.8" />
          <HUDItem label="IRIS" value="T 2.8  0/10" />
          <HUDItem label="EI" value="800" />
          <HUDItem label="ND" value="0.6" />
          <HUDItem label="WB" value="5600K +0.0" />

          {/* FALSE COLOUR — out of flex flow entirely, midpoint between top bar and frameline */}
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

      {/* ── TOP-LEFT CORNER pills — Group 1: EVF header + LOG pill ── */}
      <div
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

      {/* ── TOP-LEFT CORNER pills — Group 2: CAM header + 4K/RAW/K447 pills ── */}
      <div
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

      {/* ── BOTTOM BAR ── */}
      <div
        style={{
          position: "absolute",
          bottom: "14px",
          left: 0,
          right: 0,
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <HUDItem label="FCL" value="47.0mm" />
        <HUDItem label="PWR" value={`${pwr}V`} />
        <HUDItem label="" value="A_0004  C001" />

        {/* STBY / REC indicator */}
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

        <HUDItem label="MEDIA" value="0:21h" />

        {/* TC — clickable for false colour */}
        <div
          onClick={onTCClick}
          style={{ pointerEvents: "all", cursor: "none" }}
        >
          <HUDItem
            label="TC"
            value={tc}
            highlight={falseColour}
          />
        </div>
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
  const [showSlate, setShowSlate] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [falseColour, setFalseColour] = useState(false);
  const [directorsCut, setDirectorsCut] = useState(false);
  const konamiBuffer = useRef<string[]>([]);

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

  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#0C0C0C",
      }}
    >
      {/* ── Slate ── */}
      <AnimatePresence>{showSlate && <Slate onDone={handleSlateDone} />}</AnimatePresence>

      {/* ── Video + false-colour wrapper ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: videoReady ? 1 : 0 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
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
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: videoReady ? 1 : 0, y: videoReady ? 0 : 36 }}
          transition={{ duration: 1.0, ease: "easeOut", delay: 0.6 }}
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
        @media (max-width: 767px) {
          .frameline { display: none; }
          .arri-hud { display: none; }
        }
      `}</style>
    </main>
  );
}
