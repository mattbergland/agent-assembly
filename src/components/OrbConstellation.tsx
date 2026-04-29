import { useEffect, useRef } from "react";

/* ── Shaders ───────────────────────────────────────────────── */

const VERT = `
attribute vec2 a_position;
attribute float a_size;
attribute float a_opacity;
attribute vec3 a_color;

uniform float u_scale;
uniform float u_aspect;
uniform float u_offsetX;
uniform float u_vertScale;

varying float v_opacity;
varying vec3 v_color;

void main() {
  v_opacity = a_opacity;
  v_color = a_color;
  gl_Position = vec4(
    a_position.x / u_aspect * u_vertScale + u_offsetX,
    a_position.y * u_vertScale,
    0.0, 1.0
  );
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

// Region color palette (from 3D reference model)
const WOOD = [0.24, 0.17, 0.12] as const;      // dark walnut rods
const WOOD_LT = [0.30, 0.22, 0.15] as const;   // lighter wood highlights
const LEATHER = [0.58, 0.36, 0.22] as const;   // warm leather straps
const LEATHER_DK = [0.48, 0.28, 0.16] as const; // darker leather
const METAL = [0.52, 0.52, 0.44] as const;     // patinated axe blade
const METAL_DK = [0.42, 0.43, 0.36] as const;  // darker metal edge
const IRON = [0.18, 0.14, 0.10] as const;      // dark iron pole

type Rgb = readonly [number, number, number];

function lerpColor(a: Rgb, b: Rgb, t: number): Rgb {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function mkParticle(
  x: number,
  y: number,
  sizeMul: number,
  baseColor: Rgb,
  altColor?: Rgb,
): Particle {
  const t = altColor ? Math.random() : 0;
  const [r, g, b] = altColor ? lerpColor(baseColor, altColor, t) : baseColor;
  return {
    homeX: x,
    homeY: y,
    x,
    y,
    vx: 0,
    vy: 0,
    size: (Math.random() * 4.0 + 1.8) * sizeMul,
    opacity: Math.random() * 0.3 + 0.7,
    phase: Math.random() * Math.PI * 2,
    colorR: r,
    colorG: g,
    colorB: b,
  };
}

function generateConstellation(count: number): Particle[] {
  const particles: Particle[] = [];

  // Scale factor — fills most of the viewport height
  const S = 1.6;

  // Bundle dimensions (matched to 3D reference model)
  const bundleRadius = 0.065 * S;
  const rodTop = 0.42 * S;
  const rodBot = -0.44 * S;

  // Rod centers: hexagonal packing (~13 rods)
  const rodCenters: [number, number][] = [];
  const rodR = 0.018 * S;
  rodCenters.push([0, 0]);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    rodCenters.push([Math.cos(a) * rodR * 2, Math.sin(a) * rodR * 2]);
  }
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    rodCenters.push([Math.cos(a) * rodR * 3.6, Math.sin(a) * rodR * 3.6]);
  }

  // Rods: 42% — dark wood colored
  const rodN = Math.floor(count * 0.42);
  const perRod = Math.floor(rodN / rodCenters.length);
  for (const [cx, cy] of rodCenters) {
    for (let i = 0; i < perRod; i++) {
      const t = i / (perRod - 1);
      const y = rodBot + t * (rodTop - rodBot);
      const x = cx + gaussRand() * 0.003 * S;
      const yJitter = cy * 0.15;
      particles.push(
        mkParticle(x, y + yJitter, 0.55 + Math.random() * 0.4, WOOD, WOOD_LT),
      );
    }
  }

  // Central pole: 5% — dark iron
  const poleN = Math.floor(count * 0.05);
  const poleTop = 0.54 * S;
  const poleBot = -0.56 * S;
  for (let i = 0; i < poleN; i++) {
    const t = Math.random();
    const y = poleBot + t * (poleTop - poleBot);
    const x = gaussRand() * 0.003 * S;
    particles.push(mkParticle(x, y, 0.3 + Math.random() * 0.3, IRON));
  }

  // Spiral leather binding: 18% — continuous helix wrapping the bundle
  const bindN = Math.floor(count * 0.18);
  const helixTurns = 5;
  const helixTop = rodTop - 0.04 * S;
  const helixBot = rodBot + 0.04 * S;
  for (let i = 0; i < bindN; i++) {
    const t = Math.random();
    const y = helixBot + t * (helixTop - helixBot);
    const angle = t * helixTurns * Math.PI * 2;
    const strapW = bundleRadius + 0.012 * S;
    const x = Math.sin(angle) * strapW + gaussRand() * 0.006 * S;
    particles.push(
      mkParticle(x, y, 0.5 + Math.random() * 0.35, LEATHER, LEATHER_DK),
    );
  }

  // Top and bottom cap bands: 4% — leather colored
  const capN = Math.floor(count * 0.04);
  const capYs = [rodTop - 0.01 * S, rodBot + 0.01 * S];
  const perCap = Math.floor(capN / capYs.length);
  for (const cy of capYs) {
    for (let i = 0; i < perCap; i++) {
      const x = (Math.random() - 0.5) * (bundleRadius * 2 + 0.02 * S);
      const y = cy + gaussRand() * 0.008 * S;
      particles.push(
        mkParticle(x, y, 0.55 + Math.random() * 0.3, LEATHER_DK, LEATHER),
      );
    }
  }

  // Axe blade: 20% — grey-green metal, wide crescent on right side
  const axeN = Math.floor(count * 0.20);
  const bladeTop = 0.40 * S;
  const bladeBot = 0.04 * S;
  const bladeCenter = (bladeTop + bladeBot) / 2;
  const bladeHalf = (bladeTop - bladeBot) / 2;
  for (let i = 0; i < axeN; i++) {
    const t = Math.random() * 2 - 1;
    const y = bladeCenter + t * bladeHalf;
    const normT = Math.abs(t);
    const maxW = 0.16 * S;
    const edgeCurve = Math.sqrt(1 - normT * normT);
    const w = maxW * edgeCurve * (0.65 + 0.35 * Math.random());
    const x = bundleRadius + 0.006 * S + w;
    particles.push(
      mkParticle(x, y, 0.50 + Math.random() * 0.4, METAL, METAL_DK),
    );
  }

  // Axe handle/neck: 2%
  const neckN = Math.floor(count * 0.02);
  for (let i = 0; i < neckN; i++) {
    const y = bladeCenter + gaussRand() * 0.02 * S;
    const x = bundleRadius + Math.random() * 0.008 * S;
    particles.push(mkParticle(x, y, 0.4 + Math.random() * 0.3, IRON));
  }

  // Sparse atmospheric particles: remainder
  const restN = count - particles.length;
  for (let i = 0; i < restN; i++) {
    const x = (Math.random() - 0.5) * 0.5 * S;
    const y = (Math.random() - 0.5) * 1.3 * S;
    particles.push(mkParticle(x, y, 0.2, WOOD));
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

const PARTICLE_COUNT = 1200;
const DISPERSE_RADIUS = 0.55;
const DISPERSE_FORCE = 0.04;
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
    const uAspect = gl.getUniformLocation(prog, "u_aspect");
    const uOffsetX = gl.getUniformLocation(prog, "u_offsetX");
    const uVertScale = gl.getUniformLocation(prog, "u_vertScale");

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

    // Mouse — track in particle coordinate space
    const mouse = { x: -9999, y: -9999, active: false };
    let aspect = 1;
    let vertScale = 1;
    const offsetX = -0.35; // shift shape left to make room for copy
    const REF_HEIGHT = 580; // lock shape size to old container height

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const clipX = ((e.clientX - r.left) / r.width) * 2 - 1;
      const clipY = -(((e.clientY - r.top) / r.height) * 2 - 1);
      // Convert from clip space to particle space (undo aspect, offset, vertScale)
      mouse.x = (clipX - offsetX) * aspect / vertScale;
      mouse.y = clipY / vertScale;
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
      aspect = r.width / r.height;
      // Lock shape + orb size to reference height so they stay constant
      vertScale = Math.min(1.0, REF_HEIGHT / r.height);
      const effectiveH = Math.min(r.height, REF_HEIGHT);
      gl.uniform1f(uScale, dpr * effectiveH / 115);
      gl.uniform1f(uAspect, aspect);
      gl.uniform1f(uOffsetX, offsetX);
      gl.uniform1f(uVertScale, vertScale);
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
      gl.deleteBuffer(posBuf);
      gl.deleteBuffer(sizeBuf);
      gl.deleteBuffer(opBuf);
      gl.deleteBuffer(colBuf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
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
