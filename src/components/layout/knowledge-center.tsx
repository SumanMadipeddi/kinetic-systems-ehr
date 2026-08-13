"use client";

import { useEffect, useRef, useState } from "react";
import {
  Flag,
  FileText,
  LayoutGrid,
  Link2,
  Search,
  Expand,
  Shrink,
} from "lucide-react";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/cn";

const LINKS = [
  { icon: Flag, label: "Learn how to navigate the EHR" },
  { icon: Flag, label: "Start your subscription" },
  { icon: Flag, label: "Hear from Dr. Sadel" },
  { icon: Flag, label: "Learn more about billing options" },
  {
    icon: FileText,
    label: "How do I get started?",
    detail:
      "Review this article to learn how to use Practice Fusion after being added as a user to a new or existing practice.",
    featured: true,
  },
  { icon: LayoutGrid, label: "Veradigm Programs" },
  { icon: Link2, label: "Knowledge Base" },
] as const;

const NORMAL_WIDTH = 400;
const EXPANDED_WIDTH = Math.round(NORMAL_WIDTH * 1.5); // +50%
const NORMAL_LIST_MAX = 320;
const EXPANDED_LIST_MAX = Math.round(NORMAL_LIST_MAX * 0.8); // -20%
const NORMAL_FOOTER = 127;
const EXPANDED_FOOTER = Math.round(NORMAL_FOOTER * 0.8); // -20%

export function KnowledgeCenter() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const showToast = useUiStore((s) => s.showToast);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== "apt-widget-toggle") return;
      const nextOpen = Boolean(event.data.open);
      setOpen(nextOpen);
      if (!nextOpen) setExpanded(false);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "apt-widget-state", open },
      "*",
    );
  }, [open]);

  const cardWidth = expanded ? EXPANDED_WIDTH : NORMAL_WIDTH;
  const listMax = expanded ? EXPANDED_LIST_MAX : NORMAL_LIST_MAX;
  const footerHeight = expanded ? EXPANDED_FOOTER : NORMAL_FOOTER;

  return (
    <div className="pointer-events-none fixed bottom-5 right-6 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div
          className="pointer-events-auto mr-16 flex flex-col overflow-hidden overflow-x-hidden rounded-lg border border-[var(--pf-border-light)] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
          style={{ width: cardWidth }}
          role="dialog"
          aria-label="Knowledge Center"
        >
          <div className="flex h-[50px] w-full items-center gap-2 bg-[#14a4ec] pb-0 pl-[14px] pr-[25px] pt-0 text-white">
            <button
              type="button"
              aria-label={expanded ? "Minimize Knowledge Center" : "Expand Knowledge Center"}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded text-white hover:bg-white/15"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? (
                <Shrink size={16} strokeWidth={2.25} />
              ) : (
                <Expand size={16} strokeWidth={2.25} />
              )}
            </button>
            <span className="text-[15px] font-normal">Knowledge Center</span>
          </div>

          <div className="flex h-[50px] w-full items-center px-[25px]">
            <label className="relative block w-full">
              <span className="sr-only">Search the Knowledge Base</span>
              <input
                type="search"
                placeholder="Search the Knowledge Base..."
                className="h-9 w-full rounded-full border border-[#ccc] bg-white py-1 pl-3 pr-9 text-[12px] text-[var(--pf-text)] outline-none focus:border-[#14a4ec]"
              />
              <Search
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#999]"
              />
            </label>
          </div>

          <ul
            className={cn(
              "overflow-x-hidden border-t border-[var(--pf-border-light)]",
              expanded ? "overflow-y-auto" : "overflow-y-visible",
            )}
            style={expanded ? { maxHeight: listMax } : undefined}
          >
            {LINKS.map((item) => {
              const Icon = item.icon;
              const featured = "featured" in item && item.featured;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full gap-3 px-[25px] py-[10px] text-left hover:bg-[#f7f7f7]",
                      featured ? "min-h-[80px] items-start" : "items-center",
                    )}
                    onClick={() =>
                      showToast("This Knowledge Center article is unavailable.", "info")
                    }
                  >
                    <Icon size={18} className="mt-0.5 shrink-0 text-[#777]" />
                    <span className="min-w-0">
                      <span
                        className={
                          featured
                            ? "block text-[14px] text-[#14a4ec]"
                            : "block text-[13px] text-[var(--pf-text)]"
                        }
                      >
                        {item.label}
                      </span>
                      {"detail" in item && item.detail ? (
                        <span className="mt-1 block text-[12px] leading-snug text-[#777]">
                          {item.detail}
                        </span>
                      ) : null}
                    </span>
                  </button>
                  <div className="mx-[25px] border-b border-[var(--pf-border-light)]" />
                </li>
              );
            })}
          </ul>

          <div
            className="flex w-full flex-col items-center justify-center gap-3 bg-[#e8f6fc] px-[25px] py-[10px]"
            style={{ height: footerHeight }}
          >
            <p className="text-center text-[15px] font-semibold text-[#2a6a8a]">
              Ready to tour your new EHR?
            </p>
            <button
              type="button"
              className="h-10 min-w-[170px] rounded-full bg-[var(--pf-orange)] px-6 text-[13px] font-semibold text-white"
              onClick={() =>
                showToast("Demo scheduling is unavailable.", "info")
              }
            >
              Schedule a demo
            </button>
          </div>
        </div>
      ) : null}

      <iframe
        ref={iframeRef}
        title="Knowledge Center"
        src="/apt-widget-icon.html"
        className="pointer-events-auto h-[58px] w-[58px] rounded-full border-0 shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
        scrolling="no"
      />
    </div>
  );
}
