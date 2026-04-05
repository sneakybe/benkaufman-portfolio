"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";

const bio =
  "With over 16 years in the industry, I've produced commercials, content, and stills for some of the world's most recognised brands, including John Lewis, Chanel, Dior, Dyson, Aston Martin, Asahi, World Rugby, JBL, and EE. As an Executive Producer, I've led high-profile campaigns across the UK, Europe, Asia, South America, and Africa, working at the intersection of production companies and agencies. Alongside my work in film, I'm a self-taught photographer, exhibited at Cannes Lions and selected by acclaimed British photographer Rankin.";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NAME_BK = ["BEN", "KAUFMAN"];
const NAME_EP = ["EXECUTIVE", "PRODUCER"];

// ─── Scramble name component ───────────────────────────────────────────────
function ScrambleName() {
  const [display, setDisplay] = useState<string[]>(NAME_BK);
  const resolvedState = useRef<"bk" | "ep">("bk");
  const rafRef = useRef<number | null>(null);

  const scrambleTo = useCallback((from: string[], to: string[]) => {
    // Cancel any running animation
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const totalDuration = 800;
    const randomPhase = 400;
    const resolvePhase = 400;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;

      const lines = to.map((targetLine, li) => {
        const fromLine = from[li] ?? "";
        const fromLen = fromLine.length;
        const toLen = targetLine.length;

        if (elapsed < randomPhase) {
          // Phase 1: interpolate length, randomise non-space chars
          const progress = elapsed / randomPhase;
          const currentLen = Math.round(fromLen + (toLen - fromLen) * progress);
          return Array.from({ length: currentLen }, (_, ci) => {
            const targetCh = targetLine[ci];
            if (targetCh === " ") return " ";
            return SCRAMBLE_CHARS[Math.floor(Math.random() * 26)];
          }).join("");
        } else {
          // Phase 2: lock chars left-to-right
          const resolveProgress = (elapsed - randomPhase) / resolvePhase;
          return Array.from({ length: toLen }, (_, ci) => {
            const ch = targetLine[ci];
            if (ch === " ") return " ";
            const lockThreshold = ci / toLen;
            return resolveProgress >= lockThreshold
              ? ch
              : SCRAMBLE_CHARS[Math.floor(Math.random() * 26)];
          }).join("");
        }
      });

      setDisplay(lines);

      if (elapsed < totalDuration) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(to);
        resolvedState.current = to === NAME_EP ? "ep" : "bk";
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (resolvedState.current === "bk") {
      scrambleTo(NAME_BK, NAME_EP);
    }
  }, [scrambleTo]);

  const handleMouseLeave = useCallback(() => {
    if (resolvedState.current === "ep") {
      scrambleTo(NAME_EP, NAME_BK);
    } else {
      // Still animating toward EP — reverse mid-flight
      scrambleTo(display, NAME_BK);
    }
  }, [scrambleTo, display]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <h1
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
        fontWeight: 300,
        fontSize: "clamp(32px, 4vw, 64px)",
        lineHeight: 0.92,
        letterSpacing: "0.02em",
        color: "#E8E4DC",
        textTransform: "uppercase",
        marginBottom: "20px",
        cursor: "default",
      }}
    >
      {display[0]}
      <br />
      {display[1]}
    </h1>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <main
      id="main-content"
      style={{
        background: "#0C0C0C",
        minHeight: "100vh",
        display: "flex",
        alignItems: "stretch",
      }}
      className="about-main"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          width: "100%",
          minHeight: "100vh",
        }}
        className="about-grid"
      >
        {/* Left — full-bleed headshot */}
        <motion.div
          initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.1, ease: "easeOut" }}
          data-cursor="headshot"
          className="about-headshot"
          style={{
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ben-kaufman.jpg"
            alt="Ben Kaufman"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
          {/* Subtle right-edge vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, transparent 70%, rgba(12,12,12,0.4) 100%)",
              pointerEvents: "none",
            }}
          />
        </motion.div>

        {/* Right — bio content */}
        <motion.div
          initial={{ opacity: shouldReduceMotion ? 1 : 0, x: shouldReduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: "easeOut", delay: shouldReduceMotion ? 0 : 0.3 }}
          style={{
            padding: "80px",
            paddingTop: "140px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "44px",
            minHeight: "100vh",
            overflowY: "auto",
          }}
          className="about-content"
        >
          {/* Name — scrambles on hover after 3s */}
          <ScrambleName />

          {/* Thin gold divider */}
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "#8B6914",
              opacity: 0.6,
            }}
          />

          {/* Bio */}
          <p
            style={{
              fontFamily:
                "var(--font-dm-sans), 'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "16px",
              lineHeight: 1.8,
              color: "#E8E4DC",
              opacity: 0.75,
              maxWidth: "480px",
              fontWeight: 300,
            }}
          >
            {bio}
          </p>

          {/* Contact */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "9px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#666666",
                marginBottom: "4px",
              }}
            >
              Contact
            </p>
            <a
              href="mailto:hello@benkaufman.co"
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "13px",
                letterSpacing: "0.05em",
                color: "#E8E4DC",
                textDecoration: "none",
                opacity: 0.7,
                transition: "opacity 400ms ease",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.opacity = "1")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.opacity = "0.7")
              }
            >
              hello@benkaufman.co
            </a>
            <a
              href="https://www.benkaufmanphotography.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "13px",
                letterSpacing: "0.05em",
                color: "#E8E4DC",
                textDecoration: "none",
                opacity: 0.7,
                transition: "opacity 400ms ease",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.opacity = "1")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.opacity = "0.7")
              }
            >
              www.benkaufmanphotography.com
            </a>

            {/* Selected work footnote — inside contact section, 48px below last link */}
            <p
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "9px",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(232, 228, 220, 0.25)",
                marginTop: "36px",
              }}
            >
              SELECTED WORK&nbsp;&nbsp;2010 — 2026
            </p>
          </div>
        </motion.div>
      </div>

      <style>{`
        .about-headshot { height: 100vh; }
        @media (max-width: 768px) {
          .about-main { overflow-y: auto; }
          .about-grid {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
          .about-headshot {
            height: 60vh !important;
            min-height: 0 !important;
          }
          .about-content {
            padding: 48px 24px 60px !important;
            height: auto !important;
            overflow-y: visible !important;
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </main>
  );
}
