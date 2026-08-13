"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Info,
  RefreshCw,
  Search,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterDropdown } from "@/features/messages/components/filter-dropdown";
import { NewMessageModal } from "@/features/messages/components/new-message-modal";
import { TaskModal } from "@/features/tasks/components/task-modal";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/cn";

type MessageTab = "Inbox" | "Sent" | "Archive" | "Referrals";

const TABS: MessageTab[] = ["Inbox", "Sent", "Archive", "Referrals"];

const SHOW_ALL_OPTIONS = [
  { value: "all", label: "Show all" },
  { value: "urgent", label: "Urgent" },
  { value: "non-urgent", label: "Non urgent" },
  { value: "private", label: "Private" },
  { value: "shared", label: "Shared" },
  { value: "referrals", label: "Referrals" },
];

const REFERRAL_DIRECTION_OPTIONS = [
  { value: "outgoing", label: "Outgoing" },
  { value: "incoming", label: "Incoming" },
  { value: "archived", label: "Archived" },
  { value: "outgoing-alt", label: "Outgoing" },
  { value: "archived-alt", label: "Archived" },
  { value: "incoming-alt", label: "Incoming" },
];

const PROVIDER_OPTIONS = [
  { value: "all", label: "All providers" },
  { value: "suman-ma", label: "suman Ma" },
  { value: "suman-madipeddi", label: "Suman Madipeddi" },
];

const LIST_COLUMNS: Record<
  Exclude<MessageTab, "Referrals">,
  { key: string; label: string; showCheckbox?: boolean }[]
> = {
  Inbox: [
    { key: "check", label: "", showCheckbox: true },
    { key: "from", label: "From" },
    { key: "patient", label: "Patient" },
    { key: "received", label: "Received" },
  ],
  Sent: [
    { key: "check", label: "", showCheckbox: true },
    { key: "to", label: "To" },
    { key: "patient", label: "Patient" },
    { key: "sent", label: "Sent" },
  ],
  Archive: [
    { key: "from", label: "From" },
    { key: "patient", label: "Patient" },
    { key: "archived", label: "Archived" },
  ],
};

function ShortcutKeys({ keys }: { keys: string[] }) {
  return (
    <span className="ml-6 inline-flex items-center gap-1 text-[11px] text-[#555]">
      {keys.map((key, idx) => (
        <span key={`${key}-${idx}`} className="inline-flex items-center gap-1">
          {idx > 0 ? <span className="text-[#777]">+</span> : null}
          <kbd className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[3px] border border-[#d8d8d8] bg-[#f3f3f3] px-1 font-sans text-[11px] text-[#444] shadow-[0_1px_0_#d0d0d0]">
            {key}
          </kbd>
        </span>
      ))}
    </span>
  );
}

export default function MessagesPage() {
  const router = useRouter();
  const showToast = useUiStore((s) => s.showToast);
  const [activeTab, setActiveTab] = useState<MessageTab>("Inbox");
  const [actionsOpen, setActionsOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const pendingKeyRef = useRef<string | null>(null);
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!actionsOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!actionsRef.current?.contains(event.target as Node)) {
        setActionsOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [actionsOpen]);

  useEffect(() => {
    const clearPending = () => {
      pendingKeyRef.current = null;
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (messageModalOpen || taskModalOpen) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable) {
        return;
      }

      const key = event.key.toLowerCase();
      if (pendingKeyRef.current === "n") {
        if (key === "m") {
          event.preventDefault();
          clearPending();
          setMessageModalOpen(true);
          return;
        }
        if (key === "t") {
          event.preventDefault();
          clearPending();
          setTaskModalOpen(true);
          return;
        }
        clearPending();
      }

      if (key === "n" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        pendingKeyRef.current = "n";
        if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = setTimeout(clearPending, 1000);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearPending();
    };
  }, [messageModalOpen, taskModalOpen]);

  const openNewMessage = () => {
    setActionsOpen(false);
    setMessageModalOpen(true);
  };

  const isReferrals = activeTab === "Referrals";

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <div className="bg-[var(--pf-primary)]">
        <div className="flex min-h-[64px] items-center justify-between px-4">
          <h1 className="text-[var(--pf-font-lg)] font-normal text-white">Messages</h1>
          <div className="relative" ref={actionsRef}>
            <Button
              variant="ghost"
              className="border border-white bg-transparent text-white hover:bg-white/10"
              aria-haspopup="menu"
              aria-expanded={actionsOpen}
              onClick={() => setActionsOpen((v) => !v)}
            >
              Actions
              <ChevronDown size={14} />
            </Button>
            {actionsOpen ? (
              <div
                className="absolute right-0 top-full z-50 mt-0 min-w-[280px] border border-[#b7d7ea] bg-white py-1 text-[13px] text-[#222] shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
                role="menu"
                aria-label="Message actions"
              >
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-[#f3f9fc]"
                  onClick={openNewMessage}
                >
                  <span>New message</span>
                  <ShortcutKeys keys={["N", "M"]} />
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-[#f3f9fc]"
                  onClick={() => {
                    setActionsOpen(false);
                    setTaskModalOpen(true);
                  }}
                >
                  <span>Create task</span>
                  <ShortcutKeys keys={["N", "T"]} />
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full px-3 py-2 text-left hover:bg-[#f3f9fc]"
                  onClick={() => {
                    setActionsOpen(false);
                    showToast("Set up direct messaging is a placeholder.", "info");
                  }}
                >
                  Set up direct messaging
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-[6px] px-2 pb-0">
          {TABS.map((tab) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                className={cn(
                  "inline-flex h-[28px] items-center px-3 text-[12px]",
                  active
                    ? "bg-white text-[var(--pf-text)]"
                    : "bg-[var(--pf-primary-dark)] text-white hover:brightness-110",
                )}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {isReferrals ? (
        <ReferralsToolbar onAction={(msg) => showToast(msg, "info")} />
      ) : (
        <MessageListToolbar
          onRefresh={() => showToast("Messages refreshed.", "info")}
          onSettings={() => router.push("/messages/settings")}
          onNewMessage={openNewMessage}
        />
      )}

      <div className="min-h-0 flex-1 overflow-hidden border-t border-[var(--pf-border)]">
        {isReferrals ? <ReferralsTable /> : <MessageSplitPane tab={activeTab} />}
      </div>

      <NewMessageModal open={messageModalOpen} onClose={() => setMessageModalOpen(false)} />
      <TaskModal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} />
    </div>
  );
}

function MessageListToolbar({
  onRefresh,
  onSettings,
  onNewMessage,
}: {
  onRefresh: () => void;
  onSettings: () => void;
  onNewMessage: () => void;
}) {
  const [filter, setFilter] = useState("all");

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-[var(--pf-border)] bg-white px-3 py-2">
      <button
        type="button"
        aria-label="Refresh"
        className="inline-flex h-8 w-8 items-center justify-center border border-[var(--pf-primary)] text-[var(--pf-primary-dark)] hover:bg-[#f5fbfe]"
        onClick={onRefresh}
      >
        <RefreshCw size={15} />
      </button>
      <FilterDropdown
        value={filter}
        options={SHOW_ALL_OPTIONS}
        onChange={setFilter}
        ariaLabel="Filter messages"
        className="min-w-[120px]"
        menuClassName="min-w-[140px]"
      />
      <button
        type="button"
        className="inline-flex items-center gap-1.5 text-[12px] text-[var(--pf-link)] hover:underline"
        onClick={onSettings}
      >
        <Settings size={14} className="text-[var(--pf-primary-dark)]" />
        Message settings
      </button>
      <div className="flex-1" />
      <Button variant="orange" className="rounded-[3px] px-4" onClick={onNewMessage}>
        New message
      </Button>
    </div>
  );
}

function ReferralsToolbar({ onAction }: { onAction: (message: string) => void }) {
  const [direction, setDirection] = useState("outgoing");
  const [provider, setProvider] = useState("all");

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-[var(--pf-border)] bg-white px-3 py-2">
      <button
        type="button"
        aria-label="Refresh"
        className="inline-flex h-8 w-8 items-center justify-center border border-[var(--pf-primary)] text-[var(--pf-primary-dark)] hover:bg-[#f5fbfe]"
        onClick={() => onAction("Referrals refreshed.")}
      >
        <RefreshCw size={15} />
      </button>
      <FilterDropdown
        value={direction}
        options={REFERRAL_DIRECTION_OPTIONS}
        onChange={setDirection}
        ariaLabel="Referral direction"
        className="min-w-[110px]"
      />
      <FilterDropdown
        value={provider}
        options={PROVIDER_OPTIONS}
        onChange={setProvider}
        ariaLabel="Provider filter"
        className="min-w-[130px]"
        menuClassName="min-w-[160px]"
      />
      <div className="relative">
        <input
          className="h-8 w-[220px] border border-[var(--pf-border)] px-2 pr-8 text-[12px] outline-none focus:border-[var(--pf-primary)]"
          placeholder="Search patient name, re..."
          aria-label="Search referrals"
        />
        <Search
          size={14}
          className="pointer-events-none absolute right-2 top-2 text-[var(--pf-text-muted)]"
        />
      </div>
      <div className="flex-1" />
      <Button
        variant="orange"
        className="rounded-[3px] px-4"
        onClick={() => onAction("Send a referral is a placeholder.")}
      >
        Send a referral
      </Button>
    </div>
  );
}

function MessageSplitPane({ tab }: { tab: Exclude<MessageTab, "Referrals"> }) {
  const columns = LIST_COLUMNS[tab];
  const gridClass =
    tab === "Archive"
      ? "grid-cols-3"
      : "grid-cols-[32px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]";

  return (
    <div className="flex h-full min-h-0">
      <div className="flex min-w-0 flex-1 flex-col border-r-2 border-[var(--pf-primary)]">
        <div
          className={cn(
            "grid items-center gap-2 border-b border-[var(--pf-border)] bg-[var(--pf-table-header)] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#555]",
            gridClass,
          )}
        >
          {columns.map((col) =>
            col.showCheckbox ? (
              <span key={col.key} className="inline-flex justify-center">
                <input
                  type="checkbox"
                  aria-label="Select all"
                  className="pf-filter-check h-4 w-4"
                />
              </span>
            ) : (
              <span key={col.key}>{col.label}</span>
            ),
          )}
        </div>
        <div className="min-h-0 flex-1 bg-white" />
      </div>
      <div className="flex min-w-0 flex-1 bg-white px-4 pt-4">
        <p className="text-[13px] text-[var(--pf-text)]">Click a message to show it here.</p>
      </div>
    </div>
  );
}

function ReferralsTable() {
  return (
    <div className="h-full overflow-auto">
      <table className="w-full border-collapse text-[12px]">
        <thead className="bg-[var(--pf-table-header)]">
          <tr className="border-b border-[var(--pf-border)] text-left text-[11px] font-semibold uppercase tracking-wide text-[#555]">
            <th className="px-3 py-2 font-semibold">First</th>
            <th className="px-3 py-2 font-semibold">Last</th>
            <th className="px-3 py-2 font-semibold">Referral to</th>
            <th className="px-3 py-2 font-semibold">Referral from</th>
            <th className="px-3 py-2 font-semibold">
              <span className="inline-flex items-center gap-1">
                Date
                <ChevronDown size={12} className="text-[#333]" />
              </span>
            </th>
            <th className="px-3 py-2 font-semibold">Status</th>
            <th className="px-3 py-2 font-semibold">
              <span className="inline-flex items-center gap-1">
                Receipt
                <Info size={12} className="text-[var(--pf-text-muted)]" />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={7} className="h-24 bg-white" />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
