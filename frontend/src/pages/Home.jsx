import React from "react";
import { Link } from "react-router-dom";
import PageMeta from "@/components/PageMeta";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { GFMonogram } from "@/components/GFMonogram";
import { SectionHeading } from "@/components/Section";
import { IMAGES, CAPABILITIES, CATEGORIES, CATEGORY_IMAGES, CATEGORY_IMAGE_POSITION, PROCESS_STEPS, PRINCIPLES } from "@/lib/content";

// Returns the raw CSS object-position value (e.g. "left", "25% center").
// Default is "center" (= 50% from left).
const categoryObjectPosition = (cat) => CATEGORY_IMAGE_POSITION[cat] || "center";

export default function Home() {
  return (
    <div data-testid="page-home" className="bg-black text-[#F2F2F2]">
      <PageMeta path="/" title="Garment Foundry — UK Apparel Manufacturing & Sourcing" description="UK-based apparel manufacturing and sourcing for fashion, uniform, private-label and wholesale brands. From brief to bulk, handled with quiet rigour." />

      {/* HERO */}
      <section className="relative min-h-[80vh] lg:min-h-[88vh] flex items-end overflow-hidden">
        <img src={IMAGES.hero} alt="Manufacturing atelier" className="absolute inset-0 w-full h-full object-cover opacity-65" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black" />
        <div className="absolute inset-0 bg-pinstripe opacity-50" />

        {/* Top brand row */}
        <div className="absolute top-28 left-0 right-0 px-6 lg:px-12">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <span className="overline text-[#bbb] hidden md:block">EST · UNITED KINGDOM</span>
            <span className="overline text-[#bbb] hidden md:block">APPAREL MANUFACTURING &amp; SOURCING</span>
            <span className="overline text-[#bbb] hidden md:block">UK · US · GLOBAL</span>
          </div>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pb-24 lg:pb-32 w-full">
          <div className="grid grid-cols-12 gap-6 items-end">
            {/* Hero choreography — eyebrow, h1, body, CTAs each enter on a staggered delay.
                See docs/motion-handoff.md (or the in-conversation spec) for timings. */}
            <div className="col-span-12 lg:col-span-8 gf-fade-up">
              <span className="eyebrow-number">— 001 / INTRODUCTION</span>
              <h1 className="mt-6 font-display text-[44px] sm:text-[68px] lg:text-[96px] leading-[0.95] tracking-tight text-[#F2F2F2]">
                Crafted with<br /><em className="not-italic font-display text-[#cfcfcf]">purpose.</em> Delivered<br />with precision.
              </h1>
              {/* TODO(content): swap the [FILL IN] for the real typical lead time range. */}
              <p className="mt-8 max-w-xl font-body text-[14px] leading-[1.9] text-[#cfcfcf] gf-fade-up gf-delay-300">
                A UK apparel manufacturing and sourcing partner for fashion, uniform and private-label brands. From brief to bulk in [FILL IN: e.g. 8–14] weeks, shipped DDP to the UK and US.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-5 gf-fade-up gf-delay-500">

                <Link to="/quote" data-testid="hero-quote-btn" className="inline-flex items-center justify-center bg-white text-black font-body text-[11px] tracking-[0.22em] uppercase font-medium px-8 h-[52px] w-full sm:w-auto hover:bg-[#e8e5de] transition-colors">
                  Request a Quote <ArrowRight size={14} className="ml-3" />
                </Link>
                <Link to="/capabilities" data-testid="hero-capabilities-btn" className="inline-flex items-center text-white/80 hover:text-white font-body text-[11px] tracking-[0.22em] uppercase font-medium transition-colors">
                  Explore capabilities <ArrowRight size={12} className="ml-2" />
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex col-span-4 flex-col items-end gap-6 gf-fade-up gf-delay-700">
              <GFMonogram size={88} color="#F2F2F2" />
              <div className="text-right">
                <div className="overline text-[#888]">EST.</div>
                <div className="font-display text-3xl text-[#F2F2F2] mt-2">MMXVI <span className="text-[#888] text-xl">· 2016</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST MARQUEE */}
      <section className="border-y border-[#1a1a1a] bg-black py-6 overflow-hidden">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 md:gap-16">
              {["GOTS", "OEKO-TEX® STANDARD 100", "BCI COTTON", "SMETA AUDITED", "AQL 2.5", "DDP UK", "DDP US"].map((t) => (
                <span key={t} className="overline text-[#666] whitespace-nowrap">◆ {t}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* TRUST STATEMENT */}
      <section className="py-16 lg:py-24 px-6 lg:px-12 relative">
        <span className="monogram-watermark text-[300px] right-0 -top-12 leading-none">GF</span>
        <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 relative">
          <div className="col-span-12 lg:col-span-5">
            <span className="eyebrow-number">— 002 / TRUST</span>
            <h2 className="mt-6 font-display text-4xl lg:text-5xl leading-[1.1] text-[#F2F2F2]">
              A serious manufacturing partner for serious brands.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <p className="font-body text-[15px] leading-[1.95] text-[#bbb]">
              We are not a wholesale catalogue, a print-on-demand service or a generic factory. We are an apparel manufacturing and sourcing house — operating from the United Kingdom with a vetted production network across Europe and Asia.
            </p>
            <p className="font-body text-[15px] leading-[1.95] text-[#bbb] mt-6">
              Every brief is reviewed by a production manager. Every garment is inspected against an agreed quality standard. Every shipment is delivered duty paid. That is the standard.
            </p>
          </div>
        </div>
      </section>


      {/* CAPABILITIES */}
      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeading eyebrow="CAPABILITIES" number="— 003" title="Full-spectrum apparel manufacturing." subtitle="From concept refinement to delivered shipment — every stage is handled in-house or by audited partners under our supervision." />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {CAPABILITIES.map((c, i) => (
              <div
                key={c.num}
                data-testid={`capability-${c.num}`}
                className={`p-8 border-[#1a1a1a] hover:bg-[#0a0a0a] transition-colors group ${
                  i % 5 !== 4 ? "lg:border-r" : ""
                } border-t md:[&:nth-child(2n)]:border-l xl:[&:nth-child(2n)]:border-l-0 ${i >= 5 ? "lg:border-t" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <span className="eyebrow-number">{c.num}</span>
                  <ArrowUpRight size={16} className="text-[#555] group-hover:text-white transition-colors" />
                </div>
                {c.icon && (
                  <img src={c.icon} alt="" aria-hidden="true" className="mt-6 w-20 h-20 opacity-70 group-hover:opacity-90 transition-opacity" />
                )}
                <h3 className="mt-4 font-display text-xl text-[#F2F2F2]">{c.title}</h3>
                <p className="mt-3 font-body text-[12.5px] leading-[1.8] text-[#999]">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES BENTO */}
      <section className="py-16 lg:py-24 px-6 lg:px-12 bg-[#070707]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <SectionHeading eyebrow="PRODUCT CATEGORIES" number="— 004" title="Twelve product categories. One production network." />
            <Link to="/categories" data-testid="home-categories-link" className="gf-btn gf-btn-light self-start lg:self-auto">All Categories</Link>
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#1a1a1a] border border-[#1a1a1a]">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat}
                to="/categories"
                data-testid={`category-${cat.replace(/[^a-z]/gi, '').toLowerCase()}`}
                className="bg-black group relative aspect-[5/6] overflow-hidden"
              >
                <img
                  src={CATEGORY_IMAGES[cat]}
                  alt={`${cat} apparel manufactured by Garment Foundry`}
                  loading="lazy"
                  style={{ objectPosition: categoryObjectPosition(cat) }}
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="relative h-full p-6 lg:p-8 flex flex-col justify-between">
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[#888]">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2] leading-tight">{cat}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="overline text-[#888]">VIEW CATEGORY</span>
                      <ArrowUpRight size={16} className="text-[#999] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE with image */}
      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 lg:gap-16">
          <div className="col-span-12 lg:col-span-5">
            <div className="zoom-on-hover">
              <img src={IMAGES.stitching} alt="Artisan stitching" className="w-full h-[560px] object-cover grayscale" />
            </div>
            <div className="overline mt-4 text-[#666]">FIG. 01 — ATELIER, MANCHESTER</div>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <SectionHeading eyebrow="THE PROCESS" number="— 005" title="A seven-step path from brief to delivered." />
            <ol className="mt-12 relative pl-8">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#333333]" aria-hidden />
              {PROCESS_STEPS.map((s, i) => (
                <li key={s.num} data-testid={`process-step-${s.num}`} className="relative pb-10 last:pb-0">
                  <span className="absolute -left-[28px] top-2 w-[14px] h-[14px] flex items-center justify-center">
                    <span className="w-[6px] h-[6px] bg-white rounded-full" />
                  </span>
                  <div className="font-body text-[10px] tracking-[0.2em] uppercase text-[#666]">STEP {s.num}</div>
                  <h4 className="mt-2 font-display text-xl text-[#F5F4F0]">{s.title}</h4>
                  <p className="mt-2 font-body text-[13px] leading-[1.9] text-[#999]">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* WHY GF */}
      <section className="py-16 lg:py-24 px-6 lg:px-12 bg-[#070707] relative overflow-hidden">
        <span className="monogram-watermark text-[420px] -left-12 -top-32 leading-none">GF</span>
        <div className="max-w-[1440px] mx-auto relative">
          <SectionHeading eyebrow="WHY GARMENT FOUNDRY" number="— 006" title="Six principles. One standard." />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]">
            {PRINCIPLES.map((p, i) => (
              <div key={p.title} data-testid={`principle-${i}`} className="bg-[#070707] p-10 hover:bg-black transition-colors">
                <div className="flex items-center justify-between">
                  <span className="eyebrow-number">{String(i + 1).padStart(2, "0")}</span>
                  <GFMonogram size={20} color="#444" />
                </div>
                <h3 className="mt-8 font-display text-2xl text-[#F2F2F2]">{p.title}</h3>
                <div className="dashed-rule mt-4 text-[#2a2a2a] w-12" />
                <p className="mt-6 font-body text-[13px] leading-[1.9] text-[#999]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE CALCULATOR PREVIEW */}
      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 lg:col-span-6">
            <span className="eyebrow-number">— 007 / ENQUIRY</span>
            <h2 className="mt-6 font-display text-4xl lg:text-5xl leading-[1.1] text-[#F2F2F2]">
              Request a quote in five quick fields.
            </h2>
            <p className="mt-6 font-body text-[14px] leading-[1.9] text-[#bbb] max-w-xl">
              A short first-touch form — five required fields, an optional tech-pack upload, and a reply within one business day. If you already have a full specification, the optional full brief is one click away.
            </p>
            <Link to="/quote" data-testid="home-quote-preview-btn" className="gf-btn gf-btn-solid mt-10">
              Request a Quote <ArrowRight size={14} className="ml-3" />
            </Link>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="border border-[#1a1a1a] p-8 lg:p-10 bg-[#050505]">
              <div className="flex justify-between items-center mb-8">
                <div className="overline">QUOTE / NO. 0001</div>
                <GFMonogram size={28} color="#777" />
              </div>
              <div className="space-y-5">
                {["Company / brand name", "Your name + role", "Work email", "Garment category", "Approximate quantity"].map((s, i) => (
                  <div key={s} className="flex items-center gap-4 py-3 border-b border-[#161616]">
                    <span className="font-display text-[#666] text-xs w-10">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-body text-[13px] text-[#ddd] flex-1">{s}</span>
                    <ArrowRight size={12} className="text-[#444]" />
                  </div>
                ))}
                <div className="pt-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#666]">+ Optional: tech pack upload &middot; full brief</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BLOCKS — invented placeholder case studies removed (audit B3).
          Re-enable this section once 2-3 real case studies are signed off; use the
          placeholder shape below as the data template. */}
      {false && (
        <section className="py-16 lg:py-24 px-6 lg:px-12 bg-[#070707]">
          <div className="max-w-[1440px] mx-auto">
            <SectionHeading eyebrow="CASE STUDIES" number="— 008" title="Partnering with brands of every scale." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { img: IMAGES.cutting, eyebrow: "[FILL IN: STREETWEAR LABEL · CITY]", h: "[FILL IN: 1-sentence outcome with two numbers.]", body: "[FILL IN: 2-sentence problem + what you did.]" },
                { img: IMAGES.threads, eyebrow: "[FILL IN: PRIVATE LABEL · CITY]", h: "[FILL IN: outcome headline.]", body: "[FILL IN: problem + work.]" },
                { img: IMAGES.fabric, eyebrow: "[FILL IN: UNIFORM PROGRAMME · CITY]", h: "[FILL IN: outcome headline.]", body: "[FILL IN: problem + work.]" },
              ].map((c, i) => (
                <article key={i} data-testid={`case-${i}`} className="group">
                  <div className="zoom-on-hover">
                    <img src={c.img} alt={c.h} className="w-full h-72 object-cover grayscale" />
                  </div>
                  <div className="overline mt-6 text-[#777]">{c.eyebrow}</div>
                  <h3 className="mt-3 font-display text-xl text-[#F2F2F2] leading-snug">{c.h}</h3>
                  <p className="mt-3 font-body text-[12.5px] leading-[1.85] text-[#999]">{c.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="relative py-24 lg:py-32 px-6 lg:px-12 overflow-hidden">
        <img src={IMAGES.fabric} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />
        <div className="relative max-w-3xl mx-auto text-center">
          <GFMonogram size={60} className="mx-auto" color="#F2F2F2" />
          <h2 className="mt-10 font-display text-4xl lg:text-6xl leading-[1.05] text-[#F2F2F2]">
            Your next collection<br />deserves a manufacturing partner.
          </h2>
          <p className="mt-8 font-body text-[14px] leading-[1.9] text-[#bbb] max-w-xl mx-auto">
            Submit a brief or a tech pack. We reply with an indicative quote within one business day — transparent, all-inclusive and built for production.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/quote" data-testid="final-cta-quote" className="gf-btn gf-btn-solid">Request a Quote</Link>
            <Link to="/contact" data-testid="final-cta-contact" className="gf-btn gf-btn-light">Talk to the studio</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
