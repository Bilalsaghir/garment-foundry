import React from "react";
import { Link } from "react-router-dom";
import PageMeta from "@/components/PageMeta";
import { SectionHeading } from "@/components/Section";
import Reveal from "@/components/Reveal";
import { CAPABILITIES, IMAGES } from "@/lib/content";

// TODO(content): fill the MOQ floor for boutique cut-and-sew and the upper bound for high-volume runs.
const RUN_SIZES = [
  { name: "Sampling", detail: "Proto / fit / PP at any quantity" },
  { name: "Boutique cut-and-sew", detail: "From a few hundred units per style per colour" },
  { name: "Mid-volume programmes", detail: "500 to 5,000 units" },
  { name: "High-volume", detail: "Uniform and merch programmes at scale" },
  { name: "Test drops", detail: "Small first runs to validate fit and demand" },
  { name: "Repeat programmes", detail: "Recurring SKUs with locked fabric" },
  { name: "Capsule launches", detail: "Multiple SKUs against one delivery date" },
];

export default function Capabilities() {
  return (
    <div data-testid="page-capabilities" className="bg-black">
      <PageMeta path="/capabilities" title="Apparel Manufacturing Capabilities | Garment Foundry" description="Cut-and-sew, knitwear, jersey, tailoring and outerwear capabilities for production runs from samples through bulk." />
      <section className="pt-40 pb-16 px-6 lg:px-12 border-b border-[#1a1a1a] relative overflow-hidden">
        <img src={IMAGES.threads} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="relative max-w-[1440px] mx-auto">
          <span className="overline">CHAPTER · CAPABILITIES</span>
          <h1 className="mt-6 font-display text-5xl lg:text-7xl text-[#F2F2F2] leading-[1.05] max-w-4xl">
            Every stage of apparel manufacturing — handled.
          </h1>
          {/* TODO(content): swap the [FILL IN] for the named partner-cert programme(s) you can substantiate. */}
          <p className="mt-8 max-w-2xl font-body text-[14px] leading-[1.95] text-[#bbb]">
            From the first sketch to the final shipment. SMETA-audited facilities, [FILL IN: e.g. BSCI / ISO 9001] partners, AQL-graded output.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeading eyebrow="THE FULL STACK" number="— 001" title="Ten disciplines. One workflow." />
          {/* H2: 10 items, skip 3-col entirely — 1 → 2 → 5 produces clean rows at every breakpoint. */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-[#1a1a1a]">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.num} delay={Math.min(i * 60, 360)}>
                <div data-testid={`cap-${c.num}`} className="bg-black p-10 hover:bg-[#0a0a0a] transition-colors duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <span className="eyebrow-number">{c.num}</span>
                  <h3 className="mt-6 font-display text-2xl text-[#F2F2F2]">{c.title}</h3>
                  <div className="dashed-rule mt-4 text-[#333] w-12" />
                  <p className="mt-6 font-body text-[13px] leading-[1.9] text-[#999]">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CR-G: expanded capabilities detail. */}
      <section className="py-16 lg:py-24 px-6 lg:px-12 bg-[#070707] border-t border-[#1a1a1a]">
        <div className="max-w-[1100px] mx-auto">
          <SectionHeading eyebrow="WHAT WE COMFORTABLY HANDLE" number="— 002" title="Production realities, not just headline capabilities." subtitle="Capability lists are easy to write. The harder question is what we are good at at production scale, where the constraints are real, and how that maps to your project's specification." />

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 space-y-10">
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Design and tech-pack support</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  If you have a sketch and a reference garment, we can build the tech pack with you — pattern, grading, fabric callouts, stitching specs and a points-of-measure sheet. If you already have a tech pack, we review it for manufacturability and flag anything that will cause cost or quality issues at scale.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Sampling pipeline</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  Sampling is treated as its own discipline, not a side-effect of production. Proto, fit and pre-production samples are produced on the line that will run bulk, by the operators who will do the actual sewing. That continuity matters more than any single metric.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Bulk production scale</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  We comfortably manage runs from {/* TODO(content): your minimum, e.g. 100 units per style per colour */} up to {/* TODO(content): your upper bound on a single PO */}. Above that, we split the order across two facilities running the same approved sample to maintain lead time without compromising consistency.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Finishing — print, embroidery, labels</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  Screen, DTG, sublimation and discharge print are all in-house or with audited partners. Embroidery includes flat, 3D and applique. Labels — woven, printed, leather, jacquard — are sourced direct from accredited mills. Hangtags and care content are finished to retail-ready standard.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Quality control and shipping</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  Inspections run pre-production, in-line and end-line, with a final AQL audit before despatch. We ship DDP (Delivered Duty Paid) to the United Kingdom and the United States — customs, duty and last-mile included — or hand off to your nominated freight forwarder if you prefer.
                </p>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="border border-[#1a1a1a] p-8 lg:p-10 bg-black">
                <div className="overline mb-2">RUN SIZES WE COMFORTABLY HANDLE</div>
                <p className="font-body text-[12px] leading-[1.7] text-[#777] mb-8">The shapes of orders that run cleanly through our production network.</p>
                <dl className="divide-y divide-[#181818]">
                  {RUN_SIZES.map((row) => (
                    <div key={row.name} className="py-4 first:pt-0 last:pb-0 grid grid-cols-12 gap-3 items-baseline">
                      <dt className="col-span-12 sm:col-span-5 font-display text-[15px] text-[#F2F2F2] leading-snug">{row.name}</dt>
                      <dd className="col-span-12 sm:col-span-7 font-body text-[13.5px] leading-[1.6] text-[#ccc]">{row.detail}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 px-6 lg:px-12 bg-[#0a0a0a] text-center">
        <h2 className="font-display text-3xl lg:text-5xl text-[#F2F2F2] max-w-3xl mx-auto leading-tight">Tell us what you are building.</h2>
        <Link to="/quote" data-testid="cap-cta" className="gf-btn gf-btn-solid mt-10">Request a Quote</Link>
      </section>
    </div>
  );
}
