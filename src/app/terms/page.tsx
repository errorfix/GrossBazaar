import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use | Gross-Bazaar",
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use">
      <p>This outline sets out the intended basis on which this website is provided. It is not yet final.</p>
      <h2>About this website</h2>
      <p>
        This website describes Gross-Bazaar&rsquo;s B2B inventory recovery and bulk sourcing services and lets
        businesses submit enquiries. It is not a marketplace and does not list inventory for sale.
      </p>
      <h2>No guarantee of outcome</h2>
      <p>
        Submitting an enquiry does not create an obligation on either side. Availability, buyer interest, pricing and
        transaction outcomes depend on each opportunity and the agreement of the parties involved.
      </p>
      <h2>Commercial terms</h2>
      <p>
        Any fees, confidentiality terms and responsibilities for a specific engagement will be agreed in writing before
        work proceeds.
      </p>
      <h2>To be completed</h2>
      <p>Legal entity details, governing law and jurisdiction, liability limitations and contact information.</p>
    </LegalPage>
  );
}
