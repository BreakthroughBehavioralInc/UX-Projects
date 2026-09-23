import * as React from "react";
import {
  Badge,
  Button,
  Chip,
  ChipGroup,
  Icon,
  Input,
  Label,
  RadioField,
  RadioGroup,
  Text,
  Textarea,
} from "@everkit/design-system";
import type { IntakeContext, VisitReasonData } from "./types";

interface VisitReasonProps {
  context: IntakeContext;
  onContinue: (data: VisitReasonData) => void;
  onBack: () => void;
}

const DURATION_CHIPS = [
  { value: "Today", label: "Today" },
  { value: "1–3 days", label: "1–3 days" },
  { value: "3–7 days", label: "3–7 days" },
  { value: "1–2 weeks", label: "1–2 weeks" },
  { value: "More than 2 weeks", label: "More than 2 weeks" },
];

export function VisitReason({ context, onContinue, onBack }: VisitReasonProps) {
  const [chiefComplaint, setChiefComplaint] = React.useState(context.visitReason ?? "");
  const [fever, setFever] = React.useState<string>("");
  const [duration, setDuration] = React.useState("");
  const [description, setDescription] = React.useState("");

  const sierraPrefilled = !!context.visitReason;

  const handleContinue = () => {
    onContinue({
      chiefComplaint: chiefComplaint.trim(),
      hasFever: fever === "yes",
      symptomDuration: duration.trim(),
      description: description.trim(),
    });
  };

  return (
    <div className="flex flex-col gap-[var(--everkit-content-gap-block)]">
      <Text variant="title-default" as="h2">Reason for Visit</Text>

      <div className="flex flex-col gap-4 max-w-[400px]">
        {/* Chief complaint */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Label htmlFor="chief-complaint">Chief complaint</Label>
            {sierraPrefilled && (
              <Badge size="sm" variant="info">
                <Icon name="auto_awesome" size="xs" aria-hidden className="mr-1" />
                Sierra pre-filled
              </Badge>
            )}
          </div>
          <Input
            id="chief-complaint"
            value={chiefComplaint}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setChiefComplaint(e.target.value)
            }
            placeholder="Describe the main reason for the visit"
          />
        </div>

        {/* Fever — Yes / No radio */}
        <div className="flex flex-col gap-1.5">
          <Label>Does the patient have a fever?</Label>
          <RadioGroup value={fever} onValueChange={setFever}>
            <RadioField id="fever-yes" value="yes" label="Yes" />
            <RadioField id="fever-no" value="no" label="No" />
          </RadioGroup>
        </div>

        {/* Symptom duration — free text + quick-select chips */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="symptom-duration">How long have symptoms been present?</Label>
          <Input
            id="symptom-duration"
            value={duration}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDuration(e.target.value)
            }
            placeholder="e.g. 3 days"
          />
          <ChipGroup aria-label="Quick select symptom duration">
            {DURATION_CHIPS.map((opt) => (
              <Chip
                key={opt.value}
                type="radio"
                selected={duration === opt.value}
                onClick={() => setDuration(opt.value)}
              >
                {opt.label}
              </Chip>
            ))}
          </ChipGroup>
        </div>

        {/* Additional notes */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Label htmlFor="visit-description">Additional notes</Label>
            <Text variant="meta-small" className="text-muted-foreground">(optional)</Text>
          </div>
          <Textarea
            id="visit-description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            placeholder="Describe symptoms or add notes…"
            maxLength={400}
            showCount
            rows={4}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button variant="neutral-secondary" onClick={onBack}>
          <Icon name="arrow_back" size="sm" aria-hidden className="mr-1" />Back
        </Button>
        <Button onClick={handleContinue} disabled={!chiefComplaint.trim()}>
          Continue
          <Icon name="arrow_forward" size="sm" aria-hidden className="ml-1" />
        </Button>
      </div>
    </div>
  );
}
