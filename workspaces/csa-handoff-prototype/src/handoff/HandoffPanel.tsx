import * as React from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ClearableInput,
  FieldNote,
  Icon,
  Label,
  SearchField,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
  Text,
  useSidebar,
} from "@everkit/design-system";
import {
  findHandoffPayloadByCallId,
  type SierraHandoffPayload,
  type TransferContextScenario,
} from "../data/scenarios";
import type { CsaPatientSearchRow } from "../csa/data";
import { selectPatientFromSearchRow } from "../csa/profileUtils";
import {
  FACTOR_MARK,
  type FactorMark,
  type ManualField,
  type ManualSpec,
  formatDob,
  consentHandoffMeta,
  headerMeta,
  isEmergencyHandoff,
  isExemptCallerHandoff,
  isPharmacyPatientHandoff,
  manualSpec,
  markFor,
  nameMismatch,
  needsAuthentication,
  phoneDigits,
  primaryAction,
  ivrCallerScript,
  ivrScriptBadges,
} from "./utils";

export interface VerifyForm {
  spec: ManualSpec | null;
  values: Record<string, string>;
  setValue: (key: string, v: string) => void;
  errors: Record<string, string>;
  validate: () => boolean;
}

export function useVerifyForm(payload: SierraHandoffPayload): VerifyForm {
  const spec = manualSpec(payload);
  const [values, setValues] = React.useState<Record<string, string>>(() => {
    const seed: Record<string, string> = {};
    spec?.primary.forEach((f) => {
      if (f.value) seed[f.key] = f.value;
    });
    return seed;
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const setValue = (key: string, v: string) => setValues((s) => ({ ...s, [key]: v }));

  const validate = () => {
    if (!spec) return true;
    const next: Record<string, string> = {};
    for (const f of spec.primary) {
      const v = (values[f.key] ?? "").trim();
      if (!v) next[f.key] = `${f.label} is required to continue.`;
      else if (f.format === "dob" && !/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
        next[f.key] = "Enter a valid date (MM/DD/YYYY).";
      } else if (f.format === "phone" && v.replace(/\D/g, "").length !== 10) {
        next[f.key] = "Enter a valid 10-digit phone number.";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  return { spec, values, setValue, errors, validate };
}

function FactorCheck({ mark }: { mark: FactorMark }) {
  if (mark === "none") return null;
  const m = FACTOR_MARK[mark];
  return (
    <Icon name={m.name} size="sm" fill={m.fill} aria-hidden className={`shrink-0 text-[var(${m.token})]`} />
  );
}

function PatientIdentityRow({ mark, children }: { mark: FactorMark; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <span className="flex w-4 shrink-0 justify-center pt-0.5">
        <FactorCheck mark={mark} />
      </span>
      <span className={`min-w-0 ${mark === "none" ? "text-muted-foreground" : ""}`}>{children}</span>
    </li>
  );
}

/** Emergency CTA — outlined danger action per CSA crisis protocol affordance. */
export function HandoffPatientCrisisButton({ className }: { className?: string }) {
  return (
    <Button variant="destructive-secondary" size="sm" className={className}>
      <Icon name="emergency" size="sm" aria-hidden />
      Patient Crisis
    </Button>
  );
}

/** Auth / caller status — separate from consent so each alert keeps the right variant. */
export function HandoffAuthAlert({
  payload,
  showCrisisCta = false,
}: {
  payload: SierraHandoffPayload;
  showCrisisCta?: boolean;
}) {
  const meta = headerMeta(payload);
  const variant = meta.status ?? "neutral";

  return (
    <Alert variant={variant}>
      <AlertTitle>{meta.title}</AlertTitle>
      {showCrisisCta && isEmergencyHandoff(payload) ? (
        <div className="mt-3">
          <HandoffPatientCrisisButton />
        </div>
      ) : null}
    </Alert>
  );
}

/** Read-only Sierra IVR quotation + disposition badges. */
export function HandoffIvrScript({ payload }: { payload: SierraHandoffPayload }) {
  const script = ivrCallerScript(payload);
  const badges = ivrScriptBadges(payload);
  if (!script && badges.length === 0) return null;

  return (
    <Card shadow={false}>
      <CardContent className="flex flex-col gap-[var(--everkit-surface-gap)]">
        {script ? (
          <blockquote className="m-0 text-sm italic text-foreground">“{script}”</blockquote>
        ) : null}
        {badges.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {badges.map((badge) => (
              <Badge key={badge.value} size="sm" variant="neutral">
                {badge.label}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function HandoffConsentAlert({ payload }: { payload: SierraHandoffPayload }) {
  const meta = consentHandoffMeta(payload);
  if (!meta) return null;

  return (
    <Alert variant={meta.status}>
      <AlertTitle>{meta.title}</AlertTitle>
      {meta.description ? <AlertDescription>{meta.description}</AlertDescription> : null}
    </Alert>
  );
}

/** Auth + consent alerts stacked — auth and consent are independent IVR outcomes. */
export function HandoffStatusAlert({
  payload,
  showCrisisCta = false,
}: {
  payload: SierraHandoffPayload;
  /** Show Patient Crisis CTA inside the emergency auth alert. */
  showCrisisCta?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[var(--everkit-surface-gap-section)]">
      <HandoffAuthAlert payload={payload} showCrisisCta={showCrisisCta} />
      <HandoffConsentAlert payload={payload} />
      <HandoffIvrScript payload={payload} />
    </div>
  );
}

/** Call ID, affiliation, and TFN — three lines at the bottom of Call Summary. */
export function HandoffCallMeta({ payload }: { payload: SierraHandoffPayload }) {
  return (
    <div className="flex flex-col gap-1">
      <Text variant="body-small" className="tabular-nums">
        Call ID: {payload.interactionId}
      </Text>
      <Text variant="body-small" className="text-muted-foreground">
        via {payload.affiliation}
      </Text>
      <Text variant="body-small" className="text-muted-foreground tabular-nums">
        TFN {payload.tfn}
      </Text>
    </div>
  );
}

/** Empty Call Summary — advocate looks up a Call ID to restore a dropped handoff. */
export function HandoffCallIdLookup({
  onLookup,
  error,
}: {
  onLookup?: (callId: string) => void;
  error?: string | null;
}) {
  const errorId = "handoff-call-id-error";
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="handoff-call-id">Call ID</Label>
      <SearchField
        id="handoff-call-id"
        button="icon"
        buttonLabel="Search Call ID"
        autoComplete="off"
        spellCheck={false}
        error={!!error}
        aria-describedby={error ? errorId : "handoff-call-id-note"}
        onSearch={(value: string) => onLookup?.(value)}
      />
      {error ? (
        <FieldNote id={errorId} status="error">
          {error}
        </FieldNote>
      ) : (
        <FieldNote id="handoff-call-id-note" status="neutral">
          CAL-#####
        </FieldNote>
      )}
    </div>
  );
}

export function HandoffClearButton({
  onClear,
  className = "w-full",
}: {
  onClear?: () => void;
  className?: string;
}) {
  return (
    <Button type="button" variant="neutral-secondary" className={className} onClick={onClear}>
      Call ended
    </Button>
  );
}

/** Session for Call Summary: populated from Sierra, or empty lookup after Clear / dropped call. */
export function useHandoffPanelSession(scenario: TransferContextScenario) {
  const [payload, setPayload] = React.useState<SierraHandoffPayload | null>(() =>
    scenario.startsCleared ? null : scenario.payload,
  );
  const [lookupError, setLookupError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPayload(scenario.startsCleared ? null : scenario.payload);
    setLookupError(null);
  }, [scenario.id]);

  const onClear = React.useCallback(() => {
    setPayload(null);
    setLookupError(null);
  }, []);

  const onLookup = React.useCallback((callId: string) => {
    const found = findHandoffPayloadByCallId(callId);
    if (!found) {
      setLookupError("No call summary found for that Call ID.");
      return;
    }
    setLookupError(null);
    setPayload(found);
  }, []);

  const onSelectPatient = React.useCallback((row: CsaPatientSearchRow) => {
    setPayload((current) => (current ? selectPatientFromSearchRow(current, row) : current));
  }, []);

  return { payload, lookupError, onClear, onLookup, onSelectPatient };
}

/** @deprecated Use HandoffStatusAlert. */
export function HandoffHeader({ payload }: { payload: SierraHandoffPayload; compact?: boolean }) {
  return <HandoffStatusAlert payload={payload} />;
}

function ManualFieldRow({ f, form }: { f: ManualField; form?: VerifyForm }) {
  const err = form?.errors[f.key];
  const id = `mv-${f.key}`;
  const controlled = form
    ? { value: form.values[f.key] ?? "", onChange: (v: string) => form.setValue(f.key, v) }
    : {};
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>
        {f.label}
        {f.fromIvr && <span className="font-normal text-muted-foreground"> · from IVR</span>}
      </Label>
      <ClearableInput
        id={id}
        format={f.format}
        maxLength={f.maxLength}
        aria-invalid={!!err}
        aria-describedby={err ? `${id}-e` : f.hint ? `${id}-h` : undefined}
        {...controlled}
      />
      {err ? (
        <FieldNote id={`${id}-e`} status="error">
          {err}
        </FieldNote>
      ) : f.hint ? (
        <FieldNote id={`${id}-h`} status="neutral">
          {f.hint}
        </FieldNote>
      ) : null}
    </div>
  );
}

export function VerifyFields({ payload, form }: { payload: SierraHandoffPayload; form?: VerifyForm }) {
  const spec = manualSpec(payload);
  if (!spec) return null;
  return (
    <Card shadow={false}>
      <CardContent className="flex flex-col gap-3">
        <Text variant="body-small" weight="strong" className="uppercase tracking-wide text-muted-foreground">
          {spec.title}
        </Text>
        <FieldNote status="neutral">
          First name, last name, date of birth, and phone are required for the Sierra match call. IVR-captured
          values are prepopulated when available.
        </FieldNote>
        {spec.primary.map((f) => (
          <ManualFieldRow key={f.key} f={f} form={form} />
        ))}
      </CardContent>
    </Card>
  );
}

export function HandoffBody({
  payload: p,
  showCallMeta = true,
}: {
  payload: SierraHandoffPayload;
  /** False when a parent shell renders Call ID / via / TFN (e.g. sticky top band footer). */
  showCallMeta?: boolean;
}) {
  const nonPatient = isExemptCallerHandoff(p);
  const mp = p.matchedPatient;
  const c = p.collectedFields;

  const displayName = nonPatient
    ? "Not a patient call"
    : mp
      ? `${mp.firstName} ${mp.lastName}`
      : c.firstName || c.lastName
        ? `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim()
        : "No match";
  const nameMark = nonPatient
    ? ("none" as FactorMark)
    : markFor(p.factorsVerified.includes("name"), !!(mp || c.firstName || c.lastName));
  const dob = mp?.dob ?? c.dob;
  const dobMark = markFor(p.factorsVerified.includes("dob"), !!dob);
  const accountPhone = mp?.phone ?? c.phone;
  const phoneMark = markFor(p.factorsVerified.includes("phone"), !!accountPhone);
  const phoneMismatchFlag =
    !!mp?.phone && !!c.phone && phoneDigits(c.phone) !== phoneDigits(mp.phone);

  return (
    <div className="flex flex-col gap-[var(--everkit-surface-gap-section)]">
      <Card shadow={false}>
        <CardHeader>
          <CardTitle headingLevel={3}>Patient</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-[var(--everkit-surface-gap)]">
          {p.language === "es" ? (
            <div className="flex justify-end">
              <Badge size="sm" variant="info-strong">
                <Icon name="language" aria-hidden />
                Spanish
              </Badge>
            </div>
          ) : null}

          {nonPatient ? (
            <Text variant="body-small" className="text-muted-foreground">
              {p.callerType === "provider" ? "Provider" : "Pharmacy"} caller — no patient identity to verify.
            </Text>
          ) : isPharmacyPatientHandoff(p) ? (
            <Text variant="body-small" className="text-muted-foreground">
              Pharmacy calling on behalf of the patient — verify the patient, not the pharmacist.
            </Text>
          ) : null}

          {!nonPatient && (mp || dob || accountPhone || c.firstName || c.lastName) ? (
            <ul className="flex list-none flex-col gap-[var(--everkit-surface-gap-sm)] p-0">
              <PatientIdentityRow mark={nameMark}>{displayName}</PatientIdentityRow>
              {dob ? <PatientIdentityRow mark={dobMark}>{formatDob(dob)}</PatientIdentityRow> : null}
              {accountPhone ? (
                <PatientIdentityRow mark={phoneMark}>{accountPhone}</PatientIdentityRow>
              ) : null}
              {mp?.memberId ? (
                <Text variant="body-small" className="pl-6 text-muted-foreground">
                  Member ID {mp.memberId}
                </Text>
              ) : null}
            </ul>
          ) : !isPharmacyPatientHandoff(p) ? (
            <Text variant="body-small" className="text-muted-foreground">
              Reached the advocate without identification.
            </Text>
          ) : null}

          {phoneMismatchFlag && (
            <FieldNote status="neutral">
              Caller confirmed: {c.phone} · Account: {mp?.phone}
            </FieldNote>
          )}

          {nameMismatch(p) && (
            <Alert variant="warning">
              <AlertTitle>Name doesn’t match the record</AlertTitle>
              <AlertDescription>
                Caller gave “{c.firstName} {c.lastName}”, but the record shows “{mp?.firstName} {mp?.lastName}”.
                Confirm the correct name before continuing.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {p.accountMatches && p.accountMatches.length > 1 ? (
        <Alert variant="warning">
          <AlertTitle>Multiple accounts found</AlertTitle>
          <AlertDescription>
            Confirm affiliation with the caller before proceeding.
            <ul className="mt-2 list-disc pl-5">
              {p.accountMatches.map((match) => (
                <li key={match.memberId}>
                  {match.affiliation} · Member ID {match.memberId}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}

      {p.billingFlag && p.intent !== "payment_billing" && p.intent !== "billing" ? (
        <Badge size="sm" variant="neutral" className="w-fit">
          <Icon name="payments" aria-hidden />
          Billing
        </Badge>
      ) : null}

      {showCallMeta ? <HandoffCallMeta payload={p} /> : null}
    </div>
  );
}

export function HandoffActions({
  payload,
  form,
  onVerified,
}: {
  payload: SierraHandoffPayload;
  form: VerifyForm;
  onVerified?: () => void;
}) {
  const needsAuth = needsAuthentication(payload);
  const emergency = isEmergencyHandoff(payload);
  const [phase, setPhase] = React.useState<"idle" | "verifying">("idle");
  const [verified, setVerified] = React.useState(false);

  const runVerify = () => {
    if (needsAuth && !form.validate()) return;
    setPhase("verifying");
    window.setTimeout(() => {
      setVerified(true);
      setPhase("idle");
      onVerified?.();
    }, 800);
  };

  if (emergency) {
    return <HandoffPatientCrisisButton className="w-full" />;
  }

  return (
    <Button size="sm" className="w-full" loading={phase === "verifying"} onClick={runVerify}>
      {phase === "verifying" ? "Verifying…" : primaryAction(payload)}
    </Button>
  );
}

const HANDOFF_SIDEBAR_VARS = {
  "--sidebar-width": "var(--everkit-sidenav-width)",
  "--sidebar-width-icon": "var(--everkit-sidenav-width-icon)",
} as React.CSSProperties;

const RAIL_SLIDE_MS = 300;

function HandoffSidebarCollapseToggle({ side }: { side: "left" | "right" }) {
  const { state, toggleSidebar } = useSidebar();
  const expanded = state === "expanded";
  const icon = side === "left" ? (expanded ? "chevron_left" : "chevron_right") : expanded ? "chevron_right" : "chevron_left";

  return (
    <Button
      variant="neutral-tertiary"
      size="icon-sm"
      aria-label={expanded ? "Hide call summary" : "Show call summary"}
      onClick={toggleSidebar}
    >
      <Icon name={icon} size="sm" aria-hidden />
    </Button>
  );
}

/** Hidden off-call; slides in when Sierra delivers handoff. Right side uses the same pattern for parity. */
export function HandoffRail({
  activeCall,
  payload,
  side = "right",
  lookupError,
  onClear,
  onLookup,
}: {
  activeCall: boolean;
  payload: SierraHandoffPayload | null;
  /** Reserved for a future rail CTA — not rendered in MVP side panels. */
  onVerified?: () => void;
  side?: "left" | "right";
  lookupError?: string | null;
  onClear?: () => void;
  onLookup?: (callId: string) => void;
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
          activeCall ? "w-auto" : "w-0"
        }`}
      >
        <div
          className={`h-full transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] motion-reduce:transition-none ${
            activeCall ? "translate-x-0" : slideClosed
          }`}
        >
          {mounted ? (
            <HandoffRailPanel
              payload={payload}
              side={side}
              lookupError={lookupError}
              onClear={onClear}
              onLookup={onLookup}
            />
          ) : null}
        </div>
      </div>
      <div aria-live="polite" className="sr-only">
        {activeCall ? "Call summary is available." : ""}
      </div>
    </>
  );
}

/** Full Call Summary — DS Sidebar (collapsible icon rail), same pattern as Sidenav stories. */
export function HandoffRailPanel({
  payload,
  side = "right",
  lookupError,
  onClear,
  onLookup,
}: {
  payload: SierraHandoffPayload | null;
  side?: "left" | "right";
  lookupError?: string | null;
  onClear?: () => void;
  onLookup?: (callId: string) => void;
}) {
  const [open, setOpen] = React.useState(true);
  const panelKey = payload?.interactionId ?? "cleared";

  React.useEffect(() => {
    setOpen(true);
  }, [panelKey]);

  const borderClass =
    side === "left"
      ? "border-r border-[var(--everkit-color-sidenav-border)]"
      : "border-l border-[var(--everkit-color-sidenav-border)]";

  return (
    <div
      className="relative h-full shrink-0 overflow-hidden [transform:translateZ(0)]"
      aria-label="Call summary"
    >
      <SidebarProvider
        open={open}
        onOpenChange={setOpen}
        className="h-full min-h-0"
        style={HANDOFF_SIDEBAR_VARS}
      >
        <Sidebar side={side} collapsible="icon" className={`h-full ${borderClass} shadow-[var(--everkit-shadow-sm)]`}>
          <SidebarHeader className="p-0 py-3">
            <div className="flex items-center gap-2 px-[var(--everkit-surface-padding)] group-data-[collapsible=icon]:justify-center">
              <Text
                variant="body-small"
                weight="strong"
                className="uppercase tracking-wide text-muted-foreground group-data-[collapsible=icon]:hidden"
              >
                Call summary
              </Text>
              <div className="ml-auto group-data-[collapsible=icon]:ml-0">
                <HandoffSidebarCollapseToggle side={side} />
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-[var(--everkit-surface-padding)] group-data-[collapsible=icon]:hidden">
            <SidebarGroup className="p-0">
              <SidebarGroupContent className="flex flex-col gap-[var(--everkit-content-gap-block)]">
                {payload ? (
                  <>
                    <HandoffStatusAlert payload={payload} showCrisisCta={isEmergencyHandoff(payload)} />
                    <HandoffBody payload={payload} showCallMeta={false} />
                  </>
                ) : (
                  <HandoffCallIdLookup onLookup={onLookup} error={lookupError} />
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          {payload ? (
            <SidebarFooter className="mt-auto p-[var(--everkit-surface-padding)] group-data-[collapsible=icon]:hidden">
              <div className="flex flex-col gap-[var(--everkit-surface-gap-section)]">
                <HandoffCallMeta payload={payload} />
                <HandoffClearButton onClear={onClear} />
              </div>
            </SidebarFooter>
          ) : null}
          <SidebarRail />
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}
