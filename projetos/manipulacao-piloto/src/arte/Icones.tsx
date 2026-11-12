import React from 'react';
import {nunito} from '../fontes';

/** Ícones simples, desenhados numa caixa de ~120×120 centrada na origem. */
const C = '#2b2d42';
const T = {stroke: C, strokeWidth: 6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

type Pos = {x?: number; y?: number; s?: number};
const G: React.FC<Pos & {children: React.ReactNode}> = ({x = 0, y = 0, s = 1, children}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>{children}</g>
);

export const Coracao: React.FC<Pos & {cor?: string}> = ({cor = '#ff4d6d', ...p}) => (
  <G {...p}>
    <path d="M 0 45 C -90 -10 -55 -75 0 -35 C 55 -75 90 -10 0 45 Z" fill={cor} {...T} />
    <path d="M -30 -30 Q -45 -20 -42 -5" stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.7} />
  </G>
);

export const BombaCoracao: React.FC<Pos> = (p) => (
  <G {...p}>
    <path d="M 20 -48 Q 40 -75 60 -65" stroke={C} strokeWidth={6} fill="none" />
    <circle cx={62} cy={-66} r={9} fill="#ffd23f" />
    <circle r={50} fill="#ff4d6d" {...T} />
    <path d="M 0 22 C -38 -2 -24 -32 0 -16 C 24 -32 38 -2 0 22 Z" fill="#fff" />
  </G>
);

export const Celular: React.FC<Pos & {tela?: string}> = ({tela = '#bde0fe', ...p}) => (
  <G {...p}>
    <rect x={-38} y={-62} width={76} height={124} rx={14} fill="#1b1b2f" {...T} />
    <rect x={-29} y={-50} width={58} height={98} rx={6} fill={tela} />
  </G>
);

export const Calendario: React.FC<Pos & {marcas?: number[]}> = ({marcas = [1, 4, 7], ...p}) => (
  <G {...p}>
    <rect x={-58} y={-50} width={116} height={104} rx={12} fill="#fff" {...T} />
    <rect x={-58} y={-50} width={116} height={26} rx={10} fill="#ff6b6b" {...T} />
    {new Array(9).fill(0).map((_, i) => (
      <circle key={i} cx={-34 + (i % 3) * 34} cy={-4 + Math.floor(i / 3) * 22} r={7} fill={marcas.includes(i) ? '#d00000' : '#dee2e6'} />
    ))}
  </G>
);

export const Lupa: React.FC<Pos> = (p) => (
  <G {...p}>
    <path d="M 22 22 L 55 55" stroke="#8d5524" strokeWidth={18} strokeLinecap="round" />
    <circle cx={-8} cy={-8} r={40} fill="#bde0fe" {...T} strokeWidth={9} />
  </G>
);

export const Cadeado: React.FC<Pos & {aberto?: boolean}> = ({aberto = false, ...p}) => (
  <G {...p}>
    <path d={aberto ? 'M -28 -10 L -28 -40 Q -28 -68 0 -68 Q 28 -68 28 -48' : 'M -28 -10 L -28 -40 Q -28 -68 0 -68 Q 28 -68 28 -40 L 28 -10'} fill="none" stroke={C} strokeWidth={12} />
    <rect x={-45} y={-14} width={90} height={70} rx={12} fill="#ffd23f" {...T} />
    <circle cx={0} cy={18} r={9} fill={C} />
  </G>
);

export const Sino: React.FC<Pos> = (p) => (
  <G {...p}>
    <path d="M -45 30 Q -40 -50 0 -50 Q 40 -50 45 30 L 55 40 L -55 40 Z" fill="#ffd23f" {...T} />
    <circle cx={0} cy={50} r={11} fill="#ffd23f" {...T} />
  </G>
);

export const Joinha: React.FC<Pos & {cor?: string}> = ({cor = '#4cc9f0', ...p}) => (
  <G {...p}>
    <rect x={-60} y={-10} width={30} height={65} rx={8} fill={cor} {...T} />
    <path d="M -24 -8 L 0 -55 Q 18 -60 16 -36 L 10 -12 L 48 -12 Q 62 -10 58 6 L 46 48 Q 42 56 32 56 L -24 56 Z" fill={cor} {...T} />
  </G>
);

export const Espelho: React.FC<Pos> = (p) => (
  <G {...p}>
    <ellipse rx={42} ry={55} fill="#e9a23b" {...T} />
    <ellipse rx={30} ry={42} fill="#d8f3ff" />
    <path d="M -14 -20 L 4 -34" stroke="#fff" strokeWidth={7} strokeLinecap="round" />
  </G>
);

export const Bateria: React.FC<Pos & {nivel?: number}> = ({nivel = 0.2, ...p}) => (
  <G {...p}>
    <rect x={-55} y={-30} width={100} height={60} rx={10} fill="#fff" {...T} />
    <rect x={47} y={-12} width={12} height={24} rx={3} fill={C} />
    <rect x={-47} y={-22} width={84 * nivel} height={44} rx={5} fill={nivel < 0.3 ? '#ff4d6d' : '#52b788'} />
  </G>
);

export const Grafico: React.FC<Pos> = (p) => (
  <G {...p}>
    <rect x={-60} y={-50} width={120} height={100} rx={10} fill="#fff" {...T} />
    <polyline points="-45,30 -20,10 5,15 40,-30" fill="none" stroke="#2ec4b6" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="-45,38 -20,22 5,25 40,-14" fill="none" stroke="#ff6b6b" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
  </G>
);

export const Martelo: React.FC<Pos> = (p) => (
  <G {...p}>
    <rect x={-8} y={-20} width={16} height={85} rx={6} fill="#8d5524" {...T} transform="rotate(-35)" />
    <rect x={-50} y={-55} width={70} height={40} rx={8} fill="#a0522d" {...T} transform="rotate(-35)" />
    <rect x={-50} y={50} width={90} height={14} rx={6} fill="#6c757d" {...T} />
  </G>
);

export const Livro: React.FC<Pos & {cor?: string}> = ({cor = '#4361ee', ...p}) => (
  <G {...p}>
    <rect x={-48} y={-60} width={96} height={120} rx={8} fill={cor} {...T} />
    <rect x={-36} y={-60} width={8} height={120} fill="#00000033" />
    <rect x={-18} y={-38} width={50} height={10} rx={5} fill="#fff" />
    <rect x={-18} y={-20} width={36} height={8} rx={4} fill="#ffffffaa" />
  </G>
);

export const Pessoinha: React.FC<Pos & {cor?: string; opacidade?: number}> = ({cor = '#2ec4b6', opacidade = 1, ...p}) => (
  <G {...p}>
    <g opacity={opacidade}>
      <circle cx={0} cy={-30} r={22} fill={cor} {...T} strokeWidth={5} />
      <path d="M -32 40 Q -32 0 0 0 Q 32 0 32 40 Z" fill={cor} {...T} strokeWidth={5} />
    </g>
  </G>
);

export const Grupo: React.FC<Pos & {excluido?: boolean}> = ({excluido = false, ...p}) => (
  <G {...p}>
    <Pessoinha x={-40} y={0} cor="#ff9f1c" />
    <Pessoinha x={40} y={0} cor="#b8a1ff" />
    <Pessoinha x={0} y={-10} cor="#2ec4b6" opacidade={excluido ? 0.3 : 1} />
  </G>
);

export const Estrela: React.FC<Pos & {cor?: string}> = ({cor = '#ffd23f', ...p}) => (
  <G {...p}>
    <polygon points="0,-58 16,-18 58,-18 24,8 36,50 0,24 -36,50 -24,8 -58,-18 -16,-18" fill={cor} {...T} />
  </G>
);

export const Volante: React.FC<Pos> = (p) => (
  <G {...p}>
    <circle r={52} fill="none" stroke={C} strokeWidth={16} />
    <circle r={52} fill="none" stroke="#adb5bd" strokeWidth={8} />
    <circle r={14} fill="#adb5bd" {...T} />
    <path d="M -50 0 L -14 0 M 14 0 L 50 0 M 0 14 L 0 50" stroke={C} strokeWidth={10} />
  </G>
);

export const Ovo: React.FC<Pos & {rachado?: boolean}> = ({rachado = false, ...p}) => (
  <G {...p}>
    <path d="M 0 -50 C 35 -50 45 10 40 25 C 34 48 -34 48 -40 25 C -45 10 -35 -50 0 -50 Z" fill="#fffdf7" {...T} />
    {rachado ? <path d="M -30 0 L -15 -12 L 0 4 L 14 -10 L 30 2" stroke={C} strokeWidth={5} fill="none" /> : null}
  </G>
);

export const Raio: React.FC<Pos> = (p) => (
  <G {...p}>
    <polygon points="10,-60 -35,8 -4,8 -14,60 35,-12 4,-12" fill="#ffd23f" {...T} />
  </G>
);

export const Mudo: React.FC<Pos> = (p) => (
  <G {...p}>
    <path d="M -50 -18 L -24 -18 L 6 -44 L 6 44 L -24 18 L -50 18 Z" fill="#adb5bd" {...T} />
    <path d="M 22 -20 L 56 20 M 56 -20 L 22 20" stroke="#d00000" strokeWidth={10} strokeLinecap="round" />
  </G>
);

export const Triangulo: React.FC<Pos> = (p) => (
  <G {...p}>
    <polygon points="0,-48 48,36 -48,36" fill="none" stroke="#fff" strokeWidth={6} />
    <circle cx={0} cy={-48} r={16} fill="#ffd23f" {...T} strokeWidth={4} />
    <circle cx={48} cy={36} r={16} fill="#ff6b6b" {...T} strokeWidth={4} />
    <circle cx={-48} cy={36} r={16} fill="#2ec4b6" {...T} strokeWidth={4} />
  </G>
);

export const Bandeira: React.FC<Pos> = (p) => (
  <G {...p}>
    <rect x={-34} y={-60} width={9} height={120} rx={4} fill={C} />
    <rect x={-25} y={-56} width={64} height={46} fill="#fff" {...T} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={-25 + (i % 2) * 32} y={-56 + Math.floor(i / 2) * 23} width={32} height={23} fill={i % 3 === 0 ? C : '#fff'} />
    ))}
  </G>
);

export const CacaNiquel: React.FC<Pos> = (p) => (
  <G {...p}>
    <rect x={-58} y={-50} width={104} height={100} rx={14} fill="#ff9f1c" {...T} />
    <rect x={-46} y={-30} width={80} height={40} rx={6} fill="#fff" {...T} strokeWidth={4} />
    <path d="M -26 -2 C -38 -10 -34 -22 -26 -16 C -18 -22 -14 -10 -26 -2 Z" fill="#ff4d6d" />
    <circle cx={10} cy={-10} r={10} fill="#8ecae6" />
    <path d="M 52 -20 L 62 -50" stroke={C} strokeWidth={6} />
    <circle cx={62} cy={-54} r={9} fill="#d00000" {...T} strokeWidth={4} />
  </G>
);

export const Lampada: React.FC<Pos & {acesa?: number}> = ({acesa = 1, ...p}) => (
  <G {...p}>
    <circle r={58} fill="#fff3b0" opacity={0.4 * acesa} />
    <path d="M -30 10 Q -45 -50 0 -52 Q 45 -50 30 10 L 22 30 L -22 30 Z" fill={acesa > 0.5 ? '#ffe066' : '#e9ecef'} {...T} />
    <rect x={-22} y={30} width={44} height={24} rx={6} fill="#adb5bd" {...T} />
  </G>
);

export const PesoCulpa: React.FC<Pos> = (p) => (
  <G {...p}>
    <path d="M -20 -52 Q 0 -72 20 -52" stroke={C} strokeWidth={10} fill="none" />
    <path d="M -40 -45 L 40 -45 L 60 50 L -60 50 Z" fill="#6c757d" {...T} />
    <text y={18} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={30} fill="#fff">
      CULPA
    </text>
  </G>
);

export const Camisa: React.FC<Pos> = (p) => (
  <G {...p}>
    <path d="M -24 -50 L -60 -30 L -45 0 L -32 -8 L -32 50 L 32 50 L 32 -8 L 45 0 L 60 -30 L 24 -50 Q 0 -30 -24 -50 Z" fill="#b8a1ff" {...T} />
  </G>
);

export const BalaoFala: React.FC<Pos & {cor?: string; children?: React.ReactNode}> = ({cor = '#fff', children, ...p}) => (
  <G {...p}>
    <path d="M -55 -42 L 55 -42 Q 66 -42 66 -30 L 66 22 Q 66 34 55 34 L -10 34 L -32 56 L -28 34 L -55 34 Q -66 34 -66 22 L -66 -30 Q -66 -42 -55 -42 Z" fill={cor} {...T} />
    {children}
  </G>
);

export const Check: React.FC<Pos & {visivel?: number}> = ({visivel = 1, ...p}) => (
  <G {...p}>
    <circle r={40} fill="#52b788" {...T} opacity={visivel} />
    <path d="M -18 0 L -4 14 L 20 -14" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - visivel} />
  </G>
);

/** X vermelho desenhado por cima de algo (progresso 0 → 1). */
export const Riscado: React.FC<Pos & {p: number; tam?: number}> = ({p: prog, tam = 80, ...pos}) => (
  <G {...pos}>
    <g stroke="#d00000" strokeWidth={18} strokeLinecap="round" fill="none">
      <path d={`M ${-tam} ${-tam} L ${tam} ${tam}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, prog * 2)} />
      <path d={`M ${tam} ${-tam} L ${-tam} ${tam}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, prog * 2 - 1)} />
    </g>
  </G>
);

export const Amuleto: React.FC<Pos & {tipo: 'mascara-amor' | 'mascara-silencio' | 'mascara-cuidado'}> = ({tipo, ...p}) => (
  <G {...p}>
    <path d="M -60 -30 Q 0 -60 60 -30 Q 62 30 0 52 Q -62 30 -60 -30 Z" fill="#fff" {...T} />
    <ellipse cx={-24} cy={-8} rx={14} ry={9} fill={C} />
    <ellipse cx={24} cy={-8} rx={14} ry={9} fill={C} />
    {tipo === 'mascara-amor' ? <path d="M 0 36 C -24 20 -14 6 0 16 C 14 6 24 20 0 36 Z" fill="#ff4d6d" /> : null}
    {tipo === 'mascara-silencio' ? <path d="M -18 26 L 18 26" stroke={C} strokeWidth={6} strokeLinecap="round" /> : null}
    {tipo === 'mascara-cuidado' ? <rect x={-22} y={16} width={44} height={16} rx={6} fill="#ffd6a5" stroke={C} strokeWidth={4} /> : null}
  </G>
);

/** Ícone de cada um dos 7 sinais (usado nos títulos e no fechamento). */
export const IconeSinal: React.FC<Pos & {n: number}> = ({n, ...p}) => {
  switch (n) {
    case 1:
      return <BombaCoracao {...p} />;
    case 2:
      return <Lampada {...p} />;
    case 3:
      return <PesoCulpa {...p} />;
    case 4:
      return <CacaNiquel {...p} />;
    case 5:
      return (
        <G {...p}>
          <circle r={62} fill="#4361ee" stroke={C} strokeWidth={6} />
          <Triangulo s={0.85} />
        </G>
      );
    case 6:
      return <Bandeira {...p} />;
    default:
      return <Mudo {...p} />;
  }
};
