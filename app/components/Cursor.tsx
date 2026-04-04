"use client";

import { useEffect, useRef, useState } from "react";

type CursorState = "default" | "play" | "nav" | "headshot" | "logo";

export default function Cursor() {
  // Positioning refs
  const outerWrapRef = useRef<HTMLDivElement>(null); // handles translate via JS
  const outerRingRef = useRef<HTMLDivElement>(null); // handles CSS spin
  const innerRef = useRef<HTMLDivElement>(null);

  // Trail refs
  const trail1Ref = useRef<HTMLDivElement>(null);
  const trail2Ref = useRef<HTMLDivElement>(null);
  const trail3Ref = useRef<HTMLDivElement>(null);

  // Motion state
  const mouse = useRef({ x: -200, y: -200 });
  const lerped = useRef({ x: -200, y: -200 });
  const t1 = useRef({ x: -200, y: -200 });
  const t2 = useRef({ x: -200, y: -200 });
  const t3 = useRef({ x: -200, y: -200 });
  const prevPos = useRef({ x: -200, y: -200, ts: 0 });
  const velocity = useRef(0);
  const raf = useRef<number>(0);

  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);

  // ── Mouse tracking + state detection ──────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = now - prevPos.current.ts;
      if (dt > 0 && dt < 100) {
        const dx = e.clientX - prevPos.current.x;
        const dy = e.clientY - prevPos.current.y;
        velocity.current = Math.sqrt(dx * dx + dy * dy) / dt;
      }
      prevPos.current = { x: e.clientX, y: e.clientY, ts: now };
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      const el = e.target as HTMLElement;
      if (el.closest("[data-cursor='play']")) setState("play");
      else if (el.closest("[data-cursor='logo']")) setState("logo");
      else if (el.closest("[data-cursor='nav']")) setState("nav");
      else if (el.closest("[data-cursor='headshot']")) setState("headshot");
      else setState("default");
    };

    const onLeave = () => { setVisible(false); velocity.current = 0; };
    const onEnter = () => setVisible(true);

    // ── Click ripple ──────────────────────────────────────────────────────
    const onDown = (e: MouseEvent) => {
      const r = document.createElement("div");
      r.setAttribute("aria-hidden", "true");
      Object.assign(r.style, {
        position: "fixed",
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        width: "80px",
        height: "80px",
        marginLeft: "-40px",
        marginTop: "-40px",
        borderRadius: "50%",
        border: "1px solid rgba(232,228,220,0.6)",
        pointerEvents: "none",
        zIndex: "99998",
        animation: "rippleExpand 600ms ease-out forwards",
      });
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 620);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [visible]);

  // ── RAF loop: lerp, trail, magnetic ───────────────────────────────────────
  useEffect(() => {
    const LERP_OUTER = 0.15;
    const LERP_T1 = 0.09;
    const LERP_T2 = 0.055;
    const LERP_T3 = 0.032;
    const MAG_R = 60;
    const MAG_STR = 6;

    const tick = () => {
      const mx = mouse.current.x;
      const my = mouse.current.y;

      // Outer ring lerp
      lerped.current.x += (mx - lerped.current.x) * LERP_OUTER;
      lerped.current.y += (my - lerped.current.y) * LERP_OUTER;

      // Trail lerp (each chases the previous)
      t1.current.x += (mx - t1.current.x) * LERP_T1;
      t1.current.y += (my - t1.current.y) * LERP_T1;
      t2.current.x += (t1.current.x - t2.current.x) * LERP_T2;
      t2.current.y += (t1.current.y - t2.current.y) * LERP_T2;
      t3.current.x += (t2.current.x - t3.current.x) * LERP_T3;
      t3.current.y += (t2.current.y - t3.current.y) * LERP_T3;

      // Velocity decay
      velocity.current *= 0.88;
      const v = velocity.current;
      const showTrail = v > 0.8;
      const trailScale = Math.min(v / 6, 1);

      // Apply positions
      if (outerWrapRef.current) {
        outerWrapRef.current.style.transform =
          `translate(${lerped.current.x}px, ${lerped.current.y}px)`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform =
          `translate(${mx}px, ${my}px)`;
      }
      if (trail1Ref.current) {
        trail1Ref.current.style.transform =
          `translate(${t1.current.x}px, ${t1.current.y}px)`;
        trail1Ref.current.style.opacity = showTrail
          ? String(0.3 * trailScale) : "0";
      }
      if (trail2Ref.current) {
        trail2Ref.current.style.transform =
          `translate(${t2.current.x}px, ${t2.current.y}px)`;
        trail2Ref.current.style.opacity = showTrail
          ? String(0.2 * trailScale) : "0";
      }
      if (trail3Ref.current) {
        trail3Ref.current.style.transform =
          `translate(${t3.current.x}px, ${t3.current.y}px)`;
        trail3Ref.current.style.opacity = showTrail
          ? String(0.1 * trailScale) : "0";
      }

      // ── Magnetic pull ───────────────────────────────────────────────────
      // Only on nav links + buttons (not thumbnails — they have their own
      // scale transform and are too large for the effect to read well)
      const magnetics = document.querySelectorAll<HTMLElement>(
        "header a, header button, nav a, nav button"
      );
      magnetics.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAG_R && dist > 0) {
          const pull = (1 - dist / MAG_R) * MAG_STR;
          const tx = (dx / dist) * pull;
          const ty = (dy / dist) * pull;
          // CSS `translate` property composes separately from `transform`
          el.style.setProperty("translate", `${tx}px ${ty}px`);
          el.style.setProperty("transition-property", "translate");
          el.style.setProperty("transition-duration", "0ms");
        } else {
          el.style.setProperty("translate", "0px 0px");
          el.style.setProperty("transition-property", "translate, opacity");
          el.style.setProperty("transition-duration", "300ms");
          el.style.setProperty("transition-timing-function", "ease");
        }
      });

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      // Reset any magnetic offsets on unmount
      document.querySelectorAll<HTMLElement>(
        "header a, header button, nav a, nav button"
      ).forEach((el) => el.style.removeProperty("translate"));
    };
  }, []);

  // ── Derived styles ─────────────────────────────────────────────────────────
  const outerSize = state === "play" || state === "logo" ? 80 : state === "nav" ? 20 : 40;
  const outerOpacity = state === "play" || state === "logo" ? 1.0 : state === "headshot" ? 0.6 : 0.4;
  const outerBg = state === "headshot" ? "rgba(255,255,255,0.1)" : "transparent";
  const innerBg = state === "nav" ? "#8B6914" : "rgba(232,228,220,0.9)";
  const labelText =
    state === "play" ? "PLAY" :
    state === "logo" ? "HOME" :
    null;

  return (
    <>
      {/* Outer ring wrapper — positioned by JS (no CSS animation here) */}
      <div
        ref={outerWrapRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${outerSize}px`,
          height: `${outerSize}px`,
          marginLeft: `-${outerSize / 2}px`,
          marginTop: `-${outerSize / 2}px`,
          pointerEvents: "none",
          zIndex: 99999,
          opacity: visible ? outerOpacity : 0,
          // Transition size/opacity changes, NOT transform (that's set by JS)
          transition:
            "width 300ms ease, height 300ms ease, margin 300ms ease, opacity 300ms ease",
          willChange: "transform",
        }}
      >
        {/* Ring itself — spins via CSS, separate from JS translation */}
        <div
          ref={outerRingRef}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "1px solid rgba(232,228,220,0.9)",
            background: outerBg,
            animation: "cursorSpin 8s linear infinite",
            transition: "background 300ms ease",
          }}
        />

        {/* Label — outside the spinning ring, centred on the wrapper (no rotation) */}
        {labelText && (
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "9px",
              letterSpacing: "0.25em",
              color: "rgba(232,228,220,0.9)",
              textTransform: "uppercase",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {labelText}
          </span>
        )}
      </div>

      {/* Inner dot — exact mouse position */}
      <div
        ref={innerRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          marginLeft: "-3px",
          marginTop: "-3px",
          borderRadius: "50%",
          background: innerBg,
          opacity: visible ? 1 : 0,
          pointerEvents: "none",
          zIndex: 99999,
          transition: "background 300ms ease, opacity 300ms ease",
          willChange: "transform",
        }}
      />

      {/* Velocity trail dots — 3 sizes, 3 opacities, lerp-chained */}
      <div
        ref={trail1Ref}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "4px", height: "4px",
          marginLeft: "-2px", marginTop: "-2px",
          borderRadius: "50%",
          background: "rgba(232,228,220,0.9)",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform, opacity",
        }}
      />
      <div
        ref={trail2Ref}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "3px", height: "3px",
          marginLeft: "-1.5px", marginTop: "-1.5px",
          borderRadius: "50%",
          background: "rgba(232,228,220,0.9)",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 99997,
          willChange: "transform, opacity",
        }}
      />
      <div
        ref={trail3Ref}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "2px", height: "2px",
          marginLeft: "-1px", marginTop: "-1px",
          borderRadius: "50%",
          background: "rgba(232,228,220,0.9)",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 99996,
          willChange: "transform, opacity",
        }}
      />
    </>
  );
}
