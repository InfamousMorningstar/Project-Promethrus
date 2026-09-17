import { AppWindowIcon, CloudCheckIcon, HardDrivesIcon, RobotIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import type { ReactNode } from "react";
import { StrokeText } from "./reactbits/stroke-text";
import { SectionTitle } from "./section-title";
import { SpotlightCard } from "./spotlight-card";

function CardHead({ icon, title, body }: { icon?: ReactNode; title: string; body: string }) {
  return (
    <div className="flex flex-col gap-3">
      {icon && <span className="mb-2 text-accent">{icon}</span>}
      {/* Title redraws whenever the card is hovered. */}
      <StrokeText as="h3" text={title} trigger="hover" drawDuration={0.9} stagger={0.02} strokeWidth={2} className="text-[1.65rem]" />
      <p className="max-w-[46ch] leading-relaxed text-muted">{body}</p>
    </div>
  );
}

const infra = [
  ["Storage", "8 x 20 TB, dual parity ZFS"],
  ["Remote access", "Tailscale, Cloudflare Tunnel"],
  ["Inbound ports open", "0"],
  ["Backups", "Encrypted, off-site, weekly"],
] as const;

const care = ["Domains & DNS", "SSL", "Preview deploys", "Updates", "Analytics", "Search basics"];

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-[1400px] scroll-mt-20 px-4 py-24 sm:px-6 md:py-32 lg:px-10">
      <SectionTitle lines={["What I build"]} className="mb-14" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        {/* Websites: the core offer, shown with real client screenshots. */}
        <SpotlightCard className="flex min-h-[520px] flex-col md:col-span-2 lg:col-span-7 lg:row-span-2">
          <div className="p-7 md:p-9">
            <CardHead
              title="Business websites"
              body="Fast, mobile-first sites that turn visitors into calls."
            />
          </div>
          <div className="relative min-h-[280px] flex-1 overflow-hidden sm:min-h-[340px]" aria-hidden>
            <div className="absolute left-[6%] top-[6%] w-[74%] origin-bottom-left -rotate-3 overflow-hidden rounded-xl border border-line-strong shadow-2xl transition-transform duration-700 ease-out-expo group-hover/card:-translate-y-2 group-hover/card:-rotate-6">
              <Image src="/work/pearlshaven.png" alt="" width={1440} height={900} sizes="(min-width: 1024px) 40vw, 80vw" />
            </div>
            <div className="absolute right-[5%] top-[22%] w-[74%] origin-bottom-right rotate-2 overflow-hidden rounded-xl border border-line-strong shadow-2xl transition-transform duration-700 ease-out-expo group-hover/card:-translate-y-4 group-hover/card:rotate-4">
              <Image src="/work/interfreight-home.png" alt="" width={1440} height={900} sizes="(min-width: 1024px) 40vw, 80vw" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent" />
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-7 md:p-9 lg:col-span-5">
          <div className="pointer-events-none absolute -right-16 -top-16 -z-10 size-64 rounded-full bg-accent-fill/15 blur-3xl" />
          <CardHead
            icon={<AppWindowIcon size={30} weight="duotone" />}
            title="Web applications"
            body="Inventory, bookings and admin dashboards with secure logins."
          />
          <p className="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-soft">
            Shipped for Inter-Freight Auto Sales.
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-7 md:p-9 lg:col-span-5">
          <CardHead
            icon={<HardDrivesIcon size={30} weight="duotone" />}
            title="IT & infrastructure"
            body="Storage, backups and secure remote access for your office."
          />
          <dl className="mt-6 grid gap-2 rounded-xl border border-line bg-bg-raised p-4 font-mono text-[12.5px]">
            {infra.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4">
                <dt className="text-soft">{k}</dt>
                <dd className="text-right text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-soft">Figures from the infrastructure I run myself.</p>
        </SpotlightCard>

        <SpotlightCard className="p-7 md:p-9 lg:col-span-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(var(--line-strong)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(to_bottom_left,black,transparent_60%)]"
          />
          <CardHead
            icon={<CloudCheckIcon size={30} weight="duotone" />}
            title="Hosting & care"
            body="Deploys, renewals and updates handled after launch."
          />
          <ul className="mt-6 flex flex-wrap gap-2">
            {care.map((c) => (
              <li key={c} className="rounded-full border border-line px-3 py-1.5 font-mono text-[11.5px] text-muted">
                {c}
              </li>
            ))}
          </ul>
        </SpotlightCard>

        <SpotlightCard className="p-7 md:p-9 lg:col-span-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(135deg,transparent_40%,rgb(124_58_237/0.09))]"
          />
          <CardHead
            icon={<RobotIcon size={30} weight="duotone" />}
            title="Automation & support bots"
            body="Bots and scripts that take repetitive work off your plate."
          />
          <p className="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-soft">
            CDN_Captain answers support questions from verified sources.
          </p>
        </SpotlightCard>
      </div>
    </section>
  );
}
