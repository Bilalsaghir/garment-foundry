import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { REDUCED_MOTION, EASE, DUR, SCROLL_DEFAULTS } from "@/lib/motion";

/**
 * useGsapReveal — fade-up stagger on elements that match `selector`
 * inside the returned ref. Triggered when the container enters the viewport.
 *
 * Defaults:
 *   selector  '[data-reveal]'   — opt-in via data attribute
 *   stagger   0.08s
 *   y         24px
 *   duration  DUR.slow
 *   start     'top 85%'
 *
 * Reduced motion: items are set to their final state immediately.
 */
export function useGsapReveal({
  selector = "[data-reveal]",
  stagger = 0.08,
  y = 24,
  duration = DUR.slow,
  delay = 0,
  start = SCROLL_DEFAULTS.start,
} = {}) {
  const ref = useRef(null);

  useGSAP(() => {
    if (!ref.current) return;
    const targets = ref.current.querySelectorAll(selector);
    if (!targets.length) return;

    if (REDUCED_MOTION) {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: "transform" });
      return;
    }

    gsap.set(targets, { opacity: 0, y });
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: EASE.out,
      scrollTrigger: { trigger: ref.current, start, once: true },
      clearProps: "willChange",
    });
  }, { scope: ref });

  return ref;
}
