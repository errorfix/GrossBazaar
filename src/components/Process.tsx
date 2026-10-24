import { SwipeRow } from "./SwipeRow";
import { ArrowRight, ClipboardList, EyeOff, Handshake, SearchCheck } from "lucide-react";

/** How it works + what Gross-Bazaar does, in one sequence: each step names the capability behind it. */
const steps = [
  {
    title: "Start a Conversation",
    body: "Share your inventory or bulk sourcing requirements.",
    icon: ClipboardList,
    capability: "Inventory assessment",
    detail: "Stock, quantity, condition, commercial restrictions and seller expectations.",
  },
  {
    title: "Understand the Opportunity",
    body: "The team reviews the requirements, suitability and commercial constraints.",
    icon: SearchCheck,
    capability: "Buyer discovery",
    detail: "Relevant buyers by specification, quantity, geography and sourcing need.",
  },
  {
    title: "Connect the Right Parties",
    body: "Where a suitable opportunity exists, we coordinate confidential introductions and discussions.",
    icon: EyeOff,
    capability: "Confidential matching",
    detail: "Offers and negotiation with controlled disclosure of sensitive details.",
  },
  {
    title: "Move Toward a Transaction",
    body: "The parties agree on pricing, terms, logistics and completion arrangements.",
    icon: Handshake,
    capability: "Transaction coordination",
    detail: "Communication, documentation and agreed transaction steps.",
  },
];

export function Process() {
  return (
    <section id="how-it-works" className="border-t border-rule py-20 sm:py-24">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="h-section reveal lg:col-span-7">From Inventory Enquiry to Commercial Opportunity.</h2>
          <p className="reveal text-muted lg:col-span-4 lg:col-start-9" style={{ "--i": 1 } as React.CSSProperties}>
            A managed, confidential process. Gross-Bazaar works as the intermediary between the business holding the
            stock and the businesses that can use it.
          </p>
        </div>

        <div className="relative mt-14">
          <div data-observe className="process-track absolute left-0 right-0 top-[7px] hidden h-px bg-rule lg:block">
            <span className="absolute inset-0 bg-accent" />
          </div>
          <SwipeRow as="ol" className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6" label="Process steps">
            {steps.map(({ title, body, icon: Icon, capability, detail }, i) => (
              <li key={title} className="reveal flex flex-col" style={{ "--i": i * 2 } as React.CSSProperties}>
                <span className="hidden h-[15px] w-[15px] rounded-[3px] border-2 border-accent bg-paper lg:block" aria-hidden="true" />
                <div className="flex flex-1 flex-col rounded-3xl border border-rule bg-paper p-6 lg:mt-6">
                  <p className="label text-accent">Step {i + 1}</p>
                  <h3 className="mt-2.5 font-display text-[1.45rem] leading-[1.15] tracking-[-0.01em]">{title}</h3>
                  <p className="mt-2 text-[0.93rem] text-muted">{body}</p>
                  <div className="mt-auto pt-6">
                    <div className="border-t border-dashed border-rule pt-4">
                      <p className="flex items-center gap-2 text-[0.86rem] font-medium text-ink">
                        <Icon className="h-4 w-4 text-accent" strokeWidth={1.7} aria-hidden="true" />
                        {capability}
                      </p>
                      <p className="mt-1 text-[0.82rem] text-muted">{detail}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </SwipeRow>
        </div>

        <div className="reveal mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[44rem] text-[0.88rem] text-muted">
            Gross-Bazaar facilitates commercial connections. The scope of each engagement depends on the category and
            agreed terms; transactions, availability and outcomes depend on the parties&rsquo; agreement.
          </p>
          <a href="#contact" className="btn btn-outline shrink-0">
            Start a conversation
            <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
