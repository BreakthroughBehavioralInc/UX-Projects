/**
 * HandoffPanelV2 — V2 Sierra screenpop.
 *
 * Visual changes from V1:
 *  1. Auth card: no IconBadge
 *  2. Not-auth card: warning icon in IconBadge
 *  3. Emergency card: emergency icon in IconBadge
 *  4. Summary: no left border line
 *  5. Summary → script: no separator, gap-2 (8px) only
 *  6. AI attribution meta (auto_awesome + "Sierra") below the card
 */

import * as React from "react";
import {
  Button,
  Card,
  CardContent,
  cn,
  FieldNote,
  Heading,
  Icon,
  IconBadge,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  Text,
  Textarea,
} from "@everkit/design-system";
import type { SierraHandoffPayload, TransferContextScenario } from "../../data/scenarios";
import { HandoffCallIdLookup, useHandoffPanelSession } from "../HandoffPanel";
import {
  buildHandoffCard,
  buildStatusChips,
  deriveCardVariant,
  isConsentBlocked,
  type HandoffCard,
  type CardVariant,
  type SierraAction,
} from "../mvp/HandoffPanelMvp";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HANDOFF_SIDEBAR_VARS = {
  "--sidebar-width": "400px",
  "--sidebar-width-icon": "var(--everkit-sidenav-width-icon)",
} as React.CSSProperties;

const RAIL_SLIDE_MS = 300;

const CARD_BORDER: Record<CardVariant, string> = {
  auth: "border-[var(--border)]",
  "not-auth": "border-[var(--everkit-color-border-warning)]",
  emergency: "border-[var(--everkit-color-border-error)]",
};

// Auth has no badge; not-auth and emergency each get a meaningful icon
const BADGE_ICON: Partial<Record<CardVariant, string>> = {
  "not-auth": "warning",
  emergency: "emergency",
};

const BADGE_VARIANT: Record<CardVariant, "brand" | "warning" | "error"> = {
  auth: "brand",
  "not-auth": "warning",
  emergency: "error",
};

// ---------------------------------------------------------------------------
// V2 handoff card
// ---------------------------------------------------------------------------

function V2HandoffCard({ card, isBlocked = false }: { card: HandoffCard; isBlocked?: boolean }) {
  const isEmergency = card.variant === "emergency" && !isBlocked;
  const badgeIcon = isBlocked ? "block" : BADGE_ICON[card.variant];
  const badgeVariant = isBlocked ? "error" : BADGE_VARIANT[card.variant];
  const borderClass = isBlocked
    ? "border-[var(--everkit-color-border-error)]"
    : CARD_BORDER[card.variant];

  return (
    <Card shadow={false} className={cn("border py-0", borderClass)}>
      <CardContent className="flex flex-col gap-3 px-3 py-2.5">
        <div className="flex items-start gap-2.5">
          {badgeIcon && (
            <IconBadge
              icon={badgeIcon}
              fill={1}
              size="sm"
              variant={badgeVariant}
              className="mt-0.5 shrink-0"
            />
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Heading level={3} variant="title-small">
              {card.title}
            </Heading>

            <Text variant="body-small" className="text-muted-foreground">
              {card.summary}
            </Text>

            {card.script && (
              <div className="flex flex-col gap-1.5 rounded-lg bg-muted px-2.5 py-2">
                <Text variant="label-small" className="text-muted-foreground">
                  Suggested script
                </Text>
                <Text variant="body-small" className="text-muted-foreground">
                  {card.script}
                </Text>
              </div>
            )}
          </div>
        </div>

        {isEmergency && (
          <Button variant="destructive" className="w-full">
            Crisis Protocol
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Static pane
// ---------------------------------------------------------------------------

function V2StaticPane({
  payload,
  patientConfirmed = false,
}: {
  payload: SierraHandoffPayload;
  patientConfirmed?: boolean;
}) {
  const card = React.useMemo(
    () => buildHandoffCard(payload, patientConfirmed),
    [payload, patientConfirmed]
  );
  const blocked = isConsentBlocked(payload);

  return (
    <div className="flex flex-col gap-3 px-[var(--everkit-surface-padding)] py-3">
      <V2HandoffCard card={card} isBlocked={blocked} />
      {/* AI attribution — right-aligned */}
      <div className="flex items-center justify-end gap-1.5">
        <Icon
          name="auto_awesome"
          size="xs"
          fill={1}
          aria-hidden
          className="shrink-0 text-muted-foreground"
        />
        <Text variant="meta-small" className="text-muted-foreground">
          AI Generated
        </Text>
      </div>
      <HandoffRating payloadKey={payload.interactionId} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Handoff rating — thumbs up/down below the card
// ---------------------------------------------------------------------------

function HandoffRating({ payloadKey }: { payloadKey: string }) {
  const [rating, setRating] = React.useState<"up" | "down" | null>(null);
  const [feedback, setFeedback] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    setRating(null);
    setFeedback("");
    setSubmitted(false);
  }, [payloadKey]);

  const thanked = rating === "up" || submitted;

  return (
    <div className="flex flex-col gap-2">
      <Text variant="label-default" className="text-muted-foreground">
        Was this helpful?
      </Text>
      {thanked ? (
        <Text variant="body-small" className="text-muted-foreground">
          Thanks for your feedback!
        </Text>
      ) : rating === "down" ? (
        <div className="flex flex-col gap-2">
          <Text variant="label-small" className="text-muted-foreground">
            What could go better?
          </Text>
          <Textarea
            id="handoff-feedback"
            value={feedback}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value)}
            rows={2}
            className="resize-none text-sm"
            aria-label="What could go better?"
            aria-describedby="handoff-feedback-note"
          />
          <FieldNote id="handoff-feedback-note" status="neutral">Optional</FieldNote>
          <Button size="sm" className="w-fit" onClick={() => setSubmitted(true)}>
            Submit
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button size="sm" variant="neutral-secondary" onClick={() => setRating("up")}>
            <Icon name="thumb_up" size="sm" fill={0} aria-hidden className="mr-1" />
            Yes
          </Button>
          <Button size="sm" variant="neutral-secondary" onClick={() => setRating("down")}>
            <Icon name="thumb_down" size="sm" fill={0} aria-hidden className="mr-1" />
            No
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Idle state
// ---------------------------------------------------------------------------

function V2IdleState({
  onLookup,
  error,
}: {
  onLookup?: (callId: string) => void;
  error?: string | null;
}) {
  return (
    <div className="flex flex-col gap-6 p-[var(--everkit-surface-padding)]">
      <div className="flex flex-col items-center gap-3 pt-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--everkit-color-surface-brand-subtle)]">
          <Icon
            name="phone_in_talk"
            size="md"
            fill={1}
            aria-hidden
            className="text-[var(--everkit-color-brand-primary)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="body-default" weight="strong">
            Sierra handoff
          </Text>
          <Text variant="body-small" className="text-muted-foreground">
            No active call. Enter a Call ID to load the handoff.
          </Text>
        </div>
      </div>
      <HandoffCallIdLookup onLookup={onLookup} error={error} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// HandoffRailPanelV2
// ---------------------------------------------------------------------------

export function HandoffRailPanelV2({
  payload,
  side = "right",
  lookupError,
  onClear,
  onLookup,
  onSierraAction: _onSierraAction,
  onVerified: _onVerified,
  patientConfirmed = false,
}: {
  payload: SierraHandoffPayload | null;
  side?: "left" | "right";
  lookupError?: string | null;
  onClear?: () => void;
  onLookup?: (callId: string) => void;
  onSierraAction?: (action: SierraAction) => void;
  onVerified?: () => void;
  patientConfirmed?: boolean;
}) {
  const [open, setOpen] = React.useState(true);
  const panelKey = payload?.interactionId ?? "cleared";

  React.useEffect(() => {
    setOpen(true);
  }, [panelKey]);

  const borderClass =
    side === "left"
      ? "border-r-2 border-[var(--border)]"
      : "border-l-2 border-[var(--border)]";

  const statusChips = payload ? buildStatusChips(payload, patientConfirmed) : [];
  const patientName = payload
    ? payload.matchedPatient
      ? `${payload.matchedPatient.firstName} ${payload.matchedPatient.lastName}`
      : payload.collectedFields.firstName
        ? `${payload.collectedFields.firstName ?? ""} ${payload.collectedFields.lastName ?? ""}`.trim()
        : "Unknown caller"
    : null;

  return (
    <div
      className="relative h-full shrink-0 overflow-hidden [transform:translateZ(0)]"
      aria-label="Sierra handoff"
    >
      <SidebarProvider
        open={open}
        onOpenChange={setOpen}
        className="h-full min-h-0"
        style={HANDOFF_SIDEBAR_VARS}
      >
        <Sidebar
          side={side}
          collapsible="none"
          className={`h-full ${borderClass} shadow-[var(--everkit-shadow-sm)]`}
        >
          <SidebarHeader className="shrink-0 p-0">
            {payload ? (
              <div className="flex flex-col gap-1.5 px-[var(--everkit-surface-padding)] py-3 group-data-[collapsible=icon]:hidden">
                <div className="min-w-0">
                  <Heading level={2} variant="title-default" className="truncate leading-tight">
                    {patientName}
                  </Heading>
                  <Text variant="meta-small" className="truncate text-muted-foreground">
                    TFN {payload.tfn} · {payload.interactionId}
                  </Text>
                </div>
                {statusChips.length > 0 && (
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {statusChips.map((chip) => (
                      <div key={chip.id} className="flex items-center gap-1">
                        <Icon
                          name={chip.icon}
                          size="xs"
                          fill={chip.fill}
                          aria-hidden
                          className={`shrink-0 text-[var(${chip.colorToken})]`}
                        />
                        <Text variant="meta-small" className="text-muted-foreground">
                          {chip.label}
                        </Text>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="px-[var(--everkit-surface-padding)] py-3 group-data-[collapsible=icon]:hidden">
                <Text
                  variant="meta-small"
                  weight="strong"
                  className="uppercase tracking-wider text-muted-foreground"
                >
                  Sierra handoff
                </Text>
              </div>
            )}
          </SidebarHeader>

          <SidebarContent className="overflow-hidden p-0 group-data-[collapsible=icon]:hidden">
            <div className="flex h-full min-h-0 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto">
                {payload ? (
                  <V2StaticPane payload={payload} patientConfirmed={patientConfirmed} />
                ) : (
                  <V2IdleState onLookup={onLookup} error={lookupError} />
                )}
              </div>
              {payload && (
                <div className="shrink-0 border-t border-[var(--border)] p-[var(--everkit-surface-padding)]">
                  <Button
                    variant="neutral-secondary"
                    size="sm"
                    className="w-full"
                    onClick={onClear}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HandoffRailV2 — animated slide wrapper (used by left rail layout)
// ---------------------------------------------------------------------------

export function HandoffRailV2({
  activeCall,
  payload,
  side = "right",
  lookupError,
  onClear,
  onLookup,
  onSierraAction,
  onVerified,
  patientConfirmed = false,
}: {
  activeCall: boolean;
  payload: SierraHandoffPayload | null;
  side?: "left" | "right";
  lookupError?: string | null;
  onClear?: () => void;
  onLookup?: (callId: string) => void;
  onSierraAction?: (action: SierraAction) => void;
  onVerified?: () => void;
  patientConfirmed?: boolean;
}) {
  const [mounted, setMounted] = React.useState(activeCall);
  const slideClosed = side === "left" ? "-translate-x-full" : "translate-x-full";

  React.useEffect(() => {
    if (activeCall) {
      setMounted(true);
      return;
    }
    const timer = window.setTimeout(() => setMounted(false), RAIL_SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [activeCall]);

  return (
    <>
      <div
        aria-hidden={!activeCall}
        className={`shrink-0 overflow-hidden transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-out)] motion-reduce:transition-none ${
          activeCall ? "w-[400px]" : "w-0"
        }`}
      >
        <div
          className={`h-full transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] motion-reduce:transition-none ${
            activeCall ? "translate-x-0" : slideClosed
          }`}
        >
          {mounted ? (
            <HandoffRailPanelV2
              payload={payload}
              side={side}
              lookupError={lookupError}
              onClear={onClear}
              onLookup={onLookup}
              onSierraAction={onSierraAction}
              onVerified={onVerified}
              patientConfirmed={patientConfirmed}
            />
          ) : null}
        </div>
      </div>
      <div aria-live="polite" className="sr-only">
        {activeCall ? "Sierra handoff is active." : ""}
      </div>
    </>
  );
}

export { useHandoffPanelSession };
export type { TransferContextScenario };
