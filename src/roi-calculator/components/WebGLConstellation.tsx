import { useEffect, useRef, useCallback } from 'react'

const PARTICLE_COUNT = 1200
const DISPERSE_FORCE = 0.018
const SPRING = 0.008
const DAMPING = 0.965
const DISPERSE_RADIUS = 0.45
const REF_HEIGHT = 580

const COLORS: [number, number, number][] = [
  [0.24, 0.17, 0.12],
  [0.30, 0.22, 0.15],
  [0.58, 0.36, 0.22],
  [0.48, 0.28, 0.16],
  [0.52, 0.52, 0.44],
  [0.42, 0.43, 0.36],
  [0.18, 0.14, 0.10],
]

const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec3 a_color;
  attribute float a_size;
  attribute float a_opacity;
  varying vec3 v_color;
  varying float v_opacity;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    gl_PointSize = a_size;
    v_color = a_color;
    v_opacity = a_opacity;
  }
`

const fragmentShaderSource = `
  precision mediump float;
  varying vec3 v_color;
  varying float v_opacity;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.2, dist) * v_opacity;
    gl_FragColor = vec4(v_color, alpha);
  }
`

interface Particle {
  homeX: number
  homeY: number
  x: number
  y: number
  vx: number
  vy: number
  color: [number, number, number]
  size: number
  opacity: number
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function generateShapePositions(count: number): [number, number][] {
  const positions: [number, number][] = []
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const r = Math.sqrt(i / count) * 0.35
    const theta = i * goldenAngle
    positions.push([Math.cos(theta) * r, Math.sin(theta) * r])
  }
  return positions
}

export default function WebGLConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const animFrameRef = useRef<number>(0)
  const reducedMotion = useRef(false)

  const init = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true })
    if (!gl) return

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    if (!vs || !fs) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return

    gl.useProgram(program)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const aPosition = gl.getAttribLocation(program, 'a_position')
    const aColor = gl.getAttribLocation(program, 'a_color')
    const aSize = gl.getAttribLocation(program, 'a_size')
    const aOpacity = gl.getAttribLocation(program, 'a_opacity')

    const shapePositions = generateShapePositions(PARTICLE_COUNT)
    const particles: Particle[] = shapePositions.map(([hx, hy]) => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      return {
        homeX: hx,
        homeY: hy,
        x: hx + (Math.random() - 0.5) * 0.02,
        y: hy + (Math.random() - 0.5) * 0.02,
        vx: 0,
        vy: 0,
        color,
        size: 1.5 + Math.random() * 2.5,
        opacity: 0.3 + Math.random() * 0.5,
      }
    })

    const positionData = new Float32Array(PARTICLE_COUNT * 2)
    const colorData = new Float32Array(PARTICLE_COUNT * 3)
    const sizeData = new Float32Array(PARTICLE_COUNT)
    const opacityData = new Float32Array(PARTICLE_COUNT)

    particles.forEach((p, i) => {
      colorData[i * 3] = p.color[0]
      colorData[i * 3 + 1] = p.color[1]
      colorData[i * 3 + 2] = p.color[2]
      sizeData[i] = p.size
    })

    const positionBuffer = gl.createBuffer()
    const colorBuffer = gl.createBuffer()
    const sizeBuffer = gl.createBuffer()
    const opacityBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aColor)
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, sizeData, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aSize)
    gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0)

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      mouseRef.current.active = true
    }
    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    const animate = () => {
      const aspectRatio = canvas.width / canvas.height
      const scale = REF_HEIGHT / window.innerHeight

      const mouseParticleX = mouseRef.current.x * aspectRatio / scale
      const mouseParticleY = mouseRef.current.y / scale

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (mouseRef.current.active && !reducedMotion.current) {
          const dx = p.x - mouseParticleX
          const dy = p.y - mouseParticleY
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < DISPERSE_RADIUS && dist > 0.001) {
            const force = (DISPERSE_RADIUS - dist) * DISPERSE_FORCE
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
          }
        }

        p.vx += (p.homeX - p.x) * SPRING
        p.vy += (p.homeY - p.y) * SPRING
        p.vx *= DAMPING
        p.vy *= DAMPING
        p.x += p.vx
        p.y += p.vy

        positionData[i * 2] = p.x * scale / aspectRatio
        positionData[i * 2 + 1] = p.y * scale
        opacityData[i] = p.opacity
      }

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(aPosition)
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

      gl.bindBuffer(gl.ARRAY_BUFFER, opacityBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, opacityData, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(aOpacity)
      gl.vertexAttribPointer(aOpacity, 1, gl.FLOAT, false, 0, 0)

      gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT)

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    const cleanup = init()
    return cleanup
  }, [init])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 0 }}
    />
  )
}
