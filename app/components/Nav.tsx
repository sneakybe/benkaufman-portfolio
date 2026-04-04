"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "HOME" },
  { href: "/commercials", label: "COMMERCIALS" },
  { href: "/photography", label: "PHOTOGRAPHY" },
  { href: "/about", label: "ABOUT" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "52px 40px 40px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          transition: "background 700ms ease, backdrop-filter 700ms ease",
          background: isHome
            ? scrolled ? "rgba(12,12,12,0.95)" : "transparent"
            : "#0C0C0C",
          backdropFilter: isHome && scrolled ? "blur(10px)" : "none",
          WebkitBackdropFilter: isHome && scrolled ? "blur(10px)" : "none",
        }}
      >
        {/* Logo — hidden on home page; the hero text IS the name */}
        <Link
          href="/"
          data-cursor="logo"
          style={{
            textDecoration: "none",
            lineHeight: 1,
            opacity: isHome ? 0 : 1,
            pointerEvents: isHome ? "none" : "auto",
            transition: "opacity 600ms ease",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "18px",
              letterSpacing: "0.2em",
              color: "#E8E4DC",
              textTransform: "uppercase",
              lineHeight: 1.1,
            }}
          >
            BEN KAUFMAN
          </div>
          <div
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 400,
              fontSize: "9px",
              letterSpacing: "0.4em",
              color: "#E8E4DC",
              opacity: 0.5,
              textTransform: "uppercase",
              marginTop: "4px",
            }}
          >
            EXECUTIVE PRODUCER
          </div>
        </Link>

        {/* Desktop nav */}
        <nav
          data-cursor="nav"
          style={{
            display: "flex",
            gap: "44px",
            alignItems: "center",
          }}
          className="hidden-mobile"
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#E8E4DC",
                opacity: pathname === href ? 1 : 0.5,
                textDecoration: "none",
                transition: "opacity 600ms ease",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.opacity = "1")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.opacity =
                  pathname === href ? "1" : "0.5")
              }
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            flexDirection: "column",
            gap: "6px",
          }}
          className="show-mobile"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: "24px",
                height: "1px",
                background: "#E8E4DC",
                transition: "transform 400ms ease, opacity 400ms ease",
                transform:
                  menuOpen
                    ? i === 0
                      ? "translateY(7px) rotate(45deg)"
                      : i === 2
                      ? "translateY(-7px) rotate(-45deg)"
                      : "scaleX(0)"
                    : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </header>

      {/* Mobile menu overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          background: "#0C0C0C",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "48px",
          transition: "opacity 600ms ease, visibility 600ms ease",
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? "visible" : "hidden",
        }}
      >
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              fontFamily:
                "var(--font-cormorant), 'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "clamp(32px, 8vw, 64px)",
              letterSpacing: "0.1em",
              color: pathname === href ? "#8B6914" : "#E8E4DC",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
