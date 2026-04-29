"use client";

import { useRef, useState, useEffect } from "react";

interface CameraProps {
  onCapture: (dataUrl: string) => void;
  onCancel: () => void;
}

export default function Camera({ onCapture, onCancel }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        if (!cancelled) {
          setError("Camera access denied. Please allow camera permissions.");
        }
      }
    }
    init();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [facingMode]);

  const handleVideoReady = () => setReady(true);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    ctx.drawImage(video, sx, sy, size, size, 0, 0, 800, 800);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onCapture(dataUrl);
  };

  const flipCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setReady(false);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center gap-6 p-8">
        <div className="text-red-500 text-base text-center font-light">{error}</div>
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-ink/5 border border-rule/10 text-ink-soft rounded-xl text-base font-medium hover:bg-ink/10 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-72 h-72 rounded-full overflow-hidden bg-ink/5 ring-4 ring-lavender/20">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={handleVideoReady}
          className="absolute inset-0 w-full h-full object-cover"
          style={facingMode === "user" ? { transform: "scaleX(-1)" } : undefined}
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-lavender border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-ink/5 border border-rule/10 text-ink-soft rounded-xl text-base font-medium hover:bg-ink/10 active:scale-[0.97] transition-all"
        >
          Cancel
        </button>
        <button
          onClick={flipCamera}
          className="px-5 py-3 bg-ink/5 border border-rule/10 text-ink-soft rounded-xl text-base font-medium hover:bg-ink/10 active:scale-[0.97] transition-all"
          title="Flip camera"
        >
          Flip
        </button>
        <button
          onClick={capture}
          disabled={!ready}
          className="px-8 py-3 bg-lavender text-paper rounded-xl text-base font-medium disabled:opacity-30 hover:bg-lavender-soft active:scale-[0.97] transition-all"
        >
          Take Photo
        </button>
      </div>
    </div>
  );
}
