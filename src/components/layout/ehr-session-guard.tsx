"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDemoSessionStore } from "@/store/demo-session-store";

/**
 * Client-only session gate for the EHR shell.
 * Fresh visits stay authenticated; Log out forces /login; Lock forces /lock.
 */
export function EhrSessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const authenticated = useDemoSessionStore((s) => s.authenticated);
  const locked = useDemoSessionStore((s) => s.locked);

  useEffect(() => {
    const markReady = () => setReady(true);
    const unsub = useDemoSessionStore.persist.onFinishHydration(markReady);
    // Persist may already be finished by the time this effect runs
    if (useDemoSessionStore.persist.hasHydrated()) {
      markReady();
    } else {
      void Promise.resolve(useDemoSessionStore.persist.rehydrate()).finally(markReady);
    }
    return unsub;
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!authenticated) {
      router.replace("/login");
      return;
    }
    if (locked) {
      if (pathname !== "/lock") {
        router.replace("/lock");
      }
    }
  }, [ready, authenticated, locked, router, pathname]);

  if (!ready || !authenticated || locked) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-[13px] text-white/70">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
