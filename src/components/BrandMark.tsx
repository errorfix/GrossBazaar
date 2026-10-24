import Image from "next/image";

/**
 * Gross-Bazaar 3D isometric hexagonal emblem mark.
 */
export function BrandMark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <Image
      src="/logo.png"
      alt={title || "Gross-Bazaar Logo"}
      width={128}
      height={128}
      className={`object-contain ${className}`}
      priority
    />
  );
}

export function Wordmark({ className = "", tone = "ink" }: { className?: string; tone?: "ink" | "light" }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 ${tone === "light" ? "text-on-navy" : "text-ink"} ${className}`}
    >
      <BrandMark className="h-8 w-8 shrink-0" />
      <span className="font-display text-[1.35rem] leading-none tracking-[-0.02em]" style={{ fontWeight: 500 }}>
        Gross<span className="text-signal-deep">-</span>Bazaar
      </span>
    </span>
  );
}
