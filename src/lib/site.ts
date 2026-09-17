export const site = {
  name: "AHMXD Technologies",
  shortName: "AHMXD",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahmxd.net",
  description:
    "Calgary web development and IT systems for small businesses. Websites, web apps, hosting, infrastructure and automation, built and supported by one engineer.",
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
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "studio", label: "Studio" },
  { id: "faq", label: "FAQ" },
] as const;

export const proof = [
  { value: 3, label: "Client sites live" },
  { value: 6, label: "Projects shipped" },
  { value: 38, label: "Containers in production" },
  { value: 1, label: "Engineer, start to finish" },
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
  {
    name: "Nitor",
    kind: "Product design",
    relation: "Lab",
    summary:
      "A habit tracker with forgiving streaks and secure accounts.",
    stack: ["Next.js", "Supabase", "GSAP"],
    href: "https://nitor-peach.vercel.app/",
    domain: "nitor-peach.vercel.app",
    image: "/work/nitor.png",
  },
];

export const steps = [
  {
    title: "Scope",
    body: "What it must do, who it serves, what done looks like.",
  },
  {
    title: "Mockup",
    body: "See the design before a line of code is written.",
  },
  {
    title: "Sign-off",
    body: "Approve the design and a written quote.",
  },
  {
    title: "Build",
    body: "Watch progress on a live preview link.",
  },
  {
    title: "Launch",
    body: "Domain, hosting, analytics and a walkthrough.",
  },
  {
    title: "Support",
    body: "Fixes and upgrades from the person who built it.",
  },
] as const;

export const faqs = [
  {
    q: "Do you only work with Calgary businesses?",
    a: "Mostly Calgary and area, so we can meet in person. Anywhere in Canada works over video.",
  },
  {
    q: "Who owns the website when it is finished?",
    a: "You do. Code, domain and hosting all sit in your name.",
  },
  {
    q: "How is pricing handled?",
    a: "A written quote after scoping. You approve it before any build work starts.",
  },
  {
    q: "How long does a website take?",
    a: "Weeks, not months, for a focused business site. The mockup keeps it on track.",
  },
  {
    q: "Can you take over a site someone else built?",
    a: "Yes. It starts with an audit, so you know what you have before anything changes.",
  },
  {
    q: "What happens if something breaks after launch?",
    a: "You contact the person who built it. Monthly care or pay as you go.",
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

export const timelines = ["As soon as possible", "Within 1-3 months", "Just exploring"] as const;
