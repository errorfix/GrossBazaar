"use client";

import { useEffect, useRef, useState } from "react";

/* ─── Story timeline (P = 0 → 1 across the pinned scroll) ──────────────────── */
const SCAN: [number, number] = [0.1, 0.3];
const MOVE: [number, number] = [0.33, 0.88];
const FLIGHT = 0.07; // share of P a crate spends in the air
const RETURN = 0.05; // share of P value takes to travel back
const PHASE_AT = [0, 0.1, 0.33, 0.88, 1];
const PILLAR_MAX = 7;

/* ─── World (isometric grid units) ─────────────────────────────────────────── */
const SIZE = 6;
const LAYERS = 4;
const DOCKS = [
  { x: 12, y: -3, label: "Wholesale & distribution", short: "Wholesale" },
  { x: 12, y: 1, label: "Regional retailers", short: "Retail" },
  { x: 12, y: 5, label: "Refurbishers & resellers", short: "Refurbish" },
  { x: 12, y: 9, label: "Institutions & NGOs", short: "NGOs" },
];
// Portrait (phones): buyers stack in a column under the warehouse, so stock
// cascades down the screen and value climbs back up. Labels sit to the right.
const DOCKS_PORTRAIT = DOCKS.map((d, i) => ({ ...d, x: 7.6 + i * 2.5, y: 9.6 + i * 2.5 }));
const STAYS = new Set(["0,5,0", "1,5,0", "5,5,0"]); // not every lot finds a buyer

type Crate = { x: number; y: number; z: number; dock: number; depart: number; stays: boolean };
const CRATES: Crate[] = (() => {
  const list: Crate[] = [];
  for (let z = 0; z < LAYERS; z++)
    for (let x = 0; x < SIZE; x++)
      for (let y = 0; y < SIZE; y++) {
        // The core is hollow below the top layer: that is where the capital sits.
        const core = x >= 2 && x <= 3 && y >= 2 && y <= 3;
        if (core && z < LAYERS - 1) continue;
        list.push({ x, y, z, dock: Math.min(3, Math.floor(y / 1.5)), depart: Infinity, stays: STAYS.has(`${x},${y},${z}`) });
      }
  // Peel from the top layer, starting with the side nearest the buyers.
  const moving = list.filter((c) => !c.stays).sort((a, b) => b.z - a.z || b.x - a.x || a.y - b.y);
  const span = MOVE[1] - MOVE[0] - FLIGHT - RETURN;
  moving.forEach((c, i) => (c.depart = MOVE[0] + (i / (moving.length - 1)) * span));
  return list;
})();
const MOVING = CRATES.filter((c) => !c.stays);

const PHASES = [
  {
    tag: "Before Gross-Bazaar",
    head: "Good Inventory Shouldn’t Remain Stuck.",
    body: "Seasonal shifts, excess production, cancelled orders and discontinued lines leave usable stock on the shelf, holding space and capital.",
  },
  {
    tag: "Assess",
    head: "We Understand What You Hold.",
    body: "Category, quantity, condition, location and resale restrictions are reviewed before anything is shared.",
  },
  {
    tag: "Match & move",
    head: "Relevant Buyers, Confidentially.",
    body: "Suitable lots are introduced to screened buyers. Supplier details are released only with your authorisation.",
  },
  {
    tag: "After Gross-Bazaar",
    head: "Space Freed. Capital Back at Work.",
    body: "As lots find the right buyers they leave the warehouse, and the value locked inside them returns to the business.",
  },
];
const RAIL = ["Before", "Assess", "Match", "After"];

/* ─── Math helpers ─────────────────────────────────────────────────────────── */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
type V3 = [number, number, number];
const bezier = (a: V3, c: V3, b: V3, t: number): V3 => {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1], u * u * a[2] + 2 * u * t * c[2] + t * t * b[2]];
};
const C30 = Math.cos(Math.PI / 6);
const unitProj = (x: number, y: number, z: number): [number, number] => [(x - y) * C30, (x + y) * 0.5 - z];

type Palette = Record<string, string>;
const SCENE_TOKENS = [
  "--scene-bg", "--scene-grid", "--scene-dock-top", "--scene-dock-side", "--scene-signal", "--scene-label",
  "--scene-label-strong", "--scene-crate-top", "--scene-crate-left", "--scene-crate-right", "--scene-crate-tape",
  "--scene-crate-edge", "--scene-value-top", "--scene-value-left", "--scene-value-right",
];
type Layout = { u0: number; cx: number; cy: number; overview: [number, number]; mobile: boolean; docks: typeof DOCKS };

function phaseOf(P: number) {
  return P < PHASE_AT[1] ? 0 : P < PHASE_AT[2] ? 1 : P < PHASE_AT[3] ? 2 : 3;
}

/* ─── Renderer ─────────────────────────────────────────────────────────────── */
function render(ctx: CanvasRenderingContext2D, w: number, h: number, P: number, time: number, L: Layout, pal: Palette, mono: string, still: boolean) {
  ctx.clearRect(0, 0, w, h);

  // Camera: close on the stock → pull back to the network → settle on the result.
  const k1 = smooth(0.06, 0.4, P);
  const fStack = unitProj(3, 3, 2);
  const fx = lerp(fStack[0], L.overview[0], k1);
  const fy = lerp(fStack[1], L.overview[1], k1);
  const zoom = lerp(L.mobile ? 1.25 : 1.45, 1, k1);
  const u = L.u0 * zoom;
  const ox = L.cx - fx * u;
  const oy = L.cy - fy * u;
  const pr = (x: number, y: number, z: number): [number, number] => [ox + (x - y) * C30 * u, oy + (x + y) * 0.5 * u - z * u];

  const poly = (pts: [number, number][], fill: string | null, stroke?: string, lw = 1) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lw;
      ctx.stroke();
    }
  };
  const box = (x: number, y: number, z: number, bw: number, bd: number, bh: number, top: string, left: string, right: string, edge?: string) => {
    const t = z + bh;
    poly([pr(x + bw, y, z), pr(x + bw, y + bd, z), pr(x + bw, y + bd, t), pr(x + bw, y, t)], right, edge, 0.75);
    poly([pr(x, y + bd, z), pr(x + bw, y + bd, z), pr(x + bw, y + bd, t), pr(x, y + bd, t)], left, edge, 0.75);
    poly([pr(x, y, t), pr(x + bw, y, t), pr(x + bw, y + bd, t), pr(x, y + bd, t)], top, edge, 0.75);
  };
  const line = (a: [number, number], b: [number, number], color: string, lw: number) => {
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.stroke();
  };
  const label = (text: string, x: number, y: number, align: CanvasTextAlign, color: string, alpha = 1, size = 10.5) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = `500 ${size}px ${mono}`;
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "1.2px";
    ctx.textAlign = align;
    ctx.fillStyle = color;
    ctx.fillText(text.toUpperCase(), x, y);
    ctx.restore();
  };

  /* Floor grid */
  ctx.save();
  ctx.globalAlpha = 0.55;
  for (let i = -6; i <= 18; i++) {
    line(pr(i, -6, 0), pr(i, 14, 0), pal["--scene-grid"], 1);
    line(pr(-6, i - 4, 0), pr(18, i - 4, 0), pal["--scene-grid"], 1);
  }
  ctx.restore();
  // Vignette so the grid dissolves into the band.
  const vg = ctx.createRadialGradient(L.cx, L.cy, Math.min(w, h) * 0.2, L.cx, L.cy, Math.max(w, h) * 0.62);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, pal["--scene-bg"]);
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);

  /* Warehouse footprint */
  const after = smooth(0.8, 0.95, P);
  ctx.save();
  ctx.setLineDash([5, 6]);
  poly([pr(-0.2, -0.2, 0), pr(6.2, -0.2, 0), pr(6.2, 6.2, 0), pr(-0.2, 6.2, 0)], null, pal["--scene-label"], 1);
  ctx.restore();
  const foot = pr(6.2, 6.2, 0);
  label("Your warehouse", foot[0], foot[1] + 26, "center", pal["--scene-label"], 0.8 * (1 - after));
  label("Space freed", foot[0], foot[1] + 26, "center", pal["--scene-value-left"], after);

  /* Docks (buyers) */
  const pulses = L.docks.map(() => 0);
  const received = L.docks.map(() => 0);
  const bound = L.docks.map(() => 0);
  for (const c of MOVING) {
    const arrive = c.depart + FLIGHT;
    bound[c.dock]++;
    if (P >= arrive) {
      received[c.dock]++;
      pulses[c.dock] = Math.max(pulses[c.dock], 1 - (P - arrive) / 0.03);
    }
  }
  const docksIn = smooth(0.22, 0.4, P);
  L.docks.forEach((d, i) => {
    ctx.save();
    ctx.globalAlpha = docksIn;
    box(d.x + 0.1, d.y + 0.1, 0, 1.8, 1.8, 0.22, pal["--scene-dock-top"], pal["--scene-dock-side"], pal["--scene-dock-side"]);
    poly([pr(d.x + 0.1, d.y + 0.1, 0.22), pr(d.x + 1.9, d.y + 0.1, 0.22), pr(d.x + 1.9, d.y + 1.9, 0.22), pr(d.x + 0.1, d.y + 1.9, 0.22)], null, pal["--scene-signal"], 1.25);
    const p = clamp01(pulses[i]);
    if (p > 0) {
      const g = 1 + (1 - p) * 0.9;
      const cx = d.x + 1;
      const cy = d.y + 1;
      ctx.globalAlpha = docksIn * p;
      poly([pr(cx - g, cy - g, 0.22), pr(cx + g, cy - g, 0.22), pr(cx + g, cy + g, 0.22), pr(cx - g, cy + g, 0.22)], null, pal["--scene-value-left"], 2);
    }
    ctx.restore();
    // Each buyer's dock fills with the lots it has taken.
    const share = received[i] / Math.max(1, bound[i]);
    const count = Math.ceil(share * 3);
    for (let k = 0; k < count; k++) {
      const off = [[0.25, 0.25], [1.0, 0.25], [0.6, 0.95]][k];
      box(d.x + off[0], d.y + off[1], 0.22, 0.72, 0.72, 0.7, pal["--scene-value-top"], pal["--scene-value-left"], pal["--scene-value-right"], pal["--scene-crate-edge"]);
    }
    const anchor = pr(d.x + 2, d.y, 0.22);
    label(L.mobile ? d.short : d.label, anchor[0] + 12, anchor[1] + 4, "left", p > 0.2 ? pal["--scene-label-strong"] : pal["--scene-label"], docksIn);
  });
  if (docksIn > 0 && !L.mobile) {
    const top = pr(L.docks[0].x + 2, L.docks[0].y, 0.22);
    label("Relevant buyers", top[0] + 12, top[1] - 22, "left", pal["--scene-signal"], docksIn, 10);
  }

  /* Static crates + the value pillar, painter-sorted */
  const scanX = lerp(-0.8, 6.8, smooth(SCAN[0], SCAN[1], P));
  let returned = 0;
  for (const c of MOVING) returned += clamp01((P - (c.depart + FLIGHT)) / RETURN);
  const H = (PILLAR_MAX * returned) / MOVING.length;

  type Item = { key: number; draw: () => void };
  const items: Item[] = [];
  for (const c of CRATES) {
    if (!c.stays && P >= c.depart) continue;
    items.push({
      key: c.x + c.y + c.z,
      draw: () => {
        box(c.x + 0.05, c.y + 0.05, c.z, 0.9, 0.9, 0.88, pal["--scene-crate-top"], pal["--scene-crate-left"], pal["--scene-crate-right"], pal["--scene-crate-edge"]);
        const tagged = c.x + 0.5 < scanX;
        line(pr(c.x + 0.5, c.y + 0.12, c.z + 0.88), pr(c.x + 0.5, c.y + 0.88, c.z + 0.88), tagged ? pal["--scene-signal"] : pal["--scene-crate-tape"], tagged ? 2 : 1.5);
      },
    });
  }
  if (H > 0.01) {
    for (const [cx, cy] of [[2, 2], [3, 2], [2, 3], [3, 3]] as const) {
      for (let k = 0; k < Math.ceil(H); k++) {
        const segH = Math.min(1, H - k);
        items.push({ key: cx + cy + k, draw: () => box(cx, cy, k, 1, 1, segH, pal["--scene-value-top"], pal["--scene-value-left"], pal["--scene-value-right"]) });
      }
    }
  }
  items.sort((a, b) => a.key - b.key);
  for (const it of items) it.draw();

  /* Pillar glow + label */
  if (H > 0.4) {
    const top = pr(3, 3, H);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const g = ctx.createRadialGradient(top[0], top[1], 0, top[0], top[1], u * 3.2);
    g.addColorStop(0, "rgba(240,170,60,0.35)");
    g.addColorStop(1, "rgba(240,170,60,0)");
    ctx.fillStyle = g;
    ctx.fillRect(top[0] - u * 4, top[1] - u * 4, u * 8, u * 8);
    ctx.restore();
    label("Capital returned", top[0], top[1] - u * 1.25 - 10, "center", pal["--scene-value-top"], smooth(4.2, 5.2, H));
  }

  /* Scanner plane */
  const scanVis = smooth(SCAN[0] - 0.02, SCAN[0] + 0.02, P) * (1 - smooth(SCAN[1], SCAN[1] + 0.04, P));
  if (scanVis > 0) {
    ctx.save();
    ctx.globalAlpha = scanVis;
    poly([pr(scanX, -0.6, 0), pr(scanX, 6.6, 0), pr(scanX, 6.6, 4.9), pr(scanX, -0.6, 4.9)], "rgba(70,160,225,0.14)");
    line(pr(scanX, -0.6, 4.9), pr(scanX, 6.6, 4.9), pal["--scene-signal"], 2);
    line(pr(scanX, -0.6, 0), pr(scanX, -0.6, 4.9), pal["--scene-signal"], 1);
    line(pr(scanX, 6.6, 0), pr(scanX, 6.6, 4.9), pal["--scene-signal"], 1);
    const tagPos = pr(scanX, -0.6, 4.9);
    label("Assessing", tagPos[0] + 8, tagPos[1] - 8, "left", pal["--scene-signal"], scanVis, 10);
    ctx.restore();
  }

  /* Crates in flight, with trails */
  const flying = MOVING.filter((c) => P >= c.depart && P < c.depart + FLIGHT);
  for (const c of flying) {
    const raw = (P - c.depart) / FLIGHT;
    const t = easeInOut(raw);
    const d = L.docks[c.dock];
    const a: V3 = [c.x + 0.5, c.y + 0.5, c.z];
    const b: V3 = [d.x + 1, d.y + 1, 0.25];
    const ctrl: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, Math.max(a[2], b[2]) + 5.5];
    // trail
    ctx.save();
    ctx.globalAlpha = 0.45 * (1 - smooth(0.85, 1, raw));
    ctx.beginPath();
    for (let s = 0; s <= 10; s++) {
      const q = bezier(a, ctrl, b, Math.max(0, t - 0.32) + (s / 10) * Math.min(t, 0.32));
      const sp = pr(q[0], q[1], q[2] + 0.45);
      if (s === 0) ctx.moveTo(sp[0], sp[1]);
      else ctx.lineTo(sp[0], sp[1]);
    }
    ctx.strokeStyle = pal["--scene-value-left"];
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    // crate: card → saffron as it is matched, shrinks into the dock
    const pos = bezier(a, ctrl, b, t);
    const s = 0.9 * (1 - 0.45 * smooth(0.75, 1, raw));
    ctx.save();
    ctx.globalAlpha = 1 - smooth(0.9, 1, raw);
    box(pos[0] - s / 2, pos[1] - s / 2, pos[2], s, s, s * 0.98, pal["--scene-crate-top"], pal["--scene-crate-left"], pal["--scene-crate-right"], pal["--scene-crate-edge"]);
    ctx.globalAlpha *= smooth(0, 0.3, raw);
    box(pos[0] - s / 2, pos[1] - s / 2, pos[2], s, s, s * 0.98, pal["--scene-value-top"], pal["--scene-value-left"], pal["--scene-value-right"], pal["--scene-crate-edge"]);
    ctx.restore();
  }

  /* Value travelling back to the pillar */
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const c of MOVING) {
    const r = (P - (c.depart + FLIGHT)) / RETURN;
    if (r <= 0 || r >= 1) continue;
    const d = L.docks[c.dock];
    const a: V3 = [d.x + 1, d.y + 1, 0.4];
    const b: V3 = [3, 3, H];
    const ctrl: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, Math.max(H, 2) + 4];
    for (let s = 0; s < 4; s++) {
      const q = bezier(a, ctrl, b, clamp01(easeInOut(r) - s * 0.04));
      const sp = pr(q[0], q[1], q[2]);
      ctx.fillStyle = `rgba(245,180,70,${0.85 - s * 0.2})`;
      ctx.beginPath();
      ctx.arc(sp[0], sp[1], 3 - s * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  /* Before: dust hanging over idle stock */
  const dust = 1 - smooth(0.04, 0.14, P);
  if (dust > 0 && !still) {
    ctx.save();
    for (let i = 0; i < 26; i++) {
      const px = 3 + Math.sin(i * 12.9898) * 4.2;
      const py = 3 + Math.cos(i * 7.233) * 4.2;
      const pz = ((i * 0.37 + time * 0.00012 * (1 + (i % 3) * 0.3)) % 1) * 5.5;
      const sp = pr(px, py, pz);
      ctx.globalAlpha = dust * 0.45 * Math.sin((pz / 5.5) * Math.PI);
      ctx.fillStyle = pal["--scene-crate-top"];
      ctx.fillRect(sp[0], sp[1], 2, 2);
    }
    ctx.restore();
  }
}

/* ─── Component ────────────────────────────────────────────────────────────── */
export function ImpactScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const caption = captionRef.current;
    const ctx = canvas?.getContext("2d");
    if (!section || !stage || !canvas || !caption || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) setReduced(true);

    const css = getComputedStyle(document.documentElement);
    const pal: Palette = {};
    for (const name of SCENE_TOKENS) pal[name] = css.getPropertyValue(name).trim();
    const mono = css.getPropertyValue("--font-geist-mono").trim() || "ui-monospace, monospace";

    let w = 0;
    let h = 0;
    let layout: Layout = { u0: 1, cx: 0, cy: 0, overview: [0, 0], mobile: false, docks: DOCKS };

    const fit = () => {
      const rect = stage.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const mobile = w < 1024;
      const cap = caption.getBoundingClientRect();
      const top = rect.top;
      const region = mobile
        ? { x: 12, y: cap.bottom - top + 20, w: w - 24, h: h - (cap.bottom - top) - 64 }
        : { x: cap.right - rect.left + 48, y: 110, w: w - (cap.right - rect.left) - 48 - 250, h: h - 170 };

      const docks = mobile ? DOCKS_PORTRAIT : DOCKS;
      const pts: [number, number][] = [
        unitProj(0, 0, 0), unitProj(6, 0, 0), unitProj(0, 6, 0), unitProj(6, 6, 0),
        unitProj(0, 0, 4), unitProj(3, 3, PILLAR_MAX + 1.5),
        ...docks.flatMap((d) => [unitProj(d.x, d.y, 0), unitProj(d.x + 2, d.y, 0), unitProj(d.x + 2, d.y + 2, 0), unitProj(d.x, d.y + 2, 0)]),
      ];
      const xs = pts.map((p) => p[0]);
      const ys = pts.map((p) => p[1]);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const u0 = Math.max(8, Math.min(region.w / (maxX - minX), region.h / (maxY - minY)));
      layout = {
        u0,
        cx: region.x + region.w / 2,
        cy: region.y + region.h / 2,
        overview: [(minX + maxX) / 2, (minY + maxY) / 2],
        mobile,
        docks,
      };
    };

    let target = still ? 1 : 0;
    let shown = target;
    let drawn = -1;
    let lastPhase = -1;
    let raf = 0;
    let running = false;

    const readTarget = () => {
      if (still) return;
      const r = section.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      target = clamp01((clamp01(-r.top / Math.max(1, span)) - 0.03) / 0.92);
    };

    const paint = (time: number) => {
      render(ctx, w, h, shown, time, layout, pal, mono, still);
      drawn = shown;
      stage.style.setProperty("--P", shown.toFixed(4));
      for (let i = 0; i < 4; i++) {
        stage.style.setProperty(`--f${i}`, clamp01((shown - PHASE_AT[i]) / (PHASE_AT[i + 1] - PHASE_AT[i])).toFixed(3));
      }
      const ph = phaseOf(shown);
      if (ph !== lastPhase) {
        lastPhase = ph;
        setPhase(ph);
      }
    };

    const frame = (time: number) => {
      raf = requestAnimationFrame(frame);
      readTarget();
      shown += (target - shown) * 0.12;
      if (Math.abs(target - shown) < 0.0004) shown = target;
      // Redraw on movement, or continuously while the dust of phase one is drifting.
      if (shown !== drawn || shown < 0.15) paint(time);
    };

    const start = () => {
      if (running || still) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    fit();
    readTarget();
    shown = target;
    paint(0);

    const ro = new ResizeObserver(() => {
      fit();
      paint(performance.now());
    });
    ro.observe(stage);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: "100px" });
    io.observe(section);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="impact"
      aria-labelledby="impact-title"
      className="on-navy relative bg-navy"
      style={{ height: reduced ? "auto" : "240vh" }}
    >
      <h2 id="impact-title" className="sr-only">
        Before and after Gross-Bazaar
      </h2>
      <div
        ref={stageRef}
        className={`${reduced ? "relative h-[100svh] min-h-[640px]" : "sticky top-0 h-[100svh]"} overflow-clip`}
        style={{ "--P": 0 } as React.CSSProperties}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <p className="absolute inset-x-0 bottom-4 z-10 text-center text-[0.68rem] text-on-navy-muted/70 sm:hidden">
          Illustrative. Outcomes depend on each opportunity.
        </p>

        <div className="wrap pointer-events-none relative flex h-full flex-col pt-24 lg:justify-center lg:pt-0">
          <div ref={captionRef} className="pointer-events-auto max-w-[23rem]">
            {/* Progress rail */}
            <ol className="grid grid-cols-4 gap-2" aria-hidden="true">
              {RAIL.map((r, i) => (
                <li key={r}>
                  <span className="block h-0.5 overflow-clip rounded-full bg-navy-3">
                    <span
                      className="block h-full origin-left bg-signal"
                      style={{ transform: `scaleX(var(--f${i}, 0))` }}
                    />
                  </span>
                  <span className={`label mt-2 block text-[0.62rem] transition-colors duration-300 ${phase >= i ? "text-on-navy" : "text-on-navy-muted/60"}`}>
                    {r}
                  </span>
                </li>
              ))}
            </ol>

            {/* Captions, stacked in one cell and cross-faded */}
            <div className="mt-6 grid lg:mt-9">
              {PHASES.map((p, i) => (
                <div
                  key={p.tag}
                  aria-hidden={phase !== i}
                  className="col-start-1 row-start-1 transition-[opacity,transform] duration-700 ease-[var(--ease-out)]"
                  style={{
                    opacity: phase === i ? 1 : 0,
                    transform: phase === i ? "none" : `translateY(${i < phase ? -14 : 14}px)`,
                  }}
                >
                  <p className="label text-signal">{p.tag}</p>
                  <p className="mt-3 font-display text-[clamp(1.6rem,1.6vw+1.1rem,2.6rem)] leading-[1.08] tracking-[-0.015em] text-on-navy">
                    {p.head}
                  </p>
                  <p className="mt-4 hidden text-[0.98rem] leading-relaxed text-on-navy-muted sm:block">{p.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 hidden text-[0.72rem] text-on-navy-muted/70 sm:block">Illustrative. Outcomes depend on each opportunity.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
