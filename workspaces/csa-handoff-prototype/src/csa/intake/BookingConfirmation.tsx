import * as React from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Icon,
  Separator,
  Text,
} from "@everkit/design-system";
import type { BookingSelection, IntakeContext } from "./types";
import { formatCsaDob } from "../profileUtils";

interface BookingConfirmationProps {
  selection: BookingSelection;
  context: IntakeContext;
  onBack: () => void;
  onConfirm: () => void;
}

function DetailRow({
  icon,
  label,
  value,
  sierraPrefilled,
}: {
  icon: string;
  label: string;
  value: string;
  sierraPrefilled?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon
        name={icon}
        size="sm"
        fill={0}
        aria-hidden
        className="mt-0.5 shrink-0 text-muted-foreground"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Text variant="meta-small" className="text-muted-foreground uppercase tracking-wide">
          {label}
        </Text>
        <div className="flex flex-wrap items-center gap-2">
          <Text variant="body-default">{value}</Text>
          {sierraPrefilled && (
            <Badge size="sm" variant="info">
              <Icon name="auto_awesome" size="xs" aria-hidden className="mr-1" />
              Sierra pre-filled
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export function BookingConfirmation({
  selection,
  context,
  onBack,
  onConfirm,
}: BookingConfirmationProps) {
  const [booking, setBooking] = React.useState<"idle" | "loading" | "done">("idle");

  const patientName = `${context.firstName} ${context.lastName}`;
  const dob = context.dob ? formatCsaDob(context.dob) : "—";
  const isUrgentCare = selection.provider === null;

  const appointmentTypeLabel =
    selection.appointmentType === "phone" ? "Phone" : "Video";

  const handleConfirm = () => {
    setBooking("loading");
    window.setTimeout(() => {
      setBooking("done");
      onConfirm();
    }, 1200);
  };

  if (booking === "done") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--everkit-color-surface-success-subtle)]">
          <Icon
            name="check_circle"
            size="lg"
            fill={1}
            aria-hidden
            className="text-[var(--everkit-color-content-success)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="title-default" weight="strong">
            Appointment booked
          </Text>
          <Text variant="body-default" className="text-muted-foreground">
            {patientName} · {selection.service.label}
          </Text>
          {isUrgentCare ? (
            <Text variant="body-default" className="text-muted-foreground">
              Next available provider
            </Text>
          ) : (
            <Text variant="body-default" className="text-muted-foreground">
              Dr. {selection.provider!.name} · {selection.slot!.label}, {selection.slot!.dateLabel}
            </Text>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--everkit-content-gap-block)]">
      <Text variant="title-default" as="h2">Confirm Booking</Text>

      <Card shadow={false} className="border bg-background">
        <CardContent className="flex flex-col gap-4 px-4">
          <Text variant="body-default" weight="strong">
            Booking Summary
          </Text>

          <Separator />

          {/* Patient */}
          <DetailRow
            icon="person"
            label="Patient"
            value={patientName}
            sierraPrefilled
          />
          {context.dob && (
            <DetailRow
              icon="cake"
              label="Date of birth"
              value={dob}
              sierraPrefilled
            />
          )}
          {context.memberId && (
            <DetailRow
              icon="badge"
              label="Member ID"
              value={context.memberId}
            />
          )}

          <Separator />

          {/* Appointment */}
          <DetailRow
            icon="medical_services"
            label="Service"
            value={selection.service.label}
          />
          <DetailRow
            icon={selection.appointmentType === "phone" ? "call" : "videocam"}
            label="Appointment type"
            value={appointmentTypeLabel}
          />
          {isUrgentCare ? (
            <DetailRow
              icon="person_search"
              label="Provider"
              value="Next available"
            />
          ) : (
            <>
              <DetailRow
                icon="person_search"
                label="Provider"
                value={`Dr. ${selection.provider!.name}, ${selection.provider!.credentials} · ${selection.provider!.specialty}`}
              />
              <DetailRow
                icon="schedule"
                label="Appointment time"
                value={`${selection.slot!.label} · ${selection.slot!.dateLabel}`}
              />
            </>
          )}
          <DetailRow
            icon="notes"
            label="Chief complaint"
            value={selection.visitReason.chiefComplaint}
            sierraPrefilled={!!context.visitReason}
          />
          {selection.visitReason.hasFever && (
            <DetailRow
              icon="thermostat"
              label="Fever"
              value="Yes"
            />
          )}
          {selection.visitReason.symptomDuration && (
            <DetailRow
              icon="event"
              label="Symptom duration"
              value={selection.visitReason.symptomDuration}
            />
          )}

          <Separator />

          <Text variant="body-small" className="text-muted-foreground">
            {selection.service.costNote}
          </Text>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3 pt-2">
        <Button
          variant="neutral-secondary"
          onClick={onBack}
          disabled={booking === "loading"}
        >
          <Icon name="arrow_back" size="sm" aria-hidden className="mr-1" />Back
        </Button>
        <Button
          onClick={handleConfirm}
          loading={booking === "loading"}
          disabled={booking === "loading"}
        >
          <Icon name="check" size="sm" aria-hidden className="mr-1" />
          Book appointment
        </Button>
      </div>
    </div>
  );
}
