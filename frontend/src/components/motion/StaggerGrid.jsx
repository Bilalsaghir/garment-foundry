import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { REDUCED_MOTION, EASE, DUR, SCROLL_DEFAULTS } from "@/lib/motion";

/**
 * StaggerGrid — wraps a grid and animates direct children in a row-aware
 * stagger so each row of cards comes in together like a production line.
 *
 * Props:
 *   stagger  per-child delay (default 0.06s)
 *   y        translateY start (default 18px)
 *   duration default DUR.slow
 *   from     'children' (default) animates the actual DOM children
 */
export default function StaggerGrid({ children, className = "", stagger = 0.06, y = 18, duration = DUR.slow, ...rest }) {
  const ref = useRef(null);

  useGSAP(() => {
    if (!ref.current) return;
    const items = Array.from(ref.current.children);
    if (!items.length) return;

    if (REDUCED_MOTION) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(items, { opacity: 0, y });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration,
      stagger: { each: stagger, from: "start" },
      ease: EASE.out,
      scrollTrigger: { trigger: ref.current, start: SCROLL_DEFAULTS.start, once: true },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
