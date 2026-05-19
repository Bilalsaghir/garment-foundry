import React from "react";
import { Link } from "react-router-dom";
import PageMeta from "@/components/PageMeta";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/Section";
import { CATEGORIES, CATEGORY_IMAGES, CATEGORY_IMAGE_POSITION } from "@/lib/content";

const categoryObjectPosition = (cat) => CATEGORY_IMAGE_POSITION[cat] || "center";

const FABRIC_WEIGHTS = [
  { category: "T-shirts", weight: "150–220 gsm", fabric: "single jersey" },
  { category: "Hoodies & sweats", weight: "280–450 gsm", fabric: "fleece-back" },
  { category: "Activewear", weight: "180–260 gsm", fabric: "performance knits" },
  { category: "Shirting", weight: "100–160 gsm", fabric: "cotton / linen poplin" },
  { category: "Trousers", weight: "220–340 gsm", fabric: "twill or canvas" },
  { category: "Denim", weight: "8–14 oz", fabric: "raw or finished" },
  { category: "Outerwear", weight: "80–250 gsm", fabric: "shell with lining" },
  { category: "Knitwear", weight: "7gg–14gg", fabric: "full-fashioned" },
];

export default function Categories() {
  return (
    <div data-testid="page-categories" className="bg-black">
      <PageMeta path="/categories" title="Garment Categories We Manufacture | Garment Foundry" description="Menswear, womenswear, streetwear, activewear, uniforms and merch — the garment categories we manufacture for UK and global brands." />
      <section className="pt-40 pb-16 px-6 lg:px-12 border-b border-[#1a1a1a]">
        <div className="max-w-[1440px] mx-auto">
          <span className="overline">CHAPTER · CATEGORIES</span>
          <h1 className="mt-6 font-display text-5xl lg:text-7xl text-[#F2F2F2] leading-[1.05] max-w-4xl">
            Twelve apparel categories. One production setup.
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
                <img src={CATEGORY_IMAGES[cat]} alt={`${cat} apparel manufactured by Garment Foundry`} loading="lazy" style={{ objectPosition: categoryObjectPosition(cat) }} className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="relative h-full p-8 flex flex-col justify-between">
                  <span className="eyebrow-number">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-2xl lg:text-3xl text-[#F2F2F2] leading-tight">{cat}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="overline text-[#888]">VIEW CATEGORY</span>
                      <ArrowUpRight size={16} className="text-[#999] group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CR-G: expanded category detail. */}
      <section className="py-24 lg:py-32 px-6 lg:px-12 bg-[#070707] border-t border-[#1a1a1a]">
        <div className="max-w-[1100px] mx-auto">
          <SectionHeading eyebrow="HOW THE CATEGORIES GROUP" number="— 002" title="The categories above share a few underlying disciplines." subtitle="Most of what you see in the grid clusters around four manufacturing families. The category label is the front-end; the back-end is the fabric, the seam construction and the production scale." />

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 space-y-10">
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Knit versus woven — the fundamental split</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  Almost every garment we make is either a knit (jersey, fleece, knitwear) or a woven (shirting, denim, outerwear). The split decides which mill, which sewing line, which finishing house and which lead time. T-shirts, hoodies, sweats and most activewear sit on the knit side; trousers, shirting, denim and most uniforms sit on the woven side.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Volume categories — basics that scale</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  T-shirts, hoodies, sweatshirts and printed basics scale efficiently from a few hundred units into the high thousands without changing the underlying production setup. This is where MOQ floors come down fastest and where lead times can compress when fabric is already in stock at the mill. {/* TODO(content): typical MOQ and lead time on a stock-fabric tee programme */}
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Performance categories — activewear and workwear</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  Activewear and workwear share construction characteristics — technical fabrics, taped seams, hardware, reinforcement — that demand different machinery and different operators from a standard cut-and-sew line. Lead times run longer; MOQs sit higher; testing requirements (abrasion, tensile, colour-fastness to perspiration) are more demanding.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Premium categories — tailoring and knitwear</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  Tailored garments and full-fashioned knitwear are slower disciplines — hand-finished panels, set-in canvases, linking by stitch count. These sit naturally in our UK and Portuguese partner network where craft tradition lives. Volumes are lower, unit economics are different, and the sampling cycle takes longer.
                </p>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="border border-[#1a1a1a] p-8 lg:p-10 bg-black">
                <div className="overline mb-2">FABRIC WEIGHTS</div>
                <p className="font-body text-[12px] leading-[1.7] text-[#777] mb-8">Typical ranges by category &mdash; not a price list, just the kind of cloth most projects in each family land on.</p>
                <dl className="divide-y divide-[#181818]">
                  {FABRIC_WEIGHTS.map((row) => (
                    <div key={row.category} className="py-4 first:pt-0 last:pb-0 grid grid-cols-12 gap-3 items-baseline">
                      <dt className="col-span-12 sm:col-span-4 font-display text-[15px] text-[#F2F2F2] leading-snug">
                        {row.category}
                      </dt>
                      <dd className="col-span-12 sm:col-span-8 font-body text-[13.5px] leading-[1.6] text-[#ccc]">
                        <span className="text-[#F5F4F0] font-medium">{row.weight}</span>
                        <span className="text-[#666]"> &middot; </span>
                        <span>{row.fabric}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>

          <div className="mt-16 text-center">
            <Link to="/quote" data-testid="categories-cta" className="gf-btn gf-btn-solid">Request a Quote</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
