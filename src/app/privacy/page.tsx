import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Gross-Bazaar",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This outline describes how Gross-Bazaar intends to handle information submitted through this website. It is
        not yet a final policy.
      </p>
      <h2>Information we collect</h2>
      <p>
        When you submit an enquiry we receive the details you enter, such as your name, business name, business email,
        phone number, location, preferred contact method and a description of your inventory or sourcing requirements.
      </p>
      <h2>How we use it</h2>
      <p>
        We use these details to review and respond to your enquiry. We do not publish submitted contact details or
        inventory information on this website.
      </p>
      <h2>Sharing</h2>
      <p>
        Information about an inventory opportunity is shared with prospective counterparties only as appropriate and
        with the supplier&rsquo;s authorisation, subject to the terms agreed for that opportunity.
      </p>
      <h2>Your choices</h2>
      <p>
        You may ask us to correct or delete the information you submitted by writing to{" "}
        <a href="mailto:info@grossbazaar.com" className="link">
          info@grossbazaar.com
        </a>
        .
      </p>
      <h2>To be completed</h2>
      <p>
        Data controller identity, retention periods, processors used, applicable law (including India&rsquo;s Digital
        Personal Data Protection Act, 2023) and grievance officer details.
      </p>
    </LegalPage>
  );
}
