import React from "react";
import { Helmet } from "react-helmet-async";

// TODO(launch): fill these placeholders before merging the audit/blockers PR.
// Each value is included in the structured data only when non-empty, so an
// empty string is safe — search engines will simply skip the missing field.
const LANDLINE = ""; // e.g. "+44-161-555-0123" — the Manchester landline (Phase-3-F adds VoIP).
const STREET = ""; // e.g. "12 Studio Lane" — the registered office street address (also surfaces in the footer via Phase-1-I).
const LINKEDIN_HANDLE = ""; // path after /company/ — e.g. "garment-foundry"
const INSTAGRAM_HANDLE = ""; // handle without @ — e.g. "garmentfoundry"

const ORIGIN = "https://garmentfoundry.com";

function compact(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ""));
}

function organizationJsonLd() {
  const address = compact({
    "@type": "PostalAddress",
    streetAddress: STREET || undefined,
    addressLocality: "Manchester",
    addressCountry: "GB",
  });
  const sameAs = [
    LINKEDIN_HANDLE && `https://www.linkedin.com/company/${LINKEDIN_HANDLE}`,
    INSTAGRAM_HANDLE && `https://www.instagram.com/${INSTAGRAM_HANDLE}`,
  ].filter(Boolean);

  return compact({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Garment Foundry",
    url: ORIGIN,
    logo: `${ORIGIN}/logo.png`,
    email: "hello@garmentfoundry.com",
    telephone: LANDLINE || undefined,
    address,
    sameAs: sameAs.length ? sameAs : undefined,
  });
}

function localBusinessJsonLd() {
  const address = compact({
    "@type": "PostalAddress",
    streetAddress: STREET || undefined,
    addressLocality: "Manchester",
    addressCountry: "GB",
  });

  return compact({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Garment Foundry",
    url: ORIGIN,
    image: `${ORIGIN}/og-image.jpg`,
    email: "hello@garmentfoundry.com",
    telephone: LANDLINE || undefined,
    address,
    description: "UK-based apparel manufacturing and sourcing partner — from brief to bulk, handled with quiet rigour.",
    areaServed: ["GB", "United Kingdom", "United States", "Europe"],
  });
}

export default function SiteMeta() {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(organizationJsonLd())}</script>
      <script type="application/ld+json">{JSON.stringify(localBusinessJsonLd())}</script>
    </Helmet>
  );
}
