import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

export type Humor = 'neutro' | 'feliz' | 'triste' | 'preocupada' | 'surpresa' | 'confusa';
export type Bracos = 'nenhum' | 'celular' | 'oferecer' | 'acenar';

type Props = {
  x: number;
  y: number;
  s?: number;
  humor?: Humor;
  pele?: string;
  cabelo?: string;
  roupa?: string;
  cabeloTipo?: 'coque' | 'curto';
  /** Deslocamento das pupilas (-1 esquerda, 1 direita). */
  olhar?: number;
  bracos?: Bracos;
  /** Desloca o piscar para duas pessoas não piscarem juntas. */
  fasePiscar?: number;
  children?: React.ReactNode;
};

const escurecer = (hex: string, k = 0.82) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.round(v * k).toString(16).padStart(2, '0');
  return `#${c((n >> 16) & 255)}${c((n >> 8) & 255)}${c(n & 255)}`;
};

const Boca: React.FC<{humor: Humor; cor: string}> = ({humor, cor}) => {
  const p = {stroke: cor, strokeWidth: 9, strokeLinecap: 'round' as const, fill: 'none'};
  switch (humor) {
    case 'feliz':
      return <path d="M -38 -272 Q 0 -232 38 -272 Z" fill="#7a2e2e" stroke={cor} strokeWidth={7} strokeLinejoin="round" />;
    case 'triste':
      return <path d="M -30 -258 Q 0 -282 30 -258" {...p} />;
    case 'preocupada':
      return <path d="M -32 -265 Q -16 -277 0 -265 Q 16 -253 32 -265" {...p} />;
    case 'surpresa':
      return <ellipse cx={0} cy={-264} rx={15} ry={20} fill="#7a2e2e" />;
    case 'confusa':
      return <path d="M -28 -262 L 30 -272" {...p} />;
    default:
      return <path d="M -24 -266 Q 0 -256 24 -266" {...p} />;
  }
};

const Sobrancelhas: React.FC<{humor: Humor; cor: string}> = ({humor, cor}) => {
  const p = {stroke: cor, strokeWidth: 10, strokeLinecap: 'round' as const, fill: 'none'};
  if (humor === 'triste' || humor === 'preocupada') {
    return (
      <>
        <path d="M -66 -372 L -22 -386" {...p} />
        <path d="M 66 -372 L 22 -386" {...p} />
      </>
    );
  }
  if (humor === 'surpresa') {
    return (
      <>
        <path d="M -64 -392 Q -42 -404 -20 -392" {...p} />
        <path d="M 64 -392 Q 42 -404 20 -392" {...p} />
      </>
    );
  }
  if (humor === 'confusa') {
    return (
      <>
        <path d="M -64 -378 L -20 -378" {...p} />
        <path d="M 64 -394 Q 42 -404 20 -388" {...p} />
      </>
    );
  }
  return (
    <>
      <path d="M -64 -378 Q -42 -388 -20 -378" {...p} />
      <path d="M 64 -378 Q 42 -388 20 -378" {...p} />
    </>
  );
};

/** Personagem 2D em estilo ilustrado. Origem: base do tronco (centro). */
export const Pessoa: React.FC<Props> = ({
  x,
  y,
  s = 1,
  humor = 'neutro',
  pele = '#c68863',
  cabelo = '#3b2416',
  roupa = '#2ec4b6',
  cabeloTipo = 'coque',
  olhar = 0,
  bracos = 'nenhum',
  fasePiscar = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ciclo = Math.round(3.4 * fps);
  const k = (frame + fasePiscar) % ciclo;
  const piscando = k < 4 ? 0.12 : 1;
  const respira = Math.sin((frame / fps) * 2.2) * 4;
  const contorno = '#2b2d42';
  const peleSombra = escurecer(pele);
  const roupaSombra = escurecer(roupa);
  const aceno = Math.sin((frame / fps) * 9) * 14;

  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* tronco */}
      <path
        d="M -165 0 C -165 -150 -120 -205 0 -205 C 120 -205 165 -150 165 0 Z"
        fill={roupa}
        stroke={contorno}
        strokeWidth={7}
        transform={`translate(0 ${respira * 0.4})`}
      />
      <path d="M -60 -200 Q 0 -160 60 -200" fill="none" stroke={roupaSombra} strokeWidth={10} strokeLinecap="round" />
      <g transform={`translate(0 ${respira})`}>
        {/* pescoço */}
        <rect x={-30} y={-240} width={60} height={50} rx={14} fill={peleSombra} />
        {cabeloTipo === 'coque' ? (
          <>
            <circle cx={0} cy={-468} r={52} fill={cabelo} stroke={contorno} strokeWidth={7} />
            <path d="M -122 -320 C -150 -230 -110 -190 -80 -200 L -96 -330 Z" fill={cabelo} />
            <path d="M 122 -320 C 150 -230 110 -190 80 -200 L 96 -330 Z" fill={cabelo} />
          </>
        ) : null}
        {/* orelhas */}
        <circle cx={-114} cy={-318} r={22} fill={peleSombra} stroke={contorno} strokeWidth={6} />
        <circle cx={114} cy={-318} r={22} fill={peleSombra} stroke={contorno} strokeWidth={6} />
        {/* cabeça */}
        <ellipse cx={0} cy={-325} rx={116} ry={122} fill={pele} stroke={contorno} strokeWidth={7} />
        {/* cabelo */}
        {cabeloTipo === 'coque' ? (
          <path
            d="M -120 -320 C -132 -470 132 -470 120 -320 C 96 -392 30 -410 -10 -395 C -50 -410 -100 -385 -120 -320 Z"
            fill={cabelo}
            stroke={contorno}
            strokeWidth={7}
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M -118 -330 C -130 -470 110 -480 120 -340 C 100 -380 70 -400 40 -392 C 10 -420 -40 -415 -60 -395 C -90 -395 -110 -370 -118 -330 Z"
            fill={cabelo}
            stroke={contorno}
            strokeWidth={7}
            strokeLinejoin="round"
          />
        )}
        <Sobrancelhas humor={humor} cor={cabelo === '#3b2416' ? '#2a170d' : escurecer(cabelo, 0.6)} />
        {/* olhos */}
        {[-42, 42].map((ox) => (
          <g key={ox} transform={`translate(${ox + olhar * 7} -325) scale(1 ${piscando})`}>
            <ellipse cx={0} cy={0} rx={13} ry={18} fill={contorno} />
            <circle cx={4} cy={-6} r={5} fill="#fff" />
          </g>
        ))}
        {/* bochechas */}
        <circle cx={-72} cy={-280} r={20} fill="#ff7b7b" opacity={0.35} />
        <circle cx={72} cy={-280} r={20} fill="#ff7b7b" opacity={0.35} />
        <Boca humor={humor} cor={contorno} />
      </g>
      {/* braços */}
      {bracos === 'celular' ? (
        <g>
          <path d="M -150 -40 Q -130 -110 -40 -125" fill="none" stroke={contorno} strokeWidth={62} strokeLinecap="round" />
          <path d="M -150 -40 Q -130 -110 -40 -125" fill="none" stroke={roupa} strokeWidth={50} strokeLinecap="round" />
          <path d="M 150 -40 Q 130 -110 40 -125" fill="none" stroke={contorno} strokeWidth={62} strokeLinecap="round" />
          <path d="M 150 -40 Q 130 -110 40 -125" fill="none" stroke={roupa} strokeWidth={50} strokeLinecap="round" />
          <rect x={-42} y={-215} width={84} height={140} rx={14} fill="#1b1b2f" stroke={contorno} strokeWidth={6} />
          <rect x={-33} y={-204} width={66} height={116} rx={8} fill="#bde0fe" />
          <circle cx={-38} cy={-120} r={22} fill={pele} stroke={contorno} strokeWidth={6} />
          <circle cx={38} cy={-120} r={22} fill={pele} stroke={contorno} strokeWidth={6} />
        </g>
      ) : null}
      {bracos === 'oferecer' ? (
        <g>
          <path d="M 120 -120 Q 210 -110 270 -170" fill="none" stroke={contorno} strokeWidth={62} strokeLinecap="round" />
          <path d="M 120 -120 Q 210 -110 270 -170" fill="none" stroke={roupa} strokeWidth={50} strokeLinecap="round" />
          <circle cx={285} cy={-180} r={26} fill={pele} stroke={contorno} strokeWidth={6} />
        </g>
      ) : null}
      {bracos === 'acenar' ? (
        <g transform={`rotate(${aceno} 130 -150)`}>
          <path d="M 130 -150 Q 220 -220 230 -330" fill="none" stroke={contorno} strokeWidth={62} strokeLinecap="round" />
          <path d="M 130 -150 Q 220 -220 230 -330" fill="none" stroke={roupa} strokeWidth={50} strokeLinecap="round" />
          <circle cx={232} cy={-350} r={28} fill={pele} stroke={contorno} strokeWidth={6} />
        </g>
      ) : null}
      {children}
    </g>
  );
};

/** Personagens fixos do vídeo. */
export const LIA = {pele: '#c68863', cabelo: '#3b2416', roupa: '#2ec4b6', cabeloTipo: 'coque' as const};
export const RAFA = {pele: '#f1c27d', cabelo: '#6b3e26', roupa: '#ff6b6b', cabeloTipo: 'curto' as const};
