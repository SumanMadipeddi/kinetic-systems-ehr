"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { usePracticeStore } from "@/store/practice-store";
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
  const savePractice = usePracticeStore((s) => s.savePractice);
  const showToast = useUiStore((s) => s.showToast);
  const openPracticeInfoTab = useUiStore((s) => s.openPracticeInfoTab);

  const form = useForm<PracticeInfoFormValues>({
    defaultValues: practice,
  });

  useEffect(() => {
    openPracticeInfoTab();
  }, [openPracticeInfoTab]);

  useEffect(() => {
    form.reset(practice);
  }, [practice, form]);

  const onCancel = () => {
    form.reset(practice);
    router.push("/home");
  };

  const onSave = () => {
    const raw = form.getValues();
    const parsed = practiceInfoSchema.safeParse({
      ...raw,
      practiceFax: raw.practiceFax ?? "",
      addressLine2: raw.addressLine2 ?? "",
      observesDaylightSaving: Boolean(raw.observesDaylightSaving),
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      (Object.keys(fieldErrors) as (keyof PracticeInfoFormValues)[]).forEach((key) => {
        const message = fieldErrors[key]?.[0];
        if (message) form.setError(key, { message });
      });
      showToast(parsed.error.issues[0]?.message ?? "Please complete required fields.", "error");
      return;
    }

    savePractice(parsed.data);
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
            type="button"
            variant="orange"
            onClick={onSave}
            data-testid="practice-save"
          >
            Save
          </Button>
        </div>
      </div>

      <form
        className="mx-auto w-full max-w-[720px] space-y-3 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        <Input
          id="practiceName"
          label="Practice name"
          requiredMark
          error={form.formState.errors.practiceName?.message}
          {...form.register("practiceName")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="practicePhone"
            label="Practice phone"
            requiredMark
            error={form.formState.errors.practicePhone?.message}
            {...form.register("practicePhone")}
          />
          <Input
            id="practiceFax"
            label="Practice fax"
            error={form.formState.errors.practiceFax?.message}
            {...form.register("practiceFax")}
          />
        </div>

        <Input
          id="facilityName"
          label="Facility name"
          requiredMark
          error={form.formState.errors.facilityName?.message}
          {...form.register("facilityName")}
        />

        <Input
          id="addressLine1"
          label="Address line 1"
          requiredMark
          error={form.formState.errors.addressLine1?.message}
          {...form.register("addressLine1")}
        />

        <Input
          id="addressLine2"
          label="Address line 2"
          {...form.register("addressLine2")}
        />

        <Input
          id="city"
          label="City"
          requiredMark
          error={form.formState.errors.city?.message}
          {...form.register("city")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="state"
            label="State"
            requiredMark
            options={US_STATES}
            error={form.formState.errors.state?.message}
            {...form.register("state")}
          />
          <Input
            id="zip"
            label="Zip"
            requiredMark
            error={form.formState.errors.zip?.message}
            {...form.register("zip")}
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
          error={form.formState.errors.country?.message}
          {...form.register("country")}
        />

        <div className="grid grid-cols-[1fr_auto] items-end gap-4">
          <Select
            id="timeZone"
            label="Time zone"
            requiredMark
            options={TIME_ZONES}
            error={form.formState.errors.timeZone?.message}
            {...form.register("timeZone")}
          />
          <label className="mb-1 flex items-center gap-2 whitespace-nowrap text-[12px]">
            <input type="checkbox" {...form.register("observesDaylightSaving")} />
            Observes daylight saving
          </label>
        </div>
      </form>
    </div>
  );
}
