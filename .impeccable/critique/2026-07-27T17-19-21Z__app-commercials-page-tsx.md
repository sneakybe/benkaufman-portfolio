---
target: commercials
total_score: 16
max_score: 36
na_heuristics: 10
p0_count: 2
p1_count: 2
timestamp: 2026-07-27T17-19-21Z
slug: app-commercials-page-tsx
---
Method: dual-agent (A: a1931717cb527e59b · B: a6679db1d36f6cc69)

Target: `app/commercials/page.tsx` — the 28-project work grid and Vimeo lightbox. Mode: **Experience**.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 1 | No loading, empty or error state. A blank #111111 tile means "loading", "network blocked" and "dead Vimeo ID" identically, forever. |
| 2 | Match System / Real World | 4 | Contact sheet, frame numbers, client-above-title, projector gate, real credit block. The metaphor is right and consistently held. |
| 3 | User Control and Freedom | 2 | Escape and backdrop-click work; the 800ms warm-up can't be skipped, the projector hum can't be muted, and there's no way to reach the next film. |
| 4 | Consistency and Standards | 2 | Photography's lightbox has ← / → and a counter; this one — where multi-play is the KPI — has neither. Tiles are divs where the standard is a button. |
| 5 | Error Prevention | 1 | No `res.ok` check, no timeout, no retry (L461–467). AudioContexts constructed per open, never closed. Orphan logic hardcoded to 3 columns. |
| 6 | Recognition Rather Than Recall | 1 | Identifying 28 films requires hovering each in sequence and holding results in memory. On touch, client and title never appear at all. |
| 7 | Flexibility and Efficiency | 1 | Applicable and failing: a visitor here to watch several films has no accelerator of any kind — no keyboard path, no next-film, no deep link. |
| 8 | Aesthetic and Minimalist Design | 4 | Edge-to-edge, no page title, no chrome, no explanation. Genuinely the standard the brief asked for. |
| 9 | Error Recovery | 0 | There is no error handling on this surface. A dead or private ID yields a permanently blank tile, then an unframed Vimeo error inside the modal. |
| 10 | Help and Documentation | n/a | Experience surface; a numbered 16:9 contact sheet is self-evident to film people, and the system forbids explanatory chrome. |
| **Total** | | **16/36 (44%)** | **Poor band** |

Read that number for what it measures. Every point lost is robustness, flow or reach — not craft. The two heuristics that measure whether this was made by someone with taste both scored 4, and almost nothing else did.

## Design Specificity Verdict

**LLM assessment — the skin is authored; the machine underneath is a template.**

At rest this grid could not be lifted onto another portfolio without rewriting it: the 16:9 contact sheet with a 1px #2a2a2a seam and zero column gap, the two-digit frame number at 40% opacity *before* anyone touches anything, the client set above the title because the client is the credential, gold at 9px on a hairline scale, PLAY living in the cursor rather than as a glyph on the tile, the CREDITS drawer pulling real Vimeo credit blocks in mono. That is a specific point of view about who is looking, executed with unusual discipline.

Strip the paint and the interaction model is the default 2015 portfolio grid: `div` with `onClick`, hover-reveals-caption, click-opens-modal-iframe, Escape-closes. Nothing in that model was designed for a visitor whose job on this page is to watch several films in seven minutes. Every genuinely product-shaped affordance — next/prev, deep-linkable films, a watched marker, an identity readable without hovering — is absent, and every absence traces to the generic structure underneath.

The one place the authoring reaches past the skin, the projector warm-up (L241–265), is timed to a `setTimeout` chain rather than to the player reporting ready. The flicker is not caused by the machine coming up to speed; it is caused by 200ms elapsing, and it frequently resolves to a still-buffering black rectangle. That is precisely where a diegetic effect becomes the show-reel gimmick the design system names as a binding anti-reference.

**Verdict: top-decile specificity in the visual system, template-grade specificity in the interaction system — and the success metric lives in the interaction system.**

**Deterministic scan.** `detect.mjs` exit 2, **4 findings on the target file**, all advisory: `#FFFFFF` (L320), `24px` font-size (L357), `rgba(0,0,0,0.85)` (L411), `rgba(255,255,255,0.8)` (L422). Whole-`app` sweep for context: 38 findings across 6 files (page.tsx 21, photography 7, commercials 4, globals.css 3, about 2, Nav 1).

**Three of the four are false positives**, and the reason is instructive: L320 is the projector gate flash, explicitly sanctioned by the No-Pure Rule's named exceptions; L411 is the CREDITS panel, specified verbatim in DESIGN.md; L357 matches the `close-button.size` component token, which the detector's font-size rule can't see because it only reconciles against the typography ramp.

**One is real drift: L422, `rgba(255,255,255,0.8)`** — pure white text in the credits body, covered by no rule or token, and directly prohibited outside the three diegetic exceptions. `rgba(232,228,220,0.8)` is the in-system value and is already used two elements away at L387.

Also flagged for the record: `photography/page.tsx:133,199` `broken-image` are detector false positives — the regex is matching the literal string `<img>` inside code comments. And `globals.css:32,51` `overused-font` (Helvetica) contradicts the design system's own mandated `typography.label` stack.

**Visual overlays: none.** No browser automation is exposed in this session — no Playwright, Puppeteer or chrome-devtools MCP, and none in `node_modules`. No dev server was started, no injection was attempted, and **no user-visible overlay exists**. Everything below is source evidence and static analysis. Contrast figures are computed, not measured in a rendered page.

## Overall Impression

This is the best-crafted surface of its kind I've reviewed at this level of visual discipline and the least robust. It is beautiful and it is brittle, and both facts have the same root: enormous attention went into what the page looks like when everything works, and none into what it does when something doesn't — or when the visitor isn't using a mouse.

The single biggest opportunity is smaller than it sounds. This page's job is "plays several films". It currently optimises for "plays one film, if your mouse works, if Vimeo's oEmbed endpoint is reachable, and if you already know which one you want". Fixing the failure model and adding next/prev would move more of the metric than any visual change available.

## What's Working

**The frame number at rest (L152–169) is the best decision on the page.** It solves a real problem invisibly: with hover-only captions, a bare 16:9 grid has no rhythm and no sense of being a set. Two digits at 40% opacity turn it into a *numbered* contact sheet — the visitor understands the corpus is finite, ordered and curated before touching anything. It reads as instrumentation, not UI. Genuinely diegetic, in a way the warm-up isn't.

**The CREDITS drawer is the right third layer, in the right voice, from the right source.** A prodco MD's second question after "is this good" is "who made it". Pulling the real Vimeo `description` (L465) means the credit block is the one the film actually shipped with, not a marketing rewrite, and setting it in mono correctly classifies it as a machine reading. Available to the one visitor in five who wants it, invisible to the other four.

**Refusing a page title, a filter bar and a project count.** The `<h1>` is `sr-only` and the page goes straight into the grid (L489–490). That restraint is the clearest signal on the surface that this was made by someone who trusts the audience, and it's exactly what separates it from the agency-template anti-reference. The temptation to write "SELECTED WORK / 28 FILMS" above this grid must have been constant.

## Priority Issues

### [P0] No keyboard or assistive-technology user can play a single film
**What:** Tiles are `motion.div` with `onClick` and nothing else (L64–80) — no `role`, no `tabIndex`, no `onKeyDown`. Static sweep confirms: zero `tabIndex`, zero `role=`, zero key handlers across the file; the only `aria-*` in 542 lines is `aria-label="Close"` at L348. The lightbox has no `role="dialog"`, no `aria-modal`, no accessible name, doesn't move focus on open, doesn't trap it, doesn't restore it on close. Focus stays on `<body>`, so Tab inside an open film walks into the nav and the 28 tiles behind it. The iframe has no `title`.

**Why it matters:** The one action this surface exists to enable is unavailable via keyboard. A screen reader meets 28 headings and 28 images with no controls — it reads as an article, not a reel. The product record names keyboard-operable lightboxes as an existing floor commitment; this page doesn't meet it.

**Fix:** `role="button"`, `tabIndex={0}`, `aria-label="Play — {client}, {title}"` and an Enter/Space `onKeyDown` on each tile. On open: `role="dialog"`, `aria-modal="true"`, an accessible name, focus to the close button, Tab cycled within the dialog, focus restored to the originating tile on close. `aria-expanded` on the CREDITS toggle. A `title` on the iframe. The gold focus ring already exists in `globals.css:83` at 3.9:1 — it passes non-text contrast and needs nothing but something to attach to.

**Suggested command:** `/impeccable audit`

### [P0] The grid has no loading, empty or failure state — and it's all-or-nothing
**What:** 28 concurrent fetches fire on mount and resolve into a single `setVimeoData(map)` (L454–477). Nothing renders until the slowest of 28 completes. No `res.ok` check before `res.json()`, no timeout, no abort on unmount, no retry. Rejections are silently discarded (L469–473), leaving `thumbnail: undefined`, and `{thumbnail && …}` (L81) renders nothing — a bare #111111 rectangle, permanently, indistinguishable from still-loading.

**Why it matters:** This audience is disproportionately behind corporate networks and VPNs. If `vimeo.com/api/oembed.json` is proxied or blocked while `player.vimeo.com` stays reachable, the entire portfolio renders as 28 empty charcoal boxes — and every film behind them still plays perfectly. An MD gives that a seven-second look and leaves believing the site is broken. One hung request produces the same outcome.

**Fix:** Set state per request as each resolves so the grid fills progressively. Wrap each fetch in an `AbortController` timeout, check `res.ok`, and track a per-project `error` flag distinctly from `pending`. Give the pending tile something diegetic and honest — the frame number is already there; a #111111 bed with the client in mono at 9px reads as an unexposed frame on a contact sheet. On failure, keep the tile clickable with client and title shown permanently: the film still plays, so the tile must not look dead.

**Suggested command:** `/impeccable harden`

### [P1] The page is built for one play; the metric is several
**What:** No next/prev in the lightbox — while the photography lightbox has both, plus a counter. No URL per film: tiles are divs with no `href`, so nothing can be cmd-clicked, bookmarked or sent. No marker for what's been watched. An 800ms warm-up plus Vimeo's own load charged on every open. Closing is a hard cut back to an unlabelled grid with no positional memory (and the exit animation never runs — `AnimatePresence` at L284 sits *inside* the component the parent unmounts at L524).

**Why it matters:** Success is defined as playing several films, and the site sits inside a hiring conversation that continues over email. Right now an MD can't forward "watch the Jet2 and the John Lewis" — she can only send the grid and hope. Every additional play costs more friction than the last, which is exactly the wrong curve.

**Fix:** Add ← / → between films, matching the photography surface, with client and title set small in mono so the visitor always knows what's running. Route each film to `/commercials/[id]` (or at minimum sync a `?film=` param) so films are linkable and Back returns to the grid. Dim a watched tile's frame number from 0.4 to 0.15 — a diegetic "already screened" mark that costs one number. Lift `AnimatePresence` into the page component so closing has the same weight as opening.

**Suggested command:** `/impeccable shape`

### [P1] Identity is hover-only, and unreadable even when revealed
**What:** Client and title sit at `opacity: 0` until hovered (L112–150). On touch there is no hover, so on every phone and tablet the grid is 28 unlabelled stills with a two-digit number and nothing else — the client name is never displayed at all. When it is revealed on desktop it's 9px at 0.3em tracking in #8B6914 on a near-void scrim: **3.9:1 computed**, failing the 4.5:1 requirement for small text.

**Why it matters:** The design system states "the client comes first because the client is the credential." The credential is currently the smallest, dimmest, lowest-contrast, most-hidden text on the surface — and absent on mobile. Film people scan a reel by client first. Making them hover 28 times to do it, or making it impossible, is the highest-cost decision on the page.

**Fix:** Show the client at rest, permanently, bottom-left as the frame number's counterweight; keep the italic Cormorant title as the hover reveal. That inverts the disclosure so the identifying layer is free and the detail layer is earned, and it makes the grid scannable at a glance without spending any of the composition's restraint. Raise it to 10px and lift the value — parchment at 70%, reserving gold for the active tile — to clear 4.5:1. Under `@media (hover: none)`, pin client and title visible over a permanent short bottom scrim.

**Suggested command:** `/impeccable layout`

### [P2] Four concrete defects on the primary audience's exact configuration
**What:**
- **The player clips on common desktop windows.** The wrapper is `width: 100%; maxWidth: 1100px; aspectRatio: 16/9` (L309–314) with no `maxHeight`, inside a container padded `80px 40px 40px`. At 1100px the player is 619px tall; a 1440×720 window leaves 600px. The film is clipped top and bottom, split across both edges by `align-items: center`. That's a 13" MacBook with a dock.
- **Orphan logic uses the wrong column count.** `remainder = projects.length % 3` (L501) is computed against 3 at every breakpoint, but the grid drops to 2 columns at ≤1024px (L534). At tablet width you get tile 27 alone in a row *and* tile 28 spanning full width — the exact defect the logic exists to prevent.
- **The projector hum dies silently on the success path.** A new `AudioContext` is constructed on every open (L178) and never closed. Browsers cap concurrent contexts around six, so from roughly the seventh film the constructor throws into the bare `catch` at L214. The signature audio detail stops working precisely for the visitor doing the thing the site wants.
- **The close animation never plays.** Open is a 300ms fade plus a delayed 400ms scale; close is a hard cut, because `exit` is unreachable.

**Why it matters:** Individually small, collectively these are the seams a peer notices. A film person judging a film person's site reads a clipped frame and an asymmetric transition as carelessness about picture — the one thing this producer cannot afford to look careless about.

**Fix:** `maxHeight: calc(100vh - 120px)` on the player, width derived from the aspect ratio. Derive `remainder` from the live column count, or move orphan handling into CSS per breakpoint. Hold one module-scope `AudioContext` and `resume()` it per play. Lift `AnimatePresence` into the page component.

**Suggested command:** `/impeccable polish`

## Persona Red Flags

**Sam (keyboard / screen reader).** Cannot play a single film. Tab never reaches a tile. If it did, the lightbox wouldn't announce itself, receive focus, trap it, or return it. Separately: `globals.css:19` applies `cursor: none !important` to `*, *::before, *::after` with no `hover: none` or reduced-motion escape. The OS pointer is removed site-wide and replaced by a 6px dot with a ring lerping behind it at 0.15 plus three velocity-scaled trail dots. The reduced-motion block at `globals.css:147` kills the CSS spin but has no effect on the JS lerp-chase in `Cursor.tsx:99–147` — a vestibular-sensitive user gets a pursuing ring they cannot switch off, and anyone using a magnifier or with a motor tremor loses their pointer entirely.

**Casey (distracted, mobile).** Gets the worst version of the page. 28 stills, one per screenful, with zero client names — the credential layer is hover-gated and hover doesn't exist. Nothing appears until the slowest of 28 parallel requests resolves, over cell data, with no skeleton. Then 4–8MB of 1280px JPEGs land at once with no `loading="lazy"`, no `sizes`, no fade. Tapping is blind. Once open, the lightbox keeps `padding: 80px 40px 40px` (L301), so on a 390px phone the film is ~310×174px floating in black with 40px of dead margin either side. She taps one film, doesn't recognise it, and leaves.

**Riley (stress tester).** Corporate proxy blocks the oEmbed endpoint: 28 blank tiles, no error, films playable behind them. Seven films in: the hum silently stops forever. Resize to 1440×700: clipped film. Sit at 900px: tile 27 orphaned *and* tile 28 full-bleed. Cmd-click a tile: nothing, it's a div. Copy the URL to send a colleague: gets `/commercials`, not a film. Private or region-locked ID: blank tile, then an unframed Vimeo error inside the modal. Reduced motion on: warm-up correctly skipped, cursor still chases.

**Marina, MD at a London prodco (derived from the product record).** Opens Ben's CV link on a work laptop, 1440×720, four tabs, seven minutes between calls, speakers on in an open-plan office. In order of what she notices: the projector hum fires unrequested at the desks around her; she can't read 9px gold client names at desk distance; scanning the client roster needs 28 individual hovers, which she won't do; she watches two films and can't send either to her head of production; and the meta description she arrived from promises John Lewis, Chanel, Dior, Dyson, Aston Martin, Asahi and EE, while the grid contains John Lewis and Dyson and none of the other five. She scans for Chanel, doesn't find it, and quietly downgrades the claim.

## Minor Observations

- **L15** — "Womens Rugby World Cup" is missing its apostrophe, set in gold on tile 02. **L34** reads "Savana Loco" while **L38** reads "Savanna Loco" — the same client spelled two ways, four rows apart. Both need your confirmation before touching; both are exactly what this audience notices.
- **L148** — `vimeoTitle ?? project.title` means the hand-authored title is overridden by whatever is currently on Vimeo. The most editorial text on the surface is remote-controlled and can change without a deploy, and Vimeo titles often carry slate junk ("JET2 | DIRECTORS CUT | 60 | v4"). Prefer the local array; treat oEmbed as fallback.
- **L422** — `rgba(255,255,255,0.8)` in the credits body is real drift from the No-Pure Rule. `rgba(232,228,220,0.8)` is already in use two elements away.
- **L354, L379** — `cursor: "pointer"` on both lightbox buttons is dead code, overridden by the global `cursor: none`, and contradicts the system's own rule.
- **L439** — `navH` defaults to 113 and is measured on mount plus resize. Cormorant loads with `display: "swap"`, so the logo lockup's height can change *after* measurement, leaving the grid's top padding stale until the next resize. Use a `ResizeObserver` on the header, or `document.fonts.ready`.
- **L462** — thumbnails are requested at `width=1280` for tiles that render ~480px wide, and the same 1280px asset is stretched across the ~1440px full-span orphan tile. The tile with the most visual weight on the page carries its softest image.
- **L83–95** — plain `<img>` with no `loading`, `sizes`, `decoding` or `onError`, ×28.
- **Cursor.tsx:152–176** — `querySelectorAll` plus `getBoundingClientRect` on every match, inside the RAF loop, running forever on every page. A forced synchronous layout at 60fps. Cache the node list and rects; invalidate on scroll/resize.
- The entrance stagger (600ms fade, 40ms apart) finishes at ~1.7s on an empty grid, then all 28 thumbnails pop in simultaneously with no fade of their own. The one deliberately patient element is spent on nothing, and the arrival of the actual work is unstaged.

## Questions to Consider

1. If the success metric is "plays several films", why does the *photography* lightbox have ← / → and a `04 / 34` counter, and this one — the surface the metric is actually about — have neither? Which of the two pages got the product thinking?
2. The projector flicker fires on a `setTimeout` chain, not on the player reporting ready. A real projector flickers because the machine is coming up to speed; this one flickers because 200ms elapsed, and it often resolves to a still-buffering black rectangle. If the effect is no longer caused by the thing it depicts, is it still diegetic — or is it the anti-reference?
3. The system says the client is the credential, then makes it the smallest, dimmest, lowest-contrast, most-hidden text on the page, and invisible on touch. What does this grid look like if the credential is what you can read at rest and the title is what you hover for?
4. An MD watches two films and wants to send both to her head of production. She can't — no film has a URL. Is this a portfolio, or a screening room you have to be standing in?
