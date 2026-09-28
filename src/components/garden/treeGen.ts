import * as THREE from 'three';

export type TreeData = {
  count: number;
  positions: Float32Array;
  starts: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  delays: Float32Array;
  rands: Float32Array;
  kinds: Float32Array;
  canopyCenter: THREE.Vector3;
  canopyRadius: number;
  leafSpots: THREE.Vector3[];
};

type Seg = { a: THREE.Vector3; b: THREE.Vector3; r0: number; r1: number; t0: number; t1: number };
type Tip = { p: THREE.Vector3; d: THREE.Vector3; t: number };

export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const UP = new THREE.Vector3(0, 1, 0);
const X_AXIS = new THREE.Vector3(1, 0, 0);

const BARK = ['#4A2F1C', '#5E3C24', '#744A2B', '#8A5A33'].map(c => new THREE.Color(c));
const BARK_LIT = new THREE.Color('#E0A064');
const LEAVES = ['#2F5A22', '#3F7A2C', '#56923A', '#76AE4A', '#98C463'].map(c => new THREE.Color(c));
const LEAF_GOLD = new THREE.Color('#F0CF7E');
const LEAF_AMBER = new THREE.Color('#E58E4E');
const BLOSSOM = new THREE.Color('#F3B7C4');

export type TreeOptions = {
  seed?: number;
  bark: number;
  leaves: number;
  bushLeaves: number;
  maxDepth: number;
  base: THREE.Vector3;
  bushes: THREE.Vector3[];
  sunDir: THREE.Vector3;
};

/** Builds a branching tree skeleton, then scatters particles over bark and leaf clusters. */
export function generateTree(opts: TreeOptions): TreeData {
  const rnd = mulberry32(opts.seed ?? 11);
  const segs: Seg[] = [];
  const tips: Tip[] = [];

  const randUnit = () => {
    const u = rnd() * 2 - 1;
    const th = rnd() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    return new THREE.Vector3(s * Math.cos(th), u, s * Math.sin(th));
  };
  const perp = (d: THREE.Vector3) => new THREE.Vector3().crossVectors(d, Math.abs(d.y) < 0.9 ? UP : X_AXIS).normalize();

  const spawn = (from: THREE.Vector3, pd: THREE.Vector3, len: number, rad: number, depth: number, t: number, k: number, n: number) => {
    const axis = perp(pd).applyAxisAngle(pd, (k / n) * Math.PI * 2 + rnd() * 1.3);
    const ang = 0.42 + rnd() * 0.42;
    const nd = pd.clone().applyAxisAngle(axis, ang);
    nd.y = Math.max(nd.y, 0.08) + 0.1;
    nd.normalize();
    branch(from, nd, len, rad, depth, t);
  };

  function branch(start: THREE.Vector3, dir: THREE.Vector3, len: number, rad: number, depth: number, t: number) {
    const n = depth === 0 ? 6 : 4;
    const segLen = len / n;
    const tSpan = 0.14 + 0.1 * (len / 2.4);
    const p = start.clone();
    const d = dir.clone();
    let r = rad;
    let tt = t;
    for (let i = 0; i < n; i++) {
      d.add(randUnit().multiplyScalar(depth === 0 ? 0.07 : 0.2)).addScaledVector(UP, depth === 0 ? 0.02 : 0.05).normalize();
      const q = p.clone().addScaledVector(d, segLen);
      const r1 = r * (depth === 0 ? 0.9 : 0.8);
      const t1 = tt + tSpan / n;
      segs.push({ a: p.clone(), b: q.clone(), r0: r, r1, t0: tt, t1 });
      if (depth < opts.maxDepth && i >= (depth === 0 ? 3 : 1) && rnd() < (depth === 0 ? 0.6 : 0.42)) {
        spawn(q, d, len * (0.48 + rnd() * 0.2), r1 * 0.7, depth + 1, t1, Math.floor(rnd() * 3), 3);
      }
      p.copy(q);
      r = r1;
      tt = t1;
    }
    if (depth < opts.maxDepth) {
      const kids = depth === 0 ? 3 : 2 + (rnd() < 0.4 ? 1 : 0);
      for (let k = 0; k < kids; k++) spawn(p, d, len * (0.64 + rnd() * 0.14), r * 0.72, depth + 1, tt, k, kids);
    }
    if (depth >= opts.maxDepth - 1) tips.push({ p: p.clone(), d: d.clone(), t: tt });
  }

  branch(opts.base.clone(), UP.clone(), 2.2, 0.2, 0, 0);

  const maxT = Math.max(...segs.map(s => s.t1), ...tips.map(tp => tp.t), 1e-3);
  const canopyCenter = new THREE.Vector3();
  tips.forEach(tp => canopyCenter.add(tp.p));
  canopyCenter.divideScalar(Math.max(1, tips.length));
  let canopyRadius = 0;
  tips.forEach(tp => (canopyRadius = Math.max(canopyRadius, tp.p.distanceTo(canopyCenter))));

  const total = opts.bark + opts.leaves + opts.bushLeaves;
  const positions = new Float32Array(total * 3);
  const starts = new Float32Array(total * 3);
  const colors = new Float32Array(total * 3);
  const sizes = new Float32Array(total);
  const delays = new Float32Array(total);
  const rands = new Float32Array(total);
  const kinds = new Float32Array(total);
  const col = new THREE.Color();
  const tmp = new THREE.Vector3();

  const writeStart = (i: number) => {
    const ang = rnd() * Math.PI * 2;
    const rad = 2.4 + rnd() * 6.5;
    starts[i * 3] = opts.base.x + Math.cos(ang) * rad;
    starts[i * 3 + 1] = 0.05 + rnd() * rnd() * 5.5;
    starts[i * 3 + 2] = opts.base.z + Math.sin(ang) * rad;
  };

  // bark: weight segments by length x girth
  const weights = segs.map(s => s.a.distanceTo(s.b) * (s.r0 + s.r1));
  const cum: number[] = [];
  let acc = 0;
  weights.forEach(w => cum.push((acc += w)));
  let idx = 0;
  for (let i = 0; i < opts.bark; i++, idx++) {
    const pick = rnd() * acc;
    let lo = 0;
    let hi = cum.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < pick) lo = mid + 1;
      else hi = mid;
    }
    const s = segs[lo];
    const t = rnd();
    const axis = tmp.subVectors(s.b, s.a).normalize();
    const u = perp(axis);
    const v = new THREE.Vector3().crossVectors(axis, u);
    const th = rnd() * Math.PI * 2;
    const rr = (s.r0 + (s.r1 - s.r0) * t) * (0.82 + rnd() * 0.18);
    const nrm = u.multiplyScalar(Math.cos(th)).addScaledVector(v, Math.sin(th));
    const px = s.a.x + (s.b.x - s.a.x) * t + nrm.x * rr;
    const py = s.a.y + (s.b.y - s.a.y) * t + nrm.y * rr;
    const pz = s.a.z + (s.b.z - s.a.z) * t + nrm.z * rr;
    positions.set([px, py, pz], idx * 3);
    col.copy(BARK[Math.floor(rnd() * BARK.length)]);
    const lit = Math.max(0, nrm.dot(opts.sunDir));
    col.lerp(BARK_LIT, lit * 0.55);
    colors.set([col.r, col.g, col.b], idx * 3);
    sizes[idx] = 0.04 + rnd() * 0.028;
    delays[idx] = ((s.t0 + (s.t1 - s.t0) * t) / maxT) * 0.66;
    rands[idx] = rnd();
    kinds[idx] = 0;
    writeStart(idx);
  }

  const leafSpots: THREE.Vector3[] = [];
  const placeLeaf = (center: THREE.Vector3, radius: number, delay: number, bush: boolean) => {
    const dir = randUnit();
    const rr = Math.cbrt(rnd()) * radius;
    const px = center.x + dir.x * rr;
    const py = center.y + dir.y * rr * (bush ? 0.7 : 0.78);
    const pz = center.z + dir.z * rr;
    positions.set([px, py, pz], idx * 3);
    const roll = rnd();
    if (roll < 0.1) col.copy(LEAF_GOLD);
    else if (roll < 0.135) col.copy(LEAF_AMBER);
    else if (roll < 0.16 && !bush) col.copy(BLOSSOM);
    else col.copy(LEAVES[Math.floor(rnd() * LEAVES.length)]);
    const out = tmp.set(px - center.x, py - center.y, pz - center.z).normalize();
    const facing = Math.max(0, out.dot(opts.sunDir));
    col.lerp(LEAF_GOLD, facing * 0.32);
    if (py < center.y - radius * 0.2) col.multiplyScalar(0.72);
    colors.set([col.r, col.g, col.b], idx * 3);
    sizes[idx] = (bush ? 0.05 : 0.058) + rnd() * 0.05;
    delays[idx] = delay;
    rands[idx] = rnd();
    kinds[idx] = 1;
    writeStart(idx);
    idx++;
  };

  for (let i = 0; i < opts.leaves; i++) {
    const tp = tips[Math.floor(rnd() * tips.length)];
    const c = tp.p.clone().addScaledVector(tp.d, 0.16);
    placeLeaf(c, 0.42 + rnd() * 0.3, 0.6 + (tp.t / maxT) * 0.22 + rnd() * 0.16, false);
  }
  for (let i = 0; i < tips.length; i += 3) leafSpots.push(tips[i].p.clone());

  for (let i = 0; i < opts.bushLeaves; i++) {
    const b = opts.bushes[i % opts.bushes.length];
    const c = new THREE.Vector3(b.x + (rnd() - 0.5) * 0.5, b.y + 0.35 + rnd() * 0.2, b.z + (rnd() - 0.5) * 0.5);
    placeLeaf(c, 0.4 + rnd() * 0.25, 0.12 + rnd() * 0.3, true);
  }

  return { count: idx, positions, starts, colors, sizes, delays, rands, kinds, canopyCenter, canopyRadius, leafSpots };
}
