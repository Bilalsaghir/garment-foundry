import React, { useEffect, useState } from "react";
import axios from "axios";
import PageMeta from "@/components/PageMeta";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/Section";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CaseStudies() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/case-studies`).then((r) => setItems(r.data || [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="page-case-studies" className="bg-black">
      <PageMeta path="/case-studies" title="Case Studies — Brands We Manufacture For | Garment Foundry" description="Selected work with apparel, uniform and merch brands manufactured by Garment Foundry." noindex />
      <section className="pt-40 pb-16 px-6 lg:px-12 border-b border-[#1a1a1a]">
        <div className="max-w-[1440px] mx-auto">
          <span className="overline">CHAPTER · CASE STUDIES</span>
          <h1 className="mt-6 font-display text-5xl lg:text-7xl text-[#F5F4F0] leading-[1.05] max-w-4xl">
            Partnering with brands of every scale.
          </h1>
        </div>
      </section>

      <section className="py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeading eyebrow="SELECTED WORK" number="— 001" title="A few of the projects we are proud of." />
          {loading ? (
            <p className="mt-12 font-body text-[13px] text-[#888]">Loading…</p>
          ) : items.length === 0 ? (
            <p className="mt-12 font-body text-[13px] text-[#888]">Case studies coming soon.</p>
          ) : (
            <div className="mt-12 space-y-px bg-[#1a1a1a]">
              {items.map((c, i) => (
                <Link to={`/case-studies/${c.id}`} key={c.id} data-testid={`cs-row-${i}`} className="grid grid-cols-12 gap-6 bg-black p-8 lg:p-10 hover:bg-[#0a0a0a] transition-colors group items-center">
                  <div className="col-span-12 lg:col-span-1 font-display text-[10px] tracking-[0.2em] text-[#666]">{String(i + 1).padStart(2, "0")}</div>
                  <div className="col-span-12 lg:col-span-3">
                    <div className="font-body text-[10px] tracking-[0.2em] uppercase text-[#888]">{c.industry}</div>
                    <div className="mt-2 font-display text-lg text-[#F5F4F0]">{c.anonymise_client ? "Leading UK Brand" : c.client_name}</div>
                  </div>
                  <h3 className="col-span-12 lg:col-span-6 font-display text-xl lg:text-2xl text-[#F5F4F0] leading-snug group-hover:underline">{c.title}</h3>
                  <div className="col-span-12 lg:col-span-2 lg:text-right font-body text-[10px] tracking-[0.2em] uppercase text-[#888] group-hover:text-white">READ ↗</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
