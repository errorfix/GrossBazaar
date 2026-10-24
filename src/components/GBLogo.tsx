import { useId } from "react";

/**
 * Gross-Bazaar "GB" monogram, redrawn from the brand logo: a navy G and a blue B
 * split by two diagonal cuts, with an isometric crate at the centre.
 * `onDark` swaps the navy G for a pale one so it reads on navy surfaces.
 */
export function GBMark({ className = "", onDark = false }: { className?: string; onDark?: boolean }) {
  const id = useId().replace(/:/g, "");
  const gap = onDark ? "var(--color-navy)" : "var(--color-paper)";

  return (
    <svg viewBox="0 0 460 320" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={onDark ? "var(--color-on-navy)" : "var(--color-brand-navy)"} />
          <stop offset="1" stopColor={onDark ? "var(--color-on-navy-muted)" : "var(--color-brand-navy-2)"} />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-brand-blue)" />
          <stop offset="1" stopColor="var(--color-brand-blue-2)" />
        </linearGradient>
        <clipPath id={`${id}cg`}>
          <polygon points="0,0 284,0 214,88 214,293.5 150,335 0,335" />
        </clipPath>
        <clipPath id={`${id}cb`}>
          <polygon points="284,0 460,0 460,335 150,335 214,293.5 214,88" />
        </clipPath>
      </defs>

      <path d="M296 38 H157 A122 122 0 0 0 157 282 H260" fill="none" stroke={`url(#${id}g)`} strokeWidth="66" clipPath={`url(#${id}cg)`} />
      <g clipPath={`url(#${id}cb)`} fill="none" stroke={`url(#${id}b)`} strokeWidth="64">
        <path d="M200 38 H352 A51 51 0 0 1 352 140 H300" />
        <path d="M300 140 H356 A70 70 0 0 1 356 280 H140" />
      </g>
      <g stroke={gap} strokeWidth="13">
        <line x1="300" y1="-20" x2="214" y2="88" />
        <line x1="150" y1="335" x2="318" y2="226" />
      </g>

      {/* Crate: navy left face doubles as the G's arrowed crossbar */}
      <g stroke={gap} strokeWidth="6" strokeLinejoin="round">
        <polygon points="183,132 112,192 183,192 183,250 250,250 250,174" fill={`url(#${id}g)`} />
        <polygon points="248,92 312,130 248,170 184,130" fill="var(--color-brand-blue-top)" />
        <polygon points="250,174 314,134 314,212 250,252" fill="var(--color-brand-blue)" />
      </g>
    </svg>
  );
}

/** Full lockup: monogram, two-tone wordmark and the brand line. */
export function GBLockup({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-[0.35em] ${className}`}>
      <GBMark onDark={onDark} className="h-[1.5em] w-auto shrink-0" />
      <div className="min-w-0">
        <p className="font-logo whitespace-nowrap leading-none tracking-[-0.02em]" style={{ fontWeight: 800 }}>
          <span className={onDark ? "text-on-navy" : "text-brand-navy"}>Gross-</span>
          <span className={onDark ? "text-brand-blue-light" : "text-brand-blue"}>Bazaar</span>
        </p>
        <p
          className={`mt-[0.55em] text-[max(0.62rem,0.16em)] font-medium uppercase leading-snug tracking-[0.3em] ${
            onDark ? "text-on-navy-muted" : "text-muted"
          }`}
        >
          Inventory today. Opportunities tomorrow.
        </p>
      </div>
    </div>
  );
}
