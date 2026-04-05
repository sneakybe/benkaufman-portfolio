import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import Cursor from "./components/Cursor";
import SkipLink from "./components/SkipLink";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Ben Kaufman — Executive Producer",
    description: "Commercial film portfolio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
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
