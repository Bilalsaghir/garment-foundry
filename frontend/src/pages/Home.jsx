import React, { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import PageMeta from "@/components/PageMeta";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { GFMonogram } from "@/components/GFMonogram";
import { SectionHeading } from "@/components/Section";
import { IMAGES, CAPABILITIES, CATEGORIES, CATEGORY_IMAGES, CATEGORY_IMAGE_POSITION, PROCESS_STEPS, PRINCIPLES } from "@/lib/content";
import HeroSlider from "@/components/HeroSlider";
const LowerHome = lazy(() => import("@/components/home/LowerHome"));

// Tightened home page (audit pass 2026-05-20):
//  - Section padding compressed: py-16/24 → py-10/16 (desktop), mobile equivalent.
//  - Oversized monogram watermarks reduced.
//  - Five new sections added: Proof Metrics, Manufacturing Fit, QC Timeline,
//    Production Parameters, Production Scenarios.
//  - Quiet luxury aesthetic preserved — same palette, same fonts, same grid.

const categoryObjectPosition = (cat) => CATEGORY_IMAGE_POSITION[cat] || "center";

// ===== Compact data for the new sections =====
const PROOF_METRICS = [
  { label: "Minimum order",     value: "100+ pcs" },
  { label: "Typical lead time", value: "8 – 14 wks" },
  { label: "Shipping",          value: "DDP UK & US" },
  { label: "Inspection",        value: "AQL 2.5" },
  { label: "Sourcing network",  value: "Europe · Asia" },
];

const FIT_COLUMNS = [
  {
    eyebrow: "BEST FOR",
    items: [
      "Fashion labels scaling beyond first runs",
      "Uniform & corporate apparel programmes",
      "Private-label retailers and wholesalers",
      "Multi-SKU seasonal collections",
    ],
  },
  {
    eyebrow: "NOT FOR",
    items: [
      "One-off bespoke garments",
      "Print-on-demand or single-piece orders",
      "Blank-stock resale arbitrage",
      "Sub-MOQ trials below 100 units",
    ],
  },
  {
    eyebrow: "BRING WITH YOU",
    items: [
      "A tech pack or detailed reference",
      "Target quantity & delivery market",
      "A sealed sample, if you have one",
      "Indicative landed-cost target",
    ],
  },
];

const QC_STEPS = [
  { num: "01", title: "Incoming fabric checks",   body: "Shade, weight, hand-feel and shrinkage logged against the approved swatch before cutting starts." },
  { num: "02", title: "Sample approval",          body: "Pre-production samples reviewed against the tech pack — no bulk runs without a signed-off seal." },
  { num: "03", title: "Inline inspection",        body: "Operators audit construction at the line — seam, stitch density, label placement, hardware torque." },
  { num: "04", title: "Final AQL inspection",     body: "Statistical sampling against an agreed AQL standard. Fail = rework or rejection before despatch." },
  { num: "05", title: "Packing & shipment",       body: "Polybag, fold, label and carton — all checked against the packing list before the seal is set." },
];

const PRODUCTION_PARAMETERS = [
  { k: "MOQ guidance",       v: "100 pcs per style / colour as a floor. Below 100, sampling is offered without a bulk commitment." },
  { k: "Sampling timeline",  v: "Fit & PP samples in 7 – 18 days depending on fabric. Two iterations included in the standard quote." },
  { k: "Bulk production",    v: "Confirmed in writing on PO approval. Typical range 30 – 75 days from raw-material clearance to FOB ready." },
  { k: "Shipping terms",     v: "DDP to UK and US handled in-house. EXW / FOB available for buyers with established freight partners." },
  { k: "What affects price", v: "Fabric grade, quantity tier, trim sourcing, finish complexity, sampling rounds and shipping speed." },
];

const SCENARIOS = [
  {
    eyebrow: "STREETWEAR CAPSULE",
    image:   IMAGES.threads,
    h:       "10-piece launch in 12 weeks.",
    body:    "Heavy-fleece hoodies and washed tees with embroidered branding. Two sample rounds, 500 pcs per style, DDP to UK warehouse.",
  },
  {
    eyebrow: "UNIFORM PROGRAMME",
    image:   IMAGES.cutting,
    h:       "5,000-unit annual rollout.",
    body:    "Polos, twill chinos and outer shells across multiple sizes and colour-ways. Centralised QC pack and rolling restocks against a 12-month forecast.",
  },
  {
    eyebrow: "PRIVATE-LABEL ESSENTIALS",
    image:   IMAGES.fabric,
    h:       "Core programme, six SKUs.",
    body:    "Loopback crew, brushed-fleece hoodie, ribbed knit, joggers, pique polo and lounge pant — repeated quarterly with shared trims for cost-leverage.",
  },
];

export default function Home() {
  return (
    <div data-testid="page-home" className="bg-black text-[#F2F2F2]">
      <PageMeta path="/" title="Garment Foundry — UK Apparel Manufacturing & Sourcing" description="UK-based apparel manufacturing and sourcing for fashion, uniform, private-label and wholesale brands. From brief to bulk, handled with quiet rigour." />

      {/* HERO — Atelier Reel: 12 tech-pack tearsheets with Production Card HUD. */}
      <HeroSlider />

      {/* TRUST MARQUEE — category names */}
      <section className="border-y border-[#1a1a1a] bg-black py-5 overflow-hidden">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 md:gap-16">
              {["Streetwear", "Hoodies & Sweats", "T-Shirts & Tops", "Activewear", "Sportswear", "Menswear", "Womenswear", "Childrenswear", "Outerwear", "Workwear", "Uniforms", "Trousers & Bottoms", "Accessories"].map((t) => (
                <span key={t} className="overline text-[#666] whitespace-nowrap">◆ {t}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* TRUST STATEMENT */}
      <section className="py-12 lg:py-16 px-6 lg:px-12 relative">
        <span className="monogram-watermark text-[160px] right-2 -top-6 leading-none opacity-60">GF</span>
        <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 relative">
          <div className="col-span-12 lg:col-span-5">
            <span className="eyebrow-number">— 002 / TRUST</span>
            <h2 className="mt-5 font-display text-3xl lg:text-[44px] leading-[1.1] text-[#F2F2F2]">
              A serious manufacturing partner for serious brands.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <p className="font-body text-[15px] leading-[1.85] text-[#c8c8c8]">
              We are not a wholesale catalogue, a print-on-demand service or a generic factory. We are an apparel manufacturing and sourcing house — operating from the United Kingdom with a vetted production network across Europe and Asia.
            </p>
            <p className="font-body text-[15px] leading-[1.85] text-[#c8c8c8] mt-5">
              Every brief is reviewed by a production manager. Every garment is inspected against an agreed quality standard. Every shipment is delivered duty paid. That is the standard.
            </p>
          </div>
        </div>
      </section>

      {/* PROOF METRICS BAND — compact 5-up strip */}
      <section className="border-y border-[#1a1a1a] bg-[#070707]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {PROOF_METRICS.map((m, i) => (
            <div
              key={m.label}
              className={`px-6 py-7 lg:px-8 lg:py-9 ${i !== PROOF_METRICS.length - 1 ? "lg:border-r" : ""} border-[#1a1a1a] ${i % 2 === 0 ? "border-r" : ""} ${i >= 2 ? "border-t md:border-t-0" : ""}`}
            >
              <div className="font-display text-2xl lg:text-3xl text-[#F2F2F2] leading-tight">{m.value}</div>
              <div className="overline mt-3 text-[#888]">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CAPABILITIES — tighter, smaller icons, single-shell border */}
      <section className="py-12 lg:py-16 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeading eyebrow="CAPABILITIES" number="— 003" title="Full-spectrum apparel manufacturing." subtitle="From concept refinement to delivered shipment — every stage is handled in-house or by audited partners under our supervision." />
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-5 border-t border-l border-[#1a1a1a]">
            {CAPABILITIES.map((c) => (
              <div
                key={c.num}
                data-testid={`capability-${c.num}`}
                className="p-5 lg:p-6 border-r border-b border-[#1a1a1a] hover:bg-[#0a0a0a] transition-colors group flex flex-col"
              >
                <div className="flex items-start justify-between">
                  <span className="eyebrow-number">{c.num}</span>
                  <ArrowUpRight size={14} className="text-[#444] group-hover:text-white transition-colors" />
                </div>
                {c.icon && (
                  <img src={c.icon} alt="" aria-hidden="true" className="mt-4 mb-5 w-12 h-12 lg:w-14 lg:h-14 opacity-75 group-hover:opacity-100 transition-opacity"  loading="lazy" decoding="async" />
                )}
                <h3 className="font-display text-[15px] lg:text-base text-[#F2F2F2] tracking-[0.04em] uppercase">{c.title}</h3>
                <p className="mt-2 font-body text-[12px] leading-[1.7] text-[#9a9a9a]">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES BENTO — square tiles, denser */}
      <section className="py-12 lg:py-16 px-6 lg:px-12 bg-[#070707]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <SectionHeading eyebrow="PRODUCT CATEGORIES" number="— 004" title="Twelve product categories. One production network." />
            <Link to="/categories" data-testid="home-categories-link" className="gf-btn gf-btn-light self-start lg:self-auto">All Categories</Link>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#1a1a1a] border border-[#1a1a1a]">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat}
                to="/categories"
                data-testid={`category-${cat.replace(/[^a-z]/gi, '').toLowerCase()}`}
                className="bg-black group relative aspect-[4/5] lg:aspect-square overflow-hidden"
              >
                <img
                  src={CATEGORY_IMAGES[cat]}
                  alt={`${cat} apparel manufactured by Garment Foundry`}
                  loading="lazy"
                  style={{ objectPosition: categoryObjectPosition(cat) }}
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                 decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="relative h-full p-5 lg:p-6 flex flex-col justify-between">
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[#888]">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-lg lg:text-xl text-[#F2F2F2] leading-tight">{cat}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="overline text-[#888]">VIEW CATEGORY</span>
                      <ArrowUpRight size={14} className="text-[#999] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MANUFACTURING FIT — qualifying lead band */}
      <section className="py-12 lg:py-16 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeading eyebrow="ARE WE A FIT" number="— 005" title="Built for brands ready to produce." subtitle="A two-minute self-qualifier before you write the brief. The most useful conversations start with what we are not." />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1a1a1a] border border-[#1a1a1a]">
            {FIT_COLUMNS.map((col) => (
              <div key={col.eyebrow} className="bg-black p-6 lg:p-7">
                <span className="overline text-[#F2F2F2]">{col.eyebrow}</span>
                <div className="dashed-rule mt-3 text-[#3a3a3a] w-10" />
                <ul className="mt-5 space-y-3">
                  {col.items.map((it) => (
                    <li key={it} className="flex items-start gap-3 font-body text-[13px] leading-[1.7] text-[#c8c8c8]">
                      <span className="text-[#F2F2F2] mt-1 flex-shrink-0">—</span><span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/quote" className="gf-btn gf-btn-solid">Request a Production Quote</Link>
            <Link to="/contact" className="text-[#bbb] hover:text-white font-body text-[11px] tracking-[0.22em] uppercase transition-colors">Talk to the studio →</Link>
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE with image */}
      <section className="py-12 lg:py-16 px-6 lg:px-12 bg-[#070707]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 lg:gap-12">
          <div className="col-span-12 lg:col-span-5">
            <div className="zoom-on-hover">
              <img src={IMAGES.stitching} alt="Artisan stitching" className="w-full h-[420px] lg:h-[480px] object-cover grayscale"  loading="lazy" decoding="async" />
            </div>
            <div className="overline mt-3 text-[#666]">FIG. 01 — ATELIER FLOOR</div>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <SectionHeading eyebrow="THE PROCESS" number="— 006" title="A seven-step path from brief to delivered." />
            <ol className="mt-8 relative pl-8">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#333333]" aria-hidden />
              {PROCESS_STEPS.map((s) => (
                <li key={s.num} data-testid={`process-step-${s.num}`} className="relative pb-7 last:pb-0">
                  <span className="absolute -left-[28px] top-2 w-[14px] h-[14px] flex items-center justify-center">
                    <span className="w-[6px] h-[6px] bg-white rounded-full" />
                  </span>
                  <div className="font-body text-[10px] tracking-[0.2em] uppercase text-[#666]">STEP {s.num}</div>
                  <h4 className="mt-1 font-display text-lg text-[#F5F4F0]">{s.title}</h4>
                  <p className="mt-1.5 font-body text-[13px] leading-[1.8] text-[#a8a8a8]">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* === EVERYTHING BELOW IS CODE-SPLIT (React.lazy) FOR FAST INITIAL PAINT === */}
      <Suspense fallback={<div className="py-24" aria-hidden />}>
        <LowerHome />
      </Suspense>
    </div>
  );
}
