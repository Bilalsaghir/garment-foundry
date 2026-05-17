import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { SectionHeading } from "@/components/Section";
import { GFMonogram } from "@/components/GFMonogram";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please complete the required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success("Thank you. We will respond within one business day.");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="page-contact" className="bg-black">
      <section className="pt-40 pb-16 px-6 lg:px-12 border-b border-[#1a1a1a]">
        <div className="max-w-[1440px] mx-auto">
          <span className="overline">CHAPTER · CONTACT</span>
          <h1 className="mt-6 font-display text-5xl lg:text-7xl text-[#F2F2F2] leading-[1.05] max-w-4xl">
            Speak with our production team.
          </h1>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 lg:gap-16">
          <div className="col-span-12 lg:col-span-5">
            <GFMonogram size={64} color="#F2F2F2" />
            <SectionHeading eyebrow="ENQUIRY" number="— 001" title="A direct line to the studio." subtitle="For new project enquiries, partnerships and supplier relations. We aim to respond within one business day." />
            <div className="mt-12 space-y-6">
              <div>
                <div className="overline">EMAIL</div>
                <a data-testid="contact-email" href="mailto:garmentfoundry.uk@gmail.com" className="block mt-2 font-display text-lg text-[#F2F2F2] hover:underline">garmentfoundry.uk@gmail.com</a>
              </div>
              <div>
                <div className="overline">TELEPHONE</div>
                <a data-testid="contact-phone" href="tel:+447575657531" className="block mt-2 font-display text-lg text-[#F2F2F2] hover:underline">+44 7575 657 531</a>
              </div>
              <div>
                <div className="overline">STUDIO</div>
                <p className="mt-2 font-display text-lg text-[#F2F2F2]">Manchester<br />United Kingdom</p>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="col-span-12 lg:col-span-7 border border-[#1a1a1a] p-8 lg:p-12 bg-[#050505]">
            <div className="overline mb-8">NEW ENQUIRY · NO. 0001</div>
            <div className="space-y-8">
              <div>
                <label className="overline">Name *</label>
                <input data-testid="contact-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="gf-input mt-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="overline">Email *</label>
                  <input data-testid="contact-email-input" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="gf-input mt-2" />
                </div>
                <div>
                  <label className="overline">Company</label>
                  <input data-testid="contact-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="gf-input mt-2" />
                </div>
              </div>
              <div>
                <label className="overline">Message *</label>
                <textarea data-testid="contact-message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="gf-input mt-2" rows={5} />
              </div>
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
