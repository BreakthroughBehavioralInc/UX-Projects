import * as React from "react";
import { CSA_APPOINTMENTS, CSA_SEARCH_PATIENTS, type CsaPatientSearchRow } from "../data";

const TEAL = "#176B76";
const INPUT_STYLE: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "4px 8px",
  fontSize: "13px",
  width: "100%",
  outline: "none",
  backgroundColor: "#fff",
};
const LABEL_STYLE: React.CSSProperties = {
  fontSize: "13px",
  color: "#333",
  width: "110px",
  flexShrink: 0,
  paddingTop: "5px",
};
const BTN_TEAL: React.CSSProperties = {
  backgroundColor: TEAL,
  color: "#fff",
  border: "none",
  padding: "6px 18px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  borderRadius: "2px",
};
const BTN_OUTLINE: React.CSSProperties = {
  backgroundColor: "#fff",
  color: "#333",
  border: "1px solid #aaa",
  padding: "6px 18px",
  fontSize: "13px",
  cursor: "pointer",
  borderRadius: "2px",
};

type SearchTab = "patient" | "provider" | "appointment" | "transaction";

interface Props {
  onSelectPatient?: (row: CsaPatientSearchRow) => void;
  /** Pre-fills the patient search form and auto-shows results on mount. */
  initialSearch?: { firstName?: string; lastName?: string; phone?: string };
}

export function CsaLegacyHomePage({ onSelectPatient, initialSearch }: Props) {
  const [searchTab, setSearchTab] = React.useState<SearchTab>("patient");
  const [searchResults, setSearchResults] = React.useState<CsaPatientSearchRow[] | null>(() => {
    if (!initialSearch) return null;
    const { firstName, lastName, phone } = initialSearch;
    if (!firstName && !lastName && !phone) return null;
    return CSA_SEARCH_PATIENTS.filter((p) => {
      const matchFirst = !firstName || p.firstName.toLowerCase().startsWith(firstName.toLowerCase());
      const matchLast = !lastName || p.lastName.toLowerCase().startsWith(lastName.toLowerCase());
      const matchPhone = !phone || p.phone.replace(/\D/g, "").includes(phone.replace(/\D/g, ""));
      return matchFirst && matchLast && matchPhone;
    });
  });
  const [form, setForm] = React.useState({
    userId: "",
    firstName: initialSearch?.firstName ?? "",
    lastName: initialSearch?.lastName ?? "",
    phone: initialSearch?.phone ?? "",
    dob: "", subscriberId: "", affiliationKnown: false, expandSearch: false,
  });

  function handleSearch() {
    const results = CSA_SEARCH_PATIENTS.filter((p) => {
      const matchFirst = !form.firstName || p.firstName.toLowerCase().startsWith(form.firstName.toLowerCase());
      const matchLast = !form.lastName || p.lastName.toLowerCase().startsWith(form.lastName.toLowerCase());
      const matchPhone = !form.phone || p.phone.replace(/\D/g, "").includes(form.phone.replace(/\D/g, ""));
      const matchId = !form.userId || p.userId.includes(form.userId);
      return matchFirst && matchLast && matchPhone && matchId;
    });
    setSearchResults(results);
  }

  return (
    <div style={{ backgroundColor: "#f0f0f0", minHeight: "100%", padding: "10px 12px" }}>
      {/* Timezone */}
      <div style={{ fontSize: "12px", fontWeight: 700, color: "#333", marginBottom: "8px" }}>
        TIMEZONE: PST
      </div>

      {/* Message of the Day */}
      <div style={{ marginBottom: "10px" }}>
        <div style={{ borderBottom: "1px solid #ccc" }}>
          <button
            style={{
              background: "none", border: "none",
              borderBottom: `2px solid ${TEAL}`,
              padding: "6px 0", marginBottom: "-1px",
              fontSize: "14px", color: TEAL, fontWeight: 600, cursor: "pointer",
            }}
          >
            Message of the Day
          </button>
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderTop: "none",
            padding: "10px 14px",
            fontSize: "13px",
            color: "#333",
          }}
        >
          Turn the page, wash your hands.
        </div>
      </div>

      {/* Main content: left search panel + right appointments */}
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>

        {/* ── LEFT: search panel ── */}
        <div style={{ width: "290px", flexShrink: 0, backgroundColor: "#fff", border: "1px solid #ddd" }}>

          {/* Search tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #ddd" }}>
            {(["patient", "provider", "appointment", "transaction"] as SearchTab[]).map((t) => {
              const labels: Record<SearchTab, string> = {
                patient: "Patient Search",
                provider: "Provider Search",
                appointment: "Appointment Search",
                transaction: "Transaction ID Search",
              };
              const active = searchTab === t;
              return (
                <button
                  key={t}
                  onClick={() => { setSearchTab(t); setSearchResults(null); }}
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    borderBottom: active ? `2px solid ${TEAL}` : "2px solid transparent",
                    padding: "8px 4px",
                    fontSize: "12px",
                    color: active ? TEAL : "#555",
                    fontWeight: active ? 700 : 400,
                    cursor: "pointer",
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}
                >
                  {labels[t]}
                </button>
              );
            })}
          </div>

          {/* Search form body */}
          <div style={{ padding: "12px" }}>
            {searchTab === "patient" && (
              <PatientSearchForm
                form={form}
                onChange={(k, v) => setForm((f) => ({ ...f, [k]: v }))}
                onSearch={handleSearch}
                onReset={() => { setForm({ userId: "", firstName: "", lastName: "", phone: "", dob: "", subscriberId: "", affiliationKnown: false, expandSearch: false }); setSearchResults(null); }}
              />
            )}
            {searchTab === "provider" && <ProviderSearchForm />}
            {searchTab === "appointment" && <AppointmentSearchForm />}
            {searchTab === "transaction" && <TransactionSearchForm />}
          </div>

          {/* Patient Search History */}
          {searchTab === "patient" && (
            <div style={{ borderTop: "1px solid #ddd" }}>
              <div
                style={{
                  padding: "8px 12px",
                  fontSize: "13px",
                  fontWeight: 600,
                  backgroundColor: "#fafafa",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Patient Search History
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f5f5f5" }}>
                    {["User ID", "Last Name", "First Name", "Phone"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "5px 8px",
                          borderBottom: "1px solid #ddd",
                          fontWeight: 600,
                          color: "#333",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CSA_SEARCH_PATIENTS.map((p) => (
                    <tr
                      key={p.userId}
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <td style={{ padding: "5px 8px" }}>
                        <button
                          onClick={() => onSelectPatient?.(p)}
                          style={{
                            background: "none",
                            border: "none",
                            color: TEAL,
                            cursor: "pointer",
                            padding: 0,
                            fontSize: "12px",
                          }}
                        >
                          {p.userId}
                        </button>
                      </td>
                      <td style={{ padding: "5px 8px" }}>{p.lastName}</td>
                      <td style={{ padding: "5px 8px" }}>{p.firstName}</td>
                      <td style={{ padding: "5px 8px" }}>{p.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── RIGHT: content area ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Search results table (when search was run) */}
          {searchResults !== null && (
            <div style={{ marginBottom: "12px" }}>
              <SearchResultsTable results={searchResults} onSelect={onSelectPatient} />
            </div>
          )}

          {/* Upcoming Appointments */}
          <div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#333", marginBottom: "8px" }}>
              Upcoming Appointments
            </div>
            <UpcomingAppointmentsTable />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Search forms ─────────────────────────────────────────────── */

function PatientSearchForm({
  form,
  onChange,
  onSearch,
  onReset,
}: {
  form: {
    userId: string; firstName: string; lastName: string; phone: string;
    dob: string; subscriberId: string; affiliationKnown: boolean; expandSearch: boolean;
  };
  onChange: (k: string, v: string | boolean) => void;
  onSearch: () => void;
  onReset: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {([
        ["User ID", "userId"],
        ["First Name", "firstName"],
        ["Last Name", "lastName"],
        ["Phone", "phone"],
        ["Subscriber ID", "subscriberId"],
      ] as const).map(([label, key]) => (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <label style={LABEL_STYLE}>{label}</label>
          <input
            style={INPUT_STYLE}
            value={form[key]}
            onChange={(e) => onChange(key, e.target.value)}
          />
        </div>
      ))}

      {/* DOB */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <label style={LABEL_STYLE}>DOB</label>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            placeholder="mm/dd/yyyy"
            style={{ ...INPUT_STYLE, paddingRight: "28px" }}
            value={form.dob}
            onChange={(e) => onChange("dob", e.target.value)}
          />
          <span style={{ position: "absolute", right: "6px", top: "5px", fontSize: "14px", color: "#888", cursor: "pointer" }}>
            📅
          </span>
        </div>
      </div>

      {/* Checkboxes */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <label style={LABEL_STYLE}>Affiliation Known</label>
        <input
          type="checkbox"
          checked={form.affiliationKnown}
          onChange={(e) => onChange("affiliationKnown", e.target.checked)}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <label style={LABEL_STYLE}>Expand Search</label>
        <input
          type="checkbox"
          checked={form.expandSearch}
          onChange={(e) => onChange("expandSearch", e.target.checked)}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px", marginTop: "4px" }}>
        <button style={BTN_OUTLINE} onClick={onReset}>Reset</button>
        <button style={BTN_TEAL} onClick={onSearch}>Search</button>
      </div>
    </div>
  );
}

function ProviderSearchForm() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
      {["User ID", "First Name\n(exact match)", "Last Name\n(exact match)"].map((label) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <label style={LABEL_STYLE}>{label}</label>
          <input style={INPUT_STYLE} />
        </div>
      ))}
      {["Affiliation", "Status", "Provider Type", "Speciality", "Licensed State"].map((label) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <label style={LABEL_STYLE}>{label}</label>
          <select style={{ ...INPUT_STYLE }}>
            <option>Please Select {label}</option>
          </select>
        </div>
      ))}
      <div style={{ display: "flex", flexDirection: "column", gap: "3px", margin: "4px 0" }}>
        {["All License Types", "Medicaid", "Medicare"].map((opt, i) => (
          <label key={opt} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
            <input type="radio" name="licenseType" defaultChecked={i === 0} /> {opt}
          </label>
        ))}
      </div>
      {["Availability", "Language"].map((label) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <label style={LABEL_STYLE}>{label}</label>
          <select style={{ ...INPUT_STYLE }}>
            <option>{label === "Availability" ? "All" : `Please Select ${label}`}</option>
          </select>
        </div>
      ))}
      {["Phone", "Cell Phone", "NPI", "Email"].map((label) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <label style={LABEL_STYLE}>{label}</label>
          <input style={INPUT_STYLE} />
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <label style={LABEL_STYLE}>Gender</label>
        <select style={{ ...INPUT_STYLE }}>
          <option>Please Select Gender</option>
        </select>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
        <button style={BTN_TEAL}>Search</button>
      </div>
    </div>
  );
}

function AppointmentSearchForm() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
        <label style={LABEL_STYLE}>Appointment ID</label>
        <input style={INPUT_STYLE} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={BTN_TEAL}>Search</button>
      </div>
    </div>
  );
}

function TransactionSearchForm() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ fontSize: "13px", color: "#333" }}>Search for:</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "4px" }}>
        {["Athena Claim ID", "Auth.net Claim ID", "MDLIVE Claim Number"].map((opt, i) => (
          <label key={opt} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: TEAL }}>
            <input type="radio" name="txType" defaultChecked={i === 0} /> {opt}
          </label>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
        <label style={LABEL_STYLE}>Transaction ID</label>
        <input style={INPUT_STYLE} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={BTN_TEAL}>Search</button>
      </div>
    </div>
  );
}

/* ── Search results table ────────────────────────────────────── */

function SearchResultsTable({
  results,
  onSelect,
}: {
  results: CsaPatientSearchRow[];
  onSelect?: (row: CsaPatientSearchRow) => void;
}) {
  const TH: React.CSSProperties = {
    textAlign: "left", padding: "6px 8px", borderBottom: "1px solid #ddd",
    fontWeight: 600, fontSize: "12px", backgroundColor: "#f5f5f5",
  };
  const TD: React.CSSProperties = { padding: "6px 8px", fontSize: "12px", borderBottom: "1px solid #eee" };

  const sections = [
    {
      title: "Patients",
      cols: ["Registered on", "User ID", "Subscriber ID", "Full name", "Date of birth", "Email", "Phone", "Zip code", "Status", "Affiliation", "Action"],
    },
    { title: "Eligible Members", cols: ["Registered on", "First name", "Last name", "Date of birth", "Email", "Phone", "Zip code", "Status", "Affiliation", "Action"] },
  ];

  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #ddd" }}>
      {sections.map((sec) => (
        <div key={sec.title}>
          <div style={{ padding: "8px 12px", fontWeight: 600, fontSize: "14px", borderBottom: "1px solid #ddd" }}>
            {sec.title}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {sec.cols.map((c) => <th key={c} style={TH}>{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr><td colSpan={sec.cols.length} style={{ ...TD, textAlign: "center", color: "#777" }}>Member not found</td></tr>
                ) : sec.title === "Patients" ? (
                  results.map((p) => (
                    <tr key={p.userId}>
                      <td style={TD}>{p.registeredOn}</td>
                      <td style={TD}>
                        <button onClick={() => onSelect?.(p)} style={{ background: "none", border: "none", color: TEAL, cursor: "pointer", padding: 0, fontSize: "12px" }}>
                          {p.userId}
                        </button>
                      </td>
                      <td style={TD}>{p.subscriberId}</td>
                      <td style={TD}>{p.firstName} {p.lastName}</td>
                      <td style={TD}>{p.dob}</td>
                      <td style={TD}>{p.email}</td>
                      <td style={TD}>{p.phone}</td>
                      <td style={TD}>{p.zip}</td>
                      <td style={TD}>{p.status}</td>
                      <td style={TD}>{p.affiliation}</td>
                      <td style={TD}><button style={{ background: "none", border: "none", color: TEAL, cursor: "pointer", padding: 0, fontSize: "12px" }} onClick={() => onSelect?.(p)}>View</button></td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={sec.cols.length} style={{ ...TD, textAlign: "center", color: "#777" }}>Member not found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Upcoming Appointments table ─────────────────────────────── */

function UpcomingAppointmentsTable() {
  const TH: React.CSSProperties = {
    textAlign: "left", padding: "7px 8px", borderBottom: "1px solid #ddd",
    borderRight: "1px solid #ddd", fontWeight: 600, fontSize: "12px",
    backgroundColor: "#f5f5f5", whiteSpace: "nowrap",
  };
  const TD: React.CSSProperties = {
    padding: "6px 8px", fontSize: "12px", borderBottom: "1px solid #eee",
    borderRight: "1px solid #eee", verticalAlign: "top",
  };

  const headers = [
    "Date/Time\nCreated", "Appointment\nDate", "Appointment\nTime",
    "Affiliation", "State", "Status", "Patient ID", "Age", "Symptom",
    "Customer Phone\n(Call Back Number)", "Consult\nType", "Provider\nType", "Provider",
  ];

  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #ddd", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} style={TH}>
                {h.split("\n").map((line, i) => (
                  <span key={i}>{line}{i < h.split("\n").length - 1 ? <br /> : null}</span>
                ))}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CSA_APPOINTMENTS.map((appt, idx) => (
            <tr key={idx}>
              <td style={TD}>{appt.created}</td>
              <td style={TD}>{appt.date}</td>
              <td style={TD}>{appt.time}</td>
              <td style={TD}>{appt.affiliation}</td>
              <td style={TD}>{appt.state}</td>
              <td style={TD}>Pending</td>
              <td style={TD}>
                <button style={{ background: "none", border: "none", color: TEAL, cursor: "pointer", padding: 0, fontSize: "12px" }}>
                  {appt.patientId}
                </button>
              </td>
              <td style={TD}>{appt.age}</td>
              <td style={TD}>{appt.symptom}</td>
              <td style={TD}>
                {appt.phone}{" "}
                <button style={{ background: "none", border: "none", color: TEAL, cursor: "pointer", padding: 0, fontSize: "12px" }}>
                  Update
                </button>
              </td>
              <td style={TD}>
                {appt.consultType}
                <br />
                <button style={{ background: "none", border: "none", color: TEAL, cursor: "pointer", padding: 0, fontSize: "12px" }}>
                  {appt.switchConsultTo}
                </button>
              </td>
              <td style={TD}>{appt.providerType}</td>
              <td style={TD}>{appt.provider}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
