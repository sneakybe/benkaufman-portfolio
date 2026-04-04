"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
}: {
  project: Project;
  index: number;
  thumbnail: string | undefined;
  vimeoTitle: string | undefined;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const frameNum = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.04 }}
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

function Lightbox({
  project,
  description,
  onClose,
}: {
  project: Project;
  description: string;
  onClose: () => void;
}) {
  const [creditsOpen, setCreditsOpen] = useState(false);

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
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
          <iframe
            src={vimeoSrc}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
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
      <div
        style={{
          paddingTop: `${navH}px`,
          background: "#0C0C0C",
          minHeight: "100vh",
        }}
      >
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
          {projects.map((project, i) => (
            <GridItem
              key={project.vimeoId}
              project={project}
              index={i}
              thumbnail={vimeoData[project.vimeoId]?.thumbnail}
              vimeoTitle={vimeoData[project.vimeoId]?.title}
              onClick={() => setActive(project)}
            />
          ))}
        </div>
      </div>

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
