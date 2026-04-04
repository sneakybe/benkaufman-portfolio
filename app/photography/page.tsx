"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const photos = [
  { file: "glencoe", ext: "jpeg" },
  { file: "bangkok", ext: "jpeg" },
  { file: "tankwa", ext: "jpeg" },
  { file: "storr", ext: "jpeg" },
  { file: "karoo", ext: "jpeg" },
  { file: "monrovia", ext: "jpeg" },
  { file: "loch-lomond", ext: "jpeg" },
  { file: "almaria", ext: "jpeg" },
  { file: "strandfontein", ext: "jpeg" },
  { file: "johannesburg", ext: "jpeg" },
  { file: "santorini", ext: "jpeg" },
  { file: "ibiza", ext: "jpeg" },
  { file: "skye", ext: "jpeg" },
  { file: "ballachulish-highlands", ext: "jpeg" },
  { file: "isle-of-wight", ext: "jpg" },
  { file: "yarmouth", ext: "jpeg" },
  { file: "hermanus", ext: "jpeg" },
  { file: "blouberg", ext: "jpeg" },
  { file: "veldrift", ext: "jpeg" },
  { file: "vredendal", ext: "jpeg" },
  { file: "bulawayo-country-club", ext: "jpeg" },
  { file: "burnside", ext: "jpeg" },
  { file: "cross-street", ext: "jpeg" },
  { file: "barbican", ext: "jpeg" },
  { file: "city-road-basin", ext: "jpeg" },
  { file: "farringdon", ext: "jpeg" },
  { file: "highbury-and-islington", ext: "jpeg" },
  { file: "tufnell-park", ext: "jpeg" },
  { file: "south-western-rail", ext: "jpeg" },
  { file: "barnes", ext: "jpeg" },
  { file: "skye-house", ext: "jpeg" },
  { file: "strandfontein-house", ext: "jpeg" },
  { file: "los-angeles", ext: "jpeg" },
].map(({ file, ext }) => ({
  src: `/photography/${file}.${ext}`,
  title: file
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" "),
}));

// ─── Thumbnail card ───────────────────────────────────────────────────────────
function PhotoCard({
  photo,
  index,
  onClick,
}: {
  photo: { src: string; title: string };
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: (index % 12) * 0.04 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "block",
        overflow: "hidden",
        cursor: "none",
        background: "#0a0a0a",
        breakInside: "avoid",
        marginBottom: 0,
      }}
    >
      {/* Thumbnail — full natural dimensions */}
      <Image
        src={photo.src}
        alt={photo.title}
        width={0}
        height={0}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          filter: hovered ? "blur(0px)" : "blur(0.4px)",
          transform: hovered ? "scale(1.03)" : "scale(1)",
          transition: "filter 400ms ease, transform 600ms ease",
        }}
      />

      {/* Dark gradient overlay — hover only */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 400ms ease",
          pointerEvents: "none",
        }}
      />

      {/* Title — bottom right, Cormorant italic */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          right: "14px",
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "13px",
          color: "white",
          opacity: hovered ? 0.9 : 0,
          transition: "opacity 400ms ease",
          pointerEvents: "none",
          userSelect: "none",
          textAlign: "right",
        }}
      >
        {photo.title}
      </div>
    </motion.div>
  );
}

// ─── Lightbox — uses plain <img> to avoid Next.js optimisation issues ─────────
function Lightbox({
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  photos: Array<{ src: string; title: string }>;
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  const photo = photos[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "rgba(0,0,0,0.96)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
      }}
    >
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: "90vw",
          maxHeight: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Plain <img> — bypasses Next.js optimisation for local /public paths */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={photo.title}
          style={{
            maxWidth: "90vw",
            maxHeight: "85vh",
            objectFit: "contain",
            display: "block",
          }}
        />
      </motion.div>

      {/* Title */}
      <div
        style={{
          position: "fixed",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "16px",
          color: "rgba(232,228,220,0.7)",
          letterSpacing: "0.05em",
          textAlign: "center",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        {photo.title}
      </div>

      {/* Counter */}
      <div
        style={{
          position: "fixed",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
          fontSize: "9px",
          letterSpacing: "0.25em",
          color: "rgba(232,228,220,0.3)",
          textTransform: "uppercase",
          pointerEvents: "none",
        }}
      >
        {String(currentIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "fixed",
          top: "32px",
          right: "40px",
          background: "none",
          border: "none",
          color: "rgba(232,228,220,0.5)",
          fontSize: "20px",
          padding: "8px",
          transition: "opacity 300ms ease",
          cursor: "none",
        }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "1")}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "0.5")}
      >
        ✕
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous"
        style={{
          position: "fixed",
          left: "28px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "rgba(232,228,220,0.35)",
          fontSize: "22px",
          padding: "12px",
          transition: "opacity 300ms ease",
          cursor: "none",
        }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "1")}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "0.35")}
      >
        ←
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next"
        style={{
          position: "fixed",
          right: "28px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "rgba(232,228,220,0.35)",
          fontSize: "22px",
          padding: "12px",
          transition: "opacity 300ms ease",
          cursor: "none",
        }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "1")}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "0.35")}
      >
        →
      </button>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PhotographyPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [navH, setNavH] = useState(113);

  useEffect(() => {
    const measure = () => {
      const h = document.querySelector("header")?.getBoundingClientRect().height;
      if (h) setNavH(h);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const handlePrev = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null)), []);
  const handleNext = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : null)), []);

  return (
    <>
      <div
        style={{
          paddingTop: `${navH + 8}px`,
          background: "#0C0C0C",
          minHeight: "100vh",
        }}
      >
        {/* CSS columns — true masonry, preserves natural image heights */}
        <div className="photo-columns">
          {photos.map((photo, i) => (
            <PhotoCard
              key={photo.src}
              photo={photo}
              index={i}
              onClick={() => setLightboxIndex(i)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={photos}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>

      <style>{`
        .photo-columns {
          columns: 3;
          column-gap: 0;
        }
        .photo-columns > * {
          break-inside: avoid;
          display: block;
        }
        @media (max-width: 1024px) {
          .photo-columns { columns: 2; }
        }
        @media (max-width: 640px) {
          .photo-columns { columns: 1; }
        }
      `}</style>
    </>
  );
}
