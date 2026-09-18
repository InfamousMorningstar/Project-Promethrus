import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument, type LegalSection } from "@/components/legal/legal-document";
import { cad, legal, site, terms } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms for using the AHMXD Technologies website and services, including intellectual property, licences, payments and hosting.",
  alternates: { canonical: "/terms" },
};

const COPYRIGHT_ACT = "https://laws-lois.justice.gc.ca/eng/acts/c-42/";

const Email = () => <a href={`mailto:${site.email}`}>{site.email}</a>;

/*
  Copyright Act references, checked September 2026 against laws-lois.justice.gc.ca:
  - s. 2: "literary work" includes computer programs.
  - s. 13(1): the author is the first owner of copyright.
  - s. 13(3): employers own work made by employees in the course of employment (not contractors).
  - s. 13(4): an assignment or grant is only valid in writing, signed by the owner.
  - s. 14.1: moral rights cannot be assigned, but can be waived.
*/
const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: (
      <>
        <p>
          These terms apply to this website and to the services provided by {legal.operator} (&ldquo;AHMXD&rdquo;). By
          using this website, you agree to them.
        </p>
        <p>
          For client projects, the written quote or agreement you accept sets out the scope, price and schedule, and these
          terms apply alongside it. If the two conflict, the quote or agreement you accepted takes priority.
        </p>
        <p>
          When these terms change, the date at the top is updated. A change never alters a quote or agreement you have
          already accepted unless both you and AHMXD agree in writing.
        </p>
      </>
    ),
  },
  {
    id: "website",
    title: "Using this website",
    body: (
      <ul>
        <li>
          Information on this website is general and may change. Prices are starting points in Canadian dollars, before
          any applicable taxes. Your written quote is the final price.
        </li>
        <li>
          Do not copy, scrape or reuse this website&apos;s text, design or code, or try to disrupt or overload it.
        </li>
        <li>
          The live temperature and client site status in the footer are for interest only and may be delayed or wrong.
        </li>
        <li>Links to other websites are provided for convenience. AHMXD is not responsible for their content.</li>
      </ul>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: (
      <>
        <h3>Who owns the work</h3>
        <p>
          Unless AHMXD transfers ownership in a written assignment, AHMXD owns the copyright in the code, designs and other
          original work it creates, including the websites and applications it builds for clients.
        </p>
        <p>
          This follows Canada&apos;s{" "}
          <a href={COPYRIGHT_ACT} target="_blank" rel="noreferrer">
            Copyright Act
          </a>
          . The author of a work is the first owner of its copyright (section 13(1)), and computer programs are protected
          as literary works (section 2). The rule that gives an employer ownership of work (section 13(3)) applies to
          employees, and AHMXD works for clients as an independent business, not as an employee. Copyright can only be
          assigned in writing, signed by its owner (section 13(4)).
        </p>

        <h3>Your licence</h3>
        <p>
          AHMXD grants you a non-exclusive, non-transferable licence to use the website or application built for you, for
          your business, as hosted by AHMXD, for as long as the payments under your quote or plan are up to date.
        </p>
        <p>
          The licence does not allow you to copy, resell, sublicense or modify the code, or move it to another host,
          without AHMXD&apos;s written permission. It ends when your hosting or plan ends, unless you have bought the code
          outright.
        </p>

        <h3>What stays yours</h3>
        <ul>
          <li>Your domain name, which is registered in your name.</li>
          <li>Your content: the text, photos, logos and trademarks you supply.</li>
          <li>Your data, such as the customer records your site collects.</li>
        </ul>
        <p>
          You give AHMXD permission to use your content and data only to build, host, maintain and support your site. You
          can ask for a copy of your data at any time.
        </p>

        <h3>Reusable work and open-source software</h3>
        <p>
          AHMXD may reuse general code, components, tools and know-how in other projects, but never your content, branding
          or data. Sites are built with open-source software such as React and Next.js, which remains under its own
          licences. AHMXD does not claim to own it.
        </p>

        <h3>Moral rights and portfolio use</h3>
        <p>
          Under the Copyright Act, moral rights cannot be assigned, only waived (section 14.1). Salman Ahmad keeps the moral
          rights in his work unless he waives them in writing. AHMXD may show your finished site in its portfolio, with
          screenshots and a link, unless you ask in writing that it not.
        </p>

        <h3>Buying the code outright</h3>
        <p>
          A full transfer of ownership is possible. It is priced case by case, and only takes effect through a written
          assignment signed by AHMXD, as the Copyright Act requires. To discuss it, contact <Email />.
        </p>

        <h3>If AHMXD stops operating</h3>
        <p>
          If AHMXD stops operating, every client whose payments are up to date receives, at no cost, a copy of their
          site&apos;s code and files and a licence to host, use and modify them anywhere, with at least 60 days&apos;
          notice.
        </p>

        <h3>This website</h3>
        <p>The text, design, code and logo of this website belong to AHMXD.</p>
      </>
    ),
  },
  {
    id: "payments",
    title: "Plans and payments",
    body: (
      <>
        <h3>Quotes and deposits</h3>
        <p>
          Every project starts with a fixed written quote for an agreed scope. Prices are in Canadian dollars, plus any
          applicable taxes. Design work starts once you accept the quote and pay the deposit. The deposit reserves time in
          AHMXD&apos;s schedule and covers the discovery, design and mockup work, so it is not refundable once design work
          has begun.
        </p>

        <h3>Paying upfront</h3>
        <p>
          The build fee is paid in two parts: a {terms.depositPercent}% deposit before design starts, and the remaining{" "}
          {100 - terms.depositPercent}% at launch, before the site goes live. Custom projects may use the milestone payments
          set out in their quote. Hosting, database and updates are billed monthly from {cad(terms.hosting)} a month for as
          long as AHMXD hosts the site.
        </p>

        <h3>Paying monthly</h3>
        <ul>
          <li>
            Your first {terms.monthlyDepositMonths} months are paid upfront, before design starts, and are not refundable once
            design work has begun. Monthly billing continues from there.
          </li>
          <li>
            Hosting, database, updates and small edits (up to {terms.smallEditMinutes} minutes a month) are included.
          </li>
          <li>
            The minimum term is {terms.minimumMonths} months, unless your quote says otherwise. After that, you can cancel
            with {terms.cancelNoticeDays} days&apos; written notice.
          </li>
        </ul>

        <h3>Scope, revisions and changes</h3>
        <ul>
          <li>
            The price covers the scope in your accepted quote. Anything outside it, such as extra pages, features or
            content, is quoted separately and only starts once you agree to the new price in writing.
          </li>
          <li>
            Each plan includes a set number of design revision rounds: one on Starter, two on Business, and as quoted on
            Custom. A revision adjusts work already presented; a new layout or direction after approval is new work.
            Extra rounds are billed at {cad(terms.hourly)} an hour.
          </li>
          <li>
            Launch is sign-off. Changes requested after launch are not part of the original price. Small edits such as
            swapping text or photos (up to {terms.smallEditMinutes} minutes a month) are included with monthly plans and
            Hosting &amp; care; anything more is quoted separately or billed at {cad(terms.hourly)} an hour.
          </li>
        </ul>

        <h3>Content and delays</h3>
        <p>
          You are responsible for supplying your content (text, photos and logos) and feedback on time. If a project waits
          more than {terms.pauseDays} days for your content, feedback or approval, AHMXD may pause it. Paused projects
          resume on a new schedule when you are ready, and payments already made are not refunded.
        </p>

        <h3>Missed payments</h3>
        <p>
          If a payment is missed, AHMXD sends a reminder. If it is still unpaid, the site may be paused after{" "}
          {terms.graceDays} days&apos; notice. It is restored once the balance is paid, usually the same day.
        </p>

        <h3>When service ends</h3>
        <p>
          When hosting or a monthly plan ends, the site is taken offline. Your domain stays yours, and you can ask for a
          copy of your data.
        </p>
      </>
    ),
  },
  {
    id: "hosting",
    title: "Hosting, security and backups",
    body: (
      <ul>
        <li>
          Sites are hosted on Vercel and databases run on Supabase. AHMXD does not control their outages or policies, and
          does not guarantee uninterrupted service.
        </li>
        <li>
          AHMXD protects the accounts that run your site with two-factor sign-in and uses the safeguards described in the{" "}
          <Link href="/privacy#security">Privacy Policy</Link>.
        </li>
        <li>
          Daily database backups through Supabase are available for projects that need them, and may add to the cost.
          Without backups, lost data may not be recoverable.
        </li>
        <li>AHMXD aims to reply within one business day, and to look at a site that is down the same day.</li>
      </ul>
    ),
  },
  {
    id: "responsibilities",
    title: "Your responsibilities",
    body: (
      <ul>
        <li>Supply accurate information, and only content you have the right to use.</li>
        <li>
          Meet the legal duties of your own business and website, such as a privacy policy for your customers. AHMXD can
          help you put these in place, but does not give legal advice.
        </li>
        <li>Keep any logins you are given secure, and tell AHMXD promptly if you suspect unauthorized access.</li>
      </ul>
    ),
  },
  {
    id: "liability",
    title: "Liability",
    body: (
      <>
        <p>
          AHMXD performs its services with reasonable skill and care. This website and its content are provided as is.
        </p>
        <p>
          To the extent the law allows, AHMXD is not liable for indirect or consequential losses, such as lost profits,
          lost business or data that was not backed up. AHMXD&apos;s total liability for any claim is limited to the
          amount you paid AHMXD in the 12 months before the claim. Nothing in these terms limits liability that cannot be
          limited by law.
        </p>
      </>
    ),
  },
  {
    id: "law",
    title: "Governing law and contact",
    body: (
      <>
        <p>
          These terms are governed by the laws of Alberta and the federal laws of Canada that apply there. Disputes are
          handled in the courts of Alberta.
        </p>
        <p>
          Questions: Salman Ahmad, AHMXD Technologies, Calgary, Alberta. <Email />
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      intro={
        <p>
          The terms for using this website and AHMXD Technologies&apos; services, including who owns the work, what your
          licence covers, and how payments and hosting work.
        </p>
      }
      summary={[
        "AHMXD owns the code and design it creates. You get a licence to use your site for your business.",
        "Your domain, your content and your data stay yours.",
        "Owning the code outright is possible through a written assignment, priced case by case.",
        "Hosting and databases stay with AHMXD, on Vercel and Supabase.",
        `Every project starts with a fixed quote and a deposit. Work after launch, beyond small edits, is quoted separately.`,
        `Monthly plans have a ${terms.minimumMonths}-month minimum, and a site may be paused after ${terms.graceDays} days' notice of a missed payment.`,
      ]}
      sections={sections}
    />
  );
}
