import { ScheduleShell } from "@/features/schedule/components/schedule-shell";
import { ScheduleSettings } from "@/features/schedule/components/schedule-settings";

export default function ScheduleSettingsPage() {
  return (
    <ScheduleShell showAddAppointment={false} showFilterRail={false}>
      <ScheduleSettings />
    </ScheduleShell>
  );
}
