"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_CREDENTIALS } from "@/config/demo-credentials";
import { useDemoSessionStore } from "@/store/demo-session-store";
import { PracticeFusionBrandHeader } from "@/components/brand/practice-fusion-brand-header";
import { SessionAuthCard } from "@/components/session/session-auth-card";

export default function LoginPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const authenticated = useDemoSessionStore((s) => s.authenticated);
  const locked = useDemoSessionStore((s) => s.locked);
  const signIn = useDemoSessionStore((s) => s.signIn);

  const [email, setEmail] = useState<string>(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);

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
    if (authenticated && !locked) {
      router.replace("/home");
    }
  }, [ready, authenticated, locked, router]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setEmailError(undefined);
    setPasswordError(undefined);

    const trimmedEmail = email.trim();
    let valid = true;
    if (!trimmedEmail) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError("Enter a valid email");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }
    if (!valid) return;

    if (
      trimmedEmail.toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase() &&
      password === DEMO_CREDENTIALS.password
    ) {
      signIn();
      router.replace("/home");
      return;
    }
    setFormError("Invalid email or password");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PracticeFusionBrandHeader />

      <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-center px-4 py-10">
        <SessionAuthCard
          title="Sign in"
          hint={`Demo credentials: ${DEMO_CREDENTIALS.email} / ${DEMO_CREDENTIALS.password}`}
          email={email}
          emailId="login-email"
          emailTestId="login-email"
          onEmailChange={setEmail}
          password={password}
          passwordId="login-password"
          passwordTestId="login-password"
          onPasswordChange={setPassword}
          emailError={emailError}
          passwordError={passwordError}
          formError={formError}
          formErrorTestId="login-error"
          primaryLabel="Sign in"
          primaryTestId="login-submit"
          onSubmit={onSubmit}
        />
      </main>

      <footer className="mt-auto bg-[#111111] px-4 py-3 text-center text-[11px] text-white/85">
        ©{new Date().getFullYear()} Practice Fusion, Inc. | Site Map | Terms | Privacy Policy |
        System Status
      </footer>
    </div>
  );
}
