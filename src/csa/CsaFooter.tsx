import { Footer, FooterBrand, FooterMicrocopy } from "@everkit/design-system";

/** CSA global footer — Evernorth brand strip and copyright. */
export function CsaFooter() {
  return (
    <Footer surface="brand" className="shrink-0 [&>div]:gap-0 [&>div]:py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <FooterBrand brand="evernorth" size="sm" />
        <FooterMicrocopy>Copyright ©2026 MD Live by Evernorth</FooterMicrocopy>
      </div>
    </Footer>
  );
}
