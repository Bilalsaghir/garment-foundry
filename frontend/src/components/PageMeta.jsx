import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_ORIGIN = "https://garmentfoundry.com";

export default function PageMeta({ path, title, description, noindex = false }) {
  const canonical = `${SITE_ORIGIN}${path === "/" ? "" : path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {noindex && <meta name="robots" content="noindex,follow" />}
    </Helmet>
  );
}
