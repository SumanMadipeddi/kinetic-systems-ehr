export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  last4Ssn: string;
  prn: string;
}

export function patientDisplayName(patient: Patient): string {
  return `${patient.lastName}, ${patient.firstName}`;
}
