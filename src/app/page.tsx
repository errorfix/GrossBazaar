import { Loader } from "@/components/Loader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ImpactScene } from "@/components/ImpactScene";
import { Audiences } from "@/components/Audiences";
import { Industries } from "@/components/Industries";
import { Process } from "@/components/Process";
import { Trust } from "@/components/Trust";
import { About } from "@/components/About";
import { Faq } from "@/components/Faq";
import { Enquiry } from "@/components/Enquiry";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { siteConfig } from "@/config/site";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  areaServed: "IN",
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <Loader />
      <SmoothScroll />
      <Nav />
      <main id="main">
        <Hero />
        <ImpactScene />
        <Audiences />
        <Process />
        <Industries />
        <Trust />
        <About />
        <Faq />
        <Enquiry />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
