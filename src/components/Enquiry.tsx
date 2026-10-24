"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CircleAlert, CircleCheck, FlaskConical, Loader2, Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { industries, siteConfig } from "@/config/site";

type EnquiryType = "supplier" | "buyer";
type Status = "idle" | "submitting" | "success" | "demo" | "error";
type Values = Record<string, string>;

const CATEGORY_OPTIONS = [...industries.map((i) => i.title), "Other"];
const CONTACT_METHODS = ["Email", "Phone call", "WhatsApp"];
const BUYER_TYPES = [
  "Wholesale or distribution",
  "Retail or resale",
  "Refurbishment",
  "Manufacturing input",
  "School, NGO or institution",
  "Other",
];
const MAX_DESC = 1000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{8,18}$/;

type FieldRule = { required?: boolean; email?: boolean; phone?: boolean; max?: number; label: string };

function rulesFor(type: EnquiryType, v: Values): Record<string, FieldRule> {
  const common: Record<string, FieldRule> = {
    fullName: { required: true, label: "Full name" },
    businessName: { required: true, label: "Business name" },
    email: { required: true, email: true, label: "Business email" },
    phone: { required: true, phone: true, label: "Phone number" },
    contactMethod: { required: true, label: "Preferred contact method" },
    consent: { required: true, label: "Consent" },
  };
  if (type === "supplier") {
    return {
      ...common,
      industry: { required: true, label: "Industry" },
      ...(v.industry === "Other" ? { industryOther: { required: true, label: "Industry" } } : {}),
      category: { required: true, label: "Inventory category" },
      quantity: { required: true, label: "Approximate quantity or lot size" },
      location: { required: true, label: "Location" },
      description: { required: true, max: MAX_DESC, label: "Brief description" },
    };
  }
  return {
    ...common,
    requiredCategory: { required: true, label: "Required category" },
    ...(v.requiredCategory === "Other" ? { requiredCategoryOther: { required: true, label: "Category" } } : {}),
    requiredQuantity: { required: true, label: "Required quantity" },
    location: { required: true, label: "Delivery location" },
    specs: { required: true, max: MAX_DESC, label: "Specifications or sourcing requirements" },
  };
}

function validate(rule: FieldRule, value = ""): string | null {
  const v = value.trim();
  if (rule.required && !v) {
    if (rule.label === "Consent") return "Please confirm we may contact you about this enquiry.";
    if (rule.label === "Preferred contact method") return "Choose how you'd like us to reach you.";
    return `Please enter your ${rule.label.toLowerCase()}.`;
  }
  if (v && rule.email && !EMAIL_RE.test(v)) return "Enter an email address like name@company.com.";
  if (v && rule.phone && !PHONE_RE.test(v)) return "Enter a phone number with 8–15 digits, e.g. +91 98765 43210.";
  if (rule.max && v.length > rule.max) return `Please keep this under ${rule.max} characters.`;
  return null;
}

/* ─── Field primitives ─────────────────────────────────────────────────── */

function Field({
  name,
  label,
  required,
  hint,
  error,
  className = "",
  children,
}: {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string | null;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={`f-${name}`} className="field-label">
        {label}
        {required ? (
          <span className="text-error" aria-hidden="true">
            {" "}*
          </span>
        ) : (
          <span className="font-normal text-faint"> (optional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`f-${name}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`f-${name}-error`} className="field-error flex items-center gap-1.5">
          <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (name: string, hint: boolean, error?: string | null) =>
  [error ? `f-${name}-error` : hint ? `f-${name}-hint` : null].filter(Boolean).join(" ") || undefined;

/* ─── Component ────────────────────────────────────────────────────────── */

export function Enquiry() {
  const [type, setType] = useState<EnquiryType>("supplier");
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [summary, setSummary] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const tabRefs = useRef<Record<EnquiryType, HTMLButtonElement | null>>({ supplier: null, buyer: null });

  // Any CTA on the page with data-enquiry="supplier|buyer" opens the matching form.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-enquiry]");
      const t = el?.dataset.enquiry;
      if (t === "supplier" || t === "buyer") {
        setType(t);
        setStatus((s) => (s === "success" || s === "demo" ? "idle" : s));
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const rules = rulesFor(type, values);

  const set = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: rules[name] ? validate(rules[name], value) : null }));
  };
  const blur = (name: string) => {
    const rule = rules[name];
    if (rule && values[name]) setErrors((prev) => ({ ...prev, [name]: validate(rule, values[name]) }));
  };

  const switchType = (t: EnquiryType) => {
    setType(t);
    setErrors({});
    setSummary("");
    if (status !== "submitting") setStatus("idle");
  };

  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next: EnquiryType = type === "supplier" ? "buyer" : "supplier";
      switchType(next);
      tabRefs.current[next]?.focus();
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const nextErrors: Record<string, string | null> = {};
    for (const [name, rule] of Object.entries(rules)) nextErrors[name] = validate(rule, values[name]);
    setErrors(nextErrors);
    const invalid = Object.keys(rules).filter((n) => nextErrors[n]);
    if (invalid.length) {
      setSummary(`Please check ${invalid.length} ${invalid.length === 1 ? "field" : "fields"} highlighted below.`);
      const first = formRef.current?.querySelector<HTMLElement>(`[name="${invalid[0]}"]`);
      first?.focus();
      return;
    }
    setSummary("");

    // Honeypot: real people never see or fill this field.
    if (values.website) {
      setStatus("success");
      return;
    }

    setStatus("submitting");
    const payload = Object.fromEntries(
      Object.keys(rules)
        .concat(type === "supplier" ? ["bestTime"] : ["bestTime", "buyerType", "budget"])
        .filter((k) => values[k])
        .map((k) => [k, values[k].trim()]),
    );

    if (!siteConfig.enquiryEndpoint) {
      await new Promise((r) => setTimeout(r, 700));
      setStatus("demo");
      return;
    }
    try {
      const res = await fetch(siteConfig.enquiryEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ enquiryType: type, ...payload, submittedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      setValues((prev) => ({ fullName: prev.fullName, businessName: prev.businessName, email: prev.email, phone: prev.phone }));
    } catch {
      setStatus("error");
    }
  };

  const input = (name: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, hint?: string) => (
    <input
      id={`f-${name}`}
      name={name}
      className="field-input"
      value={values[name] ?? ""}
      onChange={(e) => set(name, e.target.value)}
      onBlur={() => blur(name)}
      aria-invalid={errors[name] ? true : undefined}
      aria-required={rules[name]?.required || undefined}
      aria-describedby={describedBy(name, !!hint, errors[name])}
      disabled={status === "submitting"}
      {...props}
    />
  );

  const select = (name: string, options: string[], placeholder: string) => (
    <select
      id={`f-${name}`}
      name={name}
      className="field-input"
      value={values[name] ?? ""}
      onChange={(e) => set(name, e.target.value)}
      onBlur={() => blur(name)}
      aria-invalid={errors[name] ? true : undefined}
      aria-required={rules[name]?.required || undefined}
      aria-describedby={describedBy(name, false, errors[name])}
      disabled={status === "submitting"}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );

  const textarea = (name: string, placeholder: string, hint: string) => (
    <>
      <textarea
        id={`f-${name}`}
        name={name}
        className="field-input"
        placeholder={placeholder}
        value={values[name] ?? ""}
        maxLength={MAX_DESC + 200}
        onChange={(e) => set(name, e.target.value)}
        onBlur={() => blur(name)}
        aria-invalid={errors[name] ? true : undefined}
        aria-required
        aria-describedby={describedBy(name, true, errors[name])}
        disabled={status === "submitting"}
      />
      <p className="mt-1 text-right text-xs tabular text-faint" aria-hidden="true">
        {(values[name] ?? "").length} / {MAX_DESC}
      </p>
    </>
  );

  const wantsCall = values.contactMethod === "Phone call" || values.contactMethod === "WhatsApp";
  const done = status === "success" || status === "demo";

  return (
    <section id="contact" className="border-t border-rule bg-paper-2 py-20 sm:py-24">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="h-section reveal lg:col-span-7">Let&rsquo;s Find the Right Opportunity.</h2>
          <p className="reveal text-muted lg:col-span-4 lg:col-start-9" style={{ "--i": 1 } as React.CSSProperties}>
            Whether you&rsquo;re looking to recover value from existing inventory or source products in bulk, start a
            conversation with our team.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          {/* ── Form card ── */}
          <div className="reveal rounded-3xl border border-rule bg-paper p-5 shadow-[0_1px_2px_oklch(21%_0.04_250/0.04)] sm:p-9 lg:col-span-8">
            <div
              role="tablist"
              aria-label="Enquiry type"
              className="grid grid-cols-2 gap-1 rounded-full border border-rule bg-paper-2 p-1"
              onKeyDown={onTabKey}
            >
              {(
                [
                  ["supplier", "I have inventory"],
                  ["buyer", "I want to source"],
                ] as const
              ).map(([t, label]) => (
                <button
                  key={t}
                  ref={(el) => {
                    tabRefs.current[t] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`tab-${t}`}
                  aria-selected={type === t}
                  aria-controls="enquiry-panel"
                  tabIndex={type === t ? 0 : -1}
                  onClick={() => switchType(t)}
                  className={`min-h-11 truncate rounded-full px-3 text-[0.9rem] font-medium transition-colors duration-200 ${
                    type === t ? "bg-ink text-paper" : "text-muted hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div id="enquiry-panel" role="tabpanel" aria-labelledby={`tab-${type}`} className="mt-8">
              {done ? (
                <div role="status" className="py-6">
                  {status === "demo" ? (
                    <div className="rounded-2xl border border-dashed border-signal-deep bg-signal-soft p-6">
                      <p className="flex items-center gap-2 font-medium text-ink">
                        <FlaskConical className="h-5 w-5 text-signal-deep" aria-hidden="true" />
                        Demonstration mode: this enquiry was not sent
                      </p>
                      <p className="mt-2 text-[0.93rem] text-ink-2">
                        The form isn&rsquo;t connected to a delivery service yet, so your details were checked in your
                        browser but not transmitted or stored. Set <code className="font-mono text-[0.85em]">NEXT_PUBLIC_ENQUIRY_ENDPOINT</code> to go live.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-success/30 bg-success-soft p-6">
                      <p className="flex items-center gap-2 font-medium text-ink">
                        <CircleCheck className="h-5 w-5 text-success" aria-hidden="true" />
                        Thank you. Your enquiry has been sent.
                      </p>
                      <p className="mt-2 text-[0.93rem] text-ink-2">
                        Our team will review it and get in touch using your preferred contact method.
                      </p>
                    </div>
                  )}
                  <button type="button" className="btn btn-outline mt-6" onClick={() => setStatus("idle")}>
                    Start another enquiry
                  </button>
                </div>
              ) : (
                <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby="form-summary">
                  <p id="form-summary" aria-live="assertive" className={summary ? "mb-6 flex items-center gap-2 rounded-xl bg-error-soft px-4 py-3 text-[0.9rem] text-error" : "sr-only"}>
                    {summary && <CircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />}
                    {summary}
                  </p>

                  <fieldset className="grid gap-5 sm:grid-cols-2" disabled={status === "submitting"}>
                    <legend className="sr-only">{type === "supplier" ? "Supplier enquiry" : "Buyer enquiry"}</legend>

                    <Field name="fullName" label="Full name" required error={errors.fullName}>
                      {input("fullName", { autoComplete: "name" })}
                    </Field>
                    <Field name="businessName" label="Business name" required error={errors.businessName}>
                      {input("businessName", { autoComplete: "organization" })}
                    </Field>
                    <Field name="email" label="Business email" required error={errors.email}>
                      {input("email", { type: "email", autoComplete: "email", inputMode: "email", placeholder: "name@company.com" })}
                    </Field>
                    <Field name="phone" label="Phone number" required error={errors.phone}>
                      {input("phone", { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "+91" })}
                    </Field>

                    {type === "supplier" ? (
                      <>
                        <Field name="industry" label="Industry" required error={errors.industry}>
                          {select("industry", CATEGORY_OPTIONS, "Select an industry")}
                        </Field>
                        {values.industry === "Other" ? (
                          <Field name="industryOther" label="Which industry?" required error={errors.industryOther}>
                            {input("industryOther")}
                          </Field>
                        ) : (
                          <div className="hidden sm:block" />
                        )}
                        <Field name="category" label="Inventory category" required error={errors.category}>
                          {input("category", { placeholder: "e.g. cotton shirts, steel fasteners" })}
                        </Field>
                        <Field name="quantity" label="Approximate quantity or lot size" required error={errors.quantity}>
                          {input("quantity", { placeholder: "e.g. units, cartons, pallets" })}
                        </Field>
                        <Field name="location" label="Location of stock" required error={errors.location} className="sm:col-span-2">
                          {input("location", { autoComplete: "address-level2", placeholder: "City, State" })}
                        </Field>
                        <Field
                          name="description"
                          label="Brief description"
                          required
                          hint="Condition, why it's available, and any resale restrictions. Please don't include confidential documents."
                          error={errors.description}
                          className="sm:col-span-2"
                        >
                          {textarea("description", "Tell us about the inventory", "")}
                        </Field>
                      </>
                    ) : (
                      <>
                        <Field name="buyerType" label="Your type of business" error={errors.buyerType}>
                          {select("buyerType", BUYER_TYPES, "Select one")}
                        </Field>
                        <Field name="requiredCategory" label="Required category" required error={errors.requiredCategory}>
                          {select("requiredCategory", CATEGORY_OPTIONS, "Select a category")}
                        </Field>
                        {values.requiredCategory === "Other" && (
                          <Field name="requiredCategoryOther" label="Which category?" required error={errors.requiredCategoryOther} className="sm:col-span-2">
                            {input("requiredCategoryOther")}
                          </Field>
                        )}
                        <Field name="requiredQuantity" label="Required quantity" required error={errors.requiredQuantity}>
                          {input("requiredQuantity", { placeholder: "Per order, and how often" })}
                        </Field>
                        <Field name="location" label="Delivery location" required error={errors.location}>
                          {input("location", { autoComplete: "address-level2", placeholder: "City, State" })}
                        </Field>
                        <Field
                          name="specs"
                          label="Product specifications or sourcing requirements"
                          required
                          hint="Grades, sizes, acceptable condition, brands to avoid, documentation you need."
                          error={errors.specs}
                          className="sm:col-span-2"
                        >
                          {textarea("specs", "Describe what you're looking for", "")}
                        </Field>
                        <Field name="budget" label="Budget or target price" error={errors.budget} className="sm:col-span-2">
                          {input("budget", { placeholder: "e.g. per unit or per lot" })}
                        </Field>
                      </>
                    )}

                    <fieldset className="sm:col-span-2" aria-describedby={errors.contactMethod ? "f-contactMethod-error" : undefined}>
                      <legend className="field-label">
                        Preferred contact method<span className="text-error" aria-hidden="true"> *</span>
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {CONTACT_METHODS.map((m) => (
                          <label key={m} className="choice">
                            <input
                              type="radio"
                              name="contactMethod"
                              value={m}
                              checked={values.contactMethod === m}
                              onChange={() => set("contactMethod", m)}
                              className="sr-only"
                            />
                            {m}
                          </label>
                        ))}
                      </div>
                      {errors.contactMethod && (
                        <p id="f-contactMethod-error" className="field-error flex items-center gap-1.5">
                          <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" />
                          {errors.contactMethod}
                        </p>
                      )}
                    </fieldset>

                    {wantsCall && (
                      <Field name="bestTime" label="Best time to reach you" className="sm:col-span-2">
                        {select("bestTime", ["Morning (10–1)", "Afternoon (1–4)", "Evening (4–7)"], "Any time")}
                      </Field>
                    )}

                    {/* Honeypot */}
                    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                      <label htmlFor="f-website">Website</label>
                      <input id="f-website" name="website" tabIndex={-1} autoComplete="off" value={values.website ?? ""} onChange={(e) => set("website", e.target.value)} />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="flex cursor-pointer items-start gap-3 text-[0.9rem] text-ink-2">
                        <input
                          type="checkbox"
                          name="consent"
                          checked={values.consent === "yes"}
                          onChange={(e) => set("consent", e.target.checked ? "yes" : "")}
                          aria-invalid={errors.consent ? true : undefined}
                          aria-describedby={errors.consent ? "f-consent-error" : "f-consent-note"}
                          className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent)]"
                        />
                        <span>
                          I agree that Gross-Bazaar may contact me about this enquiry.<span className="text-error" aria-hidden="true"> *</span>
                        </span>
                      </label>
                      {errors.consent ? (
                        <p id="f-consent-error" className="field-error flex items-center gap-1.5 pl-7">
                          <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" />
                          {errors.consent}
                        </p>
                      ) : (
                        <p id="f-consent-note" className="field-hint pl-7">
                          We use these details only to respond to your enquiry and never publish them. See our{" "}
                          <Link href="/privacy" className="link">
                            Privacy Policy
                          </Link>
                          .
                        </p>
                      )}
                    </div>
                  </fieldset>

                  {status === "error" && (
                    <p role="alert" className="mt-6 flex items-start gap-2 rounded-xl bg-error-soft px-4 py-3 text-[0.9rem] text-error">
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      We couldn&rsquo;t send your enquiry. Your details are still here, so please try again in a moment.
                    </p>
                  )}

                  <div className="mt-8 flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-faint">
                      {siteConfig.enquiryEndpoint ? "Fields marked * are required." : "Demonstration mode: submissions are not sent."}
                    </p>
                    <button type="submit" className="btn btn-primary w-full sm:w-auto" aria-disabled={status === "submitting"}>
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Sending…
                        </>
                      ) : (
                        <>
                          {type === "supplier" ? "Send inventory enquiry" : "Send sourcing enquiry"}
                          <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ── Side panel ── */}
          <aside className="grid content-start gap-6 lg:col-span-4">
            <div className="reveal rounded-3xl bg-navy p-6 text-on-navy-muted sm:p-8 on-navy" style={{ "--i": 1 } as React.CSSProperties}>
              <h3 className="font-display text-[1.4rem] text-on-navy">What happens next</h3>
              <ol className="mt-5 grid gap-4 text-[0.92rem]">
                {[
                  "We read every enquiry ourselves.",
                  "If it looks like a fit, we contact you to understand the details.",
                  "Where suitable, we explore the opportunity under agreed confidentiality.",
                ].map((s, i) => (
                  <li key={s} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2">
                    <span className="label tabular text-signal">{String(i + 1).padStart(2, "0")}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>

            <div className="reveal rounded-3xl border border-rule bg-paper p-6 sm:p-8" style={{ "--i": 2 } as React.CSSProperties}>
              <h3 className="font-medium text-ink">Prefer to reach us directly?</h3>
              <ul className="mt-4 grid gap-3 text-[0.92rem]">
                <ContactRow icon={Mail} label="Email" value={siteConfig.contact.email} href={siteConfig.contact.email ? `mailto:${siteConfig.contact.email}` : undefined} />
                <ContactRow icon={Phone} label="Phone" value={siteConfig.contact.phone} href={siteConfig.contact.phone ? `tel:${siteConfig.contact.phone.replace(/\s/g, "")}` : undefined} />
                <ContactRow
                  icon={MessageCircle}
                  label="WhatsApp"
                  value={siteConfig.contact.whatsapp ? `+${siteConfig.contact.whatsapp.slice(0, 2)} ${siteConfig.contact.whatsapp.slice(2, 7)} ${siteConfig.contact.whatsapp.slice(7)}` : null}
                  href={
                    siteConfig.contact.whatsapp
                      ? `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent("Hello Gross-Bazaar, I'd like to discuss an inventory or sourcing requirement.")}`
                      : undefined
                  }
                />
              </ul>
              <p className="mt-6 flex items-start gap-2.5 border-t border-rule pt-5 text-[0.85rem] text-muted">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                Please don&rsquo;t upload confidential inventory files here. Once we&rsquo;ve spoken, we&rsquo;ll agree how
                detailed information should be shared.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string | null;
  href?: string;
}) {
  return (
    <li className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
      <span className="w-20 shrink-0 text-muted">{label}</span>
      {value && href ? (
        <a href={href} className="link truncate">
          {value}
        </a>
      ) : (
        <span className="truncate rounded-md border border-dashed border-rule-strong px-2 py-0.5 text-[0.8rem] text-faint" title="Placeholder: add the verified value in src/config/site.ts">
          To be confirmed
        </span>
      )}
    </li>
  );
}
