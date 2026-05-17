import React from "react";
import { Link } from "react-router-dom";
import { BrandLogo } from "./BrandLogo";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-black border-t border-[#1f1f1f]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <BrandLogo height={96} />
            <p className="mt-8 max-w-md font-body text-[13px] leading-[1.9] text-[#999]">
              A United Kingdom based apparel manufacturing and sourcing partner. We help fashion labels, uniform programmes and private-label brands move from brief to bulk with precision and quiet confidence.
            </p>
            <div className="mt-8 dashed-rule text-[#333] w-32" />
            <p className="mt-6 font-display text-[11px] tracking-luxe text-[#666]">
              CRAFTED WITH PURPOSE. DELIVERED WITH PRECISION.
            </p>
          </div>

          {/* Sitemap */}
          <div className="md:col-span-3">
            <div className="overline mb-6">Studio</div>
            <ul className="space-y-3 font-body text-[12px]">
              <li><Link data-testid="footer-link-about" to="/about" className="text-[#bbb] hover:text-white">About</Link></li>
              <li><Link data-testid="footer-link-capabilities" to="/capabilities" className="text-[#bbb] hover:text-white">Capabilities</Link></li>
              <li><Link data-testid="footer-link-categories" to="/categories" className="text-[#bbb] hover:text-white">Categories</Link></li>
              <li><Link data-testid="footer-link-process" to="/process" className="text-[#bbb] hover:text-white">Process</Link></li>
              <li><Link data-testid="footer-link-sourcing" to="/sourcing" className="text-[#bbb] hover:text-white">Sourcing</Link></li>
              <li><Link data-testid="footer-link-quality" to="/quality" className="text-[#bbb] hover:text-white">Quality Control</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <div className="overline mb-6">Contact</div>
            <ul className="space-y-4 font-body text-[12px] text-[#bbb]">
              <li><a data-testid="footer-email" href="mailto:garmentfoundry.uk@gmail.com" className="hover:text-white">garmentfoundry.uk@gmail.com</a></li>
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
