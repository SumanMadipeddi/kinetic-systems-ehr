"use client";

import { usePracticeStore } from "@/store/practice-store";
import { useUsersStore } from "@/store/users-store";

/** Setup steps that drive the Practice Setup % bar (matches incomplete dashboard cards + practice info). */
export const SETUP_STEP_IDS = [
  "practice",
  "users",
  "labs",
  "imaging",
  "erx",
  "direct-messaging",
] as const;

export function useSetupProgress() {
  const practiceComplete = usePracticeStore((s) => s.completed);
  const usersComplete = useUsersStore((s) => s.setupComplete);

  const completedIds = new Set<string>();
  if (practiceComplete) completedIds.add("practice");
  if (usersComplete) completedIds.add("users");

  const total = SETUP_STEP_IDS.length;
  const completedCount = SETUP_STEP_IDS.filter((id) => completedIds.has(id)).length;
  const percent = Math.floor((completedCount / total) * 100);

  return {
    percent,
    completedCount,
    total,
    usersComplete,
    practiceComplete,
  };
}
