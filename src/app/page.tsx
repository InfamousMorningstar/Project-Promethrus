import { Contact } from "@/components/contact";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { NeverStuck } from "@/components/never-stuck";
import { Pricing } from "@/components/pricing";
import { Process } from "@/components/process";
import { ProofStrip } from "@/components/proof-strip";
import { Services } from "@/components/services";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Studio } from "@/components/studio";
import { Testimonials } from "@/components/testimonials";
import { Work } from "@/components/work";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <ProofStrip />
        <Manifesto />
        <Services />
        <Work />
        <Testimonials />
        <Process />
        <Pricing />
        <Studio />
        <NeverStuck />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
