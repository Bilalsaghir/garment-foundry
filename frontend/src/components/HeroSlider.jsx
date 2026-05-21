import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { CAPABILITIES } from "@/lib/content";
import "./HeroSlider.css";

/**
 * HeroSlider — "The Atelier Reel"
 *
 * Replaces the original home-page hero. Twelve real tech-pack tearsheets cycle
 * past as the editorial backdrop, with a transparent "production card" HUD on
 * the right and a single dotted leader line that names the piece being specced.
 *
 * - CTAs intentionally match the existing brand voice: Request a Quote (primary)
 *   and Explore capabilities (secondary), both link to the existing routes.
 * - All pieces are manufactured in Pakistan (per current sourcing reality).
 * - Uses brand tokens already defined in src/index.css (--gf-black, --gf-paper…)
 *   and the existing Cinzel / Montserrat font load.
 */

const PIECES = [
  { key: "emberline", label: "The Emberline Utility Hoodie", collection: "Emberline · GF-EMU-001",
    img: "/tearsheets/01_emberline_utility_hoodie.webp", anchor: [225, 300],
    spec: { MOQ: "100+ pcs", Sample: "12–16 days", Origin: "Pakistan", Weight: "430 GSM", Restock: "7–10 days", RFQ: "Same-day reply" },
    copy: "430gsm garment-dyed utility fleece in burnt terracotta. Antique brass hardware, hidden kangaroo, sleeve zip." },
  { key: "monogram", label: "The Monogram Cargo Hoodie", collection: "Monogram Utility · GF-MCH-016",
    img: "/tearsheets/02_monogram_cargo_hoodie.webp", anchor: [225, 300],
    spec: { MOQ: "80+ pcs", Sample: "14–18 days", Origin: "Pakistan", Weight: "440 GSM", Restock: "7–10 days", RFQ: "Same-day reply" },
    copy: "440gsm heavy fleece, washed black. Snap-flap front cargo pocket, GF metal tab, reinforced seams throughout." },
  { key: "glacier", label: "The Glacier Loopback Crew", collection: "Glacier · GF-GLC-005",
    img: "/tearsheets/03_glacier_loopback_crew.webp", anchor: [225, 300],
    spec: { MOQ: "100+ pcs", Sample: "10–14 days", Origin: "Pakistan", Weight: "420 GSM", Restock: "5–7 days", RFQ: "Same-day reply" },
    copy: "420gsm 100% cotton loopback. Glacier blue body, spruce contrast collar tape, hidden side zip pocket." },
  { key: "atelier", label: "The Atelier Loopback Crew", collection: "Atelier · GF-ALC-003",
    img: "/tearsheets/04_atelier_loopback_crew.webp", anchor: [225, 300],
    spec: { MOQ: "100+ pcs", Sample: "10–14 days", Origin: "Pakistan", Weight: "430 GSM", Restock: "5–7 days", RFQ: "Same-day reply" },
    copy: "430gsm cotton loopback, heather ash with black contrast trim. GF chest embroidery, woven label, tailored finish." },
  { key: "precision-zip", label: "The Precision Zip Hoodie", collection: "Precision · GF-PZH-002",
    img: "/tearsheets/05_precision_zip_hoodie.webp", anchor: [225, 310],
    spec: { MOQ: "80+ pcs", Sample: "12–16 days", Origin: "Pakistan", Weight: "400 GSM", Restock: "7–10 days", RFQ: "Same-day reply" },
    copy: "400gsm brushed fleece, washed charcoal. Two-way YKK zip with branded puller, split kangaroo, coverstitch seams." },
  { key: "carpenter", label: "The Craftsmanship Carpenter Pant", collection: "Craftsmanship · GF-CCP-007",
    img: "/tearsheets/06_craftsmanship_carpenter_pant.webp", anchor: [225, 350],
    spec: { MOQ: "80+ pcs", Sample: "14–18 days", Origin: "Pakistan", Weight: "360 GSM", Restock: "7–10 days", RFQ: "Same-day reply" },
    copy: "360gsm cotton canvas, washed black. Double knee panel, hammer loop, branded rivet, crotch gusset, bartack reinforce." },
  { key: "rib-cardigan", label: "The Precision Rib Zip Cardigan", collection: "Precision · GF-PRC-008",
    img: "/tearsheets/07_precision_rib_zip_cardigan.webp", anchor: [225, 310],
    spec: { MOQ: "100+ pcs", Sample: "14–18 days", Origin: "Pakistan", Weight: "320 GSM", Restock: "10–14 days", RFQ: "Same-day reply" },
    copy: "320gsm 72% Viscose / 28% Nylon. Vertical rib, shaped waist, mock collar, GF tonal monogram. Women XXS–XL." },
  { key: "thermal", label: "The Purpose Thermal Long Sleeve", collection: "Purpose · GF-PTL-011",
    img: "/tearsheets/08_purpose_thermal_long_sleeve.webp", anchor: [225, 310],
    spec: { MOQ: "120+ pcs", Sample: "14–18 days", Origin: "Pakistan", Weight: "220 GSM", Restock: "7–10 days", RFQ: "Same-day reply" },
    copy: "220gsm Cotton / Modal / Elastane brushed rib. Raglan shoulder, thumbhole cuff, flatlock seams. Warm grey." },
  { key: "signature", label: "The Foundry Signature Hooded", collection: "Foundry Core · GF-FSH-001",
    img: "/tearsheets/09_foundry_signature_hoodie.webp", anchor: [225, 300],
    spec: { MOQ: "100+ pcs", Sample: "10–14 days", Origin: "Pakistan", Weight: "420 GSM", Restock: "5–7 days", RFQ: "Same-day reply" },
    copy: "420gsm 100% cotton brushed fleece, washed stone. Double-layer hood, GF chest embroidery, woven neck label." },
  { key: "heritage", label: "The Heritage Cardigan", collection: "Heritage · GF-HCD-014",
    img: "/tearsheets/10_heritage_cardigan.webp", anchor: [225, 310],
    spec: { MOQ: "80+ pcs", Sample: "18–22 days", Origin: "Pakistan", Weight: "340 GSM", Restock: "14–18 days", RFQ: "Same-day reply" },
    copy: "340gsm merino-blend knit, charcoal marl. V-neck placket, horn buttons, GF embroidery, fully-fashioned seams." },
  { key: "polo", label: "The Sourcing Pique Polo", collection: "Sourcing · GF-SPP-004",
    img: "/tearsheets/11_sourcing_pique_polo.webp", anchor: [225, 295],
    spec: { MOQ: "150+ pcs", Sample: "7–10 days", Origin: "Pakistan", Weight: "240 GSM", Restock: "5–7 days", RFQ: "Same-day reply" },
    copy: "240gsm mercerised cotton pique. Three-button placket, branded resin buttons, GF monogram, side vent." },
  { key: "sandstorm", label: "The Sandstorm Convertible Cargo", collection: "Sandstorm · GF-SCP-007",
    img: "/tearsheets/12_sandstorm_cargo_pant.webp", anchor: [225, 350],
    spec: { MOQ: "80+ pcs", Sample: "16–20 days", Origin: "Pakistan", Weight: "245 GSM", Restock: "10–14 days", RFQ: "Same-day reply" },
    copy: "245gsm Cotton / Nylon Ripstop, dusty teal with saffron 3D cargo. Zip-off knee, webbing belt, articulated knee." },
  { key: "riviera-polo", label: "The Riviera Piqué Polo", collection: "Riviera · GF-RPP-013",
    img: "/tearsheets/13_riviera_pique_polo.webp", anchor: [225, 295],
    spec: { MOQ: "150+ pcs", Sample: "7–10 days", Origin: "Pakistan", Weight: "240 GSM", Restock: "5–7 days", RFQ: "Same-day reply" },
    copy: "240gsm mercerised cotton piqué, navy. Rib collar, three-button placket, tonal GF chest monogram." },
  { key: "windsor-jacket", label: "The Windsor Interlock Track Jacket", collection: "Windsor · GF-WTJ-014",
    img: "/tearsheets/14_windsor_track_jacket.webp", anchor: [225, 300],
    spec: { MOQ: "100+ pcs", Sample: "12–16 days", Origin: "Pakistan", Weight: "310 GSM", Restock: "7–10 days", RFQ: "Same-day reply" },
    copy: "310gsm interlock, navy with cream contrast tape. Premium YKK zip, branded puller, stand collar, GF tonal monogram." },
  { key: "camden-hoodie", label: "The Camden Panelled Hoodie", collection: "Camden Series · GF-CPH-015",
    img: "/tearsheets/15_camden_panelled_hoodie.webp", anchor: [225, 305],
    spec: { MOQ: "80+ pcs", Sample: "14–18 days", Origin: "Pakistan", Weight: "420 GSM", Restock: "10–14 days", RFQ: "Same-day reply" },
    copy: "420gsm Cotton / Polyester fleece, multi-panel construction. Contrast side panels, structured hood, GF metal tab." },
  { key: "shoreditch-hoodie", label: "The Shoreditch Acid-Wash Hoodie", collection: "Shoreditch Series · GF-SAH-016",
    img: "/tearsheets/16_shoreditch_acidwash_hoodie.webp", anchor: [225, 300],
    spec: { MOQ: "80+ pcs", Sample: "14–18 days", Origin: "Pakistan", Weight: "380 GSM", Restock: "10–14 days", RFQ: "Same-day reply" },
    copy: "380gsm brushed fleece, controlled acid wash. Double-layer hood, metal-tip drawcords, rib hem shape retention." },
  { key: "kingsroad-hoodie", label: "The Kings Road Cropped Hoodie", collection: "Kings Road Series · GF-KRC-017",
    img: "/tearsheets/17_kingsroad_cropped_hoodie.webp", anchor: [225, 280],
    spec: { MOQ: "100+ pcs", Sample: "12–16 days", Origin: "Pakistan", Weight: "380 GSM", Restock: "7–10 days", RFQ: "Same-day reply" },
    copy: "380gsm premium cotton jersey, taupe. Cropped relaxed fit, wide rib hem, structured hood, soft brushed interior. Women XS–XL." },
];

const PILLARS = ["Craftsmanship", "Precision", "Global Sourcing", "Reliability", "Partnership", "Purpose"];

export default function HeroSlider() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef(null);
  const thumbsRef = useRef(null);
  const N = PIECES.length;

  const go = useCallback((n) => setIdx(((n % N) + N) % N), [N]);

  // Auto-advance every 7s; pause on hover.
  // Capture scroll position before index change and restore after React renders
  // to prevent the page from auto-scrolling when the carousel advances.
  useEffect(() => {
    if (paused) return undefined;
    const t = setInterval(() => {
      const scrollY = window.scrollY;
      setIdx((i) => (i + 1) % N);
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    }, 7000);
    return () => clearInterval(t);
  }, [paused, N]);

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") go(idx - 1);
      if (e.key === "ArrowRight") go(idx + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, go]);

  // Centre the active thumb inside the thumb-rail — horizontal only.
  //
  // Element.scrollTo({behavior:"smooth"}) can compose a viewport scroll when
  // the target element is offscreen (i.e. the rail is below the fold). The
  // page then jumps back to the hero every time the slider auto-advances.
  // The bullet-proof fix is to set `scrollLeft` directly. The legacy property
  // setter touches only the element's own scroll position; the browser cannot
  // re-interpret it as "bring this element into view".
  //
  // Plus three guards: (1) skip if the rail doesn't overflow, (2) skip if the
  // active thumb is already visible inside the rail, (3) requestAnimationFrame
  // so we don't fight React's commit phase.
  // Also restore page scroll position to prevent unwanted scroll jumps.
  useEffect(() => {
    const rail = thumbsRef.current;
    if (!rail) return;
    if (rail.scrollWidth <= rail.clientWidth) return;
    const active = rail.children[idx];
    if (!active) return;
    const railLeft   = rail.scrollLeft;
    const railRight  = railLeft + rail.clientWidth;
    const activeLeft = active.offsetLeft;
    const activeRight = activeLeft + active.clientWidth;
    if (activeLeft >= railLeft && activeRight <= railRight) return;
    const target  = activeLeft - (rail.clientWidth - active.clientWidth) / 2;
    const clamped = Math.max(0, Math.min(target, rail.scrollWidth - rail.clientWidth));
    const scrollY = window.scrollY;
    requestAnimationFrame(() => {
      rail.scrollLeft = clamped;
      window.scrollTo(0, scrollY);
    });
  }, [idx]);

  const piece = PIECES[idx];
  const [ax, ay] = piece.anchor;
  const ox = 780, oy = 350, bx = 480;
  const leaderPath = `M ${ox} ${oy} L ${bx} ${oy} L ${bx} ${ay} L ${ax} ${ay}`;
  const pieceNum = String(idx + 1).padStart(2, "0");

  return (
    <section
      ref={stageRef}
      data-testid="hero-slider"
      className="gf-hero-slider relative overflow-hidden bg-[var(--gf-black)] text-[var(--gf-paper)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="gf-hs-slides">
        {PIECES.map((p, i) => (
          <div key={p.key} className={`gf-hs-slide ${i === idx ? "is-active" : ""}`} aria-hidden={i !== idx}>
            <img className="gf-hs-photo" src={p.img} alt={`${p.label} — Garment Foundry tech pack`} loading={i === 0 ? "eager" : "lazy"} decoding="async" fetchpriority={i === 0 ? "high" : "low"} />
            <div className="gf-hs-scrim" />
          </div>
        ))}
      </div>

      {/* Layout: 3-col grid (rail · meta · production card) sits on top of slides */}
      <div className="gf-hs-grid">
        {/* LEFT RAIL */}
        <aside className="gf-hs-rail">
          <span className="gf-hs-count">PIECE <b>{pieceNum}</b> / {String(N).padStart(2, "0")}</span>
          <span className="gf-hs-ticks" aria-hidden>
            {Array.from({ length: 13 }).map((_, i) => <i key={i} />)}
          </span>
          <span className="gf-hs-stamp">GF · ATELIER</span>
        </aside>

        {/* META */}
        <div className="gf-hs-meta">
          <span className="overline gf-fade-up">{piece.collection}</span>
          <h1 className="gf-hs-h1 font-display gf-fade-up gf-delay-100">{piece.label}</h1>
          <p className="gf-hs-copy font-body gf-fade-up gf-delay-300">{piece.copy}</p>
          <div className="gf-hs-cta-row gf-fade-up gf-delay-500">
            <Link to="/quote" data-testid="hero-quote-btn" className="gf-hs-cta-primary">
              Request a Quote <ArrowRight size={14} className="ml-3" />
            </Link>
            <Link to="/capabilities" data-testid="hero-capabilities-btn" className="gf-hs-cta-secondary">
              Explore capabilities <ArrowRight size={12} className="ml-2" />
            </Link>
          </div>
        </div>

        {/* PRODUCTION CARD — wireframe HUD */}
        <div className="gf-hs-tech">
          <div className="gf-hs-card">
            <div className="gf-hs-card-titlerow">
              <span className="gf-hs-card-title">Production Card · GF Offer</span>
              <span className="gf-hs-card-id">PIECE {pieceNum}</span>
            </div>
            <h3 className="gf-hs-card-h3 font-display">{piece.label}</h3>
            <div className="gf-hs-card-sub">{piece.collection} · Production-ready</div>
            <div className="gf-hs-card-specs">
              {Object.entries(piece.spec).map(([k, v]) => (
                <div key={k} className="gf-hs-spec">
                  <span className="gf-hs-spec-k">{k}</span>
                  <span className="gf-hs-spec-v font-display">{v}</span>
                </div>
              ))}
            </div>
            <div className="gf-hs-card-foot">
              <span className="gf-hs-card-gf font-display">G · F</span>
              <Link to="/quote" className="gf-hs-card-cta">Request the brief →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Leader line SVG — connects card edge to a labelled anchor on the tearsheet */}
      <div className="gf-hs-callouts" aria-hidden>
        <svg viewBox="0 0 1000 700" preserveAspectRatio="none">
          <path className="gf-hs-leader" d={leaderPath} />
          <circle className="gf-hs-endpoint-ring" cx={ax} cy={ay} r="14" />
          <rect className="gf-hs-endpoint" x={ax - 5.5} y={ay - 5.5} width="11" height="11" />
          <text className="gf-hs-endpoint-label" x={ax - 14} y={ay + 5} textAnchor="end">PIECE {pieceNum}</text>
        </svg>
      </div>

      {/* Nav arrows */}
      <button onClick={() => go(idx - 1)} className="gf-hs-arrow gf-hs-arrow-prev" aria-label="Previous piece" data-testid="hero-slider-prev">
        <ChevronLeft size={20} />
      </button>
      <button onClick={() => go(idx + 1)} className="gf-hs-arrow gf-hs-arrow-next" aria-label="Next piece" data-testid="hero-slider-next">
        <ChevronRight size={20} />
      </button>

      {/* Bottom dock: tagline pillars + bb-header + thumbs + capabilities + progress bar */}
      <div className="gf-hs-bottombar">
        <div className="gf-hs-tagline">
          {PILLARS.map((p, i) => (
            <React.Fragment key={p}>
              <span className="gf-hs-pillar font-display">{p}</span>
              {i < PILLARS.length - 1 && <span className="gf-hs-tag-sep" />}
            </React.Fragment>
          ))}
        </div>

        <div className="gf-hs-bb-header">
          <span>Signature Pieces · {N} Tech-Packs Live</span>
          <span className="gf-hs-hint">USE ← → KEYS · OR CLICK BELOW</span>
        </div>

        <div className="gf-hs-thumbs" ref={thumbsRef}>
          {PIECES.map((p, i) => (
            <button
              key={p.key}
              data-testid={`hero-slider-thumb-${i}`}
              onClick={() => go(i)}
              className={`gf-hs-thumb ${i === idx ? "is-active" : ""}`}
              style={{ backgroundImage: `url('${p.img}')` }}
              aria-label={`Show ${p.label}`}
            >
              <span className="gf-hs-thumb-label">{p.label.replace(/^The\s+/, "")}</span>
            </button>
          ))}
        </div>

        <div className="gf-hs-caps">
          <span className="gf-hs-caps-lbl">Capabilities · {CAPABILITIES.length}</span>
          {CAPABILITIES.map((c) => (
            <Link key={c.title} to="/capabilities" className="gf-hs-cap" data-testid={`hero-slider-cap-${c.num}`}>
              <img src={c.icon} alt="" />
              <span>{c.title}</span>
            </Link>
          ))}
        </div>

        <div className="gf-hs-progress" key={idx}><div className="gf-hs-bar" /></div>
      </div>
    </section>
  );
}
