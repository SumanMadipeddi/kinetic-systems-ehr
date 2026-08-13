"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type DemoSessionState = {
  authenticated: boolean;
  locked: boolean;
  returnPath: string | null;
  signIn: () => void;
  signOut: () => void;
  lock: (returnPath: string) => void;
  unlock: () => void;
};

export const useDemoSessionStore = create<DemoSessionState>()(
  persist(
    (set) => ({
      // Fresh browser / first visit: enter EHR without a login gate
      authenticated: true,
      locked: false,
      returnPath: null,
      signIn: () =>
        set({ authenticated: true, locked: false, returnPath: null }),
      signOut: () =>
        set({ authenticated: false, locked: false, returnPath: null }),
      lock: (returnPath) =>
        set({
          locked: true,
          returnPath: returnPath || "/home",
        }),
      unlock: () => set({ locked: false, returnPath: null }),
    }),
    {
      name: "pf-demo-session",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => undefined,
            removeItem: () => undefined,
          };
        }
        return sessionStorage;
      }),
      partialize: (state) => ({
        authenticated: state.authenticated,
        locked: state.locked,
        returnPath: state.returnPath,
      }),
    },
  ),
);
