import { ScheduleShell } from "@/features/schedule/components/schedule-shell";
import { AppointmentsTable } from "@/features/schedule/components/appointments-table";

export default function ScheduleAppointmentsPage() {
  return (
    <ScheduleShell showAddAppointment={false} showPrint>
      <AppointmentsTable />
    </ScheduleShell>
  );
}
