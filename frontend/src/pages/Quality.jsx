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

export default function Quality() {
  return (
    <div data-testid="page-quality" className="bg-black">
      <PageMeta path="/quality" title="Quality Control & AQL Inspections | Garment Foundry" description="AQL inspections, mid- and final-production checks, lab dips and fit approvals. Quality control built into every Garment Foundry order." />
      <section className="pt-40 pb-16 px-6 lg:px-12 border-b border-[#1a1a1a]">
        <div className="max-w-[1440px] mx-auto">
          <span className="overline">CHAPTER · QUALITY CONTROL</span>
          <h1 className="mt-6 font-display text-5xl lg:text-7xl text-[#F2F2F2] leading-[1.05] max-w-4xl">
            Six checkpoints. Zero compromise.
          </h1>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 lg:gap-16">
          <div className="col-span-12 lg:col-span-5">
            <img src={IMAGES.stitching} alt="Close-up of stitch construction under quality inspection" className="w-full h-[640px] object-cover grayscale" />
          </div>
          <div className="col-span-12 lg:col-span-7">
            <SectionHeading eyebrow="QC PROTOCOL" number="— 001" title="Quality is built in — not inspected at the end." subtitle="Every garment passes through six independent stages of inspection. The result: consistent, brand-grade product delivered ready for sale." />
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

      <section className="py-24 px-6 lg:px-12 bg-[#070707] text-center">
        <h2 className="font-display text-3xl lg:text-5xl text-[#F2F2F2] max-w-3xl mx-auto leading-tight">Manufacture with confidence.</h2>
        <Link to="/quote" data-testid="quality-cta" className="gf-btn gf-btn-solid mt-10">Request a Quote</Link>
      </section>
    </div>
  );
}
