---
name: Ben Kaufman — Executive Producer
description: A commercial film portfolio built as a director's monitor — instrumentation in the margins, the picture in the centre.
colors:
  void: "#0C0C0C"
  surface: "#111111"
  surface-deep: "#0a0a0a"
  hairline: "#2a2a2a"
  parchment: "#E8E4DC"
  parchment-read: "#B1AEA8"
  muted: "#888888"
  muted-deep: "#666666"
  tungsten-gold: "#8B6914"
  hud-amber: "#FFC800"
  rec-red: "#FF3333"
  stby-green: "#00C16E"
typography:
  display:
    fontFamily: "Cormorant Garamond, Times New Roman, serif"
    fontSize: "clamp(2.75rem, 8vw, 7.25rem)"
    fontWeight: 300
    lineHeight: 0.9
    letterSpacing: "0.04em"
  headline:
    fontFamily: "Cormorant Garamond, Times New Roman, serif"
    fontSize: "clamp(2rem, 4vw, 4rem)"
    fontWeight: 300
    lineHeight: 0.92
    letterSpacing: "0.02em"
  title:
    fontFamily: "Cormorant Garamond, Times New Roman, serif"
    fontSize: "clamp(20px, 2.5vw, 28px)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "0.02em"
  title-inset:
    fontFamily: "Cormorant Garamond, Times New Roman, serif"
    fontSize: "18px"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "0.04em"
  lockup:
    fontFamily: "Cormorant Garamond, Times New Roman, serif"
    fontSize: "19px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.17em"
  body:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  link:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.05em"
  label:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.25em"
  caption:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.35em"
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.06em"
  data-caption:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.3em"
  telemetry:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "9px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.08em"
  glyph:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.05em"
rounded:
  none: "0px"
  hair: "1px"
  full: "50%"
spacing:
  hairline: "1px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "24px"
  xl: "28px"
  gutter: "40px"
  rhythm: "44px"
  chamber: "80px"
components:
  nav-link:
    textColor: "{colors.parchment}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
  nav-link-active:
    textColor: "{colors.parchment}"
    typography: "{typography.label}"
  nav-link-mobile-active:
    textColor: "{colors.tungsten-gold}"
    typography: "{typography.headline}"
  logo-lockup:
    textColor: "{colors.parchment}"
    typography: "{typography.lockup}"
  work-tile:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
  work-tile-client:
    textColor: "{colors.parchment}"
    typography: "{typography.label}"
  work-tile-title:
    textColor: "{colors.parchment}"
    typography: "{typography.title}"
    padding: "28px 24px"
  hud-readout:
    textColor: "{colors.parchment}"
    typography: "{typography.data}"
  hud-readout-active:
    textColor: "{colors.hud-amber}"
    typography: "{typography.data}"
  credits-toggle:
    textColor: "{colors.parchment}"
    typography: "{typography.data}"
    padding: "8px 0"
  close-button:
    textColor: "{colors.parchment}"
    typography: "{typography.glyph}"
    rounded: "{rounded.none}"
    padding: "8px"
  lightbox-arrow:
    textColor: "{colors.parchment}"
    typography: "{typography.glyph}"
    rounded: "{rounded.none}"
    padding: "12px"
  contact-link:
    textColor: "{colors.parchment}"
    typography: "{typography.link}"
    rounded: "{rounded.none}"
  gold-rule:
    backgroundColor: "{colors.tungsten-gold}"
    width: "40px"
    height: "1px"
---

# Design System: Ben Kaufman — Executive Producer

## Overview

**Creative North Star: "The Operator's Monitor"**

Everything in this system behaves like the feed on a director's monitor. The picture runs full-bleed and uninterrupted; the interface lives in the margins as instrumentation — framelines at 10vh, a live 24fps timecode, FPS / SHUTTER / IRIS / EI / ND / WB readouts, a STBY indicator that flips to REC after ten seconds. None of it decorates the image. It surrounds it, the way a monitor's overlay surrounds a take, and it implies a person who reads those numbers for a living.

The register is precise, nocturnal and unshowy. Technical exactness in near-darkness: a #0C0C0C void that is deliberately not black, warm parchment text that is deliberately not white, one gold that never fills anything, and a serif that appears only for names and titles. Confidence is expressed as restraint — no element raises its voice, and nothing is explained. The audience is film people; the system speaks their language without translating it.

The site is emphatically not a creative-agency template, a SaaS product page, a stock photographer's portfolio theme, or a show-reel gimmick site. Those four are binding anti-references. The distinction from the last one is the sharpest and the easiest to lose: every effect here is diegetic — it exists because a camera, a projector or a lens does that. A projector hum plays as a film loads because projectors hum. Grain sits at 8% over every page because film has grain. The moment an effect stops being something a piece of film equipment actually does, it becomes the gimmick site.

**Key Characteristics:**
- Near-black void (#0C0C0C), warm parchment text (#E8E4DC), one dark gold accent used at hairline scale
- Three families, three jobs: Cormorant Garamond for proper nouns, Archivo for the interface, JetBrains Mono for machine data
- Zero corner radius everywhere except literal optics (rings, dots, the countdown circle)
- No shadows in the entire system — depth is scrim, grain, vignette and defocus
- Edge-to-edge grids separated by a single 1px hairline, never gutters or cards
- Slow motion: 200–1400ms, `ease` and `easeOut`, no springs, no bounce
- A custom cursor replaces the system cursor wherever a fine pointer exists and reduced motion is not requested
- A 10px floor on all interface type; only the home HUD's telemetry is allowed below it

## Colors

A single warm-neutral value scale in near-darkness, one gold accent, and a small set of instrument-accurate signal colours borrowed from a camera's own display.

### Primary
- **Tungsten Gold** (#8B6914): The only accent in the system, named for 3200K practical light. It appears as the 1px divider on About, the 16px hairline above an engaged tile's title, the active item in the mobile menu, the focus-visible ring, and the text-selection background. It is never a fill, never a button, never a large area.

### Neutral
- **Void** (#0C0C0C): The page ground everywhere. Deliberately not #000 — pure black would flatten the grain and kill the sense of a lit room.
- **Deep Surface** (#0a0a0a): The bed behind a photograph while it loads. One step below the void so images resolve out of darkness rather than off a lighter card.
- **Surface** (#111111): The bed behind a commercial thumbnail before its Vimeo frame arrives.
- **Hairline** (#2a2a2a): Shows through the 1px row gaps of the commercials grid. It is a seam between frames, not a border around them.
- **Parchment** (#E8E4DC): All primary text, the custom cursor, the framelines. Warm off-white — never pure white for reading.
- **Reading Parchment** (#B1AEA8): Parchment at reading strength for the one paragraph of prose on the site. Set as a value, not an opacity, so its 8.8:1 contrast is auditable in the source and cannot stack with a parent.
- **Muted** (#888888): Secondary metadata.
- **Deep Muted** (#666666): Reserved for text that must recede below the muted step. No longer used for any label — the "CONTACT" eyebrow moved up to Muted at 5.1:1.

### Tertiary — Instrument Signals
These four are quoted from a real camera display, not chosen as brand colours. They exist only inside the home-page HUD and its overlays.
- **HUD Amber** (#FFC800): An engaged or non-default camera state — false colour active, a non-16:9 aspect ratio selected.
- **REC Red** (#FF3333): Recording. Solid, no pulse.
- **STBY Green** (#00C16E): Standby, pulsing between 0.45 and 1.0 opacity on a 1s interval.

### Named Rules

**The Tungsten Rule.** Tungsten Gold is applied at hairline scale only: a 1px rule, a 9px label, a focus ring, one active word. If it covers more than a line or a word, it's wrong. Its rarity is what makes it read as gold rather than as a brand colour.

**The No-Pure Rule.** No surface is #000000 and no text is #FFFFFF. The only exceptions are diegetic: the film leader's flash frame, the projector gate flash, and the HUD's white readouts, all of which are accurate to the equipment they imitate.

**The Instrument Quarantine Rule.** HUD Amber, REC Red and STBY Green belong to the camera overlay. They never appear as UI feedback, never as a link colour, never as a state on a button.

## Typography

**Serif — proper nouns:** Cormorant Garamond (300 for display, 600 for the lockup, plus a real italic cut)
**Interface — everything functional:** Archivo (400/500)
**Data — machine readings:** JetBrains Mono (400/500/600/700)

Three families, three jobs, and every call site references a role token — `var(--font-serif)`, `var(--font-ui)`, `var(--font-data)` — never a family name. Changing the interface face is one edit in [app/globals.css](app/globals.css), not sixteen.

**Character:** A high-contrast serif carries every proper noun — the name, the title of a work — and it is the only voice in the system with any warmth. Everything functional is Archivo at 10–13px with 0.25–0.4em tracking, so wide it reads as spacing rather than as words; Archivo is drawn for small sizes, and its slightly heavier stems and open apertures are what survive at a 1px stem on near-black. The mono is a third voice entirely: machine-generated readings, tight and mechanical. Each family only ever says one kind of thing — which is why there is no fourth. Prose is set in the interface face, because one paragraph is not a kind of thing.

### Hierarchy
- **Display** (300, clamp(2.75rem, 8vw, 7.25rem), line-height 0.9, 0.04em, uppercase): The hero name, once per site, bottom-left of the home reel. The rem floor keeps it the largest element on a phone and under browser zoom, where a bare `vw` value silently shrank below the navigation.
- **Headline** (300, clamp(2rem, 4vw, 4rem), 0.92, 0.02em, uppercase): The About name and the full-screen overlay titles. The mobile menu shares the ramp at 8vw.
- **Title** (300 *italic*, clamp(20px, 2.5vw, 28px), 1.1, 0.02em): The name of a work on a tile. The italic is the tell that a title is a work, not a heading — which is why the italic ships as a real cut and is never left to the browser to shear.
- **Title (inset)** (300 *italic*, 18px, 0.04em): The same role inside a lightbox, where the artefact already has the visitor's attention. One value across both lightboxes.
- **Lockup** (600, 19px, 0.17em, uppercase): The header identity only. 600 rather than 300 because at 19px a 300-weight hairline measures 0.34px — below what a screen can draw, so the stroke contrast that justifies this face is the first thing lost.
- **Body** (Archivo 400, 16px, 1.65, max-width 480px, #B1AEA8): Prose. Exactly one paragraph on the site, at a 66-character measure.
- **Link** (Archivo 400, 13px, 0.05em): Contact links, set as plain text.
- **Label** (Archivo 400, 11px, 0.25em, uppercase): Navigation, the skip link, and the client name — the credential sits in the label tier because it identifies, it doesn't caption.
- **Caption** (Archivo 400, 10px, 0.3–0.4em, uppercase): The "EXECUTIVE PRODUCER" line, frame numbers, the CONTACT eyebrow, the SELECTED WORK footnote.
- **Data** (JetBrains Mono, 10–13px): Counters, credit blocks, the CREDITS toggle, CUEING. 600 and 700 are loaded, so no HUD weight is ever synthesised.
- **Telemetry** (JetBrains Mono 400, 9px, 0.08em): The home HUD only. The one place where too small to read comfortably is the correct answer.

### Named Rules

**The Serif-Speaks-Once Rule.** Cormorant is for proper nouns — the name, and the title of a work. It never runs a sentence and never labels a control. Below ~15px it needs weight 400 or more: its x-height is 0.386em, so 13px Cormorant is optically a 9px face.

**The Machine Voice Rule.** JetBrains Mono is reserved for readings a machine would produce: timecode, frame IDs, counters, credit blocks pulled from Vimeo. Never prose, never navigation, never a heading.

**The Wide-Small Rule.** Functional type gets smaller and wider together. At 10px the tracking is 0.3–0.4em; at 11px it is 0.25–0.28em. Small type is never set tight — the space is what makes it legible against a moving image.

**The Ten-Pixel Floor Rule.** Nothing in the interface is set below 10px. The single exception is the home HUD's telemetry at 9px, quarantined exactly like the instrument colours: a camera renders telemetry at telemetry size, and that is the whole point of it.

**The Rem-Floor Rule.** Every fluid size is a `clamp()` whose minimum is in `rem`. A bare `vw` value does not respond to browser zoom — the layout viewport shrinks by the same factor the unit grows — so display type set in pure `vw` is the one element on a page that a low-vision visitor cannot enlarge.

## Layout

The site is edge-to-edge. There is no max-width container, no centred column, and no page title on the work pages — the grid is the page.

**Header.** Fixed, full width, `52px 40px 40px`, logo hard left and links hard right, aligned to the top. It is transparent over the home reel and solid #0C0C0C everywhere else; past 100px of scroll on home it becomes `rgba(12,12,12,0.95)` with a 10px backdrop blur, transitioned over 700ms. Content pages measure the real header height at runtime and pad by it rather than assuming a number.

**Work grid.** Three columns desktop, two at ≤1024px, one at ≤640px. `column-gap: 0`, `row-gap: 1px`, with #2a2a2a behind the grid so the row gap reads as a seam. Tiles are a strict 16:9. When the project count leaves one orphan, the last tile spans the full row rather than sitting alone; when it leaves two, an empty void-coloured tile completes the row.

**Photography grid.** JS-driven masonry with the same 3 / 2 / 1 column behaviour, absolutely positioned into the shortest column, re-laid out on image load and on resize. Zero gap in both axes — the photographs touch.

**About.** A 1fr / 1fr split, full-bleed headshot left at 100vh, content right in an 80px chamber (140px top) vertically centred, prose capped at 480px, 44px between blocks. Below 768px it stacks: headshot 60vh, content padded 48px / 24px, top-aligned.

**Home.** The reel fills the viewport with a 16:9 cover crop (`177.778vh × 56.25vw`, min 100%). Framelines sit at 10vh from top and bottom; the hero name sits 72px above the lower frameline, 56px in from the left.

**Breakpoints.** 640px (grids to one column), 768/769px (nav switches to hamburger; About stacks), 1024px (grids to two columns). The home HUD switches to its reduced set at 767px.

### Named Rules

**The No-Gutter Rule.** Work images butt against each other. The only separation permitted between two pieces of work is a 1px hairline. No cards, no padding, no drop-shadowed tiles.

**The Frameline Rule.** On the home reel, nothing of consequence lives outside the 10vh framelines. The HUD reads in the margins above and below; the name reads inside the frame.

## Elevation & Depth

There is not a single `box-shadow` in this system, and there should never be one. Depth is optical, never material: it is made of light and atmosphere the way it is on film, not of objects casting shadows onto other objects.

The four instruments of depth:

- **Scrims.** Linear gradients of the void colour, used to protect text over a moving image. Top: `linear-gradient(to bottom, rgba(12,12,12,0.78), rgba(12,12,12,0.3) 65%, transparent)` over 200px. Bottom: `linear-gradient(to top, rgba(12,12,12,0.94), rgba(12,12,12,0.55) 40%, rgba(12,12,12,0.08) 70%, transparent)`. Thumbnails use a shorter version of the same idea on hover.
- **Grain.** A fractal-noise SVG at 300×300, tiled, `opacity: 0.08`, fixed over the entire site at z-index 9999 with pointer-events off. It is invisible until it's removed. The film leader raises it to 0.12.
- **Vignette.** `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6))` — used on the countdown frame and, as a directional variant, on the right edge of the About headshot.
- **Defocus.** Backdrop blur behind full-screen layers: 8px for the commercials lightbox, 12px for the photography lightbox, 24px for the Director's Cut overlay, 10px for the scrolled home header. Photography thumbnails also sit at `blur(0.4px)` at rest and resolve to `blur(0)` on hover — the image pulling focus.

### Named Rules

**The Optical Depth Rule.** No `box-shadow`, ever. If something needs to separate from what's behind it, it gets a scrim, a blur or a vignette — never a lift.

**The Stacking Order.** Reading upward from the picture: video (1) → bottom scrim (3) → false colour (4) → top scrim (8) → framelines (90) → HUD (100) → header (100) → hero name (15 within its own context) → lightboxes (200–500) → idle and easter-egg overlays (9500–10000) → grain (9999) → cursor (99999). Grain sits above everything except the cursor, so nothing in the interface is ever cleaner than the image.

## Shapes

Rectangular, without exception, unless the thing being drawn is a piece of optics.

Every surface, tile, panel, image and button has `border-radius: 0`. Borders are 1px or they don't exist: the 1px hairline between tiles, the 1px `rgba(255,255,255,0.25)` framelines, the 40×1px gold rule on About, the 1px `rgba(232,228,220,0.9)` cursor ring, the 1px gold focus ring. There are no 2px borders anywhere except the film-leader countdown circle, which is 2px because an Academy leader is.

Circles are reserved for optics and signals: the cursor ring and its three trail dots, the click ripple, the 40vmin countdown circle, the 7px STBY/REC indicator. A circle in this system means *lens* or *light*, never *avatar* and never *button*.

Scrollbars are 4px, void track, hairline thumb — consistent with every other seam in the system.

### Named Rules

**The Zero Radius Rule.** Nothing rectangular is ever rounded. A rounded corner anywhere in this system is a bug, not a preference.

## Components

### Navigation
Fixed header, transparent over the home reel and #0C0C0C on every other page. The logo is a two-line lockup — "BEN KAUFMAN" in Cormorant 300 at 18px / 0.2em over "EXECUTIVE PRODUCER" in Helvetica 9px / 0.4em at 50% opacity — and it is hidden entirely on the home page, because there the hero text *is* the name.

- **Links:** Helvetica 11px, 0.25em, uppercase, parchment. Inactive at 50% opacity, active and hovered at 100%, transitioned over 600ms. No underline, ever, in any state.
- **Focus:** 1px gold outline at 4px offset for nav links (2px / 3px offset everywhere else).
- **Magnetic pull:** Header links and buttons drift toward the cursor within a 60px radius, up to 6px of travel, using the CSS `translate` property so it composes independently of any `transform`. Release returns over 300ms ease.
- **Mobile:** Three 24×1px parchment bars that fold into an X (7px translate, ±45°, middle bar scaled to zero over 400ms). The overlay is a full-screen void with links in Cormorant 300 at `clamp(32px, 8vw, 64px)`, 0.1em, centred, 48px apart; the current page is Tungsten Gold. The panel cross-fades over 600ms.

### Work Tile
A 16:9 Vimeo frame on a #111111 bed with a two-digit frame number bottom-right at 40% opacity and the client name bottom-left at 9px / 0.3em — both visible at rest, so the grid reads as a numbered, attributed contact sheet before anyone touches it. The tile is an anchor to the film's own URL, so it can be tabbed to, cmd-clicked and sent.

- **Caption:** the client is permanent, in the label tier at 11px / 0.28em parchment over a short resting scrim; the italic Cormorant title is the reveal. The client is the credential, so the credential is free and the detail is earned. Space for the title is always reserved, so nothing shifts when it appears.
- **Engagement (hover or keyboard focus):** image scales to 1.03 over 400ms; the full scrim fades in over 400ms; the title rises 10px and fades in over 500ms / 400ms; a 16px Tungsten Gold hairline appears above it; the client goes to full opacity.
- **Screened:** once a film has been opened, its frame number dims from 0.4 to 0.15 — a diegetic mark for work already seen, held for the session.
- **Pending / failed:** a pending tile is the bare #111111 bed with its client and frame number. A tile whose thumbnail never arrived shows its title permanently and stays live — the film still plays, so the tile must never read as dead.
- **Entrance:** opacity-only fade over 600ms, staggered 40ms per tile and capped at 12 steps.
- **Cursor:** carries `data-cursor="play"` — the ring grows to 80px and shows the word PLAY.
- **Hoverless pointers:** under `@media (hover: none)` the title is pinned visible, because a grid that identifies itself only on hover identifies itself to nobody on touch.

### Photo Tile
Full natural aspect ratio on a #0a0a0a bed, zero gap. At rest it is very slightly defocused (`blur(0.4px)`); on hover it resolves to sharp over 400ms and scales to 1.03 over 600ms while a bottom scrim and an italic Cormorant title fade in at 90% opacity, bottom-right. Entrance is a 700ms fade staggered 40ms, cycling every 12 items so late rows don't wait.

### Lightboxes
Two variants of the same idea: a near-opaque void backdrop with backdrop blur, the artefact centred, all controls fixed to the viewport rather than attached to the artefact.

- **Commercials:** `rgba(12,12,12,0.96)` + 8px blur, fading in over 300ms; the 16:9 player scales 0.97 → 1 over 400ms after a 100ms beat, capped at `min(1100px, calc((100vh - 200px) * 16 / 9))` so a film is never clipped by the window. The projector warm-up is **driven by the player, not by a timer**: while the reel loads, the gate is held dark and a mono `CUEING` reads below the frame; the moment the player reports running, the white gate flash cuts on and off at 0, 40, 110, 150ms, a 600ms irregular flicker follows, and it locks at 800ms — with a synthesised 1.8s band-passed hum from one shared, reused AudioContext. A 4s fallback guarantees the gate never stays held. ← / → move between films and the caption below the frame names what is running — client in Helvetica caption, title in Cormorant italic, position in mono (`04 / 28`). A CREDITS toggle bottom-left slides a deep-surface panel up from the bottom edge (`rgba(10,10,10,0.92)`, max 33vh, mono 11px / 1.8) carrying the real Vimeo credits.
- **Photography:** `rgba(0,0,0,0.96)` + 12px blur, 250ms; image capped at 90vw / 85vh; italic Cormorant title bottom-centre with a mono `04 / 34` counter beneath it; ← / → and ✕ as bare glyphs at 35–50% opacity rising to 100% on hover over 300ms.
- **Both:** Escape closes, arrows navigate, body scroll is locked while open. Both are real dialogs: `role="dialog"`, `aria-modal`, named by the work they contain, focus moved to the close control on open, Tab cycled inside, focus returned to the originating tile on close. With `prefers-reduced-motion`, the warm-up sequence and every scale transition are skipped entirely and the player opens locked.

### Contact Links
Plain text at 13px Helvetica, 0.05em, no underline, no icon, 70% opacity rising to 100% over 400ms. A mailto and an outbound link, indistinguishable by design — the restraint is the point.

### The Cursor (signature)
The system cursor is disabled globally (`cursor: none !important`) and replaced by a five-part instrument: a 40px ring at 40% opacity rotating once every 8 seconds and lerping toward the pointer at 0.15; a 6px parchment dot pinned to the exact pointer position; and three trail dots (4/3/2px) chained at 0.09 / 0.055 / 0.032 lerp that only become visible above a velocity threshold and scale their opacity with speed. Context changes it: 80px and fully opaque with the word PLAY over a thumbnail or HOME over the logo, 20px with a gold dot over navigation, 60% opacity with a translucent fill over the headshot. Mousedown emits an 80px ring that expands and fades over 600ms.

### The Reel (signature — home only)
The picture fills the viewport in a 16:9 cover crop, and **everything that belongs to the picture lives inside it**: both scrims and both framelines are children of the matted wrapper, so when IRIS mattes to 2.39:1 the bars are real black bars rather than a gradient running past the edge of the frame.

The reel reports for itself. Until the Vimeo player emits `play`, a still frame from the reel holds the page; the player crossfades in over 900ms once it is actually running, and a 4s fallback settles the state either way. A blocked embed, a refused autoplay or a dead network all end at the same place — the poster, the HUD and the name — and never at an empty black rectangle.

Beneath the name, one permanent route to the work: the role line, a gold hairline, and `SELECTED WORK — 28 FILMS` as a link. It is a slate card, not a call to action, and it is the only thing on the page that points anywhere.

### The HUD (signature — home only)
An 82%-opacity overlay of camera telemetry: FPS, SHUTTER (drifting ±0.3 every 8–14s, eased over 600ms), IRIS, EI, ND, WB along the top; FCL, PWR (dropping 0.1V every 20–30s), reel/clip ID, MEDIA and a live 24fps timecode starting at 01:07:23:00 along the bottom; EVF and CAM pill stacks down the left edge in translucent grey boxes. A STBY dot pulses green for ten seconds, then goes solid REC red. **A monitor's HUD is read, not clicked** — with one exception. IRIS is a real `<button>` with an accessible name and a focus state, because matting a frame between 16:9, 2.39:1 and 1.85:1 is a genuine film-craft gesture; it animates a symmetric `clip-path` inset over 600ms. Every other readout is a display and nothing more. On mobile it reduces to FPS, TC, the REC indicator and PWR.

### Cinematic Easter Eggs (signature)
Four hidden sequences, all diegetic, all on the home page — and every one of them interruptible, keyboard-safe and silent under reduced motion.

- **Slate:** once per session, `BENKAUFMAN.CO` in italic Cormorant, 420ms. Storage failures are caught, so a private-mode browser never gets stuck behind it.
- **Film leader:** three clicks **on the picture** within 600ms — never on the HUD, the name or the route to the work. Its countdown numeral and the circle around it are sized to the frame (`clamp(4rem, 20vmin, 12rem)` inside a 40vmin circle), not to the type ramp: an Academy leader is measured against the frame it is printed on, and this is the one place in the system where type is a picture element rather than a role. White flash, an Academy count from 8 to 2 on hard 220ms cuts, a 1kHz two-pop from the one shared AudioContext, cut to black, 2.09s total. Escape or any click aborts it, and `prefers-reduced-motion` skips it entirely, audio included.
- **Director's Cut:** the Konami code. It can only be opened from the keyboard, so it is a real dialog — `role="dialog"`, `aria-modal`, focus moved to its own dismiss control, focus returned on close, Escape closes.
- **Quiet on Set:** after 150s idle on desktop. It sits *below* the header, so it quiets the reel without ever covering the only route to the work, and returning to the tab counts as activity — a deliberately parked tab never comes back to it.

**The diegetic test governs the copy too.** Nothing in these sequences says anything a camera, projector or lens would not: no "Konami code activated", no "click to dismiss".

## Do's and Don'ts

### Do:
- **Do** keep Tungsten Gold (#8B6914) at hairline scale — a 1px rule, a 9px label, a focus ring, one active word. Never a fill.
- **Do** butt work images edge to edge, separated by nothing thicker than a 1px #2a2a2a seam.
- **Do** build depth from scrims, 8% grain, vignettes and backdrop blur. Never a shadow.
- **Do** set every corner to 0 radius; reserve circles for optics and signals.
- **Do** reserve Cormorant Garamond for proper nouns, and JetBrains Mono for readings a machine would produce.
- **Do** keep transitions between 200ms and 1400ms on `ease` / `easeOut`, and stagger grid entrances at 40ms.
- **Do** honour `prefers-reduced-motion` in the component, not only in CSS. The global rule in [globals.css](app/globals.css) neutralises CSS transitions and keyframes, but it has no effect on Framer Motion's JS animations or on a `requestAnimationFrame` loop — those must branch on `useReducedMotion()` themselves. Every animated component on the home reel, the commercials grid and the photography grid now does.
- **Do** carry `data-cursor` on any new interactive surface so the custom cursor knows what it is over.
- **Do** measure the real header height at runtime when padding a page beneath it.
- **Do** keep new effects diegetic: if a camera, a projector or a lens doesn't do it, it doesn't belong.

### Don't:
- **Don't** introduce `box-shadow`, `border-radius`, pure #000 surfaces or pure #FFF text.
- **Don't** use HUD Amber, REC Red or STBY Green as interface colours — they are quarantined to the camera overlay.
- **Don't** extend the full HUD, framelines or timecode beyond the home reel. Mono machine-data type is available everywhere; the instrument layer is not.
- **Don't** underline a link or animate an underline in any state. Opacity 0.5 → 1.0 over 600ms is the entire hover language for text.
- **Don't** add gutters, cards, containers or a max-width column to a work grid.
- **Don't** set functional type tight — at 9–11px the tracking is 0.25em or wider.
- **Don't** restore the system cursor with `cursor: pointer` on new elements; the global rule is `cursor: none`.
- **Don't** add spring physics, bounce easing, parallax or scroll-jacking. Slow cinema, not app UI.
- **Don't** put a page title above a grid. The work identifies itself; the `<h1>` stays screen-reader-only.
- **Don't** let it drift toward an agency template, a SaaS product page, a stock-photography portfolio theme, or an effects-for-their-own-sake reel site.
