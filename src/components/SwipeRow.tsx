"use client";

import { useEffect, useRef, useState } from "react";

type Tag = "div" | "ul" | "ol";

/**
 * Phone-only horizontal snap row. Below 640px the children become swipeable
 * cards with a position readout; at 640px and up the element renders exactly as
 * `className` describes, so tablet and desktop layouts are untouched.
 */
export function SwipeRow({
  as: Tag = "div",
  className = "",
  label,
  children,
}: {
  as?: Tag;
  className?: string;
  label: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState({ index: 1, count: 0, thumb: 1, offset: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const items = Array.from(el.children) as HTMLElement[];
      const max = el.scrollWidth - el.clientWidth;
      const center = el.scrollLeft + el.clientWidth / 2;
      let index = 1;
      items.forEach((item, i) => {
        if (item.offsetLeft <= center) index = i + 1;
      });
      setState({
        index,
        count: items.length,
        thumb: max > 0 ? el.clientWidth / el.scrollWidth : 1,
        offset: max > 0 ? el.scrollLeft / max : 0,
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <Tag ref={ref as never} className={`swipe-row ${className}`} aria-label={label}>
        {children}
      </Tag>
      <div className="mt-5 flex items-center gap-4 sm:hidden" aria-hidden="true">
        <span className="label tabular text-faint">
          <span className="text-ink">{pad(state.index)}</span> / {pad(state.count)}
        </span>
        <span className="relative h-0.5 flex-1 overflow-clip rounded-full bg-rule">
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-accent"
            style={{
              width: `${state.thumb * 100}%`,
              transform: `translateX(${state.offset * ((1 - state.thumb) / Math.max(state.thumb, 0.01)) * 100}%)`,
            }}
          />
        </span>
        <span className="label text-faint">Swipe</span>
      </div>
    </>
  );
}
