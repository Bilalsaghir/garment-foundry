import React, { useEffect, useState } from "react";
import axios from "axios";
import PageMeta from "@/components/PageMeta";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/Section";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/blog`).then((r) => setPosts(r.data || [])).catch(() => setPosts([])).finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="page-blog" className="bg-black">
      <PageMeta path="/blog" title="Journal — Notes on Apparel Manufacturing | Garment Foundry" description="Notes from the studio on apparel manufacturing, fabric sourcing, MOQs and the realities of getting clothes made." />
      <section className="pt-40 pb-16 px-6 lg:px-12 border-b border-[#1a1a1a]">
        <div className="max-w-[1440px] mx-auto">
          <span className="overline">CHAPTER · JOURNAL</span>
          <h1 className="mt-6 font-display text-5xl lg:text-7xl text-[#F5F4F0] leading-[1.05] max-w-4xl">
            Notes from the studio.
          </h1>
        </div>
      </section>

      <section className="py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeading eyebrow="ARTICLES" number="— 001" title="Reading from Garment Foundry." />
          {loading ? (
            <p className="mt-12 font-body text-[13px] text-[#888]">Loading…</p>
          ) : posts.length === 0 ? (
            <p className="mt-12 font-body text-[13px] text-[#888]">No articles published yet. Check back soon.</p>
          ) : (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]">
              {posts.map((p, i) => (
                <Link to={`/blog/${p.slug}`} key={p.slug} data-testid={`blog-card-${i}`} className="bg-black p-8 group hover:bg-[#0a0a0a] transition-colors flex flex-col">
                  {p.cover_image && (
                    <div className="aspect-[5/3] overflow-hidden mb-6">
                      <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="font-body text-[10px] tracking-[0.2em] uppercase text-[#666]">{p.category || "ARTICLE"} · {p.published_at ? new Date(p.published_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : ""}</div>
                  <h3 className="mt-3 font-display text-2xl text-[#F5F4F0] leading-tight">{p.title}</h3>
                  {p.excerpt && <p className="mt-3 font-body text-[13px] leading-[1.9] text-[#999]">{p.excerpt}</p>}
                  <div className="mt-6 flex items-center gap-2 text-[#888] group-hover:text-white transition-colors font-body text-[10px] tracking-[0.2em] uppercase">READ <ArrowUpRight size={14} /></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
