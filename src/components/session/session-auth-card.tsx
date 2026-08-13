"use client";

import { Button } from "@/components/ui/button";

const fieldClass =
  "h-11 w-full border border-[#cfcfcf] bg-white px-3 text-[14px] text-[#222] outline-none focus:border-[#0088cc]";
const disabledFieldClass =
  "h-11 w-full border border-[#cfcfcf] bg-[#e8e8e8] px-3 text-[14px] text-[#555]";

type SessionAuthCardProps = {
  title: string;
  hint?: string;
  email: string;
  emailDisabled?: boolean;
  emailTestId?: string;
  emailId?: string;
  onEmailChange?: (value: string) => void;
  password: string;
  passwordTestId?: string;
  passwordId?: string;
  onPasswordChange: (value: string) => void;
  passwordError?: string;
  emailError?: string;
  formError?: string | null;
  formErrorTestId?: string;
  helpLinkLabel?: string;
  primaryLabel: string;
  primaryTestId: string;
  secondaryLabel?: string;
  secondaryTestId?: string;
  onSecondaryClick?: () => void;
  onSubmit: (event: React.FormEvent) => void;
};

export function SessionAuthCard({
  title,
  hint,
  email,
  emailDisabled = false,
  emailTestId,
  emailId,
  onEmailChange,
  password,
  passwordTestId,
  passwordId,
  onPasswordChange,
  passwordError,
  emailError,
  formError,
  formErrorTestId = "session-auth-error",
  helpLinkLabel,
  primaryLabel,
  primaryTestId,
  secondaryLabel,
  secondaryTestId,
  onSecondaryClick,
  onSubmit,
}: SessionAuthCardProps) {
  const hasSecondary = Boolean(secondaryLabel && onSecondaryClick);

  return (
    <section className="w-full border border-[#e2e2e2] bg-[#f3f3f3] p-10 lg:min-h-[420px]">
      <h1 className="mb-3 text-[28px] font-semibold leading-tight tracking-[-0.01em] text-[#1a1a1a] sm:text-[32px]">
        {title}
      </h1>
      {hint ? <p className="mb-6 text-[12px] text-[#666]">{hint}</p> : <div className="mb-5" />}

      <form className="space-y-5" onSubmit={onSubmit}>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] text-[#555]">Email</span>
          <input
            id={emailId}
            type="email"
            value={email}
            disabled={emailDisabled}
            readOnly={emailDisabled}
            onChange={(e) => onEmailChange?.(e.target.value)}
            className={emailDisabled ? disabledFieldClass : fieldClass}
            autoComplete="username"
            data-testid={emailTestId}
          />
          {emailError ? <span className="text-[12px] text-red-600">{emailError}</span> : null}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] text-[#555]">Password</span>
          <input
            id={passwordId}
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className={fieldClass}
            autoComplete="current-password"
            data-testid={passwordTestId}
            autoFocus
          />
          {passwordError ? (
            <span className="text-[12px] text-red-600">{passwordError}</span>
          ) : null}
          {helpLinkLabel ? (
            <div className="flex justify-end pt-0.5">
              <button type="button" className="text-[12px] text-[#0088cc] hover:underline">
                {helpLinkLabel}
              </button>
            </div>
          ) : null}
        </label>

        {formError ? (
          <p className="text-[13px] text-red-600" data-testid={formErrorTestId}>
            {formError}
          </p>
        ) : null}

        <div
          className={
            hasSecondary
              ? "flex items-center justify-between gap-4 pt-4"
              : "flex items-center justify-end gap-4 pt-4"
          }
        >
          {hasSecondary ? (
            <Button
              type="button"
              variant="secondary"
              className="h-11 min-w-[120px] px-6 text-[14px]"
              onClick={onSecondaryClick}
              data-testid={secondaryTestId}
            >
              {secondaryLabel}
            </Button>
          ) : null}
          <Button
            type="submit"
            variant="primary"
            className="h-11 min-w-[120px] bg-[#0088cc] px-6 text-[14px] hover:bg-[#0077b3]"
            data-testid={primaryTestId}
          >
            {primaryLabel}
          </Button>
        </div>
      </form>
    </section>
  );
}
