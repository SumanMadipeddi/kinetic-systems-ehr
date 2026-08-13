"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AddUserFormValues } from "@/features/home/schemas/add-user.schema";
import { ACCESS_LEVELS } from "@/features/home/schemas/add-user.schema";

export type PracticeUser = {
  id: string;
  isDr: boolean;
  firstName: string;
  lastName: string;
  email: string;
  accessLevel: string;
  isAdmin: boolean;
  emergencyAccess: boolean;
  status: "active" | "inactive";
};

function createId() {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function accessLabel(value: string) {
  return ACCESS_LEVELS.find((level) => level.value === value)?.label ?? value;
}

type UsersState = {
  users: PracticeUser[];
  addUser: (input: AddUserFormValues) => PracticeUser;
  accessLevelLabel: (value: string) => string;
};

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: [
        {
          id: "user-seed-1",
          isDr: false,
          firstName: "suman",
          lastName: "Ma",
          email: "suman970629@gmail.com",
          accessLevel: "4",
          isAdmin: true,
          emergencyAccess: false,
          status: "active",
        },
      ],
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
        };
        set({ users: [...get().users, user] });
        return user;
      },
      accessLevelLabel: accessLabel,
    }),
    { name: "pf-users" },
  ),
);
