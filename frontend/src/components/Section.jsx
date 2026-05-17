import React from "react";

export const SectionHeading = ({ eyebrow, number, title, subtitle, light = false, align = "left" }) => (
  <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
    {(eyebrow || number) && (
      <div className={`flex items-center gap-4 ${align === "center" ? "justify-center" : ""}`}>
        {number && <span className="eyebrow-number">{number}</span>}
        {eyebrow && <span className="overline">{eyebrow}</span>}
      </div>
    )}
    <h2
      className={`mt-6 font-display ${
        light ? "text-[#0a0a0a]" : "text-[#F2F2F2]"
      } text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-tight`}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        className={`mt-6 font-body text-[14px] leading-[1.9] max-w-2xl ${
          light ? "text-[#444]" : "text-[#aaa]"
        } ${align === "center" ? "mx-auto" : ""}`}
      >
        {subtitle}
      </p>
    )}
  </div>
);

export const StitchedDivider = ({ light = false }) => (
  <div className="flex items-center justify-center my-8">
    <div className={`flex-1 dashed-rule ${light ? "text-[#aaa]" : "text-[#333]"}`} />
    <svg viewBox="0 0 16 16" width="14" height="14" className="mx-4">
      <rect x="6" y="6" width="4" height="4" transform="rotate(45 8 8)" fill={light ? "#0a0a0a" : "#F2F2F2"} />
    </svg>
    <div className={`flex-1 dashed-rule ${light ? "text-[#aaa]" : "text-[#333]"}`} />
  </div>
);

export default SectionHeading;
