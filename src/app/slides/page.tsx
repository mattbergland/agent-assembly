"use client";

import { useState, useEffect } from "react";
import { useCheckins, getEventConfig } from "@/lib/store";
import { DEFAULT_EVENT_CONFIG } from "@/lib/types";

export default function SlidesPage() {
  const checkins = useCheckins();
  const [config] = useState(() => {
    if (typeof window !== "undefined") return getEventConfig();
    return DEFAULT_EVENT_CONFIG;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (checkins.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % checkins.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [checkins.length]);

  const safeIndex =
    checkins.length > 0 ? currentIndex % checkins.length : 0;

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (checkins.length === 0) {
    return (
      <div className="min-h-dvh bg-paper text-ink flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-medium tracking-tight">{config.eventName}</h1>
          <p className="text-lg text-ink-muted font-light leading-relaxed">
            Waiting for attendees to check in...
          </p>
          <div className="w-8 h-8 border-2 border-lavender border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  const current = checkins[safeIndex];
  if (!current) return null;

  const palettes = [
    "bg-[#8E7DBE]",
    "bg-[#7A9E7E]",
    "bg-[#C4956A]",
    "bg-[#6B8FAD]",
    "bg-[#B07A8F]",
    "bg-[#8B8B78]",
  ];
  const bg = palettes[safeIndex % palettes.length];

  return (
    <div
      className={`min-h-dvh ${bg} text-paper flex flex-col items-center justify-center p-8 md:p-16 relative transition-colors duration-1000`}
    >
      {/* Header */}
      <div className="absolute top-6 left-8 right-8 flex items-center justify-between">
        <span className="text-sm font-light opacity-70">
          {config.eventName}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono opacity-50">
            {safeIndex + 1} / {checkins.length}
          </span>
          <button
            onClick={toggleFullscreen}
            className="text-xs opacity-50 hover:opacity-100 transition-opacity px-3 py-1 rounded bg-white/10"
          >
            {isFullscreen ? "Exit" : "Fullscreen"}
          </button>
        </div>
      </div>

      {/* Slide content */}
      <div
        key={current.id}
        className="flex flex-col items-center text-center space-y-6 animate-slide-in max-w-4xl"
      >
        {current.photoUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={current.photoUrl}
            alt={current.name}
            className="w-40 h-40 md:w-52 md:h-52 rounded-full object-cover ring-4 ring-paper/20 shadow-xl"
          />
        )}

        <h2 className="text-5xl md:text-7xl font-medium tracking-tight leading-tight">
          {current.name}
        </h2>

        {(current.jobTitle || current.company) && (
          <p className="text-xl md:text-2xl font-light opacity-80">
            {[current.jobTitle, current.company].filter(Boolean).join(" · ")}
          </p>
        )}

        {current.description && (
          <blockquote className="text-lg md:text-xl italic font-light opacity-70 max-w-2xl leading-relaxed">
            &ldquo;{current.description}&rdquo;
          </blockquote>
        )}

        {current.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {current.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 bg-paper/10 backdrop-blur rounded-full text-sm font-light"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-8 flex gap-2">
        {checkins.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === safeIndex ? "bg-paper scale-125" : "bg-paper/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
