import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { GFMonogram } from "@/components/GFMonogram";
import PageMeta from "@/components/PageMeta";
import { Field, TextInput, TextArea } from "@/components/Field";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const GARMENT_CATEGORIES = [
  "T-shirts & Tops",
  "Hoodies & Sweats",
  "Trousers & Bottoms",
  "Outerwear",
  "Activewear",
  "Streetwear",
  "Uniforms / Workwear",
  "Childrenswear",
  "Knitwear",
  "Accessories",
];

const QUANTITY_BANDS = ["100–500", "500–2,000", "2,000–10,000", "10,000+"];

const selectClass = (hasError) =>
  `w-full bg-[#111111] border-b text-[#F5F4F0] font-body text-[14px] font-light py-3 px-3 outline-none transition-colors ${
    hasError ? "border-b-2 border-[#8B1A1A]" : "border-[#333333] focus:border-[#FFFFFF]"
  }`;

export default function Quote() {
  const [form, setForm] = useState({
    business_name: "",
    contact_name_role: "",
    email: "",
    garment_category: "",
    quantity: "",
    additional_notes: "",
    website_url: "", // honeypot — must stay empty
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");

  const validate = (name, value) => {
    if (name === "business_name" && !value?.trim()) return "Company / brand name is required";
    if (name === "contact_name_role" && !value?.trim()) return "Your name is required (role optional)";
    if (name === "email") {
      if (!value?.trim()) return "Work email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid work email address";
    }
    if (name === "garment_category" && !value) return "Pick a garment category";
    if (name === "quantity" && !value) return "Choose an approximate quantity";
    return "";
  };

  const onBlur = (name) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((e) => ({ ...e, [name]: validate(name, form[name]) }));
  };
  const onChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    const required = ["business_name", "contact_name_role", "email", "garment_category", "quantity"];
    const newErrors = Object.fromEntries(required.map((k) => [k, validate(k, form[k])]));
    setErrors(newErrors);
    setTouched(Object.fromEntries(required.map((k) => [k, true])));
    if (Object.values(newErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      let uploadedFile = null;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const r = await axios.post(`${API}/upload`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        uploadedFile = r.data;
      }
      const payload = {
        business_name: form.business_name,
        contact_name: form.contact_name_role,
        email: form.email,
        garment_types: [form.garment_category],
        quantity: form.quantity,
        additional_notes: form.additional_notes,
        uploaded_files: uploadedFile ? [uploadedFile] : [],
        website_url: form.website_url, // backend verifies honeypot too
      };
      const r = await axios.post(`${API}/quote`, payload);
      setReference(r.data.reference);
      setSubmitted(true);
    } catch (err) {
      const msg = err?.response?.status === 429
        ? "Too many submissions. Please wait a minute and try again."
        : "Submission failed. Please try again or email hello@garmentfoundry.com.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div data-testid="quote-success" className="bg-black min-h-screen pt-40 pb-32 px-6 lg:px-12">
        <PageMeta path="/quote" title="Quote received | Garment Foundry" description="Thank you. Your enquiry is received. We reply within one business day." noindex />
        <div className="max-w-2xl mx-auto text-center">
          <GFMonogram size={56} className="mx-auto" color="#F2F2F2" />
          <h1 className="mt-10 font-display text-4xl lg:text-5xl text-[#F5F4F0] leading-tight">Thank you. Your enquiry is received.</h1>
          <p className="mt-6 font-body text-[14px] leading-[1.9] text-[#bbb]">
            A member of our production team will respond with an indicative quote within <strong className="text-white">one business day</strong>.
          </p>
          <div className="mt-10 border border-[#1a1a1a] p-6 inline-block bg-[#0a0a0a]">
            <div className="font-body text-[10px] tracking-[0.15em] uppercase text-[#888]">REFERENCE</div>
            <div className="font-display text-2xl text-[#F5F4F0] mt-2">{reference}</div>
          </div>
          <div className="mt-12 border-t border-[#1a1a1a] pt-8 max-w-md mx-auto">
            <p className="font-body text-[13px] leading-[1.9] text-[#888]">
              If you already have a tech pack and want to share full specifications, give us the full brief now.
            </p>
            <Link to="/quote/full-brief" data-testid="quote-success-full-brief" className="gf-btn gf-btn-light mt-5 inline-flex">
              Complete the full brief <ArrowRight size={14} className="ml-3" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="page-quote" className="bg-black min-h-screen pt-28 pb-24">
      <PageMeta path="/quote" title="Request a Manufacturing Quote | Garment Foundry" description="Request a manufacturing quote from Garment Foundry. UK-based, working with fashion, uniform and private-label brands. We reply in one business day." />
      <div className="max-w-[920px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="font-body text-[10px] tracking-[0.2em] uppercase text-[#888]">QUICK ENQUIRY</div>
            <h1 className="mt-3 font-display text-3xl lg:text-4xl text-[#F5F4F0] leading-tight">Request a Manufacturing Quote</h1>
          </div>
          <GFMonogram size={48} color="#F2F2F2" className="hidden md:block" />
        </div>

        <p className="font-body text-[14px] leading-[1.9] text-[#bbb] max-w-2xl">
          Five fields. We reply within one business day. If you already have a tech pack and want to share full specifications,{" "}
          <Link to="/quote/full-brief" className="underline hover:text-white">give us the full brief</Link> instead.
        </p>

        <form onSubmit={submit} noValidate className="mt-12 border border-[#1a1a1a] p-8 lg:p-12 bg-[#050505] space-y-7" data-testid="quote-short-form">
          {/* CR-B honeypot — visually hidden, off the tab order, autocomplete off.
              Real users never see it; bots will fill any plausibly named field. */}
          <div style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
            <label htmlFor="q-website-url-hp">Your website (leave this blank)</label>
            <input
              id="q-website-url-hp"
              name="website_url"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website_url}
              onChange={(e) => onChange("website_url", e.target.value)}
            />
          </div>

          <Field id="q-business-name" label="Company / Brand Name" required error={touched.business_name && errors.business_name} testId="q-company-field">
            <TextInput data-testid="q-company" name="business_name" autoComplete="organization"
              value={form.business_name} onChange={(e) => onChange("business_name", e.target.value)}
              onBlur={() => onBlur("business_name")}
              error={touched.business_name && !!errors.business_name} />
          </Field>

          <Field id="q-contact-name-role" label="Your Name + Role" required hint="e.g. Sara Patel, Founder" error={touched.contact_name_role && errors.contact_name_role} testId="q-contact-field">
            <TextInput data-testid="q-contact" name="contact_name_role" autoComplete="name"
              value={form.contact_name_role} onChange={(e) => onChange("contact_name_role", e.target.value)}
              onBlur={() => onBlur("contact_name_role")}
              error={touched.contact_name_role && !!errors.contact_name_role} />
          </Field>

          <Field id="q-email" label="Work Email" required error={touched.email && errors.email} testId="q-email-field">
            <TextInput data-testid="q-email" name="email" type="email" inputMode="email" autoComplete="email"
              value={form.email} onChange={(e) => onChange("email", e.target.value)}
              onBlur={() => onBlur("email")}
              error={touched.email && !!errors.email} />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <Field id="q-category" label="Garment Category" required error={touched.garment_category && errors.garment_category} testId="q-category-field">
              <select
                name="garment_category"
                data-testid="q-category"
                value={form.garment_category}
                onChange={(e) => onChange("garment_category", e.target.value)}
                onBlur={() => onBlur("garment_category")}
                className={selectClass(touched.garment_category && !!errors.garment_category)}
              >
                <option value="" disabled>Select a category…</option>
                {GARMENT_CATEGORIES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
            <Field id="q-quantity" label="Approximate Quantity" required hint="Total units across the order" error={touched.quantity && errors.quantity} testId="q-quantity-field">
              <select
                name="quantity"
                data-testid="q-quantity"
                value={form.quantity}
                onChange={(e) => onChange("quantity", e.target.value)}
                onBlur={() => onBlur("quantity")}
                className={selectClass(touched.quantity && !!errors.quantity)}
              >
                <option value="" disabled>Select a range…</option>
                {QUANTITY_BANDS.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </Field>
          </div>

          <Field id="q-notes" label="Anything else we should know? (optional)" testId="q-notes-field">
            <TextArea data-testid="q-notes" name="additional_notes" rows={4}
              value={form.additional_notes} onChange={(e) => onChange("additional_notes", e.target.value)} />
          </Field>

          <div className="space-y-2">
            <label htmlFor="q-file" className="block font-body text-[10px] tracking-[0.12em] uppercase text-[#888]">Tech pack (optional)</label>
            <input
              id="q-file"
              name="tech_pack"
              type="file"
              data-testid="q-file"
              accept=".pdf,.zip,.ai,.psd,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-[#bbb] font-body text-[13px] file:mr-4 file:py-2 file:px-4 file:rounded-none file:border file:border-[#333] file:bg-transparent file:text-[#bbb] file:font-body file:text-[11px] file:tracking-[0.15em] file:uppercase hover:file:bg-[#111]"
            />
            <p className="font-body text-[11px] text-[#666]">PDF, ZIP, AI, PSD, PNG or JPG. Max 10MB.</p>
          </div>

          <div className="pt-6 border-t border-[#1a1a1a] flex flex-wrap items-center justify-between gap-4">
            <p className="font-body text-[11px] text-[#666] max-w-sm">We reply within one business day. Your details are not shared.</p>
            <button type="submit" data-testid="q-submit" disabled={submitting} className="gf-btn gf-btn-solid disabled:opacity-50">
              {submitting ? "Sending…" : "Request a Quote"}
              {!submitting && <ArrowRight size={14} className="ml-3" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
