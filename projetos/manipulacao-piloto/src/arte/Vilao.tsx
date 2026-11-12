import React from 'react';
import {useCurrentFrame} from 'remotion';

const C = '#2b2d42';

/** O "vilão óbvio" de desenho animado. Origem: base do corpo. */
export const Vilao: React.FC<{x: number; y: number; s?: number; gritando?: boolean}> = ({x, y, s = 1, gritando = true}) => {
  const frame = useCurrentFrame();
  const tremor = gritando ? Math.sin(frame * 1.7) * 4 : 0;
  const boca = gritando ? 26 + Math.abs(Math.sin(frame / 3)) * 16 : 8;
  return (
    <g transform={`translate(${x + tremor} ${y}) scale(${s})`}>
      {/* capa */}
      <path d="M -120 -230 L -230 0 L 230 0 L 120 -230 Z" fill="#6a2c91" stroke={C} strokeWidth={7} strokeLinejoin="round" />
      <path d="M -120 -230 L -170 0 L 170 0 L 120 -230 Z" fill="#9d4edd" />
      {/* corpo */}
      <path d="M -120 0 C -120 -150 -90 -215 0 -215 C 90 -215 120 -150 120 0 Z" fill={C} />
      <path d="M -40 -212 L 0 -150 L 40 -212 Z" fill="#fff" />
      <path d="M -14 -190 L 14 -190 L 0 -160 Z" fill="#d00000" />
      {/* braço erguido com o controle de marionete */}
      <path d="M 90 -150 Q 210 -210 250 -330" fill="none" stroke={C} strokeWidth={46} strokeLinecap="round" />
      <circle cx={256} cy={-345} r={28} fill="#f6d2b0" stroke={C} strokeWidth={6} />
      {/* cabeça */}
      <ellipse cx={0} cy={-320} rx={105} ry={112} fill="#f6d2b0" stroke={C} strokeWidth={7} />
      {/* chapéu */}
      <rect x={-125} y={-418} width={250} height={26} rx={10} fill={C} />
      <rect x={-78} y={-560} width={156} height={150} rx={10} fill={C} />
      <rect x={-78} y={-445} width={156} height={26} fill="#d00000" />
      {/* olhos bravos */}
      <path d="M -70 -372 L -18 -350" stroke={C} strokeWidth={13} strokeLinecap="round" />
      <path d="M 70 -372 L 18 -350" stroke={C} strokeWidth={13} strokeLinecap="round" />
      <circle cx={-40} cy={-330} r={13} fill={C} />
      <circle cx={40} cy={-330} r={13} fill={C} />
      {/* boca e bigode */}
      <ellipse cx={0} cy={-255} rx={36} ry={boca} fill="#7a1f1f" stroke={C} strokeWidth={6} />
      <path
        d="M 0 -290 C -30 -310 -70 -300 -90 -270 C -100 -255 -85 -240 -75 -255 C -60 -280 -30 -280 0 -275 C 30 -280 60 -280 75 -255 C 85 -240 100 -255 90 -270 C 70 -300 30 -310 0 -290 Z"
        fill={C}
      />
    </g>
  );
};

/** Marionete de madeira pendurada pelos fios. */
export const Marionete: React.FC<{
  x: number;
  y: number;
  controleX: number;
  controleY: number;
  balanco?: number;
}> = ({x, y, controleX, controleY, balanco = 0}) => {
  const madeira = '#e9c46a';
  const px = x + balanco;
  return (
    <g>
      {/* controle em cruz */}
      <g transform={`rotate(${balanco * 0.15} ${controleX} ${controleY})`}>
        <rect x={controleX - 110} y={controleY - 12} width={220} height={24} rx={10} fill="#8d5524" stroke={C} strokeWidth={5} />
        <rect x={controleX - 12} y={controleY - 70} width={24} height={140} rx={10} fill="#8d5524" stroke={C} strokeWidth={5} />
      </g>
      {/* fios */}
      {[
        [controleX - 100, controleY, px - 70, y - 120],
        [controleX + 100, controleY, px + 70, y - 120],
        [controleX, controleY - 60, px, y - 230],
        [controleX, controleY + 60, px, y - 20],
      ].map(([a, b, c, d], i) => (
        <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#fff" strokeWidth={3} opacity={0.9} />
      ))}
      {/* corpo */}
      <g stroke={C} strokeWidth={5}>
        <line x1={px - 70} y1={y - 120} x2={px} y2={y - 140} strokeWidth={14} stroke={madeira} />
        <line x1={px + 70} y1={y - 120} x2={px} y2={y - 140} strokeWidth={14} stroke={madeira} />
        <rect x={px - 40} y={y - 170} width={80} height={130} rx={20} fill="#e76f51" />
        <line x1={px - 20} y1={y - 40} x2={px - 30} y2={y + 60} strokeWidth={16} stroke={madeira} />
        <line x1={px + 20} y1={y - 40} x2={px + 30} y2={y + 60} strokeWidth={16} stroke={madeira} />
        <circle cx={px} cy={y - 215} r={45} fill={madeira} />
      </g>
      <circle cx={px - 15} cy={y - 220} r={6} fill={C} />
      <circle cx={px + 15} cy={y - 220} r={6} fill={C} />
      <path d={`M ${px - 15} ${y - 196} Q ${px} ${y - 186} ${px + 15} ${y - 196}`} stroke={C} strokeWidth={5} fill="none" />
    </g>
  );
};
