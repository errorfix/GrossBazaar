/**
 * Central site configuration.
 *
 * Contact and business details shown across the site. Optional `null` values
 * are simply hidden; required ones (email, phone, business name) render a
 * visible "to be confirmed" marker if cleared, so nothing invented is shown.
 */
export const siteConfig = {
  name: "Gross-Bazaar",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.grossbazaar.com", // TODO: confirm production domain
  title: "Gross-Bazaar | B2B Inventory Recovery & Bulk Sourcing",
  description:
    "Gross-Bazaar helps businesses explore new opportunities for usable surplus inventory through confidential B2B buyer connections and managed bulk sourcing.",

  contact: {
    email: "info@grossbazaar.com" as string | null,
    phone: "+91 78276 24501" as string | null,
    whatsapp: "917827624501" as string | null, // digits only, with country code (used for wa.me links)
    hours: null as string | null, // optional: e.g. "Mon–Sat, 10:00–18:00 IST"
  },

  legal: {
    entityName: "Gross Bazaar" as string | null,
    incubatedAt: "Lingaya's Vidyapeeth" as string | null,
    registeredOffice: null as string | null, // optional: registered office address (row hidden while null)
    udyamnumber: null as string | null, // TODO: Udyam Registration Number once issued (row hidden while null)
    cin: null as string | null, // CIN / LLPIN, if the business is incorporated later (row hidden while null)
  },

  /**
   * Where enquiry forms POST their JSON payload.
   * Defaults to FormSubmit for info@grossbazaar.com, or can be overridden via NEXT_PUBLIC_ENQUIRY_ENDPOINT.
   */
  enquiryEndpoint:
    process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT || "https://formsubmit.co/ajax/info@grossbazaar.com",
} as const;

export const navLinks = [
  { label: "Home", href: "#top" },
  { label: "For Suppliers", href: "#suppliers" },
  { label: "For Buyers", href: "#buyers" },
  { label: "Industries", href: "#industries" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const industries = [
  {
    slug: "apparel",
    title: "Apparel & Textiles",
    body: "Unsold seasonal collections, excess garments, fabric and discontinued designs.",
  },
  {
    slug: "industrial",
    title: "Industrial Materials",
    body: "Excess raw materials, components, packaging and eligible manufacturing stock.",
  },
  {
    slug: "it",
    title: "IT & Electronics",
    body: "Usable business equipment, eligible surplus devices and equipment replacement stock.",
  },
  {
    slug: "retail",
    title: "Retail & Consumer Goods",
    body: "Excess merchandise, discontinued products and eligible bulk inventory.",
  },
  {
    slug: "office",
    title: "Office & Commercial Assets",
    body: "Usable furniture, fixtures and commercial equipment.",
  },
  {
    slug: "institutional",
    title: "Institutional & Social Impact",
    body: "Suitable reusable goods for eligible educational institutions, NGOs and other organisations.",
  },
] as const;
