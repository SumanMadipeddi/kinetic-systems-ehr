"use client";

import { useMemo } from "react";
import { useScheduleStore } from "@/store/schedule-store";
import type { ScheduleEntry } from "@/types/schedule-entry";

export function useFilteredEntries(): ScheduleEntry[] {
  const entries = useScheduleStore((s) => s.entries);
  const selectedFacilityId = useScheduleStore((s) => s.selectedFacilityId);
  const selectedProviderIds = useScheduleStore((s) => s.selectedProviderIds);

  return useMemo(() => {
    return entries.filter((entry) => {
      if (entry.facilityId !== selectedFacilityId) return false;
      if (
        selectedProviderIds.length > 0 &&
        !selectedProviderIds.includes(entry.providerId)
      ) {
        return false;
      }
      return true;
    });
  }, [entries, selectedFacilityId, selectedProviderIds]);
}
