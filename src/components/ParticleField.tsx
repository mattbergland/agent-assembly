import { useEffect, useRef } from "react";

type Gradient =
  | "top-right"
  | "bottom-up"
  | "diffuse"
  | "transition"
  | "left-fade"
  | "corner-top-left"
  | "radial-center";

interface ParticleFieldProps {
  gradient?: Gradient;
  count?: number;
  color?: string;
  className?: string;
  interactive?: boolean;
  maxSize?: number;
  minOpacity?: number;
  maxOpacity?: number;
  repelRadius?: number;
  repelStrength?: number;
  drift?: number;
}

const densityFns: Record<Gradient, (x: number, y: number) => number> = {
  // x in [0,1] left->right, y in [0,1] top->bottom
  "top-right": (x, y) => Math.pow(x, 1.6) * Math.pow(1 - y, 1.6),
  "bottom-up": (x, y) => {
    const band = 0.6 + 0.4 * Math.sin(x * Math.PI);
    return Math.pow(y, 2.2) * band;
  },
  diffuse: () => 0.35,
  transition: (x, y) => {
    const v = Math.sin(y * Math.PI);
    const h = 0.7 + 0.3 * Math.sin(x * Math.PI * 1.2);
    return Math.pow(v, 1.4) * h * 0.8;
  },
  "left-fade": (x) => Math.pow(1 - x, 1.4),
  "corner-top-left": (x, y) => Math.pow(1 - x, 1.6) * Math.pow(1 - y, 1.6),
  "radial-center": (x, y) => {
    const dx = x - 0.5;
    const dy = y - 0.5;
    const d = Math.sqrt(dx * dx + dy * dy);
    return Math.max(0, 1 - d * 1.8);
  },
};

export default function ParticleField({
  gradient = "top-right",
  count = 500,
  color = "#111111",
  className = "",
  interactive = true,
  maxSize = 1.6,
  minOpacity = 0.2,
  maxOpacity = 0.75,
  repelRadius = 80,
  repelStrength = 1.4,
  drift = 0.06,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const densityFn = densityFns[gradient];
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;

    type Particle = {
      ox: number;
      oy: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
      phase: number;
    };
    const particles: Particle[] = [];

    const seed = () => {
      particles.length = 0;
      if (width <= 0 || height <= 0) return;
      const target = count;
      let attempts = 0;
      const maxAttempts = target * 30;
      while (particles.length < target && attempts < maxAttempts) {
        attempts++;
        const x = Math.random() * width;
        const y = Math.random() * height;
        const nx = x / width;
        const ny = y / height;
        const p = densityFn(nx, ny);
        if (Math.random() < p) {
          particles.push({
            ox: x,
            oy: y,
            x,
            y,
            vx: 0,
            vy: 0,
            r: Math.random() * maxSize + 0.4,
            alpha:
              minOpacity + Math.random() * Math.max(0, maxOpacity - minOpacity),
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const mouse = { x: -9999, y: -9999, active: false };

    const handleMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const handleLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    if (interactive) {
      window.addEventListener("pointermove", handleMove, { passive: true });
      window.addEventListener("pointerleave", handleLeave);
    }

    let raf = 0;
    let t = 0;

    const tick = () => {
      t += 0.004;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // slow sine-based drift around origin
        const dX = Math.sin(t + p.phase) * drift;
        const dY = Math.cos(t * 0.9 + p.phase) * drift;
        p.vx += dX;
        p.vy += dY;

        // spring toward origin
        p.vx += (p.ox - p.x) * 0.012;
        p.vy += (p.oy - p.y) * 0.012;

        // cursor repel
        if (interactive && mouse.active) {
          const ddx = p.x - mouse.x;
          const ddy = p.y - mouse.y;
          const dist2 = ddx * ddx + ddy * ddy;
          const R = repelRadius;
          if (dist2 < R * R) {
            const dist = Math.sqrt(dist2) || 0.0001;
            const f = (1 - dist / R) * repelStrength;
            p.vx += (ddx / dist) * f;
            p.vy += (ddy / dist) * f;
          }
        }

        // damping
        p.vx *= 0.9;
        p.vy *= 0.9;

        p.x += p.vx;
        p.y += p.vy;

        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!reduceMotion) {
        raf = requestAnimationFrame(tick);
      }
    };

    resize();
    // paint one frame even if reduced motion
    tick();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) tick();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (interactive) {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerleave", handleLeave);
      }
    };
  }, [
    gradient,
    count,
    color,
    interactive,
    maxSize,
    minOpacity,
    maxOpacity,
    repelRadius,
    repelStrength,
    drift,
  ]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
