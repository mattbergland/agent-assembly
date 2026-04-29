"use client";

import { useState, useEffect, useCallback } from "react";
import Camera from "@/components/Camera";
import QrScanner from "@/components/QrScanner";
import VoiceInput from "@/components/VoiceInput";
import TagSelector from "@/components/TagSelector";
import { addCheckin, getEventConfig } from "@/lib/store";
import { DEFAULT_EVENT_CONFIG } from "@/lib/types";

type Step = "welcome" | "photo" | "info" | "done";
type PhotoMode = "choose" | "camera" | "qr";

export default function CheckinPage() {
  const [config] = useState(() => {
    if (typeof window !== "undefined") return getEventConfig();
    return DEFAULT_EVENT_CONFIG;
  });
  const [step, setStep] = useState<Step>("welcome");
  const [photoMode, setPhotoMode] = useState<PhotoMode>("choose");

  const [photoUrl, setPhotoUrl] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [countdown, setCountdown] = useState(0);

  const reset = useCallback(() => {
    setStep("welcome");
    setPhotoMode("choose");
    setPhotoUrl("");
    setName("");
    setCompany("");
    setJobTitle("");
    setDescription("");
    setTags([]);
    setCountdown(0);
  }, []);

  useEffect(() => {
    if (step !== "done") return;
    const total = config.autoResetSeconds;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = total - elapsed;
      if (remaining <= 0) {
        clearInterval(interval);
        reset();
      } else {
        setCountdown(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [step, config.autoResetSeconds, reset]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    addCheckin({
      id: crypto.randomUUID(),
      name: name.trim(),
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      photoUrl,
      description: description.trim(),
      tags,
      timestamp: Date.now(),
    });
    setStep("done");
  };

  const handleQrScan = (url: string) => {
    if (url.includes("linkedin.com")) {
      setPhotoUrl("");
      setDescription((prev) => (prev ? prev : `LinkedIn: ${url}`));
    }
    setPhotoMode("choose");
    setStep("info");
  };

  // Welcome
  if (step === "welcome") {
    return (
      <div className="min-h-dvh bg-paper text-ink flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full text-center space-y-10">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-tight">
              {config.eventName}
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed font-light">
              Tap below to check in
            </p>
          </div>
          <button
            onClick={() => setStep("photo")}
            className="mx-auto block px-14 py-5 bg-lavender hover:bg-lavender-soft text-paper text-xl font-medium rounded-xl active:scale-[0.97] transition-all duration-200"
          >
            Check In
          </button>
        </div>
      </div>
    );
  }

  // Photo
  if (step === "photo") {
    return (
      <div className="min-h-dvh bg-paper text-ink flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full text-center space-y-8">
          <h2 className="text-3xl font-medium tracking-tight">Add Your Photo</h2>

          {photoMode === "choose" && (
            <div className="space-y-6">
              {photoUrl && (
                <div className="flex flex-col items-center gap-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-40 h-40 rounded-full object-cover ring-4 ring-lavender/30"
                  />
                  <button
                    onClick={() => setStep("info")}
                    className="px-10 py-4 bg-lavender text-paper text-lg font-medium rounded-xl active:scale-[0.97] transition-all duration-200"
                  >
                    Use This Photo
                  </button>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setPhotoMode("camera")}
                  className="px-8 py-4 bg-ink/5 border border-rule/10 rounded-xl text-base font-medium text-ink-soft hover:bg-ink/10 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <span className="text-lavender text-sm font-mono">01</span>
                  <span className="h-px w-4 bg-rule/15" />
                  Take Photo
                </button>
                <button
                  onClick={() => setPhotoMode("qr")}
                  className="px-8 py-4 bg-ink/5 border border-rule/10 rounded-xl text-base font-medium text-ink-soft hover:bg-ink/10 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <span className="text-lavender text-sm font-mono">02</span>
                  <span className="h-px w-4 bg-rule/15" />
                  Scan LinkedIn QR
                </button>
              </div>
              <button
                onClick={() => setStep("info")}
                className="text-ink-muted hover:text-ink-soft text-sm font-light transition-colors"
              >
                Skip photo →
              </button>
            </div>
          )}

          {photoMode === "camera" && (
            <Camera
              onCapture={(dataUrl) => {
                setPhotoUrl(dataUrl);
                setPhotoMode("choose");
              }}
              onCancel={() => setPhotoMode("choose")}
            />
          )}

          {photoMode === "qr" && (
            <QrScanner
              onScan={handleQrScan}
              onCancel={() => setPhotoMode("choose")}
            />
          )}
        </div>
      </div>
    );
  }

  // Info
  if (step === "info") {
    return (
      <div className="min-h-dvh bg-paper text-ink flex flex-col items-center p-6 md:p-8 overflow-y-auto">
        <div className="max-w-2xl w-full space-y-6 py-4">
          <div className="flex items-center gap-4">
            {photoUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={photoUrl}
                alt="You"
                className="w-20 h-20 rounded-full object-cover ring-2 ring-lavender/30 shrink-0"
              />
            )}
            <h2 className="text-3xl font-medium tracking-tight">Your Info</h2>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-ink-muted uppercase tracking-widest">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                autoFocus
                className="w-full px-4 py-3.5 bg-white border border-rule/10 rounded-xl text-ink text-base placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-lavender/40 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-ink-muted uppercase tracking-widest">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company name"
                  className="w-full px-4 py-3.5 bg-white border border-rule/10 rounded-xl text-ink text-base placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-lavender/40 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-ink-muted uppercase tracking-widest">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Your role"
                  className="w-full px-4 py-3.5 bg-white border border-rule/10 rounded-xl text-ink text-base placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-lavender/40 transition-all"
                />
              </div>
            </div>

            <VoiceInput
              value={description}
              onChange={setDescription}
              label={config.organizerQuestion}
              placeholder="Type or tap the mic to speak your answer..."
            />

            <TagSelector
              available={config.availableTags}
              selected={tags}
              onChange={setTags}
            />
          </div>

          <div className="flex gap-4 pt-2 pb-8">
            <button
              onClick={() => setStep("photo")}
              className="px-6 py-3.5 bg-ink/5 border border-rule/10 text-ink-soft rounded-xl text-base font-medium hover:bg-ink/10 active:scale-[0.97] transition-all duration-200"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="flex-1 py-3.5 bg-lavender hover:bg-lavender-soft text-paper text-lg font-medium rounded-xl disabled:opacity-30 active:scale-[0.97] transition-all duration-200"
            >
              Check In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Done
  return (
    <div className="min-h-dvh bg-paper text-ink flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight leading-tight">
          Welcome, {name}
        </h2>
        <p className="text-lg text-ink-muted leading-relaxed font-light">
          You&apos;re checked in. Enjoy the event!
        </p>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={reset}
            className="px-14 py-5 bg-lavender hover:bg-lavender-soft text-paper text-xl font-medium rounded-xl active:scale-[0.97] transition-all duration-200"
          >
            Next Person
          </button>
          <p className="text-ink-muted text-sm font-light">
            Auto-resets in {countdown}s
          </p>
        </div>
      </div>
    </div>
  );
}
