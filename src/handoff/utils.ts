import type { AuthFactor, SierraHandoffPayload, VisitReasonTag } from "../data/scenarios";

export type DialogStatus = "info" | "success" | "warning" | "error";

export type FormatType = "phone" | "dob";

export const INTENT_LABELS: Record<string, string> = {
  schedule_care: "Schedule care",
  urgent_non_emergency: "Urgent (non-emergency)",
  urgent_emergent: "Emergency",
  behavioral_health: "Behavioral health",
  prescription_support: "Prescription support",
  payment_billing: "Billing",
  billing: "Billing",
  dermatology: "Dermatology",
  registration_new_patient: "New patient registration",
  login_account_help: "Login / account help",
  benefit_eligibility: "Benefits & eligibility",
  caregiver_proxy: "Caregiver (proxy)",
  returning_call_outreach: "Returning a call",
  provider_caller: "Provider caller",
  pharmacy_caller: "Pharmacy caller",
  agent_request: "Asked for an agent",
  confused_unknown: "Unsure / needs help",
  general_inquiry: "General inquiry",
};

export const SERVICE_LINE_LABELS = {
  behavioral_health: "Behavioral health",
  urgent_care: "Urgent care",
  primary_care: "Primary care",
  dermatology: "Dermatology",
  wellness: "Wellness",
  unknown: "Unknown",
} as const;

/** Searchable disposition tags the IVR may capture — advocate can adjust in handoff. */
export const DISPOSITION_OPTIONS = [
  { value: "booking", label: "Booking" },
  { value: "billing", label: "Billing" },
  { value: "urgent_care", label: "Urgent care" },
  { value: "therapy", label: "Therapy" },
  { value: "behavioral_health", label: "Behavioral health" },
  { value: "primary_care", label: "Primary care" },
  { value: "dermatology", label: "Dermatology" },
  { value: "prescription", label: "Prescription / Rx" },
  { value: "wellness", label: "Wellness" },
  { value: "benefits", label: "Benefits & eligibility" },
  { value: "registration", label: "Registration" },
  { value: "caregiver", label: "Caregiver / proxy" },
  { value: "general_inquiry", label: "General inquiry" },
  { value: "provider", label: "Provider" },
  { value: "pharmacy", label: "Pharmacy" },
] as const;

export const THIRD_FACTORS: AuthFactor[] = ["phone", "zip", "subscriber_id"];

export type FactorMark = "ok" | "unverified" | "none";

export const FACTOR_MARK: Record<"ok" | "unverified", { name: string; token: string; fill: 0 | 1 }> = {
  ok: { name: "check_circle", token: "--everkit-color-content-success", fill: 1 },
  unverified: { name: "remove", token: "--everkit-color-content-warning", fill: 0 },
};

export const HEADER_ICON: Record<DialogStatus, { name: string; token: string }> = {
  info: { name: "info", token: "--everkit-color-field-note-info-content" },
  success: { name: "check_circle", token: "--everkit-color-field-note-success-content" },
  warning: { name: "warning", token: "--everkit-color-field-note-warning-content" },
  error: { name: "error", token: "--everkit-color-field-note-error-content" },
};

export type ManualField = {
  key: string;
  label: string;
  value?: string;
  fromIvr?: boolean;
  format?: FormatType;
  hint?: string;
  maxLength?: number;
};

export interface ManualSpec {
  title: string;
  primary: ManualField[];
  third: boolean;
}

export const THIRD_GROUP_FIELDS: ManualField[] = [
  { key: "phone", label: "Phone", format: "phone", hint: "(555) 555-5555" },
  { key: "zip", label: "ZIP code", hint: "5-digit ZIP", maxLength: 5 },
  { key: "subscriber_id", label: "Subscriber ID", hint: "Subscriber / member ID" },
];

export const THIRD_KEYS = ["phone", "zip", "subscriber_id"] as const;

export function intentLabel(intent: string) {
  return INTENT_LABELS[intent] ?? intent.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatDob(dob?: string): string {
  if (!dob) return "—";
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob.trim());
  return iso ? `${iso[2]}/${iso[3]}/${iso[1]}` : dob;
}

export function nameMismatch(p: SierraHandoffPayload): boolean {
  const mp = p.matchedPatient;
  if (!mp) return false;
  const norm = (s?: string) => (s ?? "").trim().toLowerCase();
  const cFirst = norm(p.collectedFields.firstName);
  const cLast = norm(p.collectedFields.lastName);
  return (!!cFirst && cFirst !== norm(mp.firstName)) || (!!cLast && cLast !== norm(mp.lastName));
}

export function verifiedThird(p: SierraHandoffPayload): AuthFactor | null {
  return THIRD_FACTORS.find((f) => p.factorsVerified.includes(f)) ?? null;
}

export function markFor(verified: boolean, present: boolean): FactorMark {
  return verified ? "ok" : present ? "unverified" : "none";
}

export function phoneDigits(s?: string): string {
  return (s ?? "").replace(/\D/g, "");
}

/** Member auth is binary in UI — only Authenticated vs Not authenticated. */
export function isMemberAuthenticated(p: SierraHandoffPayload): boolean {
  return p.authState === "authenticated";
}

/** Pharmacy calling on behalf of a patient — verify patient identity, not exempt redirect. */
export function isPharmacyPatientHandoff(p: SierraHandoffPayload): boolean {
  return p.callerType === "pharmacy" && p.proxyHandling === "verify_patient";
}

/** Exempt TFN paths with no patient handoff (provider, legacy pharmacy redirect). */
export function isExemptCallerHandoff(p: SierraHandoffPayload): boolean {
  if (p.callerType === "provider") return true;
  return p.callerType === "pharmacy" && !isPharmacyPatientHandoff(p);
}

export function isEmergencyHandoff(p: SierraHandoffPayload): boolean {
  return p.urgency === "emergency" || p.intent === "urgent_emergent";
}

/** Side rail — member and pharmacy-patient handoffs, authenticated or not. Exempt TFNs stay off the rail. */
export function shouldShowHandoffSidebar(p: SierraHandoffPayload): boolean {
  if (isExemptCallerHandoff(p)) return false;
  return true;
}

export function headerMeta(p: SierraHandoffPayload): { status?: DialogStatus; title: string } {
  if (isEmergencyHandoff(p)) return { status: "error", title: "Emergency detected" };
  if (isExemptCallerHandoff(p)) {
    return {
      status: "info",
      title: p.callerType === "provider" ? "Provider caller" : "Pharmacy caller",
    };
  }
  if (isPharmacyPatientHandoff(p)) {
    return isMemberAuthenticated(p)
      ? { status: "success", title: "Authenticated" }
      : { status: "warning", title: "Not authenticated" };
  }
  if (isMemberAuthenticated(p)) return { status: "success", title: "Authenticated" };
  return { status: "warning", title: "Not authenticated" };
}

/** Second alert in the handoff stack — consent outcome with its own status semantics. */
export function consentHandoffMeta(
  p: SierraHandoffPayload,
): { status: DialogStatus; title: string; description?: string } | null {
  switch (p.consentStatus) {
    case "captured":
      return { status: "success", title: "Agreed to consent" };
    case "declined":
      return {
        status: "error",
        title: "Did not agree to consent",
        description: "Don’t access account details; handle per policy (general support).",
      };
    case "deferred_patient_consent":
      return {
        status: "warning",
        title: "Consent was not read",
        description: "Capture patient consent before accessing account details.",
      };
    default:
      return null;
  }
}

/** Member still needs Sierra auth (verify fields shown). */
export function needsAuthentication(p: SierraHandoffPayload): boolean {
  if (isExemptCallerHandoff(p)) return false;
  return !isMemberAuthenticated(p);
}

/** @deprecated Use needsAuthentication */
export const isDegradedAuth = needsAuthentication;

const CONTEXTUAL_ACTION: Record<string, string> = {
  prescription_support: "Go to prescriptions",
  behavioral_health: "Schedule a visit",
  schedule_care: "Schedule a visit",
  billing: "Review billing",
  payment_billing: "Review billing",
  benefit_eligibility: "Review benefits",
  confused_unknown: "Help the caller",
  caregiver_proxy: "Schedule a visit",
  provider_caller: "Provider support",
  pharmacy_caller: "Pharmacy support",
};

export function primaryAction(p: SierraHandoffPayload): string {
  if (isEmergencyHandoff(p)) return "Patient Crisis";
  if (isExemptCallerHandoff(p)) return CONTEXTUAL_ACTION[p.intent] ?? "Continue";
  if (isMemberAuthenticated(p)) return CONTEXTUAL_ACTION[p.intent] ?? "Continue";
  return "Authenticate";
}

/** Sierra match API needs first name, last name, DOB, and phone — prepopulated from IVR when captured. */
export function manualSpec(p: SierraHandoffPayload): ManualSpec | null {
  if (isMemberAuthenticated(p) || p.authState === "not_attempted") return null;
  if (isExemptCallerHandoff(p)) return null;
  // Legacy payloads may still carry authState `partial` — treat like not authenticated.

  const c = p.collectedFields;
  const primary: ManualField[] = [
    { key: "firstName", label: "First name", value: c.firstName || undefined, fromIvr: !!c.firstName },
    { key: "lastName", label: "Last name", value: c.lastName || undefined, fromIvr: !!c.lastName },
    {
      key: "dob",
      label: "Date of birth",
      value: c.dob ? formatDob(c.dob) : undefined,
      fromIvr: !!c.dob,
      format: "dob",
      hint: "MM/DD/YYYY",
    },
    {
      key: "phone",
      label: "Phone",
      value: c.phone || undefined,
      fromIvr: !!c.phone,
      format: "phone",
      hint: "(555) 555-5555",
    },
  ];

  return { title: "Confirm identity", primary, third: false };
}

export function capturedDispositionValues(p: SierraHandoffPayload): string[] {
  if (p.capturedDisposition !== undefined) return p.capturedDisposition;

  const values = new Set<string>();
  const intentDisposition: Record<string, string> = {
    schedule_care: "booking",
    payment_billing: "billing",
    billing: "billing",
    behavioral_health: "behavioral_health",
    dermatology: "dermatology",
    prescription_support: "prescription",
    benefit_eligibility: "benefits",
    registration_new_patient: "registration",
    provider_caller: "provider",
    pharmacy_caller: "pharmacy",
    caregiver_proxy: "caregiver",
    general_inquiry: "general_inquiry",
    confused_unknown: "general_inquiry",
  };
  if (intentDisposition[p.intent]) values.add(intentDisposition[p.intent]);
  if (p.billingFlag) values.add("billing");

  const tagDisposition: Partial<Record<VisitReasonTag, string>> = {
    behavioral_health_hint: "therapy",
    mood_concern: "therapy",
    urgent_care_hint: "urgent_care",
    primary_care_hint: "primary_care",
    dermatology: "dermatology",
    prescription_hint: "prescription",
    billing_hint: "billing",
    wellness_follow_up: "wellness",
  };
  p.visitReason?.tags.forEach((tag) => {
    const mapped = tagDisposition[tag];
    if (mapped) values.add(mapped);
  });

  const line = p.visitReason?.suggestedServiceLine;
  if (line && line !== "unknown") values.add(line);

  return [...values];
}

/** First-person Sierra IVR capture — shown as a quotation, not in the auth alert. */
export function ivrCallerScript(p: SierraHandoffPayload): string | null {
  const spoken = p.visitReason?.callerStatement?.trim();
  return spoken || null;
}

export function ivrScriptBadges(p: SierraHandoffPayload): { value: string; label: string }[] {
  const labels: Record<string, string> = Object.fromEntries(
    DISPOSITION_OPTIONS.map((o) => [o.value, o.label]),
  );
  return capturedDispositionValues(p)
    .filter((value) => Boolean(labels[value]))
    .map((value) => ({ value, label: labels[value] }));
}

export function displayPatientName(p: SierraHandoffPayload): string {
  if (isExemptCallerHandoff(p)) return "Not a patient call";
  const mp = p.matchedPatient;
  const c = p.collectedFields;
  if (mp) return `${mp.firstName} ${mp.lastName}`;
  if (c.firstName || c.lastName) return `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim();
  return "No match";
}

export function verifiedFrom(p: SierraHandoffPayload, values: Record<string, string>): SierraHandoffPayload {
  const matchedPatient = p.matchedPatient ?? {
    firstName: values.firstName || p.collectedFields.firstName || "Verified",
    lastName: values.lastName || p.collectedFields.lastName || "Caller",
    dob: values.dob || p.collectedFields.dob || "—",
    phone: values.phone || p.collectedFields.phone,
  };
  return {
    ...p,
    authState: "authenticated",
    factorsVerified: ["name", "dob", "phone"],
    matchedPatient,
    eligibilityStatus: p.eligibilityStatus ?? "active",
  };
}
