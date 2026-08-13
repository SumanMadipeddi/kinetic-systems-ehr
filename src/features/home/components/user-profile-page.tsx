"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Info, Search, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useUiStore } from "@/store/ui-store";
import {
  useUsersStore,
  userDisplayName,
  userStatusLine,
  type PracticeUser,
} from "@/store/users-store";
import { ACCESS_LEVELS } from "../schemas/add-user.schema";

type ProfileFormValues = {
  firstName: string;
  middleInitial: string;
  lastName: string;
  title: string;
  suffix: string;
  sex: "female" | "male" | "unspecified";
  primarySpecialty: string;
  secondarySpecialty: string;
  taxonomy: string;
  accessLevel: string;
  primaryFacility: string;
  medicalLicenseNumber: string;
  medicalLicenseExpiration: string;
  medicalLicenseState: string;
  degreeOnLicense: string;
  npiNumber: string;
  deaNumber: string;
  upin: string;
  medicaid: string;
  einTin: string;
  medicarePtan: string;
  nadeanNumber: string;
  otherIdentifier: string;
  usDeptOfLabor: string;
  officePhone: string;
  officeExt: string;
  status: "active" | "inactive";
  isAdmin: boolean;
  emergencyAccess: boolean;
};

const TITLE_OPTIONS = [
  { value: "md", label: "M.D." },
  { value: "do", label: "D.O." },
  { value: "np", label: "N.P." },
  { value: "pa", label: "P.A." },
  { value: "rn", label: "R.N." },
  { value: "other", label: "Other" },
];

const SPECIALTY_OPTIONS = [
  { value: "family", label: "Family Medicine" },
  { value: "internal", label: "Internal Medicine" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "nursing", label: "Nursing" },
  { value: "other", label: "Other" },
];

const STATE_OPTIONS = [
  { value: "AZ", label: "Arizona" },
  { value: "CA", label: "California" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
];

const fieldLabel =
  "text-[10px] font-bold uppercase tracking-wide text-[#9a6b3f]";

function toFormValues(user: PracticeUser): ProfileFormValues {
  return {
    firstName: user.firstName,
    middleInitial: user.middleInitial ?? "",
    lastName: user.lastName,
    title: user.title ?? "",
    suffix: user.suffix ?? "",
    sex: user.sex ?? "unspecified",
    primarySpecialty: user.primarySpecialty ?? "",
    secondarySpecialty: user.secondarySpecialty ?? "",
    taxonomy: user.taxonomy ?? "",
    accessLevel: user.accessLevel,
    primaryFacility: user.primaryFacility ?? "suman Ma Practice",
    medicalLicenseNumber: user.medicalLicenseNumber ?? "",
    medicalLicenseExpiration: user.medicalLicenseExpiration ?? "",
    medicalLicenseState: user.medicalLicenseState ?? "",
    degreeOnLicense: user.degreeOnLicense ?? "",
    npiNumber: user.npiNumber ?? "",
    deaNumber: user.deaNumber ?? "",
    upin: user.upin ?? "",
    medicaid: user.medicaid ?? "",
    einTin: user.einTin ?? "",
    medicarePtan: user.medicarePtan ?? "",
    nadeanNumber: user.nadeanNumber ?? "",
    otherIdentifier: user.otherIdentifier ?? "",
    usDeptOfLabor: user.usDeptOfLabor ?? "",
    officePhone: user.officePhone ?? "",
    officeExt: user.officeExt ?? "",
    status: user.status,
    isAdmin: user.isAdmin,
    emergencyAccess: user.emergencyAccess,
  };
}

export function UserProfilePage() {
  const params = useParams<{ userId: string }>();
  const router = useRouter();
  const openUsersTab = useUiStore((s) => s.openUsersTab);
  const showToast = useUiStore((s) => s.showToast);
  const user = useUsersStore((s) => s.users.find((u) => u.id === params.userId));
  const updateUser = useUsersStore((s) => s.updateUser);
  const resendVerification = useUsersStore((s) => s.resendVerification);

  const form = useForm<ProfileFormValues>({
    defaultValues: user ? toFormValues(user) : undefined,
  });

  useEffect(() => {
    openUsersTab();
  }, [openUsersTab]);

  useEffect(() => {
    if (user) form.reset(toFormValues(user));
  }, [user, form]);

  if (!user) {
    return (
      <div className="flex h-full flex-col items-start gap-3 bg-white p-6">
        <p className="text-[14px] text-[var(--pf-text)]">User not found.</p>
        <Button type="button" variant="secondary" onClick={() => router.push("/home/users")}>
          Back to Users
        </Button>
      </div>
    );
  }

  const displayName = userDisplayName(user);
  const statusLine = userStatusLine(user);

  const onSave = form.handleSubmit((values) => {
    updateUser(user.id, {
      firstName: values.firstName.trim(),
      middleInitial: values.middleInitial.trim() || undefined,
      lastName: values.lastName.trim(),
      title: values.title || undefined,
      suffix: values.suffix.trim() || undefined,
      sex: values.sex,
      primarySpecialty: values.primarySpecialty || undefined,
      secondarySpecialty: values.secondarySpecialty || undefined,
      taxonomy: values.taxonomy.trim() || undefined,
      accessLevel: values.accessLevel,
      primaryFacility: values.primaryFacility.trim() || undefined,
      medicalLicenseNumber: values.medicalLicenseNumber.trim() || undefined,
      medicalLicenseExpiration: values.medicalLicenseExpiration.trim() || undefined,
      medicalLicenseState: values.medicalLicenseState || undefined,
      degreeOnLicense: values.degreeOnLicense.trim() || undefined,
      npiNumber: values.npiNumber.trim() || undefined,
      deaNumber: values.deaNumber.trim() || undefined,
      upin: values.upin.trim() || undefined,
      medicaid: values.medicaid.trim() || undefined,
      einTin: values.einTin.trim() || undefined,
      medicarePtan: values.medicarePtan.trim() || undefined,
      nadeanNumber: values.nadeanNumber.trim() || undefined,
      otherIdentifier: values.otherIdentifier.trim() || undefined,
      usDeptOfLabor: values.usDeptOfLabor.trim() || undefined,
      officePhone: values.officePhone.trim() || undefined,
      officeExt: values.officeExt.trim() || undefined,
      status: values.status,
      isAdmin: values.isAdmin,
      emergencyAccess: values.emergencyAccess,
    });
    showToast("Successfully completed", "success");
    router.push("/home/users");
  });

  return (
    <div className="flex h-full flex-col overflow-auto bg-[var(--pf-page-background)]">
      <div className="flex min-h-[52px] items-center justify-between gap-4 bg-[var(--pf-primary)] px-4 text-white">
        <div className="flex min-w-0 items-baseline gap-3">
          <h1 className="truncate text-[24px] font-light leading-none">{displayName}</h1>
          <span className="shrink-0 text-[13px] text-white/90">{statusLine}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="bg-white"
            onClick={() => router.push("/home/users")}
          >
            Cancel
          </Button>
          <Button type="button" variant="orange" onClick={onSave}>
            Save
          </Button>
        </div>
      </div>

      <form className="mx-auto w-full max-w-[1100px] space-y-4 p-4" onSubmit={onSave}>
        {/* Profile */}
        <section className="border border-[var(--pf-border)] bg-white p-4">
          <h2 className="mb-4 text-[16px] font-semibold text-[var(--pf-text)]">Profile</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="grid grid-cols-[1fr_70px_1fr] gap-2">
                <Input label="First name" requiredMark {...form.register("firstName")} />
                <Input label="M.I." {...form.register("middleInitial")} />
                <Input label="Last name" requiredMark {...form.register("lastName")} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  label="Title"
                  requiredMark
                  placeholder="Select..."
                  options={TITLE_OPTIONS}
                  {...form.register("title")}
                />
                <label className="flex w-full flex-col gap-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-[#555]">
                    Suffix
                    <Info size={12} className="text-[#999]" aria-hidden />
                  </span>
                  <input
                    className="h-8 w-full rounded-[var(--pf-input-radius)] border border-[var(--pf-border)] bg-white px-2 text-[13px] outline-none focus:border-[var(--pf-primary)]"
                    {...form.register("suffix")}
                  />
                </label>
              </div>
              <fieldset>
                <legend className="mb-1 text-[11px] font-bold uppercase tracking-wide text-[#555]">
                  Sex <span className="text-[var(--pf-required)]">*</span>
                </legend>
                <div className="flex flex-wrap gap-4 text-[13px]">
                  {(
                    [
                      ["female", "Female"],
                      ["male", "Male"],
                      ["unspecified", "Don't specify"],
                    ] as const
                  ).map(([value, label]) => (
                    <label key={value} className="inline-flex items-center gap-1.5">
                      <input type="radio" value={value} {...form.register("sex")} />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="space-y-3">
              <Select
                label="Primary specialty"
                placeholder="Select..."
                options={SPECIALTY_OPTIONS}
                {...form.register("primarySpecialty")}
              />
              <Select
                label="Secondary specialty"
                placeholder="Select..."
                options={SPECIALTY_OPTIONS}
                {...form.register("secondarySpecialty")}
              />
              <label className="flex w-full flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wide text-[#555]">
                  Taxonomy
                </span>
                <div className="relative">
                  <input
                    placeholder="Search for Classification, Specialization, or Code"
                    className="h-8 w-full rounded-[var(--pf-input-radius)] border border-[var(--pf-border)] bg-white py-1 pl-2 pr-8 text-[13px] outline-none focus:border-[var(--pf-primary)]"
                    {...form.register("taxonomy")}
                  />
                  <Search
                    size={14}
                    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#888]"
                  />
                </div>
              </label>
              <Select
                label="Access level"
                options={[...ACCESS_LEVELS]}
                {...form.register("accessLevel")}
              />
              <Select
                label="Primary facility"
                options={[
                  { value: "suman Ma Practice", label: "suman Ma Practice" },
                  { value: "San Jose Clinic", label: "San Jose Clinic" },
                ]}
                {...form.register("primaryFacility")}
              />
            </div>
          </div>

          <div className="mt-6 border-t border-[var(--pf-border-light)] pt-4">
            <h3 className="mb-3 text-[14px] font-semibold text-[var(--pf-text)]">
              About the provider
            </h3>
            <div className="flex items-start gap-4">
              <div className="grid h-[120px] w-[120px] place-items-center border border-[var(--pf-border)] bg-[#f3f3f3] text-[#aaa]">
                <UserRound size={56} strokeWidth={1.25} />
              </div>
              <div className="space-y-2 text-[12px] text-[#555]">
                <p>No larger than 1 MB</p>
                <p>Minimum 300 X 300 px</p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    showToast("Image upload is unavailable.", "info")
                  }
                >
                  Upload image
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Medical Identifiers */}
        <section className="border border-[var(--pf-border)] bg-white p-4">
          <h2 className="text-[16px] font-semibold text-[var(--pf-text)]">Medical Identifiers</h2>
          <p className="mb-4 text-[12px] text-[#666]">
            Publicly visible on e-Prescriptions and lab orders
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-[13px] font-semibold text-[var(--pf-text)]">Medical credentials</h3>
              <p className="text-[12px] font-medium text-[#555]">Medical license</p>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Medical license number"
                  {...form.register("medicalLicenseNumber")}
                />
                <Input
                  label="Expiration"
                  placeholder="MM/DD/YYYY"
                  {...form.register("medicalLicenseExpiration")}
                />
                <Select
                  label="State"
                  placeholder="Select..."
                  options={STATE_OPTIONS}
                  {...form.register("medicalLicenseState")}
                />
                <Input
                  label="Degree listed on license"
                  placeholder="eg. M.D., NP-C"
                  {...form.register("degreeOnLicense")}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Input label="NPI number" {...form.register("npiNumber")} />
                <Input label="DEA number" {...form.register("deaNumber")} />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[13px] font-semibold text-[var(--pf-text)]">Other identifiers</h3>
              <div className="grid grid-cols-2 gap-2">
                <Input label="UPIN" {...form.register("upin")} />
                <Input label="Medicaid" {...form.register("medicaid")} />
                <Input label="EIN/TIN" {...form.register("einTin")} />
                <Input label="Medicare PTAN" {...form.register("medicarePtan")} />
                <Input label="NADEAN number" {...form.register("nadeanNumber")} />
                <Input label="Other identifier" {...form.register("otherIdentifier")} />
              </div>
              <Input label="US Dept of Labor" {...form.register("usDeptOfLabor")} />
            </div>
          </div>
        </section>

        {/* Login + User access */}
        <section className="border border-[var(--pf-border)] bg-white">
          <div className="border-b border-[var(--pf-border-light)] bg-[#f7f7f7] px-4 py-2">
            <h2 className="text-[14px] font-semibold text-[var(--pf-text)]">Login</h2>
          </div>
          <div className="grid gap-6 p-4 lg:grid-cols-2">
            <div className="space-y-4 text-[13px]">
              <div>
                <div className={fieldLabel}>Email</div>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <span>{user.email}</span>
                  <button
                    type="button"
                    className="text-[var(--pf-link)] hover:underline"
                    onClick={() =>
                      showToast("Email changes are unavailable.", "info")
                    }
                  >
                    Change email
                  </button>
                </div>
              </div>

              <div>
                <div className={fieldLabel}>Password</div>
                <div className="mt-1">
                  {!user.emailVerified ? (
                    <button
                      type="button"
                      className="text-[var(--pf-link)] hover:underline"
                      onClick={() => {
                        resendVerification(user.id);
                        showToast("Verification email resent.", "success");
                      }}
                    >
                      Resend verification email
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="text-[var(--pf-link)] hover:underline"
                      onClick={() =>
                        showToast("Password reset is unavailable.", "info")
                      }
                    >
                      Reset password
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className={fieldLabel}>Verification phone</div>
                <p className="mt-1 text-[#666]">No verification phone number on record</p>
              </div>

              <div>
                <div className="mb-1 text-[12px] font-semibold text-[var(--pf-text)]">
                  Other contact
                </div>
                <div className="grid grid-cols-[1fr_90px] gap-2">
                  <Input label="Office phone" {...form.register("officePhone")} />
                  <Input label="Ext." {...form.register("officeExt")} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[13px] font-semibold text-[var(--pf-text)]">User access</h3>

              <fieldset>
                <legend className={fieldLabel}>User status</legend>
                <div className="mt-1 flex gap-4 text-[13px]">
                  <label className="inline-flex items-center gap-1.5">
                    <input type="radio" value="active" {...form.register("status")} />
                    Active
                  </label>
                  <label className="inline-flex items-center gap-1.5">
                    <input type="radio" value="inactive" {...form.register("status")} />
                    Inactive
                  </label>
                </div>
              </fieldset>

              <fieldset>
                <legend className={fieldLabel}>Admin access</legend>
                <div className="mt-1 flex flex-col gap-1.5 text-[13px]">
                  <label className="inline-flex items-center gap-1.5">
                    <input
                      type="radio"
                      checked={form.watch("isAdmin") === true}
                      onChange={() => form.setValue("isAdmin", true)}
                    />
                    Administrator privileges
                  </label>
                  <label className="inline-flex items-center gap-1.5">
                    <input
                      type="radio"
                      checked={form.watch("isAdmin") === false}
                      onChange={() => form.setValue("isAdmin", false)}
                    />
                    Non-administrator
                  </label>
                </div>
              </fieldset>

              <div>
                <div className={`${fieldLabel} mb-1 inline-flex items-center gap-1`}>
                  Emergency access
                  <Info size={12} className="text-[#999]" aria-hidden />
                </div>
                <label className="inline-flex items-center gap-1.5 text-[13px]">
                  <input type="checkbox" {...form.register("emergencyAccess")} />
                  Allow emergency access
                </label>
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
