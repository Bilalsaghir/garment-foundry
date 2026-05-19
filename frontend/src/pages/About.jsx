import React from "react";
import { Link } from "react-router-dom";
import PageMeta from "@/components/PageMeta";
import { SectionHeading, StitchedDivider } from "@/components/Section";
import { GFMonogram } from "@/components/GFMonogram";
import { IMAGES, PRINCIPLES } from "@/lib/content";

export default function About() {
  return (
    <div data-testid="page-about" className="bg-black">
      <PageMeta path="/about" title="About Garment Foundry | UK Apparel Manufacturing Partner" description="Manchester-based apparel manufacturing partner working with fashion, uniform and private-label brands across the UK and beyond." />
      {/* Page header */}
      <section className="pt-40 pb-16 px-6 lg:px-12 border-b border-[#1a1a1a]">
        <div className="max-w-[1440px] mx-auto">
          <span className="overline">CHAPTER · ABOUT</span>
          <h1 className="mt-6 font-display text-5xl lg:text-7xl text-[#F2F2F2] leading-[1.05] max-w-4xl">
            A UK manufacturing house, built for serious brands.
          </h1>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 lg:gap-16">
          <div className="col-span-12 lg:col-span-6">
            <img src={IMAGES.cutting} alt="Pattern cutting" className="w-full h-[640px] object-cover grayscale" />
          </div>
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center">
            <span className="eyebrow-number">— 001 / ORIGIN</span>
            <h2 className="mt-6 font-display text-3xl lg:text-4xl text-[#F2F2F2] leading-[1.15]">
              Built for brand owners who treat manufacturing as part of the product.
            </h2>
            <p className="mt-6 font-body text-[14px] leading-[1.95] text-[#bbb]">
              Garment Foundry was founded to give clothing brands a manufacturing partner that operates with the same standards of detail and transparency they expect of themselves.
            </p>
            <p className="mt-4 font-body text-[14px] leading-[1.95] text-[#bbb]">
              We pair UK production oversight with a vetted global mill network — selecting the right facility, mill and finishing house for each project. For brand owners who care about every stitch, label and gram of fabric.
            </p>
            {/* TODO(content): verify these figures (100+ brands / 14 countries / 2M+ units) are substantiated before keeping. Audit-critical: every public claim must be defensible. */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-y border-[#1a1a1a] py-8">
              <div><div className="font-display text-3xl text-[#F2F2F2]">100+</div><div className="overline mt-2">BRANDS SERVED</div></div>
              <div><div className="font-display text-3xl text-[#F2F2F2]">14</div><div className="overline mt-2">COUNTRIES SHIPPED</div></div>
              <div><div className="font-display text-3xl text-[#F2F2F2]">2M+</div><div className="overline mt-2">UNITS PRODUCED</div></div>
            </div>
          </div>
        </div>
      </section>

      <StitchedDivider />

      <section className="py-24 lg:py-32 px-6 lg:px-12 bg-[#070707]">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeading eyebrow="PRINCIPLES" number="— 002" title="What we hold to, in every project." />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]">
            {PRINCIPLES.map((p, i) => (
              <div key={p.title} data-testid={`about-principle-${i}`} className="bg-[#070707] p-10">
                <span className="eyebrow-number">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 font-display text-2xl text-[#F2F2F2]">{p.title}</h3>
                <p className="mt-4 font-body text-[13px] leading-[1.9] text-[#999]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-12 text-center">
        <GFMonogram size={50} className="mx-auto" color="#F2F2F2" />
        <h2 className="mt-10 font-display text-3xl lg:text-5xl text-[#F2F2F2] max-w-3xl mx-auto leading-tight">Let's build something that lasts.</h2>
        <Link to="/quote" data-testid="about-cta" className="gf-btn gf-btn-solid mt-10">Request a Quote</Link>
      </section>
    </div>
  );
}
