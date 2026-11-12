import {Easing, interpolate} from 'remotion';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const suave = Easing.bezier(0.16, 1, 0.3, 1);

/** Vai de `de` até `para` entre os segundos a e b. */
export const entre = (t: number, a: number, b: number, de = 0, para = 1) =>
  interpolate(t, [a, b], [de, para], {...CLAMP, easing: suave});

/** Entrada com "quique" (0 → 1, passando um pouco de 1). */
export const pop = (t: number, a: number, d = 0.4) =>
  interpolate(t, [a, a + d], [0, 1], {...CLAMP, easing: Easing.out(Easing.back(2.2))});

export const cores = {
  tinta: '#2b2d42',
  noite: '#26315f',
  pessego: '#ffd6b8',
  amarelo: '#ffd23f',
  coral: '#ff6b6b',
  turquesa: '#2ec4b6',
  lavanda: '#b8a1ff',
  menta: '#9be7c4',
  ceu: '#8ecae6',
  laranja: '#ff9f1c',
  rosa: '#ffafcc',
  creme: '#fdf0d5',
  branco: '#fffdf7',
};
