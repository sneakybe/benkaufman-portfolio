import type { Metadata } from "next";
import { Archivo, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import Cursor from "./components/Cursor";
import SkipLink from "./components/SkipLink";

// Names and titles of works. Italic is load-bearing — it is how a title of a
// work is told from a heading — so it ships as a real cut, not a browser shear.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// The interface voice: navigation, labels, captions, prose. Chosen rather than
// inherited, so every visitor reads the same face regardless of platform.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Machine readings. 600 and 700 are used by the HUD and must be real cuts.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ben Kaufman — Executive Producer",
  description:
    "Executive Producer with over 16 years in commercial film. Work includes John Lewis, Chanel, Dior, Dyson, Aston Martin, Asahi, World Rugby and EE. Based in London.",
  openGraph: {
    title: "Ben Kaufman — Executive Producer",
    description:
      "Commercial film portfolio. John Lewis, Chanel, Dior, Dyson, Aston Martin, Asahi and more.",
    url: "https://benkaufman.co",
    siteName: "Ben Kaufman",
    type: "website",
    images: [
      {
        url: "/images/reel-poster.jpg",
        width: 1920,
        height: 1080,
        alt: "Ben Kaufman — showreel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ben Kaufman — Executive Producer",
    description: "Commercial film portfolio.",
    images: ["/images/reel-poster.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${archivo.variable} ${jetbrainsMono.variable}`}>
      <body>
        <SkipLink />
        <Cursor />
        <Nav />
        {children}
        {/* Film grain — fixed, pointer-events none, invisible but felt */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            pointerEvents: "none",
            opacity: 0.08,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23grain)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "300px 300px",
          }}
        />
      </body>
    </html>
  );
}
