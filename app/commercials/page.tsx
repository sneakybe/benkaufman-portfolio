"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Player from "@vimeo/player";

interface Project {
  title: string;
  client: string;
  vimeoId: string;
  vimeoHash?: string;
}

const projects: Project[] = [
  { title: "Director's Cut", client: "Jet2", vimeoId: "1165178309" },
  { title: "Director's Cut", client: "Women's Rugby World Cup", vimeoId: "1030119809" },
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
  { title: "Donkey", client: "Savanna Loco", vimeoId: "243103340" },
  { title: "People's Champion", client: "Cell C", vimeoId: "231510197" },
  { title: "Pool", client: "Dairy Gives You Go", vimeoId: "230920298" },
  { title: "21st", client: "News24 Edge", vimeoId: "230974524" },
  { title: "Mariachi", client: "Savanna Loco", vimeoId: "230918403" },
  { title: "Fleet Management", client: "Cartrack", vimeoId: "231509360" },
  { title: "Lunch", client: "The Walking Dead", vimeoId: "230971144" },
  { title: "Baby", client: "Vodacom", vimeoId: "230973845" },
];

// ─── Per-tile remote state ────────────────────────────────────────────────────
type TileStatus = "pending" | "ready" | "error";

interface TileData {
  status: TileStatus;
  thumbnail?: string;
  title?: string;
  description?: string;
}

const initialTileData = (): Record<string, TileData> =>
  Object.fromEntries(projects.map((p) => [p.vimeoId, { status: "pending" as TileStatus }]));

const OEMBED_TIMEOUT = 9000;
const WATCHED_KEY = "films-watched";

function filmHref(id: string) {
  return `/commercials?film=${id}`;
}

// ─── Live column count — the orphan tile follows the real grid ───────────────
function subscribeToViewport(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

function getColumnCount() {
  const w = window.innerWidth;
  return w <= 640 ? 1 : w <= 1024 ? 2 : 3;
}

// ─── Grid item ────────────────────────────────────────────────────────────────
function GridItem({
  project,
  index,
  data,
  watched,
  onOpen,
  spanFull,
}: {
  project: Project;
  index: number;
  data: TileData;
  watched: boolean;
  onOpen: () => void;
  spanFull?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [engaged, setEngaged] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const frameNum = String(index + 1).padStart(2, "0");

  // Title is revealed on engagement; it stays put when the thumbnail never arrived,
  // so a failed tile still identifies itself instead of reading as dead.
  const titleVisible = engaged || data.status === "error";
  const displayTitle = data.title ? project.title : project.title;

  return (
    <motion.a
      href={filmHref(project.vimeoId)}
      aria-label={`Play — ${project.client}, ${displayTitle}`}
      initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: "easeOut",
        delay: shouldReduceMotion ? 0 : Math.min(index, 11) * 0.04,
      }}
      onClick={(e) => {
        // Let cmd/ctrl/middle-click open the film in a new tab natively.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onOpen();
      }}
      onMouseEnter={() => setEngaged(true)}
      onMouseLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={() => setEngaged(false)}
      data-cursor="play"
      className="tile"
      style={{
        position: "relative",
        display: "block",
        aspectRatio: "16 / 9",
        overflow: "hidden",
        background: "#111111",
        textDecoration: "none",
        gridColumn: spanFull ? "1 / -1" : undefined,
      }}
    >
      {data.thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.thumbnail}
          alt=""
          loading={index < 6 ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imgLoaded ? 1 : 0,
            transform: engaged ? "scale(1.03)" : "scale(1)",
            transition: "transform 400ms ease, opacity 700ms ease",
          }}
        />
      )}

      {/* Resting scrim — the client name is always legible without hovering */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(12,12,12,0.88) 0%, rgba(12,12,12,0.34) 18%, transparent 36%)",
          pointerEvents: "none",
        }}
      />

      {/* Engagement scrim */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(12,12,12,0.92) 0%, rgba(12,12,12,0.4) 50%, transparent 100%)",
          opacity: engaged ? 1 : 0,
          transition: "opacity 400ms ease",
          pointerEvents: "none",
        }}
      />

      {/* Caption — client at rest, title on engagement. Space for the title is
          always reserved, so the client never shifts. */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "24px 24px 18px",
          pointerEvents: "none",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: "16px",
            height: "1px",
            background: "#8B6914",
            opacity: engaged ? 1 : 0,
            transition: "opacity 400ms ease",
            marginBottom: "10px",
          }}
        />
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(20px, 2.5vw, 28px)",
            lineHeight: 1.1,
            color: "#E8E4DC",
            letterSpacing: "0.02em",
            marginBottom: "6px",
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(10px)",
            transition: "transform 500ms ease, opacity 400ms ease",
          }}
          className="tile-title"
        >
          {displayTitle}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-ui)",
            // The credential sits in the label tier, not the caption tier —
            // this is the primary identifying layer of the whole grid.
            fontSize: "11px",
            letterSpacing: "0.28em",
            color: "#E8E4DC",
            opacity: engaged ? 1 : 0.9,
            textTransform: "uppercase",
            transition: "opacity 400ms ease",
          }}
        >
          {project.client}
        </p>
      </div>

      {/* Frame number — dims once the film has been screened */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "10px",
          right: "12px",
          fontFamily: "var(--font-ui)",
          fontSize: "10px",
          letterSpacing: "0.3em",
          color: "#E8E4DC",
          opacity: watched ? 0.2 : 0.45,
          transition: "opacity 600ms ease",
          textTransform: "uppercase",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {frameNum}
      </div>
    </motion.a>
  );
}

// ─── Projector hum — one shared AudioContext, resumed per screening ───────────
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

function playProjectorHum() {
  const audioCtx = getAudioContext();
  if (!audioCtx) return;
  try {
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
    source.onended = () => {
      source.disconnect();
      gainNode.disconnect();
      filter.disconnect();
    };
  } catch {
    // Web Audio blocked — fail silently
  }
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  project,
  data,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  project: Project;
  data: TileData;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [creditsOpen, setCreditsOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Warmup: "cueing" until the player itself reports running, then the theatre.
  const [warmup, setWarmup] = useState<"cueing" | "flicker" | "locked">(
    shouldReduceMotion ? "locked" : "cueing"
  );
  const [gateFlashOpacity, setGateFlashOpacity] = useState<number | null>(
    shouldReduceMotion ? null : 0
  );
  const [flickerClass, setFlickerClass] = useState("");

  const description = data.description ?? "";
  const title = data.title ?? project.title;

  // ── The projector only runs when the machine is actually up to speed ────────
  useEffect(() => {
    if (shouldReduceMotion) return;
    const el = iframeRef.current;
    if (!el) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let fired = false;
    let player: Player | null = null;

    const runTheatre = () => {
      if (fired) return;
      fired = true;

      playProjectorHum();

      // Gate flash: on(0) → off(40) → on(110) → off(150) → remove
      setGateFlashOpacity(0.9);
      timers.push(setTimeout(() => setGateFlashOpacity(0), 40));
      timers.push(setTimeout(() => setGateFlashOpacity(0.9), 110));
      timers.push(setTimeout(() => setGateFlashOpacity(0), 150));
      timers.push(setTimeout(() => setGateFlashOpacity(null), 160));

      timers.push(
        setTimeout(() => {
          setWarmup("flicker");
          setFlickerClass("projector-flicker");
        }, 200)
      );
      timers.push(
        setTimeout(() => {
          setWarmup("locked");
          setFlickerClass("");
        }, 800)
      );
    };

    try {
      player = new Player(el);
      player.on("play", runTheatre);
      player.on("playing", runTheatre);
      player.on("bufferend", runTheatre);
      player.ready().then(
        () => {
          // Autoplay is already requested in the embed URL; nudge it, and if the
          // browser refuses, reveal the player anyway rather than holding the gate.
          player?.play().catch(() => runTheatre());
        },
        () => runTheatre()
      );
    } catch {
      runTheatre();
    }

    // Safety net: never leave a visitor staring at a held gate.
    const fallback = setTimeout(runTheatre, 4000);

    return () => {
      clearTimeout(fallback);
      timers.forEach(clearTimeout);
      try {
        player?.off("play");
        player?.off("playing");
        player?.off("bufferend");
      } catch {
        // player already torn down
      }
    };
  }, [shouldReduceMotion, project.vimeoId]);

  // ── Focus: move in on open, trap inside, restore on close ──────────────────
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (creditsOpen) setCreditsOpen(false);
        else onClose();
        return;
      }
      if (e.key === "ArrowLeft") { onPrev(); return; }
      if (e.key === "ArrowRight") { onNext(); return; }
      if (e.key !== "Tab") return;

      const root = dialogRef.current;
      if (!root) return;
      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button, [href], iframe, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null || el.tagName === "IFRAME");
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (active === first || !root.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext, creditsOpen]);

  const vimeoSrc = project.vimeoHash
    ? `https://player.vimeo.com/video/${project.vimeoId}?h=${project.vimeoHash}&autoplay=1&title=0&byline=0&portrait=0&dnt=1`
    : `https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`;

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.client} — ${title}`}
      initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: shouldReduceMotion ? 1 : 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeInOut" }}
      onClick={() => { if (creditsOpen) setCreditsOpen(false); else onClose(); }}
      className="lightbox"
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
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: "easeOut", delay: shouldReduceMotion ? 0 : 0.1 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "min(1100px, calc((100vh - 200px) * 16 / 9))",
          aspectRatio: "16 / 9",
          position: "relative",
        }}
      >
        {/* Gate flash — hard cuts, no CSS transition */}
        {gateFlashOpacity !== null && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0, zIndex: 2,
              background: "#FFFFFF",
              opacity: gateFlashOpacity,
              transition: "none",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Cueing state — the reel is loading and the visitor can see that it is */}
        {warmup === "cueing" && (
          <div
            role="status"
            style={{
              position: "absolute",
              bottom: "-26px",
              left: 0,
              fontFamily: "var(--font-data)",
              fontSize: "10px",
              letterSpacing: "0.3em",
              color: "rgba(232,228,220,0.55)",
              textTransform: "uppercase",
              pointerEvents: "none",
              animation: "quietPulse 2.4s ease-in-out infinite",
            }}
          >
            Cueing
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={vimeoSrc}
          title={`${project.client} — ${title}`}
          className={flickerClass}
          onAnimationEnd={() => setFlickerClass("")}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
            opacity: warmup === "cueing" ? 0 : warmup === "locked" ? 1 : undefined,
          }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </motion.div>

      {/* Close */}
      <button
        ref={closeRef}
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close film"
        className="lb-control"
        style={{
          position: "fixed",
          top: "36px",
          right: "44px",
          background: "none",
          border: "none",
          color: "#E8E4DC",
          fontSize: "22px",
          lineHeight: 1,
          opacity: 0.7,
          transition: "opacity 300ms ease",
          fontFamily: "var(--font-ui)",
          fontWeight: 400,
          letterSpacing: "0.05em",
          padding: "8px",
        }}
      >
        ✕
      </button>

      {/* Previous / next film */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous film"
        className="lb-control lb-arrow"
        style={{
          position: "fixed",
          left: "28px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "#E8E4DC",
          fontSize: "22px",
          opacity: 0.45,
          padding: "12px",
          transition: "opacity 300ms ease",
        }}
      >
        ←
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next film"
        className="lb-control lb-arrow"
        style={{
          position: "fixed",
          right: "28px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "#E8E4DC",
          fontSize: "22px",
          opacity: 0.45,
          padding: "12px",
          transition: "opacity 300ms ease",
        }}
      >
        →
      </button>

      {/* Now running — client, title, position in the reel */}
      <div
        aria-hidden="true"
        className="lb-caption"
        style={{
          position: "fixed",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          pointerEvents: "none",
          maxWidth: "min(560px, 80vw)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "11px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(232,228,220,0.6)",
            marginBottom: "8px",
          }}
        >
          {project.client}
        </p>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "18px",
            letterSpacing: "0.04em",
            color: "rgba(232,228,220,0.85)",
            marginBottom: "10px",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: "var(--font-data)",
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "rgba(232,228,220,0.5)",
          }}
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      </div>

      {/* Credits */}
      {description && (
        <button
          onClick={(e) => { e.stopPropagation(); setCreditsOpen((v) => !v); }}
          aria-expanded={creditsOpen}
          aria-controls="film-credits"
          className="lb-control"
          style={{
            position: "fixed",
            bottom: "36px",
            left: "44px",
            background: "none",
            border: "none",
            fontFamily: "var(--font-data)",
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: creditsOpen ? "rgba(232,228,220,0.9)" : "rgba(232,228,220,0.6)",
            transition: "color 300ms ease",
            padding: "8px 0",
          }}
        >
          Credits
        </button>
      )}

      <AnimatePresence>
        {creditsOpen && (
          <motion.div
            id="film-credits"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: "33vh",
              background: "rgba(10,10,10,0.92)",
              padding: "24px 44px",
              overflowY: "auto",
              zIndex: 201,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-data)",
                fontSize: "11px",
                lineHeight: 1.8,
                color: "rgba(232,228,220,0.8)",
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
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CommercialsPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [navH, setNavH] = useState(113);
  const cols = useSyncExternalStore(subscribeToViewport, getColumnCount, () => 3);
  const [tileData, setTileData] = useState<Record<string, TileData>>(initialTileData);
  const [watched, setWatched] = useState<Set<string>>(new Set());
  const pushedRef = useRef(false);

  // ── Header height: survives the webfont swap ───────────────────────────────
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const measure = () => {
      const h = header.getBoundingClientRect().height;
      if (h) setNavH(h);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(header);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, []);

  // ── Screened films ─────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(WATCHED_KEY);
      if (raw) setWatched(new Set(JSON.parse(raw) as string[]));
    } catch {
      // storage unavailable — watched marks simply don't persist
    }
  }, []);

  const markWatched = useCallback((id: string) => {
    setWatched((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev).add(id);
      try {
        sessionStorage.setItem(WATCHED_KEY, JSON.stringify([...next]));
      } catch {
        // non-fatal
      }
      return next;
    });
  }, []);

  // ── Thumbnails: one request per film, each landing on its own ──────────────
  useEffect(() => {
    let alive = true;
    const controllers: AbortController[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];

    projects.forEach((p) => {
      const controller = new AbortController();
      controllers.push(controller);
      const timer = setTimeout(() => controller.abort(), OEMBED_TIMEOUT);
      timers.push(timer);

      const vimeoUrl = p.vimeoHash
        ? `https://vimeo.com/${p.vimeoId}/${p.vimeoHash}`
        : `https://vimeo.com/${p.vimeoId}`;

      fetch(
        `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(vimeoUrl)}&width=1280`,
        { signal: controller.signal }
      )
        .then((res) => {
          if (!res.ok) throw new Error(`oEmbed ${res.status}`);
          return res.json();
        })
        .then((data: { thumbnail_url?: string; title?: string; description?: string }) => {
          if (!alive) return;
          if (!data.thumbnail_url) throw new Error("no thumbnail");
          setTileData((prev) => ({
            ...prev,
            [p.vimeoId]: {
              status: "ready",
              thumbnail: data.thumbnail_url,
              title: data.title,
              description: data.description ?? "",
            },
          }));
        })
        .catch(() => {
          if (!alive) return;
          // The film itself still plays — the tile stays live, it just shows
          // its own name instead of a frame from the film.
          setTileData((prev) => ({ ...prev, [p.vimeoId]: { status: "error" } }));
        })
        .finally(() => clearTimeout(timer));
    });

    return () => {
      alive = false;
      controllers.forEach((c) => c.abort());
      timers.forEach(clearTimeout);
    };
  }, []);

  // ── A film has a URL: linkable, cmd-clickable, and Back closes it ──────────
  const syncFromLocation = useCallback(() => {
    const id = new URLSearchParams(window.location.search).get("film");
    if (!id) {
      setActiveIndex(null);
      return;
    }
    const idx = projects.findIndex((p) => p.vimeoId === id);
    setActiveIndex(idx >= 0 ? idx : null);
    if (idx >= 0) markWatched(id);
  }, [markWatched]);

  useEffect(() => {
    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, [syncFromLocation]);

  const openFilm = useCallback(
    (index: number) => {
      const project = projects[index];
      window.history.pushState({ film: project.vimeoId }, "", filmHref(project.vimeoId));
      pushedRef.current = true;
      setActiveIndex(index);
      markWatched(project.vimeoId);
    },
    [markWatched]
  );

  const closeFilm = useCallback(() => {
    if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back();
    } else {
      window.history.replaceState({}, "", "/commercials");
      setActiveIndex(null);
    }
  }, []);

  const stepFilm = useCallback(
    (delta: number) => {
      setActiveIndex((current) => {
        if (current === null) return current;
        const next = (current + delta + projects.length) % projects.length;
        const project = projects[next];
        window.history.replaceState({ film: project.vimeoId }, "", filmHref(project.vimeoId));
        markWatched(project.vimeoId);
        return next;
      });
    },
    [markWatched]
  );

  const remainder = cols > 1 ? projects.length % cols : 0;
  const fillers = remainder > 1 ? cols - remainder : 0;
  const active = activeIndex !== null ? projects[activeIndex] : null;

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
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            columnGap: 0,
            rowGap: "1px",
            background: "#2a2a2a",
          }}
        >
          {projects.map((project, i) => (
            <GridItem
              key={project.vimeoId}
              project={project}
              index={i}
              data={tileData[project.vimeoId] ?? { status: "pending" }}
              watched={watched.has(project.vimeoId)}
              onOpen={() => openFilm(i)}
              spanFull={remainder === 1 && i === projects.length - 1}
            />
          ))}
          {Array.from({ length: fillers }, (_, i) => (
            <div key={`filler-${i}`} style={{ background: "#0C0C0C", aspectRatio: "16 / 9" }} />
          ))}
        </div>
      </main>

      <AnimatePresence>
        {active && activeIndex !== null && (
          <Lightbox
            key={active.vimeoId}
            project={active}
            data={tileData[active.vimeoId] ?? { status: "pending" }}
            index={activeIndex}
            total={projects.length}
            onClose={closeFilm}
            onPrev={() => stepFilm(-1)}
            onNext={() => stepFilm(1)}
          />
        )}
      </AnimatePresence>

      <style>{`
        .lb-control:hover { opacity: 1 !important; }
        .lb-control:focus-visible { opacity: 1 !important; }
        @media (max-width: 640px) {
          .lightbox { padding: 64px 16px 120px !important; }
          .lb-arrow { top: auto !important; bottom: 26px !important; transform: none !important; }
          .lb-caption { bottom: 74px !important; }
        }
        /* Touch and other hoverless pointers never see a hover state, so the
           film's title is shown at rest alongside the client. */
        @media (hover: none) {
          .tile .tile-title { opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </>
  );
}
