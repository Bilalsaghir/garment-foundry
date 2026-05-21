import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { REDUCED_MOTION, EASE, DUR } from "@/lib/motion";

/**
 * StitchLine — a horizontal dashed "stitch" that draws from left to right
 * when it scrolls into view. Decorative element to thread sections together.
 *
 * Pure CSS dashed background expanded via scaleX; respects reduced-motion.
 */
export default function StitchLine({ className = "", color = "rgba(255,255,255,0.18)", height = 1, gap = 6, dash = 4 }) {
  const ref = useRef(null);

  useGSAP(() => {
    if (!ref.current || REDUCED_MOTION) {
      if (ref.current) gsap.set(ref.current, { scaleX: 1 });
      return;
    }
    gsap.set(ref.current, { scaleX: 0, transformOrigin: "left center" });
    gsap.to(ref.current, {
      scaleX: 1,
      duration: DUR.ambient,
      ease: EASE.out,
      scrollTrigger: { trigger: ref.current, start: "top 95%", once: true },
    });
  }, { scope: ref });

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        height,
        backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 ${dash}px, transparent ${dash}px ${dash + gap}px)`,
      }}
      className={className}
    />
  );
}
