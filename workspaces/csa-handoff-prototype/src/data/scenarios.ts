/**
 * Transfer Context scenario presets - CSA Advocate Transfer Context modal.
 *
 * Initiative: IVR Sierra for Automated Authentication (KR 2.2, AHT 9.5->8, 9/2 go-live).
 * Each preset is a full Sierra->Finesse handoff payload that drives the modal state machine.
 * Field names match the handoff contract (tfn-aht-sierra/02-...) and the auth data model
 * (tfn-aht-sierra/03-...). Data is ILLUSTRATIVE.
 *
 * Auth note: Sierra match API requires first name, last name, DOB, and phone. IVR-captured
 * values prepopulate those fields when the caller is not authenticated. UI shows only
 * **Authenticated** or **Not authenticated** - no intermediate auth-state labels.
 */

export type CallerType =
  | 'member'
  | 'provider'
  | 'pharmacy'
  | 'spanish_member'
  | 'caregiver_proxy'
  | 'not_identified';

export type AuthState =
  | 'authenticated'
  | 'failed'
  | 'not_attempted'
  | 'not_identified'
  /** @deprecated Legacy payloads only - treat as `failed` in UI. */
  | 'partial';

export type AuthFactor = 'name' | 'dob' | 'phone' | 'zip' | 'subscriber_id';

export type MatchConfidence = 'high' | 'medium' | 'low' | 'none';

export type ConsentStatus = 'captured' | 'declined' | 'n/a' | 'deferred_patient_consent';

export type Urgency = 'normal' | 'high' | 'emergency';

export type VisitReasonTag =
  | 'behavioral_health_hint'
  | 'mood_concern'
  | 'urgent_care_hint'
  | 'primary_care_hint'
  | 'dermatology'
  | 'prescription_hint'
  | 'billing_hint'
  | 'wellness_follow_up'
  | 'other';

export type SuggestedServiceLine =
  | 'behavioral_health'
  | 'urgent_care'
  | 'primary_care'
  | 'dermatology'
  | 'wellness'
  | 'unknown';

export interface VisitReasonCapture {
  tags: VisitReasonTag[];
  suggestedServiceLine: SuggestedServiceLine;
  callerStatement?: string;
  captureMode: 'passive';
}

export interface MatchedPatient {
  firstName: string;
  lastName: string;
  dob: string;
  memberId?: string;
  phone?: string;
  userId?: string;
}

export interface AccountMatchOption {
  affiliation: string;
  memberId: string;
}

export interface CollectedFields {
  firstName?: string;
  lastName?: string;
  dob?: string;
  phone?: string;
  zip?: string;
}

export interface SierraHandoffPayload {
  interactionId: string;
  tfn: string;
  affiliation: string;
  callerType: CallerType;
  language: 'en' | 'es';
  authState: AuthState;
  factorsVerified: AuthFactor[];
  matchConfidence: MatchConfidence;
  matchedPatient: MatchedPatient | null;
  eligibilityStatus: 'active' | 'inactive' | null;
  consentStatus: ConsentStatus;
  intent: string;
  intentSummary: string;
  collectedFields: CollectedFields;
  ivrPath: string[];
  urgency: Urgency;
  visitReason?: VisitReasonCapture;
  proxyHandling?: 'verify_patient' | 'minor_dependent' | 'adult_consent_required' | 'none';
  billingFlag?: boolean;
  caregiverRelationship?: string;
  patientIsMinor?: boolean;
  patientAge?: number;
  consentOnFile?: boolean;
  capturedDisposition?: string[];
  accountMatches?: AccountMatchOption[];
}

export interface TransferContextScenario {
  /** Demo scenario index (1-10). */
  scenarioNumber: number;
  id: string;
  label: string;
  guidance: string;
  payload: SierraHandoffPayload;
  /** Panel starts empty — advocate looks up a Call ID (dropped-call recovery). */
  startsCleared?: boolean;
}

const AFF = 'Cigna / MD Live';
const AFF_DIRECT = 'MD Live Direct';
const TFN = '800-400-6354';
const ANI_PHONE = '(408) 222-2231';

const MULTI_ACCOUNT_MATCHES: AccountMatchOption[] = [
  { affiliation: 'Cigna / MD Live', memberId: 'M210338' },
  { affiliation: 'Cigna Commercial', memberId: 'M88412' },
];

const DEMO = {
  firstName: 'Alfredo',
  lastName: 'Carrillo',
  dob: '1990-04-14',
  phone: '(720) 555-5555',
  memberId: 'M210338',
} as const;

const demoPatient = (): MatchedPatient => ({
  firstName: DEMO.firstName,
  lastName: DEMO.lastName,
  dob: DEMO.dob,
  memberId: DEMO.memberId,
  phone: DEMO.phone,
});

const demoCollected = (overrides: Partial<CollectedFields> = {}): CollectedFields => ({
  firstName: DEMO.firstName,
  lastName: DEMO.lastName,
  dob: DEMO.dob,
  phone: DEMO.phone,
  ...overrides,
});

const caregiverPatient = (): MatchedPatient => ({
  firstName: 'Sofia',
  lastName: 'Martinez',
  dob: '2016-03-20',
  memberId: 'M312891',
  phone: '(720) 555-6666',
});

const caregiverCollected = (): CollectedFields => ({
  firstName: 'Sofia',
  lastName: 'Martinez',
  dob: '2016-03-20',
  phone: '(720) 555-6666',
});

/** CSA handoff demo scenarios (1-15). */
export const TRANSFER_CONTEXT_SCENARIOS: TransferContextScenario[] = [
  // --- 1: Happy path baseline ---
  {
    scenarioNumber: 1,
    id: 'demo-member-services-auth',
    label: '1 · Schedule visit — authenticated',
    guidance: 'Authenticated via name, DOB, and phone. Consent captured. Caller has a cold and wants urgent care. Route to next available provider.',
    payload: {
      interactionId: 'CAL-57260',
      tfn: TFN,
      affiliation: AFF_DIRECT,
      callerType: 'member',
      language: 'en',
      authState: 'authenticated',
      factorsVerified: ['name', 'dob', 'phone'],
      matchConfidence: 'high',
      matchedPatient: demoPatient(),
      eligibilityStatus: 'active',
      consentStatus: 'captured',
      intent: 'schedule_care',
      intentSummary: 'Caller wants to see a next available provider for a cold.',
      capturedDisposition: ['booking'],
      collectedFields: demoCollected(),
      ivrPath: [
        'scheduling',
        'visit_reason_captured',
        'member_verification',
        'name_readback',
        'dob_readback',
        'authenticated',
        'consent_captured',
      ],
      urgency: 'normal',
      visitReason: {
        tags: ['urgent_care_hint'],
        suggestedServiceLine: 'urgent_care',
        callerStatement: 'Cold.',
        captureMode: 'passive',
      },
    },
  },
  // --- 2: Auth failure — fix last name and search ---
  {
    scenarioNumber: 2,
    id: 'demo-member-services-not-auth',
    label: '2 · Schedule visit — not authenticated (fix last name)',
    guidance:
      'Not authenticated — Sierra captured phone, DOB, and first name; last name came through as Carrigo (no directory match). Correct Last Name to Carrillo and click Search.',
    payload: {
      interactionId: 'CAL-88502',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'member',
      language: 'en',
      authState: 'failed',
      factorsVerified: ['phone', 'dob'],
      matchConfidence: 'none',
      matchedPatient: null,
      eligibilityStatus: null,
      consentStatus: 'captured',
      intent: 'schedule_care',
      intentSummary: 'Caller wants to schedule a visit for a headache.',
      capturedDisposition: ['booking'],
      collectedFields: demoCollected({ lastName: 'Carrigo' }),
      ivrPath: [
        'scheduling',
        'visit_reason_captured',
        'member_verification',
        'name_readback',
        'auth_attempt',
        'consent_captured',
      ],
      urgency: 'normal',
      visitReason: {
        tags: ['primary_care_hint'],
        suggestedServiceLine: 'primary_care',
        callerStatement: 'Headache.',
        captureMode: 'passive',
      },
    },
  },
  // --- 3: Multiple accounts — resolve affiliation ---
  {
    scenarioNumber: 3,
    id: 'demo-stomachache-multi-account',
    label: '3 · Multiple accounts — not authenticated',
    guidance: 'Not authenticated — multiple accounts found. Sierra could not resolve to a single account. Verify all four identity fields, then confirm the right affiliation before proceeding.',
    payload: {
      interactionId: 'CAL-88506',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'member',
      language: 'en',
      authState: 'failed',
      factorsVerified: [],
      matchConfidence: 'low',
      matchedPatient: null,
      eligibilityStatus: null,
      consentStatus: 'captured',
      intent: 'schedule_care',
      intentSummary: 'Caller wants to book a visit for a stomachache.',
      accountMatches: MULTI_ACCOUNT_MATCHES,
      capturedDisposition: ['booking'],
      collectedFields: demoCollected(),
      ivrPath: ['greeting', 'intent_capture', 'visit_reason_captured', 'auth_attempt', 'multi_match', 'transfer'],
      urgency: 'normal',
      visitReason: {
        tags: ['primary_care_hint'],
        suggestedServiceLine: 'primary_care',
        callerStatement: 'Stomachache.',
        captureMode: 'passive',
      },
    },
  },
  // --- 4: Spanish-speaking member — direct route (no auth / no consent) ---
  {
    scenarioNumber: 4,
    id: 'demo-spanish-auth',
    label: '4 · Spanish-speaking caller — direct route',
    guidance: 'Spanish-speaking caller routed directly to a live agent — no authentication or consent captured in the IVR. Identity unknown. Switch to Spanish immediately.',
    payload: {
      interactionId: 'CAL-88511',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'spanish_member',
      language: 'es',
      authState: 'not_attempted',
      factorsVerified: [],
      matchConfidence: 'none',
      matchedPatient: null,
      eligibilityStatus: null,
      consentStatus: 'n/a',
      intent: 'schedule_care',
      intentSummary: 'Spanish-speaking caller — routed directly to agent without authentication or consent. Wants to schedule a visit.',
      capturedDisposition: ['booking'],
      collectedFields: { phone: ANI_PHONE },
      ivrPath: ['greeting', 'language_select', 'transfer'],
      urgency: 'normal',
    },
  },
  // --- 5: Caregiver proxy / minor child ---
  {
    scenarioNumber: 5,
    id: 'demo-caregiver-minor',
    label: '5 · Caregiver — parent calling for minor child',
    guidance: "Parent calling on behalf of their 8-year-old child (Sofia Martinez). Child's identity authenticated. Consent captured. Child has a fever — parent wants to book an urgent care visit. Note: the patient identity shown is the child's, not the parent's.",
    payload: {
      interactionId: 'CAL-88512',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'caregiver_proxy',
      language: 'en',
      authState: 'authenticated',
      factorsVerified: ['name', 'dob', 'phone'],
      matchConfidence: 'high',
      matchedPatient: caregiverPatient(),
      eligibilityStatus: 'active',
      consentStatus: 'captured',
      intent: 'schedule_care',
      intentSummary: "Parent calling on behalf of their 8-year-old child (Sofia Martinez) with a fever — wants to book an urgent care visit.",
      capturedDisposition: ['booking'],
      collectedFields: caregiverCollected(),
      ivrPath: ['greeting', 'caller_type', 'intent_capture', 'visit_reason_captured', 'auth', 'consent_captured', 'transfer'],
      urgency: 'normal',
      caregiverRelationship: 'parent',
      patientIsMinor: true,
      patientAge: 8,
      proxyHandling: 'minor_dependent',
      visitReason: {
        tags: ['urgent_care_hint'],
        suggestedServiceLine: 'urgent_care',
        callerStatement: 'Fever.',
        captureMode: 'passive',
      },
    },
  },
  // --- 6: Consent declined — scheduling blocked (error) ---
  {
    scenarioNumber: 6,
    id: 'demo-stomachache-auth',
    label: '6 · Consent declined — scheduling blocked',
    guidance: 'Authenticated. Consent DECLINED. Schedule intent detected → scheduling is blocked. Card shows error border and block icon. Compare to Scenario 7 (consent declined for billing — warning only, not blocked).',
    payload: {
      interactionId: 'CAL-88505',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'member',
      language: 'en',
      authState: 'authenticated',
      factorsVerified: ['name', 'dob', 'phone'],
      matchConfidence: 'high',
      matchedPatient: demoPatient(),
      eligibilityStatus: 'active',
      consentStatus: 'declined',
      intent: 'schedule_care',
      intentSummary: 'Caller wants to book a visit for a stomachache.',
      capturedDisposition: ['booking'],
      collectedFields: demoCollected(),
      ivrPath: ['greeting', 'intent_capture', 'visit_reason_captured', 'auth', 'consent_declined', 'transfer'],
      urgency: 'normal',
      visitReason: {
        tags: ['primary_care_hint'],
        suggestedServiceLine: 'primary_care',
        callerStatement: 'Stomachache.',
        captureMode: 'passive',
      },
    },
  },
  // --- 7: Consent declined — non-scheduling intent (warning only) ---
  {
    scenarioNumber: 7,
    id: 'demo-consent-declined-billing',
    label: '7 · Consent declined — billing inquiry (warning only)',
    guidance: "Authenticated member declined consent, but calling about a billing question (not scheduling). Panel shows a WARNING card — not error/blocked, since billing intent is out of the scheduling scope. Compare to Scenario 6 (consent declined + schedule_care = blocked).",
    payload: {
      interactionId: 'CAL-88513',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'member',
      language: 'en',
      authState: 'authenticated',
      factorsVerified: ['name', 'dob', 'phone'],
      matchConfidence: 'high',
      matchedPatient: demoPatient(),
      eligibilityStatus: 'active',
      consentStatus: 'declined',
      intent: 'billing_inquiry',
      intentSummary: 'Caller has a question about a recent billing statement.',
      billingFlag: true,
      capturedDisposition: ['billing'],
      collectedFields: demoCollected(),
      ivrPath: ['greeting', 'intent_capture', 'auth', 'consent_declined', 'transfer'],
      urgency: 'normal',
    },
  },
  // --- 8: Pharmacy proxy — authenticated ---
  {
    scenarioNumber: 8,
    id: 'demo-pharmacy-proxy-auth',
    label: '8 · Pharmacy on behalf of patient — authenticated',
    guidance: 'Pharmacy calling on behalf of the patient. Patient identity authenticated. Consent was not read — capture patient consent before account access.',
    payload: {
      interactionId: 'CAL-88507',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'pharmacy',
      language: 'en',
      authState: 'authenticated',
      factorsVerified: ['name', 'dob', 'phone'],
      matchConfidence: 'high',
      matchedPatient: demoPatient(),
      eligibilityStatus: 'active',
      consentStatus: 'deferred_patient_consent',
      intent: 'pharmacy_caller',
      intentSummary: 'Pharmacy calling on behalf of the patient about a prescription.',
      proxyHandling: 'verify_patient',
      capturedDisposition: ['prescription'],
      collectedFields: demoCollected(),
      ivrPath: ['greeting', 'caller_type', 'intent_capture', 'auth', 'transfer'],
      urgency: 'normal',
      visitReason: {
        tags: ['prescription_hint'],
        suggestedServiceLine: 'unknown',
        callerStatement: "I'm calling from the pharmacy about a prescription for the patient",
        captureMode: 'passive',
      },
    },
  },
  // --- 9: Pharmacy proxy — not authenticated ---
  {
    scenarioNumber: 9,
    id: 'demo-pharmacy-proxy-not-auth',
    label: '9 · Pharmacy on behalf of patient — not authenticated',
    guidance: 'Pharmacy calling on behalf of the patient. Patient not authenticated — verify all identity fields, then authenticate. Consent not read.',
    payload: {
      interactionId: 'CAL-88508',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'pharmacy',
      language: 'en',
      authState: 'failed',
      factorsVerified: [],
      matchConfidence: 'none',
      matchedPatient: null,
      eligibilityStatus: null,
      consentStatus: 'deferred_patient_consent',
      intent: 'pharmacy_caller',
      intentSummary: 'Pharmacy calling on behalf of the patient about a prescription.',
      proxyHandling: 'verify_patient',
      capturedDisposition: ['prescription'],
      collectedFields: demoCollected(),
      ivrPath: ['greeting', 'caller_type', 'intent_capture', 'auth_attempt', 'transfer'],
      urgency: 'normal',
      visitReason: {
        tags: ['prescription_hint'],
        suggestedServiceLine: 'unknown',
        callerStatement: "I'm calling from the pharmacy about a prescription for the patient",
        captureMode: 'passive',
      },
    },
  },
  // --- 10: Dermatology inquiry — authenticated ---
  {
    scenarioNumber: 10,
    id: 'demo-dermatology-inquiry-auth',
    label: '10 · Dermatology inquiry — authenticated',
    guidance: 'Authenticated — dermatology service question (not booking). Consent agreed; answer or route per policy.',
    payload: {
      interactionId: 'CAL-88503',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'member',
      language: 'en',
      authState: 'authenticated',
      factorsVerified: ['name', 'dob', 'phone'],
      matchConfidence: 'high',
      matchedPatient: demoPatient(),
      eligibilityStatus: 'active',
      consentStatus: 'captured',
      intent: 'dermatology',
      intentSummary: 'Question about dermatology services — not ready to book a visit.',
      capturedDisposition: ['dermatology'],
      collectedFields: demoCollected(),
      ivrPath: ['greeting', 'intent_capture', 'auth', 'consent', 'transfer'],
      urgency: 'normal',
      visitReason: {
        tags: ['dermatology'],
        suggestedServiceLine: 'dermatology',
        callerStatement: 'I wanted to know how dermatology visits work before I schedule.',
        captureMode: 'passive',
      },
    },
  },
  // --- 11: Dermatology inquiry — not authenticated ---
  {
    scenarioNumber: 11,
    id: 'demo-dermatology-inquiry-not-auth',
    label: '11 · Dermatology inquiry — not authenticated',
    guidance: 'Not authenticated — dermatology inquiry (not booking); consent agreed. Confirm identity fields, then authenticate.',
    payload: {
      interactionId: 'CAL-88504',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'member',
      language: 'en',
      authState: 'failed',
      factorsVerified: [],
      matchConfidence: 'none',
      matchedPatient: null,
      eligibilityStatus: null,
      consentStatus: 'captured',
      intent: 'dermatology',
      intentSummary: 'Question about dermatology services — not ready to book a visit.',
      capturedDisposition: ['dermatology'],
      collectedFields: demoCollected(),
      ivrPath: ['greeting', 'intent_capture', 'auth_attempt', 'consent', 'transfer'],
      urgency: 'normal',
      visitReason: {
        tags: ['dermatology'],
        suggestedServiceLine: 'dermatology',
        callerStatement: 'I wanted to know how dermatology visits work before I schedule.',
        captureMode: 'passive',
      },
    },
  },
  // --- 12: Behavioral health scheduling (non-crisis) ---
  {
    scenarioNumber: 12,
    id: 'demo-behavioral-health-scheduling',
    label: '12 · Behavioral health — scheduling (non-crisis)',
    guidance: 'Authenticated member calling to book a behavioral health appointment. Not a crisis — routine therapy scheduling. Consent captured. Service line pre-fills from Sierra.',
    payload: {
      interactionId: 'CAL-88514',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'member',
      language: 'en',
      authState: 'authenticated',
      factorsVerified: ['name', 'dob', 'phone'],
      matchConfidence: 'high',
      matchedPatient: demoPatient(),
      eligibilityStatus: 'active',
      consentStatus: 'captured',
      intent: 'schedule_care',
      intentSummary: "Caller wants to schedule a behavioral health appointment — ongoing therapy, not a crisis.",
      capturedDisposition: ['therapy', 'behavioral_health'],
      collectedFields: demoCollected(),
      ivrPath: ['greeting', 'intent_capture', 'visit_reason_captured', 'auth', 'consent_captured', 'transfer'],
      urgency: 'normal',
      visitReason: {
        tags: ['behavioral_health_hint', 'mood_concern'],
        suggestedServiceLine: 'behavioral_health',
        captureMode: 'passive',
      },
    },
  },
  // --- 13: Retention — caller wanted to disconnect ---
  {
    scenarioNumber: 13,
    id: 'demo-retention-attempt',
    label: '13 · Live agent retention — caller wanted to disconnect',
    guidance: 'Caller expressed intent to disconnect during the IVR. Sierra offered to transfer to a live agent — caller accepted. Agent should acknowledge frustration and proactively offer help. No visit reason captured; auth not attempted.',
    payload: {
      interactionId: 'CAL-88515',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'member',
      language: 'en',
      authState: 'not_attempted',
      factorsVerified: [],
      matchConfidence: 'none',
      matchedPatient: null,
      eligibilityStatus: null,
      consentStatus: 'deferred_patient_consent',
      intent: 'retention_attempt',
      intentSummary: 'Caller expressed intent to hang up during the IVR. Sierra offered a live agent — caller accepted the transfer.',
      capturedDisposition: ['general_inquiry'],
      collectedFields: { phone: ANI_PHONE },
      ivrPath: ['greeting', 'intent_capture', 'retention_offer', 'transfer'],
      urgency: 'normal',
    },
  },
  // --- 14: Emergency / mental health crisis ---
  {
    scenarioNumber: 14,
    id: 'demo-emergency-detected',
    label: '14 · Mental health crisis — emergency',
    guidance: 'Emergency detected — caller expressed thoughts of self-harm. Not authenticated; consent not read. Use Crisis Protocol immediately.',
    payload: {
      interactionId: 'CAL-88509',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'member',
      language: 'en',
      authState: 'failed',
      factorsVerified: [],
      matchConfidence: 'none',
      matchedPatient: null,
      eligibilityStatus: null,
      consentStatus: 'deferred_patient_consent',
      intent: 'mental_health_crisis',
      intentSummary: "Caller expressed thoughts of self-harm — said they've been thinking about hurting themselves.",
      collectedFields: { phone: ANI_PHONE },
      ivrPath: ['greeting', 'emergency_detect', 'transfer'],
      urgency: 'emergency',
      visitReason: {
        tags: ['behavioral_health_hint', 'mood_concern'],
        suggestedServiceLine: 'behavioral_health',
        callerStatement: "I've been thinking about hurting myself.",
        captureMode: 'passive',
      },
    },
  },
  // --- 19: Emergency · name captured, not authenticated ---
  {
    scenarioNumber: 19,
    id: 'demo-emergency-name-captured',
    label: '19 · Mental health crisis — name captured, not authenticated',
    guidance: 'Emergency detected after caller provided their name during the IVR. Identity not yet verified. Agent should address caller by name to establish immediate connection.',
    payload: {
      interactionId: 'CAL-88519',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'member',
      language: 'en',
      authState: 'not_attempted',
      factorsVerified: [],
      matchConfidence: 'none',
      matchedPatient: null,
      eligibilityStatus: null,
      consentStatus: 'deferred_patient_consent',
      intent: 'mental_health_crisis',
      intentSummary: "Caller mentioned feeling hopeless and stated they've been thinking about hurting themselves. Name captured from IVR — identity not yet confirmed.",
      collectedFields: { phone: ANI_PHONE, firstName: 'Sarah', lastName: 'Kim' },
      ivrPath: ['greeting', 'name_capture', 'emergency_detect', 'transfer'],
      urgency: 'emergency',
      visitReason: {
        tags: ['behavioral_health_hint', 'mood_concern'],
        suggestedServiceLine: 'behavioral_health',
        callerStatement: "I've been thinking about hurting myself.",
        captureMode: 'passive',
      },
    },
  },
  // --- 16: Retention + intent captured ---
  {
    scenarioNumber: 16,
    id: 'demo-retention-intent',
    label: '16 · Live agent retention — intent captured, name/DOB not yet collected',
    guidance: 'Caller described their visit reason then pressed 0. Sierra captured intent before transfer. Name and DOB not collected — agent opens with intent acknowledgment and asks for name.',
    payload: {
      interactionId: 'CAL-88516',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'member',
      language: 'en',
      authState: 'not_attempted',
      factorsVerified: [],
      matchConfidence: 'none',
      matchedPatient: null,
      eligibilityStatus: null,
      consentStatus: 'deferred_patient_consent',
      intent: 'retention_attempt',
      intentSummary: 'Caller described stomach pain and requested a visit, then pressed 0 to reach a live agent before completing verification.',
      capturedDisposition: ['schedule_care'],
      collectedFields: { phone: ANI_PHONE },
      ivrPath: ['greeting', 'intent_capture', 'visit_reason', 'retention_offer', 'transfer'],
      urgency: 'normal',
      visitReason: {
        tags: ['urgent_care_hint'],
        suggestedServiceLine: 'urgent_care',
        callerStatement: 'stomach pain',
        captureMode: 'passive',
      },
    },
  },
  // --- 17: Retention + intent + name captured ---
  {
    scenarioNumber: 17,
    id: 'demo-retention-intent-name',
    label: '17 · Live agent retention — intent + name captured, DOB not yet collected',
    guidance: 'Caller provided visit reason and name before pressing 0. DOB not captured — agent greets by name, acknowledges intent, and continues to verification.',
    payload: {
      interactionId: 'CAL-88517',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'member',
      language: 'en',
      authState: 'not_attempted',
      factorsVerified: [],
      matchConfidence: 'none',
      matchedPatient: null,
      eligibilityStatus: null,
      consentStatus: 'deferred_patient_consent',
      intent: 'retention_attempt',
      intentSummary: 'Caller described stomach pain and provided their name before requesting a live agent. Identity not yet verified.',
      capturedDisposition: ['schedule_care'],
      collectedFields: { phone: ANI_PHONE, firstName: 'Alex', lastName: 'Rivera' },
      ivrPath: ['greeting', 'intent_capture', 'visit_reason', 'name_capture', 'retention_offer', 'transfer'],
      urgency: 'normal',
      visitReason: {
        tags: ['urgent_care_hint'],
        suggestedServiceLine: 'urgent_care',
        callerStatement: 'stomach pain',
        captureMode: 'passive',
      },
    },
  },
  // --- 18: Retention + intent + name + DOB captured ---
  {
    scenarioNumber: 18,
    id: 'demo-retention-intent-name-dob',
    label: '18 · Live agent retention — intent + name + DOB captured',
    guidance: 'Caller completed most of verification (name + DOB) before pressing 0. Agent can confirm DOB to complete identity check and proceed to booking.',
    payload: {
      interactionId: 'CAL-88518',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'member',
      language: 'en',
      authState: 'not_attempted',
      factorsVerified: [],
      matchConfidence: 'none',
      matchedPatient: null,
      eligibilityStatus: null,
      consentStatus: 'deferred_patient_consent',
      intent: 'retention_attempt',
      intentSummary: 'Caller described stomach pain and provided name and date of birth before requesting a live agent. Ready for identity confirmation.',
      capturedDisposition: ['schedule_care'],
      collectedFields: { phone: ANI_PHONE, firstName: 'Alex', lastName: 'Rivera', dob: '1991-07-22' },
      ivrPath: ['greeting', 'intent_capture', 'visit_reason', 'name_capture', 'dob_capture', 'retention_offer', 'transfer'],
      urgency: 'normal',
      visitReason: {
        tags: ['urgent_care_hint'],
        suggestedServiceLine: 'urgent_care',
        callerStatement: 'stomach pain',
        captureMode: 'passive',
      },
    },
  },
  // --- 15: Dropped call ---
  {
    scenarioNumber: 15,
    id: 'demo-dropped-call',
    label: '15 · Dropped call — look up Call ID',
    guidance:
      'Call dropped before Sierra completed handoff. Call Summary starts empty — enter a Call ID (e.g. CAL-88502) to restore it.',
    startsCleared: true,
    payload: {
      interactionId: 'CAL-88510',
      tfn: TFN,
      affiliation: AFF,
      callerType: 'member',
      language: 'en',
      authState: 'not_identified',
      factorsVerified: [],
      matchConfidence: 'none',
      matchedPatient: null,
      eligibilityStatus: null,
      consentStatus: 'n/a',
      intent: 'returning_call_outreach',
      intentSummary: 'Call dropped before handoff completed.',
      collectedFields: {},
      ivrPath: ['greeting', 'intent_capture', 'drop'],
      urgency: 'normal',
    },
  },
];

export const getTransferContextScenario = (id: string): TransferContextScenario | undefined =>
  TRANSFER_CONTEXT_SCENARIOS.find((s) => s.id === id);

export const getTransferContextScenarioByNumber = (n: number): TransferContextScenario | undefined =>
  TRANSFER_CONTEXT_SCENARIOS.find((s) => s.scenarioNumber === n);

export const DEFAULT_TRANSFER_CONTEXT_SCENARIO = TRANSFER_CONTEXT_SCENARIOS[0];

/** Normalize advocate-entered Call ID to CAL-##### form. */
export function normalizeCallId(raw: string): string {
  const trimmed = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (!trimmed) return "";
  const digits = trimmed.replace(/^CAL-?/, "");
  return digits ? `CAL-${digits}` : "";
}

/** Restore a populated Call Summary from a prior Sierra handoff Call ID (scenarios 1–9). */
export function findHandoffPayloadByCallId(raw: string): SierraHandoffPayload | undefined {
  const needle = normalizeCallId(raw);
  if (!needle) return undefined;
  return TRANSFER_CONTEXT_SCENARIOS.find(
    (s) => !s.startsCleared && normalizeCallId(s.payload.interactionId) === needle,
  )?.payload;
}
