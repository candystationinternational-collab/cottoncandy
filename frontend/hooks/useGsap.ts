"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** StrictMode-safe GSAP context hook. Skips all tweening under reduced-motion. */
export function useGsap(callback: (ctx: { reduced: boolean }) => void, deps: React.DependencyList = []) {
  const scopeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      callback({ reduced });
    }, scopeRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}

// Pause ScrollTrigger-driven animations when the tab is hidden (AN-8).
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    gsap.ticker.sleep();
    if (!document.hidden) gsap.ticker.wake();
  });
}

export { gsap, ScrollTrigger };
