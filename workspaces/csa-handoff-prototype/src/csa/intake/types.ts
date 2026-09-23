import type { SierraHandoffPayload, SuggestedServiceLine } from "../../data/scenarios";

// ---------------------------------------------------------------------------
// Timezone inference
// ---------------------------------------------------------------------------

const STATE_TIMEZONE_MAP: Record<string, string> = {
  FLORIDA: "Eastern", FL: "Eastern",
  "NEW YORK": "Eastern", NY: "Eastern",
  GEORGIA: "Eastern", GA: "Eastern",
  OHIO: "Eastern", OH: "Eastern",
  MICHIGAN: "Eastern", MI: "Eastern",
  PENNSYLVANIA: "Eastern", PA: "Eastern",
  "NORTH CAROLINA": "Eastern", NC: "Eastern",
  VIRGINIA: "Eastern", VA: "Eastern",
  TEXAS: "Central", TX: "Central",
  ILLINOIS: "Central", IL: "Central",
  MINNESOTA: "Central", MN: "Central",
  WISCONSIN: "Central", WI: "Central",
  COLORADO: "Mountain", CO: "Mountain",
  ARIZONA: "Mountain", AZ: "Mountain",
  UTAH: "Mountain", UT: "Mountain",
  CALIFORNIA: "Pacific", CA: "Pacific",
  WASHINGTON: "Pacific", WA: "Pacific",
  OREGON: "Pacific", OR: "Pacific",
  NEVADA: "Pacific", NV: "Pacific",
};

export function inferTimezone(state: string): string {
  return STATE_TIMEZONE_MAP[state.trim().toUpperCase()] ?? "Eastern";
}

// ---------------------------------------------------------------------------
// Build IntakeContext from payload
// ---------------------------------------------------------------------------

/** Build an IntakeContext from an IVR payload — used when Sierra triggers intake or the
 *  agent navigates directly via the workspace sidenav. */
export function buildIntakeContext(payload: SierraHandoffPayload): IntakeContext {
  const mp = payload.matchedPatient;
  const c = payload.collectedFields;
  // MatchedPatient has no state field; mock all matched patients as Florida
  const state = mp ? "Florida" : undefined;
  return {
    firstName: mp?.firstName ?? c.firstName ?? "",
    lastName: mp?.lastName ?? c.lastName ?? "",
    dob: mp?.dob ?? c.dob,
    memberId: mp?.memberId,
    phone: mp?.phone ?? c.phone,
    affiliation: payload.affiliation,
    suggestedServiceLine: payload.visitReason?.suggestedServiceLine,
    visitReason: payload.visitReason?.callerStatement,
    state,
    timezone: state ? inferTimezone(state) : undefined,
    isAuthenticated: payload.authState === "authenticated",
  };
}

// ---------------------------------------------------------------------------
// Step / flow types
// ---------------------------------------------------------------------------

export type IntakeStep =
  | "contact"
  | "service"
  | "appt-type"
  | "visit-reason"
  | "provider"
  | "confirm"
  | "booked";

export type AppointmentType = "phone" | "video";

export interface VisitReasonData {
  chiefComplaint: string;
  hasFever: boolean;
  symptomDuration: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Context + selection
// ---------------------------------------------------------------------------

export interface IntakeContext {
  firstName: string;
  lastName: string;
  dob?: string;
  memberId?: string;
  phone?: string;
  affiliation: string;
  suggestedServiceLine?: SuggestedServiceLine;
  /** Chief complaint captured passively by Sierra during the IVR. */
  visitReason?: string;
  /** Patient's US state (for contact info step). */
  state?: string;
  /** Inferred timezone from state. */
  timezone?: string;
  /** True when the member was fully authenticated during the IVR. */
  isAuthenticated?: boolean;
}

export interface ServiceOption {
  id: string;
  label: string;
  availabilityLabel: string;
  availabilityVariant: "urgent" | "scheduled" | "extended";
  costNote: string;
  serviceLine: SuggestedServiceLine;
  /** True when the service is not covered by insurance (self-pay). */
  selfPay?: boolean;
}

export interface ProviderSlot {
  id: string;
  label: string;
  dateLabel: string;
}

export interface MockProvider {
  id: string;
  name: string;
  credentials: string;
  specialty: string;
  bio: string;
  rating: number;
  reviewCount: number;
  nextAvailableLabel: string;
  slots: ProviderSlot[];
}

export interface BookingSelection {
  service: ServiceOption;
  /** Null for urgent care (next-available, no specific provider chosen). */
  provider: MockProvider | null;
  /** Null for urgent care. */
  slot: ProviderSlot | null;
  appointmentType: AppointmentType;
  visitReason: VisitReasonData;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: "first_available_urgent",
    label: "First Available Urgent Care",
    availabilityLabel: "Wait 20 minutes or less",
    availabilityVariant: "urgent",
    costNote: "Est. $75 per appointment",
    serviceLine: "urgent_care",
    selfPay: true,
  },
  {
    id: "primary_care",
    label: "Primary Care",
    availabilityLabel: "Appointments in 1–2 days",
    availabilityVariant: "scheduled",
    costNote: "Est. $## Routine · $## Wellness Visit",
    serviceLine: "primary_care",
  },
  {
    id: "therapy",
    label: "Therapy",
    availabilityLabel: "Appointments in 1–2 days",
    availabilityVariant: "scheduled",
    costNote: "Est. $## First Appointment · $## Follow-ups",
    serviceLine: "behavioral_health",
  },
  {
    id: "psychiatry",
    label: "Psychiatry",
    availabilityLabel: "Appointments in 2–3 days",
    availabilityVariant: "extended",
    costNote: "Est. $## First Appointment · $## Follow-ups",
    serviceLine: "behavioral_health",
  },
];

const MOCK_PROVIDERS_PRIMARY: MockProvider[] = [
  {
    id: "dr-chen",
    name: "Sarah Chen",
    credentials: "MD",
    specialty: "Primary Care",
    bio: "Board-certified in internal medicine. 12 years of experience.",
    rating: 4.8,
    reviewCount: 342,
    nextAvailableLabel: "Today · 3:30 PM",
    slots: [
      { id: "chen-1", label: "3:30 PM", dateLabel: "Today" },
      { id: "chen-2", label: "4:00 PM", dateLabel: "Today" },
      { id: "chen-3", label: "4:45 PM", dateLabel: "Today" },
    ],
  },
  {
    id: "dr-okafor",
    name: "James Okafor",
    credentials: "MD",
    specialty: "Internal Medicine",
    bio: "Specializes in preventive care and chronic disease management.",
    rating: 4.9,
    reviewCount: 517,
    nextAvailableLabel: "Today · 5:15 PM",
    slots: [
      { id: "okafor-1", label: "5:15 PM", dateLabel: "Today" },
      { id: "okafor-2", label: "5:45 PM", dateLabel: "Today" },
    ],
  },
  {
    id: "dr-patel",
    name: "Priya Patel",
    credentials: "DO",
    specialty: "Family Medicine",
    bio: "Family medicine with a focus on holistic patient care.",
    rating: 4.7,
    reviewCount: 218,
    nextAvailableLabel: "Tomorrow · 9:00 AM",
    slots: [
      { id: "patel-1", label: "9:00 AM", dateLabel: "Tomorrow" },
      { id: "patel-2", label: "10:30 AM", dateLabel: "Tomorrow" },
      { id: "patel-3", label: "2:00 PM", dateLabel: "Tomorrow" },
    ],
  },
];

const MOCK_PROVIDERS_BH: MockProvider[] = [
  {
    id: "dr-rivera",
    name: "Carmen Rivera",
    credentials: "LCSW",
    specialty: "Therapy",
    bio: "Cognitive behavioral therapy and anxiety management.",
    rating: 4.9,
    reviewCount: 156,
    nextAvailableLabel: "Tomorrow · 10:00 AM",
    slots: [
      { id: "riv-1", label: "10:00 AM", dateLabel: "Tomorrow" },
      { id: "riv-2", label: "2:30 PM", dateLabel: "Tomorrow" },
      { id: "riv-3", label: "4:00 PM", dateLabel: "In 2 days" },
    ],
  },
  {
    id: "dr-morrison",
    name: "David Morrison",
    credentials: "PhD",
    specialty: "Psychiatry",
    bio: "Medication management and talk therapy for mood disorders.",
    rating: 4.7,
    reviewCount: 88,
    nextAvailableLabel: "In 2 days · 11:00 AM",
    slots: [
      { id: "mor-1", label: "11:00 AM", dateLabel: "In 2 days" },
      { id: "mor-2", label: "3:00 PM", dateLabel: "In 3 days" },
    ],
  },
];

const PROVIDER_MAP: Record<string, MockProvider[]> = {
  primary_care: MOCK_PROVIDERS_PRIMARY,
  urgent_care: MOCK_PROVIDERS_PRIMARY,
  behavioral_health: MOCK_PROVIDERS_BH,
  wellness: MOCK_PROVIDERS_PRIMARY,
  dermatology: MOCK_PROVIDERS_PRIMARY,
  unknown: MOCK_PROVIDERS_PRIMARY,
};

export function getProvidersForService(serviceLine: string): MockProvider[] {
  return PROVIDER_MAP[serviceLine] ?? MOCK_PROVIDERS_PRIMARY;
}

/** Find the SERVICE_OPTIONS entry whose serviceLine matches a SuggestedServiceLine. */
export function getServiceOptionForLine(serviceLine?: SuggestedServiceLine): ServiceOption | undefined {
  if (!serviceLine) return undefined;
  return SERVICE_OPTIONS.find((o) => o.serviceLine === serviceLine);
}
