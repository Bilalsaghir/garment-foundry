import React from "react";

// Full Garment Foundry logo lockup (provided brand asset)
export const BRAND_LOGO_URL =
  "https://customer-assets.emergentagent.com/job_garment-foundry/artifacts/4rtaqra4_ChatGPT%20Image%20May%2017%2C%202026%2C%2004_38_57%20AM.png";

export const BrandLogo = ({ className = "", height = 44, alt = "Garment Foundry" }) => (
  <img
    src={BRAND_LOGO_URL}
    alt={alt}
    className={`object-contain ${className}`}
    style={{ height, width: "auto", mixBlendMode: "lighten" }}
    draggable={false}
  />
);

export default BrandLogo;
