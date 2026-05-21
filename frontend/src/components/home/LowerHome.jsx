/* LowerHome — everything below the fold on the homepage, code-split via React.lazy.
   The Hero, Trust Marquee, Trust Statement, Proof Metrics, Capabilities and
   Categories all render eagerly. The remaining sections (QC, Why GF, Production
   Parameters, Quote Calculator, Production Scenarios, Final CTA) are imported
   only when the user reaches them. */
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { GFMonogram } from "@/components/GFMonogram";
import { SectionHeading } from "@/components/Section";
import { IMAGES, PRINCIPLES } from "@/lib/content";
import StitchLine from "@/components/motion/StitchLine";
import StaggerGrid from "@/components/motion/StaggerGrid";
import TimelineProgress from "@/components/motion/TimelineProgress";

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
  { eyebrow: "STREETWEAR CAPSULE",       image: IMAGES.threads,  h: "10-piece launch in 12 weeks.",         body: "Heavy-fleece hoodies and washed tees with embroidered branding. Two sample rounds, 500 pcs per style, DDP to UK warehouse." },
  { eyebrow: "UNIFORM PROGRAMME",        image: IMAGES.cutting,  h: "5,000-unit annual rollout.",           body: "Polos, twill chinos and outer shells across multiple sizes and colour-ways. Centralised QC pack and rolling restocks against a 12-month forecast." },
  { eyebrow: "PRIVATE-LABEL ESSENTIALS", image: IMAGES.fabric,   h: "Core programme, six SKUs.",            body: "Loopback crew, brushed-fleece hoodie, ribbed knit, joggers, pique polo and lounge pant — repeated quarterly with shared trims for cost-leverage." },
];

export default function LowerHome() {
  return (
    <>
      {/* QUALITY CONTROL */}
      <section className="py-12 lg:py-16 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeading eyebrow="QUALITY CONTROL" number="— 007" title="Five inspections between brief and despatch." subtitle="No black-box QC. Each garment passes a documented five-stage chain before it leaves the line." />
          <div className="mt-10 relative">
            <div className="hidden lg:block absolute top-[14px] left-0 right-0 h-px border-t border-dashed border-[#2a2a2a]" aria-hidden />
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px lg:gap-0 bg-[#1a1a1a] lg:bg-transparent" stagger={0.10}>
              {QC_STEPS.map((s, i) => (
                <div key={s.num} className="bg-black lg:bg-transparent relative pt-0 lg:pt-10 p-5 lg:px-6 lg:py-0">
                  <div className="hidden lg:flex absolute left-6 top-[7px] w-4 h-4 items-center justify-center bg-black z-[1]">
                    <span className="w-[7px] h-[7px] rounded-full bg-[#F2F2F2]" />
                  </div>
                  <div className="font-body text-[10px] tracking-[0.22em] uppercase text-[#666]">{s.num}</div>
                  <h3 className="mt-2 font-display text-base text-[#F2F2F2]">{s.title}</h3>
                  <p className="mt-2.5 font-body text-[12.5px] leading-[1.75] text-[#a8a8a8]">{s.body}</p>
                  {i < QC_STEPS.length - 1 && <div className="lg:hidden mt-5 dashed-rule text-[#2a2a2a]" />}
                </div>
              ))}
            </StaggerGrid>
          </div>
        </div>
      </section>

      <StitchLine className="mx-auto max-w-[1440px] my-2" />

      {/* WHY GF */}
      <section className="py-12 lg:py-16 px-6 lg:px-12 bg-[#070707] relative overflow-hidden">
        <span className="monogram-watermark text-[220px] -left-6 -top-12 leading-none opacity-50">GF</span>
        <div className="max-w-[1440px] mx-auto relative">
          <SectionHeading eyebrow="WHY GARMENT FOUNDRY" number="— 008" title="Six principles. One standard." />
          <StaggerGrid className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]" stagger={0.06}>
            {PRINCIPLES.map((p, i) => (
              <div key={p.title} data-testid={`principle-${i}`} className="bg-[#070707] p-7 lg:p-8 hover:bg-black transition-colors">
                <div className="flex items-center justify-between">
                  <span className="eyebrow-number">{String(i + 1).padStart(2, "0")}</span>
                  <GFMonogram size={18} color="#444" />
                </div>
                <h3 className="mt-6 font-display text-xl text-[#F2F2F2]">{p.title}</h3>
                <div className="dashed-rule mt-3 text-[#2a2a2a] w-10" />
                <p className="mt-4 font-body text-[13px] leading-[1.85] text-[#a8a8a8]">{p.body}</p>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* PRODUCTION PARAMETERS */}
      <section className="py-12 lg:py-16 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 lg:gap-12">
          <div className="col-span-12 lg:col-span-4">
            <span className="eyebrow-number">— 009 / PARAMETERS</span>
            <h2 className="mt-5 font-display text-3xl lg:text-[40px] leading-[1.1] text-[#F2F2F2]">
              The numbers behind a production quote.
            </h2>
            <p className="mt-5 font-body text-[14px] leading-[1.85] text-[#bbb] max-w-md">
              Answers to the questions every buyer asks before sending a brief. If your project sits outside these ranges, say so in the quote form — we'll quote the exception explicitly.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <div className="border-t border-[#1a1a1a]">
              {PRODUCTION_PARAMETERS.map((row) => (
                <div key={row.k} className="grid grid-cols-12 gap-6 border-b border-[#1a1a1a] py-5 lg:py-6">
                  <div className="col-span-12 md:col-span-4">
                    <div className="font-body text-[11px] tracking-[0.22em] uppercase text-[#F2F2F2]">{row.k}</div>
                  </div>
                  <div className="col-span-12 md:col-span-8">
                    <p className="font-body text-[13.5px] leading-[1.85] text-[#bbb]">{row.v}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE CALCULATOR PREVIEW */}
      <section className="py-12 lg:py-16 px-6 lg:px-12 bg-[#070707]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 lg:col-span-6">
            <span className="eyebrow-number">— 010 / ENQUIRY</span>
            <h2 className="mt-5 font-display text-3xl lg:text-[44px] leading-[1.1] text-[#F2F2F2]">
              Request a quote in five quick fields.
            </h2>
            <p className="mt-5 font-body text-[14px] leading-[1.85] text-[#bbb] max-w-xl">
              A short first-touch form — five required fields, an optional tech-pack upload, and a reply within one business day from a production manager. If you already have a full specification, the optional full brief is one click away.
            </p>
            <Link to="/quote" data-testid="home-quote-preview-btn" className="gf-btn gf-btn-solid mt-8">
              Request a Quote <ArrowRight size={14} className="ml-3" />
            </Link>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="border border-[#1a1a1a] p-7 lg:p-8 bg-[#050505]">
              <div className="flex justify-between items-center mb-7">
                <div className="overline">QUOTE / NO. 0001</div>
                <GFMonogram size={26} color="#777" />
              </div>
              <div className="space-y-4">
                {["Company / brand name", "Your name + role", "Work email", "Garment category", "Approximate quantity"].map((s, i) => (
                  <div key={s} className="flex items-center gap-4 py-2.5 border-b border-[#161616]">
                    <span className="font-display text-[#666] text-xs w-10">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-body text-[13px] text-[#ddd] flex-1">{s}</span>
                    <ArrowRight size={12} className="text-[#444]" />
                  </div>
                ))}
                <div className="pt-2 font-body text-[11px] tracking-[0.15em] uppercase text-[#666]">+ Optional: tech pack upload &middot; full brief</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTION SCENARIOS */}
      <section className="py-12 lg:py-16 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeading eyebrow="PRODUCTION SCENARIOS" number="— 011" title="What a typical engagement looks like." subtitle="Anonymised composites of the work that comes through the studio — to set expectations before the first call." />
          <StaggerGrid className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10" stagger={0.12}>
            {SCENARIOS.map((sc) => (
              <article key={sc.eyebrow} className="group">
                <div className="zoom-on-hover">
                  <img src={sc.image} alt="" loading="lazy" decoding="async" className="w-full h-60 lg:h-64 object-cover grayscale" />
                </div>
                <div className="overline mt-5 text-[#888]">{sc.eyebrow}</div>
                <h3 className="mt-3 font-display text-lg lg:text-xl text-[#F2F2F2] leading-snug">{sc.h}</h3>
                <p className="mt-3 font-body text-[12.5px] leading-[1.85] text-[#a8a8a8]">{sc.body}</p>
              </article>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <StitchLine className="mx-auto max-w-[1440px] my-2" />

      {/* FINAL CTA */}
      <section className="relative py-16 lg:py-20 px-6 lg:px-12 overflow-hidden bg-black">
        <img src={IMAGES.fabric} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black" />
        <div className="relative max-w-3xl mx-auto text-center">
          <GFMonogram size={48} className="mx-auto" color="#F2F2F2" />
          <h2 className="mt-8 font-display text-[34px] lg:text-[52px] leading-[1.06] text-[#F2F2F2]">
            Your next collection<br />deserves a manufacturing partner.
          </h2>
          <p className="mt-5 font-body text-[14px] leading-[1.85] text-[#bbb] max-w-lg mx-auto">
            Submit a brief or a tech pack — we reply with an indicative quote within one business day. Reviewed by a production manager, all-inclusive, built for bulk.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/quote" data-testid="final-cta-quote" className="gf-btn gf-btn-solid">Request a Quote</Link>
            <Link to="/quote" data-testid="final-cta-techpack" className="gf-btn gf-btn-light">Send a Tech Pack</Link>
          </div>
          <p className="mt-7 font-body text-[10.5px] tracking-[0.28em] uppercase text-[#888]">
            <span className="inline-block w-1.5 h-1.5 bg-[#F2F2F2] rounded-full align-middle mr-2" />
            Reviewed by a production manager within one business day
          </p>
        </div>
      </section>
    </>
  );
}
