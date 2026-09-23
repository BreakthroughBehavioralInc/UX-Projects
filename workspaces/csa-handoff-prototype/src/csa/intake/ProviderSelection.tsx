import * as React from "react";
import {
  Alert,
  AlertDescription,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  Chip,
  ChipGroup,
  DateField,
  Icon,
  Input,
  Label,
  Text,
} from "@everkit/design-system";
import type { MockProvider, ProviderSlot, ServiceOption } from "./types";
import { getProvidersForService } from "./types";

type ProviderMode = "first-available" | "specific";

interface ProviderSelectionProps {
  service: ServiceOption;
  onBack: () => void;
  onContinue: (provider: MockProvider | null, slot: ProviderSlot | null) => void;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      <Icon
        name="star"
        size="xs"
        fill={1}
        aria-hidden
        className="text-[var(--everkit-color-content-warning)]"
      />
      <Text variant="meta-small" className="text-muted-foreground">
        {value.toFixed(1)}
      </Text>
    </div>
  );
}

function ProviderCard({
  provider,
  onSelectSlot,
}: {
  provider: MockProvider;
  onSelectSlot: (slot: ProviderSlot) => void;
}) {
  return (
    <Card shadow={false} className="border bg-background">
      <CardContent className="flex flex-col gap-3">
        {/* Provider identity row */}
        <div className="flex items-start gap-3">
          <Avatar size="md" shape="circle" className="shrink-0">
            <AvatarFallback className="bg-[var(--everkit-color-surface-brand-subtle)] text-[var(--everkit-color-brand-primary)] text-sm font-medium">
              {initials(provider.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex flex-wrap items-baseline gap-1">
              <Text variant="body-default" weight="strong">
                Dr. {provider.name}
              </Text>
              <Text variant="body-small" className="text-muted-foreground">
                {provider.credentials}
              </Text>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge size="sm" variant="neutral">
                {provider.specialty}
              </Badge>
              <StarRating value={provider.rating} />
              <Text variant="meta-small" className="text-muted-foreground">
                {provider.reviewCount} reviews
              </Text>
            </div>
            <Text variant="body-small" className="mt-0.5 text-muted-foreground">
              {provider.bio}
            </Text>
          </div>
        </div>

        {/* Next available + slot chips */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <Icon
              name="schedule"
              size="xs"
              fill={0}
              aria-hidden
              className="shrink-0 text-[var(--everkit-color-content-success)]"
            />
            <Text variant="body-small" weight="strong" className="text-[var(--everkit-color-content-success)]">
              Next available: {provider.nextAvailableLabel}
            </Text>
          </div>
          <div className="flex flex-wrap gap-2">
            {provider.slots.map((slot) => (
              <Button
                key={slot.id}
                variant="neutral-secondary"
                size="sm"
                onClick={() => onSelectSlot(slot)}
                className="h-auto flex-col gap-0 px-3 py-1.5"
              >
                <Text variant="body-small" weight="strong">{slot.label}</Text>
                <Text variant="meta-small" className="text-muted-foreground">{slot.dateLabel}</Text>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProviderSelection({ service, onBack, onContinue }: ProviderSelectionProps) {
  const [mode, setMode] = React.useState<ProviderMode>("first-available");
  const [search, setSearch] = React.useState("");
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  const allProviders = getProvidersForService(service.serviceLine);
  const filteredProviders = search.trim()
    ? allProviders.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.specialty.toLowerCase().includes(search.toLowerCase()),
      )
    : allProviders;

  return (
    <div className="flex flex-col gap-[var(--everkit-content-gap-block)]">
      <Text variant="title-default" as="h2">Select a Provider</Text>

      <Alert variant="info">
        <AlertDescription>
          All appointment times are shown in the patient-selected time zone.
        </AlertDescription>
      </Alert>

      {/* Mode toggle */}
      <ChipGroup aria-label="Provider selection mode">
        <Chip
          type="radio"
          selected={mode === "first-available"}
          onClick={() => setMode("first-available")}
        >
          First Available
        </Chip>
        <Chip
          type="radio"
          selected={mode === "specific"}
          onClick={() => setMode("specific")}
        >
          Specific Provider
        </Chip>
      </ChipGroup>

      {mode === "first-available" ? (
        <div className="rounded-[var(--everkit-card-radius)] border border-[var(--everkit-color-surface-brand-subtle)] bg-[var(--everkit-color-surface-brand-subtle)] px-4 py-3">
          <Text variant="body-default" className="text-[var(--everkit-color-content-brand)]">
            The next available {service.label} provider will be automatically assigned.
          </Text>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Date */}
          <div className="flex flex-col gap-1.5 max-w-[400px]">
            <Label htmlFor="appt-date">Appointment Date</Label>
            <DateField
              id="appt-date"
              value={date}
              onValueChange={setDate}
              placeholder="MM/DD/YYYY"
            />
          </div>

          {/* Provider search */}
          <div className="flex flex-col gap-1.5 max-w-[400px]">
            <Label htmlFor="provider-search">Search for a Provider</Label>
            <Input
              id="provider-search"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Name or specialty…"
            />
          </div>

          {/* Provider list */}
          {filteredProviders.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  onSelectSlot={(slot) => onContinue(provider, slot)}
                />
              ))}
            </div>
          ) : (
            <Text variant="body-default" className="text-muted-foreground">
              No providers match &ldquo;{search}&rdquo;.
            </Text>
          )}
        </div>
      )}

      {/* Footer — Continue only shown in First Available mode; in Specific mode, selecting a slot navigates forward */}
      <div className="flex items-center gap-3 pt-2">
        <Button variant="neutral-secondary" onClick={onBack}>
          <Icon name="arrow_back" size="sm" aria-hidden className="mr-1" />Back
        </Button>
        {mode === "first-available" && (
          <Button onClick={() => onContinue(null, null)}>
            Continue
            <Icon name="arrow_forward" size="sm" aria-hidden className="ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
