"use client";

import { useMemo } from "react";
import { useScheduleStore } from "@/store/schedule-store";
import { statusCodesForDomain } from "@/mocks/appointment-statuses";
import type { ScheduleEntry } from "@/types/schedule-entry";

export function useFilteredEntries(): ScheduleEntry[] {
  const entries = useScheduleStore((s) => s.entries);
  const selectedFacilityId = useScheduleStore((s) => s.selectedFacilityId);
  const selectedProviderIds = useScheduleStore((s) => s.selectedProviderIds);
  const selectedAppointmentTypes = useScheduleStore(
    (s) => s.selectedAppointmentTypes,
  );
  const selectedStatuses = useScheduleStore((s) => s.selectedStatuses);

  return useMemo(() => {
    return entries.filter((entry) => {
      if (entry.facilityId !== selectedFacilityId) return false;
      if (!selectedProviderIds.includes(entry.providerId)) return false;

      // Patient entries with a type must match the type filter.
      // Block-time / block-range (no appointmentType) stay visible regardless of type filters.
      if (entry.appointmentType) {
        if (!selectedAppointmentTypes.includes(entry.appointmentType)) {
          return false;
        }
      }

      const statusCodes = statusCodesForDomain(entry.status);
      if (
        statusCodes.length > 0 &&
        !statusCodes.some((code) => selectedStatuses.includes(code))
      ) {
        return false;
      }

      return true;
    });
  }, [
    entries,
    selectedFacilityId,
    selectedProviderIds,
    selectedAppointmentTypes,
    selectedStatuses,
  ]);
}
