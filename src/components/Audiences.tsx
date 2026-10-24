import { SwipeRow } from "./SwipeRow";
import { ArrowRight, Info } from "lucide-react";

const supplierPrep = [
  "An item list or lot summary",
  "Approximate quantities and condition",
  "Where the stock is located",
  "Any resale limits: channels, regions or de-branding",
  "Your price expectations, if known",
];
const buyerPrep = [
  "Preferred categories",
  "Specifications, grades or condition you can accept",
  "Required quantities and how often",
  "Delivery location",
  "Target price or budget range, if known",
];

export function Audiences() {
  return (
    <section id="work-with-us" className="border-t border-rule py-20 sm:py-24">
      <div className="wrap">
        <h2 className="h-section reveal max-w-[40rem]">Two Ways to Work With Us.</h2>

        <SwipeRow className="mt-10 grid gap-4 lg:grid-cols-2" label="Ways to work with us">
          {/* Suppliers */}
          <article id="suppliers" className="reveal on-navy relative flex flex-col overflow-clip rounded-3xl bg-navy p-7 text-on-navy-muted sm:p-10">
            <p className="label inline-flex items-center gap-2 text-signal">
              <span className="h-2 w-2 rounded-[2px] border border-signal" aria-hidden="true" />
              For suppliers
            </p>
            <h3 className="mt-5 max-w-[26rem] font-display text-[clamp(1.75rem,1.6vw+1.1rem,2.35rem)] leading-[1.1] tracking-[-0.015em] text-on-navy">
              Find New Opportunities for Your Unsold Stock.
            </h3>
            <p className="mt-5 max-w-[30rem]">
              Tell us what inventory you need to move, your quantity, condition and commercial requirements. Our team
              will evaluate the opportunity and explore suitable buyer channels.
            </p>

            <h4 className="label mt-9 text-on-navy">Helpful to have ready</h4>
            <ul className="mt-3 grid gap-2 text-[0.92rem]">
              {supplierPrep.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-[0.6em] h-px w-3 shrink-0 bg-signal" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-10">
              <a href="#contact" data-enquiry="supplier" className="btn btn-signal">
                Discuss Your Inventory
                <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </article>

          {/* Buyers */}
          <article id="buyers" className="reveal relative flex flex-col overflow-clip rounded-3xl border border-rule bg-paper-2 p-7 sm:p-10" style={{ "--i": 1 } as React.CSSProperties}>
            <p className="label relative inline-flex items-center gap-2 text-accent">
              <span className="h-2 w-2 rounded-[2px] bg-accent" aria-hidden="true" />
              For buyers
            </p>
            <h3 className="relative mt-5 max-w-[26rem] font-display text-[clamp(1.75rem,1.6vw+1.1rem,2.35rem)] leading-[1.1] tracking-[-0.015em]">
              Source Inventory That Fits Your Requirements.
            </h3>
            <p className="mt-5 max-w-[30rem] text-muted">
              Share your preferred categories, specifications, required quantities, location and commercial
              expectations. Our team will explore relevant sourcing opportunities.
            </p>

            <h4 className="label mt-9 text-ink">Helpful to include</h4>
            <ul className="mt-3 grid gap-2 text-[0.92rem] text-ink-2">
              {buyerPrep.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-[0.6em] h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-10">
              <a href="#contact" data-enquiry="buyer" className="btn btn-primary">
                Submit a Sourcing Enquiry
                <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </article>
        </SwipeRow>

        <p className="reveal mt-6 flex items-start gap-2.5 text-[0.9rem] text-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-faint" aria-hidden="true" />
          Every enquiry is reviewed by our team. Submitting one doesn&rsquo;t guarantee availability, a buyer or a sale.
        </p>
      </div>
    </section>
  );
}
