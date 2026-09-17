"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { markLoaderDone } from "./loader-state";
import { SiteLoader } from "./site-loader";

// The loading screen waits for the homepage hero, so it only runs when a visit starts there.
// Decided once per visit: the root layout persists across navigation, so moving between pages
// never replays it.
export function LoaderGate() {
  const pathname = usePathname();
  const [show] = useState(() => pathname === "/");

  useEffect(() => {
    if (!show) markLoaderDone();
  }, [show]);

  return show ? <SiteLoader /> : null;
}
