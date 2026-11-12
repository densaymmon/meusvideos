import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {nunito} from '../fontes';

const CONTORNO = '#2b2d42';

export const Estrela: React.FC<{x: number; y: number; r?: number; cor?: string; brilho?: number}> = ({
  x,
  y,
  r = 14,
  cor = '#fff3b0',
  brilho = 1,
}) => (
  <path
    transform={`translate(${x} ${y}) scale(${r / 10})`}
    d="M 0 -10 L 2.6 -2.6 L 10 0 L 2.6 2.6 L 0 10 L -2.6 2.6 L -10 0 L -2.6 -2.6 Z"
    fill={cor}
    opacity={brilho}
  />
);

/** Brilhos que piscam ao redor de um ponto. */
export const Brilhos: React.FC<{x: number; y: number; raio: number; qtd?: number; cor?: string; visivel?: number}> = ({
  x,
  y,
  raio,
  qtd = 6,
  cor = '#ffffff',
  visivel = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <g opacity={visivel}>
      {new Array(qtd).fill(0).map((_, i) => {
        const a = (i / qtd) * Math.PI * 2 + 0.4;
        const pulso = 0.6 + 0.4 * Math.sin(frame / 5 + i * 1.7);
        return <Estrela key={i} x={x + Math.cos(a) * raio} y={y + Math.sin(a) * raio} r={16 * pulso} cor={cor} />;
      })}
    </g>
  );
};

export const Interrogacao: React.FC<{x: number; y: number; s?: number; cor?: string}> = ({x, y, s = 1, cor = '#ffd23f'}) => (
  <text
    x={x}
    y={y}
    fontFamily={nunito}
    fontWeight={900}
    fontSize={140 * s}
    textAnchor="middle"
    fill={cor}
    stroke={CONTORNO}
    strokeWidth={8 * s}
    paintOrder="stroke"
  >
    ?
  </text>
);

export const Flor: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 0 Q -8 60 4 120" stroke="#2d6a4f" strokeWidth={9} fill="none" strokeLinecap="round" />
    <ellipse cx={20} cy={70} rx={22} ry={10} fill="#52b788" transform="rotate(-30 20 70)" />
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx={0} cy={-26} rx={18} ry={28} fill="#ff8fab" stroke={CONTORNO} strokeWidth={5} transform={`rotate(${a})`} />
    ))}
    <circle r={16} fill="#ffd23f" stroke={CONTORNO} strokeWidth={5} />
  </g>
);

export const Cafe: React.FC<{x: number; y: number; s?: number; vapor?: boolean}> = ({x, y, s = 1, vapor = true}) => {
  const frame = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {vapor
        ? [-18, 12].map((ox, i) => (
            <path
              key={ox}
              d={`M ${ox} -60 q 12 -20 0 -40 q -12 -20 0 -40`}
              stroke="#fff"
              strokeWidth={7}
              fill="none"
              strokeLinecap="round"
              opacity={0.5 + 0.4 * Math.sin(frame / 6 + i * 2)}
              transform={`translate(${Math.sin(frame / 8 + i) * 5} 0)`}
            />
          ))
        : null}
      <path d="M -48 -50 L 48 -50 L 38 40 Q 0 52 -38 40 Z" fill="#fff" stroke={CONTORNO} strokeWidth={6} strokeLinejoin="round" />
      <path d="M 46 -30 Q 82 -26 72 6 Q 64 22 40 18" fill="none" stroke={CONTORNO} strokeWidth={9} />
      <rect x={-46} y={-20} width={88} height={22} fill="#e76f51" />
    </g>
  );
};

export const BalaoCoracao: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -70 -50 Q -70 -70 -50 -70 L 50 -70 Q 70 -70 70 -50 L 70 20 Q 70 40 50 40 L -10 40 L -40 70 L -36 40 L -50 40 Q -70 40 -70 20 Z"
      fill="#fff"
      stroke={CONTORNO}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <path d="M 0 22 C -50 -10 -30 -50 0 -30 C 30 -50 50 -10 0 22 Z" fill="#ff4d6d" />
  </g>
);

/** Engrenagem com dentes; gira conforme `angulo`. */
export const Engrenagem: React.FC<{x: number; y: number; r: number; dentes?: number; angulo: number; cor: string}> = ({
  x,
  y,
  r,
  dentes = 10,
  angulo,
  cor,
}) => {
  const pts: string[] = [];
  const total = dentes * 4;
  for (let i = 0; i < total; i++) {
    const a = (i / total) * Math.PI * 2;
    const raio = i % 4 < 2 ? r : r * 0.8;
    pts.push(`${Math.cos(a) * raio},${Math.sin(a) * raio}`);
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${angulo})`}>
      <polygon points={pts.join(' ')} fill={cor} stroke={CONTORNO} strokeWidth={6} strokeLinejoin="round" />
      <circle r={r * 0.3} fill="#fff" stroke={CONTORNO} strokeWidth={6} />
    </g>
  );
};

/** Nuvem fofinha (base para fumaça, chuva, névoa). */
export const Nuvem: React.FC<{x: number; y: number; s?: number; cor?: string; opacidade?: number; contorno?: boolean}> = ({
  x,
  y,
  s = 1,
  cor = '#fff',
  opacidade = 1,
  contorno = true,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacidade}>
    {contorno ? (
      <g stroke={CONTORNO} strokeWidth={12}>
        <circle cx={-60} cy={10} r={50} fill={cor} />
        <circle cx={0} cy={-20} r={66} fill={cor} />
        <circle cx={66} cy={8} r={52} fill={cor} />
      </g>
    ) : null}
    <circle cx={-60} cy={10} r={50} fill={cor} />
    <circle cx={0} cy={-20} r={66} fill={cor} />
    <circle cx={66} cy={8} r={52} fill={cor} />
    <rect x={-100} y={10} width={200} height={50} rx={25} fill={cor} />
  </g>
);

/** Rótulo de texto em cartão (usado em várias cenas). */
export const Cartao: React.FC<{
  x: number;
  y: number;
  texto: string;
  cor?: string;
  corTexto?: string;
  tamanho?: number;
  largura?: number;
  rotacao?: number;
}> = ({x, y, texto, cor = '#fff', corTexto = CONTORNO, tamanho = 64, largura, rotacao = 0}) => {
  const w = largura ?? texto.length * tamanho * 0.6 + 80;
  const h = tamanho * 1.6;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotacao})`}>
      <rect x={-w / 2 + 8} y={-h / 2 + 10} width={w} height={h} rx={h / 3} fill={CONTORNO} opacity={0.25} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 3} fill={cor} stroke={CONTORNO} strokeWidth={7} />
      <text
        y={tamanho * 0.36}
        textAnchor="middle"
        fontFamily={nunito}
        fontWeight={900}
        fontSize={tamanho}
        fill={corTexto}
      >
        {texto}
      </text>
    </g>
  );
};

export const useSegundos = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};
