import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {nunito} from './fontes';
import {ATRASO_VOZ, type Fala} from './tempo';

/** Legenda da fala, destacando a palavra que está sendo dita (tempo estimado). */
export const Legenda: React.FC<{fala: Fala; vertical?: boolean}> = ({fala, vertical = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps - ATRASO_VOZ;
  const todas = fala.texto.split(' ');
  let pos = 0;
  const todosInicios = todas.map((p) => {
    const i = pos;
    pos += p.length + 1;
    return (i / fala.texto.length) * fala.duracao;
  });
  // Frases longas aparecem em trechos curtos (até ~2 linhas), cortando de preferência na pontuação.
  const limite = vertical ? 9 : 13;
  const trechos: number[][] = [[]];
  todas.forEach((p, i) => {
    const atual = trechos[trechos.length - 1];
    atual.push(i);
    const pontuacao = /[,.:;?!…]['"]?$/.test(p);
    const resto = todas.length - i - 1;
    if (resto > 2 && ((pontuacao && atual.length >= limite * 0.55) || atual.length >= limite)) trechos.push([]);
  });
  let ativo: number[] = trechos[0];
  for (const tr of trechos) {
    if (tr.length && todosInicios[tr[0]] - 0.1 <= t) ativo = tr;
  }
  const palavras = ativo.map((i) => todas[i]);
  const inicios = ativo.map((i) => todosInicios[i]);
  const proximo = todosInicios[ativo[ativo.length - 1] + 1] ?? 999;
  return (
    <AbsoluteFill
      style={
        vertical
          ? {justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1290}
          : {justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 56}
      }
    >
      <div
        style={{
          maxWidth: vertical ? 960 : 1560,
          padding: vertical ? '10px 20px' : '18px 40px',
          borderRadius: 28,
          backgroundColor: vertical ? 'transparent' : 'rgba(30, 32, 50, 0.82)',
          fontFamily: nunito,
          fontWeight: 800,
          fontSize: vertical ? 64 : 52,
          lineHeight: 1.25,
          color: '#fffdf7',
          textAlign: 'center',
          opacity: interpolate(frame, [0, 5], [0, 1], {extrapolateRight: 'clamp'}),
          translate: `0 ${interpolate(frame, [0, 6], [16, 0], {extrapolateRight: 'clamp'})}px`,
        }}
      >
        {palavras.map((p, i) => (
          <span key={i} style={{color: t >= inicios[i] - 0.05 && t < (inicios[i + 1] ?? proximo) ? '#ffd23f' : undefined}}>
            {p}
            {i < palavras.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
