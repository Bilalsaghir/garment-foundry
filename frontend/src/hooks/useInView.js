import { useEffect, useRef, useState } from "react";

/**
 * useInView — fires once when the observed element scrolls into the viewport.
 * Bare IntersectionObserver, no dependency. Set `once: false` to toggle on/off as
 * the element passes in and out of view (useful for ongoing animations).
 *
 * Respects prefers-reduced-motion implicitly: callers either gate animations on
 * inView, or the global CSS reduced-motion rule collapses durations to 0ms.
 */
export function useInView({ threshold = 0.15, rootMargin = "0px 0px -10% 0px", once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) obs.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, { threshold, rootMargin });
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
