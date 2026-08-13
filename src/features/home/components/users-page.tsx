"use client";

import { useEffect, useMemo, useState } from "react";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui-store";
import { useUsersStore } from "@/store/users-store";
import {
  ACCESS_LEVELS,
  addUserSchema,
  type AddUserFormValues,
} from "../schemas/add-user.schema";

const emptyForm: AddUserFormValues = {
  isDr: false,
  firstName: "",
  lastName: "",
  email: "",
  accessLevel: "",
  isAdmin: false,
  emergencyAccess: false,
};

const labelClass =
  "text-[10px] font-bold uppercase tracking-wide text-[#9a6b3f]";

export function UsersPage() {
  const openUsersTab = useUiStore((s) => s.openUsersTab);
  const showToast = useUiStore((s) => s.showToast);
  const users = useUsersStore((s) => s.users);
  const addUser = useUsersStore((s) => s.addUser);
  const accessLevelLabel = useUsersStore((s) => s.accessLevelLabel);
  const [showInactive, setShowInactive] = useState(false);

  const form = useForm<AddUserFormValues>({
    defaultValues: emptyForm,
  });

  useEffect(() => {
    openUsersTab();
  }, [openUsersTab]);

  const visibleUsers = useMemo(
    () =>
      showInactive ? users : users.filter((user) => user.status === "active"),
    [users, showInactive],
  );

  const activeCount = users.filter((user) => user.status === "active").length;

  const onAdd = () => {
    const raw = form.getValues();
    const parsed = addUserSchema.safeParse({
      ...raw,
      isDr: Boolean(raw.isDr),
      isAdmin: Boolean(raw.isAdmin),
      emergencyAccess: Boolean(raw.emergencyAccess),
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      (Object.keys(fieldErrors) as (keyof AddUserFormValues)[]).forEach((key) => {
        const message = fieldErrors[key]?.[0];
        if (message) form.setError(key, { message });
      });
      showToast(parsed.error.issues[0]?.message ?? "Please complete required fields.", "error");
      return;
    }

    addUser(parsed.data);
    form.reset(emptyForm);
    showToast("User added.", "success");
  };

  return (
    <div className="flex h-full flex-col overflow-auto bg-[var(--pf-page-background)]">
      <div className="flex min-h-[52px] items-center gap-4 bg-[var(--pf-primary)] px-4 text-white">
        <h1 className="text-[24px] font-light leading-none">Users</h1>
        <span className="text-[13px] text-white/90">
          {activeCount} active user{activeCount === 1 ? "" : "s"} | Practice access
          code: NWH53WH3CK
        </span>
      </div>

      <div className="flex items-center gap-4 border-b border-[var(--pf-border)] bg-white px-4 py-2">
        <select
          className="h-8 min-w-[120px] border border-[var(--pf-border)] bg-white px-2 text-[12px]"
          defaultValue="all"
          aria-label="Filter users"
        >
          <option value="all">Select</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <label className="flex items-center gap-2 text-[12px] text-[var(--pf-text)]">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
          />
          Display inactive
        </label>
      </div>

      <div className="border-b border-[var(--pf-border)] bg-white px-4 py-3">
        <h2 className="mb-3 text-[14px] font-bold text-[var(--pf-text)]">Add user</h2>
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            onAdd();
          }}
        >
          <label className="flex flex-col gap-1">
            <span className={labelClass}>Dr.</span>
            <input
              type="checkbox"
              className="mt-1 h-4 w-4"
              {...form.register("isDr")}
            />
          </label>

          <label className="flex min-w-[130px] flex-1 flex-col gap-1">
            <span className={labelClass}>
              First name <span className="text-[var(--pf-required)]">*</span>
            </span>
            <input
              placeholder="First name"
              className="h-8 border border-[var(--pf-border)] px-2 text-[12px] outline-none focus:border-[var(--pf-primary)]"
              {...form.register("firstName")}
            />
          </label>

          <label className="flex min-w-[130px] flex-1 flex-col gap-1">
            <span className={labelClass}>
              Last name <span className="text-[var(--pf-required)]">*</span>
            </span>
            <input
              placeholder="Last name"
              className="h-8 border border-[var(--pf-border)] px-2 text-[12px] outline-none focus:border-[var(--pf-primary)]"
              {...form.register("lastName")}
            />
          </label>

          <label className="flex min-w-[180px] flex-[1.2] flex-col gap-1">
            <span className={labelClass}>
              Login email <span className="text-[var(--pf-required)]">*</span>
            </span>
            <input
              type="email"
              placeholder="Login email"
              className="h-8 border border-[var(--pf-border)] px-2 text-[12px] outline-none focus:border-[var(--pf-primary)]"
              {...form.register("email")}
            />
          </label>

          <label className="flex min-w-[160px] flex-1 flex-col gap-1">
            <span className={labelClass}>
              Access level <span className="text-[var(--pf-required)]">*</span>
            </span>
            <select
              className="h-8 border border-[var(--pf-border)] bg-white px-2 text-[12px] outline-none focus:border-[var(--pf-primary)]"
              {...form.register("accessLevel")}
            >
              <option value="">Select access level</option>
              {ACCESS_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className={labelClass}>Admin</span>
            <input
              type="checkbox"
              className="mt-1 h-4 w-4"
              {...form.register("isAdmin")}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className={`${labelClass} inline-flex items-center gap-1`}>
              Emergency access
              <Info size={12} className="text-[#999]" aria-hidden />
            </span>
            <input
              type="checkbox"
              className="mt-1 h-4 w-4"
              {...form.register("emergencyAccess")}
            />
          </label>

          <Button
            type="submit"
            variant="outline"
            className="h-8 min-w-[64px] bg-[#f3f3f3] text-[13px] text-[#444]"
          >
            Add
          </Button>
        </form>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-white">
        <table className="w-full border-collapse text-left text-[12px]">
          <thead className="bg-[var(--pf-table-header)] text-[11px] font-bold uppercase text-[#555]">
            <tr>
              <th className="border-b border-[var(--pf-border)] px-4 py-2">Name</th>
              <th className="border-b border-[var(--pf-border)] px-4 py-2">Email</th>
              <th className="border-b border-[var(--pf-border)] px-4 py-2">Access level</th>
              <th className="border-b border-[var(--pf-border)] px-4 py-2">
                Permission / User status
              </th>
              <th className="border-b border-[var(--pf-border)] px-4 py-2">
                Allow emergency access
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleUsers.map((user) => {
              const displayName = `${user.isDr ? "Dr. " : ""}${user.firstName} ${user.lastName}`.trim();
              return (
                <tr key={user.id} className="bg-[#eef7fc] hover:bg-[#e4f2fa]">
                  <td className="border-b border-[var(--pf-border-light)] px-4 py-2">
                    <button
                      type="button"
                      className="text-[var(--pf-link)] hover:underline"
                      onClick={() =>
                        showToast("User profile editing is a placeholder.", "info")
                      }
                    >
                      {displayName}
                    </button>
                  </td>
                  <td className="border-b border-[var(--pf-border-light)] px-4 py-2 text-[var(--pf-text)]">
                    {user.email}
                  </td>
                  <td className="border-b border-[var(--pf-border-light)] px-4 py-2 text-[var(--pf-text)]">
                    {accessLevelLabel(user.accessLevel)}
                  </td>
                  <td className="border-b border-[var(--pf-border-light)] px-4 py-2 text-[var(--pf-text)]">
                    <div>{user.isAdmin ? "Admin" : "Standard"}</div>
                    <div className="text-[#666]">
                      {user.status === "active" ? "Active user" : "Inactive user"}
                    </div>
                  </td>
                  <td className="border-b border-[var(--pf-border-light)] px-4 py-2 text-[var(--pf-text)]">
                    {user.emergencyAccess ? "Yes" : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
