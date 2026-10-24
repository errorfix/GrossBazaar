"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Phone-only: a floating pill with both enquiry routes, shown once the hero has
 * scrolled away and hidden while the scene, contact form or footer is on screen.
 */
export function MobileActionBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const contact = document.getElementById("contact");
    const footer = document.querySelector("footer");
    if (!hero || !contact) return;

    let pastHero = false;
    let nearEnd = false;
    const sync = () => setShow(pastHero && !nearEnd);

    const heroIo = new IntersectionObserver(([e]) => {
      pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
      sync();
    });
    const endTargets = new Map<Element, boolean>();
    const endIo = new IntersectionObserver((entries) => {
      for (const e of entries) endTargets.set(e.target, e.isIntersecting);
      nearEnd = Array.from(endTargets.values()).some(Boolean);
      sync();
    });
    heroIo.observe(hero);
    endIo.observe(contact);
    if (footer) endIo.observe(footer);
    // Stay out of the way of the pinned before/after scene.
    const scene = document.getElementById("impact");
    if (scene) endIo.observe(scene);
    return () => {
      heroIo.disconnect();
      endIo.disconnect();
    };
  }, []);

  return (
    <div
      className="fixed inset-x-3 z-40 transition-[transform,opacity] duration-500 ease-[var(--ease-out)] sm:hidden"
      style={{
        bottom: "max(0.75rem, env(safe-area-inset-bottom))",
        transform: show ? "none" : "translateY(140%)",
        opacity: show ? 1 : 0,
      }}
      aria-hidden={!show}
      inert={!show}
    >
      <nav
        aria-label="Quick enquiry"
        className="on-navy flex items-center gap-1.5 rounded-full bg-navy p-1.5 shadow-[0_18px_40px_-12px_oklch(21%_0.04_250/0.55)]"
      >
        <a href="#contact" data-enquiry="supplier" className="btn btn-signal h-11 min-h-0 flex-1 px-3 text-[0.86rem]">
          Discuss inventory
          <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
        </a>
        <a href="#contact" data-enquiry="buyer" className="btn btn-ghost-navy h-11 min-h-0 flex-1 px-3 text-[0.86rem]">
          Source stock
        </a>
      </nav>
    </div>
  );
}
