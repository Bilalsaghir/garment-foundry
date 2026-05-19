import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

// BL-G: Blog and Case Studies are temporarily removed from the nav until their
// content lands. Their /blog and /case-studies routes stay live (so sitemap
// URLs and direct links continue to work) but they emit a noindex meta tag.
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
  // 0..1 progress over the first 100px of scroll. Drives a smooth bg fade
  // instead of the previous binary switch at scrollY > 8.
  const [scrollProgress, setScrollProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const max = 100;
    const onScroll = () => setScrollProgress(Math.min(1, window.scrollY / max));
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  return (
    <header
      data-testid="site-navbar"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${0.85 * scrollProgress})`,
        backdropFilter: scrollProgress > 0 ? `blur(${20 * scrollProgress}px)` : "none",
        WebkitBackdropFilter: scrollProgress > 0 ? `blur(${20 * scrollProgress}px)` : "none",
        borderBottomColor: `rgba(31, 31, 31, ${scrollProgress})`,
      }}
      className="fixed top-0 inset-x-0 z-50 border-b border-transparent"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        <Link to="/" data-testid="nav-logo-link" className="flex items-center group">
          <BrandLogo height={56} className="transition-opacity group-hover:opacity-90" />
        </Link>

        <nav className="hidden xl:flex items-center gap-7">
          {NAV_LINKS.slice(1, 10).map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.label.replace(/\s+/g, '').toLowerCase()}`}
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

        <div className="flex items-center gap-4">
          <Link
            to="/quote"
            data-testid="nav-request-quote-btn"
            className="hidden md:inline-flex items-center justify-center h-10 px-8 bg-[#0A0A0A] hover:bg-[#1f1f1f] border border-[#1f1f1f] text-white font-body text-[11px] tracking-precision uppercase whitespace-nowrap transition-colors"
          >
            Request a Quote
          </Link>
          <button
            data-testid="nav-mobile-toggle"
            onClick={() => setOpen(!open)}
            className="xl:hidden text-[#F2F2F2] p-2"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {open && (
        <div data-testid="mobile-menu" className="xl:hidden bg-black border-t border-[#1f1f1f] fixed inset-x-0 top-20 bottom-0 overflow-y-auto">
          <nav className="flex flex-col py-8">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={`mobile-nav-${l.label.replace(/\s+/g, '').toLowerCase()}`}
                className={({ isActive }) =>
                  `font-body font-light text-[22px] tracking-[0.1em] py-[22px] px-7 border-b border-[#161616] transition-colors ${
                    isActive ? "text-white" : "text-[#ddd] hover:text-white"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="px-7 pt-8 pb-12">
              <Link
                to="/quote"
                data-testid="mobile-nav-request-quote"
                className="flex items-center justify-center h-14 w-full bg-[#F5F4F0] text-black font-body text-[12px] tracking-[0.2em] uppercase"
              >
                Request a Quote
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
