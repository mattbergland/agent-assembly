import { useState, useMemo } from "react";
import { ToolHeader } from "@/components/Layout";
import {
  venues,
  EVENT_TYPES,
  AREAS,
  type Venue,
  type EventType,
  type Area,
} from "@/venue-directory/venues";
import "../App.css";

export default function VenueDirectory() {
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState<Area | "All">("All");
  const [selectedType, setSelectedType] = useState<EventType | "All">("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return venues.filter((v) => {
      if (selectedArea !== "All" && v.area !== selectedArea) return false;
      if (selectedType !== "All" && !v.eventTypes.includes(selectedType))
        return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          v.name.toLowerCase().includes(q) ||
          v.neighborhood.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, selectedArea, selectedType]);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased flex flex-col">
      <ToolHeader title="Featured Venues" />

      <main className="flex-1 px-4 sm:px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="pt-6 pb-8 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight leading-tight">
              Bay Area Event Venues
            </h1>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed">
              Curated spaces for AI company events — from executive dinners to
              large-format conferences. Vetted by event marketers who sweat the
              details.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <SearchInput value={search} onChange={setSearch} />
            <FilterPill
              label="Area"
              value={selectedArea}
              options={["All", ...AREAS]}
              onChange={(v) => setSelectedArea(v as Area | "All")}
            />
            <FilterPill
              label="Event Type"
              value={selectedType}
              options={["All", ...EVENT_TYPES]}
              onChange={(v) => setSelectedType(v as EventType | "All")}
            />
          </div>

          {/* Count */}
          <p className="text-xs text-ink-muted mb-4">
            {filtered.length} venue{filtered.length !== 1 && "s"}
          </p>

          {/* Venue list */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-ink-muted">
              <p className="text-sm">No venues match your filters.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedArea("All");
                  setSelectedType("All");
                }}
                className="text-xs text-lavender hover:underline mt-2"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  expanded={expandedId === venue.id}
                  onToggle={() =>
                    setExpandedId(expandedId === venue.id ? null : venue.id)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ── Search Input ── */

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative flex-1 max-w-xs">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="Search venues…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-rule/10 rounded-lg focus:outline-none focus:border-lavender/40 placeholder:text-ink-muted/50 transition-colors"
      />
    </div>
  );
}

/* ── Filter Pill ── */

function FilterPill({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 text-sm bg-white border border-rule/10 rounded-lg focus:outline-none focus:border-lavender/40 cursor-pointer transition-colors"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt === "All" ? `${label}: All` : opt}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

/* ── Venue Card ── */

function VenueCard({
  venue,
  expanded,
  onToggle,
}: {
  venue: Venue;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`group rounded-xl border bg-white shadow-sm transition-all duration-300 ${
        expanded
          ? "border-lavender/30 shadow-md"
          : "border-rule/10 hover:border-lavender/20 hover:shadow-md"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-5 sm:p-6"
      >
        {/* Top row: name & area */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-medium tracking-tight text-ink truncate">
              {venue.name}
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">
              {venue.neighborhood}, {venue.area}
            </p>
          </div>
          <PriceIndicator level={venue.priceLevel} />
        </div>

        {/* Capacity & types */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <span className="inline-flex items-center gap-1 text-[11px] text-ink-muted bg-ink/[0.03] px-2 py-0.5 rounded-full">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {venue.capacityMin}–{venue.capacityMax}
          </span>
          {venue.eventTypes.slice(0, 3).map((type) => (
            <span
              key={type}
              className="text-[11px] text-ink-muted bg-ink/[0.03] px-2 py-0.5 rounded-full"
            >
              {type}
            </span>
          ))}
          {venue.eventTypes.length > 3 && (
            <span className="text-[11px] text-ink-muted bg-ink/[0.03] px-2 py-0.5 rounded-full">
              +{venue.eventTypes.length - 3}
            </span>
          )}
        </div>

        {/* Expand indicator */}
        <div className="flex items-center gap-1.5 mt-4 text-xs text-lavender">
          <span>{expanded ? "Less" : "Details"}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-rule/5">
          <p className="text-sm text-ink-muted leading-relaxed mt-4">
            {venue.description}
          </p>

          {/* Highlights */}
          <div className="mt-4">
            <h4 className="text-xs font-medium text-ink mb-2 uppercase tracking-wide">
              Highlights
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {venue.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2 text-xs text-ink-muted"
                >
                  <span className="text-lavender mt-0.5 shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* All event types */}
          <div className="mt-4">
            <h4 className="text-xs font-medium text-ink mb-2 uppercase tracking-wide">
              Event Types
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {venue.eventTypes.map((type) => (
                <span
                  key={type}
                  className="text-[11px] text-lavender bg-lavender/10 px-2 py-0.5 rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Footer: address + link */}
          <div className="mt-5 pt-4 border-t border-rule/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-ink-muted">{venue.address}</p>
            <a
              href={venue.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-lavender hover:underline shrink-0"
            >
              Visit website
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Price Indicator ── */

function PriceIndicator({ level }: { level: number }) {
  return (
    <span className="text-xs text-ink-muted shrink-0" title={`Price level ${level}/4`}>
      {Array.from({ length: 4 }, (_, i) => (
        <span
          key={i}
          className={i < level ? "text-ink" : "text-ink/15"}
        >
          $
        </span>
      ))}
    </span>
  );
}
