"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_CREDENTIALS } from "@/config/demo-credentials";
import { useDemoSessionStore } from "@/store/demo-session-store";
import { PracticeFusionBrandHeader } from "@/components/brand/practice-fusion-brand-header";
import { SessionAuthCard } from "@/components/session/session-auth-card";

export default function LockPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const authenticated = useDemoSessionStore((s) => s.authenticated);
  const locked = useDemoSessionStore((s) => s.locked);
  const returnPath = useDemoSessionStore((s) => s.returnPath);
  const unlock = useDemoSessionStore((s) => s.unlock);
  const signOut = useDemoSessionStore((s) => s.signOut);

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const markReady = () => setReady(true);
    const unsub = useDemoSessionStore.persist.onFinishHydration(markReady);
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
    if (!locked) {
      router.replace(returnPath || "/home");
    }
  }, [ready, authenticated, locked, returnPath, router]);

  const onUnlock = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const entered = password.trim();
    if (!entered) {
      setError("Password is required");
      return;
    }
    if (entered !== DEMO_CREDENTIALS.password) {
      setError("Incorrect password");
      return;
    }
    const next = returnPath && returnPath !== "/lock" ? returnPath : "/home";
    unlock();
    router.replace(next);
  };

  const onLogOut = () => {
    signOut();
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PracticeFusionBrandHeader />

      <main className="mx-auto grid w-full max-w-[1180px] flex-1 grid-cols-1 items-start gap-10 px-6 pb-10 pt-16 md:px-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-10 lg:px-12 lg:pb-12 lg:pt-20">
        <section className="pt-1 lg:max-w-[460px]">
          <div className="mb-6 w-full max-w-[320px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero.svg"
              alt="Practice Fusion Billing"
              className="h-auto w-full"
            />
          </div>

          <h2 className="mb-3 text-[20px] font-bold leading-snug text-[#222]">
            A simpler way for your practice to get paid.
          </h2>
          <p className="mb-5 text-[13px] leading-relaxed text-[#444]">
            Practice Fusion&apos;s integrated billing options connect clinical and financial
            workflows, giving your team clearer visibility, fewer steps, and more control over the
            revenue cycle.
          </p>
          <p className="mb-2 text-[13px] font-semibold text-[#333]">
            Why practices choose our billing options:
          </p>
          <ul className="mb-4 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-[#444]">
            <li>One connected EHR + billing experience</li>
            <li>Real-time claim and payment tracking</li>
            <li>Tools that help reduce administrative overhead</li>
          </ul>
          <p className="mb-4 text-[13px] leading-relaxed text-[#444]">
            See how our billing workflows can save your team time.
          </p>
        </section>

        <SessionAuthCard
          title="Enter your password to unlock the screen"
          email={DEMO_CREDENTIALS.email}
          emailDisabled
          emailTestId="lock-email"
          password={password}
          passwordTestId="lock-password"
          onPasswordChange={setPassword}
          formError={error}
          formErrorTestId="lock-error"
          helpLinkLabel="Need help unlocking?"
          primaryLabel="Unlock"
          primaryTestId="lock-unlock"
          secondaryLabel="Log out"
          secondaryTestId="lock-logout"
          onSecondaryClick={onLogOut}
          onSubmit={onUnlock}
        />
      </main>

      <footer className="mt-auto bg-[#111111] px-4 py-3 text-center text-[11px] text-white/85">
        ©{new Date().getFullYear()} Practice Fusion, Inc. | Site Map | Terms | Privacy Policy |
        System Status
      </footer>
    </div>
  );
}
