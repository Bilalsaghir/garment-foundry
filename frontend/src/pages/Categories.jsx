import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/Section";
import { CATEGORIES, IMAGES } from "@/lib/content";

const IMG_MAP = [IMAGES.cutting, IMAGES.fabric, IMAGES.threads, IMAGES.stitching, IMAGES.hero, IMAGES.cutting, IMAGES.fabric, IMAGES.threads, IMAGES.stitching, IMAGES.hero, IMAGES.cutting, IMAGES.fabric, IMAGES.threads];

export default function Categories() {
  return (
    <div data-testid="page-categories" className="bg-black">
      <section className="pt-40 pb-16 px-6 lg:px-12 border-b border-[#1a1a1a]">
        <div className="max-w-[1440px] mx-auto">
          <span className="overline">CHAPTER · CATEGORIES</span>
          <h1 className="mt-6 font-display text-5xl lg:text-7xl text-[#F2F2F2] leading-[1.05] max-w-4xl">
            Built across the entire apparel spectrum.
          </h1>
          <p className="mt-8 max-w-2xl font-body text-[14px] leading-[1.95] text-[#bbb]">
            From streetwear hoodies to tailored uniforms, technical activewear to children's basics — we manufacture across every major category.
          </p>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeading eyebrow="CATEGORIES" number="— 001" title="Specifications for every brief." />
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]">
            {CATEGORIES.map((cat, i) => (
              <Link
                to="/quote"
                key={cat}
                data-testid={`cat-card-${cat.replace(/[^a-z]/gi, '').toLowerCase()}`}
                className="bg-black group relative aspect-[5/6] overflow-hidden"
              >
                <img src={IMG_MAP[i % IMG_MAP.length]} alt={cat} className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="relative h-full p-8 flex flex-col justify-between">
                  <span className="eyebrow-number">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-2xl lg:text-3xl text-[#F2F2F2] leading-tight">{cat}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="overline text-[#888]">REQUEST QUOTE</span>
                      <ArrowUpRight size={16} className="text-[#999] group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
