"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AddUserFormValues } from "@/features/home/schemas/add-user.schema";
import { ACCESS_LEVELS } from "@/features/home/schemas/add-user.schema";

export const PRACTICE_ACCESS_CODE = "DEMO8X42Q";

export type PracticeUser = {
  id: string;
  isDr: boolean;
  firstName: string;
  lastName: string;
  middleInitial?: string;
  email: string;
  accessLevel: string;
  isAdmin: boolean;
  emergencyAccess: boolean;
  status: "active" | "inactive";
  /** Seeded/admin users start verified; newly added users need verification */
  emailVerified: boolean;
  verificationEmailSent: boolean;
  title?: string;
  suffix?: string;
  sex?: "female" | "male" | "unspecified";
  primarySpecialty?: string;
  secondarySpecialty?: string;
  taxonomy?: string;
  primaryFacility?: string;
  officePhone?: string;
  officeExt?: string;
  npiNumber?: string;
  deaNumber?: string;
  nadeanNumber?: string;
  otherIdentifier?: string;
  usDeptOfLabor?: string;
  medicalLicenseNumber?: string;
  medicalLicenseExpiration?: string;
  medicalLicenseState?: string;
  degreeOnLicense?: string;
  upin?: string;
  medicaid?: string;
  einTin?: string;
  medicarePtan?: string;
};

export type UserProfileUpdate = Partial<
  Omit<PracticeUser, "id" | "emailVerified" | "verificationEmailSent">
>;

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const n = (Math.random() * 16) | 0;
    const v = ch === "x" ? n : (n & 0x3) | 0x8;
    return v.toString(16);
  });
}

function accessLabel(value: string) {
  return ACCESS_LEVELS.find((level) => level.value === value)?.label ?? value;
}

export function userDisplayName(user: PracticeUser) {
  return `${user.isDr ? "Dr. " : ""}${user.firstName} ${user.lastName}`.trim();
}

export function userStatusLine(user: PracticeUser) {
  const role = accessLabel(user.accessLevel).replace(/^\d+\s*/, "");
  const admin = user.isAdmin ? "Admin" : "Non-admin";
  const active = user.status === "active" ? "Active user" : "Inactive user";
  return `${role} ${admin} ${active}`;
}

type UsersState = {
  users: PracticeUser[];
  /** Dashboard “Add users” setup step */
  setupComplete: boolean;
  addUser: (input: AddUserFormValues) => PracticeUser;
  updateUser: (id: string, patch: UserProfileUpdate) => PracticeUser | null;
  resendVerification: (id: string) => void;
  accessLevelLabel: (value: string) => string;
};

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: [
        {
          id: "15b64730-7494-4e25-a090-6c1247ae3db1",
          isDr: false,
          firstName: "suman",
          lastName: "Ma",
          email: "suman@example.com",
          accessLevel: "4",
          isAdmin: true,
          emergencyAccess: false,
          status: "active",
          emailVerified: true,
          verificationEmailSent: false,
          primaryFacility: "suman Ma Practice",
          officePhone: "(408) 555-0142",
          sex: "unspecified",
        },
      ],
      setupComplete: false,
      addUser: (input) => {
        const user: PracticeUser = {
          id: createId(),
          isDr: input.isDr,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          accessLevel: input.accessLevel,
          isAdmin: input.isAdmin,
          emergencyAccess: input.emergencyAccess,
          status: "active",
          emailVerified: false,
          verificationEmailSent: true,
          primaryFacility: "suman Ma Practice",
          sex: "unspecified",
        };
        set({ users: [...get().users, user], setupComplete: true });
        return user;
      },
      updateUser: (id, patch) => {
        const current = get().users.find((u) => u.id === id);
        if (!current) return null;
        const next = { ...current, ...patch };
        set({
          users: get().users.map((u) => (u.id === id ? next : u)),
        });
        return next;
      },
      resendVerification: (id) => {
        set({
          users: get().users.map((u) =>
            u.id === id
              ? { ...u, verificationEmailSent: true, emailVerified: false }
              : u,
          ),
        });
      },
      accessLevelLabel: accessLabel,
    }),
    {
      name: "pf-users",
      partialize: (state) => ({
        users: state.users,
        setupComplete: state.setupComplete,
      }),
      merge: (persisted, current) => {
        const p = (persisted as Partial<UsersState> | undefined) ?? {};
        const users = (p.users ?? current.users).map((u) => ({
          ...u,
          emailVerified: u.emailVerified ?? true,
          verificationEmailSent: u.verificationEmailSent ?? false,
        }));
        const invitedExtra = users.some(
          (u) => u.id !== "15b64730-7494-4e25-a090-6c1247ae3db1",
        );
        return {
          ...current,
          ...p,
          users,
          setupComplete: p.setupComplete ?? invitedExtra ?? false,
        };
      },
    },
  ),
);
