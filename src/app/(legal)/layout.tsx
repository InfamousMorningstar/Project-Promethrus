import type { ReactNode } from "react";
import { LegalFooter, LegalHeader } from "@/components/legal/legal-chrome";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LegalHeader />
      <main id="main">{children}</main>
      <LegalFooter />
    </>
  );
}
