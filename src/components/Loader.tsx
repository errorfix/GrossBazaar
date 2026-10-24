"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const WORD = "Gross-Bazaar".split("");
const RUN_MS = 2400;
const PHASES = [
  { at: 0, text: "Assessing inventory" },
  { at: 0.3, text: "Discovering buyers" },
  { at: 0.6, text: "Matching confidentially" },
  { at: 0.93, text: "Ready" },
];

/**
 * One-time intro (once per browser session; never under reduced motion).
 * Crates assemble, the wordmark rises, a counter runs through the business's
 * own process, then five navy panels lift away to reveal the page.
 */
export function Loader() {
  const [mounted, setMounted] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    const root = document.documentElement;
    setLeaving(true);
    window.setTimeout(() => root.classList.add("gb-ready"), 380);
    window.setTimeout(() => {
      root.classList.remove("gb-loading");
      root.classList.add("gb-seen");
      try {
        sessionStorage.setItem("gb-intro", "1");
      } catch {}
      window.dispatchEvent(new Event("gb:intro-done"));
      setMounted(false);
    }, 1350);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("gb-seen")) {
      setMounted(false);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / RUN_MS);
      const p = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      barRef.current?.style.setProperty("--p", p.toFixed(4));
      if (countRef.current) countRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      const phase = [...PHASES].reverse().find((ph) => p >= ph.at);
      if (phaseRef.current && phase && phaseRef.current.textContent !== phase.text) {
        phaseRef.current.textContent = phase.text;
      }
      if (t < 1) raf = requestAnimationFrame(tick);
      else window.setTimeout(finish, 220);
    };
    raf = requestAnimationFrame(tick);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, [finish]);

  if (!mounted) return null;

  return (
    <div className={`loader on-navy ${leaving ? "is-leaving" : ""}`} aria-label="Loading Gross-Bazaar" role="status">
      <div className="loader-cols" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>

      <div className="loader-stage">
        <div className="loader-center">
          <svg viewBox="0 0 32 32" className="h-14 w-14 text-on-navy sm:h-16 sm:w-16" aria-hidden="true">
            <rect className="lm-supply" x="2.5" y="9.5" width="11" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <rect className="lm-demand" x="18" y="11.5" width="11.5" height="11.5" rx="1.5" fill="currentColor" />
            <path className="lm-link" d="M8 9 Q16 -1 24 11" fill="none" stroke="var(--color-on-navy-muted)" strokeWidth="0.8" />
            <rect className="lm-value" x="13.5" y="4" width="6" height="6" rx="1" fill="var(--color-signal)" />
          </svg>

          <p className="loader-word" aria-hidden="true">
            {WORD.map((ch, i) => (
              <span key={i} className={ch === "-" ? "is-dash" : undefined} style={{ "--i": i } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </p>
          <p className="loader-tag label text-center">Inventory recovery · Bulk sourcing · India</p>
        </div>

        <div className="grid gap-4">
          <div className="flex items-end justify-between gap-6">
            <span ref={phaseRef} className="label text-on-navy-muted">
              Assessing inventory
            </span>
            <button
              type="button"
              onClick={finish}
              className="label rounded-full border border-navy-rule px-3 py-1.5 text-on-navy-muted transition-colors hover:border-on-navy-muted hover:text-on-navy"
            >
              Skip intro
            </button>
            <span className="font-display tabular text-4xl leading-none text-on-navy sm:text-5xl" aria-hidden="true">
              <span ref={countRef}>000</span>
            </span>
          </div>
          <div className="loader-progress" aria-hidden="true">
            <span ref={barRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
