import React from "react";
import { Link } from "react-router-dom";
import PageMeta from "@/components/PageMeta";
import { SectionHeading } from "@/components/Section";
import { IMAGES } from "@/lib/content";

const QC_STAGES = [
  { num: "01", title: "Pre-production", body: "Fabric testing for shrinkage, colourfastness and GSM consistency before cutting." },
  { num: "02", title: "In-line", body: "Inspections every 30% of the production run to catch deviations early." },
  { num: "03", title: "End-line", body: "100% visual inspection on finished garments — seams, prints, labels, fit." },
  { num: "04", title: "AQL Audit", body: "Final statistical sampling against agreed AQL 2.5 or stricter standard." },
  { num: "05", title: "Measurement", body: "Spec-sheet measurements verified across sizes for full size-curve consistency." },
  { num: "06", title: "Pre-shipment", body: "Carton inspection, packing audit and shipping documentation review." },
];

const DEFECT_CATEGORIES = [
  { name: "Fabric flaws", detail: "slubs, holes, weave deviation" },
  { name: "Colour deviation", detail: "shade, fastness, batch mismatch" },
  { name: "Seam construction", detail: "stitch density, skipped stitches, pucker" },
  { name: "Measurement", detail: "out-of-tolerance against the grade" },
  { name: "Labelling", detail: "care content, position, durability" },
  { name: "Print & embroidery", detail: "registration, durability" },
  { name: "Hardware", detail: "corrosion, function, sharp edges" },
  { name: "Packaging", detail: "folding, polybag, carton labelling" },
];

export default function Quality() {
  return (
    <div data-testid="page-quality" className="bg-black">
      <PageMeta path="/quality" title="Quality Control & AQL Inspections | Garment Foundry" description="AQL inspections, mid- and final-production checks, lab dips and fit approvals. Quality control built into every Garment Foundry order." />
      <section className="pt-40 pb-16 px-6 lg:px-12 border-b border-[#1a1a1a]">
        <div className="max-w-[1440px] mx-auto">
          <span className="overline">CHAPTER · QUALITY CONTROL</span>
          <h1 className="mt-6 font-display text-5xl lg:text-7xl text-[#F2F2F2] leading-[1.05] max-w-4xl">
            Six checkpoints. Documented at every stage.
          </h1>
        </div>
      </section>

      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 lg:gap-16">
          <div className="col-span-12 lg:col-span-5">
            <img src={IMAGES.stitching} alt="Close-up of stitch construction under quality inspection" className="w-full h-[640px] object-cover grayscale" />
          </div>
          <div className="col-span-12 lg:col-span-7">
            <SectionHeading eyebrow="QC PROTOCOL" number="— 001" title="Quality is built in — not inspected at the end." subtitle="Every garment passes six independent stages of inspection. The result: a final lot you can put on shelves without re-checking." />
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#1a1a1a]">
              {QC_STAGES.map((s) => (
                <div key={s.num} data-testid={`qc-${s.num}`} className="bg-black p-8">
                  <span className="eyebrow-number">{s.num}</span>
                  <h3 className="mt-4 font-display text-xl text-[#F2F2F2]">{s.title}</h3>
                  <p className="mt-3 font-body text-[12.5px] leading-[1.85] text-[#999]">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CR-G: expanded quality detail. */}
      <section className="py-16 lg:py-24 px-6 lg:px-12 bg-[#070707] border-t border-[#1a1a1a]">
        <div className="max-w-[1100px] mx-auto">
          <SectionHeading eyebrow="HOW QC IS BUILT IN" number="— 002" title="What our inspections actually catch — and how." subtitle="Quality is the product of a documented process, not a final-stage hope. Each inspection has a written standard, a sampling plan and a defect log that travels with the order from cutting through despatch." />

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 space-y-10">
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Fabric and trim testing</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  Before any roll is cut, fabric is tested for GSM, shrinkage, colourfastness to wash and rub, and pilling resistance against the agreed standard. Trims — labels, zips, drawcords, snaps — are checked for breaking strength and corrosion. {/* TODO(content): list any specific test methods you reference, e.g. ISO 105-B02, AATCC 8 */}
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">In-line inspections</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  Sewing lines are audited at the 30% and 70% production milestones. We sample by random selection across operators, looking for stitch density, seam alignment, label placement and any deviation from the approved pre-production sample. Findings feed back into the line within hours, not at the end of the run.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">End-line and final AQL</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  Every finished garment passes a 100% visual inspection. A separate statistical AQL audit then samples the lot against an agreed acceptance quality limit — typically AQL 2.5 for major defects and AQL 4.0 for minor, stricter on request. If the lot fails, it is reworked or rejected before despatch.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Documentation</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  Every order ships with a final inspection report — sampling plan, defect counts by category, photo evidence and a signed sign-off. The same documentation is retained on our side for {/* TODO(content): your retention period, e.g. 24 months */} so you can refer back if a question surfaces after delivery.
                </p>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="border border-[#1a1a1a] p-8 lg:p-10 bg-black">
                <div className="overline mb-2">DEFECT CATEGORIES WE LOG</div>
                <p className="font-body text-[12px] leading-[1.7] text-[#777] mb-8">Every order ships with a defect log against these categories &mdash; counted, photographed and signed off.</p>
                <dl className="divide-y divide-[#181818]">
                  {DEFECT_CATEGORIES.map((row) => (
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

      <section className="py-24 px-6 lg:px-12 bg-[#0a0a0a] text-center">
        <h2 className="font-display text-3xl lg:text-5xl text-[#F2F2F2] max-w-3xl mx-auto leading-tight">Manufacture with confidence.</h2>
        <Link to="/quote" data-testid="quality-cta" className="gf-btn gf-btn-solid mt-10">Request a Quote</Link>
      </section>
    </div>
  );
}
