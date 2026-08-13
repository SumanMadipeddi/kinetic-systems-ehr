import { cn } from "@/lib/cn";

type SpinnerProps = {
  size?: number;
  className?: string;
  label?: string;
};

/** Practice Fusion–style radial loading spinner. */
export function LoadingSpinner({
  size = 64,
  className,
  label = "Loading",
}: SpinnerProps) {
  return (
    <div
      className={cn("pf-loading-spinner", className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label={label}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          className="pf-loading-spinner__bar"
          style={{
            transform: `rotate(${i * 30}deg) translateY(-38%)`,
            animationDelay: `${(i * -1) / 12}s`,
          }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

type OverlayProps = {
  show: boolean;
  size?: number;
  className?: string;
  label?: string;
};

/** Centered spinner overlay for a relative/absolute parent. */
export function LoadingOverlay({
  show,
  size = 64,
  className,
  label = "Loading",
}: OverlayProps) {
  if (!show) return null;
  return (
    <div
      className={cn(
        "absolute inset-0 z-30 flex items-center justify-center bg-white/70",
        className,
      )}
      aria-busy="true"
    >
      <LoadingSpinner size={size} label={label} />
    </div>
  );
}
