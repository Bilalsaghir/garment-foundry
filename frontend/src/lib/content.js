// Centralised brand & imagery constants
// CR-D: hero swapped to the locally-hosted /hero-image.png that already lives
// in public/ on the VPS (per the project brief). The previous CDN-hosted hero
// was AI-generated and served with a non-descriptive hash filename.
// TODO(images): fabric / stitching / threads / cutting / paper still live on
// Emergent's CDN. They're decorative on most pages but should be replaced with
// real factory photography (or self-hosted equivalents) when available.
export const IMAGES = {
  hero: "/hero-image.png",
  fabric: "https://static.prod-images.emergentagent.com/jobs/140831b8-52d2-4520-83b3-4b0a744ef559/images/768cd34c9eb10b45fa902ce106d0c54d89c29214e6ff8b3f56ef5b9e9f52c494.png",
  stitching: "https://static.prod-images.emergentagent.com/jobs/140831b8-52d2-4520-83b3-4b0a744ef559/images/a37ad15092bbe267d99d40cd9d81d39943c1f3f0c46fdcc8ce25079ca267908c.png",
  threads: "https://static.prod-images.emergentagent.com/jobs/140831b8-52d2-4520-83b3-4b0a744ef559/images/4a8ec29d97e0e09258ead7e9fb65db5aaf739024ed5a9f232d366847037ba06b.png",
  cutting: "https://static.prod-images.emergentagent.com/jobs/140831b8-52d2-4520-83b3-4b0a744ef559/images/26130d1db9ad415ea9d457d56e3726dcf58fdc568bee6da95522cde41364f04b.png",
  paper: "https://static.prod-images.emergentagent.com/jobs/140831b8-52d2-4520-83b3-4b0a744ef559/images/f3b69af3019d60b0209c12b1fcd2da62b2ee949b21daad4597c9f0bc3d3828a0.png",
};

export const CAPABILITIES = [
  { num: "01", title: "Design Support", body: "Tech pack development, pattern engineering and concept refinement." },
  { num: "02", title: "Sampling", body: "Prototype, fit and pre-production samples with iterative refinement." },
  { num: "03", title: "Fabric Sourcing", body: "Curated mills across UK, Europe and Asia for performance and hand-feel." },
  { num: "04", title: "Cut & Sew", body: "Precision construction across knits, wovens, technical and tailored." },
  { num: "05", title: "Print & Embroidery", body: "Screen, DTG, sublimation, digital embroidery and applique." },
  { num: "06", title: "Labels & Trims", body: "Woven labels, hang tags, care labels, hardware and finishings." },
  { num: "07", title: "Packaging", body: "Branded tissue, custom mailers, retail-ready folding and polybagging." },
  { num: "08", title: "Bulk Production", body: "Scalable runs from 100 to 100,000 units with controlled lead times." },
  { num: "09", title: "Quality Control", body: "Multi-stage inspections — fabric, in-line, end-line and AQL audits." },
  { num: "10", title: "Logistics", body: "Door-to-door freight, customs clearance and DDP shipping to UK & US." },
];

// 12 categories — divides cleanly into the 3- and 4-column grids on
// /categories and the home page. Outerwear was dropped because the audit-
// expanded Capabilities/Categories copy already covers shell/quilted pieces
// under the "Performance" and "Knit vs woven" sections, and Outerwear has
// the heaviest overlap with Hoodies & Sweats / Activewear in our actual mix.
export const CATEGORIES = [
  "Menswear", "Womenswear", "Childrenswear", "Streetwear", "Sportswear",
  "Uniforms", "Workwear", "Hoodies & Sweats", "T-Shirts & Tops",
  "Trousers & Bottoms", "Activewear", "Accessories",
];

// HP-B: per-category photography. Each path resolves to a file in
// frontend/public/categories/, served by nginx as a static asset under
// /categories/*. Keep the slug map in sync if a category name is renamed.
export const CATEGORY_IMAGES = {
  "Menswear": "/categories/garment-foundry-menswear.jpg",
  "Womenswear": "/categories/garment-foundry-womenswear.jpg",
  "Childrenswear": "/categories/garment-foundry-childrenswear.jpg",
  "Streetwear": "/categories/garment-foundry-streetwear.jpg",
  "Sportswear": "/categories/garment-foundry-sportswear.jpg",
  "Uniforms": "/categories/garment-foundry-uniforms.jpg",
  "Workwear": "/categories/garment-foundry-workwear.jpg",
  "Hoodies & Sweats": "/categories/garment-foundry-hoodies-sweats.jpg",
  "T-Shirts & Tops": "/categories/garment-foundry-tshirts-tops.jpg",
  "Trousers & Bottoms": "/categories/garment-foundry-trousers-bottoms.jpg",
  "Activewear": "/categories/garment-foundry-activewear.jpg",
  "Accessories": "/categories/garment-foundry-accessories.jpg",
};

// object-position override per category — applied to the <img> on the home
// bento and the /categories card. Default is `object-center`; only list a
// category here when the subject sits noticeably off-centre and would get
// cropped out otherwise. Acceptable values: left, center, right (Tailwind's
// object-{left,center,right} utility class suffixes).
export const CATEGORY_IMAGE_POSITION = {
  "Menswear": "left",
  // Add per-category overrides here as you eyeball each image, e.g.:
  // "Uniforms": "right",
};

export const PROCESS_STEPS = [
  { num: "01", title: "Brief", body: "We listen first. Share your concept, tech pack or sketches." },
  { num: "02", title: "Consultation", body: "We advise on fabric, construction, MOQ and lead time." },
  { num: "03", title: "Sampling", body: "Prototype and fit samples until specifications are met." },
  { num: "04", title: "Quotation", body: "Transparent, all-inclusive costings — no hidden margins." },
  { num: "05", title: "Production", body: "Bulk manufacturing in monitored, audited facilities." },
  { num: "06", title: "Quality Control", body: "Multi-stage inspection against agreed AQL standards." },
  { num: "07", title: "Delivery", body: "DDP shipping to your warehouse or third-party logistics." },
];

export const PRINCIPLES = [
  { title: "Craftsmanship", body: "Meticulous attention to detail in every stitch and seam." },
  { title: "Precision", body: "Exacting standards ensure consistency at every scale." },
  { title: "Global Sourcing", body: "Trusted networks. Ethical partners. Global reach." },
  { title: "Reliability", body: "Delivering on promises with transparency and integrity." },
  { title: "Partnership", body: "More than a manufacturer. An extension of your brand." },
  { title: "Purpose", body: "Bringing your designs to life with care and commitment." },
];

// CR-C: 10 FAQs covering the audit-recommended topics (MOQ, lead times, sample
// costs, tech-pack contents, IP/NDA, payment terms, fabric sourcing,
// sustainability, shipping, how to begin). These also drive the FAQPage
// JSON-LD emitted from pages/FAQs.jsx — keep the wording factual and avoid
// inventing specifics that aren't true elsewhere on the site.
export const FAQS = [
  {
    q: "What is the minimum order quantity?",
    a: "MOQs typically begin at 100 pieces per style per colour for cut and sew. Some categories such as printed t-shirts can start lower; knitwear and uniforms usually start higher. We confirm a viable MOQ once we know the fabric, construction and finishing.",
  },
  {
    q: "How long does a typical project take?",
    a: "Sampling generally takes 3–4 weeks. Bulk production lead times range from 6 to 12 weeks depending on quantity, fabric availability and finishing. We confirm timelines in writing before production begins.",
  },
  {
    q: "Do you charge for samples?",
    a: "Yes. Sample fees cover pattern-making, fabric, trims and stitching, and are itemised on the proposal. They are typically credited against your bulk invoice when you proceed to production.",
  },
  {
    q: "What needs to be in a tech pack?",
    a: "At minimum: a technical drawing, a size grade, fabric and trim references with composition, construction notes, and any branding (labels, print, embroidery) you want. If you do not have all of that, our team can help develop it during sampling.",
  },
  {
    q: "Do you sign NDAs and protect our IP?",
    a: "Yes. We sign mutual NDAs before reviewing any tech pack, and we never share client work or imagery without written permission. Each project lives behind access controls on our side.",
  },
  {
    q: "How are payment terms structured?",
    a: "A typical breakdown is 30% deposit on order confirmation, 40% on production start, and the balance before despatch. We adjust for established clients and longer-term programmes.",
  },
  {
    q: "Where do you source fabric?",
    a: "From audited mills in the United Kingdom, Portugal, Türkiye, India, Bangladesh and China. We match each project to the right mill for the fibre, finish, MOQ and lead-time — not the other way round.",
  },
  {
    q: "Do you support sustainable and ethical sourcing?",
    a: "Yes. We work with mills offering GOTS, OEKO-TEX, BCI and recycled materials, and audit partner factories for fair-labour standards. We are happy to share certifications for any specific material on request.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. We ship DDP (Delivered Duty Paid) to the United Kingdom and the United States, and on agreed terms globally. Customs, duties and last-mile delivery are handled by us.",
  },
  {
    q: "How do I begin?",
    a: "Submit a quote request with as much detail as you have. A member of our production team will respond within one business day.",
  },
];
