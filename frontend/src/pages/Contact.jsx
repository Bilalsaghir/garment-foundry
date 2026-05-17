import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { SectionHeading } from "@/components/Section";
import { GFMonogram } from "@/components/GFMonogram";
import { Field, TextInput, TextArea } from "@/components/Field";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (name, value) => {
    if (name === "name" && !value?.trim()) return "Name is required";
    if (name === "email") {
      if (!value?.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
    }
    if (name === "message" && !value?.trim()) return "Message is required";
    return "";
  };

  const onBlur = (name) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((e) => ({ ...e, [name]: validate(name, form[name]) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: validate("name", form.name),
      email: validate("email", form.email),
      message: validate("message", form.message),
    };
    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true });
    if (Object.values(newErrors).some(Boolean)) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success("Thank you. We will respond within one business day.");
      setForm({ name: "", email: "", company: "", message: "" });
      setTouched({});
      setErrors({});
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally { setSubmitting(false); }
  };

  return (
    <div data-testid="page-contact" className="bg-black">
      <section className="pt-40 pb-16 px-6 lg:px-12 border-b border-[#1a1a1a]">
        <div className="max-w-[1440px] mx-auto">
          <span className="overline">CHAPTER · CONTACT</span>
          <h1 className="mt-6 font-display text-5xl lg:text-7xl text-[#F5F4F0] leading-[1.05] max-w-4xl">
            Speak with our production team.
          </h1>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 lg:gap-16">
          <div className="col-span-12 lg:col-span-5">
            <GFMonogram size={56} color="#F2F2F2" />
            <SectionHeading eyebrow="ENQUIRY" number="— 001" title="A direct line to the studio." subtitle="For new project enquiries, partnerships and supplier relations. We aim to respond within one business day." />
            <div className="mt-12 space-y-6">
              <div>
                <div className="font-body text-[10px] tracking-[0.15em] uppercase text-[#888]">EMAIL</div>
                <a data-testid="contact-email" href="mailto:garmentfoundry.uk@gmail.com" className="block mt-2 font-display text-lg text-[#F5F4F0] hover:underline">garmentfoundry.uk@gmail.com</a>
              </div>
              <div>
                <div className="font-body text-[10px] tracking-[0.15em] uppercase text-[#888]">TELEPHONE</div>
                <a data-testid="contact-phone" href="tel:+447575657531" className="block mt-2 font-display text-lg text-[#F5F4F0] hover:underline">+44 7575 657 531</a>
              </div>
              <div>
                <div className="font-body text-[10px] tracking-[0.15em] uppercase text-[#888]">STUDIO</div>
                <p className="mt-2 font-display text-lg text-[#F5F4F0]">Manchester<br />United Kingdom</p>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="col-span-12 lg:col-span-7 border border-[#1a1a1a] p-8 lg:p-12 bg-[#050505]">
            <div className="font-body text-[10px] tracking-[0.15em] uppercase text-[#888] mb-8">NEW ENQUIRY · NO. 0001</div>
            <div className="space-y-7">
              <Field label="Name" required error={touched.name && errors.name} testId="contact-name-field">
                <TextInput data-testid="contact-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} onBlur={() => onBlur("name")} error={touched.name && !!errors.name} />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <Field label="Email" required error={touched.email && errors.email} testId="contact-email-field">
                  <TextInput data-testid="contact-email-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onBlur={() => onBlur("email")} error={touched.email && !!errors.email} />
                </Field>
                <Field label="Company" testId="contact-company-field">
                  <TextInput data-testid="contact-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </Field>
              </div>
              <Field label="Message" required error={touched.message && errors.message} testId="contact-message-field">
                <TextArea data-testid="contact-message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} onBlur={() => onBlur("message")} error={touched.message && !!errors.message} rows={5} />
              </Field>
              <button data-testid="contact-submit" type="submit" disabled={submitting} className="gf-btn gf-btn-solid disabled:opacity-50">
                {submitting ? "Sending…" : "Send Enquiry"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
