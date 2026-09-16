import { PageContainer, cn } from "@everkit/design-system";

/** CSA application page column — full viewport width, left-aligned (ops / non-consumer). */
export function CsaPageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <PageContainer size="full" className={cn("mx-0 py-[var(--everkit-content-gap-block)]", className)}>
      {children}
    </PageContainer>
  );
}
