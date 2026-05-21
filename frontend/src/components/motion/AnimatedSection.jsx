import React from "react";
import { useGsapReveal } from "@/hooks/useGsapReveal";

/**
 * AnimatedSection — drop-in <section> with built-in reveal.
 * Mark any descendant you want animated with `data-reveal`.
 *
 * <AnimatedSection className="py-12">
 *   <h2 data-reveal>Hello</h2>
 *   <p  data-reveal>World</p>
 * </AnimatedSection>
 */
export default function AnimatedSection({ children, as = "section", stagger, y, duration, start, className = "", ...rest }) {
  const ref = useGsapReveal({ stagger, y, duration, start });
  const Tag = as;
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
