// film.js — "Kit 72 h": an emergency kit packed on one printed instruction sheet (1080×1920, 30 fps).
// The page is a snake of cells in two columns: cover → do/don't → steps 1…6, the camera pans, tilts, pushes and pulls over it;
// the drawing angle never changes (true isometric). One backpack model with a state table draws every picture of the kit.
import { PAL, makeView, setLW, LW, setFillOverride, box, cyl, poly3, dashed, dashed3, planeArrow, turnArrow, arrow2, cross, tick,
  roundRect, clickMark, add3, sub3, mul3, lerp3, rotAbout, shape } from './iso.js';
import { magnifier } from './page.js';
import { hand } from './hand.js';

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ss = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
const eio = (t) => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const eo = (t) => 1 - Math.pow(1 - clamp(t), 3);
const back = (t, s = 1.7) => { t = clamp(t) - 1; return 1 + t * t * ((s + 1) * t + s); };
const lerp = (a, b, t) => a + (b - a) * t;
export const W = 1080, H = 1920;
const FONT = '"Inter Manual"';

export let TL = null;
export async function loadTimeline() { TL = await (await fetch('timeline.json')).json(); return TL; }

// ---------------- the page: two columns, a snake ----------------
const CW = 1080, CH = 1300, GX = 170, GY = 210;
const SLOT = { cover: [0, 0], dd: [1, 0], 1: [1, 1], 2: [0, 1], 3: [0, 2], 4: [1, 2], 5: [1, 3], 6: [0, 3] };
const ORDER = ['cover', 'dd', 1, 2, 3, 4, 5, 6];
const cellO = (k) => [SLOT[k][0] * (CW + GX), SLOT[k][1] * (CH + GY)];
const PAGE = { w: 2 * CW + GX, h: 4 * CH + 3 * GY };
const pc = (k, x, y) => { const [ox, oy] = cellO(k); return [ox + x, oy + y]; };
const cc = (k, dy = 0) => pc(k, CW / 2, CH / 2 + dy);   // a cell's centre

// ---------------- times (s) ----------------
export const T = {
  num0: .2, land: .15, title: .35, lidArrow: 1.25, lid0: 1.55, lid1: 2.25,
  pan1: 4.85, pan1e: 5.35, box: 5.35, cart: 5.5, stop: 6.15, xMark: 6.55, okBag: 7.0, okMark: 7.85,
  push: 8.75, portal: 9.4,
  s1: 9.42, fly1: [10.15, 10.75, 11.35],
  pan2: 12.2, pan2e: 12.7, fly2: [13.15, 13.6, 14.05, 14.5, 14.95],
  pan3: 15.65, pan3e: 16.15, fly3: [16.55, 17.15, 17.75, 18.35],
  pan4: 18.85, pan4e: 19.35, fly4: [19.75], mag: 20.25, zip0: 20.65, zip1: 21.45, docFly: 21.85,
  pan5: 22.65, pan5e: 23.15, lidShut0: 23.35, lidShut1: 23.85, arrow5: 24.0, slide0: 24.35, slide1: 25.1,
  pan6: 25.45, pan6e: 25.95, cal: 25.95, turn0: 26.55, turn1: 27.35,
  out0: 27.75, out1: 29.35, gold: 29.55,
};
const FLY = .6;

// ---------------- camera ----------------
function camLerp(a, b, k) {
  const z = a.z * Math.pow(b.z / a.z, k);
  let w = k;
  if (Math.abs(Math.log(b.z / a.z)) > .05) w = (1 / z - 1 / a.z) / (1 / b.z - 1 / a.z);
  return { x: lerp(a.c[0], b.c[0], w), y: lerp(a.c[1], b.c[1], w), z };
}
let KEYS = null;
const DDBOX = { x: 50, y: 330, w: 980, h: 720 };
const OKC = () => pc('dd', DDBOX.x + DDBOX.w * .75, DDBOX.y + DDBOX.h * .55);
function buildKeys() {
  const K = (t, c, z, e = eio) => ({ t, c, z, e });
  const zFull = Math.min(W / (PAGE.w + 160), H / (PAGE.h + 260));
  const Z = .98, up = 60;   // a cell sits a little above the centre, the subtitles live below it
  KEYS = [
    K(0, cc('cover', 70), .98), K(T.pan1, cc('cover', 60), 1.04, ss),
    K(T.pan1e, cc('dd', up), Z), K(T.push, cc('dd', up), 1.02, ss),
    K(T.portal, OKC(), 9.0, (t) => Math.pow(clamp(t), 2.2)),
    // the portal: re-based on step 1
    K(T.portal + 1e-4, cc(1, up), Z * 1.05), K(T.pan2, cc(1, up), Z, ss),
    K(T.pan2e, cc(2, up), Z), K(T.pan3, cc(2, up), Z * 1.01, ss),
    K(T.pan3e, cc(3, up), Z), K(T.pan4, cc(3, up), Z * 1.01, ss),
    K(T.pan4e, cc(4, up), Z), K(T.mag - .1, cc(4, up), Z, ss), K(T.mag + .5, pc(4, 560, 700), 1.05), K(T.docFly, pc(4, 560, 700), 1.06, ss), K(T.pan5, cc(4, up), Z),
    K(T.pan5e, cc(5, up), Z), K(T.pan6, cc(5, up), Z * 1.02, ss),
    K(T.pan6e, cc(6, up), Z), K(T.out0, cc(6, up), Z * 1.03, ss),
    K(T.out1, [PAGE.w / 2, PAGE.h / 2 + 30], zFull),
    K(TL.dur, [PAGE.w / 2, PAGE.h / 2 + 30], zFull * 1.03, ss),
  ];
}
export function cam(t) {
  let i = 0; while (i < KEYS.length - 2 && t >= KEYS[i + 1].t) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  if (t <= a.t) return { x: a.c[0], y: a.c[1], z: a.z };
  return camLerp(a, b, b.e(seg(t, a.t, b.t)));
}
function ctx(k, cm) {
  const [ox, oy] = cellO(k), z = cm.z;
  const Tf = (x, y) => [(ox + x - cm.x) * z + W / 2, (oy + y - cm.y) * z + H / 2];
  return { k, z, T: Tf, V: (x, y, s) => { const p = Tf(x, y); return makeView({ cx: p[0], cy: p[1], s: s * z }); } };
}
const lwFor = (z) => clamp(2.6 * Math.pow(z, .55), .7, 6.5);
function mixPal(a, b, k) {
  const h = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)), o = {};
  for (const key of ['top', 'z', 'x']) { const p = h(a[key]), q = h(b[key]); o[key] = '#' + p.map((v, i) => Math.round(v + (q[i] - v) * k).toString(16).padStart(2, '0')).join(''); }
  return o;
}
// yellow while new, white once it is in place (fades over .45 s after `t1`)
const newPal = (t, t1) => mixPal(PAL.neu, PAL.part, seg(t, t1, t1 + .45));

// ---------------- texts for readcheck ----------------
let TXT = new Map(), REC = true;
function note(g, id, text, x, y) {
  if (!REC || g.globalAlpha < .5) return;
  const m = g.measureText(text);
  TXT.set(id, { id, text, x0: x, y0: y - (m.actualBoundingBoxAscent || 0), x1: x + m.width, y1: y + (m.actualBoundingBoxDescent || 0) });
}
export const texts = () => [...TXT.values()];
function printText(g, c, id, txt, x, y, size, k = 1, weight = 700) {
  if (k <= 0) return;
  const [sx, sy] = c.T(x, y);
  g.save(); g.fillStyle = PAL.ink; g.font = `${weight} ${size * c.z}px ${FONT}`; g.textBaseline = 'alphabetic';
  if (k < 1) { const s = 1 + .3 * (1 - eo(k)); g.globalAlpha = clamp(k * 3); g.translate(sx, sy); g.scale(s, s); g.translate(-sx, -sy); }
  g.fillText(txt, sx, sy); note(g, c.k + ':' + id, txt, sx, sy); g.restore();
}
const stepNum = (g, c, n, t0, t) => printText(g, c, 'n', String(n), 60, 215, 150, seg(t, t0, t0 + .3));
function rrect(g, c, x, y, w, h, r, fill, k = 1) {
  if (k <= 0) return; const [sx, sy] = c.T(x, y), z = c.z;
  g.save(); if (k < 1) { const s = .85 + .15 * back(k); g.globalAlpha = clamp(k * 2.5); g.translate(sx + w * z / 2, sy + h * z / 2); g.scale(s, s); g.translate(-sx - w * z / 2, -sy - h * z / 2); }
  roundRect(g, sx, sy, w * z, h * z, r * z, fill, LW); g.restore();
}

// line art first, then the flat colours (a drawing never appears half-built)
let LAY = null, NOW = 0;
function appear(g, t0, fn, dLine = .4, dFill = .45) {
  const a = seg(NOW, t0, t0 + dLine), b = seg(NOW, t0 + dLine * .8, t0 + dLine * .8 + dFill);
  if (a <= 0) return;
  if (b >= 1) { fn(g); return; }
  if (!LAY) { LAY = document.createElement('canvas'); LAY.width = W; LAY.height = H; }
  const lg = LAY.getContext('2d');
  lg.setTransform(1, 0, 0, 1, 0, 0); lg.clearRect(0, 0, W, H); setFillOverride(PAL.paper); fn(lg); setFillOverride(null);
  g.save(); g.globalAlpha = ss(a); g.drawImage(LAY, 0, 0); g.restore();
  if (b > 0) { lg.clearRect(0, 0, W, H); fn(lg); g.save(); g.globalAlpha = ss(b); g.drawImage(LAY, 0, 0); g.restore(); }
}

// ---------------- the objects (world cm, y up; every one stands on its base point p) ----------------
const BAG = { w: 32, d: 20, h: 45 };
export const ITEM = {
  bottle: (v, p, pal) => { cyl(v, p, add3(p, [0, 23, 0]), 4.2, pal); cyl(v, add3(p, [0, 23, 0]), add3(p, [0, 26.5, 0]), 1.9, pal, { bias: .1 }); cyl(v, add3(p, [0, 26.5, 0]), add3(p, [0, 29, 0]), 2.1, PAL.metal, { bias: .2 }); },
  can: (v, p, pal) => cyl(v, p, add3(p, [0, 9.5, 0]), 3.9, pal, { after: (g) => {} }),
  bar: (v, p, pal) => box(v, add3(p, [-6.5, 0, -2.2]), add3(p, [6.5, 2.6, 2.2]), pal),
  opener: (v, p, pal) => { cyl(v, add3(p, [-6, 1, 0]), add3(p, [3, 1, 0]), .9, pal); box(v, add3(p, [3, 0, -1.6]), add3(p, [7, 2.2, 1.6]), PAL.metal, { bias: .1 }); },
  flashlight: (v, p, pal) => { cyl(v, add3(p, [-8, 2.2, 0]), add3(p, [5, 2.2, 0]), 2.1, pal); cyl(v, add3(p, [5, 2.2, 0]), add3(p, [9, 2.2, 0]), 3.0, pal, { bias: .2, cap: '#FFFFFF' }); },
  radio: (v, p, pal) => {
    box(v, add3(p, [-9, 0, -3.5]), add3(p, [9, 11, 3.5]), pal, { after: (g) => {   // a round speaker printed on its front
      const c = v.P(add3(p, [-3, 5.5, 3.5])); g.save(); g.beginPath(); g.ellipse(c[0], c[1], 3.3 * v.s * .62, 3.3 * v.s * .72, -.5, 0, Math.PI * 2); g.lineWidth = LW; g.strokeStyle = PAL.ink; g.stroke(); g.restore(); } });
    cyl(v, add3(p, [6.5, 11, -2]), add3(p, [6.5, 24, -2]), .45, PAL.metal, { bias: -.5 });
  },
  battery: (v, p, pal) => { for (const dx of [-1.2, 1.2]) { cyl(v, add3(p, [dx, 0, 0]), add3(p, [dx, 5, 0]), 1.0, pal); cyl(v, add3(p, [dx, 5, 0]), add3(p, [dx, 5.6, 0]), .4, PAL.metal, { bias: .1 }); } },
  power: (v, p, pal) => box(v, add3(p, [-3.5, 0, -1.2]), add3(p, [3.5, 12, 1.2]), pal),
  medicine: (v, p, pal) => box(v, add3(p, [-5, 0, -3]), add3(p, [5, 6, 3]), pal, { after: (g) => {   // a plus printed on the lid
    const a = v.P(add3(p, [-2.2, 6, 0])), b = v.P(add3(p, [2.2, 6, 0])), c = v.P(add3(p, [0, 6, -2.2])), d = v.P(add3(p, [0, 6, 2.2]));
    g.save(); g.lineWidth = LW * 1.6; g.strokeStyle = PAL.ink; g.lineCap = 'round'; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.moveTo(...c); g.lineTo(...d); g.stroke(); g.restore(); } }),
  doc: (v, p, pal, o = {}) => docBag(v, p, pal, o.zip ?? 1),
};
// the waterproof document bag: a flat pouch standing on its edge, a card inside, a zip track along the top with a slider
function docBag(v, p, pal, zip = 1) {
  const w = 22, h = 28, th = 1.6, x0 = -w / 2;
  box(v, add3(p, [x0, 0, -th / 2]), add3(p, [x0 + w, h, th / 2]), pal, { after: (g) => {
    const Q = (x, y) => v.P(add3(p, [x, y, th / 2]));
    g.save(); g.lineWidth = LW * .8; g.strokeStyle = PAL.ink; g.lineJoin = 'round';
    // the card inside (a document)
    const c = [Q(-7, 5), Q(6, 5), Q(6, 19), Q(-7, 19)]; g.beginPath(); c.forEach((q, i) => i ? g.lineTo(...q) : g.moveTo(...q)); g.closePath(); g.stroke();
    for (const yy of [8, 11, 14]) { const a = Q(-5, yy), b = Q(3, yy); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }
    // zip track: closed part solid, open part dashed
    const zx = x0 + 1 + (w - 2) * zip, A = Q(x0 + 1, h - 3), B = Q(zx, h - 3), C = Q(x0 + w - 1, h - 3);
    g.lineWidth = LW * 1.1; g.beginPath(); g.moveTo(...A); g.lineTo(...B); g.stroke();
    if (zip < 1) { g.setLineDash([LW * 1.2, LW * 2]); g.beginPath(); g.moveTo(...B); g.lineTo(...C); g.stroke(); g.setLineDash([]); }
    // the slider
    const s0 = Q(zx - 1, h - 1.6), s1 = Q(zx + 1, h - 1.6), s2 = Q(zx + 1, h - 5), s3 = Q(zx - 1, h - 5);
    g.fillStyle = PAL.metal.top; g.beginPath(); [s0, s1, s2, s3].forEach((q, i) => i ? g.lineTo(...q) : g.moveTo(...q)); g.closePath(); g.fill(); g.stroke();
    g.restore(); } });
}
// The backpack. lid: 0 shut … 1 open (flap swung back over the hinge at the back top edge). contents(view) draws what is inside
// (between the inner walls and the front walls), so the opening shows it and the walls hide the rest.
function backpack(V, p, pal, o = {}) {
  const { w, d, h } = BAG, lid = o.lid ?? 0;
  const P3 = (x, y, z) => add3(p, [x, y, z]);
  // 1. the lid, behind when open
  const hinge = P3(0, h, 0), ang = -lid * 2.05;   // swings back about the x axis
  const xf = rotAbout(hinge, [1, 0, 0], ang);
  const lidPts = (dz) => [P3(-.5, h, 0), P3(w + .5, h, 0), P3(w + .5, h, d + 1.5 + dz), P3(-.5, h, d + 1.5 + dz)];
  const v1 = V();
  if (lid > .5) box(v1, P3(-.5, h, 0), P3(w + .5, h + 2.2, d + 1.5), pal, { xf });
  v1.flush(o.g);
  // 2. inner walls (seen only through the opening)
  const v2 = V(), dark = { top: pal.z, z: pal.x, x: pal.x };
  if (lid > 0) {
    poly3(v2, [P3(0, 0, 0), P3(0, h, 0), P3(0, h, d), P3(0, 0, d)], pal.x, { depth: -1e5 });
    poly3(v2, [P3(0, 0, 0), P3(w, 0, 0), P3(w, h, 0), P3(0, h, 0)], pal.z, { depth: -1e5 + 1 });
  }
  v2.flush(o.g);
  if (lid > 0 && o.contents) { const v3 = V(); o.contents(v3); v3.flush(o.g); }
  // 3. the front walls, the rim, the pocket, the closed lid
  const v4 = V();
  poly3(v4, [P3(w, 0, 0), P3(w, h, 0), P3(w, h, d), P3(w, 0, d)], pal.x, { depth: 1e4 });
  poly3(v4, [P3(0, 0, d), P3(w, 0, d), P3(w, h, d), P3(0, h, d)], pal.z, { depth: 1e4 + 1 });
  if (lid === 0) poly3(v4, [P3(0, h, 0), P3(w, h, 0), P3(w, h, d), P3(0, h, d)], pal.top, { depth: 1e4 + 2 });
  // two padded shoulder straps on the face toward us, and a side pocket with its zip: it reads as a backpack, not a box
  for (const sx of [6, w - 10]) box(v4, P3(sx, 7, d), P3(sx + 4, h - 4, d + 2.6), pal, { depth: 1e4 + 3 + sx * 1e-3 });
  box(v4, P3(w, 5, 4), P3(w + 4.5, 22, d - 4), pal, { depth: 1e4 + 3.5, after: (g) => {
    const a = v4.P(P3(w + 2.2, 22, 5.5)), b = v4.P(P3(w + 2.2, 22, d - 5.5)); g.save(); g.lineWidth = LW * .8; g.strokeStyle = PAL.ink; g.setLineDash([LW * .9, LW * 1.4]); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); g.restore(); } });
  if (lid > 0 && lid <= .5) box(v4, P3(-.5, h, 0), P3(w + .5, h + 2.2, d + 1.5), pal, { xf, depth: 1e4 + 4 });
  if (lid === 0) {   // the shut flap, overhanging the front a little, with a buckle strap
    box(v4, P3(-.5, h, -.5), P3(w + .5, h + 2.2, d + 1.5), pal, { depth: 1e4 + 4 });
    poly3(v4, [P3(w / 2 - 3, h + 2.2, d + 1.5), P3(w / 2 + 3, h + 2.2, d + 1.5), P3(w / 2 + 3, h - 10, d + 1.6), P3(w / 2 - 3, h - 10, d + 1.6)], pal.z, { depth: 1e4 + 5 });
  }
  // the carry handle on top, at the back
  cyl(v4, P3(w / 2 - 5, h + (lid ? 0 : 2.2), 1.2), P3(w / 2 + 5, h + (lid ? 0 : 2.2), 1.2), .9, pal, { depth: lid ? -1e3 : 1e4 + 6 });
  v4.flush(o.g);
  if (o.over) { const v5 = V(); o.over(v5); v5.flush(o.g); }
}

// ---------------- the state table: what is in the bag after each step ----------------
// [step, item, count, staging spot (bag coords, on the floor), resting place inside the bag]
const PACK = [
  [1, 'bottle', [-26, 0, 40], [7, 0, 6]], [1, 'bottle', [-14, 0, 46], [7, 0, 14.5]], [1, 'bottle', [-2, 0, 52], [16, 0, 6]],
  [2, 'can', [-28, 0, 38], [16, 0, 14.5]], [2, 'can', [-18, 0, 44], [25, 0, 6]], [2, 'bar', [-8, 0, 50], [24, 9.5, 14]], [2, 'bar', [-26, 0, 54], [24, 12.1, 14]], [2, 'opener', [-12, 0, 60], [25, 0, 15]],
  [3, 'flashlight', [-24, 0, 40], [14, 29, 7]], [3, 'radio', [-12, 0, 50], [19, 24, 12]], [3, 'battery', [-30, 0, 52], [7, 29, 15]], [3, 'power', [-2, 0, 58], [27, 24, 6]],
  [4, 'medicine', [-24, 0, 44], [9, 33, 11]], [4, 'doc', [-6, 0, 52], [16, 24, 3.5]],
];
const COUNTS = { 1: [['3×', 'bottle']], 2: [['2×', 'can'], ['2×', 'bar'], ['1×', 'opener']], 3: [['1×', 'flashlight'], ['1×', 'radio'], ['2×', 'battery'], ['1×', 'power']], 4: [['1×', 'medicine'], ['1×', 'doc']] };
const flyTimes = (k) => ({ 1: T.fly1, 2: T.fly2, 3: T.fly3, 4: [...T.fly4, T.docFly] }[k]);
const packedBy = (k) => PACK.filter((r) => r[0] < k);
function drawItem(v, name, p, pal, o) { ITEM[name](v, p, pal, o); }

// one step of packing: the staged items, the guide lines, each item flying in, the bag with what it already holds
const RIM = [16, 64, 10];
function flightPos(S, E, u) {   // up and over along an arc to above the opening, then straight down into the bag
  if (u < .62) { const k = eio(u / .62), m = lerp3(S, RIM, k); return add3(m, [0, Math.sin(Math.PI * k) * 14, 0]); }
  return lerp3(RIM, E, ss((u - .62) / .38));
}
function packStep(g, c, k, t, o = {}) {
  const V = () => c.V(o.bx ?? 640, o.by ?? 1010, o.s ?? 10.5), rows = PACK.filter((r) => r[0] === k), times = flyTimes(k);
  const inside = [], over = [];
  for (const r of packedBy(k)) inside.push([r[1], r[3], PAL.part]);
  rows.forEach((r, i) => {
    const t0 = times[i], u = seg(t, t0, t0 + FLY), pal = newPal(t, t0 + FLY + .1);
    if (u >= 1) inside.push([r[1], r[3], pal]);
    else if (u <= 0) over.push(['stage', r, pal, i]);
    else { const pos = flightPos(r[2], r[3], u); (u > .78 ? inside : over).push([r[1], pos, pal, true]); }
  });
  const zip = r => (r[1] === 'doc' ? { zip: k === 4 ? clamp(seg(t, T.zip0, T.zip1)) : 1 } : {});
  backpack(V, [0, 0, 0], PAL.part, {
    g, lid: 1,
    contents: (v) => inside.forEach(([n, p, pal]) => drawItem(v, n, p, pal, n === 'doc' ? { zip: 1 } : {})),
    over: (v) => {
      for (const it of over) {
        if (it[0] === 'stage') {
          const [, r, pal, i] = it, t0 = times[i];
          // the guide: dotted from where it waits to above the opening, drawn just before it flies
          const gk = seg(t, t0 - .35, t0);
          if (gk > 0 && gk < 1.01) { const pts = []; for (let j = 0; j <= 24; j++) pts.push(flightPos(r[2], r[3], .62 * j / 24)); const sc = pts.map(v.P), n = Math.ceil(24 * gk); v.add(1e6, (gg) => { for (let j = 0; j < n; j++) dashed(gg, sc[j], sc[j + 1], { lw: LW * .8 }); }, 3); }
          drawItem(v, r[1], r[2], pal, zip(r));
        } else drawItem(v, it[0], it[1], it[2], it[0] === 'doc' ? { zip: 1 } : {});
      }
    },
  });
}
// a parts call-out printed at the top of a step: counts and small white icons
function partsBox(g, c, k, t0, t) {
  const items = COUNTS[k], x = 270, y = 70, w = 760, h = 190, kk = seg(t, t0, t0 + .35);
  if (kk <= 0) return;
  rrect(g, c, x, y, w, h, 22, '#FFFFFF', kk);
  if (kk < .6) return;
  const cw = w / items.length;
  items.forEach(([n, name], i) => {
    printText(g, c, 'cnt' + i, n, x + cw * i + 24, y + h / 2 + 16, 46, 1, 600);
    const iv = c.V(x + cw * i + cw * .64, y + h * .74, { doc: 4.2, bottle: 4.6, radio: 5.2, power: 7, battery: 9, medicine: 8 }[name] ?? 8); drawItem(iv, name, [0, 0, 0], PAL.part, { zip: 1 }); setLW(lwFor(c.z) * .85); iv.flush(g); setLW(lwFor(c.z));
  });
}

// ---------------- the cells ----------------
function cover(g, c, t) {
  printText(g, c, 'h72', '72h', 60, 260, 230, seg(t, T.num0, T.num0 + .3), 800);
  printText(g, c, 'title', 'KIT DE EMERGÊNCIA', 66, 352, 66, seg(t, T.title, T.title + .3), 700);
  // the bag drops onto the page and settles; its lid opens after an arrow says how
  const land = back(seg(t, T.land, T.land + .45), 1.2), y = lerp(40, 0, land);
  const V = () => c.V(600, 1080, 10.2);
  const lid = eio(seg(t, T.lid0, T.lid1));
  const pal = newPal(t, T.pan1);
  g.save(); g.globalAlpha = clamp(seg(t, T.land - .05, T.land + .1));
  backpack(V, [0, y, 0], pal, { g, lid });
  g.restore();
  if (t >= T.lidArrow && t < T.lid1 + .5) {   // a rotation arrow over the hinge
    const v = V(); g.save(); g.globalAlpha = seg(t, T.lidArrow, T.lidArrow + .2) * (1 - seg(t, T.lid1, T.lid1 + .5));
    turnArrow(v, [-3, BAG.h, 0], [1, 0, 0], [0, 0, 1], 24, .15, 1.75, 2.6 * c.z * 4.2); v.flush(g); g.restore();
  }
}
function cart(v, p, pal) {   // an overloaded shopping cart: a wire basket, wheels, boxes piled far over the top
  const P3 = (x, y, z) => add3(p, [x, y, z]);
  for (const [x, z] of [[2, 2], [38, 2], [2, 24], [38, 24]]) cyl(v, P3(x, 0, z), P3(x, 3.2, z), 2.2, PAL.metal);
  box(v, P3(0, 6, 0), P3(42, 30, 26), { top: PAL.paper, z: '#FFFFFF', x: '#F3F0E8' }, { after: (g) => {
    g.save(); g.lineWidth = LW * .6; g.strokeStyle = PAL.ink;
    for (let i = 1; i < 6; i++) { const a = v.P(P3(42 * i / 6, 6, 26)), b = v.P(P3(42 * i / 6, 30, 26)); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }
    for (let i = 1; i < 4; i++) { const a = v.P(P3(42, 6, 26 * i / 4)), b = v.P(P3(42, 30, 26 * i / 4)); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }
    g.restore(); } });
  cyl(v, P3(-6, 34, 2), P3(-6, 34, 24), 1.1, PAL.metal, { bias: -50 });
  const pile = [[2, 30, 2, 20, 14, 12], [22, 30, 3, 18, 12, 11], [4, 30, 14, 16, 16, 11], [22, 30, 14, 18, 10, 11], [6, 44, 4, 14, 12, 12], [20, 42, 8, 16, 14, 10], [10, 56, 6, 12, 10, 10], [24, 56, 10, 10, 12, 8], [14, 68, 8, 10, 8, 9]];
  for (const [x, y, z, w, h, d] of pile) box(v, P3(x, y, z), P3(x + w, y + h, z + d), pal);
}
function doDont(g, c, t) {
  const B = DDBOX, kb = seg(t, T.box, T.box + .35);
  rrect(g, c, B.x, B.y, B.w, B.h, 34, '#FFFFFF', kb);
  if (kb < .6) return;
  const [lx, ly] = c.T(B.x + B.w / 2, B.y + 30), [, ly2] = c.T(0, B.y + B.h - 30);
  g.save(); g.strokeStyle = PAL.ink; g.lineWidth = LW; g.beginPath(); g.moveTo(lx, ly); g.lineTo(lx, ly2); g.stroke(); g.restore();
  appear(g, T.cart, (gg) => { const v = c.V(B.x + B.w * .25 - 10, B.y + B.h * .74, 5.0); cart(v, [-20, 0, -13], PAL.part); v.flush(gg); });
  appear(g, T.okBag, (gg) => { const v = c.V(B.x + B.w * .75 - 20, B.y + B.h * .78, 7.6); backpack(() => v, [-16, 0, -10], PAL.part, { g: gg, lid: 0 }); });
  const xk = seg(t, T.xMark, T.xMark + .16), ok = seg(t, T.okMark, T.okMark + .16);
  if (xk > 0) { const [x, y] = c.T(B.x + 70, B.y + 74); const s = (1 + .5 * (1 - eo(xk))) * 62 * c.z; cross(g, x, y, s, 11 * c.z); }
  if (ok > 0) { const [x, y] = c.T(B.x + B.w / 2 + 70, B.y + 74); const s = (1 + .5 * (1 - eo(ok))) * 66 * c.z; tick(g, x, y, s, 11 * c.z); }
}
function step(k) {
  return (g, c, t) => {
    const t0 = { 1: T.s1, 2: T.pan2e - .2, 3: T.pan3e - .2, 4: T.pan4e - .2 }[k];
    stepNum(g, c, k, t0, t);
    partsBox(g, c, k, t0 + .15, t);
    appear(g, t0 + .05, (gg) => packStep(gg, c, k, t));
    if (k === 4) magnifier4(g, c, t);
  };
}
// step 4: the magnifier over the zip of the document bag; a hand pinches the slider along until the bag is sealed
function magnifier4(g, c, t) {
  const mk = seg(t, T.mag, T.mag + .3), out = seg(t, T.docFly - .3, T.docFly);
  if (mk <= 0 || out >= 1) return;
  const r = PACK.find((q) => q[1] === 'doc'), base = c.V(640, 1010, 10.5);
  const spot = base.P(add3(r[2], [-10 + 20 * seg(t, T.zip0, T.zip1), 25, .8]));
  const [mx, my] = c.T(330, 560), R = 215 * c.z * (.4 + .6 * back(mk)), zip = seg(t, T.zip0, T.zip1);
  g.save(); g.globalAlpha = 1 - out;
  magnifier(g, spot, mx, my, R, (gg) => {
    const v = makeView({ cx: mx, cy: my + 40 * c.z, s: 34 * c.z }), sx = -10 + 20 * zip;
    const p = [-sx, -25, 0];   // the bag placed so the slider sits at the circle's centre
    docBag(v, p, PAL.part, zip); v.flush(gg);
    const v2 = makeView({ cx: mx, cy: my + 40 * c.z, s: 34 * c.z });
    hand(v2, { tipAt: add3(p, [sx + 1, 26.2, 1.6]), dir: [-.15, .55, -.82], palm: [-.9, -.1, .2], side: 'r', pose: 'pinch', sleeve: PAL.grey1, frame: { cx: mx, cy: my, r: R }, scale: .9 });
    v2.flush(gg);
    if (zip > 0 && zip < 1) { const pts = [v.P(add3(p, [sx + 2.4, 29.5, .8])), v.P(add3(p, [sx + 7.5, 29.5, .8]))]; arrow2(gg, pts, 7 * c.z, { halo: 4 * c.z }); }
    if (t > T.zip1 && t < T.zip1 + .5) { const q = v.P(add3(p, [sx + 1, 28, .8])); clickMark(gg, q[0], q[1], 16 * c.z, -Math.PI / 3, 2.6 * c.z); }
  }, { spotR: 22 * c.z });
  g.restore();
}
// step 5: the bag is shut, then follows an arrow lying on the floor to its place beside the door
const DOOR = { x0: 38, x1: 78, h: 96 };
function step5(g, c, t) {
  stepNum(g, c, 5, T.pan5e - .2, t);
  appear(g, T.pan5e - .15, (gg) => {
    const V = () => c.V(470, 1000, 5.4), v0 = V();
    // the room corner: a wall behind (z = -30) with a door, the floor line
    const Z0 = -30, X0 = -60, X1 = 110;
    poly3(v0, [[X0, 0, Z0], [X1, 0, Z0], [X1, 120, Z0], [X0, 120, Z0]], '#FFFFFF', { depth: -1e5 });
    poly3(v0, [[DOOR.x0, 0, Z0], [DOOR.x1, 0, Z0], [DOOR.x1, DOOR.h, Z0], [DOOR.x0, DOOR.h, Z0]], PAL.part.z, { depth: -1e5 + 1 });
    poly3(v0, [[DOOR.x0 + 3, 0, Z0], [DOOR.x1 - 3, 0, Z0], [DOOR.x1 - 3, DOOR.h - 3, Z0], [DOOR.x0 + 3, DOOR.h - 3, Z0]], PAL.part.top, { depth: -1e5 + 2 });
    cyl(v0, [DOOR.x1 - 9, 46, Z0], [DOOR.x1 - 9, 46, Z0 + 3], 1.6, PAL.metal, { depth: -1e5 + 3 });
    v0.flush(gg);
    const k = ss(seg(t, T.slide0, T.slide1)), settle = Math.sin(seg(t, T.slide1, T.slide1 + .3) * Math.PI) * 1.2;
    const from = [-46, 0, 40], to = [4, 0, -26], p = add3(lerp3(from, to, k), [0, 0, 0]);
    const ak = seg(t, T.arrow5, T.arrow5 + .3);
    if (ak > 0 && t < T.slide1 + .6) {   // the arrow lies on the floor, first; then the bag follows it once
      const va = V(); gg.save(); gg.globalAlpha = ak * (1 - seg(t, T.slide1 + .2, T.slide1 + .6));
      planeArrow(va, [-8, .1, 40], [.83, 0, -.56], [.56, 0, .83], 44 * ak, 7, { depth: -1e4 }); va.flush(gg); gg.restore();
    }
    const lid = 1 - eio(seg(t, T.lidShut0, T.lidShut1));
    const bp = add3(p, [0, settle, 0]);
    backpack(V, bp, newPal(t, T.slide1 + .25), { g: gg, lid, contents: (v) => PACK.forEach((r) => drawItem(v, r[1], add3(bp, r[3]), PAL.part, { zip: 1 })) });
  });
}
// step 6: a calendar, a rotation arrow round it, "6 meses"; at the very end it turns yellow: the one thing that never ends
function step6(g, c, t) {
  stepNum(g, c, 6, T.pan6e - .2, t);
  printText(g, c, 'mes', '6 meses', 640, 230, 70, seg(t, T.turn0, T.turn0 + .3), 700);
  printText(g, c, 'tel', 'Defesa Civil 199 · Bombeiros 193', 60, 1250, 54, seg(t, T.cal + .2, T.cal + .5), 600);
  appear(g, T.cal, (gg) => {
    const v = c.V(560, 900, 11), gold = seg(t, T.gold, T.gold + .35);
    const pal = mixPal(PAL.part, PAL.neu, gold);
    const p = [-14, 0, 0];
    box(v, p, add3(p, [28, 32, 3]), pal, { after: (g2) => {   // the page of a month, a grid of days, two rings on top
      g2.save(); g2.lineWidth = LW * .7; g2.strokeStyle = PAL.ink;
      const Q = (x, y) => v.P(add3(p, [x, y, 3]));
      const a = Q(2, 25), b = Q(26, 25); g2.beginPath(); g2.moveTo(...a); g2.lineTo(...b); g2.stroke();
      for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) { const q = Q(4.4 + i * 4.8, 21 - j * 5); g2.beginPath(); g2.arc(q[0], q[1], 1.0 * v.s * .6, 0, Math.PI * 2); g2.stroke(); }
      g2.restore(); } });
    for (const x of [7, 21]) cyl(v, add3(p, [x, 30, 1.5]), add3(p, [x, 35, 1.5]), 1.1, PAL.metal, { bias: 5 });
    v.flush(gg);
    const tk = eio(seg(t, T.turn0, T.turn1));
    if (tk > 0) { const va = c.V(560, 900, 11); turnArrow(va, [0, 16, 1.5], [.35, .2, 1], [1, 0, 0], 27, -.4, -.4 + 5.2 * tk + .01, 3.1 * 11 * c.z / 3, {}); va.flush(gg); }
  });
}
const CELL = { cover, dd: doDont, 1: step(1), 2: step(2), 3: step(3), 4: step(4), 5: step5, 6: step6 };

// ---------------- page furniture ----------------
function connectors(g, cm) {
  const z = cm.z, S = (x, y) => [(x - cm.x) * z + W / 2, (y - cm.y) * z + H / 2];
  const lw = Math.max(1, lwFor(z) * .8), dash = [2 * Math.max(.5, z ** .5), 10 * Math.max(.5, z ** .5)];
  for (let i = 0; i < ORDER.length - 1; i++) {
    const a = cellO(ORDER[i]), b = cellO(ORDER[i + 1]);
    let p, q;
    if (a[1] === b[1]) { const dir = Math.sign(b[0] - a[0]); p = [a[0] + (dir > 0 ? CW - 30 : 30), a[1] + CH / 2]; q = [b[0] + (dir > 0 ? 30 : CW - 30), b[1] + CH / 2]; }
    else { p = [a[0] + CW / 2, a[1] + CH - 20]; q = [b[0] + CW / 2, b[1] + 20]; }
    dashed(g, S(...p), S(...q), { lw, dash });
  }
}
let paperTex = null;
function paper(g, cm) {
  if (!paperTex) {
    const N = 1024, cv = document.createElement('canvas'); cv.width = cv.height = N; const pg = cv.getContext('2d');
    pg.fillStyle = PAL.paper; pg.fillRect(0, 0, N, N); let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 760; i++) { const x = r() * N, y = r() * N, a = r() * Math.PI, l = 4 + r() * 16; pg.strokeStyle = r() < .5 ? 'rgba(120,105,80,0.05)' : 'rgba(255,255,255,0.22)'; pg.lineWidth = .6 + r() * .6;
      for (const ox of [-N, 0, N]) for (const oy of [-N, 0, N]) { pg.beginPath(); pg.moveTo(x + ox, y + oy); pg.lineTo(x + ox + Math.cos(a) * l, y + oy + Math.sin(a) * l * .4); pg.stroke(); } }
    for (let i = 0; i < 80; i++) { pg.fillStyle = 'rgba(90,80,60,0.10)'; pg.fillRect(r() * N, r() * N, 1 + r(), 1 + r()); }
    paperTex = pg.createPattern(cv, 'repeat');
  }
  const ox = ((-cm.x * cm.z) % 1024 + 1024) % 1024, oy = ((-cm.y * cm.z) % 1024 + 1024) % 1024;
  g.save(); g.translate(ox, oy); g.fillStyle = paperTex; g.fillRect(-ox, -oy, W, H); g.restore();
}

// ---------------- subtitles: Portuguese only, bottom left, a yellow bar on the line being spoken ----------------
function wrap(g, text, maxW) {
  const out = []; let line = '';
  for (const w of text.split(' ')) { const tryL = line ? line + ' ' + w : w; if (g.measureText(tryL).width > maxW && line) { out.push(line); line = w; } else line = tryL; }
  if (line) out.push(line); return out;
}
function subtitles(g, t) {
  for (const s of TL.subs) {
    if (t < s.t0 || t >= s.t1) continue;
    const a = Math.min(seg(t, s.t0, s.t0 + .12), 1 - seg(t, s.t1 - .12, s.t1)), x = 92, size = 56, lh = 70;
    g.save(); g.globalAlpha = a; g.font = `600 ${size}px ${FONT}`;
    const L = wrap(g, s.text, W - x - 70), y0 = H - 250 - (L.length - 1) * lh * .5;
    const wMax = Math.max(...L.map((l) => g.measureText(l).width));
    g.fillStyle = 'rgba(244,241,234,0.88)'; g.beginPath(); g.roundRect(x - 44, y0 - size - 12, wMax + 80, L.length * lh + 34, 12); g.fill();
    g.fillStyle = PAL.ink; L.forEach((l, i) => g.fillText(l, x, y0 + i * lh));
    g.fillStyle = PAL.neu.z; g.fillRect(x - 28, y0 - size + 6, 10, L.length * lh - 6);
    g.restore();
  }
}

// ---------------- the frame ----------------
function drawPage(g, t, cm) {
  paper(g, cm);
  if (t >= T.portal && t < T.portal + .45) {   // just through the ✓ cell: its white still around us
    g.save(); g.globalAlpha = 1 - ss(seg(t, T.portal, T.portal + .45)); g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, W, H); g.restore();
  }
  setLW(lwFor(cm.z));
  connectors(g, cm);
  const vis = (k) => { const [ox, oy] = cellO(k), m = 260; return (ox + CW + m - cm.x) * cm.z + W / 2 > 0 && (ox - m - cm.x) * cm.z + W / 2 < W && (oy + CH + m - cm.y) * cm.z + H / 2 > 0 && (oy - m - cm.y) * cm.z + H / 2 < H; };
  for (const k of ORDER) if (vis(k)) CELL[k](g, ctx(k, cm), t);
}
function frame(g, t) { NOW = t; drawPage(g, t, cam(t)); }

let SUB = null;
export function setup() { buildKeys(); }
export function render(g, t) {
  g.setTransform(1, 0, 0, 1, 0, 0); TXT = new Map();
  const dt = 1 / 30, a = cam(t - dt * .25), b = cam(t + dt * .25);
  const dx = (b.x - a.x) * b.z, dy = (b.y - a.y) * b.z, dz = Math.abs(Math.log(b.z / a.z)) * 1100;
  const cut = Math.abs(t - T.portal) < dt * .6;
  if (!SUB) { SUB = document.createElement('canvas'); SUB.width = W; SUB.height = H; }
  const sg = SUB.getContext('2d');
  if (!cut && dz > 10) {
    const n = Math.min(14, Math.ceil(dz / 5));
    for (let i = 0; i < n; i++) { REC = i === n >> 1; sg.setTransform(1, 0, 0, 1, 0, 0); frame(sg, t + dt * .5 * ((i + .5) / n - .5)); g.globalAlpha = 1 / (i + 1); g.drawImage(SUB, 0, 0); }
    REC = true; g.globalAlpha = 1;
  } else if (!cut && Math.hypot(dx, dy) > 6) {
    const n = Math.min(40, Math.ceil(Math.hypot(dx, dy) / 2.5));
    sg.setTransform(1, 0, 0, 1, 0, 0); frame(sg, t);
    g.fillStyle = PAL.paper; g.fillRect(0, 0, W, H);
    for (let i = 0; i < n; i++) { const k = (i + .5) / n - .5; g.globalAlpha = 1 / (i + 1); g.drawImage(SUB, -dx * k, -dy * k); }
    g.globalAlpha = 1;
  } else frame(g, t);
  subtitles(g, t);
}

// ---------------- sound cues for mix.py ----------------
export function events() {
  const E = [];
  E.push({ t: T.land + .35, type: 'land' }, { t: T.num0, type: 'print' }, { t: T.title, type: 'print' }, { t: T.lid0, type: 'lid', d: T.lid1 - T.lid0 });
  for (const [a, b] of [[T.pan1, T.pan1e], [T.pan2, T.pan2e], [T.pan3, T.pan3e], [T.pan4, T.pan4e], [T.pan5, T.pan5e], [T.pan6, T.pan6e]]) E.push({ t: a, type: 'slide', d: b - a });
  E.push({ t: T.box, type: 'pop' }, { t: T.cart, type: 'draw', d: .9 }, { t: T.stop, type: 'stop' }, { t: T.xMark, type: 'stamp' }, { t: T.okBag, type: 'draw', d: .9 }, { t: T.okMark, type: 'tick' });
  E.push({ t: T.push, type: 'push', d: T.portal - T.push }, { t: T.portal, type: 'portal' });
  let n = 0;
  for (const k of [1, 2, 3, 4]) {
    const t0 = { 1: T.s1, 2: T.pan2e - .2, 3: T.pan3e - .2, 4: T.pan4e - .2 }[k];
    E.push({ t: t0, type: 'print' }, { t: t0 + .15, type: 'pop' }, { t: t0 + .05, type: 'draw', d: .8 });
    PACK.filter((r) => r[0] === k).forEach((r, i) => { const tf = flyTimes(k)[i]; E.push({ t: tf - .35, type: 'guide' }, { t: tf, type: 'rise', d: FLY, name: r[1] }, { t: tf + FLY * .9, type: 'drop', name: r[1], n: n++ }); });
  }
  E.push({ t: T.mag, type: 'mag' }, { t: T.zip0, type: 'zip', d: T.zip1 - T.zip0 }, { t: T.zip1, type: 'click' });
  E.push({ t: T.pan5e - .2, type: 'print' }, { t: T.lidShut0, type: 'lid', d: T.lidShut1 - T.lidShut0 }, { t: T.lidShut1, type: 'buckle' }, { t: T.arrow5, type: 'guide' }, { t: T.slide0, type: 'scrape', d: T.slide1 - T.slide0 }, { t: T.slide1, type: 'set' });
  E.push({ t: T.pan6e - .2, type: 'print' }, { t: T.cal, type: 'draw', d: .8 }, { t: T.turn0, type: 'turn', d: T.turn1 - T.turn0 }, { t: T.out0, type: 'out', d: T.out1 - T.out0 }, { t: T.gold, type: 'gold' });
  for (const [k, v] of Object.entries(TL.vo)) E.push({ t: v[0], type: 'vo', id: k });
  return E.sort((a, b) => a.t - b.t);
}
