import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {nunito} from './fontes';
import {ATRASO_VOZ, type Fala} from './tempo';

/** Legenda da fala, destacando a palavra que está sendo dita (tempo estimado). */
export const Legenda: React.FC<{fala: Fala}> = ({fala}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps - ATRASO_VOZ;
  const palavras = fala.texto.split(' ');
  let pos = 0;
  const inicios = palavras.map((p) => {
    const i = pos;
    pos += p.length + 1;
    return (i / fala.texto.length) * fala.duracao;
  });
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 56}}>
      <div
        style={{
          maxWidth: 1560,
          padding: '18px 40px',
          borderRadius: 28,
          backgroundColor: 'rgba(30, 32, 50, 0.82)',
          fontFamily: nunito,
          fontWeight: 800,
          fontSize: 52,
          lineHeight: 1.25,
          color: '#fffdf7',
          textAlign: 'center',
          opacity: interpolate(frame, [0, 5], [0, 1], {extrapolateRight: 'clamp'}),
          translate: `0 ${interpolate(frame, [0, 6], [16, 0], {extrapolateRight: 'clamp'})}px`,
        }}
      >
        {palavras.map((p, i) => (
          <span key={i} style={{color: t >= inicios[i] - 0.05 && t < (inicios[i + 1] ?? 999) ? '#ffd23f' : undefined}}>
            {p}
            {i < palavras.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
