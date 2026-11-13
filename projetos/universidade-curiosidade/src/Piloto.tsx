import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio, Video} from '@remotion/media';
import {nunito} from './fontes';
import narracao from './narracao.json';

type Fala = {id: string; texto: string; duracao: number; pausa: number};
const falas = narracao as Fala[];
const fala = (id: string) => {
  const f = falas.find((x) => x.id === id);
  if (!f) throw new Error(`Fala não encontrada: ${id}`);
  return f;
};

/** A voz entra um pouco depois do corte. */
const ATRASO_VOZ = 0.15;
const FADE = 0.35;

/** Cada cena: um clipe animado e as falas que ele ilustra. */
export const CENAS: {clipe: string; falas: string[]; minimo?: number}[] = [
  {clipe: 'clipe-01.mp4', falas: ['desculpa', 'pra-voce']},
  {clipe: 'clipe-02.mp4', falas: ['nao-grita', 'sussurra']},
  {clipe: 'clipe-03.mp4', falas: ['espelho']},
  {clipe: 'clipe-04.mp4', falas: [], minimo: 3.4},
];

const duracaoCena = (c: (typeof CENAS)[number]) =>
  Math.max(c.minimo ?? 0, ATRASO_VOZ + c.falas.reduce((s, id) => s + fala(id).duracao + fala(id).pausa, 0));

export const duracaoPiloto = (fps: number) => CENAS.reduce((s, c) => s + Math.round(duracaoCena(c) * fps), 0);

/** Legenda de uma linha, branca, discreta (estilo da referência). */
const Legenda: React.FC<{texto: string; duracao: number}> = ({texto, duracao}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  // Divide em linhas curtas (até ~26 caracteres), cortando de preferência na pontuação.
  const palavras = texto.split(' ');
  const linhas: string[] = [];
  let atual = '';
  palavras.forEach((p) => {
    const tentativa = atual ? `${atual} ${p}` : p;
    if (tentativa.length > 26 && atual) {
      linhas.push(atual);
      atual = p;
    } else atual = tentativa;
    if (/[,.…?!]$/.test(p) && atual.length > 12) {
      linhas.push(atual);
      atual = '';
    }
  });
  if (atual) linhas.push(atual);
  // Tempo de cada linha proporcional ao número de caracteres.
  const total = linhas.reduce((s, l) => s + l.length, 0);
  let acc = 0;
  let ativa = linhas[0];
  for (const l of linhas) {
    if ((acc / total) * duracao <= t) ativa = l;
    acc += l.length;
  }
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1480}}>
      <div
        style={{
          fontFamily: nunito,
          fontWeight: 800,
          fontSize: 66,
          color: '#fffdf7',
          textAlign: 'center',
          padding: '0 60px',
          textShadow: '0 3px 10px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.9)',
        }}
      >
        {ativa}
      </div>
    </AbsoluteFill>
  );
};

/** Nome do canal sobre o céu da vinheta. */
const TituloCanal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entra = (atraso: number) =>
    interpolate(frame, [atraso * fps, (atraso + 0.6) * fps], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
  const a = entra(0.3);
  const b = entra(0.6);
  const linha = entra(0.9);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1290, fontFamily: nunito}}>
      <div
        style={{
          fontWeight: 900,
          fontSize: 96,
          color: '#fffdf7',
          opacity: a,
          translate: `0 ${(1 - a) * 30}px`,
          textShadow: '0 4px 18px rgba(20,10,60,0.8)',
        }}
      >
        Universidade
      </div>
      <div
        style={{
          fontWeight: 900,
          fontSize: 96,
          marginTop: -10,
          color: '#ffc95c',
          opacity: b,
          translate: `0 ${(1 - b) * 30}px`,
          textShadow: '0 4px 18px rgba(20,10,60,0.8)',
        }}
      >
        da Curiosidade
      </div>
      <div style={{width: 240 * linha, height: 6, borderRadius: 3, background: '#fffdf7', marginTop: 22, opacity: 0.85}} />
    </AbsoluteFill>
  );
};

const Cena: React.FC<{c: (typeof CENAS)[number]}> = ({c}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacidade = interpolate(frame, [0, FADE * fps], [0, 1], {extrapolateRight: 'clamp'});
  let t = ATRASO_VOZ;
  return (
    <AbsoluteFill style={{backgroundColor: '#1d1638'}}>
      <AbsoluteFill style={{opacity: opacidade}}>
        <Video src={staticFile(`clipes/${c.clipe}`)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      {c.falas.length === 0 ? <TituloCanal /> : null}
      {c.falas.map((id) => {
        const f = fala(id);
        const inicio = t;
        t += f.duracao + f.pausa;
        return (
          <Sequence key={id} from={Math.round(inicio * fps)} durationInFrames={Math.round((f.duracao + f.pausa) * fps)}>
            <Audio src={staticFile(`narracao/${id}.wav`)} />
            <Legenda texto={f.texto} duracao={f.duracao} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const Piloto: React.FC = () => {
  const {fps} = useVideoConfig();
  let inicio = 0;
  return (
    <AbsoluteFill style={{backgroundColor: '#1d1638'}}>
      {CENAS.map((c) => {
        const d = Math.round(duracaoCena(c) * fps);
        const from = inicio;
        inicio += d;
        return (
          <Sequence key={c.clipe} from={from} durationInFrames={d} name={c.clipe}>
            <Cena c={c} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
