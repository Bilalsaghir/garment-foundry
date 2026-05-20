import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { GFMonogram } from "./GFMonogram";
import "./Navbar.css";

/**
 * Navbar — full editorial header.
 *
 * Layout (desktop):
 *   [ CF monogram · GARMENT FOUNDRY · APPAREL MANUFACTURING & SOURCING ]
 *                   Home · About · Capabilities · Categories · FAQs · Contact
 *                                                       [ Search ] [ Request a Quote → ]
 *
 *  - Fixed at the top of every page (lives inside the global PublicLayout in App.js).
 *  - Background fades from translucent → dark as the page scrolls past 100 px.
 *  - Active route shown with a paper-white underline; hover animates the same
 *    underline from scaleX(0) → scaleX(1) over 220 ms.
 *  - Mobile collapses to a centred logo + hamburger; drawer holds full nav + CTA.
 *  - Tagline hides on small viewports to avoid cramping.
 */

const NAV_LINKS = [
  { to: "/",             label: "Home" },
  { to: "/about",        label: "About" },
  { to: "/capabilities", label: "Capabilities" },
  { to: "/categories",   label: "Products" },
  { to: "/faqs",         label: "FAQs" },
  { to: "/contact",      label: "Contact" },
];

export default function Navbar() {
  const [scroll, setScroll] = useState(0);
  const [open, setOpen]     = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScroll(Math.min(1, window.scrollY / 100));
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on route change + lock body scroll while drawer is open.
  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      data-testid="site-navbar"
      className="gf-navbar"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${0.7 + 0.25 * scroll})`,
        backdropFilter:  `blur(${10 + 10 * scroll}px) saturate(140%)`,
        WebkitBackdropFilter: `blur(${10 + 10 * scroll}px) saturate(140%)`,
        borderBottomColor: `rgba(31, 31, 31, ${0.4 + 0.6 * scroll})`,
      }}
    >
      <div className="gf-navbar-inner">
        {/* LEFT — full lockup: monogram + wordmark + tagline */}
        <Link to="/" data-testid="nav-logo-link" className="gf-navbar-brand" aria-label="Garment Foundry — home">
          <span className="gf-navbar-mark">
            <GFMonogram size={40} color="#F2F2F2" />
          </span>
          <span className="gf-navbar-word">
            <span className="gf-navbar-name">GARMENT FOUNDRY</span>
            <span className="gf-navbar-tag">Apparel Manufacturing &amp; Sourcing</span>
          </span>
        </Link>

        {/* CENTRE — primary nav (hides on tablet/mobile) */}
        <nav className="gf-navbar-links" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.to === "/"}
              data-testid={`nav-link-${l.label.replace(/\s+/g, "").toLowerCase()}`}
              className={({ isActive }) =>
                `gf-navbar-link ${isActive ? "is-active" : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT — search + quote CTA + mobile toggle */}
        <div className="gf-navbar-actions">
          <button type="button" className="gf-navbar-iconbtn" aria-label="Search" tabIndex={-1}>
            <Search size={16} strokeWidth={1.5} />
          </button>
          <Link
            to="/quote"
            data-testid="nav-request-quote-btn"
            className="gf-navbar-cta"
          >
            Request a Quote <span aria-hidden>→</span>
          </Link>
          <button
            type="button"
            data-testid="nav-mobile-toggle"
            onClick={() => setOpen(!open)}
            className="gf-navbar-mobile-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {open && (
        <div data-testid="mobile-menu" className="gf-navbar-drawer">
          <nav aria-label="Mobile">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={`m-${l.label}`}
                to={l.to}
                end={l.to === "/"}
                data-testid={`mobile-nav-${l.label.replace(/\s+/g, "").toLowerCase()}`}
                className={({ isActive }) => `gf-navbar-drawer-link ${isActive ? "is-active" : ""}`}
              >
                {l.label}
              </NavLink>
            ))}
            <div className="gf-navbar-drawer-cta-wrap">
              <Link to="/quote" data-testid="mobile-nav-request-quote" className="gf-navbar-drawer-cta">
                Request a Quote
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
