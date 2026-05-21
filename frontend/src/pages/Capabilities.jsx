import React from "react";
import { Link } from "react-router-dom";
import PageMeta from "@/components/PageMeta";
import { SectionHeading } from "@/components/Section";
import StaggerGrid from "@/components/motion/StaggerGrid";
import StitchLine from "@/components/motion/StitchLine";
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
            From the first sketch to the final shipment. Vetted partner factories, structured QC at every stage, AQL-graded final output.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeading eyebrow="THE FULL STACK" number="— 001" title="Ten disciplines. One workflow." />
          {/* Strict editorial grid: every card is the same height, content top-aligned,
              fixed vertical rhythm (eyebrow → icon → title → divider → body).
              `h-full` on Reveal + inner card flushes them to the row height; min-height
              on the title block keeps 1-line and 2-line titles from staggering.
              See spec in audit pass. */}
          <StaggerGrid className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-[#1a1a1a] auto-rows-fr" stagger={0.06}>
            {CAPABILITIES.map((c) => (
              <div key={c.num} className="h-full">
                <article
                  data-testid={`cap-${c.num}`}
                  className="bg-black h-full p-6 lg:p-7 flex flex-col hover:bg-[#0a0a0a] transition-colors duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] group"
                >
                  {/* row 1 — eyebrow number (top-left) + arrow indicator (top-right) */}
                  <div className="flex items-start justify-between">
                    <span className="eyebrow-number">{c.num}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="1.6" strokeLinecap="round"
                         className="text-[#444] group-hover:text-white transition-colors">
                      <path d="M7 17L17 7M17 7H8M17 7v9" />
                    </svg>
                  </div>

                  {/* row 2 — icon (fixed-height slot so all rows of cards line up) */}
                  <div className="mt-5 h-14 flex items-start">
                    {c.icon && (
                      <img
                        src={c.icon}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        className="w-14 h-14 opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    )}
                  </div>

                  {/* row 3 — title, two-line min-height so cards never stagger */}
                  <h3 className="mt-5 font-display text-base lg:text-lg text-[#F2F2F2] tracking-[0.04em] uppercase leading-[1.25] min-h-[2.5em]">
                    {c.title}
                  </h3>

                  {/* row 4 — stitched divider */}
                  <div className="dashed-rule mt-3 text-[#2a2a2a] w-10" />

                  {/* row 5 — description (grows to fill remaining height; flush to top of zone) */}
                  <p className="mt-4 font-body text-[12.5px] leading-[1.75] text-[#a8a8a8] flex-grow">
                    {c.body}
                  </p>
                </article>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <StitchLine className="mx-auto max-w-[1100px] my-2" />

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
