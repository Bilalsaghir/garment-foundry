import React from "react";
import { Link } from "react-router-dom";
import PageMeta from "@/components/PageMeta";
import { SectionHeading } from "@/components/Section";
import { CAPABILITIES, IMAGES } from "@/lib/content";

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
          <p className="mt-8 max-w-2xl font-body text-[14px] leading-[1.95] text-[#bbb]">
            From the first sketch to the final shipment, our capabilities span the entire production journey. Audited facilities, considered partners, exacting standards.
          </p>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeading eyebrow="THE FULL STACK" number="— 001" title="Ten disciplines. One workflow." />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]">
            {CAPABILITIES.map((c) => (
              <div key={c.num} data-testid={`cap-${c.num}`} className="bg-black p-10 hover:bg-[#0a0a0a] transition-colors">
                <span className="eyebrow-number">{c.num}</span>
                <h3 className="mt-6 font-display text-2xl text-[#F2F2F2]">{c.title}</h3>
                <div className="dashed-rule mt-4 text-[#333] w-12" />
                <p className="mt-6 font-body text-[13px] leading-[1.9] text-[#999]">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-12 bg-[#070707] text-center">
        <h2 className="font-display text-3xl lg:text-5xl text-[#F2F2F2] max-w-3xl mx-auto leading-tight">Tell us what you are building.</h2>
        <Link to="/quote" data-testid="cap-cta" className="gf-btn gf-btn-solid mt-10">Request a Quote</Link>
      </section>
    </div>
  );
}
