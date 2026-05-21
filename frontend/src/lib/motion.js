/**
 * Site-wide motion primitives — GSAP + ScrollTrigger.
 *
 * Manufacturing-inspired direction:
 *   - thread lines drawn left→right like stitching
 *   - timeline progress tied to scroll, like a production workflow
 *   - cards staggered like production stations activating one after the other
 *   - fabric-panel reveals via clip-path
 *
 * All animations respect `prefers-reduced-motion: reduce`.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined" && !gsap.plugins?.scrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

// Single source of truth — used by every motion component.
export const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Refined easing — deliberate, not playful. No bounce, no elastic.
export const EASE = {
  out:   "power3.out",
  inOut: "power3.inOut",
  expo:  "expo.out",
  // CSS-side equivalents for things that animate via CSS transitions.
  cssOut:   "cubic-bezier(0.16, 1, 0.3, 1)",
  cssInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
};

// Duration scale — match index.css motion tokens.
export const DUR = {
  fast:    0.22,    // microinteractions
  base:    0.45,    // small reveals
  slow:    0.7,     // section reveals
  ambient: 1.2,     // hero pieces, image masks
};

// Default scroll trigger options — start when section is 85% up the viewport,
// only fire once, no scrubbing unless explicitly requested.
export const SCROLL_DEFAULTS = {
  start: "top 85%",
  once:  true,
};

// Shorthand to no-op a tween when reduced-motion is active.
// Returns a faux timeline-like with .add() / .to() that just `gsap.set`s the
// final state so layout never depends on the animation having run.
export const safeGsap = REDUCED_MOTION
  ? {
      to:   (t, v) => gsap.set(t, { ...v, ease: "none", duration: 0 }),
      from: (t, v) => {},      // skip "from" entries entirely
      fromTo: (t, _from, to) => gsap.set(t, { ...to, ease: "none", duration: 0 }),
      set:  (t, v) => gsap.set(t, v),
    }
  : gsap;
