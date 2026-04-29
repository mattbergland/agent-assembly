"use client";

import { useEffect, useRef, useState } from "react";

interface QrScannerProps {
  onScan: (url: string) => void;
  onCancel: () => void;
}

export default function QrScanner({ onScan, onCancel }: QrScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const onScanRef = useRef(onScan);
  useEffect(() => { onScanRef.current = onScan; }, [onScan]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!mounted || !containerRef.current) return;

        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 300, height: 300 } },
          (decodedText) => {
            scanner.stop().catch(() => {});
            onScanRef.current(decodedText);
          },
          () => {}
        );
      } catch {
        if (mounted) setError("Could not access camera for QR scanning.");
      }
    }

    startScanner();

    return () => {
      mounted = false;
      scannerRef.current?.stop().catch(() => {});
    };
  }, []);

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
      <p className="text-ink-muted text-base text-center font-light">
        Point at a LinkedIn QR code to scan
      </p>
      <div
        ref={containerRef}
        id="qr-reader"
        className="w-72 h-72 rounded-xl overflow-hidden bg-ink/5 border border-rule/10"
      />
      <button
        onClick={() => {
          scannerRef.current?.stop().catch(() => {});
          onCancel();
        }}
        className="px-6 py-3 bg-ink/5 border border-rule/10 text-ink-soft rounded-xl text-base font-medium hover:bg-ink/10 active:scale-[0.97] transition-all"
      >
        Cancel
      </button>
    </div>
  );
}
