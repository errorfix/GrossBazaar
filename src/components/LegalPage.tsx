import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Wordmark } from "./BrandMark";

/** Shared shell for the legal pages. Content is a clearly marked draft until reviewed. */
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="wrap flex items-center justify-between py-6">
        <Link href="/" aria-label="Gross-Bazaar home">
          <Wordmark />
        </Link>
        <Link href="/" className="inline-flex items-center gap-2 text-[0.9rem] text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to site
        </Link>
      </header>
      <main className="wrap max-w-[46rem] pb-24 pt-10">
        <p className="rounded-xl border border-dashed border-signal-deep bg-signal-soft px-4 py-3 text-[0.88rem] text-ink-2">
          Draft placeholder. This page must be reviewed and completed by qualified legal counsel before launch.
        </p>
        <h1 className="display mt-10 text-[clamp(2.4rem,3vw+1.2rem,3.6rem)]">{title}</h1>
        <div className="mt-8 grid gap-5 text-ink-2 [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-[1.5rem] [&_h2]:text-ink">
          {children}
        </div>
      </main>
    </div>
  );
}
