# Nike Clone 3D — Design

## Intent / why
Founder wants a fullstack-feeling, 3D-animated business website like Nike,
published on their GitHub (bouhamdi22us-arch) with a public URL. Audience: general
consumers / portfolio showcase. Spanish-language UI acceptable; keep copy in English
(Nike-style) with Spanish where natural. Personal practice project, not commercial use.

## Goals
- Public site at https://bouhamdi22us-arch.github.io/<repo>/ (GitHub Pages)
- Nike-clone aesthetic: bold typography, black/white, volt accent, full-bleed imagery
- 3D animated hero: procedural sneaker built with three.js / @react-three/fiber,
  slow rotation + float, scroll-linked motion
- Full simulated store: product catalog (grid + category filter), product detail
  modal/page, cart with localStorage persistence, slide-out cart drawer,
  simulated checkout flow (form → confirmation, no real payment)
- Responsive, accessible-ish (focus states, alt text, reduced-motion respect)

## Non-goals / anti-goals
- No real payments, no real backend, no real user accounts
- No actual Nike trademark misuse beyond personal-practice clone; include footer
  disclaimer "Not affiliated with Nike, Inc."
- No external paid assets; all imagery procedural/CSS/SVG/stock-free

## Constraints
- GitHub Pages: static only → Vite `base` must be `/<repo>/`, build output `dist/`,
  deploy via gh-pages branch or GitHub Actions (use Actions workflow with peaceiris or
  official pages action — prefer `actions/deploy-pages` with static upload, needs
  `permissions: pages: write`). Simpler and robust: `gh-pages` npm package pushing dist/.
- Repo must be public for free Pages.
- 3D must work without downloading GLB models (licensing) → procedural geometry.

## Approach
Vite + React + TypeScript + three via @react-three/fiber + @react-three/drei.
Tailwind optional — use plain CSS modules / a single global CSS for fewer deps.
State: React context for cart; localStorage sync.

## Parts
1. Scaffold Vite React-TS app; set `base: '/<repo>/'`
2. Design system: CSS variables, typography (system fonts + "Archivo Black"-like via
   fontsource? avoid network fonts at runtime — use system stack with heavy weights)
3. 3D hero: procedural sneaker (sole, upper, swoosh-like check made of extruded shape —
   generic check mark, not Nike logo per se... it IS a Nike clone; a swoosh-like shape is
   fine for personal practice with disclaimer), floating + rotate, pointer parallax
4. Sections: hero, featured products, category browse, story/editorial, newsletter signup
5. Shop: ~12 products with SVG-rendered shoe art (generated gradients), filter by category
6. Cart drawer + checkout modal with fake order confirmation (order number)
7. Footer disclaimer, README, LICENSE note
8. Deploy: GitHub Actions with actions/deploy-pages (single chosen path). Workflow has
   `permissions: pages: write, id-token: write`. Pages source set to "GitHub Actions" via
   `gh api` BEFORE first push. Repo created public under bouhamdi22us-arch (verified authed).
   Vite `base: '/nike-clone-3d/'` matches repo name exactly.
9. QA reality: `npm run build` + curl asset checks + code review; no headless browser
   claimed unless available. Reduced-motion gates rotation, float AND parallax.
10. Product detail = modal (no router, no Pages refresh-404). Fonts = system stack.
    Scroll-linked 3D dropped (over-scope); hero = pointer parallax + idle float.

## QA
- `npm run build` passes; no console errors on load (spot check via node/curl on built html)
- Pages URL returns 200 and contains root div + assets
- Cart add/remove persists across reload (logic reviewed)
- reduced-motion media query disables 3D auto-rotation

## Open / my calls
- Repo name: `nike-clone-3d` (my call)
- Language of UI: English with Nike tone (my call)
- No real backend; "fullstack" = full client-side app with simulated server (per founder choice)
