"use client";

import { useState, useRef } from "react";
import {
  useCheckins,
  deleteCheckin,
  clearCheckins,
  getEventConfig,
  saveEventConfig,
} from "@/lib/store";
import Badge from "@/components/Badge";
import { EventConfig, DEFAULT_EVENT_CONFIG } from "@/lib/types";

function useConfig(): [EventConfig, (patch: Partial<EventConfig>) => void] {
  const [config, setConfig] = useState<EventConfig>(() => {
    if (typeof window !== "undefined") return getEventConfig();
    return DEFAULT_EVENT_CONFIG;
  });

  const updateConfig = (patch: Partial<EventConfig>) => {
    const next = { ...config, ...patch };
    setConfig(next);
    saveEventConfig(next);
  };

  return [config, updateConfig];
}

export default function AdminPage() {
  const [config, updateConfig] = useConfig();
  const checkins = useCheckins();
  const [tab, setTab] = useState<"settings" | "checkins" | "print">("settings");
  const [newTag, setNewTag] = useState("");
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !config.availableTags.includes(trimmed)) {
      updateConfig({ availableTags: [...config.availableTags, trimmed] });
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    updateConfig({
      availableTags: config.availableTags.filter((t) => t !== tag),
    });
  };

  const handleDelete = (id: string) => {
    deleteCheckin(id);
  };

  const handleClearAll = () => {
    clearCheckins();
    setShowConfirmClear(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const tabs = [
    { key: "settings" as const, label: "Settings", num: "01" },
    { key: "checkins" as const, label: `Check-Ins (${checkins.length})`, num: "02" },
    { key: "print" as const, label: "Print Badges", num: "03" },
  ];

  return (
    <div className="min-h-dvh bg-paper text-ink">
      {/* Header */}
      <header className="border-b border-rule/10 px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-medium tracking-tight">Event Admin</h1>
          <a
            href="/checkin"
            className="px-4 py-2 bg-lavender text-paper rounded-lg text-sm font-medium hover:bg-lavender-soft transition-colors"
          >
            Open Kiosk →
          </a>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-rule/10">
        <div className="max-w-5xl mx-auto flex">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`group flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? "border-lavender text-ink"
                  : "border-transparent text-ink-muted hover:text-ink-soft"
              }`}
            >
              <span className="text-xs font-mono text-lavender">{t.num}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto p-8">
        {/* Settings Tab */}
        {tab === "settings" && (
          <div className="space-y-8 max-w-2xl">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink-muted uppercase tracking-widest">
                Event Name
              </label>
              <input
                type="text"
                value={config.eventName}
                onChange={(e) => updateConfig({ eventName: e.target.value })}
                className="w-full px-4 py-3.5 bg-white border border-rule/10 rounded-xl text-ink text-base focus:outline-none focus:ring-2 focus:ring-lavender/40 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink-muted uppercase tracking-widest">
                Organizer Question
              </label>
              <textarea
                value={config.organizerQuestion}
                onChange={(e) =>
                  updateConfig({ organizerQuestion: e.target.value })
                }
                rows={2}
                className="w-full px-4 py-3.5 bg-white border border-rule/10 rounded-xl text-ink text-base focus:outline-none focus:ring-2 focus:ring-lavender/40 resize-none transition-all"
              />
              <p className="text-xs text-ink-muted font-light">
                Displayed during check-in with voice input enabled.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink-muted uppercase tracking-widest">
                Auto-Reset Timer (seconds)
              </label>
              <input
                type="number"
                min={5}
                max={120}
                value={config.autoResetSeconds}
                onChange={(e) =>
                  updateConfig({ autoResetSeconds: Math.max(5, Math.min(120, Number(e.target.value) || 15)) })
                }
                className="w-28 px-4 py-3.5 bg-white border border-rule/10 rounded-xl text-ink text-base focus:outline-none focus:ring-2 focus:ring-lavender/40 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink-muted uppercase tracking-widest">
                Badge Size
              </label>
              <div className="flex gap-3">
                {(["standard", "small"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateConfig({ badgeSize: size })}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      config.badgeSize === size
                        ? "bg-lavender text-paper"
                        : "bg-ink/5 text-ink-muted border border-rule/10 hover:bg-ink/10"
                    }`}
                  >
                    {size === "standard" ? 'Standard (4"×3")' : 'Small (3"×2")'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-medium text-ink-muted uppercase tracking-widest">
                Available Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {config.availableTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-ink/5 border border-rule/10 rounded-full text-sm text-ink-soft flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-ink-muted hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  placeholder="Add a tag..."
                  className="flex-1 px-4 py-3 bg-white border border-rule/10 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-lavender/40 transition-all"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-3 bg-lavender text-paper rounded-xl text-sm font-medium hover:bg-lavender-soft transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Check-ins Tab */}
        {tab === "checkins" && (
          <div className="space-y-4">
            {checkins.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-ink-muted text-sm font-light">
                  {checkins.length} attendee{checkins.length !== 1 ? "s" : ""}{" "}
                  checked in
                </p>
                {!showConfirmClear ? (
                  <button
                    onClick={() => setShowConfirmClear(true)}
                    className="text-sm text-red-500 hover:text-red-600 transition-colors font-light"
                  >
                    Clear All
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-red-500 font-light">Are you sure?</span>
                    <button
                      onClick={handleClearAll}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      Yes, Clear
                    </button>
                    <button
                      onClick={() => setShowConfirmClear(false)}
                      className="px-3 py-1 bg-ink/5 text-ink-soft rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {checkins.length === 0 && (
              <p className="text-ink-muted text-center py-16 font-light">
                No check-ins yet. Open the kiosk to start!
              </p>
            )}

            <div className="grid gap-3">
              {checkins.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-rule/10"
                >
                  {c.photoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={c.photoUrl}
                      alt={c.name}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-lavender/10 flex items-center justify-center text-lg font-medium text-lavender shrink-0">
                      {c.name[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-ink tracking-tight truncate">
                      {c.name}
                    </div>
                    <div className="text-sm text-ink-muted font-light truncate">
                      {[c.jobTitle, c.company].filter(Boolean).join(" · ") ||
                        "—"}
                    </div>
                    {c.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {c.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-ink/5 rounded-full text-ink-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-ink-muted font-light shrink-0">
                    {new Date(c.timestamp).toLocaleTimeString()}
                  </div>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-ink-muted hover:text-red-500 transition-colors text-lg shrink-0 p-2"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Print Tab */}
        {tab === "print" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-ink-muted text-sm font-light">
                {checkins.length} badge{checkins.length !== 1 ? "s" : ""} ready
                to print
              </p>
              <button
                onClick={handlePrint}
                disabled={checkins.length === 0}
                className="px-5 py-2.5 bg-lavender text-paper rounded-lg font-medium text-sm hover:bg-lavender-soft disabled:opacity-30 transition-colors"
              >
                Print Badges
              </button>
            </div>

            <div
              ref={printRef}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 print-area"
            >
              {checkins.map((c) => (
                <Badge key={c.id} checkin={c} config={config} />
              ))}
            </div>

            {checkins.length === 0 && (
              <p className="text-ink-muted text-center py-16 font-light">
                No check-ins to print badges for yet.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
