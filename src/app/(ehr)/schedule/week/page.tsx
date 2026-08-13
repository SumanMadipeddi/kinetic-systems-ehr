import { ScheduleShell } from "@/features/schedule/components/schedule-shell";
import { WeekView } from "@/features/schedule/components/week-view";

export default function ScheduleWeekPage() {
  return (
    <ScheduleShell>
      <WeekView />
    </ScheduleShell>
  );
}
