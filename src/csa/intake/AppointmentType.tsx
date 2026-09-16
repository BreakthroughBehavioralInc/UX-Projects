import * as React from "react";
import {
  Button,
  Icon,
  SelectionTile,
  Text,
} from "@everkit/design-system";
import type { AppointmentType } from "./types";

interface AppointmentTypeStepProps {
  onContinue: (type: AppointmentType) => void;
  onBack: () => void;
}

export function AppointmentTypeStep({ onContinue, onBack }: AppointmentTypeStepProps) {
  const [selected, setSelected] = React.useState<AppointmentType>("phone");

  return (
    <div className="flex flex-col gap-[var(--everkit-content-gap-block)]">
      <Text variant="title-default" as="h2">Appointment Type</Text>

      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Appointment type">
        <SelectionTile
          id="appt-phone"
          name="appt-type"
          value="phone"
          checked={selected === "phone"}
          onChange={() => setSelected("phone")}
          label={
            <div className="flex items-center gap-2">
              <Icon name="call" size="sm" aria-hidden />
              <span>Phone</span>
            </div>
          }
        />
        <SelectionTile
          id="appt-video"
          name="appt-type"
          value="video"
          checked={selected === "video"}
          onChange={() => setSelected("video")}
          label={
            <div className="flex items-center gap-2">
              <Icon name="videocam" size="sm" aria-hidden />
              <span>Video</span>
            </div>
          }
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button variant="neutral-secondary" onClick={onBack}>
          <Icon name="arrow_back" size="sm" aria-hidden className="mr-1" />Back
        </Button>
        <Button onClick={() => onContinue(selected)}>
          Continue
          <Icon name="arrow_forward" size="sm" aria-hidden className="ml-1" />
        </Button>
      </div>
    </div>
  );
}
