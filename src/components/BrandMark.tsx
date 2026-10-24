/**
 * Gross-Bazaar mark: an open "supply" crate and a solid "demand" crate joined
 * by a route, with a saffron value block in transit between them.
 */
export function BrandMark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect x="2.5" y="9.5" width="11" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="18" y="11.5" width="11.5" height="11.5" rx="1.5" fill="currentColor" />
      <rect x="13.5" y="4" width="6" height="6" rx="1" fill="var(--color-signal)" />
    </svg>
  );
}

export function Wordmark({ className = "", tone = "ink" }: { className?: string; tone?: "ink" | "light" }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 ${tone === "light" ? "text-on-navy" : "text-ink"} ${className}`}
    >
      <BrandMark className="h-7 w-7 shrink-0" />
      <span className="font-display text-[1.35rem] leading-none tracking-[-0.02em]" style={{ fontWeight: 500 }}>
        Gross<span className="text-signal-deep">-</span>Bazaar
      </span>
    </span>
  );
}
