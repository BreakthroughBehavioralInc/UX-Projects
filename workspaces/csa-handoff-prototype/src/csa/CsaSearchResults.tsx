import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Icon,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@everkit/design-system";
import type { CsaPatientSearchRow } from "./data";

const PATIENT_COLUMNS = [
  "Registered on",
  "User ID",
  "Subscriber ID",
  "Full name",
  "Date of birth",
  "Email",
  "Phone",
  "Zip code",
  "Status",
  "Affiliation",
  "Action",
] as const;

const ELIGIBLE_COLUMNS = [
  "Registered on",
  "First name",
  "Last name",
  "Date of birth",
  "Email",
  "Phone",
  "Zip code",
  "Status",
  "Affiliation",
  "Action",
] as const;

function EmptyMemberRow({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-muted-foreground">
        Member not found
      </TableCell>
    </TableRow>
  );
}

function ViewAction({ onSelect }: { onSelect?: () => void }) {
  return (
    <Link href="#" size="sm" onClick={(e: React.MouseEvent) => {
      e.preventDefault();
      onSelect?.();
    }}>
      View
    </Link>
  );
}

function PatientsTable({
  rows,
  onSelectPatient,
}: {
  rows: CsaPatientSearchRow[];
  onSelectPatient?: (row: CsaPatientSearchRow) => void;
}) {
  return (
    <Card className="min-w-0">
      <CardHeader className="border-b">
        <CardTitle>Patients</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {PATIENT_COLUMNS.map((col) => (
                <TableHead key={col} className="whitespace-nowrap">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <EmptyMemberRow colSpan={PATIENT_COLUMNS.length} />
            ) : (
              rows.map((row) => (
                <TableRow key={row.userId}>
                  <TableCell className="whitespace-nowrap">{row.registeredOn}</TableCell>
                  <TableCell className="tabular-nums">{row.userId}</TableCell>
                  <TableCell>{row.subscriberId}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {row.firstName} {row.lastName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{row.dob}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell className="tabular-nums">{row.phone}</TableCell>
                  <TableCell>{row.zip}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.affiliation}</TableCell>
                  <TableCell>
                    <ViewAction onSelect={() => onSelectPatient?.(row)} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function EligibleMembersTable() {
  return (
    <Card className="min-w-0">
      <CardHeader className="border-b">
        <CardTitle>Eligible Members</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {ELIGIBLE_COLUMNS.map((col) => (
                <TableHead key={col} className="whitespace-nowrap">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <EmptyMemberRow colSpan={ELIGIBLE_COLUMNS.length} />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/** Auto-populated Patients / Eligible Members tables after an unauthenticated handoff search. */
export function CsaSearchResults({
  rows,
  onSelectPatient,
  idle = false,
}: {
  rows: CsaPatientSearchRow[];
  onSelectPatient?: (row: CsaPatientSearchRow) => void;
  /** True before the first search is submitted — shows an instructional empty state. */
  idle?: boolean;
}) {
  if (idle) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border bg-background py-20 text-center">
        <Icon name="manage_search" size="xl" className="text-muted-foreground" aria-hidden />
        <Text variant="body-default" className="text-muted-foreground">
          Enter search criteria to find patients
        </Text>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-[var(--everkit-content-gap-block)]">
      <PatientsTable rows={rows} onSelectPatient={onSelectPatient} />
      <EligibleMembersTable />
    </div>
  );
}
