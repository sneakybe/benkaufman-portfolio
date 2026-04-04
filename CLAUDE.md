# Skills
ALWAYS use the /frontend-design skill before writing any frontend code. 
This is mandatory on every page build and every design iteration.
Do not write a single line of HTML, CSS, or JSX without first applying 
the frontend-design skill principles.

---

# CLAUDE.md — Ben Kaufman, Executive Producer

## Project Overview
World-class cinematic portfolio for Ben Kaufman, Executive Producer in 
commercial film. The benchmark is: could this sit alongside 
rsafilms.com, mjz.com, or smugglerfilms.com? If not, keep going.
Dark, editorial, typographically fearless. Every pixel intentional.

## Site Structure
- Home: Full-screen Vimeo background reel, name overlaid, nothing else
- Commercials: Grid of 28 projects, Vimeo lightbox on click
- Photography: Masonry grid, lightbox on click
- About: Split editorial layout, headshot + bio

## Typography — This Is Critical
- Display/Hero: "Cormorant Garamond" — elegant, cinematic, high-contrast 
  serif. This is the signature font. Use at large sizes (80px–200px).
  Weight: 300 (Light) for maximum elegance.
- Navigation & UI: "Helvetica Neue" or system sans-serif — neutral, 
  invisible, lets the serif breathe
- Labels & Captions: Tight letter-spacing (0.3em+), all caps, small size
- NEVER use: Bebas Neue, Inter, Roboto, or any "safe" font
- Import Cormorant Garamond from Google Fonts (weights 300, 400, 600)

## Colour — Strict Palette
- Background: #0C0C0C — near black, not pure black
- Surface: #111111 — for cards and overlays
- Primary text: #E8E4DC — warm parchment white, never pure white
- Secondary text: #666666 — muted, for credits and metadata
- Accent: #8B6914 — dark antique gold, used ONLY for hover states 
  and active nav items. Sparingly. Never as a fill colour.
- Overlay gradient: linear-gradient(to top, rgba(0,0,0,0.9), transparent)

## Spatial Design
- Generous whitespace — let content breathe
- Full-bleed images wherever possible
- Navigation: fixed, 100% width, padding 40px, transparent over hero
- Hero text: bottom-left aligned (not centred) — feels more editorial
- Grid: 3 columns desktop, 2 tablet, 1 mobile. No gutters — edge to edge.
- Aspect ratio for commercial thumbnails: 16:9, consistent

## Motion — Slow & Intentional
- All transitions: 600ms–900ms ease
- Page load: hero name fades up from slight offset (translateY 20px)
- Commercial grid: staggered fade-in on load (50ms delay between items)
- Hover on thumbnails: scale(1.03) + overlay fade — 400ms ease
- Lightbox: fade in 300ms, backdrop blur
- Nav links: opacity 0.5 default, 1.0 on hover — no underline animation
- Zero bouncy animations. Zero spring physics. Slow cinema, not app UI.

## Navigation
- Logo: "BEN KAUFMAN" in Cormorant Garamond 300, tracking 0.2em
- Subtitle: "EXECUTIVE PRODUCER" in Helvetica, 10px, tracking 0.4em, 
  opacity 0.5
- Nav links: right-aligned, Helvetica, 11px, tracking 0.25em, uppercase
- On scroll past 100px: nav background becomes rgba(12,12,12,0.95) 
  with backdrop-filter: blur(10px)
- Mobile: hamburger (3 lines, minimal), full screen dark overlay nav

## Specific Page Notes

### Home
- Vimeo background player: muted, autoplay, loop, no controls
- Vimeo ID: 1057090009
- Name "BEN KAUFMAN" positioned bottom-left, 10vw font size
- "EXECUTIVE PRODUCER" one line below in small caps
- Scroll indicator: thin vertical line animating down, bottom centre

### Commercials
- No page title needed — the grid speaks for itself
- On hover: project title slides up from bottom of card in Cormorant
- Client name in small Helvetica above title on hover
- Lightbox: full screen, dark backdrop, Vimeo player centred
- Close button: top right, minimal X

### Photography
- Masonry layout, variable heights
- Zero captions visible — only on hover (title fades in)
- Lightbox with prev/next navigation

### About
- Left half: full-bleed headshot, no border, edge to edge
- Right half: generous padding (80px), vertically centred content
- Name in large Cormorant Garamond
- Bio in DM Sans 16px, line-height 1.8, warm white
- Contact as plain text links, no icons
- Headshot URL: https://images.squarespace-cdn.com/content/v1/599f02c1197aea03f8cfbc87/f0946f60-80e7-4d12-a6db-9ca20d0c7389/BK_website.jpg
- Bio text: "With over 15 years in the industry, I've produced commercials, 
  content, and stills for globally recognised brands, including John Lewis, 
  Chanel, Dior, Dyson, Aston Martin, World Rugby, JBL, and EE. As an 
  Executive Producer, I've led high-profile projects across Europe, Asia, 
  South America, and Africa, working within both production companies and 
  agencies. Alongside my work in film, I'm a self-taught photographer. My 
  photography has been exhibited at Cannes Lions and selected by acclaimed 
  British photographer Rankin."
- Contact: hello@benkaufman.co
- Photography site: www.benkaufmanphotography.com

## Tech Stack
- Next.js App Router, TypeScript, Tailwind CSS
- Framer Motion for all animations
- Vimeo Player API (@vimeo/player)
- next/image for all photography
- Fully responsive — mobile, tablet, desktop

## Screenshot Flow
After building each page:
1. Take a screenshot
2. Ask: does this look like it was designed by a human with taste?
3. Is the typography doing the heavy lifting?
4. Is there enough negative space?
5. Iterate until the answer to all is yes.

## Quality Bar
Could this sit alongside rsafilms.com, mjz.com, or smugglerfilms.com? 
If not, keep going. This site should look like it cost £20,000 to build.