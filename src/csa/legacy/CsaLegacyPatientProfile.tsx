import * as React from "react";
import type { SierraHandoffPayload } from "../../data/scenarios";
import { CSA_APPOINTMENTS, CSA_PROFILE_DEFAULT, CSA_PROFILE_NOTES } from "../data";

const TEAL = "#176B76";
const RED = "#cc0000";
const GREEN_ALERT_BG = "#d4edda";
const GREEN_ALERT_BORDER = "#28a745";
const YELLOW_ALERT_BG = "#fff3cd";
const YELLOW_ALERT_BORDER = "#ffc107";

const INPUT_STYLE: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "4px 8px",
  fontSize: "13px",
  width: "100%",
  outline: "none",
  backgroundColor: "#fff",
};
const SELECT_STYLE: React.CSSProperties = { ...INPUT_STYLE };
const LABEL_STYLE: React.CSSProperties = {
  fontSize: "13px",
  color: "#333",
  display: "block",
  marginBottom: "2px",
};
const ROW_STYLE: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "8px",
  marginBottom: "6px",
};
const LABEL_COL: React.CSSProperties = {
  width: "175px",
  flexShrink: 0,
  fontSize: "13px",
  color: "#333",
  paddingTop: "5px",
};
const BTN_TEAL: React.CSSProperties = {
  backgroundColor: TEAL,
  color: "#fff",
  border: "none",
  padding: "5px 16px",
  fontSize: "13px",
  cursor: "pointer",
  borderRadius: "2px",
};
const BTN_RED: React.CSSProperties = {
  backgroundColor: "#e53935",
  color: "#fff",
  border: "none",
  padding: "5px 16px",
  fontSize: "13px",
  cursor: "pointer",
  borderRadius: "2px",
};

type ProfileTab =
  | "Profile"
  | "Patient Intake"
  | "Appointments"
  | "Appointment Requests"
  | "Billing/Credits"
  | "Insurance Details"
  | "Eligible Members"
  | "Health History"
  | "Pharmacy/Rx"
  | "Notes"
  | "Activity History"
  | "Medication"
  | "Chat History"
  | "Orders"
  | "Schedule Sessions"
  | "Audit Logs"
  | "Records"
  | "Hets Transaction 270/271"
  | "Transaction History"
  | "Labs";

const TAB_ROW_1: ProfileTab[] = [
  "Profile", "Patient Intake", "Appointments", "Appointment Requests",
  "Billing/Credits", "Insurance Details", "Eligible Members", "Health History",
  "Pharmacy/Rx", "Notes", "Activity History", "Medication", "Chat History", "Orders",
];
const TAB_ROW_2: ProfileTab[] = [
  "Schedule Sessions", "Audit Logs", "Records",
  "Hets Transaction 270/271", "Transaction History", "Labs",
];

interface Props {
  payload?: SierraHandoffPayload;
  defaultTab?: ProfileTab;
}

export function CsaLegacyPatientProfile({ payload, defaultTab }: Props) {
  const [activeTab, setActiveTab] = React.useState<ProfileTab>(defaultTab ?? "Profile");

  React.useEffect(() => {
    setActiveTab(defaultTab ?? "Profile");
  }, [defaultTab]);

  const pt = payload?.matchedPatient;
  const displayName = pt ? `${pt.firstName} ${pt.lastName}` : `${CSA_PROFILE_DEFAULT.firstName} ${CSA_PROFILE_DEFAULT.lastName}`;
  const userId = CSA_PROFILE_DEFAULT.userId;
  const dob = pt?.dob ?? CSA_PROFILE_DEFAULT.dobIso;
  const age = CSA_PROFILE_DEFAULT.age;

  function TabButton({ label }: { label: ProfileTab }) {
    const active = activeTab === label;
    return (
      <button
        onClick={() => setActiveTab(label)}
        style={{
          backgroundColor: active ? TEAL : "#fff",
          border: `1px solid ${active ? TEAL : "#ccc"}`,
          borderRadius: "3px",
          padding: "5px 10px",
          fontSize: "12px",
          color: active ? "#fff" : "#333",
          fontWeight: active ? 600 : 400,
          cursor: "pointer",
          whiteSpace: "nowrap",
          marginBottom: "3px",
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-start", backgroundColor: "#f0f0f0" }}>
      {/* ── Left sidebar: Profile Summary ── */}
      <aside
        style={{
          width: "170px",
          flexShrink: 0,
          backgroundColor: "#fff",
          borderRight: "1px solid #ddd",
          padding: "10px",
          fontSize: "12px",
          color: "#333",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "8px" }}>Profile Summary</div>

        <SummaryRow label="UserID:" value={userId} />
        <SummaryRow label="Status:" value="Active" />
        <SummaryRow label="Registration Source:" value="web-simplified" />
        <SummaryRow label="Full Name:" value={displayName} />
        <SummaryRow label="Pronouns:" value="He/Him" />
        <SummaryRow label="Birth Date :" value="01-03-1992" />
        <SummaryRow label="Age:" value={age} />
        <SummaryRow label="Gender:" value="Male" />
        <SummaryRow label="Residence State:" value="FLORIDA" />
        <SummaryRow label="Affiliation:" value="Survey Monkey (ID: 185)" />
        <SummaryRow label="Billing/Agreement:" value="0102-Survey" />
        <SummaryRow label="Care Plan:" value="Yes – Health Coaching" />
        <SummaryRow label="Wellbeing Tool:" value="Yes" />

        {/* Appointment info in red */}
        <div style={{ marginTop: "4px", marginBottom: "4px" }}>
          <span style={{ fontWeight: 600 }}>Appointment information:</span>{" "}
          <button
            style={{ background: "none", border: "none", color: RED, cursor: "pointer", padding: 0, fontSize: "12px" }}
          >
            No upcoming appointments
          </button>
        </div>

        {/* MDLIVE PCP */}
        <div style={{ marginTop: "4px" }}>
          <span style={{ fontWeight: 600 }}>MDLIVE PCP:</span>
          <div style={{ color: "#333", lineHeight: 1.5 }}>
            Raji primarycare<br />
            wertyu sunrise, 33325<br />
            9089012345<br />
            954-744-5961 (fax)<br />
            karnagolla.rajyalakshmi<br />
            @evernorth.com
          </div>
        </div>

        {/* Crisis Protocol button */}
        <div style={{ marginTop: "12px" }}>
          <button
            style={{
              backgroundColor: "#e53935",
              color: "#fff",
              border: "none",
              padding: "7px 10px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: "3px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              justifyContent: "center",
            }}
          >
            ✚ Crisis Protocol
          </button>
        </div>
      </aside>

      {/* ── Right: tabs + content ── */}
      <div style={{ flex: 1, padding: "10px 12px", minWidth: 0 }}>
        {/* TIMEZONE */}
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#333", marginBottom: "8px" }}>
          TIMEZONE: PST
        </div>

        {/* Tab rows */}
        <div style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "4px" }}>
            {TAB_ROW_1.map((t) => <TabButton key={t} label={t} />)}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {TAB_ROW_2.map((t) => <TabButton key={t} label={t} />)}
          </div>
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "Profile" && <ProfileTabContent dob={dob} displayName={displayName} />}
          {activeTab === "Patient Intake" && (
            <PatientIntakeTabContent
              patientName={displayName}
              phone={
                payload?.collectedFields?.phone ??
                payload?.matchedPatient?.phone ??
                ""
              }
            />
          )}
          {activeTab === "Appointments" && <AppointmentsTabContent />}
          {!["Profile", "Patient Intake", "Appointments"].includes(activeTab) && (
            <div style={{ backgroundColor: "#fff", border: "1px solid #ddd", padding: "24px", textAlign: "center", color: "#888", fontSize: "13px" }}>
              {activeTab} — content not shown in this prototype
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Profile tab ──────────────────────────────────────────────── */

function ProfileTabContent({ dob, displayName }: { dob: string; displayName: string }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
      {/* Left: Patient Details form */}
      <div style={{ flex: "0 0 460px", backgroundColor: "#fff", border: "1px solid #ddd", padding: "12px" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "10px" }}>Patient Details</div>

        <div style={{ ...ROW_STYLE }}>
          <button style={{ ...BTN_TEAL, marginLeft: "auto", display: "block" }}>Save</button>
        </div>

        <FormRow label="Status *"><select style={SELECT_STYLE}><option>Active</option><option>Inactive</option></select></FormRow>
        <FormRow label="Affiliation"><input style={INPUT_STYLE} defaultValue="Survey Monkey" /></FormRow>
        <FormRow label="USERID"><input style={INPUT_STYLE} defaultValue={CSA_PROFILE_DEFAULT.userId} readOnly /></FormRow>
        <FormRow label="Username"><input style={INPUT_STYLE} defaultValue="sainewwell03" /></FormRow>
        <FormRow label="Email *" hint="Used for 2-Factor Auth"><input style={INPUT_STYLE} defaultValue="saikiran.muddada@evernorth.com" /></FormRow>
        <FormRow label="First Name *"><input style={INPUT_STYLE} defaultValue="Sainew" /></FormRow>
        <FormRow label="Last Name *"><input style={INPUT_STYLE} defaultValue="Well03" /></FormRow>
        <FormRow label="Address1 *"><textarea style={{ ...INPUT_STYLE, height: "40px", resize: "vertical" }} defaultValue="121" /></FormRow>
        <FormRow label="Address2"><textarea style={{ ...INPUT_STYLE, height: "40px", resize: "vertical" }} /></FormRow>
        <FormRow label="City *"><input style={INPUT_STYLE} defaultValue="FORT LAUDERDALE" /></FormRow>
        <FormRow label="State *">
          <select style={SELECT_STYLE}>
            <option>FLORIDA</option>
            <option>CALIFORNIA</option>
            <option>NEW YORK</option>
          </select>
        </FormRow>
        <FormRow label="Zip *"><input style={INPUT_STYLE} defaultValue="33325" /></FormRow>
        <FormRow label="Primary Phone *" hint="Used for 2-Factor Auth"><input style={INPUT_STYLE} defaultValue="9284186159" /></FormRow>
        <FormRow label="Cell Phone"><input style={INPUT_STYLE} /></FormRow>
        <FormRow label="Emergency Contact No#"><input style={INPUT_STYLE} /></FormRow>
        <FormRow label="DOB *">
          <div style={{ position: "relative" }}>
            <input style={{ ...INPUT_STYLE, paddingRight: "28px" }} defaultValue="01-03-1992" />
            <span style={{ position: "absolute", right: "6px", top: "5px", fontSize: "14px", color: "#888" }}>📅</span>
          </div>
        </FormRow>
        <FormRow label="Sex Assigned At Birth *">
          <select style={SELECT_STYLE}><option>Male</option><option>Female</option><option>Intersex</option></select>
        </FormRow>
        <FormRow label="Gender Identity ?">
          <select style={SELECT_STYLE}><option>Female</option><option>Male</option><option>Non-binary</option></select>
        </FormRow>
        <FormRow label="Gender * ?" hint="Benefits provider">
          <select style={SELECT_STYLE}><option>Male</option><option>Female</option></select>
        </FormRow>
        <FormRow label="Pronouns">
          <select style={SELECT_STYLE}><option>He/Him</option><option>She/Her</option><option>They/Them</option></select>
        </FormRow>
        <FormRow label="Time Zone *">
          <select style={SELECT_STYLE}><option>Eastern Time</option><option>Central Time</option><option>Mountain Time</option><option>Pacific Time</option></select>
        </FormRow>
        <FormRow label="Preferred Language">
          <select style={SELECT_STYLE}><option>French</option><option>English</option><option>Spanish</option></select>
        </FormRow>
        <FormRow label="Deaf/Hearing Impaired">
          <div>
            <input type="checkbox" defaultChecked /> <span style={{ fontSize: "13px" }}>Previous service assistance type: ASL</span>
          </div>
        </FormRow>
        <FormRow label="VIP FLAG"><input type="checkbox" /></FormRow>
        <FormRow label="Deceased"><input type="checkbox" /></FormRow>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
          <button style={BTN_TEAL}>Save</button>
        </div>
      </div>

      {/* Right: actions + history */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ backgroundColor: "#fff", border: "1px solid #ddd", padding: "12px" }}>
          <div style={{ fontSize: "13px", marginBottom: "6px" }}>
            <strong>Registration Date</strong> : 03-11-2025
          </div>

          <ActionSection label="Reset Password"><button style={BTN_TEAL}>Reset Password</button></ActionSection>
          <ActionSection label="Re-affiliate Patient"><button style={BTN_TEAL}>Re-affiliate</button></ActionSection>
          <ActionSection label="Merge Account"><button style={BTN_TEAL}>Merge</button></ActionSection>
          <ActionSection label="Suspend User"><button style={BTN_TEAL}>Suspend User</button></ActionSection>
          <ActionSection label="Mobile Photo Upload"><button style={BTN_TEAL}>Send SMS</button></ActionSection>
          <ActionSection label="Patient Records"><button style={BTN_TEAL}>Access Patient Records</button></ActionSection>
        </div>

        {/* History/Notes section */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #ddd" }}>
          <div style={{ display: "flex", borderBottom: "1px solid #ddd" }}>
            {["History/Notes", "Activity History", "Chat History"].map((t, i) => (
              <button
                key={t}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: i === 0 ? `2px solid ${TEAL}` : "2px solid transparent",
                  padding: "8px 12px",
                  fontSize: "13px",
                  color: i === 0 ? TEAL : "#555",
                  fontWeight: i === 0 ? 600 : 400,
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ padding: "12px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>History/Notes</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  {["Date/Time", "Notes", "View"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid #ddd", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CSA_PROFILE_NOTES.map((note, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "6px 8px" }}>{note.date}</td>
                    <td style={{ padding: "6px 8px" }}>{note.note}</td>
                    <td style={{ padding: "6px 8px" }}>
                      <button style={{ background: "none", border: "none", color: TEAL, cursor: "pointer", padding: 0, fontSize: "12px" }}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: "10px" }}>
              <button style={BTN_TEAL}>Add Note</button>
            </div>
          </div>

          {/* Account Members */}
          <div style={{ borderTop: "1px solid #ddd", padding: "12px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>Account Members</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginBottom: "8px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  {["Name", "Primary / Dependent", "Action", "Status"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid #ddd", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "6px 8px" }}>Sainew Well03</td>
                  <td style={{ padding: "6px 8px" }}>Primary</td>
                  <td style={{ padding: "6px 8px" }}></td>
                  <td style={{ padding: "6px 8px" }}>Active</td>
                </tr>
              </tbody>
            </table>
            <button style={BTN_TEAL}>Add Registered Dependent</button>
          </div>

          {/* PCP sections */}
          <div style={{ borderTop: "1px solid #ddd", padding: "12px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>MDLIVE Primary Care Provider</div>
            <div style={{ fontSize: "13px", marginBottom: "6px" }}>
              <em>Current MDLIVE Primary Care Physician(s)</em><br />
              <strong>Raji primarycare</strong><br />
              900 Cottage Grove Rd, Bloomfield, CT 06002<br />
              (800) 400-6354
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button style={BTN_TEAL}>Edit PCP</button>
              <button style={BTN_RED}>Delete PCP</button>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #ddd", padding: "12px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>External Primary Care Provider</div>
            <div style={{ fontSize: "13px", color: "#555", marginBottom: "8px" }}>None</div>
            <button style={BTN_TEAL}>Add PCP</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Patient Intake tab ───────────────────────────────────────── */

function PatientIntakeTabContent({
  patientName,
  phone,
}: {
  patientName: string;
  phone: string;
}) {
  return (
    <div>
      {/* Alerts */}
      <div
        style={{
          display: "flex", alignItems: "flex-start", gap: "8px",
          backgroundColor: GREEN_ALERT_BG, border: `1px solid ${GREEN_ALERT_BORDER}`,
          padding: "10px 14px", marginBottom: "8px", fontSize: "13px", color: "#155724",
        }}
      >
        <span style={{ color: GREEN_ALERT_BORDER, fontWeight: 700, fontSize: "14px" }}>✓</span>
        Dermatology is an allowed service. Please follow internal processes for assisting this patient.
      </div>
      <div
        style={{
          display: "flex", alignItems: "flex-start", gap: "8px",
          backgroundColor: YELLOW_ALERT_BG, border: `1px solid ${YELLOW_ALERT_BORDER}`,
          padding: "10px 14px", marginBottom: "14px", fontSize: "13px", color: "#856404",
        }}
      >
        <span style={{ color: YELLOW_ALERT_BORDER, fontWeight: 700 }}>▲</span>
        This patient is deaf or hard of hearing. Consultation chat will be available, they may request accessibility assistance.
      </div>

      {/* Simple intake form */}
      <div
        style={{
          backgroundColor: "#fff", border: "1px solid #ddd",
          padding: "16px", maxWidth: "480px",
        }}
      >
        <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "12px" }}>Patient Intake</div>

        <FormRow label="Patient Name">
          <input style={{ ...INPUT_STYLE, backgroundColor: "#f5f5f5" }} value={patientName} readOnly />
        </FormRow>
        <FormRow label="State *">
          <select style={SELECT_STYLE}><option>FLORIDA</option></select>
        </FormRow>
        <FormRow label="Time Zone">
          <select style={SELECT_STYLE}><option>Eastern Time</option></select>
        </FormRow>
        <FormRow label="Call Back Number *">
          <input style={INPUT_STYLE} defaultValue={phone} />
        </FormRow>
        <FormRow label="Disposition">
          <select style={SELECT_STYLE}><option>Please Select</option></select>
        </FormRow>
      </div>
    </div>
  );
}

/* ── Appointments tab ────────────────────────────────────────── */

function AppointmentsTabContent() {
  const TH: React.CSSProperties = {
    textAlign: "left", padding: "6px 6px", borderBottom: "1px solid #ddd",
    borderRight: "1px solid #ddd", fontWeight: 600, fontSize: "11px",
    backgroundColor: "#f5f5f5", whiteSpace: "nowrap",
  };
  const TD: React.CSSProperties = {
    padding: "5px 6px", fontSize: "11px", borderBottom: "1px solid #eee",
    borderRight: "1px solid #eee", verticalAlign: "top",
  };

  return (
    <div>
      {/* Search bar */}
      <div
        style={{
          backgroundColor: "#fff", border: "1px solid #ddd",
          padding: "10px 12px", marginBottom: "8px",
          display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap",
        }}
      >
        <label style={{ fontSize: "13px", fontWeight: 600 }}>Appointment ID</label>
        <input style={{ ...INPUT_STYLE, width: "120px" }} />
        <label style={{ fontSize: "13px" }}>Method</label>
        <select style={{ ...INPUT_STYLE, width: "140px" }}>
          <option>Please Select</option>
          <option>Phone</option>
          <option>Video</option>
        </select>
        <label style={{ fontSize: "13px" }}>Status</label>
        <select style={{ ...INPUT_STYLE, width: "140px" }}>
          <option>Please Select</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Canceled</option>
        </select>
        <button
          style={{ backgroundColor: "#fff", color: "#333", border: "1px solid #aaa", padding: "5px 14px", fontSize: "13px", cursor: "pointer", borderRadius: "2px" }}
        >
          Reset
        </button>
        <button style={{ backgroundColor: TEAL, color: "#fff", border: "none", padding: "5px 14px", fontSize: "13px", cursor: "pointer", borderRadius: "2px" }}>
          Search
        </button>
      </div>

      {/* Appointments table */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #ddd", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["ID", "State", "Affiliation", "DOS", "Provider", "Chief Complaint", "Provider Type", "Visit Type", "Method", "Type of Service Assistance (ASL or CART)", "Patient's Callback Number", "Status", "Appt Review Status", "Appt Flag (Provider | Risk Mgmt)", "Action"].map((h) => (
                <th key={h} style={TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CSA_APPOINTMENTS.map((appt, i) => (
              <tr key={i}>
                <td style={TD}>
                  <button style={{ background: "none", border: "none", color: TEAL, cursor: "pointer", padding: 0, fontSize: "11px" }}>
                    2675{1693 + i}
                  </button>
                </td>
                <td style={TD}>{appt.state}</td>
                <td style={TD}>{appt.affiliation}</td>
                <td style={TD}>{appt.date}<br />{appt.time} EDT</td>
                <td style={TD}>
                  providertest03 testing -{" "}
                  <button style={{ background: "none", border: "none", color: TEAL, cursor: "pointer", padding: 0, fontSize: "11px" }}>642253143</button>
                </td>
                <td style={TD}>{appt.symptom}</td>
                <td style={TD}>{appt.providerType}</td>
                <td style={TD}>VPC</td>
                <td style={TD}>{appt.consultType.toLowerCase()}</td>
                <td style={TD}></td>
                <td style={TD}>{appt.phone}</td>
                <td style={TD}>{i === 0 ? "canceled" : i === 1 ? "completed" : "canceled"}</td>
                <td style={TD}></td>
                <td style={TD}>Not Flagged | N/A</td>
                <td style={TD}>
                  <button style={{ background: "none", border: "none", color: TEAL, cursor: "pointer", padding: 0, fontSize: "11px" }}>Show</button>
                  {" "}|{" "}
                  <button style={{ background: "none", border: "none", color: TEAL, cursor: "pointer", padding: 0, fontSize: "11px" }}>Flag Management</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "10px" }}>
        <button style={{ background: "none", border: "none", color: TEAL, cursor: "pointer", fontSize: "13px" }}>Previous</button>
        <button style={{ background: "none", border: "none", color: TEAL, cursor: "pointer", fontSize: "13px" }}>Next</button>
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */

function SummaryRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ marginBottom: "3px", lineHeight: 1.4 }}>
      <strong>{label}</strong> {value}
    </div>
  );
}

function FormRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ ...ROW_STYLE }}>
      <div style={{ ...LABEL_COL }}>
        <label style={LABEL_STYLE}>{label}</label>
        {hint && <span style={{ fontSize: "11px", color: "#777" }}>{hint}</span>}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

function ActionSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>{label}</div>
      {children}
    </div>
  );
}
