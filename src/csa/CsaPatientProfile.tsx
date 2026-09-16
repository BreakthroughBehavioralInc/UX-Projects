import * as React from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CheckboxField,
  DateField,
  FieldNote,
  Icon,
  Input,
  Label,
  Link,
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
} from "./data";
import { profileIdentity } from "./profileUtils";
import type { SierraHandoffPayload } from "../data/scenarios";

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

function parseDob(text: string): Date | undefined {
  const m = text.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!m) return undefined;
  return new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]));
}

/** Labeled read-only value — `dt`/`dd` semantics; must live inside a `<dl>`. */
function InfoItem({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[length:var(--type-meta-small-size)] font-medium uppercase leading-none tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd
        className={[
          "text-[length:var(--type-body-small-size)] leading-[var(--type-body-small-lh)]",
          mono ? "font-mono tabular-nums" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {value || "—"}
      </dd>
    </div>
  );
}

/** Two- or three-column info grid. */
function InfoGrid({
  cols = 2,
  children,
}: {
  cols?: 2 | 3;
  children: React.ReactNode;
}) {
  return (
    <dl
      className={[
        "grid gap-x-6 gap-y-4",
        cols === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2",
      ].join(" ")}
    >
      {children}
    </dl>
  );
}

/** Section eyebrow label — no separator needed; gap alone is sufficient. */
function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="label-small" className="uppercase tracking-wider text-muted-foreground">
      {children}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// ProfileField — editable field (edit mode only)
// ---------------------------------------------------------------------------

function ProfileField({
  label,
  defaultValue = "",
  required,
  hint,
  kind = "text",
  placeholder,
  options,
}: {
  label: string;
  defaultValue?: string;
  required?: boolean;
  hint?: string;
  kind?: "text" | "select" | "date";
  placeholder?: string;
  options?: string[];
}) {
  const id = `ppv4-${label.replace(/\W+/g, "-").toLowerCase()}`;
  const noteId = `${id}-note`;

  const control =
    kind === "select" ? (
      <Select defaultValue={defaultValue || undefined}>
        <SelectTrigger id={id} aria-describedby={hint ? noteId : undefined}>
          <SelectValue placeholder={placeholder ?? "Select…"} />
        </SelectTrigger>
        <SelectContent>
          {defaultValue ? (
            <SelectItem value={defaultValue}>{defaultValue}</SelectItem>
          ) : null}
          {options
            ?.filter((o) => o !== defaultValue)
            .map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    ) : kind === "date" ? (
      <DateField
        id={id}
        value={parseDob(defaultValue)}
        aria-describedby={hint ? noteId : undefined}
      />
    ) : (
      <Input
        id={id}
        defaultValue={defaultValue}
        aria-describedby={hint ? noteId : undefined}
      />
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

// ---------------------------------------------------------------------------
// ReadOnlyDetailsView — merged overview + patient details
// ---------------------------------------------------------------------------

function ReadOnlyDetailsView({ payload }: { payload: SierraHandoffPayload }) {
  const who = profileIdentity(payload);
  const affiliation = payload.affiliation.includes("DTC") ? "DTC" : payload.affiliation;

  // Flags — only render section when at least one is set
  const flags: string[] = [];
  const hasFlags = flags.length > 0;

  return (
    <div className="flex flex-col gap-[var(--everkit-content-gap-block)]">

      <div className="flex flex-col gap-3">
        <GroupLabel>Account</GroupLabel>
        <InfoGrid cols={3}>
          <InfoItem label="Registered" value={`${CSA_PROFILE_DEFAULT.registrationDate} · patient-portal`} />
          <InfoItem label="Affiliation" value={`${affiliation} · ID ${CSA_PROFILE_DEFAULT.affiliationId}`} />
          <InfoItem label="Billing" value={CSA_PROFILE_DEFAULT.billingAgreement} mono />
        </InfoGrid>
      </div>

      <div className="flex flex-col gap-3">
        <GroupLabel>Personal</GroupLabel>
        <InfoGrid cols={3}>
          <InfoItem label="Date of Birth" value={who.dob} />
          <InfoItem label="Username" value={who.username} mono />
          <InfoItem label="Email" value={CSA_PROFILE_DEFAULT.email} />
          <InfoItem label="Sex at Birth" value="Male" />
          <InfoItem label="Gender" value="Male" />
          <InfoItem label="Gender Identity" value={null} />
          <InfoItem label="Pronouns" value={null} />
          <InfoItem label="Timezone" value="Eastern Time" />
          <InfoItem label="Language" value="English" />
        </InfoGrid>
      </div>

      <div className="flex flex-col gap-3">
        <GroupLabel>Contact</GroupLabel>
        <InfoGrid cols={3}>
          <InfoItem label="Primary Phone" value={who.phone} mono />
          <InfoItem label="Cell Phone" value={null} />
          <InfoItem label="Emergency Contact" value={null} />
          <InfoItem label="Address" value={CSA_PROFILE_DEFAULT.address1} />
          <InfoItem label="City" value={CSA_PROFILE_DEFAULT.city} />
          <InfoItem label="State / ZIP" value={`${CSA_PROFILE_DEFAULT.state} ${CSA_PROFILE_DEFAULT.zip}`} />
        </InfoGrid>
      </div>

      {hasFlags ? (
        <div className="flex flex-col gap-3">
          <GroupLabel>Flags</GroupLabel>
          <div className="flex flex-wrap gap-2">
            {flags.map((f) => (
              <Badge key={f} variant="warning" size="sm">
                {f}
              </Badge>
            ))}
          </div>
        </div>
      ) : (
        <Text variant="meta-small" className="text-muted-foreground">
          No account flags set
        </Text>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// EditDetailsForm
// ---------------------------------------------------------------------------

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
  "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
  "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
  "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

function EditFormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[var(--everkit-surface-gap)]">
      <Text variant="label-small" className="uppercase tracking-wider text-muted-foreground">
        {title}
      </Text>
      {children}
    </div>
  );
}

function EditDetailsForm({
  payload,
  onCancel,
}: {
  payload: SierraHandoffPayload;
  onCancel: () => void;
}) {
  const who = profileIdentity(payload);
  const affiliation = payload.affiliation.includes("DTC") ? "DTC" : payload.affiliation;

  return (
    <div className="flex flex-col gap-[var(--everkit-content-gap-block)]">

      <EditFormSection title="Account">
        <ProfileField
          label="Status"
          defaultValue="Active"
          required
          kind="select"
          options={["Active", "Inactive", "Suspended"]}
        />
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <InfoItem label="Affiliation" value={affiliation} />
          <InfoItem label="User ID" value={who.userId} mono />
        </div>
      </EditFormSection>

      <Separator />

      <EditFormSection title="Personal">
        <div className="grid grid-cols-2 gap-[var(--everkit-surface-gap)]">
          <ProfileField label="First Name" defaultValue={who.first} required />
          <ProfileField label="Last Name" defaultValue={who.last} required />
        </div>
        <div className="grid grid-cols-2 gap-[var(--everkit-surface-gap)]">
          <ProfileField label="Date of Birth" defaultValue={who.dob} required kind="date" />
          <ProfileField
            label="Sex Assigned at Birth"
            defaultValue="Male"
            required
            kind="select"
            options={["Male", "Female", "Intersex", "Unknown"]}
          />
        </div>
        <div className="grid grid-cols-2 gap-[var(--everkit-surface-gap)]">
          <ProfileField
            label="Gender Identity"
            kind="select"
            placeholder="None selected"
            options={["Non-binary", "Transgender", "Other"]}
          />
          <ProfileField
            label="Gender (benefits)"
            defaultValue="Male"
            required
            kind="select"
            options={["Male", "Female", "Other"]}
          />
        </div>
        <div className="grid grid-cols-2 gap-[var(--everkit-surface-gap)]">
          <ProfileField
            label="Pronouns"
            kind="select"
            placeholder="None selected"
            options={["He / Him", "She / Her", "They / Them"]}
          />
          <ProfileField
            label="Preferred Language"
            kind="select"
            options={["English", "Spanish", "French", "Portuguese", "Chinese"]}
          />
        </div>
        <div className="grid grid-cols-2 gap-[var(--everkit-surface-gap)]">
          <ProfileField
            label="Timezone"
            defaultValue="Eastern Time"
            required
            kind="select"
            options={[
              "Eastern Time","Central Time","Mountain Time",
              "Pacific Time","Alaska Time","Hawaii Time",
            ]}
          />
        </div>
      </EditFormSection>

      <Separator />

      <EditFormSection title="Contact">
        <ProfileField
          label="Email"
          defaultValue={CSA_PROFILE_DEFAULT.email}
          required
          hint="Used for 2-factor auth"
        />
        <div className="grid grid-cols-2 gap-[var(--everkit-surface-gap)]">
          <ProfileField label="Primary Phone" defaultValue={who.phone} required />
          <ProfileField label="Cell Phone" />
        </div>
        <ProfileField label="Emergency Contact" />
      </EditFormSection>

      <Separator />

      <EditFormSection title="Location">
        <ProfileField label="Address" defaultValue={CSA_PROFILE_DEFAULT.address1} required />
        <ProfileField label="Address line 2" />
        <div className="grid grid-cols-[1fr_auto_auto] gap-[var(--everkit-surface-gap)]">
          <ProfileField label="City" defaultValue={CSA_PROFILE_DEFAULT.city} required />
          <ProfileField
            label="State"
            defaultValue={CSA_PROFILE_DEFAULT.state}
            required
            kind="select"
            options={US_STATES}
          />
          <ProfileField label="ZIP" defaultValue={CSA_PROFILE_DEFAULT.zip} required />
        </div>
      </EditFormSection>

      <Separator />

      <EditFormSection title="Flags">
        <fieldset className="flex flex-col gap-[var(--everkit-surface-gap-sm)] border-0 p-0">
          <legend className="sr-only">Account flags</legend>
          <CheckboxField id="ppv4-deaf" label="Deaf / Hearing Impaired" />
          <CheckboxField id="ppv4-vip" label="VIP" />
          <CheckboxField id="ppv4-deceased" label="Deceased" />
        </fieldset>
      </EditFormSection>

      <div className="flex gap-[var(--everkit-surface-gap)] pt-2">
        <Button>Save Changes</Button>
        <Button variant="neutral-secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HistoryTabs
// ---------------------------------------------------------------------------

const WC = "whitespace-normal align-top";

function HistoryTabs() {
  return (
    <Card>
      <Tabs defaultValue="notes">
        <div className="border-b px-[var(--everkit-card-padding)]">
          <TabsList variant="line">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="activity">Activity History</TabsTrigger>
            <TabsTrigger value="chat">Chat History</TabsTrigger>
          </TabsList>
        </div>
        <CardContent>
          <TabsContent value="notes" className="mt-0 flex flex-col gap-[var(--everkit-content-gap-cluster)]">
            <Table className="table-fixed">
              <colgroup>
                <col className="w-[18%]" />
                <col className="w-[62%]" />
                <col className="w-[20%]" />
              </colgroup>
              <TableHeader>
                <TableRow>
                  <TableHead className={WC}>Date</TableHead>
                  <TableHead className={WC}>Note</TableHead>
                  <TableHead className={WC} />
                </TableRow>
              </TableHeader>
              <TableBody>
                {CSA_PROFILE_NOTES.map((row, i) => (
                  <TableRow key={`${row.date}-${i}`}>
                    <TableCell className={WC}>{row.date}</TableCell>
                    <TableCell className={`${WC} break-words text-muted-foreground`}>
                      {row.note}
                    </TableCell>
                    <TableCell className={WC}>
                      <Link href="#" size="sm">View</Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button size="sm" variant="neutral-secondary" className="w-fit">
              <Icon name="add" size="sm" aria-hidden className="mr-1" />
              Add Note
            </Button>
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            <Table className="table-fixed">
              <colgroup>
                <col className="w-[18%]" />
                <col className="w-[22%]" />
                <col className="w-[60%]" />
              </colgroup>
              <TableHeader>
                <TableRow>
                  <TableHead className={WC}>Date</TableHead>
                  <TableHead className={WC}>Type</TableHead>
                  <TableHead className={WC}>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CSA_PROFILE_ACTIVITY.map((row) => (
                  <TableRow key={`${row.date}-${row.type}`}>
                    <TableCell className={WC}>{row.date}</TableCell>
                    <TableCell className={WC}>{row.type}</TableCell>
                    <TableCell className={`${WC} break-words text-muted-foreground`}>
                      {row.details || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="chat" className="mt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">
                    No chats found
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// AccountMembersCard
// ---------------------------------------------------------------------------

function AccountMembersCard({ payload }: { payload: SierraHandoffPayload }) {
  const who = profileIdentity(payload);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Members</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="capitalize">{who.full}</TableCell>
              <TableCell>Primary</TableCell>
              <TableCell>
                <Badge variant="success" size="sm">Active</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="flex flex-wrap gap-[var(--everkit-surface-gap)] px-[var(--everkit-card-padding)] py-3">
          <Button size="sm" variant="secondary">
            <Icon name="person_add" size="sm" aria-hidden className="mr-1" />
            Add Member
          </Button>
          <Button size="sm" variant="secondary">
            <Icon name="group_add" size="sm" aria-hidden className="mr-1" />
            Add Dependent
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// PrimaryCareCard — merged MD Live + External into one card
// ---------------------------------------------------------------------------

function PrimaryCareCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Primary Care Providers</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-[var(--everkit-content-gap-block)]">
        <div className="flex flex-col gap-[var(--everkit-content-gap-cluster)]">
          <GroupLabel>MD Live</GroupLabel>
          <Text variant="body-small" className="italic text-muted-foreground">
            None on file
          </Text>
          <Button size="sm" variant="secondary" className="w-fit">
            <Icon name="add" size="sm" aria-hidden className="mr-1" />
            Add PCP
          </Button>
        </div>

        <Separator />

        <div className="flex flex-col gap-[var(--everkit-content-gap-cluster)]">
          <GroupLabel>External</GroupLabel>
          <Text variant="body-small" className="italic text-muted-foreground">
            None on file
          </Text>
          <Button size="sm" variant="secondary" className="w-fit">
            <Icon name="add" size="sm" aria-hidden className="mr-1" />
            Add PCP
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// CsaPatientProfile — entry point
// ---------------------------------------------------------------------------

export function CsaPatientProfile({ payload }: { payload: SierraHandoffPayload }) {
  const [editing, setEditing] = React.useState(false);
  const who = profileIdentity(payload);

  return (
    <CsaPageContainer>
      <div className="flex flex-col gap-[var(--everkit-content-gap-block)]">

        {/* Identity header — no avatar (CSA has no patient photos) */}
        <div className="flex flex-wrap items-baseline gap-2">
          <Text variant="title-default" weight="strong" as="h2">
            {who.full}
          </Text>
          <Badge variant="success" size="sm">Active</Badge>
          <Text variant="body-small" className="text-muted-foreground">
            ID {who.userId}
          </Text>
        </div>

        {/* Two-column layout: Quick Actions sidebar | Patient Details */}
        <div className="grid gap-[var(--everkit-content-gap-block)] lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">

          {/* ── Left sidebar: Quick Actions only ───────────────────────── */}
          <aside>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-[var(--everkit-surface-gap)] pt-0">
                <Button size="sm" variant="neutral-secondary" className="w-full justify-start">
                  <Icon name="lock_reset" size="sm" aria-hidden className="mr-2 shrink-0" />
                  Reset Password
                </Button>
                <Button size="sm" variant="neutral-secondary" className="w-full justify-start">
                  <Icon name="sms" size="sm" aria-hidden className="mr-2 shrink-0" />
                  Send SMS
                </Button>
                <Button size="sm" variant="neutral-secondary" className="w-full justify-start">
                  <Icon name="folder_open" size="sm" aria-hidden className="mr-2 shrink-0" />
                  Access Patient Records
                </Button>
                <Button size="sm" variant="neutral-secondary" className="w-full justify-start">
                  <Icon name="swap_horiz" size="sm" aria-hidden className="mr-2 shrink-0" />
                  Re-affiliate
                </Button>
                <Button size="sm" variant="neutral-secondary" className="w-full justify-start">
                  <Icon name="merge" size="sm" aria-hidden className="mr-2 shrink-0" />
                  Merge Account
                </Button>
                <Separator />
                <Button size="sm" variant="destructive-secondary" className="w-full justify-start">
                  <Icon name="block" size="sm" aria-hidden className="mr-2 shrink-0" />
                  Suspend User
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* ── Right main ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-[var(--everkit-content-gap-block)]">

            {/* Patient Details (merged with Overview) — edit button right-aligned */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Patient Details</CardTitle>
                {!editing && (
                  <Button
                    size="sm"
                    variant="neutral-secondary"
                    onClick={() => setEditing(true)}
                  >
                    <Icon name="edit" size="sm" aria-hidden className="mr-1" />
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {editing ? (
                  <EditDetailsForm payload={payload} onCancel={() => setEditing(false)} />
                ) : (
                  <ReadOnlyDetailsView payload={payload} />
                )}
              </CardContent>
            </Card>

            <AccountMembersCard payload={payload} />

            <PrimaryCareCard />

            <HistoryTabs />

          </div>
        </div>

      </div>
    </CsaPageContainer>
  );
}
