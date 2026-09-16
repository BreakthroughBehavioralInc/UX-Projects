import * as React from "react";
import {
  Card,
  Stepper,
} from "@everkit/design-system";
import type {
  AppointmentType,
  BookingSelection,
  IntakeContext,
  IntakeStep,
  MockProvider,
  ProviderSlot,
  ServiceOption,
  VisitReasonData,
} from "./types";
import { ContactInfo } from "./ContactInfo";
import { ServiceSelection } from "./ServiceSelection";
import { AppointmentTypeStep } from "./AppointmentType";
import { VisitReason } from "./VisitReason";
import { ProviderSelection } from "./ProviderSelection";
import { BookingConfirmation } from "./BookingConfirmation";

// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------

const STEPS_FULL = [
  { label: "Contact" },
  { label: "Service" },
  { label: "Appt Type" },
  { label: "Visit Reason" },
  { label: "Provider" },
  { label: "Confirm" },
];

const STEPS_NO_PROVIDER = [
  { label: "Contact" },
  { label: "Service" },
  { label: "Appt Type" },
  { label: "Visit Reason" },
  { label: "Confirm" },
];

const IDX_FULL: Record<IntakeStep, number> = {
  contact: 0,
  service: 1,
  "appt-type": 2,
  "visit-reason": 3,
  provider: 4,
  confirm: 5,
  booked: 5,
};

const IDX_NO_PROVIDER: Record<IntakeStep, number> = {
  contact: 0,
  service: 1,
  "appt-type": 2,
  "visit-reason": 3,
  provider: 3,
  confirm: 4,
  booked: 4,
};

function IntakeStepIndicator({
  currentStep,
  isUrgentCare,
}: {
  currentStep: IntakeStep;
  isUrgentCare: boolean;
}) {
  const steps = isUrgentCare ? STEPS_NO_PROVIDER : STEPS_FULL;
  const idx   = isUrgentCare ? IDX_NO_PROVIDER[currentStep] : IDX_FULL[currentStep];
  return <Stepper steps={steps} current={idx} />;
}

// ---------------------------------------------------------------------------
// CsaPatientIntake — main container
// ---------------------------------------------------------------------------

interface CsaPatientIntakeProps {
  context: IntakeContext;
  onComplete?: () => void;
}

export function CsaPatientIntake({ context, onComplete }: CsaPatientIntakeProps) {
  const [step, setStep]                   = React.useState<IntakeStep>("contact");
  const [serviceSelection, setService]    = React.useState<ServiceOption | null>(null);
  const [appointmentType, setApptType]    = React.useState<AppointmentType>("phone");
  const [visitReasonData, setVisitReason] = React.useState<VisitReasonData | null>(null);
  const [bookingSelection, setBooking]    = React.useState<BookingSelection | null>(null);

  const isUrgentCare = serviceSelection?.serviceLine === "urgent_care";

  // ---------------------------------------------------------------------------
  // Forward navigation
  // ---------------------------------------------------------------------------

  const handleContactContinue = (_state: string, _tz: string) => {
    setStep("service");
  };

  const handleServiceContinue = (service: ServiceOption) => {
    setService(service);
    setStep("appt-type");
  };

  const handleApptTypeContinue = (type: AppointmentType) => {
    setApptType(type);
    setStep("visit-reason");
  };

  const handleVisitReasonContinue = (data: VisitReasonData) => {
    setVisitReason(data);
    if (serviceSelection?.serviceLine === "urgent_care") {
      setBooking({
        service: serviceSelection,
        provider: null,
        slot: null,
        appointmentType,
        visitReason: data,
      });
      setStep("confirm");
    } else {
      setStep("provider");
    }
  };

  const handleProviderContinue = (provider: MockProvider | null, slot: ProviderSlot | null) => {
    if (!serviceSelection || !visitReasonData) return;
    setBooking({
      service: serviceSelection,
      provider,
      slot,
      appointmentType,
      visitReason: visitReasonData,
    });
    setStep("confirm");
  };

  const handleBookingComplete = () => {
    setStep("booked");
    window.setTimeout(() => onComplete?.(), 2000);
  };

  // ---------------------------------------------------------------------------
  // Back navigation
  // ---------------------------------------------------------------------------

  const handleConfirmBack = () => {
    setStep(isUrgentCare ? "visit-reason" : "provider");
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-full bg-[var(--muted)] px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/*
          py-0 cancels Card root's built-in py-[card-padding] so the inner div
          controls all padding uniformly (p-6 = 24px all sides).
        */}
        <Card shadow={false} className="border bg-background py-0">
          <div className="flex flex-col gap-6 p-6">
            {step !== "booked" && (
              <IntakeStepIndicator currentStep={step} isUrgentCare={isUrgentCare} />
            )}

            {step === "contact" && (
              <ContactInfo
                context={context}
                onContinue={handleContactContinue}
              />
            )}

            {step === "service" && (
              <ServiceSelection
                context={context}
                onContinue={handleServiceContinue}
                onBack={() => setStep("contact")}
              />
            )}

            {step === "appt-type" && (
              <AppointmentTypeStep
                onContinue={handleApptTypeContinue}
                onBack={() => setStep("service")}
              />
            )}

            {step === "visit-reason" && (
              <VisitReason
                context={context}
                onContinue={handleVisitReasonContinue}
                onBack={() => setStep("appt-type")}
              />
            )}

            {step === "provider" && serviceSelection && (
              <ProviderSelection
                service={serviceSelection}
                onBack={() => setStep("visit-reason")}
                onContinue={handleProviderContinue}
              />
            )}

            {(step === "confirm" || step === "booked") && bookingSelection && (
              <BookingConfirmation
                selection={bookingSelection}
                context={context}
                onBack={handleConfirmBack}
                onConfirm={handleBookingComplete}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
