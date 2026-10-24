"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "What is Gross-Bazaar?",
    a: "Gross-Bazaar is a B2B inventory recovery and bulk sourcing intermediary that helps businesses explore new commercial opportunities for usable surplus inventory.",
  },
  {
    q: "Does Gross-Bazaar purchase the inventory?",
    a: "The initial business model focuses on facilitating transactions between suppliers and buyers rather than purchasing or holding inventory itself.",
  },
  {
    q: "Will my inventory be publicly listed?",
    a: "No public inventory catalogue is part of this website. Opportunities may be discussed and shared with appropriate prospective buyers through a managed process, subject to supplier authorisation and agreed confidentiality requirements.",
  },
  {
    q: "Which industries do you serve?",
    a: "Gross-Bazaar intends to expand across multiple inventory categories, beginning with selected sectors where suitable supply and demand can be established.",
  },
  {
    q: "How does Gross-Bazaar earn revenue?",
    a: "Depending on the engagement, revenue may come from an agreed transaction success fee or service fee. The applicable commercial terms should be confirmed before proceeding.",
  },
  {
    q: "Can buyers submit specific requirements?",
    a: "Yes. Buyers can describe their required category, specifications, quantity, location and commercial expectations for the team to review.",
  },
  {
    q: "Does Gross-Bazaar guarantee a sale?",
    a: "No. Opportunities depend on inventory suitability, buyer demand, pricing, transaction terms and other commercial factors.",
  },
  {
    q: "What should I prepare before getting in touch?",
    a: "A short summary is enough to start: the category, approximate quantity, condition, location and any restrictions on how or where the stock can be resold. Please don’t send confidential files through the website. If the opportunity looks suitable, we’ll agree how detailed information should be shared.",
  },
  {
    q: "Can I set limits on where my stock is resold?",
    a: "You can tell us about restrictions such as excluded regions, sales channels or de-branding requirements. Whether a particular restriction can be accommodated depends on the opportunity, and any agreed conditions should be documented between the parties.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="faq" className="border-t border-rule py-20 sm:py-24">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <h2 className="h-section reveal">Questions, Answered Plainly.</h2>
          <p className="reveal mt-6 text-muted" style={{ "--i": 1 } as React.CSSProperties}>
            Can&rsquo;t find what you need?{" "}
            <a href="#contact" className="link">
              Ask our team directly
            </a>
            .
          </p>
        </div>

        <div className="reveal lg:col-span-7 lg:col-start-6">
          <ul className="border-t border-rule">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              const btnId = `${base}-q${i}`;
              const panelId = `${base}-a${i}`;
              return (
                <li key={item.q} className="border-b border-rule">
                  <h3>
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-center justify-between gap-6 py-5 text-left text-[1.05rem] font-medium text-ink transition-colors hover:text-accent sm:text-[1.1rem]"
                    >
                      {item.q}
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rule transition-colors group-hover:border-accent">
                        <Plus className="acc-icon h-4 w-4" aria-hidden="true" />
                      </span>
                    </button>
                  </h3>
                  <div id={panelId} role="region" aria-labelledby={btnId} className="acc-panel" data-open={isOpen}>
                    <div inert={!isOpen}>
                      <p className="max-w-[40rem] pb-6 pr-12 text-muted">{item.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
