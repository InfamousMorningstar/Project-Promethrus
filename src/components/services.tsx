import { AppWindowIcon, BrowserIcon, HardDrivesIcon, RobotIcon } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";
import { services, type Service } from "@/lib/site";
import { Reveal } from "./reveal";

const icons: Record<Service["icon"], ReactNode> = {
  website: <BrowserIcon size={26} weight="duotone" />,
  app: <AppWindowIcon size={26} weight="duotone" />,
  it: <HardDrivesIcon size={26} weight="duotone" />,
  automation: <RobotIcon size={26} weight="duotone" />,
};

// Four services in one row: what it is, one sentence, and where the price starts.
export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 py-20 sm:px-6 md:py-24 lg:px-10">
      <Reveal>
        <h2 id="services-title" className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight tracking-[-0.035em]">
          What I do
        </h2>
        <p className="mt-3 max-w-[52ch] text-lg leading-relaxed text-muted">
          Four services, one engineer, and prices you can see before you call.
        </p>
      </Reveal>

      <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <li key={s.title}>
            <Reveal delay={i * 0.06} className="flex h-full flex-col border-t-2 border-accent-fill pt-6">
              <span className="text-accent">{icons[s.icon]}</span>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.025em]">{s.title}</h3>
              <p className="mt-2 text-lg leading-relaxed text-muted">{s.body}</p>
              <p className="mt-4 font-semibold text-ink">{s.price}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
