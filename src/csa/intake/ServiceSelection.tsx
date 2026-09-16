import * as React from "react";
import {
  Badge,
  Button,
  Icon,
  SelectionTile,
  Text,
} from "@everkit/design-system";
import type { IntakeContext, ServiceOption } from "./types";
import { SERVICE_OPTIONS } from "./types";

interface ServiceSelectionProps {
  context: IntakeContext;
  onContinue: (service: ServiceOption) => void;
  onBack: () => void;
}

export function ServiceSelection({ context, onContinue, onBack }: ServiceSelectionProps) {
  const [selected, setSelected] = React.useState<string>(() => {
    const match = SERVICE_OPTIONS.find(
      (o) => o.serviceLine === context.suggestedServiceLine,
    );
    return match?.id ?? SERVICE_OPTIONS[1].id;
  });

  const sierraId = SERVICE_OPTIONS.find(
    (o) => o.serviceLine === context.suggestedServiceLine,
  )?.id;

  const handleContinue = () => {
    const option = SERVICE_OPTIONS.find((o) => o.id === selected);
    if (option) onContinue(option);
  };

  return (
    <div className="flex flex-col gap-[var(--everkit-content-gap-block)]">
      <Text variant="title-default" as="h2">Service Options</Text>

      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Available service options">
        {SERVICE_OPTIONS.map((option) => {
          const isSuggested = option.id === sierraId;

          return (
            <SelectionTile
              key={option.id}
              id={`service-${option.id}`}
              name="service-selection"
              value={option.id}
              checked={option.id === selected}
              onChange={() => setSelected(option.id)}
              label={
                <div className="flex flex-wrap items-center gap-2">
                  <span>{option.label}</span>
                  {isSuggested && (
                    <Badge size="sm" variant="info">
                      <Icon name="auto_awesome" size="xs" aria-hidden className="mr-1" />
                      Sierra suggested
                    </Badge>
                  )}
                  {option.selfPay && (
                    <Badge size="sm" variant="warning">Self-pay</Badge>
                  )}
                </div>
              }
              description={`${option.availabilityLabel} · ${option.costNote}`}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button variant="neutral-secondary" onClick={onBack}>
          <Icon name="arrow_back" size="sm" aria-hidden className="mr-1" />Back
        </Button>
        <Button onClick={handleContinue} disabled={!selected}>
          Continue
          <Icon name="arrow_forward" size="sm" aria-hidden className="ml-1" />
        </Button>
      </div>
    </div>
  );
}
