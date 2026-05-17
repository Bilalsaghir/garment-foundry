import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { GFMonogram } from "./GFMonogram";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/capabilities", label: "Capabilities" },
  { to: "/categories", label: "Categories" },
  { to: "/process", label: "Process" },
  { to: "/sourcing", label: "Sourcing" },
  { to: "/quality", label: "Quality" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/85 backdrop-blur-xl border-b border-[#1f1f1f]" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        <Link to="/" data-testid="nav-logo-link" className="flex items-center gap-3 group">
          <GFMonogram size={36} color="#F2F2F2" />
          <span className="hidden sm:flex flex-col leading-none">
            <span className="font-display text-[13px] tracking-luxe text-[#F2F2F2]">GARMENT FOUNDRY</span>
            <span className="font-body text-[9px] tracking-luxe text-[#777] mt-1">APPAREL MANUFACTURING &amp; SOURCING</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.slice(1, 8).map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `font-body text-[11px] tracking-precision uppercase transition-colors ${
                  isActive ? "text-[#F2F2F2]" : "text-[#999] hover:text-[#F2F2F2]"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/quote"
            data-testid="nav-request-quote-btn"
            className="hidden md:inline-flex gf-btn gf-btn-solid"
          >
            Request a Quote
          </Link>
          <button
            data-testid="nav-mobile-toggle"
            onClick={() => setOpen(!open)}
            className="lg:hidden text-[#F2F2F2] p-2"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div data-testid="mobile-menu" className="lg:hidden bg-black/95 border-t border-[#1f1f1f] backdrop-blur-xl">
          <nav className="flex flex-col px-6 py-6 gap-4">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={`mobile-nav-${l.label.toLowerCase()}`}
                className="font-body text-[12px] tracking-precision uppercase text-[#ddd] hover:text-white py-2 border-b border-[#1a1a1a]"
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/quote"
              data-testid="mobile-nav-request-quote"
              className="gf-btn gf-btn-solid mt-2"
            >
              Request a Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
