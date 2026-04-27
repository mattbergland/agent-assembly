import { useEffect, useRef } from "react";

/* ── Shaders ───────────────────────────────────────────────── */

const VERT = `
attribute vec2 a_position;
attribute float a_size;
attribute float a_opacity;
attribute vec3 a_color;

uniform float u_scale;

varying float v_opacity;
varying vec3 v_color;

void main() {
  v_opacity = a_opacity;
  v_color = a_color;
  gl_Position = vec4(a_position, 0.0, 1.0);
  gl_PointSize = a_size * u_scale;
}
`;

const FRAG = `
precision highp float;

varying float v_opacity;
varying vec3 v_color;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.18, d) * v_opacity;
  gl_FragColor = vec4(v_color, alpha);
}
`;

/* ── Types ─────────────────────────────────────────────────── */

interface Particle {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  phase: number;
  colorR: number;
  colorG: number;
  colorB: number;
}

/* ── Helpers ───────────────────────────────────────────────── */

function gaussRand(): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const INK = [0.067, 0.067, 0.067] as const; // #111
const LAV = [0.557, 0.49, 0.745] as const; // #8E7DBE

function mkParticle(x: number, y: number, sizeMul = 1): Particle {
  const isAccent = Math.random() < 0.15;
  const [r, g, b] = isAccent ? LAV : INK;
  return {
    homeX: x,
    homeY: y,
    x,
    y,
    vx: 0,
    vy: 0,
    size: (Math.random() * 4.0 + 1.8) * sizeMul,
    opacity: isAccent
      ? Math.random() * 0.25 + 0.75
      : Math.random() * 0.35 + 0.6,
    phase: Math.random() * Math.PI * 2,
    colorR: r,
    colorG: g,
    colorB: b,
  };
}

function generateConstellation(count: number): Particle[] {
  const particles: Particle[] = [];

  const rodCount = 9;
  const rodSpacing = 0.022;
  const halfBundle = ((rodCount - 1) * rodSpacing) / 2;
  const rodTop = 0.44;
  const rodBot = -0.46;

  // Rods: 55% of particles — vertical parallel lines
  const rodN = Math.floor(count * 0.55);
  const perRod = Math.floor(rodN / rodCount);
  for (let r = 0; r < rodCount; r++) {
    const rx = (r - (rodCount - 1) / 2) * rodSpacing;
    for (let i = 0; i < perRod; i++) {
      const t = i / (perRod - 1);
      const y = rodBot + t * (rodTop - rodBot);
      const x = rx + gaussRand() * 0.004;
      particles.push(mkParticle(x, y, 0.55 + Math.random() * 0.4));
    }
  }

  // Bindings: 18% — horizontal bands wrapping the bundle
  const bindN = Math.floor(count * 0.18);
  const bandYs = [-0.28, 0.0, 0.28];
  const perBand = Math.floor(bindN / bandYs.length);
  for (const by of bandYs) {
    for (let i = 0; i < perBand; i++) {
      const x = (Math.random() - 0.5) * (halfBundle * 2 + 0.035);
      const y = by + gaussRand() * 0.01;
      particles.push(mkParticle(x, y, 0.5 + Math.random() * 0.35));
    }
  }

  // Axe blade: 17% — crescent protruding from upper-left
  const axeN = Math.floor(count * 0.17);
  for (let i = 0; i < axeN; i++) {
    const t = Math.random();
    const bladeTop = 0.38;
    const bladeBot = -0.02;
    const y = bladeBot + t * (bladeTop - bladeBot);
    const maxW = 0.1;
    const w = maxW * Math.sin(t * Math.PI) * (0.7 + 0.3 * Math.random());
    const x = -halfBundle - 0.012 - w;
    particles.push(mkParticle(x, y, 0.45 + Math.random() * 0.4));
  }

  // Sparse atmospheric particles
  const restN = count - particles.length;
  for (let i = 0; i < restN; i++) {
    const x = (Math.random() - 0.5) * 0.35;
    const y = (Math.random() - 0.5) * 1.1;
    particles.push(mkParticle(x, y, 0.2));
  }

  return particles;
}

/* ── GL helpers ────────────────────────────────────────────── */

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

/* ── Component ─────────────────────────────────────────────── */

const PARTICLE_COUNT = 900;
const DISPERSE_RADIUS = 0.32;
const DISPERSE_FORCE = 0.045;
const SPRING = 0.012;
const DAMPING = 0.95;
const DRIFT = 0.00004;

export default function OrbConstellation({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    // Compile program
    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Locations
    const aPos = gl.getAttribLocation(prog, "a_position");
    const aSize = gl.getAttribLocation(prog, "a_size");
    const aOpacity = gl.getAttribLocation(prog, "a_opacity");
    const aColor = gl.getAttribLocation(prog, "a_color");
    const uScale = gl.getUniformLocation(prog, "u_scale");

    // Blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Particles
    const particles = generateConstellation(PARTICLE_COUNT);
    const N = particles.length;

    // Buffers
    const posBuf = gl.createBuffer()!;
    const sizeBuf = gl.createBuffer()!;
    const opBuf = gl.createBuffer()!;
    const colBuf = gl.createBuffer()!;

    const posArr = new Float32Array(N * 2);
    const sizeArr = new Float32Array(N);
    const opArr = new Float32Array(N);
    const colArr = new Float32Array(N * 3);

    for (let i = 0; i < N; i++) {
      const p = particles[i];
      sizeArr[i] = p.size;
      opArr[i] = p.opacity;
      colArr[i * 3] = p.colorR;
      colArr[i * 3 + 1] = p.colorG;
      colArr[i * 3 + 2] = p.colorB;
    }

    // Upload static buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, sizeArr, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, opBuf);
    gl.bufferData(gl.ARRAY_BUFFER, opArr, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
    gl.bufferData(gl.ARRAY_BUFFER, colArr, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, posArr, gl.DYNAMIC_DRAW);

    // Mouse
    const mouse = { x: -9999, y: -9999, active: false };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);

    // Resize
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uScale, dpr * Math.min(r.width, r.height) / 115);
    };

    // Reduced motion check
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Render loop
    let raf = 0;
    let t = 0;

    const tick = () => {
      t += 0.003;

      for (let i = 0; i < N; i++) {
        const p = particles[i];

        // Ambient drift
        p.vx += Math.sin(t + p.phase) * DRIFT;
        p.vy += Math.cos(t * 0.85 + p.phase) * DRIFT;

        // Spring to home
        p.vx += (p.homeX - p.x) * SPRING;
        p.vy += (p.homeY - p.y) * SPRING;

        // Cursor dispersion
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < DISPERSE_RADIUS) {
            const f =
              Math.pow(1 - dist / DISPERSE_RADIUS, 2) * DISPERSE_FORCE;
            const nx = dist > 0.001 ? dx / dist : Math.random() - 0.5;
            const ny = dist > 0.001 ? dy / dist : Math.random() - 0.5;
            p.vx += nx * f;
            p.vy += ny * f;
          }
        }

        // Damping
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        // Integrate
        p.x += p.vx;
        p.y += p.vy;

        posArr[i * 2] = p.x;
        posArr[i * 2 + 1] = p.y;
      }

      // Clear
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Upload positions
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, posArr);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
      gl.enableVertexAttribArray(aSize);
      gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, opBuf);
      gl.enableVertexAttribArray(aOpacity);
      gl.vertexAttribPointer(aOpacity, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
      gl.enableVertexAttribArray(aColor);
      gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);

      // Draw
      gl.drawArrays(gl.POINTS, 0, N);

      if (!prefersReduced) {
        raf = requestAnimationFrame(tick);
      }
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (prefersReduced) tick();
    });
    ro.observe(canvas);
    resize();

    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ touchAction: "none" }}
      aria-hidden="true"
    />
  );
}
