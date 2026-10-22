import { useRef, useState, useEffect, useMemo } from 'react'

const DEFAULT_PARAMS = {
  diskColor: '#d3121f',
  streakColor: '#e9e4df',
  glowColor: '#ffffff',
  cloudColor: '#c9d0e2',
  background: '#030307',
  center: [0.5, 0.49],
  holeSize: 0.052,
  angle: 13,
  inclination: 0.27,
  diskRadius: 1.35,
  speed: 1,
  shear: 1,
  streakDensity: 150,
  crimson: 0.62,
  doppler: 0.35,
  flare: 1,
  lensing: 1,
  clouds: 1,
  cloudLines: 44,
  stars: 1,
  grain: 1,
  vignette: 0.55,
  exposure: 1.25,
}

export const PRESETS = {
  crimson: {},
  ember: {
    diskColor: '#ff6a13',
    streakColor: '#ffe2b8',
    glowColor: '#fff1d6',
    cloudColor: '#d8c3a8',
    background: '#060302',
    crimson: 0.65,
  },
  glacier: {
    diskColor: '#2f6bff',
    streakColor: '#dbe8ff',
    glowColor: '#eaf4ff',
    cloudColor: '#b9cdf0',
    background: '#02040a',
    crimson: 0.5,
    angle: -9,
  },
  ash: {
    diskColor: '#8d8d8d',
    streakColor: '#f2f2f2',
    glowColor: '#ffffff',
    cloudColor: '#d6d6d6',
    background: '#040404',
    crimson: 0.35,
    grain: 1.35,
  },
  orchid: {
    diskColor: '#b3219e',
    streakColor: '#f3dcf4',
    glowColor: '#fff0fb',
    cloudColor: '#d6c4e8',
    background: '#050309',
    inclination: 0.34,
    angle: 6,
  },
}

function hexToRgb(hex) {
  let clean = String(hex).trim().replace(/^#/, '')
  if (/^[0-9a-f]{3}$/i.test(clean)) {
    clean = clean.replace(/./g, (c) => c + c)
  }
  if (!/^[0-9a-f]{6}$/i.test(clean)) return [0, 0, 0]
  const num = parseInt(clean, 16)
  return [(num >> 16 & 255) / 255, (num >> 8 & 255) / 255, (num & 255) / 255]
}

function approach(current, target, dt, speed) {
  const diff = 1 - Math.exp(-Math.max(dt, 0) * speed)
  return current + (target - current) * diff
}

function pointerToParallax(clientX, clientY, rect) {
  const clamp = (v) => Math.max(-1, Math.min(1, v))
  const w = Math.max(rect.width, 1)
  const h = Math.max(rect.height, 1)
  return [clamp(((clientX - rect.left) / w) * 2 - 1), clamp((1 - (clientY - rect.top) / h) * 2)]
}

function idleDrift(time) {
  return [
    0.45 * Math.sin(time * 0.13) + 0.15 * Math.sin(time * 0.31 + 1.7),
    0.3 * Math.sin(time * 0.17 + 0.6),
  ]
}

function sanitize(userParams) {
  const clampNum = (val, min, max, fallback) =>
    Number.isFinite(val) ? Math.max(min, Math.min(max, val)) : fallback
  const def = DEFAULT_PARAMS

  return {
    ...userParams,
    center: [
      clampNum(userParams.center?.[0], -0.5, 1.5, def.center[0]),
      clampNum(userParams.center?.[1], -0.5, 1.5, def.center[1]),
    ],
    holeSize: clampNum(userParams.holeSize, 0.005, 0.3, def.holeSize),
    angle: clampNum(userParams.angle, -180, 180, def.angle),
    inclination: clampNum(userParams.inclination, 0.08, 0.95, def.inclination),
    diskRadius: clampNum(userParams.diskRadius, 0.3, 4, def.diskRadius),
    speed: clampNum(userParams.speed, 0, 10, def.speed),
    shear: clampNum(userParams.shear, 0, 4, def.shear),
    streakDensity: clampNum(userParams.streakDensity, 40, 800, def.streakDensity),
    crimson: clampNum(userParams.crimson, 0, 1, def.crimson),
    doppler: clampNum(userParams.doppler, 0, 1, def.doppler),
    flare: clampNum(userParams.flare, 0, 4, def.flare),
    lensing: clampNum(userParams.lensing, 0, 3, def.lensing),
    clouds: clampNum(userParams.clouds, 0, 2, def.clouds),
    cloudLines: clampNum(userParams.cloudLines, 4, 120, def.cloudLines),
    stars: clampNum(userParams.stars, 0, 4, def.stars),
    grain: clampNum(userParams.grain, 0, 3, def.grain),
    vignette: clampNum(userParams.vignette, 0, 1, def.vignette),
    exposure: clampNum(userParams.exposure, 0.1, 5, def.exposure),
  }
}

const VERTEX_SHADER = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 uRes;
uniform float uTime;
uniform float uClock;
uniform float uFeed;
uniform vec2 uParallax;

uniform vec3 uDisk;
uniform vec3 uStreak;
uniform vec3 uGlow;
uniform vec3 uCloud;
uniform vec3 uBg;

uniform vec2 uCenter;
uniform float uHole;
uniform float uAngle;
uniform float uIncl;
uniform float uDiskRadius;
uniform float uShear;
uniform float uDensity;
uniform float uCrimson;
uniform float uDoppler;
uniform float uFlare;
uniform float uLensing;
uniform float uClouds;
uniform float uCloudLines;
uniform float uStars;
uniform float uGrain;
uniform float uVignette;
uniform float uExposure;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
float noise2(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), u.x),
             mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), u.x), u.y);
}
float noise3(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float a = mix(mix(hash13(i), hash13(i + vec3(1, 0, 0)), u.x),
                mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), u.x), u.y);
  float b = mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), u.x),
                mix(hash13(i + vec3(0, 1, 1)), hash13(i + vec3(1, 1, 1)), u.x), u.y);
  return mix(a, b, u.z);
}
float fbm(vec2 p, int oct) {
  float s = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 7; i++) {
    if (i >= oct) break;
    s += a * noise2(p);
    p = m * p + 17.13;
    a *= 0.5;
  }
  return s;
}

// A hair-thin line on every integer of x, anti-aliased by its own footprint.
// Where lines crowd tighter than a pixel it settles to their average instead
// of shimmering into moire.
// w is the share of each period the line covers.
float lines(float x, float w) {
  float fw = fwidth(x) + 1e-5;
  float dist = 0.5 - abs(fract(x) - 0.5);
  float l = 1.0 - smoothstep(w * 0.5 - fw, w * 0.5 + fw, dist);
  return mix(l, w, smoothstep(0.25, 0.7, fw));
}

// Nebula density: domain-warped fbm, drifting.
float nebula(vec2 w, float t) {
  vec2 q = vec2(fbm(w * 1.1 + vec2(0.0, t * 0.012), 4),
                fbm(w * 1.1 + vec2(5.2, 1.3) - t * 0.009, 4));
  return fbm(w * 1.8 + 1.5 * q, 6);
}

// Engraved nebula bank: returns (colour, coverage).
vec4 bank(vec2 w, float mask, float t, vec2 toHole, float px) {
  float d = nebula(w, t);
  float body = d + 0.42 * (mask - 1.0) + 0.05 * mask + 0.1 * (uClouds - 1.0);
  float cover = smoothstep(0.5, 0.56, body);
  if (cover <= 0.0) return vec4(0.0);
  // Wrinkle the contour coordinate so the lines tremble like a burin cut.
  float x = (d + 0.012 * noise2(w * 55.0)) * uCloudLines;
  float ink = max(lines(x, 0.16), 0.45 * lines(x * 2.7 + 3.0 * noise2(w * 9.0), 0.12));
  // Rim: brightest right at the silhouette, fading into the mass.
  float rim = 1.0 - smoothstep(0.0, 0.07, body - 0.5);
  // Light from the horizon glow, off the density slope.
  vec2 g = vec2(dFdx(d), dFdy(d)) / px;
  float lam = clamp(0.5 + 0.5 * dot(-normalize(g + 1e-5), toHole), 0.0, 1.0);
  float lit = ink * (0.26 + 0.95 * rim) * (0.3 + 0.7 * lam) + rim * rim * 0.12 * lam;
  vec3 col = uBg * 0.55 + uCloud * lit;
  return vec4(col, cover);
}

float starField(vec2 w, float scale, float dens, float t) {
  vec2 g = w * scale;
  vec2 id = floor(g);
  float h = hash12(id);
  if (h < 1.0 - dens) return 0.0;
  vec2 o = vec2(hash12(id + 7.1), hash12(id + 3.7)) - 0.5;
  float dpx = length(fract(g) - 0.5 - o * 0.7) / scale * uRes.y;
  float tw = 0.65 + 0.35 * sin(t * (1.5 + h * 3.0) + h * 60.0);
  return exp(-dpx * dpx * 0.9) * tw * (0.4 + 0.6 * hash12(id + 1.9));
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float px = 1.0 / uRes.y;
  float aspect = uRes.x / uRes.y;
  vec2 uv = (frag - 0.5 * uRes) * px;
  float t = uTime;

  vec2 c = vec2((uCenter.x - 0.5) * aspect, 0.5 - uCenter.y);
  vec2 p = uv - c - uParallax * 0.012;

  // Disk frame: undo the clockwise roll, then open the plane back out.
  float ang = radians(uAngle) + uParallax.x * 0.03;
  float ca = cos(ang), sa = sin(ang);
  vec2 pr = vec2(ca * p.x - sa * p.y, sa * p.x + ca * p.y);
  float incl = clamp(uIncl + uParallax.y * 0.035, 0.06, 0.98);
  vec2 q = vec2(pr.x, pr.y / incl);
  float r = length(q);

  float Rh = uHole * (1.0 + 0.06 * uFeed);
  float d = length(p);
  vec2 dir = p / max(d, 1e-5);

  // ---- background: lensed stars and far nebula ---------------------------
  float RE = Rh * 1.7 * uLensing;
  vec2 pl = p * (1.0 - min(RE * RE / max(d * d, 1e-6), 1.6));
  vec2 uvL = pl + c;

  vec3 col = uBg + vec3(0.004, 0.008, 0.024) * smoothstep(-0.2, 0.6, uv.y + 0.3 * uv.x);
  float st = starField(uvL + uParallax * 0.004, 42.0, 0.09 * uStars, uClock)
           + 0.7 * starField(uvL + uParallax * 0.002 + 3.3, 95.0, 0.07 * uStars, uClock);
  col += vec3(0.92, 0.94, 1.0) * st;

  vec2 toHole = normalize(c - uv + 1e-5);

  if (uClouds > 0.0) {
    float maskT = smoothstep(-0.02, 0.3, pr.y + 0.15 * pr.x - 0.06);
    if (maskT > 0.0) {
      vec4 b = bank(uvL * 0.95 + uParallax * 0.02 + vec2(t * 0.004, 0.0), maskT, t, toHole, px);
      // A cold navy cast along the upper bank.
      b.rgb += vec3(0.02, 0.03, 0.09) * b.a * smoothstep(0.1, 0.5, uv.y);
      col = mix(col, b.rgb, b.a);
    }
  }

  // ---- the horizon itself -------------------------------------------------
  float inside = 1.0 - smoothstep(Rh - px, Rh + px, d);
  vec2 sp = p / Rh;
  float z = sqrt(max(0.0, 1.0 - dot(sp, sp)));
  vec3 n = vec3(sp, z);
  float lit = max(0.0, dot(n, normalize(vec3(0.15, 0.85, 0.5))));
  vec3 sphere = uBg * 0.4 + vec3(0.1, 0.1, 0.115) * lit * lit + uGlow * pow(1.0 - z, 4.0) * 0.18;
  col = mix(col, sphere, inside);

  // ---- accretion disk -----------------------------------------------------
  float rin = Rh * 1.55;
  if (r < uDiskRadius * 1.6) {
    float theta = atan(q.y, q.x);
    float om = 0.5 * uShear * pow(max(r, rin) / 0.3, -1.5) + 0.05;
    float th = theta + t * om;
    vec2 a2 = vec2(cos(th), sin(th));
    float lr = log(max(r, 1e-4));

    float arm = sin(2.0 * theta - t * 0.08 + 6.5 * lr);
    float w1 = noise3(vec3(a2 * 1.3, lr * 2.0 + 3.1));
    float w2 = noise3(vec3(a2 * 4.0, lr * 7.0 - 1.7));
    float rr = r * (1.0 + 0.035 * (w1 - 0.5) + 0.012 * arm) + 0.004 * (w2 - 0.5);

    float x1 = rr * uDensity;
    float x2 = rr * uDensity * 1.618 + 0.7 * w2;
    float x3 = rr * uDensity * 0.47 + 0.3 * w1;
    float dash1 = smoothstep(0.3, 0.62, noise3(vec3(a2 * 2.2, r * uDensity * 0.09)));
    float dash2 = smoothstep(0.36, 0.7, noise3(vec3(a2 * 4.5, r * uDensity * 0.14 + 9.0)));
    float s = lines(x1, 0.2) * dash1
            + 0.6 * lines(x2, 0.14) * dash2
            + 0.25 * lines(x3, 0.18) * (0.4 + 0.6 * dash2);

    // Where the crimson bands fall: a slow radial ripple plus the arms.
    float band = noise3(vec3(a2 * 1.7, r * 6.0 + 11.0)) + 0.16 * arm;
    float prof = smoothstep(0.1, 0.3, r) * (1.0 - smoothstep(0.95, 1.5, r / uDiskRadius * 1.35));
    float red = smoothstep(0.62 - 0.4 * uCrimson, 0.72 - 0.4 * uCrimson, band) * (0.25 + 0.75 * prof);

    float hot = exp(-(r - rin) / (Rh * 2.2));
    vec3 lineCol = mix(uStreak * 0.5, uDisk * 1.55, red);
    lineCol = mix(lineCol, uStreak * 1.4 + uGlow * 0.3, clamp(hot, 0.0, 1.0));

    float edge = smoothstep(rin, rin * 1.18, r) * (1.0 - smoothstep(uDiskRadius * 0.55, uDiskRadius, r));
    float bright = edge * (0.3 + 1.25 * exp(-(r - rin) * 1.9) + 1.6 * hot);
    float dop = 1.0 - uDoppler * (q.x / max(r, 1e-4));

    vec3 disk = lineCol * s * bright * dop;
    // Faint gas between the lines: crimson, cooling to navy at the inner edge.
    disk += (uDisk * 0.035 * (0.3 + red) + vec3(0.02, 0.03, 0.08) * hot) * edge * dop;
    disk *= 1.0 + 0.6 * uFeed;

    // The far half of the disk passes behind the horizon.
    float far = smoothstep(-0.25 * px, 1.5 * px, pr.y);
    col += disk * (1.0 - inside * far);
  }

  // ---- photon crown, ring and flare ---------------------------------------
  float outside = 1.0 - inside;
  float fl = uFlare * (1.0 + 1.3 * uFeed);
  float up = dot(dir, normalize(vec2(sa * 0.6, 1.0)));
  float ring = exp(-pow((d - Rh * 1.02) / (Rh * 0.035), 2.0)) * (0.55 + 0.9 * smoothstep(-0.4, 1.0, up));
  float crown = exp(-pow((d - Rh * 1.14) / (Rh * 0.09), 2.0)) * smoothstep(-0.05, 0.7, dir.y * ca - dir.x * sa);
  float halo = exp(-max(d - Rh, 0.0) / (Rh * 0.7)) * (0.35 + 0.65 * smoothstep(-0.3, 1.0, up));
  float rays = noise3(vec3(dir * 7.0, t * 0.06 + uClock * 0.02));
  rays = pow(rays, 3.0) * 1.6 * exp(-max(d - Rh, 0.0) / (Rh * 1.7)) * smoothstep(0.25, 1.0, up);
  float plane = exp(-abs(pr.y) / (Rh * 0.12)) * exp(-abs(pr.x) / (Rh * 2.6)) * smoothstep(Rh * 0.6, Rh * 1.3, abs(pr.x));
  float jet = exp(-abs(dot(p, vec2(ca, -sa))) / (Rh * 0.22)) * exp(-max(dot(p, vec2(sa, ca)), 0.0) / (Rh * 7.0))
            * step(0.0, dot(p, vec2(sa, ca)));
  col += uGlow * fl * (ring * 1.3 + crown * 0.9 + (halo * 0.8 + rays * 0.7 + jet * 0.07) * outside + plane * 0.9);

  // ---- foreground nebula, over the disk -----------------------------------
  if (uClouds > 0.0) {
    float maskB = smoothstep(0.0, 0.3, -pr.y - 0.3 * pr.x - 0.03);
    if (maskB > 0.0) {
      vec4 b = bank(uv * 0.85 + uParallax * 0.05 + vec2(7.0 - t * 0.006, 2.0), maskB, t + 40.0, toHole, px);
      col = mix(col, b.rgb, b.a);
    }
  }

  // ---- film ---------------------------------------------------------------
  col = 1.0 - exp(-col * uExposure);
  vec2 vq = uv / vec2(aspect, 1.0);
  col *= mix(1.0, smoothstep(0.95, 0.2, length(vq * vec2(1.25, 1.05))), uVignette);

  float f = floor(uClock * 24.0);
  float g1 = hash12(frag + f * vec2(37.1, 91.7));
  float g2 = hash12(floor(frag / 2.0) + f * vec2(13.3, 7.9));
  float grain = (g1 - 0.5) * 0.8 + (g2 - 0.5) * 0.55;
  float luma = dot(col, vec3(0.299, 0.587, 0.114));
  col += grain * uGrain * (0.045 + 0.4 * luma * (1.0 - luma));
  // Rare dust flecks.
  float fleck = step(0.99965, hash12(floor(frag / 2.0) + f * 3.1));
  col += fleck * uGrain * 0.12;

  outColor = vec4(max(col, 0.0), 1.0);
}`

const COLOR_UNIFORMS = [
  ['uDisk', 'diskColor'],
  ['uStreak', 'streakColor'],
  ['uGlow', 'glowColor'],
  ['uCloud', 'cloudColor'],
  ['uBg', 'background'],
]

const FLOAT_UNIFORMS = [
  ['uHole', 'holeSize'],
  ['uAngle', 'angle'],
  ['uIncl', 'inclination'],
  ['uDiskRadius', 'diskRadius'],
  ['uShear', 'shear'],
  ['uDensity', 'streakDensity'],
  ['uCrimson', 'crimson'],
  ['uDoppler', 'doppler'],
  ['uFlare', 'flare'],
  ['uLensing', 'lensing'],
  ['uClouds', 'clouds'],
  ['uCloudLines', 'cloudLines'],
  ['uStars', 'stars'],
  ['uGrain', 'grain'],
  ['uVignette', 'vignette'],
  ['uExposure', 'exposure'],
]

const SYSTEM_UNIFORMS = ['uRes', 'uTime', 'uClock', 'uFeed', 'uParallax', 'uCenter']
const INTERACTIVE_SELECTOR = 'a,button,input,textarea,select,label,summary,[role=button],[contenteditable]'

export default function EtchedAccretion({
  height = '100%',
  preset = 'crimson',
  params,
  interactive = true,
  renderScale = 1,
  children,
  className = '',
  'aria-label': ariaLabel = 'A black hole wrapped in a crimson accretion disk',
}) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [fallback, setFallback] = useState(false)
  const [contextVersion, setContextVersion] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const config = useMemo(
    () => sanitize({ ...DEFAULT_PARAMS, ...(PRESETS[preset] ?? {}), ...(params ?? {}) }),
    [preset, params]
  )

  const configRef = useRef(config)
  configRef.current = config
  const redrawRef = useRef(() => {})

  useEffect(() => {
    redrawRef.current()
  }, [config])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    })

    if (!gl) {
      setFallback(true)
      return
    }

    const compile = (type, source) => {
      const s = gl.createShader(type)
      if (!s) return null
      gl.shaderSource(s, source)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('etched-accretion compile error:', gl.getShaderInfoLog(s))
        gl.deleteShader(s)
        return null
      }
      return s
    }

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER)
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    const prog = vs && fs ? gl.createProgram() : null

    if (!prog || !vs || !fs) {
      if (vs) gl.deleteShader(vs)
      if (fs) gl.deleteShader(fs)
      setFallback(true)
      return
    }

    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.deleteShader(vs)
    gl.deleteShader(fs)

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('etched-accretion link error:', gl.getProgramInfoLog(prog))
      gl.deleteProgram(prog)
      setFallback(true)
      return
    }

    gl.useProgram(prog)
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    const loc = (name) => gl.getUniformLocation(prog, name)
    const colorLocs = COLOR_UNIFORMS.map(([u, prop]) => [loc(u), prop])
    const floatLocs = FLOAT_UNIFORMS.map(([u, prop]) => [loc(u), prop])
    const sysLocs = Object.fromEntries(SYSTEM_UNIFORMS.map((u) => [u, loc(u)]))

    let dprScale = 1
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * Math.max(0.25, renderScale) * dprScale
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }
    resize()

    let time = 7.3
    let clock = 0
    let feed = 0
    let isDown = false
    let parallax = [0, 0]
    let targetParallax = null
    let lastMoveTime = -Infinity

    const draw = () => {
      const cfg = configRef.current
      gl.viewport(0, 0, canvas.width, canvas.height)

      for (const [l, prop] of colorLocs) {
        const [r, g, b] = hexToRgb(cfg[prop])
        gl.uniform3f(l, r, g, b)
      }
      for (const [l, prop] of floatLocs) {
        gl.uniform1f(l, cfg[prop])
      }

      gl.uniform2f(sysLocs.uRes, canvas.width, canvas.height)
      gl.uniform2f(sysLocs.uCenter, cfg.center[0], cfg.center[1])
      gl.uniform1f(sysLocs.uTime, time)
      gl.uniform1f(sysLocs.uClock, clock)
      gl.uniform1f(sysLocs.uFeed, feed)
      gl.uniform2f(sysLocs.uParallax, parallax[0], parallax[1])

      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    redrawRef.current = () => {
      if (reducedMotion) draw()
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (reducedMotion) draw()
    })
    ro.observe(canvas)

    const onMove = (e) => {
      if (interactive) {
        targetParallax = pointerToParallax(e.clientX, e.clientY, container.getBoundingClientRect())
        lastMoveTime = clock
      }
    }

    const onLeave = () => {
      targetParallax = null
      isDown = false
    }

    const onDown = (e) => {
      if (!interactive) return
      const target = e.target
      if (target?.closest?.(INTERACTIVE_SELECTOR)) return
      isDown = true
      onMove(e)
    }

    const onUp = () => {
      isDown = false
    }

    container.addEventListener('pointermove', onMove)
    container.addEventListener('pointerdown', onDown)
    container.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)

    let rafId = 0
    const onLost = (e) => {
      e.preventDefault()
      cancelAnimationFrame(rafId)
      rafId = 0
    }
    const onRestored = () => setContextVersion((v) => v + 1)
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)

    let isIntersecting = true
    const io = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting
      if (isIntersecting && !reducedMotion && !rafId) {
        lastNow = performance.now()
        rafId = requestAnimationFrame(loop)
      }
    })
    io.observe(container)

    let lastNow = performance.now()
    let slowFrames = 0
    let frameCount = 0

    const loop = (now) => {
      rafId = 0
      if (!isIntersecting) return

      const dt = Math.min((now - lastNow) / 1000, 0.05)
      const frameDelta = now - lastNow
      lastNow = now

      const cfg = configRef.current
      feed = approach(feed, isDown ? 1 : 0, dt, isDown ? 1.6 : 0.9)
      clock += dt
      time += dt * cfg.speed * (1 + 2.6 * feed)

      const idle = clock - lastMoveTime > 4
      const target = targetParallax && !idle ? targetParallax : idleDrift(clock)

      parallax = [approach(parallax[0], target[0], dt, 2.2), approach(parallax[1], target[1], dt, 2.2)]

      if (frameCount < 240 && frameDelta < 250) {
        frameCount++
        if (frameDelta > 28) slowFrames++
        if (frameCount % 60 === 0) {
          if (slowFrames > 30 && dprScale > 0.5) {
            dprScale *= 0.8
            resize()
          }
          slowFrames = 0
        }
      }

      draw()
      rafId = requestAnimationFrame(loop)
    }

    if (reducedMotion) {
      draw()
    } else {
      rafId = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(rafId)
      redrawRef.current = () => {}
      ro.disconnect()
      io.disconnect()
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerdown', onDown)
      container.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      gl.deleteVertexArray(vao)
      gl.deleteProgram(prog)
    }
  }, [interactive, reducedMotion, renderScale, contextVersion])

  const diskRgb = hexToRgb(config.diskColor)
    .map((c) => Math.round(c * 255))
    .join(',')

  return (
    <div
      ref={containerRef}
      className={`etched-accretion-container ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: height,
        overflow: 'hidden',
        backgroundColor: config.background,
        zIndex: 0,
      }}
      aria-label={ariaLabel}
    >
      {fallback ? (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(4% 7% at ${config.center[0] * 100}% ${config.center[1] * 100}%, #000 92%, rgba(255,255,255,.9) 100%, transparent 130%), radial-gradient(9% 12% at ${config.center[0] * 100}% ${config.center[1] * 100 - 4}%, rgba(255,255,255,.35), transparent 70%), radial-gradient(60% 16% at ${config.center[0] * 100}% ${config.center[1] * 100}%, rgba(${diskRgb},.55), rgba(${diskRgb},.12) 55%, transparent 75%)`,
          }}
        />
      ) : (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            maxWidth: 'none',
          }}
        />
      )}
      {children && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
          {children}
        </div>
      )}
    </div>
  )
}
