"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { navLinks } from "@/config/site";
import { Wordmark } from "./BrandMark";

/** N5 floating pill: detached from the edges, tucks away on scroll-down, returns on scroll-up. */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#top");
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 12);
        if (Math.abs(y - lastY) > 6) setHidden(y > lastY && y > 320);
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in the middle of the viewport.
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Mobile sheet: lock scroll, focus first link, close on Escape, trap Tab.
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a, button") ?? []).concat(toggleRef.current ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const list = focusables();
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.__lenis?.start();
    };
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-[var(--ease-out)] sm:px-5 sm:pt-4"
      style={{ transform: hidden && !open ? "translateY(-130%)" : "none" }}
    >
      <nav
        aria-label="Primary"
        className={`relative z-10 mx-auto flex h-14 max-w-[1240px] items-center justify-between gap-4 rounded-full border pl-4 pr-2 transition-[background-color,border-color,box-shadow] duration-300 sm:pl-5 ${
          scrolled || open
            ? "border-rule bg-paper/90 shadow-[0_1px_2px_oklch(21%_0.04_250/0.04),0_12px_32px_-12px_oklch(21%_0.04_250/0.18)] backdrop-blur-md"
            : "border-transparent bg-paper/0"
        }`}
      >
        <a href="#top" aria-label="Gross-Bazaar — back to top" className="shrink-0 rounded-md">
          <Wordmark />
        </a>

        <ul className="hidden items-center gap-0.5 xl:flex">
          {navLinks.map((link) => {
            const isActive = active === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative block whitespace-nowrap rounded-full px-3 py-2 text-[0.88rem] transition-colors duration-200 ${
                    isActive ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-300 ease-[var(--ease-out)] ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a href="#contact" className="btn btn-ink hidden h-10 min-h-0 px-4 text-[0.88rem] sm:inline-flex">
            Let&rsquo;s Talk Business
            <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rule text-ink transition-colors hover:bg-paper-2 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!open}
        className="fixed inset-0 bg-paper px-5 pb-8 pt-24 xl:hidden"
        onClick={(e) => {
          if (!(e.target as Element).closest("a")) return;
          // Unlock scrolling now, before the anchor handler starts its glide;
          // restarting Lenis later (in the effect cleanup) would cancel it.
          document.body.style.overflow = "";
          window.__lenis?.start();
          setOpen(false);
        }}
      >
        <ul className="wrap grid gap-1 !px-0">
          {navLinks.map((link, i) => (
            <li key={link.href} className="border-b border-rule">
              <a
                href={link.href}
                className="flex items-baseline justify-between py-4 font-display text-[1.9rem] leading-tight text-ink"
              >
                {link.label}
                <span className="label text-faint tabular">{String(i + 1).padStart(2, "0")}</span>
              </a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="btn btn-primary mt-8 w-full">
          Let&rsquo;s Talk Business
          <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
