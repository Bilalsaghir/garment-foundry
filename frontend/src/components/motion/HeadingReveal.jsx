import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { REDUCED_MOTION, EASE, DUR, SCROLL_DEFAULTS } from "@/lib/motion";

/**
 * HeadingReveal — sequenced choreography for a heading block.
 * 1. eyebrow (small label)        — fade up
 * 2. divider                      — scaleX 0→1
 * 3. title                        — fade up + small y
 * 4. body                         — fade up after title settles
 *
 * Wrap your eyebrow/divider/title/body and mark them with the right data-attr.
 *
 *   <HeadingReveal>
 *     <span data-h="eyebrow">— 003 / CAPABILITIES</span>
 *     <div  data-h="divider" className="dashed-rule w-12 my-4" />
 *     <h2   data-h="title">Full-spectrum apparel manufacturing.</h2>
 *     <p    data-h="body">From concept refinement to delivered shipment...</p>
 *   </HeadingReveal>
 */
export default function HeadingReveal({ children, className = "" }) {
  const ref = useRef(null);

  useGSAP(() => {
    if (!ref.current) return;
    const eyebrow = ref.current.querySelector('[data-h="eyebrow"]');
    const divider = ref.current.querySelector('[data-h="divider"]');
    const title   = ref.current.querySelector('[data-h="title"]');
    const body    = ref.current.querySelector('[data-h="body"]');

    const targets = [eyebrow, divider, title, body].filter(Boolean);
    if (!targets.length) return;

    if (REDUCED_MOTION) {
      gsap.set(targets, { opacity: 1, y: 0, scaleX: 1 });
      return;
    }

    // Initial state — invisible / collapsed
    if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 14 });
    if (divider) gsap.set(divider, { scaleX: 0, transformOrigin: "left center" });
    if (title)   gsap.set(title,   { opacity: 0, y: 22 });
    if (body)    gsap.set(body,    { opacity: 0, y: 14 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: SCROLL_DEFAULTS.start, once: true },
    });
    if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out });
    if (divider) tl.to(divider, { scaleX: 1, duration: DUR.slow, ease: EASE.expo }, "-=0.2");
    if (title)   tl.to(title,   { opacity: 1, y: 0, duration: DUR.slow, ease: EASE.out }, "-=0.35");
    if (body)    tl.to(body,    { opacity: 1, y: 0, duration: DUR.slow, ease: EASE.out }, "-=0.40");
  }, { scope: ref });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
