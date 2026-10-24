import { ArrowRight, Check } from "lucide-react";

const assurances = [
  "Confidential, managed process",
  "No public inventory listings",
  "Every enquiry reviewed by our team",
];

const line = (i: number) => ({ "--i": i }) as React.CSSProperties;

export function Hero() {
  return (
    <section id="top" className="relative overflow-clip pb-14 pt-28 sm:pt-36 lg:pb-16 lg:pt-44">
      {/* Faint ledger grid behind the hero — structure, not decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(to_right,var(--color-rule)_1px,transparent_1px)] [background-size:calc(100%/12)_100%] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
      />

      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <p className="hero-fade mb-7 inline-flex items-center gap-2.5 rounded-full border border-rule bg-paper py-1.5 pl-2 pr-3.5 text-[0.82rem] text-muted" style={line(-3)}>
              <span className="h-2 w-2 rounded-[2px] bg-signal" aria-hidden="true" />
              B2B inventory recovery &amp; bulk sourcing · India
            </p>

            <h1 className="display text-[clamp(2.55rem,3.4vw+1rem,4.45rem)]">
              <span className="rise-line"><span style={line(0)}>Turn Unsold Inventory</span></span>
              <span className="rise-line"><span style={line(1)}>Into New Business</span></span>
              <span className="rise-line">
                <span style={line(2)}>
                  <span className="relative inline-block">
                    Opportunities.
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 300 12"
                      preserveAspectRatio="none"
                      className="absolute -bottom-[0.06em] left-0 h-[0.14em] w-[96%] text-signal"
                    >
                      <path d="M2 8 C 80 2, 190 2, 298 7" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </span>
            </h1>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 lg:pb-2">
            <p className="lede hero-fade max-w-[32rem]" style={line(0)}>
              Your inventory may have a market beyond your existing sales channels. Gross-Bazaar helps businesses
              discover new commercial opportunities through managed bulk sourcing, confidential buyer connections and
              inventory recovery.
            </p>

            <div className="hero-fade mt-8 flex flex-wrap gap-3" style={line(1)}>
              <a href="#contact" data-enquiry="supplier" className="btn btn-primary">
                Discuss Your Inventory
                <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#contact" data-enquiry="buyer" className="btn btn-outline">
                Source Bulk Inventory
              </a>
            </div>
          </div>
        </div>

        <ul className="hero-fade mt-12 grid gap-2.5 border-t border-rule pt-6 text-[0.88rem] text-muted sm:flex sm:flex-wrap sm:gap-x-8" style={line(2)}>
          {assurances.map((a) => (
            <li key={a} className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              {a}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
