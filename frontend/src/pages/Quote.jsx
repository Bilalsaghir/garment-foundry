import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Upload, X, FileText } from "lucide-react";
import { GFMonogram } from "@/components/GFMonogram";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const GARMENT_TYPES = ["T-Shirts & Tops", "Hoodies & Sweats", "Trousers & Bottoms", "Outerwear", "Activewear", "Streetwear", "Uniforms / Workwear", "Childrenswear", "Knitwear", "Accessories", "Other"];
const QUANTITIES = ["100 – 500", "500 – 1,000", "1,000 – 5,000", "5,000 – 10,000", "10,000 – 25,000", "25,000+"];
const FABRICS = ["Cotton Jersey", "French Terry / Fleece", "Heavyweight Cotton", "Organic / GOTS", "Recycled Polyester", "Performance Technical", "Denim", "Wovens (Twill / Poplin)", "Wool / Knit Yarn", "Open to suggestion"];
const BRANDING_OPTIONS = ["Screen Print", "DTG Print", "Embroidery", "Sublimation", "Woven Labels", "Printed Care Labels", "Hang Tags", "Heat Transfer", "Patches"];
const PACKAGING = ["Polybag (standard)", "Branded Polybag", "Tissue Wrap + Sticker", "Folded + Hang Tag", "Custom Mailer Box", "Retail-ready"];
const COUNTRIES = ["United Kingdom", "United States", "European Union", "Canada", "Australia", "UAE", "Other"];
const TIMELINES = ["Standard (8 – 12 weeks)", "Priority (6 – 8 weeks)", "Express (4 – 6 weeks, surcharge)", "Flexible / planning ahead"];

const STEPS = [
  "Business", "Garment", "Quantity", "Fabric", "Branding",
  "Packaging", "Delivery", "Timeline", "Files", "Review",
];

export default function Quote() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState("");
  const [data, setData] = useState({
    company_name: "", contact_name: "", email: "", phone: "", website: "", country: "",
    garment_type: "", garment_subcategory: "", quantity: "",
    fabric_preference: "", branding: [], packaging: "",
    delivery_country: "", timeline: "", notes: "",
    files: [],
  });
  const [uploading, setUploading] = useState(false);

  const set = (patch) => setData((d) => ({ ...d, ...patch }));
  const toggleBranding = (b) => set({ branding: data.branding.includes(b) ? data.branding.filter((x) => x !== b) : [...data.branding, b] });

  const canNext = () => {
    switch (step) {
      case 0: return data.company_name && data.contact_name && data.email;
      case 1: return data.garment_type;
      case 2: return data.quantity;
      case 3: return data.fabric_preference;
      case 5: return data.packaging;
      case 6: return data.delivery_country;
      case 7: return data.timeline;
      default: return true;
    }
  };

  const next = () => {
    if (!canNext()) { toast.error("Please complete the required fields."); return; }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onFile = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const f of files) {
        if (f.size > 10 * 1024 * 1024) { toast.error(`${f.name} exceeds 10MB`); continue; }
        const fd = new FormData(); fd.append("file", f);
        const r = await axios.post(`${API}/upload`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        set({ files: [...data.files, r.data] });
      }
      toast.success("Files uploaded.");
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    } finally { setUploading(false); }
  };

  const removeFile = (id) => set({ files: data.files.filter((f) => f.id !== id) });

  const submit = async () => {
    setSubmitting(true);
    try {
      const r = await axios.post(`${API}/quotes`, data);
      setRefId(r.data.id);
      setSubmitted(true);
    } catch (err) {
      toast.error("Submission failed. Please try again.");
    } finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div data-testid="quote-success" className="bg-black min-h-screen pt-40 pb-32 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <GFMonogram size={64} className="mx-auto" color="#F2F2F2" />
          <h1 className="mt-10 font-display text-4xl lg:text-5xl text-[#F2F2F2] leading-tight">Thank you. Your enquiry is received.</h1>
          <p className="mt-6 font-body text-[14px] leading-[1.9] text-[#bbb]">A member of our production team will respond with an indicative proposal within <strong className="text-white">one business day</strong>. A confirmation has been sent to <strong className="text-white">{data.email}</strong>.</p>
          <div className="mt-10 border border-[#1a1a1a] p-6 inline-block">
            <div className="overline">REFERENCE</div>
            <div className="font-display text-lg text-[#F2F2F2] mt-2">{refId}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="page-quote" className="bg-black min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="overline">QUOTE CALCULATOR</span>
            <h1 className="mt-3 font-display text-3xl lg:text-5xl text-[#F2F2F2] leading-tight">Request a Manufacturing Proposal</h1>
          </div>
          <GFMonogram size={56} color="#F2F2F2" className="hidden md:block" />
        </div>

        {/* Progress Rail */}
        <div className="border border-[#1a1a1a] bg-[#050505]">
          <div className="grid grid-cols-10 border-b border-[#1a1a1a]">
            {STEPS.map((s, i) => (
              <button
                key={s}
                data-testid={`step-tab-${i}`}
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={`p-3 lg:p-4 text-left border-r border-[#1a1a1a] last:border-r-0 transition-colors ${i === step ? "bg-[#F2F2F2] text-black" : i < step ? "bg-black text-[#F2F2F2] hover:bg-[#0a0a0a]" : "bg-black text-[#444]"}`}
              >
                <div className={`font-display text-[10px] tracking-luxe ${i === step ? "text-black/70" : "text-[#666]"}`}>STEP {String(i + 1).padStart(2, "0")}</div>
                <div className="mt-1 font-body text-[10px] lg:text-[11px] tracking-precision uppercase font-medium truncate">{s}</div>
              </button>
            ))}
          </div>

          {/* Step Content */}
          <div className="p-8 lg:p-12 min-h-[480px]">
            {step === 0 && (
              <div data-testid="step-business">
                <div className="overline">STEP 01 — BUSINESS DETAILS</div>
                <h2 className="mt-3 font-display text-3xl text-[#F2F2F2]">Tell us about your brand.</h2>
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <div><label className="overline">Company / Brand Name *</label><input data-testid="q-company" value={data.company_name} onChange={(e) => set({ company_name: e.target.value })} className="gf-input mt-2" /></div>
                  <div><label className="overline">Contact Name *</label><input data-testid="q-contact" value={data.contact_name} onChange={(e) => set({ contact_name: e.target.value })} className="gf-input mt-2" /></div>
                  <div><label className="overline">Email *</label><input data-testid="q-email" type="email" value={data.email} onChange={(e) => set({ email: e.target.value })} className="gf-input mt-2" /></div>
                  <div><label className="overline">Phone</label><input data-testid="q-phone" value={data.phone} onChange={(e) => set({ phone: e.target.value })} className="gf-input mt-2" /></div>
                  <div><label className="overline">Website / Instagram</label><input data-testid="q-website" value={data.website} onChange={(e) => set({ website: e.target.value })} className="gf-input mt-2" /></div>
                  <div><label className="overline">Country</label><input data-testid="q-country" value={data.country} onChange={(e) => set({ country: e.target.value })} className="gf-input mt-2" /></div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div data-testid="step-garment">
                <div className="overline">STEP 02 — GARMENT TYPE</div>
                <h2 className="mt-3 font-display text-3xl text-[#F2F2F2]">What are we making?</h2>
                <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-px bg-[#1a1a1a]">
                  {GARMENT_TYPES.map((g) => (
                    <button key={g} data-testid={`g-${g}`} onClick={() => set({ garment_type: g })} className={`p-5 text-left font-body text-[12px] tracking-precision uppercase transition-colors ${data.garment_type === g ? "bg-[#F2F2F2] text-black" : "bg-black text-[#ddd] hover:bg-[#0a0a0a]"}`}>
                      {g}
                    </button>
                  ))}
                </div>
                <div className="mt-8"><label className="overline">Sub-category / Specific Style</label><input data-testid="q-subcategory" value={data.garment_subcategory} onChange={(e) => set({ garment_subcategory: e.target.value })} className="gf-input mt-2" placeholder="e.g. Heavyweight 400gsm oversized hoodie" /></div>
              </div>
            )}

            {step === 2 && (
              <div data-testid="step-quantity">
                <div className="overline">STEP 03 — QUANTITY</div>
                <h2 className="mt-3 font-display text-3xl text-[#F2F2F2]">Total units across the order?</h2>
                <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-px bg-[#1a1a1a]">
                  {QUANTITIES.map((q) => (
                    <button key={q} data-testid={`qty-${q}`} onClick={() => set({ quantity: q })} className={`p-6 text-left transition-colors ${data.quantity === q ? "bg-[#F2F2F2] text-black" : "bg-black text-[#ddd] hover:bg-[#0a0a0a]"}`}>
                      <div className={`font-display text-xl ${data.quantity === q ? "text-black" : "text-[#F2F2F2]"}`}>{q}</div>
                      <div className={`mt-1 overline ${data.quantity === q ? "text-black/60" : ""}`}>UNITS</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div data-testid="step-fabric">
                <div className="overline">STEP 04 — FABRIC</div>
                <h2 className="mt-3 font-display text-3xl text-[#F2F2F2]">Fabric preference?</h2>
                <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-px bg-[#1a1a1a]">
                  {FABRICS.map((f) => (
                    <button key={f} data-testid={`fab-${f}`} onClick={() => set({ fabric_preference: f })} className={`p-5 text-left font-body text-[12px] tracking-precision uppercase transition-colors ${data.fabric_preference === f ? "bg-[#F2F2F2] text-black" : "bg-black text-[#ddd] hover:bg-[#0a0a0a]"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div data-testid="step-branding">
                <div className="overline">STEP 05 — BRANDING &amp; FINISHING</div>
                <h2 className="mt-3 font-display text-3xl text-[#F2F2F2]">Select all that apply.</h2>
                <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-px bg-[#1a1a1a]">
                  {BRANDING_OPTIONS.map((b) => {
                    const on = data.branding.includes(b);
                    return (
                      <button key={b} data-testid={`brand-${b}`} onClick={() => toggleBranding(b)} className={`p-5 text-left transition-colors flex items-center justify-between ${on ? "bg-[#F2F2F2] text-black" : "bg-black text-[#ddd] hover:bg-[#0a0a0a]"}`}>
                        <span className="font-body text-[12px] tracking-precision uppercase">{b}</span>
                        {on && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 5 && (
              <div data-testid="step-packaging">
                <div className="overline">STEP 06 — PACKAGING</div>
                <h2 className="mt-3 font-display text-3xl text-[#F2F2F2]">How should each unit be packed?</h2>
                <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-px bg-[#1a1a1a]">
                  {PACKAGING.map((p) => (
                    <button key={p} data-testid={`pack-${p}`} onClick={() => set({ packaging: p })} className={`p-5 text-left font-body text-[12px] tracking-precision uppercase transition-colors ${data.packaging === p ? "bg-[#F2F2F2] text-black" : "bg-black text-[#ddd] hover:bg-[#0a0a0a]"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 6 && (
              <div data-testid="step-delivery">
                <div className="overline">STEP 07 — DELIVERY COUNTRY</div>
                <h2 className="mt-3 font-display text-3xl text-[#F2F2F2]">Where should we ship?</h2>
                <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-px bg-[#1a1a1a]">
                  {COUNTRIES.map((c) => (
                    <button key={c} data-testid={`del-${c}`} onClick={() => set({ delivery_country: c })} className={`p-5 text-left font-body text-[12px] tracking-precision uppercase transition-colors ${data.delivery_country === c ? "bg-[#F2F2F2] text-black" : "bg-black text-[#ddd] hover:bg-[#0a0a0a]"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 7 && (
              <div data-testid="step-timeline">
                <div className="overline">STEP 08 — TIMELINE</div>
                <h2 className="mt-3 font-display text-3xl text-[#F2F2F2]">When do you need delivery?</h2>
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1a1a]">
                  {TIMELINES.map((t) => (
                    <button key={t} data-testid={`time-${t}`} onClick={() => set({ timeline: t })} className={`p-6 text-left transition-colors ${data.timeline === t ? "bg-[#F2F2F2] text-black" : "bg-black text-[#ddd] hover:bg-[#0a0a0a]"}`}>
                      <div className={`font-display text-lg ${data.timeline === t ? "text-black" : "text-[#F2F2F2]"}`}>{t}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 8 && (
              <div data-testid="step-files">
                <div className="overline">STEP 09 — FILES</div>
                <h2 className="mt-3 font-display text-3xl text-[#F2F2F2]">Upload tech pack or references.</h2>
                <p className="mt-4 font-body text-[13px] text-[#999]">PDF, PNG, JPG, AI, PSD, ZIP. Max 10 MB per file. Optional.</p>

                <label className="mt-10 block border border-dashed border-[#333] hover:border-[#666] p-12 text-center cursor-pointer transition-colors">
                  <input data-testid="q-file-input" type="file" multiple onChange={onFile} className="hidden" accept=".pdf,.png,.jpg,.jpeg,.webp,.ai,.psd,.zip,.doc,.docx" />
                  <Upload size={28} className="mx-auto text-[#666]" />
                  <div className="mt-4 font-display text-lg text-[#F2F2F2]">{uploading ? "Uploading…" : "Drop files or click to upload"}</div>
                  <div className="mt-1 overline">UP TO 10MB EACH</div>
                </label>

                {data.files.length > 0 && (
                  <ul data-testid="q-file-list" className="mt-8 border border-[#1a1a1a]">
                    {data.files.map((f) => (
                      <li key={f.id} className="flex items-center justify-between p-4 border-b border-[#1a1a1a] last:border-b-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText size={16} className="text-[#777] shrink-0" />
                          <span className="font-body text-[13px] text-[#ddd] truncate">{f.original_filename}</span>
                          <span className="overline shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                        </div>
                        <button onClick={() => removeFile(f.id)} className="text-[#777] hover:text-white" aria-label="Remove file"><X size={16} /></button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-10"><label className="overline">Additional Notes</label><textarea data-testid="q-notes" value={data.notes} onChange={(e) => set({ notes: e.target.value })} className="gf-input mt-2" rows={4} placeholder="Specifications, references, fit details, deadlines…" /></div>
              </div>
            )}

            {step === 9 && (
              <div data-testid="step-review">
                <div className="overline">STEP 10 — REVIEW &amp; SUBMIT</div>
                <h2 className="mt-3 font-display text-3xl text-[#F2F2F2]">Review your enquiry.</h2>
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 border-t border-[#1a1a1a] pt-8">
                  {[
                    ["Company", data.company_name],
                    ["Contact", data.contact_name],
                    ["Email", data.email],
                    ["Phone", data.phone || "—"],
                    ["Country", data.country || "—"],
                    ["Garment", `${data.garment_type}${data.garment_subcategory ? ' — ' + data.garment_subcategory : ''}`],
                    ["Quantity", data.quantity],
                    ["Fabric", data.fabric_preference],
                    ["Branding", data.branding.join(", ") || "—"],
                    ["Packaging", data.packaging],
                    ["Delivery", data.delivery_country],
                    ["Timeline", data.timeline],
                    ["Files", data.files.length ? `${data.files.length} file(s)` : "None"],
                    ["Notes", data.notes || "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="border-b border-[#161616] pb-3">
                      <div className="overline">{k}</div>
                      <div className="mt-2 font-body text-[13px] text-[#ddd]">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Nav */}
          <div className="flex items-center justify-between p-6 lg:p-8 border-t border-[#1a1a1a] bg-black">
            <button data-testid="q-back" onClick={back} disabled={step === 0} className="gf-btn gf-btn-light disabled:opacity-30 disabled:cursor-not-allowed">
              <ArrowLeft size={14} className="mr-3" /> Back
            </button>
            <div className="overline">STEP {String(step + 1).padStart(2, "0")} / 10</div>
            {step < STEPS.length - 1 ? (
              <button data-testid="q-next" onClick={next} className="gf-btn gf-btn-solid">
                Continue <ArrowRight size={14} className="ml-3" />
              </button>
            ) : (
              <button data-testid="q-submit" onClick={submit} disabled={submitting} className="gf-btn gf-btn-solid disabled:opacity-50">
                {submitting ? "Submitting…" : "Submit Enquiry"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
