"use client";

import { CheckIn, EventConfig } from "@/lib/types";

interface BadgeProps {
  checkin: CheckIn;
  config: EventConfig;
}

export default function Badge({ checkin, config }: BadgeProps) {
  const isSmall = config.badgeSize === "small";
  const badgeWidth = isSmall ? "w-[3in]" : "w-[4in]";
  const badgeHeight = isSmall ? "h-[2in]" : "h-[3in]";

  return (
    <div
      className={`${badgeWidth} ${badgeHeight} bg-paper text-ink p-4 flex flex-col items-center justify-center text-center border border-rule/20 print-badge`}
      style={{ pageBreakAfter: "always" }}
    >
      {checkin.photoUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={checkin.photoUrl}
          alt={checkin.name}
          className={`rounded-full object-cover mb-2 ${isSmall ? "w-12 h-12" : "w-16 h-16"}`}
        />
      )}
      <div className={`font-medium tracking-tight ${isSmall ? "text-base" : "text-xl"}`}>
        {checkin.name}
      </div>
      {(checkin.jobTitle || checkin.company) && (
        <div className={`text-ink-muted font-light ${isSmall ? "text-xs" : "text-sm"} mt-0.5`}>
          {[checkin.jobTitle, checkin.company].filter(Boolean).join(" · ")}
        </div>
      )}
      {checkin.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5 justify-center">
          {checkin.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-lavender/10 text-lavender rounded-full text-[10px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="text-[9px] text-ink-muted mt-auto pt-1 font-light">
        {config.eventName}
      </div>
    </div>
  );
}
