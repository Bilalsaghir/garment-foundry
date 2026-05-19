import React from "react";
import PageMeta from "@/components/PageMeta";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/Section";
import { PROCESS_STEPS, IMAGES } from "@/lib/content";

const DELIVERABLES = [
  "Signed mutual NDA and scoping notes",
  "Annotated tech pack with our construction recommendations",
  "Lab dips, fabric handlooms and trim samples",
  "Proto, fit and pre-production samples with measurement reports",
  "Itemised written quotation",
  "Weekly in-production status photos and notes",
  "Final AQL inspection report with defect logs",
  "Shipping documentation and DDP customs handling",
];

export default function Process() {
  return (
    <div data-testid="page-process" className="bg-black">
      <PageMeta path="/process" title="Our 7-Step Manufacturing Process | Garment Foundry" description="From tech pack and sampling through bulk production, QC and shipping — the seven steps inside a Garment Foundry order." />
      <section className="pt-40 pb-16 px-6 lg:px-12 border-b border-[#1a1a1a]">
        <div className="max-w-[1440px] mx-auto">
          <span className="overline">CHAPTER · PROCESS</span>
          <h1 className="mt-6 font-display text-5xl lg:text-7xl text-[#F2F2F2] leading-[1.05] max-w-4xl">
            From brief to delivered shipment — seven precise steps.
          </h1>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 lg:gap-16">
          <div className="col-span-12 lg:col-span-5">
            <img src={IMAGES.stitching} alt="Atelier stitching detail at the production stage" className="w-full h-[640px] object-cover grayscale sticky top-32" />
          </div>
          <div className="col-span-12 lg:col-span-7">
            {/* TODO(content): replace [FILL IN: 8-14] with the real typical span. */}
            <SectionHeading eyebrow="THE WORKFLOW" number="— 001" title="A considered path to production." subtitle="Typically [FILL IN: e.g. 8–14] weeks from approved brief to bulk despatch." />
            <ol className="mt-16 space-y-0">
              {PROCESS_STEPS.map((s) => (
                <li key={s.num} data-testid={`process-${s.num}`} className="py-10 border-t border-[#1a1a1a] last:border-b">
                  <div className="flex items-baseline gap-6">
                    <span className="font-display text-[#666] text-sm tracking-luxe">{s.num}</span>
                    <h3 className="font-display text-2xl lg:text-3xl text-[#F2F2F2]">{s.title}</h3>
                  </div>
                  <p className="mt-4 font-body text-[14px] leading-[1.9] text-[#999] max-w-xl ml-12">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CR-G: expanded process detail — keep TODO markers for project-specific specifics. */}
      <section className="py-24 lg:py-32 px-6 lg:px-12 bg-[#070707] border-t border-[#1a1a1a]">
        <div className="max-w-[1100px] mx-auto">
          <SectionHeading eyebrow="HOW THE PROCESS RUNS" number="— 002" title="What each step looks like in practice." subtitle="The seven-step framework above is the headline. The detail is in the cadence — how often we revise samples, what arrives in your inbox, who signs off on what, and how we keep production transparent end-to-end." />

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 space-y-10">
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Before we open a brief</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  Every new project starts with a mutual non-disclosure agreement before any specification leaves your side. We then run a short scoping call — typically thirty minutes — to align on the garment, the target unit economics, the timeline, and the markets you are shipping to. {/* TODO(content): mention any specific kick-off deliverables you provide */}
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Sampling rhythm</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  Most projects move through a proto sample, a fit sample, and a pre-production sample. Each iteration is photographed, measured against the spec sheet, and shared back with annotated notes. The cadence is roughly {/* TODO(content): typical sampling lead time per round, e.g. 7-10 days */} per round, depending on fabric availability and the complexity of construction.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Quotation transparency</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  Every proposal itemises fabric, trims, labour, finishing, packaging and shipping separately, with no hidden margin loaded onto the cost-of-goods. {/* TODO(content): note your indicative MOQ floor and how that affects unit cost */} You receive a written quote with delivery terms (typically DDP to the UK and US) before any commitment.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Production cadence and status</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  Once production starts, you receive weekly status notes — fabric receipt, cutting, sewing line progress, and in-line inspection summaries. Any deviation against the approved sample is flagged before it scales. Photo evidence accompanies each milestone.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Delivery and acceptance</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  Final goods clear the AQL audit before any carton is sealed. We arrange DDP shipping for UK and US destinations, or hand off to your nominated freight forwarder if you prefer. The acceptance window after delivery is {/* TODO(content): your standard inspection window, e.g. 14 days */} — anything outside spec inside that window is resolved at our cost.
                </p>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="border border-[#1a1a1a] p-8 lg:p-10 bg-black">
                <div className="overline mb-2">DELIVERABLES AT EACH STAGE</div>
                <p className="font-body text-[12px] leading-[1.7] text-[#777] mb-8">What arrives in your inbox as the project moves from brief to delivered shipment.</p>
                <ol className="divide-y divide-[#181818]">
                  {DELIVERABLES.map((item, i) => (
                    <li key={i} className="py-4 first:pt-0 last:pb-0 grid grid-cols-12 gap-3 items-baseline">
                      <span className="col-span-2 font-display text-[12px] tracking-luxe text-[#777]">{String(i + 1).padStart(2, "0")}</span>
                      <span className="col-span-10 font-body text-[14px] leading-[1.55] text-[#e5e5e5]">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-12 bg-[#0a0a0a] text-center">
        <h2 className="font-display text-3xl lg:text-5xl text-[#F2F2F2] max-w-3xl mx-auto leading-tight">Begin step one — share your brief.</h2>
        <Link to="/quote" data-testid="process-cta" className="gf-btn gf-btn-solid mt-10">Request a Quote</Link>
      </section>
    </div>
  );
}
