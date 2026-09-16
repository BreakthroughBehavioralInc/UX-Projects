import type { SierraHandoffPayload } from "../data/scenarios";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CheckboxField,
  DateField,
  FieldNote,
  Heading,
  Icon,
  Input,
  Label,
  Link,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from "@everkit/design-system";
import { CsaPageContainer } from "./CsaPageContainer";
import {
  CSA_PROFILE_ACTIVITY,
  CSA_PROFILE_DEFAULT,
  CSA_PROFILE_NOTES,
  CSA_PROFILE_TABS,
} from "./data";
import { profileIdentity } from "./profileUtils";

type ProfileFieldProps = {
  label: string;
  value?: string;
  required?: boolean;
  hint?: string;
  kind?: "text" | "select" | "date";
  placeholder?: string;
};

function parseDob(text: string): Date | undefined {
  const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return undefined;
  return new Date(Number(match[3]), Number(match[1]) - 1, Number(match[2]));
}

function ProfileField({
  label,
  value = "",
  required,
  hint,
  kind = "text",
  placeholder,
}: ProfileFieldProps) {
  const id = `pp-${label.replace(/\W+/g, "-").toLowerCase()}`;
  const noteId = `${id}-note`;

  const control =
    kind === "select" ? (
      <Select defaultValue={value || undefined} disabled>
        <SelectTrigger id={id} aria-describedby={hint ? noteId : undefined}>
          <SelectValue placeholder={placeholder ?? "Please Select"} />
        </SelectTrigger>
        <SelectContent>
          {value ? <SelectItem value={value}>{value}</SelectItem> : null}
        </SelectContent>
      </Select>
    ) : kind === "date" ? (
      <DateField
        id={id}
        disabled
        value={parseDob(value)}
        aria-describedby={hint ? noteId : undefined}
      />
    ) : (
      <Input id={id} readOnly defaultValue={value} aria-describedby={hint ? noteId : undefined} />
    );

  return (
    <div className="flex flex-col gap-[var(--everkit-surface-gap-sm)]">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {control}
      {hint ? <FieldNote id={noteId}>{hint}</FieldNote> : null}
    </div>
  );
}

function ProfileSummary({ payload }: { payload: SierraHandoffPayload }) {
  const who = profileIdentity(payload);
  const affiliationLabel = payload.affiliation.includes("DTC")
    ? `DTC (ID: ${CSA_PROFILE_DEFAULT.affiliationId})`
    : `${payload.affiliation} (ID: ${CSA_PROFILE_DEFAULT.affiliationId})`;

  const rows: [string, string][] = [
    ["UserID", who.userId],
    ["Status", "Active"],
    ["Registration Source", "patient-portal"],
    ["Full Name", who.full],
    ["Pronouns", "--"],
    ["Birth Date", who.dob],
    ["Age", CSA_PROFILE_DEFAULT.age],
    ["Gender", "Male"],
    ["Residence State", CSA_PROFILE_DEFAULT.state],
    ["Affiliation", affiliationLabel],
    ["Billing/Agreement", CSA_PROFILE_DEFAULT.billingAgreement],
    ["Care Plan", "No"],
    ["Wellbeing Tool", "No"],
  ];

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Profile Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-[var(--everkit-content-gap-cluster)]">
        {rows.map(([key, value]) => (
          <Text key={key} variant="body-small">
            <span className="font-semibold">{key}: </span>
            {value}
          </Text>
        ))}
        <Text variant="body-small" className="font-medium text-[var(--everkit-color-content-error)]">
          Appointment information: No upcoming appointments
        </Text>
        <Button variant="destructive-secondary" size="sm" className="w-fit">
          <Icon name="emergency" size="sm" aria-hidden />
          Crisis Protocol
        </Button>
      </CardContent>
    </Card>
  );
}

function tabSlug(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** CSA profile section nav — DS scrollable line tabs (not faux button chips). */
function ProfileTabStrip() {
  const defaultTab = tabSlug(CSA_PROFILE_TABS[0]);

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList variant="line" scrollable className="w-full">
        {CSA_PROFILE_TABS.map((tab) => (
          <TabsTrigger key={tab} value={tabSlug(tab)} disabled={tab === "Medication"}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

function PatientDetailsForm({ payload }: { payload: SierraHandoffPayload }) {
  const who = profileIdentity(payload);
  const affiliation = payload.affiliation.includes("DTC") ? "DTC" : payload.affiliation;

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Patient Details</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-[var(--everkit-surface-gap)]">
        <ProfileField label="Status" value="Active" required kind="select" />
        <ProfileField label="Affiliation" value={affiliation} />
        <ProfileField label="USERID" value={who.userId} />
        <ProfileField label="Username" value={who.username} />
        <ProfileField
          label="Email"
          value={CSA_PROFILE_DEFAULT.email}
          required
          hint="Used for 2-Factor Auth"
        />
        <ProfileField label="First Name" value={who.first} required />
        <ProfileField label="Last Name" value={who.last} required />
        <ProfileField label="Address1" value={CSA_PROFILE_DEFAULT.address1} required />
        <ProfileField label="Address2" value="" />
        <ProfileField label="City" value={CSA_PROFILE_DEFAULT.city} required />
        <ProfileField label="State" value={CSA_PROFILE_DEFAULT.state} required kind="select" />
        <ProfileField label="Zip" value={CSA_PROFILE_DEFAULT.zip} required />
        <ProfileField
          label="Primary Phone"
          value={who.phone}
          required
          hint="Used for 2-Factor Auth"
        />
        <ProfileField label="Cell Phone" value="" />
        <ProfileField label="Emergency Contact No#" value="" />
        <ProfileField label="DOB" value={who.dob} required kind="date" />
        <ProfileField label="Sex Assigned At Birth" value="Male" required kind="select" />
        <ProfileField label="Gender Identity" value="" kind="select" placeholder="None selected" />
        <ProfileField label="Gender" value="Male" required kind="select" hint="Benefits provider" />
        <ProfileField label="Pronouns" value="" kind="select" placeholder="None selected" />
        <ProfileField label="Time Zone" value="Eastern Time" required kind="select" />
        <ProfileField label="Preferred Language" value="" kind="select" />
        <CheckboxField id="pp-deaf" label="Deaf/Hearing Impaired" />
        <CheckboxField id="pp-vip" label="VIP FLAG" />
        <CheckboxField id="pp-deceased" label="Deceased" />
        <Button className="w-fit">Save</Button>
      </CardContent>
    </Card>
  );
}

function ActionBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[var(--everkit-content-gap-cluster)]">
      <Text variant="body-small" weight="strong">
        {label}
      </Text>
      {children}
    </div>
  );
}

function ActionRail({ payload }: { payload: SierraHandoffPayload }) {
  const who = profileIdentity(payload);
  const wrapCell = "whitespace-normal align-top";

  return (
    <aside className="flex min-w-0 w-full flex-col gap-[var(--everkit-content-gap-block)]">
      <Text variant="body-small">
        <span className="font-semibold">Registration Date :</span> {CSA_PROFILE_DEFAULT.registrationDate}
      </Text>

      <Button className="w-fit">Reset Password</Button>

      <ActionBlock label="Re-affiliate Patient">
        <Button className="w-fit">Re-affiliate</Button>
      </ActionBlock>
      <ActionBlock label="Merge Account">
        <Button className="w-fit">Merge</Button>
      </ActionBlock>
      <ActionBlock label="Suspend User">
        <Button className="w-fit">Suspend User</Button>
      </ActionBlock>
      <ActionBlock label="Mobile Photo Upload">
        <Button className="w-fit">Send SMS</Button>
      </ActionBlock>
      <ActionBlock label="Patient Records">
        <Button className="w-fit">Access Patient Records</Button>
      </ActionBlock>

      <Tabs defaultValue="notes" className="flex flex-col gap-[var(--everkit-content-gap-cluster)]">
        <TabsList variant="line" className="h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="notes">History/Notes</TabsTrigger>
          <TabsTrigger value="activity">Activity History</TabsTrigger>
          <TabsTrigger value="chat">Chat History</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-0 flex flex-col gap-[var(--everkit-content-gap-cluster)]">
          <Heading
            level={3}
            className="text-base text-[var(--everkit-color-content-brand)]"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            History/Notes
          </Heading>
          <Table className="table-fixed">
            <colgroup>
              <col className="w-[24%]" />
              <col className="w-[56%]" />
              <col className="w-[20%]" />
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead className={wrapCell}>Date/Time</TableHead>
                <TableHead className={wrapCell}>Notes</TableHead>
                <TableHead className={wrapCell}>View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CSA_PROFILE_NOTES.map((row, index) => (
                <TableRow key={`${row.date}-${index}`}>
                  <TableCell className={wrapCell}>{row.date}</TableCell>
                  <TableCell className={`${wrapCell} break-words text-muted-foreground`}>{row.note}</TableCell>
                  <TableCell className={wrapCell}>
                    <Link href="#" size="sm">
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button size="sm" className="w-fit">
            Add Note
          </Button>
        </TabsContent>

        <TabsContent value="activity" className="mt-0 flex flex-col gap-[var(--everkit-content-gap-cluster)]">
          <Heading level={3} className="text-base">
            Activity History
          </Heading>
          <Table className="table-fixed">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[28%]" />
              <col className="w-[50%]" />
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead className={wrapCell}>Date/Time</TableHead>
                <TableHead className={wrapCell}>Type</TableHead>
                <TableHead className={wrapCell}>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CSA_PROFILE_ACTIVITY.map((row) => (
                <TableRow key={`${row.date}-${row.type}`}>
                  <TableCell className={wrapCell}>{row.date}</TableCell>
                  <TableCell className={wrapCell}>{row.type}</TableCell>
                  <TableCell className={`${wrapCell} break-words text-muted-foreground`}>{row.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="chat" className="mt-0 flex flex-col gap-[var(--everkit-content-gap-cluster)]">
          <Heading level={3} className="text-base">
            Chat History
          </Heading>
          <Table className="table-fixed">
            <colgroup>
              <col className="w-[30%]" />
              <col className="w-[35%]" />
              <col className="w-[35%]" />
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead className={wrapCell}>Date/Time</TableHead>
                <TableHead className={wrapCell}>Category</TableHead>
                <TableHead className={wrapCell}>View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={3} className={`${wrapCell} text-muted-foreground`}>
                  Chats not found
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col gap-[var(--everkit-content-gap-cluster)]">
        <Heading level={3} className="text-base">
          Account Members
        </Heading>
        <Table className="table-fixed">
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[24%]" />
            <col className="w-[24%]" />
            <col className="w-[24%]" />
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead className={wrapCell}>Name</TableHead>
              <TableHead className={wrapCell}>Primary / Dependent</TableHead>
              <TableHead className={wrapCell}>Action</TableHead>
              <TableHead className={wrapCell}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className={`${wrapCell} capitalize`}>{who.full}</TableCell>
              <TableCell className={wrapCell}>Primary</TableCell>
              <TableCell className={wrapCell} />
              <TableCell className={wrapCell}>Active</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} className={wrapCell}>
                <div className="flex flex-wrap gap-[var(--everkit-content-gap-cluster)] py-[var(--everkit-surface-gap-sm)]">
                  <Button size="sm">Add Member</Button>
                  <Button size="sm">Add Primary</Button>
                  <Button size="sm">Add Registered Dependent</Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>MDLIVE Primary Care Provider</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-[var(--everkit-content-gap-cluster)]">
          <Text variant="body-small" className="italic text-muted-foreground">
            None
          </Text>
          <Button size="sm" className="w-fit">
            Add PCP
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>External Primary Care Provider</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-[var(--everkit-content-gap-cluster)]">
          <Text variant="body-small" className="italic text-muted-foreground">
            None
          </Text>
          <Button size="sm" className="w-fit">
            Add PCP
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}

/** CSA patient profile — the screen advocates land on after successful authentication.
 *  Tab navigation is handled by CsaWorkspaceNav (left sidenav in CsaShell). */
export function CsaPatientProfile({ payload }: { payload: SierraHandoffPayload }) {
  return (
    <CsaPageContainer>
      <div className="grid layout-gutter gap-y-[var(--everkit-content-gap-block)] lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
        <aside className="min-w-0">
          <ProfileSummary payload={payload} />
        </aside>

        <div className="grid min-w-0 layout-gutter gap-y-[var(--everkit-content-gap-block)] xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)] xl:items-start">
          <PatientDetailsForm payload={payload} />
          <ActionRail payload={payload} />
        </div>
      </div>
    </CsaPageContainer>
  );
}
