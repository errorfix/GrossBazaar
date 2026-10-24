"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const NAV_OFFSET = 88;

/**
 * Site-wide behaviour that has no visual of its own:
 * - Lenis inertial scrolling (slow, weighty feel), skipped under reduced motion
 * - in-page anchor links glide to their section and move focus for keyboard users
 * - one IntersectionObserver that marks `.reveal` / `[data-observe]` elements once
 */
export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | undefined;
    let raf = 0;

    if (!reduced) {
      lenis = new Lenis({
        duration: 1.55,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        wheelMultiplier: 0.8,
        touchMultiplier: 1.2,
        smoothWheel: true,
      });
      window.__lenis = lenis;
      if (root.classList.contains("gb-loading")) lenis.stop();
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href")!.slice(1);
      const target = id === "top" ? document.getElementById("top") : document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      if (lenis) {
        // `force`: the mobile menu pauses Lenis while open; its links must still scroll.
        lenis.scrollTo(id === "top" ? 0 : target, { duration: 1.8, force: true });
      } else {
        const y = id === "top" ? 0 : target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
        window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
      }
      // On phones a target can sit inside a horizontal swipe row (e.g. #buyers): bring it into view there too.
      const row = target.parentElement?.closest<HTMLElement>(".swipe-row");
      if (row && row.scrollWidth > row.clientWidth) {
        const left =
          row.scrollLeft +
          target.getBoundingClientRect().left -
          row.getBoundingClientRect().left -
          parseFloat(getComputedStyle(row).paddingLeft);
        row.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
      }
      history.replaceState(null, "", id === "top" ? window.location.pathname : `#${id}`);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    document.querySelectorAll(".reveal, [data-observe]").forEach((el) => io.observe(el));

    // Honour a deep link like /#contact once the page is ready.
    const jumpToHash = () => {
      const id = window.location.hash.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { immediate: true });
      else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET });
    };
    const onReady = () => {
      lenis?.start();
      jumpToHash();
    };
    if (root.classList.contains("gb-loading")) window.addEventListener("gb:intro-done", onReady, { once: true });
    else jumpToHash();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      window.removeEventListener("gb:intro-done", onReady);
      io.disconnect();
      lenis?.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
