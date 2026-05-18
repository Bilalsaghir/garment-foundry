import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { BrandLogo } from "./BrandLogo";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Footer() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email address.");
      return;
    }
    setBusy(true);
    try {
      await axios.post(`${API}/subscribe`, { email, name });
      toast.success("Subscribed — thank you.");
      setEmail(""); setName("");
    } catch {
      toast.error("Something went wrong.");
    } finally { setBusy(false); }
  };

  return (
    <footer data-testid="site-footer" className="bg-black border-t border-[#1f1f1f]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">

        {/* Newsletter band */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 border-b border-[#1a1a1a]">
          <div className="lg:col-span-5">
            <div className="font-body text-[10px] tracking-[0.2em] uppercase text-[#888]">NEWSLETTER</div>
            <h3 className="mt-3 font-display text-2xl lg:text-3xl text-[#F5F4F0] leading-tight">Quiet quarterly updates from the studio.</h3>
            <p className="mt-3 font-body text-[13px] text-[#999] max-w-md">Fabric trends, capability launches and selected case studies. No noise.</p>
          </div>
          <form onSubmit={subscribe} className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-3 self-end" data-testid="footer-subscribe-form">
            <input
              type="text"
              placeholder="First name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="md:col-span-4 bg-[#111] border-b border-[#333] focus:border-white text-[#F5F4F0] py-3 px-3 font-body text-[13px] outline-none"
              data-testid="footer-subscribe-name"
            />
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="md:col-span-5 bg-[#111] border-b border-[#333] focus:border-white text-[#F5F4F0] py-3 px-3 font-body text-[13px] outline-none"
              data-testid="footer-subscribe-email"
            />
            <button type="submit" disabled={busy} className="md:col-span-3 h-12 bg-[#F5F4F0] hover:bg-white text-black font-body text-[11px] tracking-[0.2em] uppercase disabled:opacity-50" data-testid="footer-subscribe-submit">
              {busy ? "…" : "Subscribe"}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-16">
          <div className="md:col-span-5">
            <BrandLogo height={88} />
            <p className="mt-8 max-w-md font-body text-[13px] leading-[1.9] text-[#999]">
              A United Kingdom based apparel manufacturing and sourcing partner. We help fashion labels, uniform programmes and private-label brands move from brief to bulk with precision and quiet confidence.
            </p>
            <div className="mt-8 dashed-rule text-[#333] w-32" />
            <p className="mt-6 font-display text-[11px] tracking-luxe text-[#666]">
              CRAFTED WITH PURPOSE. DELIVERED WITH PRECISION.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="overline mb-6">Studio</div>
            <ul className="space-y-3 font-body text-[12px]">
              <li><Link data-testid="footer-link-about" to="/about" className="text-[#bbb] hover:text-white">About</Link></li>
              <li><Link data-testid="footer-link-capabilities" to="/capabilities" className="text-[#bbb] hover:text-white">Capabilities</Link></li>
              <li><Link data-testid="footer-link-categories" to="/categories" className="text-[#bbb] hover:text-white">Categories</Link></li>
              <li><Link data-testid="footer-link-process" to="/process" className="text-[#bbb] hover:text-white">Process</Link></li>
              <li><Link data-testid="footer-link-sourcing" to="/sourcing" className="text-[#bbb] hover:text-white">Sourcing</Link></li>
              <li><Link data-testid="footer-link-quality" to="/quality" className="text-[#bbb] hover:text-white">Quality Control</Link></li>
              <li><Link data-testid="footer-link-blog" to="/blog" className="text-[#bbb] hover:text-white">Journal</Link></li>
              <li><Link data-testid="footer-link-case-studies" to="/case-studies" className="text-[#bbb] hover:text-white">Case Studies</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="overline mb-6">Contact</div>
            <ul className="space-y-4 font-body text-[12px] text-[#bbb]">
              {/* TODO(launch): provision hello@garmentfoundry.com inbox in Google Workspace before merge */}
              <li><a data-testid="footer-email" href="mailto:hello@garmentfoundry.com" className="hover:text-white">hello@garmentfoundry.com</a></li>
              <li><a data-testid="footer-phone" href="tel:+447575657531" className="hover:text-white">+44 7575 657 531</a></li>
              <li className="text-[#999]">Manchester, United Kingdom</li>
            </ul>
            <Link to="/quote" data-testid="footer-quote-cta" className="gf-btn gf-btn-light mt-8">Request a Proposal</Link>
          </div>
        </div>

        <div className="seam mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-[10px] tracking-luxe text-[#555]">© {new Date().getFullYear()} GARMENT FOUNDRY — APPAREL MANUFACTURING &amp; SOURCING</p>
          <p className="font-body text-[10px] tracking-luxe text-[#555]">UNITED KINGDOM · UNITED STATES · GLOBAL SOURCING</p>
        </div>
      </div>
    </footer>
  );
}
