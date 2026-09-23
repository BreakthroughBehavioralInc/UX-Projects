/**
 * HandoffPanelMvp — MVP Sierra screenpop. No chat experience.
 *
 * Layout:
 *   Fixed header  — patient name + TFN + auth/consent chips
 *   Static pane   — Call ID · unified handoff card (title + summary + script)
 *   Fixed footer  — Clear button
 *
 * No MessageList, no Composer, no streaming.
 * Suggested path and CTA (Start New Consultation) are Fast-Follow features.
 */

import * as React from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
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
import type { SierraHandoffPayload } from "../../data/scenarios";
import {
  HandoffCallIdLookup,
  useHandoffPanelSession,
} from "../HandoffPanel";
import type { TransferContextScenario } from "../../data/scenarios";
import {
  isMemberAuthenticated,
  needsAuthentication,
  isEmergencyHandoff,
} from "../utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SierraAction {
  type: "start_intake";
  context: unknown;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HANDOFF_SIDEBAR_VARS = {
  "--sidebar-width": "400px",
  "--sidebar-width-icon": "var(--everkit-sidenav-width-icon)",
} as React.CSSProperties;

const RAIL_SLIDE_MS = 300;

// ---------------------------------------------------------------------------
// Unified handoff card data
// ---------------------------------------------------------------------------

export type CardVariant = "auth" | "not-auth" | "emergency";

export interface HandoffCard {
  title: string;
  summary: string;
  script: string | null;
  variant: CardVariant;
}

// Intents that are informational, not booking-oriented — callerStatement is a
// question/sentence, not a chief complaint, so don't use it in the title.
const INQUIRY_INTENTS = new Set(["dermatology"]);

const SERVICE_LINE_TITLES: Record<string, string> = {
  dermatology: "Dermatology",
  behavioral_health: "Behavioral Health",
  urgent_care: "Urgent Care",
  primary_care: "Primary Care",
  wellness: "Wellness",
};

const INTENT_TITLES: Record<string, string> = {
  mental_health_crisis: "Mental health crisis",
};

const NON_VISIT_INTENT_TITLES: Record<string, string> = {
  billing_inquiry: "Billing inquiry",
  retention_attempt: "Retention — caller wanted to disconnect",
};

const PHARMACY_CALLER_TYPES = new Set<string>(["pharmacy", "provider"]);
const SPANISH_CALLER_TYPES = new Set<string>(["spanish_member"]);

function formatDobReadback(dob: string | undefined): string | null {
  if (!dob) return null;
  const m = dob.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[2]}/${m[3]}/${m[1]}` : dob;
}

export function buildHandoffCard(
  payload: SierraHandoffPayload,
  patientConfirmed = false
): HandoffCard {
  const emergency = isEmergencyHandoff(payload);
  const auth = isMemberAuthenticated(payload);
  const isPharmacy = PHARMACY_CALLER_TYPES.has(payload.callerType);
  const isSpanish = SPANISH_CALLER_TYPES.has(payload.callerType);
  const isCaregiver = payload.callerType === 'caregiver_proxy';
  const isInquiry = INQUIRY_INTENTS.has(payload.intent);
  const isBilling = payload.intent === 'billing_inquiry';
  const consentBlocked = isConsentBlocked(payload);
  const firstName =
    payload.matchedPatient?.firstName ?? payload.collectedFields.firstName ?? "there";
  const chiefComplaint = payload.visitReason?.callerStatement
    ? payload.visitReason.callerStatement.replace(/\.$/, "").toLowerCase()
    : null;

  let title: string;
  if (emergency) {
    title =
      INTENT_TITLES[payload.intent] ??
      SERVICE_LINE_TITLES[payload.visitReason?.suggestedServiceLine ?? ""] ??
      "Emergency";
  } else if (isPharmacy) {
    title = "Pharmacy on behalf of patient";
  } else if (isCaregiver) {
    title = chiefComplaint ? `Visit for a ${chiefComplaint} — minor patient` : "Visit — minor patient";
  } else if (isSpanish) {
    title = "Spanish-speaking caller";
  } else if (isInquiry) {
    const svc = payload.visitReason?.suggestedServiceLine;
    title = (svc && SERVICE_LINE_TITLES[svc]) ?? "Inquiry";
  } else if (NON_VISIT_INTENT_TITLES[payload.intent]) {
    title = NON_VISIT_INTENT_TITLES[payload.intent];
  } else {
    // Booking — "Visit for a [complaint]"
    if (chiefComplaint) {
      const article = /^[aeiou]/i.test(chiefComplaint) ? "an" : "a";
      title = `Visit for ${article} ${chiefComplaint}`;
    } else {
      const svc = payload.visitReason?.suggestedServiceLine;
      title = (svc && svc !== "unknown" && SERVICE_LINE_TITLES[svc]) ? `Visit — ${SERVICE_LINE_TITLES[svc]}` : "Visit";
    }
  }

  if (emergency) {
    const knownName = payload.matchedPatient?.firstName ?? payload.collectedFields.firstName ?? null;
    const emergencyScript = knownName
      ? `"${knownName}, I understand this may be an emergency — I'm here with you right now. Can you tell me what's happening?"`
      : `"I understand this may be an emergency — I'm here with you right now. Can you tell me what's happening?"`;
    return {
      title,
      summary: payload.intentSummary,
      script: emergencyScript,
      variant: "emergency",
    };
  }

  const isRetention = payload.intent === 'retention_attempt';

  let script: string;

  const isBehavioralHealth = payload.visitReason?.suggestedServiceLine === 'behavioral_health';

  if (isRetention) {
    const cf = payload.collectedFields;
    const hasIntent = !!(payload.visitReason?.callerStatement || payload.visitReason?.suggestedServiceLine);
    const hasName = !!cf.firstName;
    const hasDob = !!cf.dob;
    const dobReadback = formatDobReadback(cf.dob);
    const intentTopic = chiefComplaint
      ?? (payload.visitReason?.suggestedServiceLine
          ? (SERVICE_LINE_TITLES[payload.visitReason.suggestedServiceLine] ?? payload.visitReason.suggestedServiceLine.replace(/_/g, " "))
          : null);

    if (hasIntent && hasName && hasDob) {
      script = `"Hi ${cf.firstName}, thanks for staying on the line. I see you were calling about ${intentTopic} — I just need to confirm your date of birth as ${dobReadback}, and then I can help you right away."`;
    } else if (hasIntent && hasName) {
      script = `"Hi ${cf.firstName}, thanks for staying on the line. I see you were calling about ${intentTopic} — I'm a live agent and I'm here to help with that."`;
    } else if (hasIntent) {
      script = `"Hi, thanks for staying on the line. I see you were calling about ${intentTopic} — I'm a live agent and I'm here to help with that. Could I get your name?"`;
    } else {
      script = `"Hi, thanks for staying on the line. I know our automated system wasn't quite what you needed — I'm a live agent and I'm here to help. What's going on today?"`;
    }
  } else if (isSpanish) {
    script = `"Hola, gracias por llamar. ¿En qué le puedo ayudar hoy?"`;
  } else if (isPharmacy) {
    if (auth) {
      const patientName = payload.matchedPatient
        ? `${payload.matchedPatient.firstName} ${payload.matchedPatient.lastName}`
        : "the patient";
      script = `"Hi, thanks for holding. I understand you're calling on behalf of ${patientName} — how can I help you today?"`;
    } else {
      const cf = payload.collectedFields;
      const nameReadback = [cf.firstName, cf.lastName].filter(Boolean).join(" ");
      const dobReadback = formatDobReadback(cf.dob);
      const phoneReadback = cf.phone ?? null;
      const fields = [
        nameReadback || null,
        dobReadback ? `DOB as ${dobReadback}` : null,
        phoneReadback ? `and Phone as ${phoneReadback}` : null,
      ]
        .filter(Boolean)
        .join(", ");
      script = `"Hi, thanks for holding. I understand you're calling on behalf of a patient. I'll need to verify the patient's information — I have ${fields} — is that correct?"`;
    }
  } else if (isCaregiver) {
    const patientName = payload.matchedPatient
      ? `${payload.matchedPatient.firstName} ${payload.matchedPatient.lastName}`
      : "your child";
    script = chiefComplaint
      ? `"Hi, thanks for holding. I understand you're calling on behalf of ${patientName} for a ${chiefComplaint} — let me help you get that booked."`
      : `"Hi, thanks for holding. I understand you're calling on behalf of ${patientName} — how can I help you today?"`;
  } else if (consentBlocked) {
    script = chiefComplaint
      ? `"Hi ${firstName}, thanks for holding. I see you're calling about a ${chiefComplaint} visit — I do need to let you know that without your consent to our service agreement, I'm unable to book an appointment. Would you like me to walk you through the consent process now?"`
      : `"Hi ${firstName}, thanks for holding. I need to let you know that without your consent to our service agreement, I'm unable to book an appointment. Would you like me to walk you through the consent process now?"`;
  } else if (auth) {
    if (isBilling) {
      script = `"Hi ${firstName}, thanks for holding. I understand you have a question about your billing — I'm happy to help. What would you like to know?"`;
    } else if (isInquiry) {
      const svcName = payload.visitReason?.suggestedServiceLine?.replace(/_/g, " ") ?? "our services";
      script = `"Hi ${firstName}, thanks for holding. I understand you have some questions about ${svcName} — what would you like to know?"`;
    } else if (isBehavioralHealth) {
      script = `"Hi ${firstName}, thanks for holding. I understand you're looking to schedule a behavioral health appointment — I'm here to help you get that set up."`;
    } else {
      script = chiefComplaint
        ? `"Hi ${firstName}, thanks for holding. I understand you're calling about needing a visit to take care of your ${chiefComplaint} — a call with one of our next available providers could help. Does that sound right?"`
        : `"Hi ${firstName}, thanks for holding. How can I help you today?"`;
    }
  } else {
    const cf = payload.collectedFields;
    const nameReadback = [cf.firstName, cf.lastName].filter(Boolean).join(" ");
    const dobReadback = formatDobReadback(cf.dob);
    const phoneReadback = cf.phone ?? null;
    const svcName = payload.visitReason?.suggestedServiceLine?.replace(/_/g, " ") ?? "our services";
    const complaintIntro = isInquiry
      ? `I see you have some questions about ${svcName}. `
      : chiefComplaint
        ? `I see you need help with your ${chiefComplaint}, `
        : "";
    const fields = [
      nameReadback || null,
      dobReadback ? `DOB as ${dobReadback}` : null,
      phoneReadback ? `and Phone as ${phoneReadback}` : null,
    ]
      .filter(Boolean)
      .join(", ");
    script = isInquiry
      ? `"Hi ${cf.firstName ?? "there"}, ${complaintIntro}I just need to double-check your information first — I have ${fields} — is this correct?"`
      : `"Hi ${cf.firstName ?? "there"}, ${complaintIntro}I would just need to double check your information, I have ${fields} — is this correct?"`;
  }

  return {
    title,
    summary: payload.intentSummary,
    script,
    variant: deriveCardVariant(payload, patientConfirmed),
  };
}

// ---------------------------------------------------------------------------
// Status chips
// ---------------------------------------------------------------------------

export interface StatusChip {
  id: string;
  icon: string;
  fill: 0 | 1;
  colorToken: string;
  label: string;
}

const SCHEDULING_INTENTS = new Set(["schedule_care", "dermatology"]);

export function isConsentBlocked(p: SierraHandoffPayload): boolean {
  return p.consentStatus === "declined" && SCHEDULING_INTENTS.has(p.intent);
}

/** Derives card visual severity from chip state — auth/consent warnings bubble up to the card. */
export function deriveCardVariant(
  p: SierraHandoffPayload,
  patientConfirmed = false
): CardVariant {
  if (isEmergencyHandoff(p) || isConsentBlocked(p)) return "emergency";
  if (SPANISH_CALLER_TYPES.has(p.callerType)) return "auth"; // language-routed: auth N/A
  const authWarning =
    needsAuthentication(p) && !isMemberAuthenticated(p) && !patientConfirmed;
  const consentWarning =
    p.consentStatus === "deferred_patient_consent" || p.consentStatus === "declined";
  if (authWarning || consentWarning) return "not-auth";
  return "auth";
}

export function buildStatusChips(p: SierraHandoffPayload, patientConfirmed = false): StatusChip[] {
  const chips: StatusChip[] = [];

  if (isEmergencyHandoff(p)) {
    chips.push({
      id: "emergency",
      icon: "emergency",
      fill: 1,
      colorToken: "--everkit-color-content-error",
      label: "Emergency",
    });
  }

  // Spanish callers bypass auth/consent — show a language chip only
  if (SPANISH_CALLER_TYPES.has(p.callerType)) {
    chips.push({
      id: "language",
      icon: "translate",
      fill: 1,
      colorToken: "--everkit-color-content-info",
      label: "Spanish speaker",
    });
    return chips;
  }

  if (isMemberAuthenticated(p) || patientConfirmed) {
    chips.push({
      id: "auth",
      icon: "verified_user",
      fill: 1,
      colorToken: "--everkit-color-content-success",
      label: "Authenticated",
    });
  } else if (needsAuthentication(p)) {
    chips.push({
      id: "auth",
      icon: "warning",
      fill: 1,
      colorToken: "--everkit-color-content-warning",
      label: "Not authenticated",
    });
  }

  if (p.consentStatus === "captured") {
    chips.push({
      id: "consent",
      icon: "check_circle",
      fill: 1,
      colorToken: "--everkit-color-content-success",
      label: "Consent Given",
    });
  } else if (p.consentStatus === "declined") {
    const blocked = isConsentBlocked(p);
    chips.push({
      id: "consent",
      icon: blocked ? "block" : "warning",
      fill: 1,
      colorToken: blocked ? "--everkit-color-content-error" : "--everkit-color-content-warning",
      label: "Consent Not Accepted",
    });
  } else if (p.consentStatus === "deferred_patient_consent") {
    chips.push({
      id: "consent",
      icon: "warning",
      fill: 1,
      colorToken: "--everkit-color-content-warning",
      label: "Consent not read",
    });
  }

  return chips;
}

// ---------------------------------------------------------------------------
// Unified handoff card
// ---------------------------------------------------------------------------

const QUOTE_BORDER: Record<CardVariant, string> = {
  auth: "border-[var(--everkit-color-border-brand)]",
  "not-auth": "border-[var(--everkit-color-border-warning)]",
  emergency: "border-[var(--everkit-color-border-error)]",
};

const CARD_BORDER: Record<CardVariant, string> = {
  auth: "border-[var(--border)]",
  "not-auth": "border-[var(--everkit-color-border-warning)]",
  emergency: "border-[var(--everkit-color-border-error)]",
};

const BADGE_VARIANT: Record<CardVariant, "brand" | "warning" | "error"> = {
  auth: "brand",
  "not-auth": "warning",
  emergency: "error",
};

function MvpHandoffCard({
  card,
  payload,
  fastFollow = false,
  onSierraAction,
}: {
  card: HandoffCard;
  payload: SierraHandoffPayload;
  fastFollow?: boolean;
  onSierraAction?: (action: SierraAction) => void;
}) {
  const isEmergency = isEmergencyHandoff(payload);

  const showNextStep =
    fastFollow &&
    !isEmergency &&
    !PHARMACY_CALLER_TYPES.has(payload.callerType) &&
    !INQUIRY_INTENTS.has(payload.intent);

  const svc = payload.visitReason?.suggestedServiceLine;
  const svcName =
    svc && svc !== "unknown"
      ? svc.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : null;

  return (
    <Card
      shadow={false}
      className={cn("border py-0", CARD_BORDER[card.variant])}
    >
      <CardContent className="flex flex-col gap-3 px-3 py-2.5">
        <div className="flex items-start gap-2.5">
          <IconBadge
            icon="auto_awesome"
            fill={1}
            size="sm"
            variant={BADGE_VARIANT[card.variant]}
            className="mt-0.5 shrink-0"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Heading level={3} variant="title-small">
              {card.title}
            </Heading>

            {/* Summary — intent/reason only, no auth/consent info */}
            <div className={cn("border-l-2 pl-2", QUOTE_BORDER[card.variant])}>
              <Text variant="body-small" className="text-muted-foreground">
                {card.summary}
              </Text>
            </div>

            {/* Suggested script */}
            {card.script && (
              <div className="flex flex-col gap-0.5 border-t border-[var(--border)] pt-2">
                <Text variant="meta-small" className="uppercase tracking-wider text-muted-foreground">
                  Suggested script
                </Text>
                <Text variant="body-small" className="italic text-muted-foreground">
                  {card.script}
                </Text>
              </div>
            )}

            {/* Suggested next step — Fast-Follow only */}
            {showNextStep && (
              <div className="flex flex-col gap-1.5 border-t border-[var(--border)] pt-2">
                <Text variant="meta-small" className="uppercase tracking-wider text-muted-foreground">
                  Suggested next step
                </Text>
                <Button
                  variant="brand-primary"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    onSierraAction?.({ type: "start_intake", context: { serviceLine: svc } })
                  }
                >
                  <Icon name="arrow_forward" size="sm" fill={0} aria-hidden className="mr-1.5 shrink-0" />
                  {svcName ? `Start ${svcName} intake` : "Start intake"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Crisis Protocol CTA — emergency only */}
        {isEmergency && (
          <Button variant="destructive" className="w-full">
            <Icon name="emergency" size="sm" fill={1} aria-hidden className="mr-1.5 shrink-0" />
            Crisis Protocol
          </Button>
        )}
      </CardContent>
    </Card>
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
      <Text variant="meta-small" className="text-muted-foreground">
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
// Idle state — no active call
// ---------------------------------------------------------------------------

function MvpIdleState({
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
// Static pane — scrollable content
// ---------------------------------------------------------------------------

function MvpStaticPane({
  payload,
  fastFollow = false,
  patientConfirmed = false,
  onSierraAction,
}: {
  payload: SierraHandoffPayload;
  fastFollow?: boolean;
  patientConfirmed?: boolean;
  onSierraAction?: (action: SierraAction) => void;
}) {
  const card = React.useMemo(
    () => buildHandoffCard(payload, patientConfirmed),
    [payload, patientConfirmed]
  );

  return (
    <div className="flex flex-col gap-4 px-[var(--everkit-surface-padding)] py-3">
      <Text variant="meta-small" className="text-muted-foreground">
        Call ID: {payload.interactionId}
      </Text>
      <MvpHandoffCard
        card={card}
        payload={payload}
        fastFollow={fastFollow}
        onSierraAction={onSierraAction}
      />
      <HandoffRating payloadKey={payload.interactionId} />
    </div>
  );
}


// ---------------------------------------------------------------------------
// HandoffRailPanelMvp — the sidebar panel
// ---------------------------------------------------------------------------

export function HandoffRailPanelMvp({
  payload,
  side = "right",
  lookupError,
  onClear,
  onLookup,
  onSierraAction,
  patientConfirmed = false,
  fastFollow = false,
}: {
  payload: SierraHandoffPayload | null;
  side?: "left" | "right";
  lookupError?: string | null;
  onClear?: () => void;
  onLookup?: (callId: string) => void;
  onSierraAction?: (action: SierraAction) => void;
  patientConfirmed?: boolean;
  fastFollow?: boolean;
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
          {/* Header — patient identity + TFN + chips (no call status) */}
          <SidebarHeader className="shrink-0 p-0">
            {payload ? (
              <div className="flex flex-col gap-1.5 px-[var(--everkit-surface-padding)] py-3 group-data-[collapsible=icon]:hidden">
                <div className="min-w-0">
                  <Heading level={2} variant="title-default" className="truncate leading-tight">
                    {patientName}
                  </Heading>
                  <Text variant="meta-small" className="truncate text-muted-foreground">
                    TFN {payload.tfn}
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

          {/* Scrollable content + Clear button pinned to bottom */}
          <SidebarContent className="overflow-hidden p-0 group-data-[collapsible=icon]:hidden">
            <div className="flex h-full min-h-0 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto">
                {payload ? (
                  <MvpStaticPane
                    payload={payload}
                    fastFollow={fastFollow}
                    patientConfirmed={patientConfirmed}
                    onSierraAction={onSierraAction}
                  />
                ) : (
                  <MvpIdleState onLookup={onLookup} error={lookupError} />
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
// HandoffRailMvp — animated slide wrapper
// ---------------------------------------------------------------------------

export function HandoffRailMvp({
  activeCall,
  payload,
  side = "right",
  lookupError,
  onClear,
  onLookup,
  onSierraAction,
  patientConfirmed = false,
  fastFollow = false,
}: {
  activeCall: boolean;
  payload: SierraHandoffPayload | null;
  side?: "left" | "right";
  lookupError?: string | null;
  onClear?: () => void;
  onLookup?: (callId: string) => void;
  onSierraAction?: (action: SierraAction) => void;
  patientConfirmed?: boolean;
  fastFollow?: boolean;
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
            <HandoffRailPanelMvp
              payload={payload}
              side={side}
              lookupError={lookupError}
              onClear={onClear}
              onLookup={onLookup}
              onSierraAction={onSierraAction}
              patientConfirmed={patientConfirmed}
              fastFollow={fastFollow}
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
