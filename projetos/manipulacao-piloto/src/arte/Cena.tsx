import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Moldura comum das cenas: fundo colorido, bolinhas decorativas,
 * leve zoom contínuo (câmera viva) e entrada rápida.
 */
export const Cena: React.FC<{
  fundo: string;
  /** Duração da cena em segundos (para o zoom lento). */
  dur: number;
  decoracao?: string;
  children: React.ReactNode;
}> = ({fundo, dur, decoracao = '#ffffff', children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{backgroundColor: fundo}}>
      <svg
        viewBox="0 0 1920 1080"
        style={{
          width: '100%',
          height: '100%',
          scale: interpolate(t, [0, dur], [1, 1.05]),
          opacity: interpolate(frame, [0, 4], [0, 1], {extrapolateRight: 'clamp'}),
        }}
      >
        <g opacity={0.18}>
          {[
            [160, 180, 60],
            [1760, 160, 90],
            [1700, 900, 50],
            [240, 860, 80],
            [980, 90, 30],
            [1480, 520, 24],
            [420, 520, 20],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y + Math.sin(t * 1.3 + i) * 10} r={r} fill={decoracao} />
          ))}
        </g>
        {children}
      </svg>
    </AbsoluteFill>
  );
};
