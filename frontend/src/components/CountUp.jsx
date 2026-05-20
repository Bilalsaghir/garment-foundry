import React, { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

/**
 * CountUp — counts from 0 to `to` over `duration` ms once the element scrolls
 * into view. Suffix sticks (e.g. "+", "M+"). Respects prefers-reduced-motion
 * by snapping to the final value immediately.
 */
export default function CountUp({ to, duration = 1200, suffix = "", className = "" }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (typeof window !== "undefined") {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) { setN(to); return; }
    }
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setN(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return <span ref={ref} className={className}>{n}{suffix}</span>;
}
