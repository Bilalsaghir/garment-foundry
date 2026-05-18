import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div data-testid="page-not-found" className="bg-black min-h-screen pt-40 pb-32 px-6 text-center">
      <div className="max-w-xl mx-auto">
        <span className="eyebrow-number">404</span>
        <h1 className="mt-6 font-display text-3xl lg:text-5xl leading-[1.1] tracking-tight text-[#F2F2F2]">
          This thread came loose.
        </h1>
        <p className="mt-6 font-body text-[14px] leading-[1.9] text-[#aaa]">
          The page you were looking for is not here. The link may have moved, or the
          address may have been mistyped. A few places to pick up from:
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/quote" className="gf-btn gf-btn-solid inline-flex">Request a quote</Link>
          <Link to="/categories" className="gf-btn gf-btn-light inline-flex">Browse categories</Link>
          <Link to="/" className="gf-btn gf-btn-light inline-flex">Return home</Link>
        </div>
      </div>
    </div>
  );
}
