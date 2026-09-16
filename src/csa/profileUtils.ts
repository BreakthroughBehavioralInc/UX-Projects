import type { SierraHandoffPayload } from "../data/scenarios";
import { isExemptCallerHandoff, needsAuthentication } from "../handoff/utils";
import { CSA_PROFILE_DEFAULT, CSA_SEARCH_PATIENTS, type CsaPatientSearchRow } from "./data";

export type CsaShellView = "home" | "patient-search" | "profile" | "intake" | "not-found";

/** CSA profile screens use MM-DD-YYYY (stage format). */
export function formatCsaDob(dob?: string): string {
  if (!dob) return "—";
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob.trim());
  if (iso) return `${iso[2]}-${iso[3]}-${iso[1]}`;
  return dob;
}

/** Patient Search DOB field — MM/DD/YYYY. */
export function formatPatientSearchDob(dob?: string): string {
  if (!dob) return "";
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob.trim());
  if (iso) return `${iso[2]}/${iso[3]}/${iso[1]}`;
  return dob;
}

export type PatientSearchPrefill = {
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
};

export function patientSearchPrefill(payload: SierraHandoffPayload): PatientSearchPrefill {
  const c = payload.collectedFields;
  return {
    firstName: c.firstName ?? "",
    lastName: c.lastName ?? "",
    phone: c.phone ?? "",
    dob: formatPatientSearchDob(c.dob),
  };
}

function searchDigits(value?: string): string {
  return (value ?? "").replace(/\D/g, "");
}

/** Multiple-match handoff searches by phone so all accounts on that ANI appear. */
export function isMultiMatchPatientSearch(payload: SierraHandoffPayload): boolean {
  return (payload.accountMatches?.length ?? 0) > 1 || payload.matchConfidence === "low";
}

/** Auto-run query: always at least phone; extra IVR fields unless multiple matches. */
export function autoPatientSearchQuery(payload: SierraHandoffPayload): PatientSearchPrefill {
  const prefill = patientSearchPrefill(payload);
  if (isMultiMatchPatientSearch(payload)) {
    return { firstName: "", lastName: "", dob: "", phone: prefill.phone };
  }
  return prefill;
}

export function filterPatientSearchRows(query: PatientSearchPrefill): CsaPatientSearchRow[] {
  const phone = searchDigits(query.phone);
  if (!phone) return [];

  const first = query.firstName.trim().toLowerCase();
  const last = query.lastName.trim().toLowerCase();
  const dobIso = (() => {
    const m = query.dob.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    return m ? `${m[3]}-${m[1]}-${m[2]}` : query.dob.trim();
  })();

  return CSA_SEARCH_PATIENTS.filter((row) => {
    if (searchDigits(row.phone) !== phone) return false;
    if (first && !row.firstName.toLowerCase().includes(first)) return false;
    if (last && !row.lastName.toLowerCase().includes(last)) return false;
    if (dobIso && row.dob !== dobIso) return false;
    return true;
  });
}

/** CSA selected a directory row — resolves the matched patient WITHOUT changing auth state.
 *  Auth upgrade is a separate follow-up action; "View" only confirms the patient record. */
export function selectPatientFromSearchRow(
  payload: SierraHandoffPayload,
  row: CsaPatientSearchRow,
): SierraHandoffPayload {
  const phoneDigitsOnly = searchDigits(row.phone);
  const phone =
    phoneDigitsOnly.length === 10
      ? `(${phoneDigitsOnly.slice(0, 3)}) ${phoneDigitsOnly.slice(3, 6)}-${phoneDigitsOnly.slice(6)}`
      : row.phone;
  return {
    ...payload,
    matchConfidence: "high",
    matchedPatient: {
      firstName: row.firstName,
      lastName: row.lastName,
      dob: row.dob,
      memberId: row.subscriberId,
      phone,
      userId: row.userId,
    },
    eligibilityStatus: payload.eligibilityStatus ?? "active",
    collectedFields: {
      ...payload.collectedFields,
      firstName: row.firstName,
      lastName: row.lastName,
      dob: row.dob,
      phone: payload.collectedFields.phone || phone,
    },
  };
}

/** CSA verified identity from a directory row — upgrades authState to authenticated.
 *  Reserved for the explicit identity-verification follow-up action. */
export function authenticatedFromSearchRow(
  payload: SierraHandoffPayload,
  row: CsaPatientSearchRow,
): SierraHandoffPayload {
  return {
    ...selectPatientFromSearchRow(payload, row),
    authState: "authenticated",
    factorsVerified: ["name", "dob", "phone"],
  };
}

export function profileIdentity(payload: SierraHandoffPayload) {
  const mp = payload.matchedPatient;
  const first = mp?.firstName ?? payload.collectedFields.firstName ?? CSA_PROFILE_DEFAULT.firstName;
  const last = mp?.lastName ?? payload.collectedFields.lastName ?? CSA_PROFILE_DEFAULT.lastName;
  const dob = formatCsaDob(mp?.dob ?? payload.collectedFields.dob ?? CSA_PROFILE_DEFAULT.dobIso);
  const phoneRaw = payload.collectedFields.phone ?? mp?.phone ?? CSA_PROFILE_DEFAULT.phone;
  const phone = phoneRaw.replace(/\D/g, "").slice(-10) || CSA_PROFILE_DEFAULT.phone;
  const memberId = mp?.memberId;
  const userId =
    mp?.userId ?? (memberId && /^\d+$/.test(memberId) ? memberId : CSA_PROFILE_DEFAULT.userId);

  return {
    first,
    last,
    full: `${first} ${last}`,
    dob,
    phone,
    userId,
    username: first.toLowerCase().replace(/\s+/g, ""),
  };
}

export function shouldShowPatientProfile(payload: SierraHandoffPayload, resolved: boolean): boolean {
  if (isExemptCallerHandoff(payload)) return false;
  return payload.authState === "authenticated" || resolved;
}

/** Incoming call routing — authenticated → profile; member not authenticated → Patient Search. */
export function resolveCsaShellView(
  payload: SierraHandoffPayload | undefined,
  handoffActive: boolean,
  resolved: boolean,
): CsaShellView {
  if (payload && shouldShowPatientProfile(payload, resolved)) return "profile";
  if (handoffActive && payload && needsAuthentication(payload)) return "patient-search";
  return "home";
}

/** Top nav highlight — profile and intake are workspaces, not top-nav destinations. */
export function csaActiveNavLabel(view: CsaShellView): string | null {
  if (view === "home") return "Home";
  if (view === "patient-search") return "Patient Search";
  return null;
}
