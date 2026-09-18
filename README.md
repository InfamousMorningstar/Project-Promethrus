# AHMXD Technologies

Business site for AHMXD Technologies, a Calgary web development and IT systems studio. It is the client-facing companion to [portfolio.ahmxd.net](https://portfolio.ahmxd.net) and shares its visual identity.

## Stack

- Next.js 16 (App Router, Turbopack) + React 19, TypeScript
- Tailwind CSS v4, design tokens in `src/app/globals.css` (dark default, light theme toggle)
- Hero: a left-aligned split. The headline sits on the left; the real client sites are stacked like open windows on the right (`hero-windows.tsx`), each showing its live response time; a live bar along the bottom shows sites online, average response, Calgary time and temperature. Live readings are shared with the footer through `live-data.ts`, so each API is called once per page view
- Aceternity UI patterns (adapted to the brand): Text Hover Effect powers the footer wordmark
- React Bits components (installed from `https://reactbits.dev/r/<Name>-TS-TW`, then adapted) in `src/components/reactbits/`: Ghost Fibers (hero WebGL background, via `ogl`), Stroke Text (drawn headings), Scroll Reveal (the statement section) and Decrypted Text (nav and label scramble)
- GSAP ScrollTrigger for the pinned Work pan and the Process rail
- Motion (`motion/react`) for reveals, the nav pill, FAQ and form states
- Phosphor icons

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Editing content

Almost all copy lives in `src/lib/site.ts`: contact details, stats, projects, process steps, FAQ answers and form options. Project screenshots are in `public/work/`.

Set `NEXT_PUBLIC_SITE_URL` to the production domain so canonical URLs, the sitemap and social cards point at the right place (defaults to `https://ahmxd.net`).

## Notes

- The contact form does not send anything itself. It validates the brief and opens the visitor's email app with it prefilled, addressed to the email in `site.ts`.
- The loading screen (`src/components/site-loader.tsx`) tracks real readiness: the heading font, the first hero screenshot decoding, the WebGL background starting, and the window load event. Its file stream comes from the browser's Resource Timing API. It stays up at least 1.5 s so the sequence reads, never more than 6.5 s, and any key or click skips it. Hero intro animations wait for it via `loader-state.ts`.
- The footer's "Client systems, live" board calls `/api/status`, which checks each client site in `site.ts` from the server and reports whether it is up and how fast it responded. Responses carry a 5-minute CDN cache header, so on Vercel the sites are checked at most once every five minutes however much traffic the page gets.
- The founder photo is loaded from `portfolio.ahmxd.net/images/`, allowed in `next.config.ts`.
- Motion respects `prefers-reduced-motion`: the horizontal pan becomes a swipeable row, the hero windows stop tilting and rotating, and the price switch cross-fades instead of rolling.
