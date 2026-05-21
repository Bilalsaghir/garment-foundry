import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { REDUCED_MOTION } from "@/lib/motion";

/**
 * TimelineProgress — a vertical line that fills as the user scrolls past
 * the wrapped content. Mark step markers within with `data-step`; they'll
 * highlight as the fill line crosses them.
 *
 * Usage:
 *   <TimelineProgress>
 *     <ol>
 *       <li><span data-step>...</span></li>
 *     </ol>
 *   </TimelineProgress>
 *
 * Visual: by default it overlays a 1px paper-white line that fills 0 → 100%
 * tied to scroll progress.
 */
export default function TimelineProgress({ children, className = "" }) {
  const ref = useRef(null);

  useGSAP(() => {
    if (!ref.current) return;
    const fill = ref.current.querySelector("[data-progress-fill]");
    if (!fill) return;

    if (REDUCED_MOTION) {
      gsap.set(fill, { scaleY: 1 });
      return;
    }

    gsap.set(fill, { scaleY: 0, transformOrigin: "top center" });
    gsap.to(fill, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 70%",
        end:   "bottom 70%",
        scrub: 0.6,
      },
    });

    // Highlight markers as the line crosses them.
    const steps = ref.current.querySelectorAll("[data-step]");
    steps.forEach((step) => {
      gsap.fromTo(step,
        { backgroundColor: "rgba(255,255,255,0.20)" },
        {
          backgroundColor: "rgba(255,255,255,1)",
          scrollTrigger: {
            trigger: step,
            start: "top 70%",
            end:   "top 50%",
            scrub: 0.4,
          },
        }
      );
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={`relative ${className}`}>
      {children}
    </div>
  );
}
