"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DEFAULT_PRACTICE, usePracticeStore } from "@/store/practice-store";
import { useUiStore } from "@/store/ui-store";
import {
  practiceInfoSchema,
  type PracticeInfoFormValues,
} from "../schemas/practice-info.schema";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS",
  "KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY",
  "NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV",
  "WI","WY","DC",
].map((code) => ({ value: code, label: code }));

const TIME_ZONES = [
  { value: "America/New_York", label: "Eastern (GMT -5)" },
  { value: "America/Chicago", label: "Central (GMT -6)" },
  { value: "America/Denver", label: "Mountain (GMT -7)" },
  { value: "America/Los_Angeles", label: "Pacific (GMT -8)" },
  { value: "America/Phoenix", label: "Arizona (GMT -7)" },
  { value: "Pacific/Honolulu", label: "Hawaii (GMT -10)" },
];

export function PracticeInfoForm() {
  const router = useRouter();
  const practice = usePracticeStore((s) => s.practice);
  const hasHydrated = usePracticeStore((s) => s.hasHydrated);
  const savePractice = usePracticeStore((s) => s.savePractice);
  const showToast = useUiStore((s) => s.showToast);
  const openPracticeInfoTab = useUiStore((s) => s.openPracticeInfoTab);

  const form = useForm<PracticeInfoFormValues>({
    resolver: zodResolver(practiceInfoSchema),
    defaultValues: practice ?? DEFAULT_PRACTICE,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { reset, handleSubmit, register, formState } = form;

  useEffect(() => {
    openPracticeInfoTab();
  }, [openPracticeInfoTab]);

  // Wait for localStorage rehydration, then load persisted values into the form
  useEffect(() => {
    if (!hasHydrated) return;
    reset({
      practiceName: practice.practiceName ?? "",
      practicePhone: practice.practicePhone ?? "",
      practiceFax: practice.practiceFax ?? "",
      facilityName: practice.facilityName ?? "",
      addressLine1: practice.addressLine1 ?? "",
      addressLine2: practice.addressLine2 ?? "",
      city: practice.city ?? "",
      state: practice.state ?? "CA",
      zip: practice.zip ?? "",
      country: practice.country ?? "United States",
      timeZone: practice.timeZone ?? "America/Los_Angeles",
      observesDaylightSaving: Boolean(practice.observesDaylightSaving),
    });
  }, [hasHydrated, practice, reset]);

  const onCancel = () => {
    reset(practice);
    router.push("/home");
  };

  const onSubmit = (data: PracticeInfoFormValues) => {
    savePractice(data);
    showToast("Practice information saved.", "success");
    router.push("/home");
  };

  return (
    <div className="flex h-full flex-col overflow-auto bg-white">
      <div className="flex min-h-[56px] items-center justify-between bg-[var(--pf-primary)] px-4">
        <h1 className="text-[22px] font-normal text-white">Add practice information</h1>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            data-testid="practice-cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="practice-info-form"
            variant="orange"
            data-testid="practice-save"
          >
            Save
          </Button>
        </div>
      </div>

      <form
        id="practice-info-form"
        className="mx-auto w-full max-w-[720px] space-y-3 p-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Input
          id="practiceName"
          label="Practice name"
          requiredMark
          error={formState.errors.practiceName?.message}
          {...register("practiceName")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="practicePhone"
            label="Practice phone"
            requiredMark
            error={formState.errors.practicePhone?.message}
            {...register("practicePhone")}
          />
          <Input
            id="practiceFax"
            label="Practice fax"
            error={formState.errors.practiceFax?.message}
            {...register("practiceFax")}
          />
        </div>

        <Input
          id="facilityName"
          label="Facility name"
          requiredMark
          error={formState.errors.facilityName?.message}
          {...register("facilityName")}
        />

        <Input
          id="addressLine1"
          label="Address line 1"
          requiredMark
          error={formState.errors.addressLine1?.message}
          {...register("addressLine1")}
        />

        <Input
          id="addressLine2"
          label="Address line 2"
          {...register("addressLine2")}
        />

        <Input
          id="city"
          label="City"
          requiredMark
          error={formState.errors.city?.message}
          {...register("city")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="state"
            label="State"
            requiredMark
            options={US_STATES}
            error={formState.errors.state?.message}
            {...register("state")}
          />
          <Input
            id="zip"
            label="Zip"
            requiredMark
            error={formState.errors.zip?.message}
            {...register("zip")}
          />
        </div>

        <Select
          id="country"
          label="Country"
          requiredMark
          options={[
            { value: "United States", label: "United States" },
            { value: "Canada", label: "Canada" },
          ]}
          error={formState.errors.country?.message}
          {...register("country")}
        />

        <div className="grid grid-cols-[1fr_auto] items-end gap-4">
          <Select
            id="timeZone"
            label="Time zone"
            requiredMark
            options={TIME_ZONES}
            error={formState.errors.timeZone?.message}
            {...register("timeZone")}
          />
          <label className="mb-1 flex items-center gap-2 whitespace-nowrap text-[12px]">
            <input type="checkbox" {...register("observesDaylightSaving")} />
            Observes daylight saving
          </label>
        </div>
      </form>
    </div>
  );
}
