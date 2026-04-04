"use client";

import { motion } from "framer-motion";
import { useState, useRef, useCallback } from "react";

const bio =
  "With over 16 years in the industry, I've produced commercials, content, and stills for some of the world's most recognised brands, including John Lewis, Chanel, Dior, Dyson, Aston Martin, Asahi, World Rugby, JBL, and EE. As an Executive Producer, I've led high-profile campaigns across the UK, Europe, Asia, South America, and Africa, working at the intersection of production companies and agencies. Alongside my work in film, I'm a self-taught photographer, exhibited at Cannes Lions and selected by acclaimed British photographer Rankin.";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ─│┼▓█▒░01";
const SOURCE = ["BEN", "KAUFMAN"];
const TARGET = ["EXECUTIVE", "PRODUCER"];

// ─── Scramble name component ───────────────────────────────────────────────
function ScrambleName() {
  const [display, setDisplay] = useState<string[]>(SOURCE);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAnimating = useRef(false);

  const scrambleTo = useCallback(
    (from: string[], to: string[], onDone?: () => void) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      let step = 0;
      const totalSteps = 30;

      const tick = () => {
        setDisplay(
          to.map((targetLine, li) => {
            const maxLen = Math.max(targetLine.length, from[li]?.length || 0);
            // Output length grows/shrinks toward target length over the animation
            const progress = Math.min(1, step / (totalSteps * 0.7));
            const fromLen = from[li]?.length || 0;
            const currentLen = Math.round(fromLen + (targetLine.length - fromLen) * progress);
            const outLen = Math.max(fromLen, Math.min(targetLine.length, currentLen));
            return Array.from({ length: outLen }, (_, ci) => {
              const threshold = (ci / maxLen) * totalSteps * 0.6 + li * 3;
              if (step >= threshold && ci < targetLine.length) return targetLine[ci];
              if (ci >= targetLine.length) return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
              return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            }).join("");
          })
        );
        step++;
        if (step <= totalSteps) {
          timerRef.current = setTimeout(tick, 38);
        } else {
          setDisplay(to);
          onDone?.();
        }
      };
      tick();
    },
    []
  );

  const runScramble = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    scrambleTo(SOURCE, TARGET, () => {
      timerRef.current = setTimeout(() => {
        scrambleTo(TARGET, SOURCE, () => {
          isAnimating.current = false;
        });
      }, 300);
    });
  }, [scrambleTo]);

  const handleMouseEnter = useCallback(() => {
    if (isAnimating.current) return;
    hoverTimerRef.current = setTimeout(runScramble, 3000);
  }, [runScramble]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
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
  return (
    <main
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
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
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
          style={{
            padding: "80px",
            paddingTop: "100px",
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
