import { ScheduleShell } from "@/features/schedule/components/schedule-shell";
import { DayView } from "@/features/schedule/components/day-view";

export default function ScheduleDayPage() {
  return (
    <ScheduleShell>
      <DayView />
    </ScheduleShell>
  );
}
