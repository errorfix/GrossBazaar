import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { industries, siteConfig } from "@/config/site";
import { GBLockup } from "./GBLogo";

const pending = "To be confirmed before launch";

export function Footer() {
  const year = new Date().getFullYear();
  const { legal, contact } = siteConfig;

  return (
    <footer className="on-navy relative overflow-clip bg-navy pt-20 text-on-navy-muted sm:pt-28">
      <div className="wrap">
        {/* Closing CTA */}
        <div className="grid gap-8 border-b border-navy-rule pb-16 lg:grid-cols-12 lg:items-end">
          <p className="font-display text-[clamp(2rem,3vw+1rem,3.4rem)] leading-[1.08] tracking-[-0.02em] text-on-navy lg:col-span-8">
            Have inventory to move, or stock to source?
          </p>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <a href="#contact" data-enquiry="supplier" className="btn btn-signal">
              Discuss Your Inventory
              <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </a>
            <a href="#contact" data-enquiry="buyer" className="btn btn-ghost-navy">
              Source Bulk Inventory
            </a>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="max-w-[22rem] text-[0.92rem]">
              A trusted business network for inventory recovery and bulk sourcing, connecting usable surplus with
              relevant demand through a confidential, managed process.
            </p>
            <a href="#contact" className="btn btn-ghost-navy mt-6 h-10 min-h-0 px-4 text-[0.88rem]">
              Partner With Gross-Bazaar
            </a>
          </div>

          <nav aria-label="Suppliers" className="lg:col-span-2 lg:col-start-6">
            <h2 className="label text-on-navy">Suppliers</h2>
            <ul className="mt-4 grid gap-2.5 text-[0.92rem]">
              <li><a href="#suppliers" className="hover:text-on-navy">Working with us</a></li>
              <li><a href="#contact" data-enquiry="supplier" className="hover:text-on-navy">Discuss your inventory</a></li>
              <li><a href="#confidentiality" className="hover:text-on-navy">Confidentiality</a></li>
              <li><a href="#how-it-works" className="hover:text-on-navy">How it works</a></li>
            </ul>
          </nav>

          <nav aria-label="Buyers" className="lg:col-span-2">
            <h2 className="label text-on-navy">Buyers</h2>
            <ul className="mt-4 grid gap-2.5 text-[0.92rem]">
              <li><a href="#buyers" className="hover:text-on-navy">Sourcing with us</a></li>
              <li><a href="#contact" data-enquiry="buyer" className="hover:text-on-navy">Sourcing enquiry</a></li>
              <li><a href="#faq" className="hover:text-on-navy">FAQ</a></li>
            </ul>
          </nav>

          <nav aria-label="Industries" className="lg:col-span-3">
            <h2 className="label text-on-navy">Industries</h2>
            <ul className="mt-4 grid gap-2.5 text-[0.92rem]">
              {industries.map((i) => (
                <li key={i.slug}>
                  <a href="#industries" className="hover:text-on-navy">
                    {i.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Legal */}
        <div className="grid gap-4 border-t border-navy-rule py-8 text-[0.82rem] lg:grid-cols-2">
          <dl className="grid gap-1">
            <div className="flex flex-wrap gap-x-2">
              <dt>Business:</dt>
              <dd className={legal.entityName ? "text-on-navy" : "italic opacity-70"}>{legal.entityName ?? pending}</dd>
            </div>
            {/* Optional rows appear only once their value is filled in src/config/site.ts */}
            {legal.incubatedAt && (
              <div className="flex flex-wrap gap-x-2">
                <dt>Incubated at:</dt>
                <dd className="text-on-navy">{legal.incubatedAt}</dd>
              </div>
            )}
            {legal.registeredOffice && (
              <div className="flex flex-wrap gap-x-2">
                <dt>Registered office:</dt>
                <dd className="text-on-navy">{legal.registeredOffice}</dd>
              </div>
            )}
            {legal.udyamnumber && (
              <div className="flex flex-wrap gap-x-2">
                <dt>Udyam Reg. No.:</dt>
                <dd className="text-on-navy">{legal.udyamnumber}</dd>
              </div>
            )}
            {legal.cin && (
              <div className="flex flex-wrap gap-x-2">
                <dt>CIN:</dt>
                <dd className="text-on-navy">{legal.cin}</dd>
              </div>
            )}
            {contact.email && (
              <div className="flex flex-wrap gap-x-2">
                <dt>Contact:</dt>
                <dd>
                  <a href={`mailto:${contact.email}`} className="text-on-navy hover:underline">
                    {contact.email}
                  </a>
                  {contact.phone && (
                    <>
                      {" · "}
                      <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="whitespace-nowrap text-on-navy hover:underline">
                        {contact.phone}
                      </a>
                    </>
                  )}
                </dd>
              </div>
            )}
          </dl>
          <div className="flex flex-wrap items-start gap-x-6 gap-y-2 lg:justify-end">
            <Link href="/privacy" className="hover:text-on-navy">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-on-navy">Terms of Use</Link>
            <span>© {year} Gross-Bazaar. All rights reserved.</span>
          </div>
        </div>
      </div>

      {/* Ending panel: the full GB brand lockup closes the page */}
      <div className="border-t border-navy-rule">
        <div className="wrap reveal flex justify-center py-14 sm:py-20">
          <GBLockup onDark className="text-[clamp(1.75rem,7vw,6.25rem)]" />
        </div>
      </div>
    </footer>
  );
}
