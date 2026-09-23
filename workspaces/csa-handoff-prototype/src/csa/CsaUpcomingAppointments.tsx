import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@everkit/design-system";
import { CSA_APPOINTMENTS, type CsaAppointment } from "./data";

const WRAP_CELL = "whitespace-normal align-top";
const CLAMP_CELL = `${WRAP_CELL} max-w-[9rem] break-words [overflow-wrap:anywhere]`;

function splitDateTime(value: string) {
  const [date, ...rest] = value.split(" ");
  return { date, time: rest.join(" ") };
}

function abbrevState(state: string) {
  const map: Record<string, string> = { FLORIDA: "FL" };
  return map[state] ?? state;
}

function StackedDateTime({ date, time }: { date: string; time: string }) {
  return (
    <span className="block min-w-0 leading-tight">
      <span className="block">{date}</span>
      <span className="block text-muted-foreground">{time}</span>
    </span>
  );
}

function ClampedText({ value, title }: { value: string; title?: string }) {
  return (
    <span className="line-clamp-2 min-w-0 break-words [overflow-wrap:anywhere]" title={title ?? value}>
      {value}
    </span>
  );
}

function AppointmentRow({ appt }: { appt: CsaAppointment }) {
  const created = splitDateTime(appt.created);

  return (
    <TableRow>
      <TableCell className={WRAP_CELL}>
        <StackedDateTime date={created.date} time={created.time} />
      </TableCell>
      <TableCell className={WRAP_CELL}>
        <StackedDateTime date={appt.date} time={appt.time} />
      </TableCell>
      <TableCell className={CLAMP_CELL}>
        <ClampedText value={appt.affiliation} />
      </TableCell>
      <TableCell className={WRAP_CELL} title={appt.state}>
        {abbrevState(appt.state)}
      </TableCell>
      <TableCell className={WRAP_CELL}>
        <Badge variant="warning">Pending</Badge>
      </TableCell>
      <TableCell className={WRAP_CELL}>
        <Link href="#" size="sm">
          {appt.patientId}
        </Link>
      </TableCell>
      <TableCell className={WRAP_CELL}>{appt.age}</TableCell>
      <TableCell className={`${CLAMP_CELL} text-muted-foreground`}>
        <ClampedText value={appt.symptom} />
      </TableCell>
      <TableCell className={WRAP_CELL}>
        <div className="flex min-w-0 flex-col gap-0.5 leading-tight">
          <span className="tabular-nums break-all">{appt.phone}</span>
          <Link href="#" size="sm">
            Update
          </Link>
        </div>
      </TableCell>
      <TableCell className={WRAP_CELL}>
        <div className="flex min-w-0 flex-col gap-0.5 leading-tight">
          <span>{appt.consultType}</span>
          <Link href="#" size="sm">
            {appt.switchConsultTo}
          </Link>
        </div>
      </TableCell>
      <TableCell className={`${CLAMP_CELL} text-muted-foreground`}>
        <ClampedText value={appt.providerType} />
      </TableCell>
      <TableCell className={CLAMP_CELL}>
        <ClampedText value={appt.provider} />
      </TableCell>
    </TableRow>
  );
}

export function UpcomingAppointmentsTable() {
  return (
    <Card className="min-w-0">
      <CardHeader className="border-b">
        <CardTitle>
          <Link href="#">Upcoming Appointments</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table className="table-fixed">
          <colgroup>
            <col className="w-[9%]" />
            <col className="w-[8%]" />
            <col className="w-[11%]" />
            <col className="w-[4%]" />
            <col className="w-[7%]" />
            <col className="w-[9%]" />
            <col className="w-[3%]" />
            <col className="w-[11%]" />
            <col className="w-[10%]" />
            <col className="w-[9%]" />
            <col className="w-[10%]" />
            <col className="w-[9%]" />
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead className={WRAP_CELL}>Created</TableHead>
              <TableHead className={WRAP_CELL}>Appt</TableHead>
              <TableHead className={WRAP_CELL}>Affiliation</TableHead>
              <TableHead className={WRAP_CELL} title="State">
                St.
              </TableHead>
              <TableHead className={WRAP_CELL}>Status</TableHead>
              <TableHead className={WRAP_CELL}>Patient ID</TableHead>
              <TableHead className={WRAP_CELL}>Age</TableHead>
              <TableHead className={WRAP_CELL}>Symptom</TableHead>
              <TableHead className={WRAP_CELL} title="Customer phone (call back number)">
                Callback
              </TableHead>
              <TableHead className={WRAP_CELL}>Consult</TableHead>
              <TableHead className={WRAP_CELL}>Prov. type</TableHead>
              <TableHead className={WRAP_CELL}>Provider</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CSA_APPOINTMENTS.map((appt) => (
              <AppointmentRow key={`${appt.patientId}-${appt.created}`} appt={appt} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
