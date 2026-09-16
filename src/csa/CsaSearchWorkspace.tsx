import * as React from "react";
import {
  Button,
  Card,
  CheckboxField,
  DateField,
  FieldNote,
  Heading,
  Input,
  Label,
  Link,
  RadioField,
  RadioGroup,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  ToggleGroup,
  ToggleGroupItem,
} from "@everkit/design-system";
import { CSA_HISTORY } from "./data";
import type { PatientSearchPrefill } from "./profileUtils";

type SearchType = "patient" | "provider" | "appointment" | "transaction";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function FieldRow({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[var(--everkit-surface-gap-sm)]">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function parseSearchDob(text: string): Date | undefined {
  const m = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return undefined;
  const mm = Number(m[1]);
  const dd = Number(m[2]);
  const yyyy = Number(m[3]);
  const d = new Date(yyyy, mm - 1, dd);
  if (d.getFullYear() === yyyy && d.getMonth() === mm - 1 && d.getDate() === dd) return d;
  return undefined;
}

function emptyPatientQuery(): PatientSearchPrefill {
  return { firstName: "", lastName: "", phone: "", dob: "" };
}

// ---------------------------------------------------------------------------
// Patient Search form
// ---------------------------------------------------------------------------

function PatientSearchForm({
  prefill,
  affiliationKnownDefault = false,
  onSearch,
}: {
  prefill?: PatientSearchPrefill;
  affiliationKnownDefault?: boolean;
  onSearch?: (query: PatientSearchPrefill) => void;
}) {
  const [userId, setUserId] = React.useState("");
  const [firstName, setFirstName] = React.useState(prefill?.firstName ?? "");
  const [lastName, setLastName] = React.useState(prefill?.lastName ?? "");
  const [phone, setPhone] = React.useState(prefill?.phone ?? "");
  const [dob, setDob] = React.useState<Date | undefined>(() => parseSearchDob(prefill?.dob ?? ""));
  const [subscriberId, setSubscriberId] = React.useState("");
  const [affiliationKnown, setAffiliationKnown] = React.useState(affiliationKnownDefault);
  const [expandSearch, setExpandSearch] = React.useState(false);
  const [dateFieldKey, setDateFieldKey] = React.useState(0);

  const runSearch = () => {
    const mm = dob ? String(dob.getMonth() + 1).padStart(2, "0") : "";
    const dd = dob ? String(dob.getDate()).padStart(2, "0") : "";
    const yyyy = dob ? String(dob.getFullYear()) : "";
    onSearch?.({ firstName, lastName, phone, dob: dob ? `${mm}/${dd}/${yyyy}` : "" });
  };

  const runReset = () => {
    setUserId(""); setFirstName(""); setLastName(""); setPhone("");
    setDob(undefined); setDateFieldKey((k) => k + 1); setSubscriberId("");
    setAffiliationKnown(false); setExpandSearch(false);
    onSearch?.(emptyPatientQuery());
  };

  return (
    <div className="flex flex-col gap-[var(--everkit-surface-gap)]">
      <FieldRow label="User ID">
        <Input value={userId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserId(e.target.value)} />
      </FieldRow>
      <FieldRow label="First Name">
        <Input value={firstName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} />
      </FieldRow>
      <FieldRow label="Last Name">
        <Input value={lastName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} />
      </FieldRow>
      <FieldRow label="Phone">
        <Input value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} />
      </FieldRow>
      <FieldRow label="DOB">
        <DateField key={dateFieldKey} value={dob} onValueChange={setDob} />
        <FieldNote>MM/DD/YYYY</FieldNote>
      </FieldRow>
      <FieldRow label="Subscriber ID">
        <Input value={subscriberId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubscriberId(e.target.value)} />
      </FieldRow>
      <CheckboxField
        id="csa-affiliation-known"
        label="Affiliation Known"
        checked={affiliationKnown}
        onCheckedChange={(v: boolean | "indeterminate") => setAffiliationKnown(v === true)}
      />
      <CheckboxField
        id="csa-expand-search"
        label="Expand Search"
        checked={expandSearch}
        onCheckedChange={(v: boolean | "indeterminate") => setExpandSearch(v === true)}
      />
      <div className="flex w-fit items-center gap-[var(--everkit-surface-gap)]">
        <Button type="button" onClick={runSearch}>Search</Button>
        <Button type="button" variant="neutral-secondary" onClick={runReset}>Reset</Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Provider Search form
// ---------------------------------------------------------------------------

function ProviderSearchForm() {
  const [userId, setUserId] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [affiliation, setAffiliation] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [providerType, setProviderType] = React.useState("");
  const [specialty, setSpecialty] = React.useState("");
  const [licensedState, setLicensedState] = React.useState("");
  const [licenseType, setLicenseType] = React.useState("all");
  const [availability, setAvailability] = React.useState("all");
  const [language, setLanguage] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [cellPhone, setCellPhone] = React.useState("");
  const [npi, setNpi] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [gender, setGender] = React.useState("");

  return (
    <div className="flex flex-col gap-[var(--everkit-surface-gap)]">
      <FieldRow label="User ID">
        <Input value={userId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserId(e.target.value)} />
      </FieldRow>
      <FieldRow label={<>First Name<br /><span className="font-normal text-muted-foreground">(exact match)</span></>}>
        <Input value={firstName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} />
      </FieldRow>
      <FieldRow label={<>Last Name<br /><span className="font-normal text-muted-foreground">(exact match)</span></>}>
        <Input value={lastName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} />
      </FieldRow>
      <FieldRow label="Affiliation">
        <Select value={affiliation} onValueChange={setAffiliation}>
          <SelectTrigger><SelectValue placeholder="Please Select Affiliation" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cigna">Cigna</SelectItem>
            <SelectItem value="dtc">DTC</SelectItem>
            <SelectItem value="hcsc">HCSC</SelectItem>
          </SelectContent>
        </Select>
      </FieldRow>
      <FieldRow label="Status">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue placeholder="Please Select Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </FieldRow>
      <FieldRow label="Provider Type">
        <Select value={providerType} onValueChange={setProviderType}>
          <SelectTrigger><SelectValue placeholder="Please Select Provider Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Health</SelectItem>
            <SelectItem value="psychologist">Psychologist</SelectItem>
            <SelectItem value="psychiatrist">Psychiatrist</SelectItem>
            <SelectItem value="therapist">Therapist</SelectItem>
            <SelectItem value="wellness">Annual Wellness</SelectItem>
          </SelectContent>
        </Select>
      </FieldRow>
      <FieldRow label="Speciality">
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger><SelectValue placeholder="Please Select Speciality" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="adult">Adult Health</SelectItem>
            <SelectItem value="pediatric">Pediatric</SelectItem>
            <SelectItem value="mental-health">Mental Health</SelectItem>
            <SelectItem value="dermatology">Dermatology</SelectItem>
          </SelectContent>
        </Select>
      </FieldRow>
      <FieldRow label="Licensed State">
        <Select value={licensedState} onValueChange={setLicensedState}>
          <SelectTrigger><SelectValue placeholder="Please Select State" /></SelectTrigger>
          <SelectContent>
            {["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"].map((s) => (
              <SelectItem key={s} value={s.toLowerCase().replace(/\s+/g, "-")}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>
      <div className="flex flex-col gap-[var(--everkit-surface-gap-sm)]">
        <Label>License Type</Label>
        <RadioGroup value={licenseType} onValueChange={setLicenseType}>
          <RadioField id="prov-lic-all" value="all" label="All License Types" />
          <RadioField id="prov-lic-medicaid" value="medicaid" label="Medicaid" />
          <RadioField id="prov-lic-medicare" value="medicare" label="Medicare" />
        </RadioGroup>
      </div>
      <FieldRow label="Availability">
        <Select value={availability} onValueChange={setAvailability}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="now">Available Now</SelectItem>
            <SelectItem value="24h">Next 24 Hours</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
          </SelectContent>
        </Select>
      </FieldRow>
      <FieldRow label="Language">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger><SelectValue placeholder="Please Select Language" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="pt">Portuguese</SelectItem>
            <SelectItem value="zh">Chinese</SelectItem>
          </SelectContent>
        </Select>
      </FieldRow>
      <FieldRow label="Phone">
        <Input value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} />
      </FieldRow>
      <FieldRow label="Cell Phone">
        <Input value={cellPhone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCellPhone(e.target.value)} />
      </FieldRow>
      <FieldRow label="NPI">
        <Input value={npi} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNpi(e.target.value)} />
      </FieldRow>
      <FieldRow label="Email">
        <Input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
      </FieldRow>
      <FieldRow label="Gender">
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger><SelectValue placeholder="Please Select Gender" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="nonbinary">Non-binary</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </FieldRow>
      <Button className="w-fit">Search</Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Appointment Search form
// ---------------------------------------------------------------------------

function AppointmentSearchForm() {
  const [appointmentId, setAppointmentId] = React.useState("");
  return (
    <div className="flex flex-col gap-[var(--everkit-surface-gap)]">
      <FieldRow label="Appointment ID">
        <Input value={appointmentId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAppointmentId(e.target.value)} />
      </FieldRow>
      <Button className="w-fit">Search</Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Transaction ID Search form
// ---------------------------------------------------------------------------

function TransactionSearchForm() {
  const [claimType, setClaimType] = React.useState("athena");
  const [transactionId, setTransactionId] = React.useState("");
  return (
    <div className="flex flex-col gap-[var(--everkit-surface-gap)]">
      <div className="flex flex-col gap-[var(--everkit-surface-gap-sm)]">
        <Label>Search for:</Label>
        <RadioGroup value={claimType} onValueChange={setClaimType}>
          <RadioField id="txn-athena" value="athena" label="Athena Claim ID" />
          <RadioField id="txn-authnet" value="authnet" label="Auth.net Claim ID" />
          <RadioField id="txn-mdlive" value="mdlive" label="MD Live Claim Number" />
        </RadioGroup>
      </div>
      <FieldRow label="Transaction ID">
        <Input value={transactionId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransactionId(e.target.value)} />
      </FieldRow>
      <Button className="w-fit">Search</Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Search history tables
// ---------------------------------------------------------------------------

const PROVIDER_HISTORY = [
  { id: "642253143", last: "testing",          first: "providertest03",           phone: "7064296028" },
  { id: "642316452", last: "Do-Not-Modify",     first: "Aut-Provider-Formulary-01",phone: "7868832850" },
  { id: "642283123", last: "MProvider08",       first: "Automation",               phone: "9812743923" },
  { id: "642313569", last: "AutomationGHP193",  first: "test",                     phone: "5557619581" },
  { id: "642316128", last: "Psychiatristprovider", first: "Farahtesting",          phone: "9928829929" },
];

function SearchHistoryTable({ title, rows }: { title: string; rows: typeof CSA_HISTORY }) {
  return (
    <div className="flex flex-col gap-[var(--everkit-surface-gap)]">
      <Separator />
      <Heading level={3} className="text-sm font-semibold">{title}</Heading>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell><Link href="#" size="sm">{row.id}</Link></TableCell>
              <TableCell>{row.last}</TableCell>
              <TableCell>{row.first}</TableCell>
              <TableCell className="tabular-nums">{row.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CsaSearchWorkspace
// ---------------------------------------------------------------------------

/** Patient search form + history. Home keeps search-type toggle; the Patient Search page does not. */
export function CsaSearchWorkspace({
  prefill,
  prefillKey,
  affiliationKnownDefault = false,
  onSearch,
  showSearchTypeTabs = true,
}: {
  prefill?: PatientSearchPrefill;
  prefillKey?: string;
  affiliationKnownDefault?: boolean;
  onSearch?: (query: PatientSearchPrefill) => void;
  showSearchTypeTabs?: boolean;
}) {
  const [searchType, setSearchType] = React.useState<SearchType>("patient");

  const patientContent = (
    <>
      <PatientSearchForm
        key={prefillKey}
        prefill={prefill}
        affiliationKnownDefault={affiliationKnownDefault}
        onSearch={onSearch}
      />
      <SearchHistoryTable title="Patient Search History" rows={CSA_HISTORY} />
    </>
  );

  if (!showSearchTypeTabs) {
    return (
      <Card shadow={false} className="border bg-background py-0">
        <div className="flex flex-col gap-[var(--everkit-content-gap-block)] p-6">
          {patientContent}
        </div>
      </Card>
    );
  }

  return (
    <Card shadow={false} className="border bg-background py-0">
      <div className="flex flex-col gap-[var(--everkit-content-gap-block)] p-6">
        <div className="flex flex-col gap-[var(--everkit-surface-gap-sm)]">
          <Label id="search-type-label">Search by</Label>
          <ToggleGroup
            type="single"
            variant="subtle"
            value={searchType}
            onValueChange={(v: string) => { if (v) setSearchType(v as SearchType); }}
            aria-labelledby="search-type-label"
          >
            <ToggleGroupItem value="patient">Patient</ToggleGroupItem>
            <ToggleGroupItem value="provider">Provider</ToggleGroupItem>
            <ToggleGroupItem value="appointment">Appointment</ToggleGroupItem>
            <ToggleGroupItem value="transaction">Transaction ID</ToggleGroupItem>
          </ToggleGroup>
        </div>

        {searchType === "patient" && patientContent}

        {searchType === "provider" && (
          <>
            <ProviderSearchForm />
            <SearchHistoryTable title="Provider Search History" rows={PROVIDER_HISTORY} />
          </>
        )}

        {searchType === "appointment" && <AppointmentSearchForm />}

        {searchType === "transaction" && <TransactionSearchForm />}
      </div>
    </Card>
  );
}
