import { formatTime12h } from "../utils/calendar";

type Props = {
  hours: string[];
  hourHeight: number;
  /** When false, omit the top spacer (header is rendered outside the scroll body). */
  showHeaderSpacer?: boolean;
};

export function TimeColumn({ hours, hourHeight, showHeaderSpacer = true }: Props) {
  return (
    <div className="w-[var(--pf-time-column-width)] shrink-0 border-r border-[var(--pf-border)] bg-white">
      {showHeaderSpacer ? <div className="h-8 border-b border-[var(--pf-border)]" /> : null}
      <div className="relative">
        {hours.map((hour) => (
          <div
            key={hour}
            className="relative border-b border-[var(--pf-border-light)] pr-1 text-right text-[13px] text-[var(--pf-text-muted)]"
            style={{ height: hourHeight }}
          >
            <span className="absolute right-1 -top-2 bg-white px-0.5">
              {formatTime12h(hour)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
