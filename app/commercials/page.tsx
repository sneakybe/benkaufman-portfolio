"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface Project {
  title: string;
  client: string;
  vimeoId: string;
  vimeoHash?: string;
}

const projects: Project[] = [
  { title: "Director's Cut", client: "Jet2", vimeoId: "1165178309" },
  { title: "Director's Cut", client: "Womens Rugby World Cup", vimeoId: "1030119809" },
  { title: "Father's Share", client: "Allan Gray", vimeoId: "269173359" },
  { title: "Restylane Shaype", client: "Galderma", vimeoId: "1017982117" },
  { title: "Where Now Meets Next", client: "FedEx", vimeoId: "606399981" },
  { title: "Who I Save For", client: "Coventry Building Society", vimeoId: "551871431" },
  { title: "Inner Piece", client: "Chicken Licken", vimeoId: "230904809" },
  { title: "Corrale", client: "Dyson", vimeoId: "430375216" },
  { title: "This is Social Media", client: "Young Health Movement", vimeoId: "295231887" },
  { title: "Hibernation", client: "John Lewis", vimeoId: "377089690" },
  { title: "Recital", client: "News24 Edge", vimeoId: "230907614" },
  { title: "3 Pieces for Durango", client: "Chicken Licken", vimeoId: "286142670" },
  { title: "Brian Cox", client: "People of Science", vimeoId: "362571461" },
  { title: "Chennis", client: "Bioplus", vimeoId: "230949569" },
  { title: "Graduation", client: "Cadbury 5Star", vimeoId: "230915896" },
  { title: "Still a Beer", client: "Castle Free", vimeoId: "242975770" },
  { title: "Afronaut", client: "Chicken Licken", vimeoId: "230913663" },
  { title: "The Exes", client: "Richelieu", vimeoId: "230912446" },
  { title: "2014 FIFA World Cup", client: "Supersport", vimeoId: "230925276" },
  { title: "Epic Eric", client: "Cell C", vimeoId: "230922655" },
  { title: "Donkey", client: "Savana Loco", vimeoId: "243103340" },
  { title: "People's Champion", client: "Cell C", vimeoId: "231510197" },
  { title: "Pool", client: "Dairy Gives You Go", vimeoId: "230920298" },
  { title: "21st", client: "News24 Edge", vimeoId: "230974524" },
  { title: "Mariachi", client: "Savanna Loco", vimeoId: "230918403" },
  { title: "Fleet Management", client: "Cartrack", vimeoId: "231509360" },
  { title: "Lunch", client: "The Walking Dead", vimeoId: "230971144" },
  { title: "Baby", client: "Vodacom", vimeoId: "230973845" },
];

function GridItem({
  project,
  index,
  thumbnail,
  vimeoTitle,
  onClick,
  spanFull,
}: {
  project: Project;
  index: number;
  thumbnail: string | undefined;
  vimeoTitle: string | undefined;
  onClick: () => void;
  spanFull?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const frameNum = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut", delay: shouldReduceMotion ? 0 : index * 0.04 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="play"
      style={{
        position: "relative",
        aspectRatio: "16 / 9",
        overflow: "hidden",
        cursor: "none",
        background: "#111111",
        gridColumn: spanFull ? "1 / -1" : undefined,
      }}
    >
      {thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnail}
          alt={`${project.client} – ${project.title}`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.03)" : "scale(1)",
            transition: "transform 400ms ease",
          }}
        />
      )}

      {/* Hover overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(12,12,12,0.92) 0%, rgba(12,12,12,0.4) 50%, transparent 100%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 400ms ease",
          pointerEvents: "none",
        }}
      />

      {/* Text — slides up on hover */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "28px 24px",
          transform: hovered ? "translateY(0)" : "translateY(12px)",
          opacity: hovered ? 1 : 0,
          transition: "transform 500ms ease, opacity 400ms ease",
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "9px",
            letterSpacing: "0.3em",
            color: "#8B6914",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          {project.client}
        </p>
        <h2
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(20px, 2.5vw, 28px)",
            lineHeight: 1.1,
            color: "#E8E4DC",
            letterSpacing: "0.02em",
          }}
        >
          {vimeoTitle ?? project.title}
        </h2>
      </div>

      {/* Frame number */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "12px",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: "9px",
          letterSpacing: "0.2em",
          color: "#E8E4DC",
          opacity: 0.4,
          textTransform: "uppercase",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {frameNum}
      </div>
    </motion.div>
  );
}

// ─── Projector hum ────────────────────────────────────────────────────────────
function playProjectorHum() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioCtx = new AudioCtx();

    const bufferSize = Math.floor(audioCtx.sampleRate * 1.8);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = false;
    source.playbackRate.setValueAtTime(0.6, audioCtx.currentTime);
    source.playbackRate.linearRampToValueAtTime(1.0, audioCtx.currentTime + 0.25);

    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    filter.Q.value = 0.8;

    const gainNode = audioCtx.createGain();
    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.04, now + 0.12);
    gainNode.gain.setValueAtTime(0.04, now + 0.30);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.60);

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    source.start(now);
    source.stop(now + 1.8);
  } catch {
    // Web Audio blocked — fail silently
  }
}

function Lightbox({
  project,
  description,
  onClose,
}: {
  project: Project;
  description: string;
  onClose: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [creditsOpen, setCreditsOpen] = useState(false);
  // Warmup state: "gate" → "flicker" → "locked"
  const [warmup, setWarmup] = useState<"gate" | "flicker" | "locked">(
    shouldReduceMotion ? "locked" : "gate"
  );
  // gateFlashOpacity: null = div removed, 0 = transparent, 0.9 = visible
  const [gateFlashOpacity, setGateFlashOpacity] = useState<number | null>(
    shouldReduceMotion ? null : 0.9
  );
  const [flickerClass, setFlickerClass] = useState("");

  // Warmup sequence on mount
  useEffect(() => {
    if (shouldReduceMotion) return;

    playProjectorHum();

    // Gate flash: on(0ms) → off(40ms) → on(110ms) → off(150ms) → remove div
    const t1 = setTimeout(() => setGateFlashOpacity(0), 40);
    const t2 = setTimeout(() => setGateFlashOpacity(0.9), 110);
    const t3 = setTimeout(() => setGateFlashOpacity(0), 150);
    const t4 = setTimeout(() => setGateFlashOpacity(null), 160);

    // Flicker phase starts at 200ms
    const t5 = setTimeout(() => {
      setWarmup("flicker");
      setFlickerClass("projector-flicker");
    }, 200);

    // Locked at 800ms (200ms offset + 600ms animation)
    const t6 = setTimeout(() => {
      setWarmup("locked");
      setFlickerClass("");
    }, 800);

    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, [shouldReduceMotion]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { creditsOpen ? setCreditsOpen(false) : onClose(); }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, creditsOpen]);

  const vimeoSrc = project.vimeoHash
    ? `https://player.vimeo.com/video/${project.vimeoId}?h=${project.vimeoHash}&autoplay=1&title=0&byline=0&portrait=0&dnt=1`
    : `https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: shouldReduceMotion ? 1 : 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeInOut" }}
        onClick={() => { if (creditsOpen) setCreditsOpen(false); else onClose(); }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(12,12,12,0.96)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 40px 40px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: "1100px",
            aspectRatio: "16 / 9",
            position: "relative",
          }}
        >
          {/* Gate flash overlay — hard cuts, no CSS transition */}
          {gateFlashOpacity !== null && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 2,
              background: "#FFFFFF",
              opacity: gateFlashOpacity,
              transition: "none",
              pointerEvents: "none",
            }} />
          )}
          <iframe
            src={vimeoSrc}
            className={flickerClass}
            onAnimationEnd={() => setFlickerClass("")}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
              // gate: hidden while loading; flicker: let animation own opacity (no inline); locked: fully visible
              opacity: warmup === "gate" ? 0 : warmup === "locked" ? 1 : undefined,
            }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </motion.div>

        {/* Close button */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Close"
          style={{
            position: "fixed",
            top: "36px",
            right: "44px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#E8E4DC",
            fontSize: "24px",
            lineHeight: 1,
            opacity: 0.7,
            transition: "opacity 300ms ease",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 300,
            letterSpacing: "0.05em",
            padding: "8px",
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "1")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "0.7")}
        >
          ✕
        </button>

        {/* Credits toggle label */}
        {description && (
          <button
            onClick={(e) => { e.stopPropagation(); setCreditsOpen((v) => !v); }}
            style={{
              position: "fixed",
              bottom: "36px",
              left: "44px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: creditsOpen ? "rgba(232,228,220,0.9)" : "rgba(232,228,220,0.5)",
              transition: "color 300ms ease",
              padding: "8px 0",
            }}
          >
            CREDITS
          </button>
        )}

        {/* Credits panel — slides up from bottom */}
        <AnimatePresence>
          {creditsOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: "33vh",
                background: "rgba(0,0,0,0.85)",
                padding: "24px 44px",
                overflowY: "auto",
                zIndex: 201,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                  fontSize: "11px",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.8)",
                  whiteSpace: "pre-wrap",
                  margin: 0,
                }}
              >
                {description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

export default function CommercialsPage() {
  const [active, setActive] = useState<Project | null>(null);
  const [navH, setNavH] = useState(113);
  const [vimeoData, setVimeoData] = useState<Record<string, { thumbnail: string; title: string; description: string }>>({});

  // Measure nav height
  useEffect(() => {
    const measure = () => {
      const h = document.querySelector("header")?.getBoundingClientRect().height;
      if (h) setNavH(h);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Fetch Vimeo oEmbed thumbnails
  useEffect(() => {
    const fetchThumbnails = async () => {
      const results = await Promise.allSettled(
        projects.map(async (p) => {
          const vimeoUrl = p.vimeoHash
            ? `https://vimeo.com/${p.vimeoId}/${p.vimeoHash}`
            : `https://vimeo.com/${p.vimeoId}`;
          const res = await fetch(
            `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(vimeoUrl)}&width=1280`
          );
          const data = await res.json();
          return { id: p.vimeoId, thumbnail: data.thumbnail_url as string, title: data.title as string, description: (data.description as string) ?? "" };
        })
      );
      const map: Record<string, { thumbnail: string; title: string; description: string }> = {};
      results.forEach((r) => {
        if (r.status === "fulfilled") {
          map[r.value.id] = { thumbnail: r.value.thumbnail, title: r.value.title, description: r.value.description };
        }
      });
      setVimeoData(map);
    };
    fetchThumbnails();
  }, []);

  return (
    <>
      <main
        id="main-content"
        style={{
          paddingTop: `${navH}px`,
          background: "#0C0C0C",
          minHeight: "100vh",
        }}
      >
        <h1 className="sr-only">Commercials</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            columnGap: 0,
            rowGap: "1px",
            background: "#2a2a2a",
          }}
          className="commercials-grid"
        >
          {(() => {
            const remainder = projects.length % 3;
            return (
              <>
                {projects.map((project, i) => (
                  <GridItem
                    key={project.vimeoId}
                    project={project}
                    index={i}
                    thumbnail={vimeoData[project.vimeoId]?.thumbnail}
                    vimeoTitle={vimeoData[project.vimeoId]?.title}
                    onClick={() => setActive(project)}
                    spanFull={remainder === 1 && i === projects.length - 1}
                  />
                ))}
                {remainder === 2 && (
                  <div style={{ background: "#0C0C0C", aspectRatio: "16 / 9" }} />
                )}
              </>
            );
          })()}
        </div>
      </main>

      {active && (
        <Lightbox
          project={active}
          description={vimeoData[active.vimeoId]?.description ?? ""}
          onClose={() => setActive(null)}
        />
      )}

      <style>{`
        @media (max-width: 1024px) {
          .commercials-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .commercials-grid { grid-template-columns: repeat(1, 1fr) !important; }
        }
      `}</style>
    </>
  );
}
