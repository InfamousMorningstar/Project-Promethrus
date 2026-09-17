import { Contact } from "@/components/contact";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { Process } from "@/components/process";
import { ProofStrip } from "@/components/proof-strip";
import { Services } from "@/components/services";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Studio } from "@/components/studio";
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
        <Process />
        <Studio />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
