export type CsaNavItem = {
  label: string;
  active?: boolean;
  menu?: { label: string }[];
};

/** Full CSA nav row — rendered in `HeaderSecondary`. */
export const CSA_NAV: CsaNavItem[] = [
  { label: "Home" },
  { label: "Patient Search" },
  {
    label: "User Management",
    menu: [
      { label: "Manage Roles & Rights" },
      { label: "Manage Users" },
      { label: "Manage Credits" },
      { label: "Manage Promo Codes" },
    ],
  },
  {
    label: "Queues",
    menu: [
      { label: "Asynchronous Appointments" },
      { label: "Refunds" },
      { label: "CPT Automation Queue" },
      { label: "Appointment Reviews" },
      { label: "PCC Exceptions" },
      { label: "Patient Waiting Room" },
      { label: "Completed Consultations" },
      { label: "Supervisor Queue" },
      { label: "VPC Queue Emails" },
      { label: "Nurse Queue Emails" },
      { label: "Survey Queue" },
      { label: "Clinical Care Coordinator Queue" },
      { label: "Medical Record Release Queue" },
    ],
  },
  { label: "Scheduled Appointments" },
  { label: "Appointment Requests" },
  {
    label: "Providers",
    menu: [
      { label: "Add Provider" },
      { label: "Bulk Upload Providers" },
      { label: "Provider Cards" },
      { label: "Medical Director/Informational Providers" },
      { label: "Provider Scheduling Tool" },
      { label: "Schedule Confirmations" },
      { label: "System Message Alerts" },
      { label: "Multiple Provider Payment" },
      { label: "Physician Guidelines" },
      { label: "Incentives" },
      { label: "Provider 1099 Tax Report" },
      { label: "Behavioral Provider Payments Report" },
      { label: "Medical Provider Payments Report" },
      { label: "Provider Payments Report Requests" },
      { label: "Provider Rates Report" },
      { label: "Photo/Bio Review" },
    ],
  },
  {
    label: "Support",
    menu: [
      { label: "Tech Support" },
      { label: "Contact Requests" },
      { label: "Note Dispositions" },
      { label: "Missed Consultations" },
      { label: "View on call Events" },
      { label: "Edit Escalation Guidelines" },
      { label: "Audit Logs" },
      { label: "Manage Flags" },
    ],
  },
  {
    label: "Affiliation",
    menu: [
      { label: "Provider Groups" },
      { label: "Territory" },
    ],
  },
  {
    label: "Chat",
    menu: [
      { label: "Chat Canned Responses" },
      { label: "Chat Queue" },
      { label: "Chat History" },
    ],
  },
  {
    label: "MDliveQA Admin",
    menu: [
      { label: "Escalation Form" },
      { label: "My Account" },
      { label: "Crystal Report" },
      { label: "Change Password" },
      { label: "Widgets" },
      { label: "Logout" },
    ],
  },
];

export const CSA_SEARCH_TABS = [
  { id: "patient", label: "Patient Search" },
  { id: "provider", label: "Provider Search" },
  { id: "appointment", label: "Appointment Search" },
  { id: "transaction", label: "Transaction ID Search" },
] as const;

export const CSA_PATIENT_FIELDS = [
  "User ID",
  "First Name",
  "Last Name",
  "Phone",
  "DOB",
  "Subscriber ID",
] as const;

export type CsaPatientSearchRow = {
  registeredOn: string;
  userId: string;
  subscriberId: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
  zip: string;
  status: string;
  affiliation: string;
};

/** Directory used to auto-run Patient Search on unauthenticated handoff. Same phone can hit multiple people. No Carrigo row — scenario 2 last-name misspell returns empty until Search with Carrillo. */
export const CSA_SEARCH_PATIENTS: CsaPatientSearchRow[] = [
  {
    registeredOn: "04-14-2024",
    userId: "642210338",
    subscriberId: "M210338",
    firstName: "Alfredo",
    lastName: "Carrillo",
    dob: "1990-04-14",
    email: "acarillo@mdlive.com",
    phone: "7205555555",
    zip: "80202",
    status: "Active",
    affiliation: "Cigna / MD Live",
  },
  {
    registeredOn: "07-29-2019",
    userId: "642191729",
    subscriberId: "MDL93860088",
    firstName: "Alfredo",
    lastName: "Abshire",
    dob: "1950-05-23",
    email: "rg@mdl.com",
    phone: "7205555555",
    zip: "33128",
    status: "Pending Email Confirmation",
    affiliation: "HCSC RFP - ASO - BCBSIL",
  },
  {
    registeredOn: "01-12-2023",
    userId: "642235851",
    subscriberId: "00419607601",
    firstName: "ALFREDO",
    lastName: "SANDAVOL",
    dob: "1987-01-31",
    email: "prichardson@mdlive.com",
    phone: "7205555555",
    zip: "90027",
    status: "Pending Email Confirmation",
    affiliation: "The Whole Health Plan",
  },
];

export const CSA_HISTORY = [
  { id: "642260956", last: "testing", first: "medrefill01", phone: "9928829929" },
  { id: "642254889", last: "testing", first: "ucmedrefill10", phone: "9154940445" },
  { id: "542112786", last: "User", first: "Primary", phone: "2223333333" },
  { id: "642313681", last: "Patient11", first: "Auto", phone: "4356576832" },
  { id: "642313680", last: "Patient12", first: "Auto", phone: "5763293938" },
];

export type CsaAppointment = {
  created: string;
  date: string;
  time: string;
  affiliation: string;
  state: string;
  patientId: string;
  age: number;
  symptom: string;
  phone: string;
  consultType: string;
  switchConsultTo: string;
  providerType: string;
  provider: string;
};

export const CSA_APPOINTMENTS: CsaAppointment[] = [
  {
    created: "08-17-2026 03:19 PM",
    date: "08-18-2026",
    time: "07:10 PM",
    affiliation: "DTC",
    state: "FLORIDA",
    patientId: "642262577",
    age: 56,
    symptom: "Depressed Mood",
    phone: "7867210607",
    consultType: "Phone",
    switchConsultTo: "Switch to Video",
    providerType: "Psychologist",
    provider: "Test RegressionTherapistR",
  },
  {
    created: "08-17-2026 03:37 PM",
    date: "08-20-2026",
    time: "10:30 AM",
    affiliation: "DTC-Ricardo",
    state: "FLORIDA",
    patientId: "642241248",
    age: 25,
    symptom: "I have been feeling down",
    phone: "6892422165",
    consultType: "Video",
    switchConsultTo: "Switch to Phone",
    providerType: "Psychologist",
    provider: "TestTherMaria Test",
  },
  {
    created: "08-17-2026 11:06 AM",
    date: "08-20-2026",
    time: "11:30 AM",
    affiliation: "DTC",
    state: "FLORIDA",
    patientId: "642233276",
    age: 24,
    symptom: "Annual Wellness",
    phone: "9544822439",
    consultType: "Video",
    switchConsultTo: "Switch to Phone",
    providerType: "Annual Wellness",
    provider: "Rcbthomas Cruz",
  },
  {
    created: "08-17-2026 09:16 AM",
    date: "08-21-2026",
    time: "09:00 PM",
    affiliation: "DTC-Ricardo",
    state: "FLORIDA",
    patientId: "642241253",
    age: 25,
    symptom: "Annual Wellness",
    phone: "6892422165",
    consultType: "Video",
    switchConsultTo: "Switch to Phone",
    providerType: "Annual Wellness",
    provider: "Rcbthomas Cruz",
  },
  {
    created: "08-18-2026 04:39 AM",
    date: "08-21-2026",
    time: "11:00 PM",
    affiliation: "Scheduling Conversion Experiments 2 - Stage",
    state: "FLORIDA",
    patientId: "642313601",
    age: 30,
    symptom: "Rash",
    phone: "9544822439",
    consultType: "Video",
    switchConsultTo: "Switch to Phone",
    providerType: "General Health - Adult",
    provider: "Rcbthomas Cruz",
  },
];

/** Stage reference patient — medrefill01 testing (642260956). Identity merges with handoff payload. */
export const CSA_PROFILE_DEFAULT = {
  userId: "642260956",
  firstName: "medrefill01",
  lastName: "testing",
  dobIso: "1988-09-09",
  age: "37",
  phone: "9928829929",
  email: "alfredoc@mail.com",
  address1: "Testing 1",
  city: "FORT LAUDERDALE",
  state: "FLORIDA",
  zip: "33322",
  registrationDate: "09-09-2025",
  affiliationId: "96",
  billingAgreement: "0000-DTC",
} as const;

export const CSA_PROFILE_TABS = [
  "Profile",
  "New Consultation",
  "Patient Intake",
  "Appointments",
  "Appointment Requests",
  "Billing/Credits",
  "Eligible Members",
  "Health History",
  "Pharmacy/Rx",
  "Notes",
  "Activity History",
  "Medication",
  "Chat History",
  "Orders",
  "Schedule Sessions",
  "Audit Logs",
  "Records",
  "Hets Transaction 270/271",
  "Transaction History",
  "Labs",
] as const;

export const CSA_PROFILE_NOTES = [
  { date: "08-18-2026", note: "Consult Purchased for Therapist. Reservation fe…" },
  { date: "08-18-2026", note: "Other: Testing; Cancellation Driver: Patient" },
  { date: "08-18-2026", note: "Consult Purchased for Therapist." },
  { date: "08-18-2026", note: "Consult Purchased for Therapist. Reservation fe…" },
  { date: "08-18-2026", note: "Other: Testing; Cancellation Driver: Patient" },
] as const;

export const CSA_PROFILE_ACTIVITY = [
  { date: "08-18-26 10:30", type: "Consult Purchased", details: "" },
  {
    date: "08-18-26 10:15",
    type: "Appointment Canceled",
    details: "Appointment id: 26748873",
  },
  {
    date: "08-18-26 09:56",
    type: "Video Consultation Scheduled",
    details:
      "08/18/2026 at 12:08 PM EDT: Customer Appointment Initiated. Chief Complaint: I have been feeling down. Appointment id: 26748873",
  },
] as const;
