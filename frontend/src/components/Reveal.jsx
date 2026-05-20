import React from "react";
import { useInView } from "@/hooks/useInView";

/**
 * Reveal — wraps a block of content and fades it up the first time it scrolls
 * into view. Bare CSS transition, no animation library. The transition uses
 * the site motion tokens (--motion-slow, --ease-out) defined in index.css.
 *
 * Usage:
 *   <Reveal>
 *     <section>…</section>
 *   </Reveal>
 *
 *   <Reveal delay={120}>…</Reveal>      // for staggered children
 *   <Reveal as="article">…</Reveal>     // override default <div>
 *
 * Reduced motion: the global CSS rule collapses transition-duration to 0ms,
 * so the inView state still toggles but the visual reveal is instant. The
 * final visual state (opacity: 1, translateY: 0) is reached either way.
 */
export default function Reveal({ children, delay = 0, className = "", as: Tag = "div" }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all ease-[cubic-bezier(0.16,1,0.3,1)] duration-[560ms]
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        ${className}`}
    >
      {children}
    </Tag>
  );
}
