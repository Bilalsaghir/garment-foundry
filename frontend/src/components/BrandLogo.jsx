import React from "react";

// CR-D: Self-host the brand lockup. The previous URL pointed at Emergent's CDN
// with a literal "ChatGPT Image May 17 2026" filename — visible in every
// network panel and a credibility tell.
// TODO(launch): verify that public/logo.png on the VPS is the full GF lockup
// (not just the monogram). If it isn't, replace public/logo.png with the
// correct asset — this code already references it.
export const BRAND_LOGO_URL = "/logo.png";

export const BrandLogo = ({ className = "", height = 44, alt = "Garment Foundry — UK apparel manufacturing & sourcing" }) => (
  <img
    src={BRAND_LOGO_URL}
    alt={alt}
    className={`object-contain ${className}`}
    style={{ height, width: "auto", mixBlendMode: "lighten" }}
    draggable={false}
  />
);

export default BrandLogo;
