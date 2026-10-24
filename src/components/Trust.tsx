import { EyeOff, FileCheck2, Lock, MessagesSquare, ShieldCheck, UserCheck } from "lucide-react";

const principles = [
  {
    icon: EyeOff,
    text: "Supplier identities and sensitive stock details are shared only as appropriate and with authorisation.",
  },
  { icon: UserCheck, text: "Buyers are screened according to the requirements of each opportunity." },
  { icon: MessagesSquare, text: "Commercial information is handled through controlled communication." },
  { icon: FileCheck2, text: "Offers, approvals and agreed terms are documented where appropriate." },
  {
    icon: ShieldCheck,
    text: "Ownership, product condition and resale authorisation should be established before a transaction proceeds.",
  },
];

const levels = [
  { name: "Anonymised brief", body: "Category, approximate quantity and region. No supplier identity." },
  { name: "Detailed lot information", body: "Shared with screened prospective buyers, with the supplier’s approval." },
  { name: "Identities and terms", body: "Introduced once both parties agree to proceed." },
];

export function Trust() {
  return (
    <section id="confidentiality" className="border-t border-rule py-20 sm:py-24">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <h2 className="h-section reveal">Commercial Opportunities. Controlled Disclosure.</h2>
          <p className="lede reveal mt-6 max-w-[34rem]" style={{ "--i": 1 } as React.CSSProperties}>
            Inventory information can be commercially sensitive. Our approach is designed so that what is shared, with
            whom and when stays under the supplier&rsquo;s control.
          </p>
          <ul className="mt-10 grid gap-5">
            {principles.map(({ icon: Icon, text }, i) => (
              <li key={text} className="reveal flex gap-4" style={{ "--i": i } as React.CSSProperties}>
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.6} aria-hidden="true" />
                <span className="text-ink-2">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <figure className="reveal rounded-3xl border border-rule bg-paper-2 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-signal">
                <Lock className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <p className="font-medium text-ink">How information is intended to be shared</p>
            </div>

            <ol className="mt-7 grid gap-3">
              {levels.map((l, i) => (
                <li
                  key={l.name}
                  className="reveal rounded-2xl border p-5"
                  style={
                    {
                      "--i": i + 1,
                      marginLeft: `${i * 1.25}rem`,
                      background: i === 2 ? "var(--color-navy)" : i === 1 ? "var(--color-paper-3)" : "var(--color-paper)",
                      borderColor: i === 2 ? "var(--color-navy)" : "var(--color-rule)",
                    } as React.CSSProperties
                  }
                >
                  <p className={`label ${i === 2 ? "text-signal" : "text-faint"}`}>Level {i + 1}</p>
                  <p className={`mt-1.5 font-medium ${i === 2 ? "text-on-navy" : "text-ink"}`}>{l.name}</p>
                  <p className={`mt-1 text-[0.88rem] ${i === 2 ? "text-on-navy-muted" : "text-muted"}`}>{l.body}</p>
                </li>
              ))}
            </ol>
            <figcaption className="mt-6 text-[0.82rem] text-muted">
              Indicative approach. Specific disclosure terms are agreed for each opportunity.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
