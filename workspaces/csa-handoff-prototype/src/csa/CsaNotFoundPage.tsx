import { Icon, Text } from "@everkit/design-system";

export function CsaNotFoundPage({ page }: { page?: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--everkit-color-surface-neutral-subtle)]">
        <Icon
          name="construction"
          size="lg"
          fill={0}
          aria-hidden
          className="text-muted-foreground"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Text variant="title-default" weight="strong">
          404 — Page not found
        </Text>
        {page && (
          <Text variant="body-small" className="text-muted-foreground">
            &ldquo;{page}&rdquo; is not yet implemented in this prototype.
          </Text>
        )}
        {!page && (
          <Text variant="body-small" className="text-muted-foreground">
            This section is not yet implemented in this prototype.
          </Text>
        )}
      </div>
    </div>
  );
}
