# Garment Foundry — local build & run

This folder contains your `garment-foundry` repo with the **Atelier Reel header** integrated into the home page. The production build is included under `frontend/build/`, so you can preview without any setup. For development with hot reload, use `npm start` (instructions below).

---

## What was changed

| File | Change |
|---|---|
| `frontend/src/components/HeroSlider.jsx` | **New** — the Atelier Reel slider (12 tech-pack tearsheets, leader line, production-card HUD, brand-pillars strip, capabilities ribbon). |
| `frontend/src/components/HeroSlider.css` | **New** — scoped styles. Reuses the site's existing `--gf-*` brand tokens, Cinzel + Montserrat fonts, and motion variables. |
| `frontend/src/pages/Home.jsx` | The original HERO section (lines 18–66) was replaced with `<HeroSlider />`. Everything below the hero (trust marquee, statement, capabilities grid, categories, process, principles, etc.) is **unchanged**. |
| `frontend/public/tearsheets/` | **New** — 12 PNG tearsheets (Emberline, Monogram, Glacier, Atelier, Precision Zip, Craftsmanship, Precision Rib, Purpose, Foundry Signature, Heritage, Sourcing, Sandstorm). |
| `frontend/package.json` | Removed the `@emergentbase/visual-edits` devDependency — that's an Emergent platform–only tool that 403s when fetched from outside the Emergent registry, and it isn't needed to build or run the site. |
| `frontend/package-lock.json` | Updated to drop the same package. |

**What's preserved as-is:**

- `Navbar.jsx` (sticky top nav with `Request a Quote` CTA → `/quote`)
- Every other page (`/about`, `/capabilities`, `/categories`, `/faqs`, `/contact`, `/quote`, etc.)
- All existing CTAs, brand tokens, fonts, motion variables, and routing
- The whole `backend/` folder
- Admin pages

The slider's per-piece CTAs deliberately match the rest of the site:

- Primary CTA: **Request a Quote** → `/quote`
- Secondary: **Explore capabilities** → `/capabilities`
- Production-card chip: **Request the brief →** → `/quote`

All 12 pieces have **Origin: Pakistan** baked into their production-card specs.

---

## Option A — view the production build immediately (no install)

The production build is already compiled inside `frontend/build/`. Serve it with any static file server.

**Node (recommended):**

```bash
cd frontend/build
npx serve -s . -l 3000
```

Then open `http://localhost:3000` in your browser.

**Python (no Node needed):**

```bash
cd frontend/build
python3 -m http.server 3000
```

Then open `http://localhost:3000`.

> Note: with `python -m http.server`, only the home page (`/`) will load via direct navigation; client-side routes like `/about` need to be reached by clicking nav links rather than typed into the address bar. `npx serve -s` does SPA fallback automatically and handles all routes correctly.

---

## Option B — dev server with hot reload (for editing)

```bash
cd frontend
npm install --legacy-peer-deps          # installs ~1500 deps; ~30s first time
npm start                                # starts dev server on http://localhost:3000
```

The `--legacy-peer-deps` flag is required because `react-day-picker@8.10.1` (already in the project) declares a peer dep on `date-fns@^3` while the project ships `date-fns@^4`. The flag tells npm to install anyway; yarn does this by default if you prefer `yarn install` + `yarn start`.

If `npm start` complains about React Hook ESLint warnings (the pre-existing one in `AdminQuotes.jsx`), prefix with:

```bash
DISABLE_ESLINT_PLUGIN=true npm start
```

---

## Option C — rebuild from source

```bash
cd frontend
npm install --legacy-peer-deps
DISABLE_ESLINT_PLUGIN=true npm run build
npx serve -s build -l 3000
```

`DISABLE_ESLINT_PLUGIN=true` avoids being blocked by a pre-existing ESLint warning in `src/admin/AdminQuotes.jsx` (missing `load` dep in a `useEffect`). The warning was already there before this work — not introduced by the new header.

---

## What you'll see when you open the home page

1. The existing **sticky navbar** at the top (unchanged): logo · About · Capabilities · Categories · FAQs · Contact · **Request a Quote** CTA.
2. **The Atelier Reel** — a full-stage hero slider showing tech-pack tearsheet 1/12 (Emberline Utility Hoodie in burnt terracotta), auto-advancing every 7 seconds.
3. On the **left rail**: vertical chapter counter `PIECE 01 / 12`, ruler ticks, vertical `GF · ATELIER` stamp.
4. In the **centre meta column**: collection name eyebrow, big Cinzel headline (the piece name), one-line copy, `Request a Quote` + `Explore capabilities` CTAs.
5. On the **right side**: the transparent **Production Card HUD** with MOQ / Sample / Origin **(Pakistan)** / Certified / Restock / RFQ + a `Request the brief →` chip.
6. A **dotted leader line** connects the card's left edge to a labelled anchor on the tearsheet's tech-view garment — the label reads `PIECE 01` matching the card title.
7. Below the stage: **brand pillars strip** (Craftsmanship · Precision · Global Sourcing · Reliability · Partnership · Purpose) in Cinzel caps with seam-line separators.
8. **Thumbnail rail** with all 12 pieces — click any to jump.
9. **Capabilities ribbon** — 10 chips with the SVG icons that already lived in `/public/icons/`. Each chip links to `/capabilities`.
10. **Stitched progress bar** at the very bottom ticks across as the slide auto-advances.

Use ← and → arrow keys to walk through the pieces. Hover the stage to pause auto-advance.

---

## If something looks wrong

- **Tearsheets don't load** → confirm `frontend/public/tearsheets/` has 12 PNGs (it does). If running `npm start`, sometimes CRA caches stale; stop the dev server, delete `node_modules/.cache`, restart.
- **Fonts look generic (no Cinzel / Montserrat)** → blocked Google Fonts request (offline?). The fonts are imported at the top of `src/index.css` via `@import url('https://fonts.googleapis.com/css2?...')`. Self-host them or check the request in DevTools.
- **Card looks opaque, hiding the tearsheet** → your browser may not support `backdrop-filter`. Modern Chrome, Edge, Safari, Firefox all do. The fallback is still legible because the card also carries `rgba(0,0,0,.20)` as a solid backstop.

---

## Where the slider data lives

If you want to change a piece's spec, copy, anchor coordinate, or image, edit the `PIECES` array at the top of `frontend/src/components/HeroSlider.jsx`. Each entry takes:

```jsx
{
  key:        "emberline",                                  // unique slug
  label:      "The Emberline Utility Hoodie",               // headline + thumb label
  collection: "Emberline · GF-EMU-001",                     // eyebrow + card sub
  img:        "/tearsheets/01_emberline_utility_hoodie.png",
  anchor:     [225, 300],                                   // [x, y] in 1000×700 SVG viewBox — where the leader lands
  spec: {
    MOQ:       "100+ pcs",
    Sample:    "12–16 days",
    Origin:    "Pakistan",
    Certified: "GRS · OEKO-TEX",
    Restock:   "7–10 days",
    RFQ:       "Same-day reply",
  },
  copy: "430gsm garment-dyed utility fleece in burnt terracotta. Antique brass hardware, hidden kangaroo, sleeve zip.",
}
```

— *Integrated by Cowork · 2026-05-20*
