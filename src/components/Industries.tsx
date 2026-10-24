import { SwipeRow } from "./SwipeRow";
import { Armchair, ArrowRight, Ban, Cpu, Factory, HandHeart, Shirt, Store } from "lucide-react";
import { industries } from "@/config/site";

const icons = {
  apparel: Shirt,
  industrial: Factory,
  it: Cpu,
  retail: Store,
  office: Armchair,
  institutional: HandHeart,
} as const;

const notSuited = [
  "Hazardous, regulated or e-waste that requires authorised handling",
  "Expired, recalled or unsafe products",
  "Counterfeit or intellectual-property-infringing goods",
  "Stock without clear ownership or resale authorisation",
  "Products whose sale is restricted by law or licence",
];

export function Industries() {
  return (
    <section id="industries" className="border-t border-rule bg-paper-2 py-20 sm:py-24">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="h-section reveal lg:col-span-7">Built for Business Across Inventory Categories.</h2>
          <p className="reveal text-muted lg:col-span-4 lg:col-start-9" style={{ "--i": 1 } as React.CSSProperties}>
            The sectors we aim to serve. Coverage starts selectively, where suitable supply and demand can be established.
          </p>
        </div>

        <SwipeRow as="ul" className="swipe-bordered mt-10 grid gap-px overflow-clip rounded-3xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3" label="Industries">
          {industries.map((ind, i) => {
            const Icon = icons[ind.slug];
            return (
              <li
                key={ind.slug}
                className="reveal group relative flex flex-col bg-paper p-7 transition-colors duration-300 hover:bg-paper sm:p-8"
                style={{ "--i": i % 3 } as React.CSSProperties}
              >
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-rule text-ink transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="label tabular text-faint">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-10 font-display text-[1.45rem] leading-tight tracking-[-0.01em]">{ind.title}</h3>
                <p className="mt-2.5 text-[0.93rem] text-muted">{ind.body}</p>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100 sm:inset-x-8"
                />
              </li>
            );
          })}
        </SwipeRow>

        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          <div className="reveal flex flex-col justify-between gap-6 rounded-3xl border border-rule bg-paper p-6 sm:p-8 lg:col-span-5">
            <p className="text-[0.95rem] text-ink-2">
              Industry coverage will expand progressively as supplier relationships, buyer demand and category-specific
              processes develop.
            </p>
            <a href="#contact" className="group inline-flex items-center gap-2 text-[0.92rem] font-medium text-accent">
              Category not listed? Tell us about it
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </div>
          <div className="reveal rounded-3xl border border-rule bg-paper p-6 sm:p-8 lg:col-span-7" style={{ "--i": 1 } as React.CSSProperties}>
            <h3 className="flex items-center gap-2.5 text-[1rem] font-medium">
              <Ban className="h-4 w-4 text-error" aria-hidden="true" />
              Not suited to this process
            </h3>
            <ul className="mt-4 grid gap-x-8 gap-y-2 text-[0.9rem] text-muted sm:grid-cols-2">
              {notSuited.map((n) => (
                <li key={n} className="flex gap-2.5">
                  <span className="mt-[0.65em] h-px w-2.5 shrink-0 bg-rule-strong" aria-hidden="true" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
