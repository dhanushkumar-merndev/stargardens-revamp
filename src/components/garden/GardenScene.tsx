'use client';

import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { generateTree, mulberry32 } from './treeGen';

export type Tier = 'high' | 'low';

type SceneProps = {
  tier: Tier;
  treeX: number;
  scrollRef: MutableRefObject<number>;
  active: boolean;
};

const SUN_DIR = new THREE.Vector3(0.55, 0.35, -0.75).normalize();
const FOG = new THREE.Color('#C8906A');

/* ---------------- growth clock shared by the tree, bushes and falling leaves ---------------- */
declare global {
  interface Window {
    __sgRevealed?: boolean;
  }
}
function useGrowth() {
  const start = useRef(-1);
  const pending = useRef(false);
  useEffect(() => {
    const go = () => {
      pending.current = true;
    };
    if (window.__sgRevealed) go();
    window.addEventListener('sg:reveal', go);
    window.addEventListener('sg:regrow', go);
    return () => {
      window.removeEventListener('sg:reveal', go);
      window.removeEventListener('sg:regrow', go);
    };
  }, []);
  return (t: number) => {
    if (pending.current) {
      start.current = t;
      pending.current = false;
    }
    return start.current < 0 ? 0 : Math.min(1, (t - start.current) / 4.6);
  };
}

/* ---------------- sky dome ---------------- */
function Sky() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: new THREE.Color('#22233F') },
          uMid: { value: new THREE.Color('#7A5670') },
          uHorizon: { value: new THREE.Color('#F2A56C') },
          uGround: { value: new THREE.Color('#3A2A1E') },
          uSun: { value: new THREE.Color('#FFD8A0') },
          uSunDir: { value: SUN_DIR.clone().setY(0.12).normalize() }
        },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_Position = p.xyww;
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uTop, uMid, uHorizon, uGround, uSun, uSunDir;
          varying vec3 vDir;
          void main() {
            float y = vDir.y;
            vec3 c = mix(uHorizon, uMid, smoothstep(0.02, 0.28, y));
            c = mix(c, uTop, smoothstep(0.25, 0.75, y));
            c = mix(c, uGround, smoothstep(0.0, -0.18, y));
            float s = max(dot(normalize(vDir), uSunDir), 0.0);
            c += uSun * (pow(s, 6.0) * 0.45 + pow(s, 80.0) * 1.6);
            gl_FragColor = vec4(c, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`
      }),
    []
  );
  return (
    <mesh material={mat} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[90, 32, 16]} />
    </mesh>
  );
}

/* ---------------- ground and soft contact shadow ---------------- */
function Ground({ treeX }: { treeX: number }) {
  const shadowTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d')!;
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(0,0,0,0.55)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <circleGeometry args={[60, 48]} />
        <meshStandardMaterial color="#394221" roughness={1} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[treeX, 0.012, 0]}>
        <planeGeometry args={[11, 11]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ---------------- wind-blown grass ---------------- */
function Grass({ count, treeX }: { count: number; treeX: number }) {
  const geo = useMemo(() => {
    const blade = new THREE.PlaneGeometry(0.075, 0.55, 1, 4);
    blade.translate(0, 0.275, 0);
    const g = new THREE.InstancedBufferGeometry();
    g.index = blade.index;
    g.setAttribute('position', blade.getAttribute('position'));
    g.setAttribute('uv', blade.getAttribute('uv'));
    const off = new Float32Array(count * 3);
    const scale = new Float32Array(count);
    const rot = new Float32Array(count);
    const hue = new Float32Array(count);
    const rnd = mulberry32(5);
    let n = 0;
    while (n < count) {
      const ang = rnd() * Math.PI * 2;
      const r = 2.5 + Math.pow(rnd(), 0.8) * 17;
      const x = treeX + Math.cos(ang) * r;
      const z = Math.sin(ang) * r;
      if (Math.abs(x - treeX) < 3.45 && Math.abs(z) < 3.45) continue;
      if (Math.abs(x - treeX * 0.4) < 0.55 && z > 3.4 && z < 11) continue;
      off[n * 3] = x;
      off[n * 3 + 1] = 0;
      off[n * 3 + 2] = z;
      scale[n] = 0.55 + rnd() * 0.9 * (r < 6 ? 0.8 : 1.1);
      rot[n] = rnd() * Math.PI;
      hue[n] = rnd();
      n++;
    }
    g.setAttribute('aOffset', new THREE.InstancedBufferAttribute(off, 3));
    g.setAttribute('aScale', new THREE.InstancedBufferAttribute(scale, 1));
    g.setAttribute('aRot', new THREE.InstancedBufferAttribute(rot, 1));
    g.setAttribute('aHue', new THREE.InstancedBufferAttribute(hue, 1));
    g.instanceCount = count;
    return g;
  }, [count, treeX]);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        fog: true,
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib.fog,
          {
            uTime: { value: 0 },
            uBase: { value: new THREE.Color('#1E2A12') },
            uTip: { value: new THREE.Color('#8E9E45') },
            uTip2: { value: new THREE.Color('#B8A958') },
            uSun: { value: new THREE.Color('#FFB86E') }
          }
        ]),
        vertexShader: /* glsl */ `
          uniform float uTime;
          attribute vec3 aOffset;
          attribute float aScale;
          attribute float aRot;
          attribute float aHue;
          varying float vH;
          varying float vHue;
          #include <common>
          #include <fog_pars_vertex>
          void main() {
            vec3 p = position;
            float h = uv.y;
            p.x *= (1.0 - h * 0.85);
            p.y *= aScale;
            float c = cos(aRot), s = sin(aRot);
            p = vec3(c * p.x - s * p.z, p.y, s * p.x + c * p.z);
            vec3 wp = p + aOffset;
            float w = sin(uTime * 1.6 + aOffset.x * 0.45 + aOffset.z * 0.3) * 0.6 + sin(uTime * 2.7 + aOffset.x * 1.3) * 0.25;
            wp.x += w * 0.16 * h * h * aScale;
            wp.z += cos(uTime * 1.2 + aOffset.z * 0.5) * 0.07 * h * h * aScale;
            vH = h;
            vHue = aHue;
            vec4 mvPosition = modelViewMatrix * vec4(wp, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uBase, uTip, uTip2, uSun;
          varying float vH;
          varying float vHue;
          #include <common>
          #include <fog_pars_fragment>
          void main() {
            vec3 tip = mix(uTip, uTip2, vHue);
            vec3 col = mix(uBase, tip, smoothstep(0.0, 1.0, vH));
            col += uSun * pow(vH, 3.0) * 0.28;
            gl_FragColor = vec4(col, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
            #include <fog_fragment>
          }`
      }),
    []
  );

  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.elapsedTime;
  });

  return <mesh geometry={geo} material={mat} frustumCulled={false} />;
}

/* ---------------- timber deck, planter and path ---------------- */
function Deck({ treeX }: { treeX: number }) {
  const [teak, walnut] = useLoader(THREE.TextureLoader, ['/textures/teak.jpg', '/textures/walnut.jpg']);
  const plankRef = useRef<THREE.InstancedMesh>(null);
  const PLANKS = 16;
  const size = 6.6;

  useMemo(() => {
    [teak, walnut].forEach(t => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 4;
    });
    teak.repeat.set(2.6, 0.35);
    walnut.repeat.set(1.5, 0.5);
  }, [teak, walnut]);

  useEffect(() => {
    const m = plankRef.current;
    if (!m) return;
    const rnd = mulberry32(3);
    const o = new THREE.Object3D();
    const c = new THREE.Color();
    const w = size / PLANKS;
    for (let i = 0; i < PLANKS; i++) {
      o.position.set(treeX, 0.2, -size / 2 + w * (i + 0.5));
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      c.setHSL(0.07, 0.35, 0.62 + (rnd() - 0.5) * 0.14);
      m.setColorAt(i, c);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [treeX]);

  const stones = useMemo(() => {
    const rnd = mulberry32(9);
    return Array.from({ length: 9 }, (_, i) => ({
      x: treeX * 0.4 + (i % 2 ? 0.28 : -0.28) + (rnd() - 0.5) * 0.2,
      z: 4.0 + i * 0.85,
      s: 0.9 + rnd() * 0.3,
      r: rnd() * Math.PI
    }));
  }, [treeX]);

  const rocks = useMemo(() => {
    const rnd = mulberry32(21);
    const spots: [number, number][] = [[-4.3, -2.2], [4.1, 2.8], [-3.9, 3.6], [4.6, -3.3], [-6.5, 1.2], [6.8, 0.4]];
    return spots.map(([x, z]) => ({ x: treeX + x, z, s: 0.5 + rnd() * 0.6, r: rnd() * 6 }));
  }, [treeX]);

  return (
    <group>
      <instancedMesh ref={plankRef} args={[undefined, undefined, PLANKS]}>
        <boxGeometry args={[size, 0.09, size / PLANKS - 0.025]} />
        <meshStandardMaterial map={teak} roughness={0.72} metalness={0} />
      </instancedMesh>
      {[-1, 1].map(s => (
        <mesh key={'x' + s} position={[treeX, 0.1, (s * size) / 2]}>
          <boxGeometry args={[size + 0.2, 0.22, 0.16]} />
          <meshStandardMaterial map={walnut} roughness={0.8} />
        </mesh>
      ))}
      {[-1, 1].map(s => (
        <mesh key={'z' + s} position={[treeX + (s * size) / 2, 0.1, 0]}>
          <boxGeometry args={[0.16, 0.22, size + 0.2]} />
          <meshStandardMaterial map={walnut} roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[treeX, 0.5, 0]}>
        <cylinderGeometry args={[0.95, 1.05, 0.62, 40]} />
        <meshStandardMaterial map={walnut} roughness={0.75} />
      </mesh>
      <mesh position={[treeX, 0.815, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.88, 36]} />
        <meshStandardMaterial color="#2E2016" roughness={1} />
      </mesh>
      {stones.map((s, i) => (
        <mesh key={i} position={[s.x, 0.03, s.z]} rotation-y={s.r} scale={[s.s, 1, s.s * 0.8]}>
          <cylinderGeometry args={[0.36, 0.4, 0.07, 9]} />
          <meshStandardMaterial color="#B9AF9D" roughness={0.95} flatShading />
        </mesh>
      ))}
      {rocks.map((r, i) => (
        <mesh key={i} position={[r.x, r.s * 0.18, r.z]} rotation={[r.r, r.r * 2, 0]} scale={[r.s, r.s * 0.62, r.s * 0.85]}>
          <icosahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial color="#8D8577" roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- the particle tree ---------------- */
function ParticleTree({ tier, treeX }: { tier: Tier; treeX: number }) {
  const base = useMemo(() => new THREE.Vector3(treeX, 0.82, 0), [treeX]);
  const data = useMemo(
    () =>
      generateTree({
        seed: 11,
        bark: tier === 'high' ? 16000 : 7000,
        leaves: tier === 'high' ? 36000 : 15000,
        bushLeaves: tier === 'high' ? 5200 : 2400,
        maxDepth: tier === 'high' ? 5 : 4,
        base,
        bushes: [
          new THREE.Vector3(treeX - 2.75, 0.24, -2.7),
          new THREE.Vector3(treeX + 2.75, 0.24, -2.7),
          new THREE.Vector3(treeX - 2.75, 0.24, 2.7),
          new THREE.Vector3(treeX + 2.75, 0.24, 2.7)
        ],
        sunDir: SUN_DIR
      }),
    [tier, base, treeX]
  );

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(data.positions.subarray(0, data.count * 3), 3));
    g.setAttribute('aStart', new THREE.BufferAttribute(data.starts.subarray(0, data.count * 3), 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(data.colors.subarray(0, data.count * 3), 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(data.sizes.subarray(0, data.count), 1));
    g.setAttribute('aDelay', new THREE.BufferAttribute(data.delays.subarray(0, data.count), 1));
    g.setAttribute('aRand', new THREE.BufferAttribute(data.rands.subarray(0, data.count), 1));
    g.setAttribute('aKind', new THREE.BufferAttribute(data.kinds.subarray(0, data.count), 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(treeX, 2.5, 0), 12);
    return g;
  }, [data, treeX]);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        fog: true,
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib.fog,
          {
            uTime: { value: 0 },
            uGrow: { value: 0 },
            uScale: { value: 800 },
            uWind: { value: 1 },
            uBase: { value: new THREE.Vector3() },
            uPointer: { value: new THREE.Vector3(99, 99, 99) },
            uPointerStr: { value: 0 }
          }
        ]),
        vertexShader: /* glsl */ `
          uniform float uTime, uGrow, uScale, uWind, uPointerStr;
          uniform vec3 uBase, uPointer;
          attribute vec3 aStart;
          attribute vec3 aColor;
          attribute float aSize, aDelay, aRand, aKind;
          varying vec3 vColor;
          varying float vAlpha;
          #include <common>
          #include <fog_pars_vertex>
          vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x - s * p.z, p.y, s * p.x + c * p.z); }
          void main() {
            float local = clamp((uGrow * 1.28 - aDelay) / 0.3, 0.0, 1.0);
            float e = 1.0 - pow(1.0 - local, 3.0);
            float h = max(position.y - uBase.y, 0.0);
            vec3 wind = vec3(
              sin(uTime * 1.3 + position.y * 1.7 + aRand * 6.2831),
              sin(uTime * 0.9 + position.x * 1.3 + aRand * 3.0) * 0.6,
              cos(uTime * 1.1 + position.z * 1.5 + aRand * 4.0)) * (0.012 + 0.04 * aKind) * uWind * (0.4 + h * 0.22);
            vec3 sway = vec3(sin(uTime * 0.55 + 1.3), 0.0, cos(uTime * 0.47)) * 0.0045 * h * h * uWind;
            vec3 target = position + (wind + sway) * e;
            vec3 drift = vec3(sin(uTime * 0.6 + aRand * 12.0), sin(uTime * 0.8 + aRand * 7.0) * 0.6, cos(uTime * 0.5 + aRand * 9.0)) * 0.28;
            vec3 rel = mix(aStart + drift - uBase, target - uBase, e);
            rel = rotY(rel, (1.0 - e) * (2.2 + aRand * 1.6));
            vec3 p = uBase + rel;
            vec3 dp = p - uPointer;
            float d = length(dp);
            float push = uPointerStr * smoothstep(1.35, 0.0, d) * e;
            p += normalize(dp + vec3(1e-4)) * push * (0.28 + 0.3 * aKind);
            vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = aSize * mix(0.6, 1.0, e) * uScale / -mvPosition.z;
            vColor = aColor * (1.0 + push * 0.9);
            vAlpha = mix(0.2, 1.0, e);
            #include <fog_vertex>
          }`,
        fragmentShader: /* glsl */ `
          varying vec3 vColor;
          varying float vAlpha;
          #include <common>
          #include <fog_pars_fragment>
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.16, d) * vAlpha;
            vec3 col = vColor * (0.88 + 0.5 * (0.5 - d));
            gl_FragColor = vec4(col, a);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
            #include <fog_fragment>
          }`
      }),
    []
  );

  const grow = useGrowth();
  const { camera, gl, pointer, size } = useThree();
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const lastPointer = useRef(new THREE.Vector2(9, 9));
  const strength = useRef(0);

  useEffect(() => {
    mat.uniforms.uBase.value.copy(base);
  }, [base, mat]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const u = mat.uniforms;
    u.uTime.value = t;
    u.uGrow.value = grow(t);
    const cam = camera as THREE.PerspectiveCamera;
    u.uScale.value = (size.height * gl.getPixelRatio()) / (2 * Math.tan((cam.fov * Math.PI) / 360));
    if (pointer.distanceTo(lastPointer.current) > 0.002) {
      lastPointer.current.copy(pointer);
      strength.current = 1;
    } else strength.current *= 0.965;
    ray.setFromCamera(pointer, camera);
    plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(hit).negate(), new THREE.Vector3(base.x, 2.6, 0));
    if (ray.ray.intersectPlane(plane, hit)) u.uPointer.value.copy(hit);
    u.uPointerStr.value += (strength.current - u.uPointerStr.value) * 0.12;
  });

  return <points geometry={geo} material={mat} frustumCulled={false} />;
}

/* ---------------- drifting leaves and fireflies ---------------- */
function FallingLeaves({ treeX, count }: { treeX: number; count: number }) {
  const grow = useGrowth();
  const geo = useMemo(() => {
    const rnd = mulberry32(77);
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count * 4);
    const col = new Float32Array(count * 3);
    const palette = ['#F0CF7E', '#E58E4E', '#98C463', '#76AE4A', '#F3B7C4'].map(c => new THREE.Color(c));
    for (let i = 0; i < count; i++) {
      pos.set([treeX + (rnd() - 0.5) * 4.2, 0, (rnd() - 0.5) * 4.2], i * 3);
      seed.set([rnd(), 0.05 + rnd() * 0.08, rnd() * 6.28, 3.4 + rnd() * 1.6], i * 4);
      const c = palette[Math.floor(rnd() * palette.length)];
      col.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    return g;
  }, [count, treeX]);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: { value: 0 }, uShow: { value: 0 }, uScale: { value: 800 } },
        vertexShader: /* glsl */ `
          uniform float uTime, uShow, uScale;
          attribute vec4 aSeed;
          attribute vec3 aColor;
          varying vec3 vColor;
          varying float vA;
          void main() {
            float f = fract(uTime * aSeed.y + aSeed.x);
            vec3 p = position;
            p.y = mix(aSeed.w, 0.05, f);
            p.x += sin(uTime * 1.3 + aSeed.z) * 0.35 * f + f * 0.9;
            p.z += cos(uTime * 1.1 + aSeed.z) * 0.3 * f;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = 0.075 * uScale / -mv.z;
            vColor = aColor;
            vA = uShow * smoothstep(0.0, 0.08, f) * (1.0 - smoothstep(0.9, 1.0, f));
          }`,
        fragmentShader: /* glsl */ `
          varying vec3 vColor;
          varying float vA;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            if (length(c * vec2(1.0, 1.8)) > 0.5) discard;
            gl_FragColor = vec4(vColor, vA);
            #include <colorspace_fragment>
          }`
      }),
    []
  );
  const { camera, gl, size } = useThree();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    mat.uniforms.uTime.value = t;
    mat.uniforms.uShow.value = Math.max(0, grow(t) - 0.8) * 5;
    const cam = camera as THREE.PerspectiveCamera;
    mat.uniforms.uScale.value = (size.height * gl.getPixelRatio()) / (2 * Math.tan((cam.fov * Math.PI) / 360));
  });
  return <points geometry={geo} material={mat} frustumCulled={false} />;
}

function Fireflies({ count, treeX }: { count: number; treeX: number }) {
  const geo = useMemo(() => {
    const rnd = mulberry32(31);
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos.set([treeX + (rnd() - 0.5) * 13, 0.3 + rnd() * 3.4, (rnd() - 0.5) * 10], i * 3);
      seed.set([rnd() * 6.28, 0.3 + rnd() * 0.8, 1 + rnd() * 3], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 3));
    return g;
  }, [count, treeX]);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uScale: { value: 800 }, uColor: { value: new THREE.Color('#FFD27A') } },
        vertexShader: /* glsl */ `
          uniform float uTime, uScale;
          attribute vec3 aSeed;
          varying float vA;
          void main() {
            vec3 p = position + vec3(sin(uTime * aSeed.y + aSeed.x), sin(uTime * aSeed.y * 1.3 + aSeed.x * 2.0) * 0.5, cos(uTime * aSeed.y * 0.8 + aSeed.x)) * 0.45;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = 0.13 * uScale / -mv.z;
            vA = 0.25 + 0.75 * pow(sin(uTime * aSeed.z + aSeed.x) * 0.5 + 0.5, 3.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          varying float vA;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float a = pow(1.0 - d * 2.0, 2.0) * vA;
            gl_FragColor = vec4(uColor * 2.2, a);
            #include <colorspace_fragment>
          }`
      }),
    []
  );
  const { camera, gl, size } = useThree();
  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.elapsedTime;
    const cam = camera as THREE.PerspectiveCamera;
    mat.uniforms.uScale.value = (size.height * gl.getPixelRatio()) / (2 * Math.tan((cam.fov * Math.PI) / 360));
  });
  return <points geometry={geo} material={mat} frustumCulled={false} />;
}

/* ---------------- camera: dolly-in on growth, idle sway, pointer parallax, scroll lift ---------------- */
function CameraRig({ treeX, scrollRef }: { treeX: number; scrollRef: MutableRefObject<number> }) {
  const grow = useGrowth();
  const look = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const { camera, pointer, size } = useThree();
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const g = grow(t);
    const e = 1 - Math.pow(1 - g, 3);
    const s = scrollRef.current;
    const narrow = size.width / size.height < 1;
    const dist = narrow ? 22 : 11.6;
    target.set(
      Math.sin(t * 0.11) * 0.7 + pointer.x * 0.7,
      2.55 + (1 - e) * -0.7 + Math.sin(t * 0.17) * 0.12 + pointer.y * 0.25 + s * 2.2,
      dist + (1 - e) * 3.4 + s * 1.5
    );
    camera.position.lerp(target, 1 - Math.pow(0.001, dt));
    look.set(narrow ? treeX : 0.6, (narrow ? -0.3 : 3.05) + s * 0.4, 0);
    camera.lookAt(look);
  });
  return null;
}

function Scene({ tier, treeX, scrollRef }: Omit<SceneProps, 'active'>) {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.Fog(FOG, 13, 44);
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  return (
    <>
      <Sky />
      <ambientLight intensity={0.35} color="#FFE7C8" />
      <hemisphereLight args={['#FFD6A5', '#3B2A1C', 0.7]} />
      <directionalLight position={[6, 5, -8]} intensity={2.2} color="#FFC98A" />
      <pointLight position={[treeX - 2, 3, 6]} intensity={6} distance={14} color="#FFE2B8" />
      <Ground treeX={treeX} />
      <Grass count={tier === 'high' ? 22000 : 8000} treeX={treeX} />
      <Suspense fallback={null}>
        <Deck treeX={treeX} />
      </Suspense>
      <ParticleTree tier={tier} treeX={treeX} />
      <FallingLeaves treeX={treeX} count={tier === 'high' ? 260 : 120} />
      <Fireflies count={tier === 'high' ? 170 : 90} treeX={treeX} />
      <CameraRig treeX={treeX} scrollRef={scrollRef} />
      {tier === 'high' ? (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.72} luminanceSmoothing={0.25} />
          <Vignette offset={0.28} darkness={0.72} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      ) : null}
    </>
  );
}

export default function GardenScene({ tier, treeX, scrollRef, active }: SceneProps) {
  return (
    <Canvas
      dpr={tier === 'high' ? [1, 1.5] : [1, 1.25]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: false, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ fov: 38, near: 0.1, far: 200, position: [0, 1.6, 14] }}
      onCreated={({ gl }) => gl.setClearColor('#2A1C12')}
    >
      <Scene tier={tier} treeX={treeX} scrollRef={scrollRef} />
    </Canvas>
  );
}
