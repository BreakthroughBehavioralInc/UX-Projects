/**
 * HandoffPanelV3 — Future / Ideal: Sierra as a persistent AI co-pilot.
 *
 * The panel IS the Sierra chat. No tabs, no mode switching — the moment a
 * call lands, Sierra is already talking to the advocate.
 *
 * Layout:
 *   Fixed header  — patient name (hero) + auth/consent status chips + call meta
 *   MessageList   — full-height, sticky-to-bottom
 *   Composer      — docked at the bottom, border-t separator
 *
 * Sierra's first message:
 *   • Authenticated  → intentSummary + action card "Start New Consultation"
 *   • Not-auth       → intentSummary + action card "Patient Search — pre-filled"
 *
 * Action card states:  idle → loading (800ms) → done
 *   After "done": fires onSierraAction callback (workspace navigates)
 *             + appends Sierra confirmation message
 *
 * Not-auth → patientConfirmed prop: when the advocate picks a patient from
 * the workspace search, the layout flips patientConfirmed=true, which triggers
 * Sierra to send a follow-up message with a new "Start Intake" action card.
 *
 * Implementation gap (real → future):
 *   Mock keyword responses → POST /sierra/post-handoff-query + SSE streaming.
 *   DS components (MessageList/ChatMessage/Composer) are production-ready.
 */

import * as React from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  ChatMessage,
  ChatMessageGroup,
  cn,
  Composer,
  Heading,
  Icon,
  IconBadge,
  MessageList,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  Text,
} from "@everkit/design-system";
import type { SierraHandoffPayload } from "../../data/scenarios";
import {
  HandoffCallIdLookup,
  useHandoffPanelSession,
} from "../HandoffPanel";
import type { TransferContextScenario } from "../../data/scenarios";
import { buildIntakeContext, getServiceOptionForLine, type IntakeContext } from "../../csa/intake/types";
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
  context: IntakeContext;
}

type ActionCardState = "idle" | "loading" | "done";

interface ActionCard {
  type: "start_intake" | "search_patient";
  context?: IntakeContext;
  label: string;
  sublabel: string;
  prefillNote: string;
}

interface SierraMsg {
  id: string;
  role: "assistant" | "user" | "system";
  ai?: boolean;
  /** Scripted line for the agent to read aloud — rendered as a coaching prompt, not a chat bubble. */
  script?: boolean;
  content: string;
  actionCard?: ActionCard;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HANDOFF_SIDEBAR_VARS = {
  "--sidebar-width": "400px",
  "--sidebar-width-icon": "var(--everkit-sidenav-width-icon)",
} as React.CSSProperties;

const RAIL_SLIDE_MS = 300;
const ACTION_LOAD_MS = 800;
const THINK_MS = 1200;

// ---------------------------------------------------------------------------
// Mock response engine
// ---------------------------------------------------------------------------

interface MockRule {
  keywords: string[];
  response: (p: SierraHandoffPayload) => string;
}

const MOCK_RULES: MockRule[] = [
  {
    keywords: ["say", "exact", "statement", "verbatim", "words", "quote"],
    response: (p) => {
      const stmt = p.visitReason?.callerStatement;
      return stmt
        ? `He said "${stmt}" — captured passively while he described his reason for calling.`
        : "I didn't capture a direct caller statement — the visit reason was inferred from context.";
    },
  },
  {
    keywords: ["prior visit", "visit history", "past visit", "appointment history", "before"],
    response: () =>
      "I don't have access to visit history from the IVR. His account shows active eligibility — check the Appointments tab.",
  },
  {
    keywords: ["consent"],
    response: (p) => {
      if (p.consentStatus === "captured") return "Consent was captured during the IVR — he agreed before I transferred the call.";
      if (p.consentStatus === "declined") return "The caller declined consent. Handle per policy.";
      return `Consent status: ${p.consentStatus}.`;
    },
  },
  {
    keywords: ["auth", "identity", "verif", "confirm"],
    response: (p) => {
      if (p.authState === "authenticated") {
        return `Identity confirmed via ${p.factorsVerified.join(", ")}. Match confidence: ${p.matchConfidence}.`;
      }
      return "Authentication was not completed during the IVR — identity still needs to be confirmed.";
    },
  },
  {
    keywords: ["service", "line", "specialty", "care type", "department", "primary", "therapy", "urgent"],
    response: (p) => {
      const svc = p.visitReason?.suggestedServiceLine;
      if (!svc || svc === "unknown") return "I didn't have enough signal to suggest a specific service line.";
      return `My analysis suggests **${svc.replace(/_/g, " ")}** based on the call context. Final routing is yours.`;
    },
  },
  {
    keywords: ["billing", "insurance", "coverage", "eligib", "plan"],
    response: (p) =>
      p.eligibilityStatus === "active"
        ? "Account shows active eligibility. No billing issues flagged during the call."
        : "Eligibility wasn't confirmed during the IVR — worth checking before booking.",
  },
  {
    keywords: ["language", "spanish", "interpreter"],
    response: (p) =>
      p.language === "es"
        ? "The caller speaks Spanish — a Spanish-speaking provider or interpreter may be needed."
        : "The caller speaks English — no interpreter needed.",
  },
  {
    keywords: ["emergency", "crisis", "urgent_emergent"],
    response: (p) =>
      p.urgency === "emergency"
        ? "Emergency signals were detected. Use the Patient Crisis protocol immediately."
        : "No emergency indicators detected. Urgency flagged as normal.",
  },
  {
    keywords: ["affiliation", "plan name", "who is", "which plan"],
    response: (p) =>
      `Affiliation on file: **${p.affiliation}**. Member ID: ${p.matchedPatient?.memberId ?? "not confirmed"}.`,
  },
  {
    keywords: ["dob", "date of birth", "birthday", "born"],
    response: (p) =>
      p.matchedPatient?.dob
        ? `Date of birth on record: ${p.matchedPatient.dob}.`
        : "Date of birth wasn't matched during this call.",
  },
  {
    keywords: ["intake", "consult", "appointment", "book", "schedule", "start"],
    response: () => "Use the action card above to start intake — I'll pre-fill everything I captured.",
  },
];

function mockSierraResponse(query: string, payload: SierraHandoffPayload): string {
  const lower = query.toLowerCase();
  for (const rule of MOCK_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.response(payload);
    }
  }
  return "I handled the IVR portion of this call. For anything beyond the call summary, the full profile is in the workspace.";
}

// ---------------------------------------------------------------------------
// Build initial messages from payload
// ---------------------------------------------------------------------------

function buildInitialMessages(payload: SierraHandoffPayload): SierraMsg[] {
  const emergency = isEmergencyHandoff(payload);
  const auth = isMemberAuthenticated(payload);
  const notAuth = needsAuthentication(payload);
  const intakeCtx = buildIntakeContext(payload);
  const suggested = payload.visitReason?.suggestedServiceLine;
  const serviceOption = getServiceOptionForLine(suggested);

  const firstName = payload.matchedPatient?.firstName ?? payload.collectedFields.firstName ?? "there";

  // Chief complaint as spoken by caller (e.g. "Cold." → "cold")
  const chiefComplaint = payload.visitReason?.callerStatement
    ? payload.visitReason.callerStatement.replace(/\.$/, "").toLowerCase()
    : null;

  // Format YYYY-MM-DD → MM/DD/YYYY for script readback
  const formatDobReadback = (dob: string | undefined) => {
    if (!dob) return null;
    const m = dob.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? `${m[2]}/${m[3]}/${m[1]}` : dob;
  };

  const messages: SierraMsg[] = [
    {
      id: "sys-start",
      role: "system",
      content: `Call transferred · ${payload.interactionId}`,
    },
  ];

  const isRetention = payload.intent === 'retention_attempt';
  const isSpanish = payload.callerType === 'spanish_member';
  const isCaregiver = payload.callerType === 'caregiver_proxy';
  const isBilling = payload.intent === 'billing_inquiry';
  const isBehavioralHealth = payload.visitReason?.suggestedServiceLine === 'behavioral_health';
  const consentBlocked = payload.consentStatus === 'declined' && ['schedule_care', 'dermatology'].includes(payload.intent);

  // Scripted opening — the first thing the agent says when they pick up.
  // Retention: acknowledge caller, invite them to share their need.
  // Spanish: greet in Spanish — identity unknown, direct-routed.
  // Caregiver: address parent (caller), reference child by name.
  // Authenticated: confirm identity + chief complaint, propose next step.
  // Non-auth: read back IVR-captured fields for verification.
  // Emergency: skip to alert.
  if (!emergency) {
    let script: string;
    if (isRetention) {
      const cf = payload.collectedFields;
      const hasIntent = !!(payload.visitReason?.callerStatement || payload.visitReason?.suggestedServiceLine);
      const hasName = !!cf.firstName;
      const hasDob = !!cf.dob;
      const dobReadback = formatDobReadback(cf.dob);
      const retentionTopic = chiefComplaint
        ?? (payload.visitReason?.suggestedServiceLine
            ? (payload.visitReason.suggestedServiceLine.replace(/_/g, " "))
            : null);

      if (hasIntent && hasName && hasDob) {
        script = `"Hi ${cf.firstName}, thanks for staying on the line. I see you were calling about ${retentionTopic} — I just need to confirm your date of birth as ${dobReadback}, and then I can help you right away."`;
      } else if (hasIntent && hasName) {
        script = `"Hi ${cf.firstName}, thanks for staying on the line. I see you were calling about ${retentionTopic} — I'm a live agent and I'm here to help with that."`;
      } else if (hasIntent) {
        script = `"Hi, thanks for staying on the line. I see you were calling about ${retentionTopic} — I'm a live agent and I'm here to help with that. Could I get your name?"`;
      } else {
        script = `"Hi, thanks for staying on the line. I know our automated system wasn't quite what you needed — I'm a live agent and I'm here to help. What's going on today?"`;
      }
    } else if (isSpanish) {
      script = `"Hola, gracias por llamar. ¿En qué le puedo ayudar hoy?"`;
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
    } else if (auth && isBilling) {
      script = `"Hi ${firstName}, thanks for holding. I understand you have a question about your billing — I'm happy to help. What would you like to know?"`;
    } else if (auth && isBehavioralHealth) {
      script = `"Hi ${firstName}, thanks for holding. I understand you're looking to schedule a behavioral health appointment — I'm here to help you get that set up."`;
    } else if (auth) {
      script = chiefComplaint
        ? `"Hi ${firstName}, thanks for holding. I understand you're calling about needing a visit to take care of your ${chiefComplaint} — a call with one of our next available providers could help. Does that sound right?"`
        : `"Hi ${firstName}, thanks for holding. How can I help you today?"`;
    } else {
      const cf = payload.collectedFields;
      const nameReadback = [cf.firstName, cf.lastName].filter(Boolean).join(" ");
      const dobReadback = formatDobReadback(cf.dob);
      const phoneReadback = cf.phone ?? null;
      const complaintIntro = chiefComplaint ? `I see you need help with your ${chiefComplaint}, ` : "";
      const fields = [
        nameReadback || null,
        dobReadback ? `DOB as ${dobReadback}` : null,
        phoneReadback ? `and Phone as ${phoneReadback}` : null,
      ]
        .filter(Boolean)
        .join(", ");
      script = `"Hi ${cf.firstName ?? "there"}, ${complaintIntro}I would just need to double check your information, I have ${fields} — is this correct?"`;
    }

    messages.push({
      id: "script-greeting",
      role: "assistant",
      script: true,
      content: script,
    });
  }

  if (emergency) {
    const knownName = payload.matchedPatient?.firstName ?? payload.collectedFields.firstName ?? null;
    const emergencyScript = knownName
      ? `"${knownName}, I understand this may be an emergency — I'm here with you right now. Can you tell me what's happening?"`
      : `"I understand this may be an emergency — I'm here with you right now. Can you tell me what's happening?"`;
    messages.push({
      id: "script-greeting",
      role: "assistant",
      script: true,
      content: emergencyScript,
    });
    messages.push({
      id: "sierra-open",
      role: "assistant",
      ai: true,
      content: "⚠️ Emergency signals detected. Use the Patient Crisis protocol immediately.",
    });
    return messages;
  }

  const summary = payload.intentSummary || `Intent: ${payload.intent.replace(/_/g, " ")}`;

  if (isRetention || isSpanish) {
    messages.push({
      id: "sierra-open",
      role: "assistant",
      ai: true,
      content: summary,
    });
  } else if (auth) {
    messages.push({
      id: "sierra-open",
      role: "assistant",
      ai: true,
      content: summary,
      actionCard: serviceOption
        ? {
            type: "start_intake",
            context: intakeCtx,
            label: `New Consultation — ${serviceOption.label}`,
            sublabel: serviceOption.availabilityLabel,
            prefillNote: [
              "Name",
              intakeCtx.dob && "DOB",
              intakeCtx.phone && "Phone",
              intakeCtx.visitReason && "Visit reason",
            ]
              .filter(Boolean)
              .join(" · "),
          }
        : {
            type: "start_intake",
            context: intakeCtx,
            label: "New Consultation",
            sublabel: "Continue when ready",
            prefillNote: "Pre-filled from IVR",
          },
    });
  } else if (notAuth) {
    messages.push({
      id: "sierra-open",
      role: "assistant",
      ai: true,
      content: summary,
      actionCard: {
        type: "search_patient",
        label: "Patient Search — pre-filled",
        sublabel: "Identity not yet confirmed",
        prefillNote: [
          intakeCtx.firstName && "First name",
          "Phone",
          intakeCtx.dob && "DOB",
        ]
          .filter(Boolean)
          .join(" · ") + " · Correct last name, then select a match",
      },
    });
  } else {
    messages.push({
      id: "sierra-open",
      role: "assistant",
      ai: true,
      content: summary,
    });
  }

  return messages;
}

// ---------------------------------------------------------------------------
// Status chips — compact inline auth/consent row
// ---------------------------------------------------------------------------

interface StatusChip {
  id: string;
  icon: string;
  fill: 0 | 1;
  colorToken: string;
  label: string;
}

function buildStatusChips(p: SierraHandoffPayload): StatusChip[] {
  if (isEmergencyHandoff(p)) {
    return [
      {
        id: "emergency",
        icon: "emergency",
        fill: 1,
        colorToken: "--everkit-color-content-error",
        label: "Emergency",
      },
    ];
  }

  // Spanish callers bypass auth/consent — show a language chip only
  if (p.callerType === "spanish_member") {
    return [
      {
        id: "language",
        icon: "translate",
        fill: 1,
        colorToken: "--everkit-color-content-info",
        label: "Spanish speaker",
      },
    ];
  }

  const chips: StatusChip[] = [];

  if (isMemberAuthenticated(p)) {
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
      label: "Consent given",
    });
  } else if (p.consentStatus === "declined") {
    chips.push({
      id: "consent",
      icon: "cancel",
      fill: 1,
      colorToken: "--everkit-color-content-error",
      label: "Consent declined",
    });
  } else if (p.consentStatus === "deferred_patient_consent") {
    chips.push({
      id: "consent",
      icon: "warning",
      fill: 1,
      colorToken: "--everkit-color-content-warning",
      label: "Consent needed",
    });
  }

  return chips;
}

// ---------------------------------------------------------------------------
// Sierra action card
// ---------------------------------------------------------------------------

function SierraActionCard({
  card,
  state,
  onAction,
}: {
  card: ActionCard;
  state: ActionCardState;
  onAction: () => void;
}) {
  const isSearchOnly = card.type === "search_patient";
  const isDone = state === "done";
  const isLoading = state === "loading";

  return (
    <Card
      shadow={false}
      className={cn(
        "mt-2 border py-0 transition-colors",
        isDone
          ? "border-[var(--everkit-color-border-success)] bg-[var(--everkit-color-surface-success-subtle)]"
          : "border-[var(--border)] bg-background",
      )}
    >
      <CardContent className="flex flex-col gap-2 px-3 py-2.5">
        {/* Header row: icon + text */}
        <div className="flex items-start gap-2.5">
          <IconBadge
            icon={isDone ? "check" : isSearchOnly ? "manage_search" : "medical_services"}
            fill={1}
            size="sm"
            variant={isDone ? "success" : "brand"}
            className="mt-0.5 shrink-0"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <Text variant="body-small" weight="strong">
              {card.label}
            </Text>
            <Text variant="body-small" className="text-muted-foreground">
              {card.sublabel}
            </Text>
            <Text variant="meta-small" className="text-muted-foreground">
              {isDone ? "Opened in workspace" : card.prefillNote}
            </Text>
          </div>
          {isSearchOnly && (
            <Badge size="sm" variant="warning" className="shrink-0 self-start mt-0.5">
              Open
            </Badge>
          )}
        </div>

        {/* Action button — full width at bottom */}
        {!isSearchOnly && (
          <Button
            size="sm"
            variant={isDone ? "neutral-secondary" : "default"}
            disabled={isDone || isLoading}
            loading={isLoading}
            onClick={onAction}
            className="w-full"
          >
            {isDone ? (
              <>
                <Icon name="check" size="xs" aria-hidden className="mr-1" />
                Opened in workspace
              </>
            ) : (
              <>
                Start New Consultation
                <Icon name="arrow_forward" size="xs" aria-hidden className="ml-1" />
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Sierra idle state — no active call
// ---------------------------------------------------------------------------

function SierraIdleState({
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
            name="auto_awesome"
            size="md"
            fill={1}
            aria-hidden
            className="text-[var(--everkit-color-brand-primary)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="body-default" weight="strong">
            Sierra co-pilot
          </Text>
          <Text variant="body-small" className="text-muted-foreground">
            No active call. Enter a call ID to load a summary.
          </Text>
        </div>
      </div>
      <HandoffCallIdLookup onLookup={onLookup} error={error} />
    </div>
  );
}


// ---------------------------------------------------------------------------
// Sierra chat pane — lives inside SidebarContent
// ---------------------------------------------------------------------------

interface SierraChatPaneProps {
  payload: SierraHandoffPayload;
  patientConfirmed: boolean;
  onSierraAction?: (action: SierraAction) => void;
}

function SierraChatPane({ payload, patientConfirmed, onSierraAction }: SierraChatPaneProps) {
  const [messages, setMessages] = React.useState<SierraMsg[]>(() =>
    buildInitialMessages(payload),
  );
  const [streaming, setStreaming] = React.useState(false);
  const [actionStates, setActionStates] = React.useState<Record<string, ActionCardState>>({});
  const streamTimerRef = React.useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const confirmedRef = React.useRef(patientConfirmed);

  // Re-seed on scenario change
  const payloadKey = payload.interactionId;
  React.useEffect(() => {
    setMessages(buildInitialMessages(payload));
    setStreaming(false);
    setActionStates({});
    confirmedRef.current = false;
    if (streamTimerRef.current) window.clearTimeout(streamTimerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payloadKey]);

  // Not-auth: when patient is confirmed from workspace, Sierra sends follow-up
  React.useEffect(() => {
    if (!patientConfirmed || confirmedRef.current) return;
    confirmedRef.current = true;

    const intakeCtx = buildIntakeContext(payload);
    const serviceOption = getServiceOptionForLine(payload.visitReason?.suggestedServiceLine);

    const followUp: SierraMsg = {
      id: `sierra-verified-${Date.now()}`,
      role: "assistant",
      ai: true,
      content: "Identity confirmed. Ready to start the consultation?",
      actionCard: serviceOption
        ? {
            type: "start_intake",
            context: intakeCtx,
            label: `New Consultation — ${serviceOption.label}`,
            sublabel: serviceOption.availabilityLabel,
            prefillNote: "Pre-filled from IVR",
          }
        : {
            type: "start_intake",
            context: intakeCtx,
            label: "New Consultation",
            sublabel: "Continue when ready",
            prefillNote: "Pre-filled from IVR",
          },
    };

    setMessages((prev) => [...prev, followUp]);
  }, [patientConfirmed, payload]);

  const handleActionCard = React.useCallback(
    (msgId: string, card: ActionCard) => {
      if (!card.context) return;
      setActionStates((s) => ({ ...s, [msgId]: "loading" }));

      streamTimerRef.current = window.setTimeout(() => {
        setActionStates((s) => ({ ...s, [msgId]: "done" }));
        onSierraAction?.({ type: "start_intake", context: card.context! });

        const confirmation: SierraMsg = {
          id: `sierra-confirm-${Date.now()}`,
          role: "assistant",
          ai: true,
          content: `Opening ${card.label.replace("New Consultation — ", "")} intake — I've pre-filled what I captured. Continue when you're ready.`,
        };
        setMessages((prev) => [...prev, confirmation]);
      }, ACTION_LOAD_MS);
    },
    [onSierraAction],
  );

  const handleSend = React.useCallback(
    (text: string) => {
      if (!text.trim() || streaming) return;

      const userMsg: SierraMsg = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
      };
      const placeholder: SierraMsg = {
        id: `sierra-reply-${Date.now()}`,
        role: "assistant",
        ai: true,
        content: "",
      };

      setMessages((prev) => [...prev, userMsg, placeholder]);
      setStreaming(true);

      streamTimerRef.current = window.setTimeout(() => {
        const reply = mockSierraResponse(text, payload);
        setMessages((prev) =>
          prev.map((m) => (m.id === placeholder.id ? { ...m, content: reply } : m)),
        );
        setStreaming(false);
      }, THINK_MS);
    },
    [streaming, payload],
  );

  const handleStop = React.useCallback(() => {
    if (streamTimerRef.current) window.clearTimeout(streamTimerRef.current);
    setMessages((prev) =>
      prev.map((m, i) =>
        i === prev.length - 1 && m.content === "" ? { ...m, content: "_(stopped)_" } : m,
      ),
    );
    setStreaming(false);
  }, []);

  // The DS MessageList contract requires a bounded container (relative h-full outer
  // wrapper + h-full scroll div). The min-h-0 flex-1 wrapper below provides that
  // bound inside a flex column so the Composer stays docked at the bottom.
  return (
    <div className="flex h-full min-h-0 flex-col gap-2 px-3 pb-3 pt-1.5">
      {/* Rounded message box — ends at its own bottom edge */}
      <div className="min-h-0 flex-1 overflow-hidden rounded-[var(--everkit-surface-radius)] border border-[var(--border)] bg-background">
        <MessageList label="Sierra co-pilot">
          <ChatMessageGroup>
            {messages.map((msg, i) => {
              if (msg.script) {
                return (
                  <Alert key={msg.id} variant="info" className="mx-1 mb-2">
                    <AlertTitle>Say to caller</AlertTitle>
                    <AlertDescription>{msg.content}</AlertDescription>
                  </Alert>
                );
              }

              const isLast = i === messages.length - 1;
              const isStreamingThis =
                streaming && isLast && msg.role === "assistant" && msg.content === "";
              const cardState = msg.actionCard
                ? (actionStates[msg.id] ?? "idle")
                : undefined;

              return (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  ai={msg.ai}
                  content={msg.content}
                  streaming={isStreamingThis}
                  thinkingMessage={isStreamingThis ? "Looking that up…" : undefined}
                >
                  {msg.actionCard && cardState !== undefined && (
                    <SierraActionCard
                      card={msg.actionCard}
                      state={cardState}
                      onAction={() => handleActionCard(msg.id, msg.actionCard!)}
                    />
                  )}
                </ChatMessage>
              );
            })}
          </ChatMessageGroup>
        </MessageList>
      </div>

      {/* Composer lives outside the rounded box — its own breathing room */}
      <div className="shrink-0">
        <Composer
          placeholder="Ask about or update Sierra's handoff"
          inputLabel="Ask Sierra"
          sendLabel="Ask Sierra"
          isStreaming={streaming}
          onSend={handleSend}
          onStop={handleStop}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HandoffRailPanelV3 — single-view chat panel
// ---------------------------------------------------------------------------

export function HandoffRailPanelV3({
  payload,
  side = "right",
  lookupError,
  onClear,
  onLookup,
  patientConfirmed = false,
  onSierraAction,
}: {
  payload: SierraHandoffPayload | null;
  side?: "left" | "right";
  lookupError?: string | null;
  onClear?: () => void;
  onLookup?: (callId: string) => void;
  patientConfirmed?: boolean;
  onSierraAction?: (action: SierraAction) => void;
}) {
  const [open, setOpen] = React.useState(true);
  const [callState, setCallState] = React.useState<"active" | "ended">("active");
  const panelKey = payload?.interactionId ?? "cleared";

  React.useEffect(() => {
    setOpen(true);
    setCallState("active");
  }, [panelKey]);

  const handleEndCall = () => {
    setCallState("ended");
    onClear?.();
  };

  const borderClass =
    side === "left"
      ? "border-r-2 border-[var(--border)]"
      : "border-l-2 border-[var(--border)]";

  const statusChips = payload ? buildStatusChips(payload) : [];
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
      aria-label="Sierra co-pilot"
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
          {/* Sticky header — call status bar + patient identity + auth chips */}
          <SidebarHeader className="shrink-0 p-0">
            {/* Call status bar: dot + label + End Call button + collapse toggle */}
            <div className="flex items-center gap-2 px-[var(--everkit-surface-padding)] py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
              {payload && (
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                  {callState === "active" && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--everkit-color-content-success)] opacity-75" />
                  )}
                  <span
                    className={cn(
                      "relative inline-flex h-2 w-2 rounded-full",
                      callState === "active"
                        ? "bg-[var(--everkit-color-content-success)]"
                        : "bg-[var(--everkit-color-muted-foreground)]",
                    )}
                  />
                </span>
              )}

              <Text
                variant="meta-small"
                weight="strong"
                className="flex-1 truncate uppercase tracking-wider text-muted-foreground group-data-[collapsible=icon]:hidden"
              >
                {payload
                  ? callState === "active"
                    ? "Active call"
                    : "Call ended"
                  : "Sierra co-pilot"}
              </Text>

              {payload && callState === "active" && (
                <Button
                  size="sm"
                  variant="destructive-secondary"
                  className="shrink-0"
                  onClick={handleEndCall}
                >
                  <Icon name="call_end" size="xs" aria-hidden className="mr-1" />
                  End call
                </Button>
              )}
            </div>

            {/* Patient identity + auth chips — only when a call is loaded */}
            {payload && (
              <div className="flex flex-col gap-1.5 px-[var(--everkit-surface-padding)] pb-2 group-data-[collapsible=icon]:hidden">
                <div className="min-w-0">
                  <Heading level={2} variant="title-default" className="truncate leading-tight">
                    {patientName}
                  </Heading>
                  <Text variant="meta-small" className="truncate text-muted-foreground">
                    {payload.affiliation}
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

                {/* Crisis Protocol — always visible in panel header; never buried below the fold */}
                <Button
                  size="sm"
                  variant="destructive-secondary"
                  className="mt-0.5 w-full"
                >
                  <Icon name="emergency" size="sm" fill={1} aria-hidden className="mr-1.5 shrink-0" />
                  Crisis Protocol
                </Button>
              </div>
            )}
          </SidebarHeader>

          {/* Chat content — no padding, flex column, fills remaining height */}
          <SidebarContent className="overflow-hidden p-0 group-data-[collapsible=icon]:hidden">
            {payload ? (
              <SierraChatPane
                payload={payload}
                patientConfirmed={patientConfirmed}
                onSierraAction={onSierraAction}
              />
            ) : (
              <SierraIdleState onLookup={onLookup} error={lookupError} />
            )}
          </SidebarContent>

        </Sidebar>
      </SidebarProvider>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HandoffRailV3 — animated slide wrapper
// ---------------------------------------------------------------------------

export function HandoffRailV3({
  activeCall,
  payload,
  side = "right",
  lookupError,
  onClear,
  onLookup,
  patientConfirmed = false,
  onSierraAction,
}: {
  activeCall: boolean;
  payload: SierraHandoffPayload | null;
  side?: "left" | "right";
  lookupError?: string | null;
  onClear?: () => void;
  onLookup?: (callId: string) => void;
  patientConfirmed?: boolean;
  onSierraAction?: (action: SierraAction) => void;
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
            <HandoffRailPanelV3
              payload={payload}
              side={side}
              lookupError={lookupError}
              onClear={onClear}
              onLookup={onLookup}
              patientConfirmed={patientConfirmed}
              onSierraAction={onSierraAction}
            />
          ) : null}
        </div>
      </div>
      <div aria-live="polite" className="sr-only">
        {activeCall ? "Sierra co-pilot is active." : ""}
      </div>
    </>
  );
}

export { useHandoffPanelSession };
export type { TransferContextScenario };
