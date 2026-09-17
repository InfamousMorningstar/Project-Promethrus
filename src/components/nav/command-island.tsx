"use client";

/*
  Command island: the site's navigation.
  Collapsed, it is a small capsule showing where you are, with the page's scroll progress traced
  around its edge. Click it, press Ctrl/Cmd+K or "/", and it morphs into a command palette:
  type to filter, arrows to move, Enter to go, digits 1-6 to jump straight to a section.
*/
import {
  ArrowElbowDownLeftIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  BriefcaseIcon,
  CircleHalfIcon,
  EnvelopeSimpleIcon,
  ListIcon,
  MagnifyingGlassIcon,
  PaperPlaneTiltIcon,
  PathIcon,
  QuestionIcon,
  StackIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { site } from "@/lib/site";
import { LogoMark } from "../logo-mark";
import { useReducedMotion } from "../use-reduced-motion";
import { useTheme } from "../use-theme";
import { SECTIONS, useActiveSection } from "./use-active-section";

type Action = { kind: "section"; target: string } | { kind: "theme" } | { kind: "email" } | { kind: "portfolio" };

type Command = {
  id: string;
  label: string;
  hint: string;
  group: "Go to" | "Do";
  icon: ReactNode;
  action: Action;
  shortcut?: string;
  keywords?: string;
  external?: boolean;
};

const ICON = { size: 16, weight: "bold" } as const;
const SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=";

// Re-decodes whenever the section changes, so the capsule visibly reacts to scrolling.
function ScrambleLabel({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let frame = 0;
    const id = setInterval(
      () => {
        frame++;
        const revealed = reduce ? text.length : Math.floor(frame / 2);
        if (revealed >= text.length) {
          setDisplay(text);
          clearInterval(id);
          return;
        }
        setDisplay(
          Array.from(text)
            .map((c, i) => (i < revealed ? c : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]))
            .join(""),
        );
      },
      reduce ? 0 : 30,
    );
    return () => clearInterval(id);
  }, [text, reduce]);

  return (
    <>
      <span className="sr-only">Current section: {text}</span>
      <span aria-hidden>{display}</span>
    </>
  );
}

// Scroll progress traced around the capsule, starting at the top centre. It sits just outside the
// capsule's border and above its contents, so nothing inside the capsule can cover or clip it.
const RING_GAP = 4;

function ProgressRing({ width, height }: { width: number; height: number }) {
  const { scrollYProgress } = useScroll();
  const path = useRef<SVGPathElement>(null);
  const head = useRef<SVGCircleElement>(null);

  const w = width + RING_GAP * 2;
  const h = height + RING_GAP * 2;
  const stroke = 2.5;
  const inset = stroke / 2;
  const r = h / 2;
  const d = `M ${w / 2} ${inset} H ${w - r} A ${r - inset} ${r - inset} 0 0 1 ${w - r} ${h - inset} H ${r} A ${r - inset} ${r - inset} 0 0 1 ${r} ${inset} Z`;

  // Glowing head dot rides the leading edge of the stroke.
  const placeHead = useCallback((p: number) => {
    const el = path.current;
    const dot = head.current;
    if (!el || !dot) return;
    const point = el.getPointAtLength(el.getTotalLength() * p);
    dot.setAttribute("cx", String(point.x));
    dot.setAttribute("cy", String(point.y));
    dot.style.opacity = p > 0.002 && p < 0.998 ? "1" : "0";
  }, []);
  useMotionValueEvent(scrollYProgress, "change", placeHead);
  // The capsule resizes when the section label changes; re-seat the dot on the new outline.
  useEffect(() => {
    placeHead(scrollYProgress.get());
  }, [d, placeHead, scrollYProgress]);

  if (!width || !height) return null;

  return (
    <svg
      aria-hidden
      width={w}
      height={h}
      style={{ left: -RING_GAP, top: -RING_GAP }}
      className="pointer-events-none absolute z-10 overflow-visible"
    >
      <path d={d} fill="none" strokeWidth={1} className="stroke-line-strong" />
      <motion.path
        ref={path}
        d={d}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        className="stroke-accent [filter:drop-shadow(0_0_6px_rgb(139_92_246/0.85))_drop-shadow(0_0_2px_rgb(196_181_253/0.9))]"
        style={{ pathLength: scrollYProgress }}
      />
      <circle
        ref={head}
        r={3.5}
        cx={w / 2}
        cy={inset}
        style={{ opacity: 0 }}
        className="fill-[#ede9fe] [filter:drop-shadow(0_0_6px_rgb(167_139_250))] transition-opacity duration-300"
      />
    </svg>
  );
}

const isMacSubscribe = () => () => {};
const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

function isEditable(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
}

export function CommandIsland() {
  const active = useActiveSection();
  const reduce = useReducedMotion();
  const { theme, setTheme } = useTheme();
  const mac = useSyncExternalStore(isMacSubscribe, isMac, () => false);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const capsule = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();

  const label = SECTIONS.find((s) => s.id === active)?.label ?? "Home";

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    setQuery("");
    setCursor(0);
    if (restoreFocus) requestAnimationFrame(() => trigger.current?.focus());
  }, []);

  const goTo = useCallback(
    (id: string) => {
      close(false);
      requestAnimationFrame(() => {
        const behavior = reduce ? "auto" : "smooth";
        if (id === "top") window.scrollTo({ top: 0, behavior });
        else document.getElementById(id)?.scrollIntoView({ behavior });
      });
    },
    [close, reduce],
  );

  // Plain data; `run` below performs the action, so no handler is created during render.
  const commands = useMemo<Command[]>(
    () => [
      { id: "services", label: "Services", hint: "What I build", group: "Go to", icon: <StackIcon {...ICON} />, shortcut: "1", keywords: "websites apps it hosting automation", action: { kind: "section", target: "services" } },
      { id: "work", label: "Work", hint: "Live client sites", group: "Go to", icon: <BriefcaseIcon {...ICON} />, shortcut: "2", keywords: "projects portfolio clients", action: { kind: "section", target: "work" } },
      { id: "process", label: "Process", hint: "How a project runs", group: "Go to", icon: <PathIcon {...ICON} />, shortcut: "3", keywords: "steps timeline", action: { kind: "section", target: "process" } },
      { id: "studio", label: "Studio", hint: "Meet the engineer", group: "Go to", icon: <UserIcon {...ICON} />, shortcut: "4", keywords: "about salman", action: { kind: "section", target: "studio" } },
      { id: "faq", label: "FAQ", hint: "Common questions", group: "Go to", icon: <QuestionIcon {...ICON} />, shortcut: "5", keywords: "pricing ownership", action: { kind: "section", target: "faq" } },
      { id: "contact", label: "Start a project", hint: "Send a brief", group: "Go to", icon: <PaperPlaneTiltIcon {...ICON} />, shortcut: "6", keywords: "contact hire quote", action: { kind: "section", target: "contact" } },
      { id: "theme", label: `Switch to ${theme === "dark" ? "light" : "dark"} theme`, hint: "Appearance", group: "Do", icon: <CircleHalfIcon {...ICON} />, keywords: "dark light mode", action: { kind: "theme" } },
      { id: "email", label: "Email Salman", hint: site.email, group: "Do", icon: <EnvelopeSimpleIcon {...ICON} />, keywords: "mail message", action: { kind: "email" } },
      { id: "portfolio", label: "Open the portfolio", hint: "portfolio.ahmxd.net", group: "Do", icon: <ArrowUpRightIcon {...ICON} />, external: true, keywords: "case studies engineering", action: { kind: "portfolio" } },
      { id: "top", label: "Back to top", hint: "Home", group: "Do", icon: <ArrowUpIcon {...ICON} />, keywords: "home hero", action: { kind: "section", target: "top" } },
    ],
    [theme],
  );

  const run = (command: Command | undefined) => {
    if (!command) return;
    const { action } = command;
    if (action.kind === "section") return goTo(action.target);
    if (action.kind === "theme") {
      setTheme(theme === "dark" ? "light" : "dark");
      return close();
    }
    close();
    if (action.kind === "email") window.location.href = `mailto:${site.email}`;
    if (action.kind === "portfolio") window.open(site.links.portfolio, "_blank", "noopener,noreferrer");
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.hint} ${c.keywords ?? ""}`.toLowerCase().includes(q));
  }, [commands, query]);

  const safeCursor = Math.min(cursor, Math.max(results.length - 1, 0));

  // Global shortcuts: Ctrl/Cmd+K toggles, "/" opens, digits jump while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else setOpen(true);
        return;
      }
      if (!open && e.key === "/" && !isEditable(e.target)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => input.current?.focus());
  }, [open]);

  // Keep the highlighted row visible when moving with the keyboard on short screens.
  const activeId = open && results[safeCursor] ? `${listId}-${results[safeCursor].id}` : null;
  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  // Track the capsule's size so the progress outline follows it exactly.
  useEffect(() => {
    const el = capsule.current;
    if (!el || open) return;
    const ro = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize?.[0];
      setSize({
        width: box ? box.inlineSize : el.offsetWidth,
        height: box ? box.blockSize : el.offsetHeight,
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  const onInputKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setCursor((safeCursor + step + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[safeCursor]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (!query && /^[1-6]$/.test(e.key)) {
      e.preventDefault();
      run(commands.find((c) => c.shortcut === e.key));
    }
  };

  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 420, damping: 38, mass: 0.9 };
  const groups = (["Go to", "Do"] as const)
    .map((group) => ({ group, items: results.filter((r) => r.group === group) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="scrim"
            aria-hidden
            className="fixed inset-0 z-40 bg-bg/50 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => close()}
          />
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-3 lg:bottom-auto lg:top-4">
        <div className="pointer-events-auto relative">
          <motion.div
            ref={capsule}
            layout
            transition={spring}
            style={{ borderRadius: open ? 22 : 999 }}
            className="relative overflow-hidden border border-line-strong bg-surface/80 shadow-[0_18px_50px_-20px_rgb(0_0_0/0.6)] backdrop-blur-xl"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {!open ? (
                <motion.button
                  key="collapsed"
                  ref={trigger}
                  type="button"
                  layout="position"
                  onClick={() => setOpen(true)}
                  aria-haspopup="dialog"
                  aria-expanded={false}
                  aria-label={`Open navigation, current section ${label}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex h-12 items-center gap-3 pl-1.5 pr-2 text-ink"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-surface-strong">
                    <LogoMark className="size-5" title="" />
                  </span>
                  <span className="min-w-[8.5ch] text-left font-mono text-[12px] tracking-[0.08em] uppercase">
                    <ScrambleLabel text={label} />
                  </span>
                  <span className="hidden items-center gap-1 rounded-md border border-line px-1.5 py-0.5 font-mono text-[10.5px] text-soft lg:inline-flex">
                    {mac ? "⌘" : "Ctrl"} K
                  </span>
                  <span className="grid size-9 place-items-center rounded-full bg-accent-fill text-accent-contrast lg:size-8">
                    <ListIcon size={16} weight="bold" />
                  </span>
                </motion.button>
              ) : (
                <motion.div
                  key="expanded"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Site navigation"
                  layout="position"
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, delay: reduce ? 0 : 0.06 }}
                  className="w-[min(560px,calc(100vw-1.5rem))]"
                >
                  <div className="flex items-center gap-3 border-b border-line px-4">
                    <MagnifyingGlassIcon size={18} weight="bold" className="shrink-0 text-soft" aria-hidden />
                    <input
                      ref={input}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setCursor(0);
                      }}
                      onKeyDown={onInputKey}
                      placeholder="Where to?"
                      role="combobox"
                      aria-expanded="true"
                      aria-controls={listId}
                      aria-activedescendant={results[safeCursor] ? `${listId}-${results[safeCursor].id}` : undefined}
                      aria-autocomplete="list"
                      className="h-14 min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-soft focus:outline-none focus-visible:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => close()}
                      className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10.5px] text-soft transition-colors hover:text-ink"
                    >
                      Esc
                    </button>
                  </div>

                  <div id={listId} role="listbox" aria-label="Destinations and actions" className="no-scrollbar max-h-[min(660px,72dvh)] overflow-y-auto p-2">
                    {groups.length === 0 && (
                      <p className="px-3 py-8 text-center text-sm text-soft">Nothing matches &ldquo;{query}&rdquo;.</p>
                    )}
                    {groups.map(({ group, items }) => (
                      <div key={group} role="group" aria-label={group} className="mb-1 last:mb-0">
                        <p className="px-3 pb-1 pt-2 font-mono text-[10.5px] tracking-[0.1em] text-soft uppercase">{group}</p>
                        {items.map((item) => {
                          const index = results.indexOf(item);
                          const selected = index === safeCursor;
                          const current = item.id === active;
                          return (
                            <div
                              key={item.id}
                              id={`${listId}-${item.id}`}
                              role="option"
                              aria-selected={selected}
                              onPointerMove={() => setCursor(index)}
                              onClick={() => run(item)}
                              className={`relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
                                selected ? "text-ink" : "text-muted"
                              }`}
                            >
                              {selected && (
                                <motion.span
                                  layoutId="command-cursor"
                                  transition={spring}
                                  className="absolute inset-0 rounded-xl bg-accent-soft"
                                />
                              )}
                              <span className={`relative grid size-8 place-items-center rounded-lg border ${selected ? "border-accent/40 text-accent" : "border-line text-soft"}`}>
                                {item.icon}
                              </span>
                              <span className="relative min-w-0 flex-1">
                                <span className="flex items-center gap-2 font-medium">
                                  {item.label}
                                  {current && (
                                    <span className="rounded-full border border-live/30 px-1.5 font-mono text-[10px] text-live">here</span>
                                  )}
                                </span>
                                <span className="block truncate text-xs text-soft">{item.hint}</span>
                              </span>
                              <span className="relative font-mono text-[11px] text-soft">
                                {selected ? (
                                  <ArrowElbowDownLeftIcon size={14} weight="bold" aria-hidden />
                                ) : item.shortcut ? (
                                  item.shortcut
                                ) : item.external ? (
                                  <ArrowUpRightIcon size={13} weight="bold" aria-hidden />
                                ) : null}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 font-mono text-[10.5px] text-soft">
                    <span className="hidden sm:inline">
                      <kbd className="text-muted">↑↓</kbd> move <kbd className="ml-2 text-muted">↵</kbd> go{" "}
                      <kbd className="ml-2 text-muted">1-6</kbd> jump
                    </span>
                    <span className="flex items-center gap-2">
                      <LogoMark className="size-3.5" title="" />
                      AHMXD Technologies
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          {!open && <ProgressRing width={size.width} height={size.height} />}
        </div>
      </div>
    </>
  );
}
