import React from "react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/Section";
import { PROCESS_STEPS, IMAGES } from "@/lib/content";

export default function Process() {
  return (
    <div data-testid="page-process" className="bg-black">
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
            <img src={IMAGES.stitching} alt="" className="w-full h-[640px] object-cover grayscale sticky top-32" />
          </div>
          <div className="col-span-12 lg:col-span-7">
            <SectionHeading eyebrow="THE WORKFLOW" number="— 001" title="A considered path to production." />
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

      <section className="py-24 px-6 lg:px-12 bg-[#070707] text-center">
        <h2 className="font-display text-3xl lg:text-5xl text-[#F2F2F2] max-w-3xl mx-auto leading-tight">Begin step one — share your brief.</h2>
        <Link to="/quote" data-testid="process-cta" className="gf-btn gf-btn-solid mt-10">Request a Proposal</Link>
      </section>
    </div>
  );
}
