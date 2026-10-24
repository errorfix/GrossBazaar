const approach = [
  "Direct business conversations",
  "Understanding local supply and demand",
  "Reliable supplier and buyer relationships",
  "Categories expanded progressively",
  "Processes shaped by real market needs",
];

export function About() {
  return (
    <section id="about" className="border-t border-rule bg-paper-2 py-20 sm:py-24">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-10">
        <h2 className="h-section reveal lg:col-span-5">Building Better Connections Between Supply and Demand.</h2>

        <div className="lg:col-span-6 lg:col-start-7">
          <blockquote className="reveal border-l-2 border-signal pl-6 font-display text-[clamp(1.3rem,1vw+1rem,1.6rem)] leading-snug text-ink">
            Inventory that no longer fits one business&rsquo;s immediate requirements may still serve another.
          </blockquote>
          <p className="reveal mt-6 text-muted" style={{ "--i": 1 } as React.CSSProperties}>
            Gross-Bazaar is being developed around that simple commercial principle. We work to connect surplus supply
            with relevant demand through direct relationships, category understanding and a managed sourcing process.
          </p>
          <ul className="reveal mt-6 flex flex-wrap gap-2" style={{ "--i": 2 } as React.CSSProperties} aria-label="How we're starting">
            {approach.map((a) => (
              <li key={a} className="rounded-full border border-rule bg-paper px-3.5 py-1.5 text-[0.85rem] text-ink-2">
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
