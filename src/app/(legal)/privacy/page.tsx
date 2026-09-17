import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument, type LegalSection } from "@/components/legal/legal-document";
import { legal, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What personal information AHMXD Technologies collects, where it is stored, and how it is protected.",
  alternates: { canonical: "/privacy" },
};

const Email = () => <a href={`mailto:${site.email}`}>{site.email}</a>;

/*
  Legal references, checked September 2026:
  - Alberta Personal Information Protection Act (PIPA): s. 34 reasonable security arrangements,
    s. 34.1 breach notification to the Commissioner, 45-day response to access requests.
  - PIPEDA applies where personal information crosses provincial or national borders in the course
    of commercial activity.
  - CRA: business records kept six years from the end of the tax year they relate to.
*/
const sections: LegalSection[] = [
  {
    id: "who",
    title: "Who is responsible",
    body: (
      <>
        <p>
          This website and its services are run by {legal.operator} (&ldquo;AHMXD&rdquo;). Salman Ahmad is responsible
          for how AHMXD handles personal information, and answers questions about this policy, including questions about
          service providers outside Canada. Contact: <Email />.
        </p>
        <p>
          AHMXD follows Alberta&apos;s{" "}
          <a href="https://www.alberta.ca/personal-information-protection-act" target="_blank" rel="noreferrer">
            Personal Information Protection Act
          </a>{" "}
          (PIPA). The federal{" "}
          <a href="https://laws-lois.justice.gc.ca/eng/acts/p-8.6/" target="_blank" rel="noreferrer">
            Personal Information Protection and Electronic Documents Act
          </a>{" "}
          (PIPEDA) also applies when personal information crosses provincial or national borders in the course of
          commercial activity.
        </p>
      </>
    ),
  },
  {
    id: "website",
    title: "What this website collects",
    body: (
      <>
        <ul>
          <li>
            <strong>No tracking.</strong> This website uses no analytics, advertising or tracking cookies, so there is no
            cookie banner.
          </li>
          <li>
            <strong>Your theme choice.</strong> If you switch between light and dark mode, that choice is saved in your own
            browser&apos;s storage. It stays on your device and is not sent to AHMXD.
          </li>
          <li>
            <strong>Hosting logs.</strong> Vercel, which hosts this website, processes technical information such as your
            IP address, browser type and the pages you request, to deliver the site and protect it from abuse.
          </li>
          <li>
            <strong>The contact form.</strong> The form does not send or store anything. It opens your own email app with
            a draft you can review, and nothing reaches AHMXD until you press send.
          </li>
          <li>
            <strong>Live footer details.</strong> The Calgary temperature and client site status are fetched by
            AHMXD&apos;s server from public sources. No information about you is included in those requests.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "collect",
    title: "Information you give AHMXD",
    body: (
      <>
        <ul>
          <li>
            <strong>When you get in touch:</strong> your name, email address, business name and whatever you include in
            your message. It is used to reply to you, scope your project and prepare a quote.
          </li>
          <li>
            <strong>When you become a client:</strong> contact and billing details, the content you supply for your site,
            and records of the work and payments. These are used to deliver the service, invoice you and meet legal and
            tax obligations.
          </li>
        </ul>
        <p>
          AHMXD does not sell, rent or trade personal information, and does not send marketing emails without your
          consent.
        </p>
      </>
    ),
  },
  {
    id: "client-data",
    title: "Your customers' information",
    body: (
      <>
        <p>
          A website or application AHMXD builds for you may collect personal information from your own customers, for
          example through a booking or inquiry form. That information is under your control: you decide what is collected
          and why, and your site needs its own privacy policy explaining it.
        </p>
        <p>
          AHMXD handles that information only on your behalf, to build, host, maintain and support your site or as you
          instruct. Access is limited to Salman Ahmad, it is never used for AHMXD&apos;s own purposes, and you can ask for
          a copy of your data at any time.
        </p>
      </>
    ),
  },
  {
    id: "outside-canada",
    title: "Service providers outside Canada",
    body: (
      <>
        <p>AHMXD uses these service providers, which may store or process personal information outside Canada:</p>
        <div className="legal-table" role="region" aria-label="Service providers" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">Provider</th>
                <th scope="col">What it is used for</th>
                <th scope="col">Where</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Vercel</td>
                <td>Hosting this website and client websites, including request logs</td>
                <td>United States, with content delivered through a worldwide network</td>
              </tr>
              <tr>
                <td>Supabase</td>
                <td>Databases for client websites and applications</td>
                <td>
                  The region chosen for each project. Supabase offers Canada (Central), the United States and other
                  regions, and you can ask which region your project uses.
                </td>
              </tr>
              <tr>
                <td>Google (Gmail)</td>
                <td>Email with prospective and current clients</td>
                <td>United States and other countries where Google operates</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Website code is stored with GitHub in the United States and is not meant to contain personal information.
        </p>
        <p>
          Information stored outside Canada is subject to the laws of the country where it is held, and may be accessed
          by that country&apos;s courts, law enforcement or national security authorities. For more about how these
          providers are used, contact <Email />.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "How information is protected",
    body: (
      <>
        <p>
          PIPA requires reasonable security arrangements for personal information. AHMXD&apos;s safeguards include:
        </p>
        <ul>
          <li>Two-factor sign-in on the accounts used to run websites, databases and code.</li>
          <li>HTTPS encryption on every site, and databases encrypted at rest by Supabase (AES-256).</li>
          <li>Access to client systems and data limited to Salman Ahmad.</li>
          <li>Code history kept in version control, and daily database backups through Supabase for projects that include them.</li>
        </ul>
        <p>No method of storing or sending information is completely secure, and AHMXD cannot guarantee absolute security.</p>
      </>
    ),
  },
  {
    id: "breaches",
    title: "If there is a privacy breach",
    body: (
      <>
        <p>
          If personal information under AHMXD&apos;s control is lost, or accessed or disclosed without authorization, and
          a reasonable person would consider that there is a real risk of significant harm to someone, AHMXD notifies the{" "}
          <a href="https://oipc.ab.ca/breach-notification/" target="_blank" rel="noreferrer">
            Office of the Information and Privacy Commissioner of Alberta
          </a>{" "}
          without unreasonable delay, as section 34.1 of PIPA requires.
        </p>
        <p>
          If a breach affects information AHMXD holds for a client, AHMXD tells that client without unreasonable delay so
          the client can meet its own obligations.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long information is kept",
    body: (
      <>
        <p>Personal information is kept only as long as it is reasonably needed for business or legal purposes.</p>
        <ul>
          <li>
            Business and tax records, such as invoices, are kept for six years from the end of the tax year they relate
            to, as the Canada Revenue Agency requires.
          </li>
          <li>Messages that do not lead to a project are kept only as long as needed to reply and follow up.</li>
          <li>Client data is deleted or returned when a project ends, unless the law requires keeping it longer.</li>
        </ul>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <ul>
          <li>
            <strong>See and correct your information.</strong> Ask in writing at <Email />. Under PIPA, AHMXD responds
            within 45 days, or within any extension the Act allows.
          </li>
          <li>
            <strong>Withdraw consent.</strong> You can withdraw consent to a use of your information on reasonable notice,
            unless that would stop AHMXD meeting a legal obligation.
          </li>
          <li>
            <strong>Make a complaint.</strong> Please contact AHMXD first. You can also contact the{" "}
            <a href="https://oipc.ab.ca" target="_blank" rel="noreferrer">
              Office of the Information and Privacy Commissioner of Alberta
            </a>{" "}
            or, where PIPEDA applies, the{" "}
            <a href="https://www.priv.gc.ca" target="_blank" rel="noreferrer">
              Office of the Privacy Commissioner of Canada
            </a>
            .
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes and contact",
    body: (
      <>
        <p>
          When this policy changes, the date at the top is updated. How AHMXD handles client data is also set out in the{" "}
          <Link href="/terms#hosting">Terms of Service</Link>.
        </p>
        <p>
          Questions or requests: Salman Ahmad, AHMXD Technologies, Calgary, Alberta. <Email />
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      intro={
        <p>
          What personal information AHMXD Technologies collects, why, where it is stored and how it is protected, written
          to meet Alberta&apos;s Personal Information Protection Act.
        </p>
      }
      summary={[
        "No analytics, advertising or tracking cookies on this website.",
        "Information you send is used to reply, quote and deliver your project. It is never sold.",
        "Your customers' data is handled only on your behalf, and you can get a copy any time.",
        "Some providers store data outside Canada. They are listed in section 5.",
        "Breaches with a real risk of significant harm are reported as Alberta law requires.",
      ]}
      sections={sections}
    />
  );
}
