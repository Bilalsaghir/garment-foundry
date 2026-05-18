import React, { useState } from "react";
import PageMeta from "@/components/PageMeta";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Upload, X, FileText } from "lucide-react";
import { GFMonogram } from "@/components/GFMonogram";
import { Field, TextInput, TextArea } from "@/components/Field";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const GARMENT_TYPES = ["T-Shirts & Tops", "Hoodies & Sweats", "Trousers & Bottoms", "Outerwear", "Activewear", "Streetwear", "Uniforms / Workwear", "Childrenswear", "Knitwear", "Accessories"];
const QUANTITIES = ["50–100", "100–300", "300–500", "500+"];
const FABRICS = ["Cotton", "Polyester", "Blend", "Organic", "Bamboo", "Unsure"];
const BRANDING_OPTIONS = ["Screen Print", "Embroidery", "Woven Label", "Hang Tag", "DTG", "None"];
const PACKAGING = ["Polybag", "Branded Box", "Custom", "None"];
const COUNTRIES = ["UK", "US", "EU", "Other"];
const TIMELINES = ["ASAP", "4–6 weeks", "6–12 weeks", "3–6 months", "Flexible"];

const STEPS = [
  "Business details", "Garment type", "Quantity", "Fabric",
  "Branding", "Packaging", "Delivery", "Timeline", "Tech pack", "Review",
];

export default function Quote() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [data, setData] = useState({
    business_name: "", contact_name: "", email: "", phone: "", website_instagram: "", country: "",
    garment_types: [],
    quantity: "",
    fabric_preference: "", fabric_text: "",
    branding: [],
    packaging: "",
    delivery_country: "",
    timeline: "",
    uploaded_files: [],
    additional_notes: "",
  });

  const set = (patch) => setData((d) => ({ ...d, ...patch }));
  const toggleArr = (k, v) => set({ [k]: data[k].includes(v) ? data[k].filter((x) => x !== v) : [...data[k], v] });

  const validateField = (name, value) => {
    if (name === "business_name" && !value?.trim()) return "Company name is required";
    if (name === "contact_name" && !value?.trim()) return "Contact name is required";
    if (name === "email") {
      if (!value?.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
    }
    return "";
  };

  const onBlur = (name) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((e) => ({ ...e, [name]: validateField(name, data[name]) }));
  };

  const stepHasError = () => {
    if (step === 0) {
      const e = {
        business_name: validateField("business_name", data.business_name),
        contact_name: validateField("contact_name", data.contact_name),
        email: validateField("email", data.email),
      };
      setErrors((prev) => ({ ...prev, ...e }));
      setTouched((t) => ({ ...t, business_name: true, contact_name: true, email: true }));
      return Object.values(e).some(Boolean);
    }
    if (step === 1) return !data.garment_types.length && setErrors((e) => ({ ...e, garment_types: "Select at least one garment type" })) === undefined && !data.garment_types.length;
    if (step === 2) return !data.quantity && setErrors((e) => ({ ...e, quantity: "Select a quantity range" })) === undefined && !data.quantity;
    if (step === 3) return !data.fabric_preference && setErrors((e) => ({ ...e, fabric_preference: "Select a fabric preference" })) === undefined && !data.fabric_preference;
    if (step === 5) return !data.packaging && setErrors((e) => ({ ...e, packaging: "Select a packaging option" })) === undefined && !data.packaging;
    if (step === 6) return !data.delivery_country && setErrors((e) => ({ ...e, delivery_country: "Select a delivery country" })) === undefined && !data.delivery_country;
    if (step === 7) return !data.timeline && setErrors((e) => ({ ...e, timeline: "Select a timeline" })) === undefined && !data.timeline;
    return false;
  };

  const next = () => {
    if (stepHasError()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onFile = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (data.uploaded_files.length + files.length > 5) {
      toast.error("Maximum 5 files");
      return;
    }
    setUploading(true);
    try {
      for (const f of files) {
        if (f.size > 10 * 1024 * 1024) { toast.error(`${f.name} exceeds 10MB`); continue; }
        const fd = new FormData(); fd.append("file", f);
        const r = await axios.post(`${API}/upload`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        set({ uploaded_files: [...data.uploaded_files, r.data] });
      }
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    } finally { setUploading(false); }
  };

  const removeFile = (id) => set({ uploaded_files: data.uploaded_files.filter((f) => f.id !== id) });

  const submit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        fabric_preference: data.fabric_preference + (data.fabric_text ? ` — ${data.fabric_text}` : ""),
      };
      delete payload.fabric_text;
      const r = await axios.post(`${API}/quote`, payload);
      setReference(r.data.reference);
      setSubmitted(true);
    } catch (err) {
      toast.error("Submission failed. Please try again.");
    } finally { setSubmitting(false); }
  };

  const progressPct = Math.round(((step + 1) / STEPS.length) * 100);

  if (submitted) {
    return (
      <div data-testid="quote-success" className="bg-black min-h-screen pt-40 pb-32 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <GFMonogram size={56} className="mx-auto" color="#F2F2F2" />
          <h1 className="mt-10 font-display text-4xl lg:text-5xl text-[#F5F4F0] leading-tight">Thank you. Your enquiry is received.</h1>
          <p className="mt-6 font-body text-[14px] leading-[1.9] text-[#bbb]">A member of our production team will respond with an indicative proposal within <strong className="text-white">one business day</strong>.</p>
          <div className="mt-10 border border-[#1a1a1a] p-6 inline-block bg-[#0a0a0a]">
            <div className="font-body text-[10px] tracking-[0.15em] uppercase text-[#888]">REFERENCE</div>
            <div className="font-display text-2xl text-[#F5F4F0] mt-2">{reference}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="page-quote" className="bg-black min-h-screen pt-28 pb-24">
      <PageMeta path="/quote" title="Request a Manufacturing Quote | Garment Foundry" description="Request a manufacturing quote from Garment Foundry. UK-based, working with fashion, uniform and private-label brands. We reply in one business day." />
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="font-body text-[10px] tracking-[0.2em] uppercase text-[#888]">QUOTE CALCULATOR</div>
            <h1 className="mt-3 font-display text-3xl lg:text-4xl text-[#F5F4F0] leading-tight">Request a Manufacturing Quote</h1>
          </div>
          <GFMonogram size={48} color="#F2F2F2" className="hidden md:block" />
        </div>

        {/* Step indicator: single line + progress bar */}
        <div data-testid="quote-progress" className="mb-8">
          <div className="font-body text-[11px] tracking-[0.15em] uppercase text-[#888] mb-3">
            <span className="text-[#F5F4F0]">STEP {String(step + 1).padStart(2, "0")} / {STEPS.length}</span>
            <span className="mx-3 text-[#444]">—</span>
            {STEPS[step]}
          </div>
          <div className="h-[2px] w-full bg-[#1a1a1a]">
            <div className="h-full bg-[#F5F4F0] transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Desktop vertical sidebar stepper */}
          <aside className="hidden lg:block col-span-3">
            <ol className="space-y-1 sticky top-28">
              {STEPS.map((s, i) => (
                <li key={s}>
                  <button
                    onClick={() => i <= step && setStep(i)}
                    disabled={i > step}
                    data-testid={`stepper-${i}`}
                    className={`w-full flex items-baseline gap-4 py-3 px-4 text-left transition-colors border-l-2 ${
                      i === step ? "border-[#F5F4F0] bg-[#0a0a0a]" : i < step ? "border-[#444] hover:bg-[#0a0a0a]" : "border-[#1a1a1a]"
                    }`}
                  >
                    <span className={`font-body text-[10px] tracking-[0.15em] ${i <= step ? "text-[#F5F4F0]" : "text-[#555]"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={`font-body text-[12px] ${i === step ? "text-[#F5F4F0]" : i < step ? "text-[#bbb]" : "text-[#555]"}`}>{s}</span>
                  </button>
                </li>
              ))}
            </ol>
          </aside>

          <section className="col-span-12 lg:col-span-9 border border-[#1a1a1a] bg-[#050505]">
            <div className="p-8 lg:p-12 min-h-[480px]">
              {step === 0 && (
                <div data-testid="step-business">
                  <h2 className="font-display text-3xl text-[#F5F4F0]">Tell us about your brand.</h2>
                  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <Field id="q-business-name" label="Company / Brand Name" required error={touched.business_name && errors.business_name} testId="q-company-field">
                      <TextInput data-testid="q-company" name="business_name" autoComplete="organization" value={data.business_name} onChange={(e) => set({ business_name: e.target.value })} onBlur={() => onBlur("business_name")} error={touched.business_name && !!errors.business_name} />
                    </Field>
                    <Field id="q-contact-name" label="Contact Name" required error={touched.contact_name && errors.contact_name} testId="q-contact-field">
                      <TextInput data-testid="q-contact" name="contact_name" autoComplete="name" value={data.contact_name} onChange={(e) => set({ contact_name: e.target.value })} onBlur={() => onBlur("contact_name")} error={touched.contact_name && !!errors.contact_name} />
                    </Field>
                    <Field id="q-email" label="Email" required error={touched.email && errors.email} testId="q-email-field">
                      <TextInput data-testid="q-email" name="email" type="email" inputMode="email" autoComplete="email" value={data.email} onChange={(e) => set({ email: e.target.value })} onBlur={() => onBlur("email")} error={touched.email && !!errors.email} />
                    </Field>
                    <Field id="q-phone" label="Phone" testId="q-phone-field">
                      <TextInput data-testid="q-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={data.phone} onChange={(e) => set({ phone: e.target.value })} />
                    </Field>
                    <Field id="q-website" label="Website / Instagram" testId="q-website-field">
                      <TextInput data-testid="q-website" name="website_instagram" type="url" inputMode="url" autoComplete="url" value={data.website_instagram} onChange={(e) => set({ website_instagram: e.target.value })} />
                    </Field>
                    <Field id="q-country" label="Country" testId="q-country-field">
                      <TextInput data-testid="q-country" name="country" autoComplete="country-name" value={data.country} onChange={(e) => set({ country: e.target.value })} />
                    </Field>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div data-testid="step-garment">
                  <h2 className="font-display text-3xl text-[#F5F4F0]">What are we making?</h2>
                  <p className="mt-3 font-body text-[13px] text-[#888]">Select all that apply.</p>
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-px bg-[#1a1a1a]">
                    {GARMENT_TYPES.map((g) => {
                      const on = data.garment_types.includes(g);
                      return (
                        <button key={g} data-testid={`g-${g}`} type="button" onClick={() => toggleArr("garment_types", g)} className={`p-5 text-left font-body text-[12px] tracking-[0.06em] uppercase transition-colors flex items-center justify-between ${on ? "bg-[#F5F4F0] text-black" : "bg-black text-[#ddd] hover:bg-[#0a0a0a]"}`}>
                          <span>{g}</span>
                          {on && <Check size={14} />}
                        </button>
                      );
                    })}
                  </div>
                  {errors.garment_types && !data.garment_types.length && <p className="mt-3 italic text-[11px] text-[#8B1A1A]">{errors.garment_types}</p>}
                </div>
              )}

              {step === 2 && (
                <div data-testid="step-quantity">
                  <h2 className="font-display text-3xl text-[#F5F4F0]">Total units across the order?</h2>
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1a1a1a]">
                    {QUANTITIES.map((q) => (
                      <button key={q} data-testid={`qty-${q}`} type="button" onClick={() => set({ quantity: q })} className={`p-6 text-left transition-colors ${data.quantity === q ? "bg-[#F5F4F0] text-black" : "bg-black text-[#ddd] hover:bg-[#0a0a0a]"}`}>
                        <div className={`font-display text-xl ${data.quantity === q ? "text-black" : "text-[#F5F4F0]"}`}>{q}</div>
                        <div className={`mt-1 font-body text-[10px] tracking-[0.2em] uppercase ${data.quantity === q ? "text-black/60" : "text-[#888]"}`}>UNITS</div>
                      </button>
                    ))}
                  </div>
                  {errors.quantity && !data.quantity && <p className="mt-3 italic text-[11px] text-[#8B1A1A]">{errors.quantity}</p>}
                </div>
              )}

              {step === 3 && (
                <div data-testid="step-fabric">
                  <h2 className="font-display text-3xl text-[#F5F4F0]">Fabric preference?</h2>
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-px bg-[#1a1a1a]">
                    {FABRICS.map((f) => (
                      <button key={f} data-testid={`fab-${f}`} type="button" onClick={() => set({ fabric_preference: f })} className={`p-5 text-left font-body text-[12px] tracking-[0.06em] uppercase transition-colors ${data.fabric_preference === f ? "bg-[#F5F4F0] text-black" : "bg-black text-[#ddd] hover:bg-[#0a0a0a]"}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                  {errors.fabric_preference && !data.fabric_preference && <p className="mt-3 italic text-[11px] text-[#8B1A1A]">{errors.fabric_preference}</p>}
                  <div className="mt-8">
                    <Field id="q-fabric-text" label="Additional fabric details (optional)" testId="q-fabric-text-field">
                      <TextInput data-testid="q-fabric-text" name="fabric_text" value={data.fabric_text} onChange={(e) => set({ fabric_text: e.target.value })} placeholder="e.g. Heavyweight 400gsm brushed back cotton" />
                    </Field>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div data-testid="step-branding">
                  <h2 className="font-display text-3xl text-[#F5F4F0]">Branding &amp; finishing.</h2>
                  <p className="mt-3 font-body text-[13px] text-[#888]">Select all that apply.</p>
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-px bg-[#1a1a1a]">
                    {BRANDING_OPTIONS.map((b) => {
                      const on = data.branding.includes(b);
                      return (
                        <button key={b} data-testid={`brand-${b}`} type="button" onClick={() => toggleArr("branding", b)} className={`p-5 text-left font-body text-[12px] tracking-[0.06em] uppercase transition-colors flex items-center justify-between ${on ? "bg-[#F5F4F0] text-black" : "bg-black text-[#ddd] hover:bg-[#0a0a0a]"}`}>
                          <span>{b}</span>
                          {on && <Check size={14} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div data-testid="step-packaging">
                  <h2 className="font-display text-3xl text-[#F5F4F0]">How should each unit be packed?</h2>
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1a1a1a]">
                    {PACKAGING.map((p) => (
                      <button key={p} data-testid={`pack-${p}`} type="button" onClick={() => set({ packaging: p })} className={`p-5 text-left font-body text-[12px] tracking-[0.06em] uppercase transition-colors ${data.packaging === p ? "bg-[#F5F4F0] text-black" : "bg-black text-[#ddd] hover:bg-[#0a0a0a]"}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                  {errors.packaging && !data.packaging && <p className="mt-3 italic text-[11px] text-[#8B1A1A]">{errors.packaging}</p>}
                </div>
              )}

              {step === 6 && (
                <div data-testid="step-delivery">
                  <h2 className="font-display text-3xl text-[#F5F4F0]">Where should we ship?</h2>
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1a1a1a]">
                    {COUNTRIES.map((c) => (
                      <button key={c} data-testid={`del-${c}`} type="button" onClick={() => set({ delivery_country: c })} className={`p-5 text-left font-body text-[12px] tracking-[0.06em] uppercase transition-colors ${data.delivery_country === c ? "bg-[#F5F4F0] text-black" : "bg-black text-[#ddd] hover:bg-[#0a0a0a]"}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                  {errors.delivery_country && !data.delivery_country && <p className="mt-3 italic text-[11px] text-[#8B1A1A]">{errors.delivery_country}</p>}
                </div>
              )}

              {step === 7 && (
                <div data-testid="step-timeline">
                  <h2 className="font-display text-3xl text-[#F5F4F0]">When do you need delivery?</h2>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1a1a]">
                    {TIMELINES.map((t) => (
                      <button key={t} data-testid={`time-${t}`} type="button" onClick={() => set({ timeline: t })} className={`p-5 text-left transition-colors ${data.timeline === t ? "bg-[#F5F4F0] text-black" : "bg-black text-[#ddd] hover:bg-[#0a0a0a]"}`}>
                        <div className={`font-display text-lg ${data.timeline === t ? "text-black" : "text-[#F5F4F0]"}`}>{t}</div>
                      </button>
                    ))}
                  </div>
                  {errors.timeline && !data.timeline && <p className="mt-3 italic text-[11px] text-[#8B1A1A]">{errors.timeline}</p>}
                </div>
              )}

              {step === 8 && (
                <div data-testid="step-files">
                  <h2 className="font-display text-3xl text-[#F5F4F0]">Upload tech pack or references.</h2>
                  <p className="mt-3 font-body text-[13px] text-[#888]">PDF, AI, PNG, JPG. Max 10MB each. Up to 5 files. Optional.</p>
                  <label className="mt-8 block border border-dashed border-[#333] hover:border-[#666] p-12 text-center cursor-pointer transition-colors bg-[#0a0a0a]">
                    <input data-testid="q-file-input" type="file" multiple onChange={onFile} className="hidden" accept=".pdf,.ai,.psd,.png,.jpg,.jpeg" />
                    <Upload size={28} className="mx-auto text-[#888]" />
                    <div className="mt-4 font-display text-lg text-[#F5F4F0]">{uploading ? "Uploading…" : "Drop files or click to upload"}</div>
                    <div className="mt-1 font-body text-[10px] tracking-[0.15em] uppercase text-[#666]">UP TO 10MB EACH · MAX 5 FILES</div>
                  </label>

                  {data.uploaded_files.length > 0 && (
                    <ul data-testid="q-file-list" className="mt-6 border border-[#1a1a1a]">
                      {data.uploaded_files.map((f) => (
                        <li key={f.id} className="flex items-center justify-between p-4 border-b border-[#1a1a1a] last:border-b-0">
                          <div className="flex items-center gap-3 min-w-0">
                            <FileText size={16} className="text-[#777] shrink-0" />
                            <span className="font-body text-[13px] text-[#ddd] truncate">{f.original_filename}</span>
                            <span className="font-body text-[10px] tracking-[0.15em] text-[#666] shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                          </div>
                          <button onClick={() => removeFile(f.id)} className="text-[#777] hover:text-white" aria-label="Remove file"><X size={16} /></button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-8">
                    <Field id="q-notes" label="Additional Notes" testId="q-notes-field">
                      <TextArea data-testid="q-notes" name="additional_notes" value={data.additional_notes} onChange={(e) => set({ additional_notes: e.target.value })} rows={4} placeholder="Specifications, references, fit details, deadlines…" />
                    </Field>
                  </div>
                </div>
              )}

              {step === 9 && (
                <div data-testid="step-review">
                  <h2 className="font-display text-3xl text-[#F5F4F0]">Review your enquiry.</h2>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 border-t border-[#1a1a1a] pt-6">
                    {[
                      ["Company", data.business_name],
                      ["Contact", data.contact_name],
                      ["Email", data.email],
                      ["Phone", data.phone || "—"],
                      ["Country", data.country || "—"],
                      ["Garments", data.garment_types.join(", ") || "—"],
                      ["Quantity", data.quantity],
                      ["Fabric", data.fabric_preference + (data.fabric_text ? ` — ${data.fabric_text}` : "")],
                      ["Branding", data.branding.join(", ") || "—"],
                      ["Packaging", data.packaging],
                      ["Delivery", data.delivery_country],
                      ["Timeline", data.timeline],
                      ["Files", data.uploaded_files.length ? `${data.uploaded_files.length} file(s)` : "None"],
                      ["Notes", data.additional_notes || "—"],
                    ].map(([k, v]) => (
                      <div key={k} className="border-b border-[#161616] pb-3">
                        <div className="font-body text-[10px] tracking-[0.15em] uppercase text-[#888]">{k}</div>
                        <div className="mt-2 font-body text-[13px] text-[#F5F4F0]">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-6 lg:p-8 border-t border-[#1a1a1a] bg-black">
              <button data-testid="q-back" onClick={back} disabled={step === 0} className="gf-btn gf-btn-light disabled:opacity-30 disabled:cursor-not-allowed">
                <ArrowLeft size={14} className="mr-3" /> Back
              </button>
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
          </section>
        </div>
      </div>
    </div>
  );
}
