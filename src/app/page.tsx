import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/hero";
import { Pricing } from "@/components/pricing";
import { Services } from "@/components/services";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Testimonials } from "@/components/testimonials";

// Six short chapters: what it is, what it costs, who builds it, questions, and how to start.
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Services />
        <Pricing />
        <About />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
