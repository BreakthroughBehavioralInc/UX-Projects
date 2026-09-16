import * as React from "react";
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Text,
} from "@everkit/design-system";
import type { SierraHandoffPayload } from "../data/scenarios";
import {
  HandoffActions,
  HandoffBody,
  HandoffCallIdLookup,
  HandoffCallMeta,
  HandoffClearButton,
  HandoffStatusAlert,
  useVerifyForm,
  VerifyFields,
} from "./HandoffPanel";
import { needsAuthentication } from "./utils";

/** Sticky top band — status alert pinned; expand for verify fields and full detail. */
export function HandoffTopBand({
  payload,
  lookupError,
  onClear,
  onLookup,
  onVerified,
}: {
  payload: SierraHandoffPayload | null;
  lookupError?: string | null;
  onClear?: () => void;
  onLookup?: (callId: string) => void;
  onVerified?: () => void;
}) {
  if (!payload) {
    return (
      <div
        className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--card)]"
        role="region"
        aria-label="Call summary"
      >
        <div className="flex flex-col gap-[var(--everkit-surface-gap)] px-4 py-3">
          <Text variant="body-small" weight="strong" className="uppercase tracking-wide text-muted-foreground">
            Call summary
          </Text>
          <div className="max-w-md">
            <HandoffCallIdLookup onLookup={onLookup} error={lookupError} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <HandoffTopBandPopulated payload={payload} onClear={onClear} onVerified={onVerified} />
  );
}

function HandoffTopBandPopulated({
  payload,
  onClear,
  onVerified,
}: {
  payload: SierraHandoffPayload;
  onClear?: () => void;
  onVerified?: () => void;
}) {
  const form = useVerifyForm(payload);
  const [expanded, setExpanded] = React.useState(() => needsAuthentication(payload));

  React.useEffect(() => {
    setExpanded(needsAuthentication(payload));
  }, [payload]);

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <div
        className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--card)]"
        role="region"
        aria-label="Call summary"
      >
        <div className="flex flex-wrap items-start gap-3 px-4 py-3">
          <div className="min-w-[240px] flex-1">
            <Text
              variant="body-small"
              weight="strong"
              className="mb-2 uppercase tracking-wide text-muted-foreground"
            >
              Call summary
            </Text>
            <HandoffStatusAlert payload={payload} />
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <HandoffActions payload={payload} form={form} onVerified={onVerified} />
            <CollapsibleTrigger asChild>
              <Button size="sm" variant="neutral-tertiary">
                {expanded ? "Hide details" : "Show details"}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent>
          <div className="border-t border-[var(--border)] bg-[var(--muted)] px-4 py-4">
            <div className="mx-auto flex max-w-5xl flex-col gap-4">
              <HandoffBody payload={payload} showCallMeta={false} />
              {form.spec && needsAuthentication(payload) ? (
                <VerifyFields payload={payload} form={form} />
              ) : null}
            </div>
          </div>
        </CollapsibleContent>

        <div className="flex flex-col gap-[var(--everkit-surface-gap)] border-t border-[var(--border)] px-4 py-3">
          <HandoffCallMeta payload={payload} />
          <HandoffClearButton onClear={onClear} className="w-fit" />
        </div>
      </div>
    </Collapsible>
  );
}
