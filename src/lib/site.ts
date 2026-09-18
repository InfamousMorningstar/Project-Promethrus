export const site = {
  name: "AHMXD Technologies",
  shortName: "AHMXD",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahmxdtechnologies.ca",
  description:
    "Websites and IT for Calgary businesses. Hand-built sites you can pay for upfront or monthly, plus web apps, hosting, office IT and automation.",
  founder: "Salman Ahmad",
  email: "s.ahmad0147@gmail.com",
  city: "Calgary",
  region: "Alberta",
  regionCode: "AB",
  country: "CA",
  timeZone: "America/Edmonton",
  links: {
    portfolio: "https://portfolio.ahmxd.net",
    github: "https://github.com/InfamousMorningstar",
    linkedin: "https://www.linkedin.com/in/salman-ahmad-6788811b6/",
  },
  photo: "https://portfolio.ahmxd.net/images/profile-photo-1280.webp",
} as const;

export const navItems = [
  { id: "services", label: "Services" },
  { id: "pricing", label: "Pricing" },
  { id: "about", label: "About" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
] as const;

/* Pricing ----------------------------------------------------------------------------------
   Every price and term on the site comes from here, so the hero, pricing section and FAQ
   never disagree. Amounts are Canadian dollars. */

// Formats without Intl so server and client render identical text.
export const cad = (amount: number) => `$${String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export type Billing = "upfront" | "monthly";

export type Plan = {
  id: "starter" | "business" | "custom";
  name: string;
  summary: string;
  upfront: number;
  monthly: number;
  /** Prices are starting points, confirmed by a written quote. */
  from?: boolean;
  recommended?: boolean;
  features: string[];
};

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    summary: "For new and local businesses that need to be found and called.",
    upfront: 1500,
    monthly: 99,
    features: [
      "One-page site with a contact or booking form",
      "Mobile-first and fast to load",
      "Google Business Profile setup",
      "One round of design changes",
    ],
  },
  {
    id: "business",
    name: "Business",
    summary: "For established businesses that want more calls from their site.",
    upfront: 2000,
    monthly: 179,
    recommended: true,
    features: [
      "Up to 6 pages",
      "Custom design, approved as a mockup first",
      "Two rounds of design changes",
      "Quote, contact and booking forms",
      "Local SEO setup and analytics",
    ],
  },
  {
    id: "custom",
    name: "Custom",
    summary: "For bookings, inventory, client logins and admin dashboards.",
    upfront: 4000,
    monthly: 249,
    from: true,
    features: [
      "Web apps with secure logins",
      "Admin dashboards and databases",
      "Connections to the tools you already use",
      "Scoped and quoted in writing",
    ],
  },
];

export const terms = {
  minimumMonths: 12,
  cancelNoticeDays: 30,
  graceDays: 14,
  /** Monthly hosting and care for sites paid upfront. */
  hosting: 39,
  hourly: 75,
  /** Share of an upfront build paid before any design work starts. */
  depositPercent: 50,
  /** Months a monthly plan pays upfront before design work starts. */
  monthlyDepositMonths: 2,
  /** Small edits included each month with monthly plans and Hosting & care. */
  smallEditMinutes: 30,
  /** Days a project can wait on the client before it is paused. */
  pauseDays: 30,
};

export const billingNotes: Record<Billing, { title: string; notes: string[] }> = {
  upfront: {
    title: "Paying upfront",
    notes: [
      `A ${terms.depositPercent}% deposit books your project and starts the design. It covers the design and mockup work, so it is not refundable once design begins.`,
      `The other ${100 - terms.depositPercent}% at launch, before the site goes live.`,
      `Hosting, database and updates: from ${cad(terms.hosting)} a month.`,
      "A licence to use the site for your business. The code stays AHMXD's.",
    ],
  },
  monthly: {
    title: "Paying monthly",
    notes: [
      `Your first ${terms.monthlyDepositMonths} months are paid upfront to book your project and start the design. They are not refundable once design begins.`,
      `Hosting, database, updates and small edits (up to ${terms.smallEditMinutes} minutes a month) are included.`,
      "The same licence to use the site. The code stays AHMXD's.",
      `${terms.minimumMonths}-month minimum, then cancel any time with ${terms.cancelNoticeDays} days' written notice.`,
      `Miss a payment and the site may be paused after ${terms.graceDays} days' notice. Pay, and it's back, usually the same day.`,
    ],
  },
};

/* Ownership applies to every plan. The code and design are AHMXD's intellectual property
   (under Canada's Copyright Act the author owns the work unless rights are assigned in
   writing); clients get a licence to use them. */
export type Owner = "You" | "AHMXD";

export const ownership: { item: string; owner: Owner; note: string }[] = [
  { item: "Domain name", owner: "You", note: "Registered in your name, always." },
  { item: "Your content", owner: "You", note: "The text, photos and logo you supply." },
  { item: "Code and design", owner: "AHMXD", note: "AHMXD's intellectual property, licensed to you." },
  { item: "Hosting and database", owner: "AHMXD", note: "Run and maintained under AHMXD's accounts." },
];

export const buyoutNote = "Want to own the code outright? A full buyout is possible. It's priced case by case.";

// What the price covers, so nobody expects a redesign or new pages for free after launch.
export const scopeNotes = [
  "Your quote is a fixed price for the scope we agree in writing. It does not change mid-build unless you add to it.",
  "Design changes are limited to the rounds in your plan: one on Starter, two on Business, and as quoted on Custom. Extra rounds are billed hourly.",
  "Launch is sign-off. After launch, new pages, new features, new content or a redesign are new work, quoted separately.",
  `Small edits after launch, such as swapping text or photos (up to ${terms.smallEditMinutes} minutes a month), are included with monthly plans and Hosting & care. Anything more is ${cad(terms.hourly)} an hour.`,
  `If a project waits more than ${terms.pauseDays} days for your content or feedback, it is paused, and the schedule is reset when you are ready.`,
];

export type Extra = { name: string; amount: number; from?: boolean; unit?: string; body: string };

export const extras: Extra[] = [
  { name: "Hosting & care", amount: terms.hosting, unit: "a month", body: `Hosting, database, updates and small edits (up to ${terms.smallEditMinutes} minutes a month) for sites paid upfront.` },
  { name: "IT support", amount: 30, from: true, unit: "per user", body: "Monthly help with computers, email, backups and security for your team." },
  { name: "Office IT setup", amount: 500, from: true, body: "Wi-Fi, shared storage, backups and secure remote access." },
  { name: "Automation", amount: 400, from: true, body: "Scripts and bots that take repeat work off your plate." },
  { name: "Hourly work", amount: terms.hourly, unit: "an hour", body: "Small fixes and one-off changes." },
];

const starter = plans[0];

export const heroLine = `Hand-built sites from ${cad(starter.upfront)}, or ${cad(starter.monthly)} a month. Office IT from the same engineer.`;

export type Service = { icon: "website" | "app" | "it" | "automation"; title: string; body: string; price: string };

// The four things AHMXD sells, shown as one short row under the hero.
export const services: Service[] = [
  {
    icon: "website",
    title: "Websites",
    body: "Fast, mobile-first sites that turn visitors into calls.",
    price: `From ${cad(starter.upfront)}, or ${cad(starter.monthly)} a month`,
  },
  {
    icon: "app",
    title: "Web apps",
    body: "Bookings, inventory and dashboards with secure logins.",
    price: `From ${cad(plans[2].upfront)}, or ${cad(plans[2].monthly)} a month`,
  },
  {
    icon: "it",
    title: "Office IT",
    body: "Wi-Fi, storage, backups and secure remote access for your team.",
    price: `Setup from ${cad(extras[2].amount)}, support from ${cad(extras[1].amount)} per user`,
  },
  {
    icon: "automation",
    title: "Automation",
    body: "Scripts and bots that take repeat work off your plate.",
    price: `From ${cad(extras[3].amount)}`,
  },
];

/* Security and continuity: how client sites and data are protected, including if the one
   engineer is unavailable. Each item is a promise AHMXD keeps on its own, with no outside
   partner required. The Privacy Policy and Terms repeat these in legal wording.
   The first three are shown up front in the About section; the rest sit behind "Show all". */
export const continuity = [
  {
    icon: "twoFactor",
    title: "Two-factor on every account",
    body: "Every account that runs your site, from hosting and database to code, is locked with two-factor sign-in.",
  },
  {
    icon: "key",
    title: "Your domain, in your name",
    body: "Your domain is always registered to you, so your web address can never be held back.",
  },
  {
    icon: "lifebuoy",
    title: "If AHMXD ever closes",
    body: "Every client gets their site's code and files free, with the right to run them anywhere and 60 days to move.",
  },
  {
    icon: "encrypted",
    title: "Encrypted in transit and at rest",
    body: "Every site is served over HTTPS, and Supabase encrypts databases at rest with AES-256.",
  },
  {
    icon: "backups",
    title: "Backups when you need them",
    body: "Code history lives in version control. Daily database backups through Supabase are available for projects that need them.",
  },
  {
    icon: "breach",
    title: "A plan if something goes wrong",
    body: "If your data is ever exposed, you are told without unreasonable delay and helped through any report Alberta law requires.",
  },
  {
    icon: "reply",
    title: "Replies within a business day",
    body: "A site that is down gets looked at the same day. Planned time off is announced ahead of time.",
  },
  {
    icon: "guide",
    title: "A handover guide",
    body: "Every launch includes a plain-English guide to how your site is built and where it runs.",
  },
  {
    icon: "code",
    title: "Standard tools",
    body: "Built with React and Next.js, which most web developers already know. No private page builder.",
  },
] as const;

export type Testimonial = { quote: string; name: string; role: string; business: string };

// Real client quotes only, three lines or less. The section stays hidden until one is added.
export const testimonials: Testimonial[] = [];

/* Legal ------------------------------------------------------------------------------------ */

export const legal = {
  // Change this whenever the Terms or Privacy Policy wording changes.
  updated: "September 18, 2026",
  operator: "Salman Ahmad, a sole proprietor in Calgary, Alberta, operating as AHMXD Technologies",
};

export const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Intellectual property", href: "/terms#intellectual-property" },
  { label: "Security", href: "/privacy#security" },
] as const;

export type Project = {
  name: string;
  kind: string;
  relation: "Client work" | "Lab";
  summary: string;
  stack: string[];
  href: string;
  domain: string;
  image: string;
};

export const projects: Project[] = [
  {
    name: "Inter-Freight Auto Sales",
    kind: "Dealership platform",
    relation: "Client work",
    summary:
      "Inventory, inquiries and CARFAX reports behind a secure admin.",
    stack: ["Next.js", "Supabase", "PostgreSQL"],
    href: "https://interfreightautosales.ca/",
    domain: "interfreightautosales.ca",
    image: "/work/interfreight-home.png",
  },
  {
    name: "Pearl's Haven",
    kind: "Licensed dayhome",
    relation: "Client work",
    summary:
      "A warm one-page tour with a gallery and booking form.",
    stack: ["Next.js", "Tailwind", "Framer Motion"],
    href: "https://pearlshaven.ca/",
    domain: "pearlshaven.ca",
    image: "/work/pearlshaven.png",
  },
  {
    name: "CDN DayZ",
    kind: "Community platform",
    relation: "Client work",
    summary:
      "Live server status, mod lists and an error-code help hub.",
    stack: ["Next.js", "TypeScript", "Python"],
    href: "https://cdndayz.com/",
    domain: "cdndayz.com",
    image: "/work/cdndayz.png",
  },
];

export const steps = [
  {
    title: "Scope",
    body: "What it must do, who it serves, and a fixed written quote.",
  },
  {
    title: "Deposit",
    body: "A deposit books your spot and starts the design.",
  },
  {
    title: "Mockup",
    body: "See and approve the design before it is built.",
  },
  {
    title: "Build",
    body: "Watch progress on a live preview link.",
  },
  {
    title: "Launch",
    body: "Final payment, then the site goes live with a walkthrough.",
  },
  {
    title: "Support",
    body: "Fixes and upgrades from the person who built it.",
  },
] as const;

export const faqs = [
  {
    q: "What does a website cost?",
    a: `A Starter site is ${cad(starter.upfront)} plus ${cad(terms.hosting)} a month for hosting, or ${cad(starter.monthly)} a month with hosting included. Every project starts with a fixed written quote and a deposit, and the price does not change mid-build unless you add to the scope.`,
  },
  {
    q: "Who owns the website when it is finished?",
    a: `You own your domain and your content. The code and design are AHMXD's intellectual property, licensed to you to run your business, and hosting and the database stay with AHMXD. ${buyoutNote}`,
  },
  {
    q: "How long does a website take?",
    a: "Weeks, not months, for a focused business site. The mockup keeps it on track.",
  },
  {
    q: "What happens if I miss a monthly payment?",
    a: `You get a reminder, then ${terms.graceDays} days' notice before the site is paused. Pay what is owed and it is back online, usually the same day.`,
  },
  {
    q: "Can you take over a site someone else built?",
    a: "Yes. It starts with an audit, so you know what you have before anything changes.",
  },
  {
    q: "What about changes or fixes after launch?",
    a: `Monthly plans and Hosting & care cover fixes and small edits, such as swapping text or photos (up to ${terms.smallEditMinutes} minutes a month). New pages, features, content or a redesign are new work, quoted separately or billed at ${cad(terms.hourly)} an hour.`,
  },
] as const;

export const needs = [
  "Website",
  "Web app",
  "IT & infrastructure",
  "Hosting & care",
  "Automation",
  "Not sure yet",
] as const;

export const payments = ["Pay upfront", "Pay monthly", "Not sure yet"] as const;
