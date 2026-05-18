import React from "react";
import { Link } from "react-router-dom";
import PageMeta from "@/components/PageMeta";
import { SectionHeading, StitchedDivider } from "@/components/Section";
import { IMAGES } from "@/lib/content";

const REGIONS = [
  { region: "United Kingdom", focus: "Heritage tailoring · technical knitwear · short-run boutique production." },
  { region: "Portugal", focus: "Premium jersey · cut & sew basics · refined finishing." },
  { region: "Türkiye", focus: "Denim · outerwear · activewear · mid-volume mills." },
  { region: "India", focus: "Cotton woven · embroidery · printed apparel · sustainable yarn." },
  { region: "Bangladesh", focus: "High-volume knits · wovens · uniform programmes." },
  { region: "China", focus: "Technical fabrics · performance wear · accessories." },
];

const CERTIFICATIONS = ["GOTS", "OEKO-TEX 100", "BCI Cotton", "GRS Recycled", "WRAP", "SA8000", "BSCI", "Sedex"];

const FABRIC_FAMILIES = [
  { name: "Jersey", detail: "single, double, interlock, French terry, fleece" },
  { name: "Woven", detail: "poplin, twill, oxford, sateen, canvas" },
  { name: "Denim", detail: "8 to 14 oz, raw or finished" },
  { name: "Knitwear", detail: "fine to chunky gauge, intarsia, jacquard" },
  { name: "Performance", detail: "recycled poly, nylon shell, technical knits" },
  { name: "Outerwear", detail: "coated, laminated and quilted constructions" },
  { name: "Trims", detail: "woven labels, hardware, drawcords, custom prints" },
];

export default function Sourcing() {
  return (
    <div data-testid="page-sourcing" className="bg-black">
      <PageMeta path="/sourcing" title="Fabric Sourcing — UK, Europe & Asia | Garment Foundry" description="Fabric and trim sourcing across UK mills, European converters and vetted Asian partners — matched to the project, not the other way round." />
      <section className="pt-40 pb-16 px-6 lg:px-12 border-b border-[#1a1a1a] relative overflow-hidden">
        <img src={IMAGES.fabric} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="relative max-w-[1440px] mx-auto">
          <span className="overline">CHAPTER · SOURCING</span>
          <h1 className="mt-6 font-display text-5xl lg:text-7xl text-[#F2F2F2] leading-[1.05] max-w-4xl">
            Global sourcing. Trusted partnerships.
          </h1>
          <p className="mt-8 max-w-2xl font-body text-[14px] leading-[1.95] text-[#bbb]">
            We work with audited mills, dye houses and manufacturing partners across six countries — each selected for craft, capability and compliance.
          </p>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeading eyebrow="THE NETWORK" number="— 001" title="Six countries. One standard." />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]">
            {REGIONS.map((r, i) => (
              <div key={r.region} data-testid={`region-${i}`} className="bg-black p-10">
                <span className="eyebrow-number">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 font-display text-2xl text-[#F2F2F2]">{r.region}</h3>
                <p className="mt-4 font-body text-[13px] leading-[1.9] text-[#999]">{r.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StitchedDivider />

      <section className="py-24 lg:py-32 px-6 lg:px-12 bg-[#070707]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="col-span-12 lg:col-span-6">
            <SectionHeading eyebrow="COMPLIANCE" number="— 002" title="Audited mills. Ethical labour. Verified materials." subtitle="Every partner facility undergoes social and quality audits. Materials are traceable from yarn to finished garment." />
          </div>
          <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-px bg-[#1a1a1a]">
            {CERTIFICATIONS.map((c, i) => (
              <div key={c} data-testid={`cert-${i}`} className="bg-[#070707] p-8 text-center">
                <div className="font-display text-lg text-[#F2F2F2] tracking-luxe">{c}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CR-G: expanded sourcing detail. */}
      <section className="py-24 lg:py-32 px-6 lg:px-12 border-t border-[#1a1a1a]">
        <div className="max-w-[1100px] mx-auto">
          <SectionHeading eyebrow="HOW WE SOURCE" number="— 003" title="Matched to the project, not the other way round." subtitle="No single country is right for every garment. We map your specification — fibre, finish, MOQ, lead time, ethics — to the partner that can deliver it without compromise." />

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 space-y-10">
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Mill selection criteria</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  We score every potential partner on four dimensions: technical capability for the fibre, ethical-audit status, lead-time predictability, and minimum quantity fit. Mills that score well on three but fail on the fourth do not enter the shortlist. {/* TODO(content): list any preferred-supplier programmes you operate */}
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Raw material traceability</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  For fabric, we ask for yarn-level origin information wherever the mill can provide it — useful when you need to substantiate origin claims to retailers or to your own customers. Recycled and certified materials carry their certification number on the lot record.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Audit cadence</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  Partner facilities are audited annually against social and quality standards (Sedex, BSCI or equivalent, depending on the country). We supplement scheduled audits with unannounced spot visits {/* TODO(content): frequency or programme name */} so the formal audit isn't the only signal we trust.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-[#F2F2F2]">Sustainable yarn options</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.95] text-[#aaa]">
                  Where the project allows it, we offer GOTS-certified organic cotton, BCI cotton, GRS recycled polyester, and OEKO-TEX-tested fabrics with verifiable certification documentation. We can quote any specification in both a conventional and a sustainable variant so you can compare directly.
                </p>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="border border-[#1a1a1a] p-8 lg:p-10 bg-[#070707]">
                <div className="overline mb-2">FABRIC FAMILIES WE WORK IN</div>
                <p className="font-body text-[12px] leading-[1.7] text-[#777] mb-8">The fabric families we routinely produce in &mdash; not the full list, but the bulk of our output.</p>
                <dl className="divide-y divide-[#181818]">
                  {FABRIC_FAMILIES.map((row) => (
                    <div key={row.name} className="py-4 first:pt-0 last:pb-0 grid grid-cols-12 gap-3 items-baseline">
                      <dt className="col-span-12 sm:col-span-4 font-display text-[15px] text-[#F2F2F2] leading-snug">{row.name}</dt>
                      <dd className="col-span-12 sm:col-span-8 font-body text-[13.5px] leading-[1.6] text-[#ccc]">{row.detail}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-12 text-center">
        <h2 className="font-display text-3xl lg:text-5xl text-[#F2F2F2] max-w-3xl mx-auto leading-tight">A sourcing partner that does the diligence.</h2>
        <Link to="/quote" data-testid="sourcing-cta" className="gf-btn gf-btn-solid mt-10">Request a Quote</Link>
      </section>
    </div>
  );
}
