import React from "react";
import HeadingReveal from "@/components/motion/HeadingReveal";

/**
 * SectionHeading — the brand's canonical heading block.
 * Wraps its contents in a HeadingReveal so the eyebrow → divider → title → body
 * choreography fires automatically when the section enters view.
 */
export const SectionHeading = ({ eyebrow, number, title, subtitle, light = false, align = "left" }) => (
  <HeadingReveal>
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {(eyebrow || number) && (
        <div data-h="eyebrow" className={`flex items-center gap-4 ${align === "center" ? "justify-center" : ""}`}>
          {number && <span className="eyebrow-number">{number}</span>}
          {eyebrow && <span className="overline">{eyebrow}</span>}
        </div>
      )}
      <div data-h="divider" className={`dashed-rule mt-4 w-12 ${light ? "text-[#888]" : "text-[#3a3a3a]"}`} />
      <h2
        data-h="title"
        className={`mt-5 font-display ${
          light ? "text-[#0a0a0a]" : "text-[#F2F2F2]"
        } text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-tight`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          data-h="body"
          className={`mt-5 font-body text-[14px] leading-[1.9] max-w-2xl ${
            light ? "text-[#444]" : "text-[#aaa]"
          } ${align === "center" ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  </HeadingReveal>
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
