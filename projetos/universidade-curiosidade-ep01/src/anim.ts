import { Easing, interpolate, spring } from "remotion";

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** 0→1 entre t0 e t1 (segundos), com easing. */
export const rampa = (
  t: number,
  t0: number,
  t1: number,
  easing: (x: number) => number = Easing.bezier(0.33, 0, 0.2, 1),
) =>
  interpolate(t, [t0, t1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Pop elástico (com overshoot) que começa em t0. Devolve ~0→1. */
export const pop = (
  frame: number,
  fps: number,
  t0: number,
  config: { damping?: number; stiffness?: number; mass?: number } = {},
) =>
  spring({
    frame: frame - Math.round(t0 * fps),
    fps,
    config: { damping: 9, stiffness: 170, mass: 0.8, ...config },
  });

/** Oscilação amortecida que começa em t0 (balanço de cabeça, tremida). */
export const balanco = (
  t: number,
  t0: number,
  amp: number,
  freq = 4,
  decaimento = 2.2,
) => {
  const d = t - t0;
  if (d < 0) return 0;
  return amp * Math.sin(d * freq * Math.PI * 2) * Math.exp(-d * decaimento);
};

/**
 * Piscada natural: fecha por ~4 frames a cada 3–5 s (determinístico pela semente).
 * Devolve 0 (aberto) … 1 (fechado).
 */
export const piscada = (t: number, semente = 0, extras: number[] = []) => {
  const intervalos = [3.4, 4.6, 3.1, 4.2, 3.8, 4.9, 3.3];
  const tempos: number[] = [...extras];
  let acc = 0.9 + (semente % 7) * 0.37;
  for (let i = 0; acc < 120; i++) {
    tempos.push(acc);
    acc += intervalos[(i + semente) % intervalos.length];
  }
  let v = 0;
  for (const p of tempos) {
    const d = t - p;
    if (d >= 0 && d < 0.2)
      v = Math.max(v, d < 0.07 ? d / 0.07 : 1 - (d - 0.07) / 0.13);
  }
  return clamp01(v);
};

/** Respiração em loop (escala vertical sutil). */
export const respira = (t: number, periodo = 3.2, amp = 0.012) =>
  1 + amp * Math.sin((t / periodo) * Math.PI * 2);
