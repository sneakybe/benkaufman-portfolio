# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: managing directors and heads of production at commercial production companies, and EPs doing the hiring. They arrive already knowing the name — a referral, a CV, a conversation in progress — and they are deciding whether Ben's work sits at their standard and whether he can carry their campaigns. They give it minutes, not a session, usually on desktop, usually while doing three other things.

Other audiences (agency producers and creatives, brand-side marketing clients, directors and crew) visit but were not confirmed as the group the site is built to convince. Do not design for them at the primary audience's expense.

## Product Purpose

A portfolio for Ben Kaufman, Executive Producer in commercial film. It exists so that the people above watch the work.

Success is engagement with the films themselves: a visitor gets into the commercials grid and plays several. It is explicitly not form fills, not lead capture, and not time-on-site for its own sake. Contact is the visitor's next move, made off-site, after the work has done its job.

## Positioning

Sixteen-plus years producing commercials, content and stills for globally recognised brands — John Lewis, Chanel, Dior, Dyson, Aston Martin, Asahi, World Rugby, JBL, EE — with campaigns led across the UK, Europe, Asia, South America and Africa, working at the intersection of production companies and agencies.

The part a neighbouring producer could not truthfully copy: that international span from both sides of the prodco/agency line, paired with a self-taught photographic practice exhibited at Cannes Lions and selected by Rankin. He is a producer with a demonstrable eye, and the site can show the eye rather than assert it.

## Operating Context

- Every commercial is hosted on Vimeo and plays in-page; the films are the content, and nothing should stand between a visitor and pressing play.
- Visitors are film people judging film work. They read a grid of 28 commercials the way the industry reads a reel — by client, by craft, fast.
- Evaluation is often comparative and happens alongside other producers' sites and reels.
- The site is one artefact in a hiring conversation that continues over email.

## Capabilities and Constraints

- Four routes: `/` (reel-led home), `/commercials`, `/photography`, `/about`.
- Content is hardcoded in the source, not a CMS. The 28 commercials live as a typed array in [app/commercials/page.tsx](app/commercials/page.tsx); the 34 photographs live as an array in [app/photography/page.tsx](app/photography/page.tsx) with files under [public/photography/](public/photography/).
- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind v4, Framer Motion, `@vimeo/player`. Video delivery depends entirely on Vimeo embeds and their availability.
- Target domain is benkaufman.co (declared in [app/layout.tsx](app/layout.tsx) metadata).
- Undecided / not established: analytics, a CMS or any client-editable content path, additional pages, and whether the site should ever carry client logo marks or name the agencies and production companies behind each film. Do not introduce any of these without asking.

## Brand Commitments

- Name and title: "Ben Kaufman", "Executive Producer".
- Contact is email only — `hello@benkaufman.co`. No phone, no contact form, no social handles, no agent or representation listing. This is fixed.
- The photography practice's own home is www.benkaufmanphotography.com; the on-site grid points there rather than replacing it.
- Photography is supporting evidence of visual judgement, not a co-equal offer. It proves the eye behind the producing; it never competes with the film work for primacy.
- The bio paragraph in [app/about/page.tsx](app/about/page.tsx) may be rewritten, but every factual claim inside it (years, brands, territories, Cannes Lions, Rankin) is true and must survive intact.

## Evidence on Hand

- 28 commercials with real client attributions and Vimeo IDs — Jet2, Women's Rugby World Cup, Allan Gray, Galderma, FedEx, Coventry Building Society, Chicken Licken, Dyson, John Lewis, Cadbury 5Star, Cell C, Vodacom, Supersport and others. **This set is fixed**: no project added, removed, reordered into a different claim, or re-attributed without Ben.
- 34 photographs in [public/photography/](public/photography/), shot across Scotland, South Africa, London, Thailand, Greece, Spain, Liberia, Zimbabwe and the US.
- Headshot: [public/images/ben-kaufman.jpg](public/images/ben-kaufman.jpg).
- Real credentials: exhibited at Cannes Lions; selected by British photographer Rankin.
- Two ARRI camera-monitor reference images in [reference/](reference/) used as source material for interface detailing.
- **Absent — must never be fabricated:** testimonials, quotes, awards lists, press coverage, case studies, metrics, client logo files, and named agency or production company affiliations.

## Product Principles

1. **The work outranks the interface.** Any element that delays or distracts from pressing play is a cost, and it has to earn its place against the film it sits in front of.
2. **Credibility is shown, never claimed.** No superlatives, no "award-winning", no invented proof. The 28 films and the photographs are the argument.
3. **Judged by film people, against film people's sites.** The bar is what a prodco MD sees every week. Generic portfolio conventions read as amateur here.
4. **Photography serves the producing.** It demonstrates the eye; it never reframes him as primarily a photographer.
5. **Say less.** A producer's site earns trust by restraint — the industry reads over-explanation as inexperience.

## Accessibility & Inclusion

No formal standard has been set with Ben, but the existing build already commits to reduced-motion support, a skip link, and keyboard-operable lightboxes. Treat those as a floor: motion-heavy and cursor-driven treatments must keep a working keyboard and reduced-motion path.
