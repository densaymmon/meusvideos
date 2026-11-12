import React from "react";
import { COR, CONTORNO } from "../tema";

// Quarto adolescente dos anos 60 à noite: paredes azul-marinho, luz âmbar de abajur.
// Camadas separadas para parallax: Parede (fundo) e Móveis (frente). 1920×1080.

const MADEIRA = "#9C6A48";
const MADEIRA_ESC = "#7A4F35";

type ParedeProps = {
  t: number; // segundos (para o relógio)
  giroRelogio?: number; // voltas extras do ponteiro dos minutos (time-lapse)
  onda?: number; // 0…1 parede ondulando
  derrete?: number; // 0…1 formas roxas/pêssego "derretendo" do teto
};

export const ParedeQuarto: React.FC<ParedeProps> = ({
  t,
  giroRelogio = 0,
  onda = 0,
  derrete = 0,
}) => {
  const minutos = 300 + t * 6 + giroRelogio * 360;
  const horas = 3 * 30 + minutos / 12;
  const freq = 0.0045 + 0.0012 * Math.sin(t * 2.4);
  const pingos = [
    { x: 40, w: 130, h: 260, c: COR.roxo },
    { x: 230, w: 90, h: 180, c: COR.pessego },
    { x: 420, w: 150, h: 330, c: COR.roxoClaro },
    { x: 860, w: 110, h: 220, c: COR.pessego },
    { x: 1040, w: 160, h: 300, c: COR.roxo },
    { x: 1320, w: 100, h: 200, c: COR.pessego },
    { x: 1500, w: 140, h: 280, c: COR.roxoClaro },
    { x: 1720, w: 120, h: 240, c: COR.roxo },
  ];
  return (
    <svg
      viewBox="0 0 1920 1080"
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <filter id="onda" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={`${freq} ${freq * 2.6}`}
            numOctaves={2}
            seed={4}
          />
          <feDisplacementMap
            in="SourceGraphic"
            scale={onda * 70}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <pattern
          id="papelParede"
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <rect width="120" height="120" fill={COR.marinho} />
          <rect
            x="0"
            width="56"
            height="120"
            fill={COR.marinhoClaro}
            opacity="0.45"
          />
          <circle cx="88" cy="30" r="5" fill={COR.mostarda} opacity="0.12" />
          <circle cx="88" cy="90" r="5" fill={COR.mostarda} opacity="0.12" />
        </pattern>
      </defs>
      <g filter={onda > 0.001 ? "url(#onda)" : undefined}>
        {/* parede e rodapé */}
        <rect width="1920" height="820" fill="url(#papelParede)" />
        {/* pingos "derretendo" do teto */}
        {derrete > 0.001 &&
          pingos.map((p, i) => {
            const h = p.h * derrete * (0.85 + 0.15 * Math.sin(t * 1.7 + i));
            return (
              <path
                key={i}
                d={`M ${p.x} -10 L ${p.x} ${h} Q ${p.x + p.w / 2} ${h + p.w * 0.9} ${p.x + p.w} ${h} L ${p.x + p.w} -10 Z`}
                fill={p.c}
                opacity={0.75}
              />
            );
          })}
        <rect y="790" width="1920" height="34" fill={MADEIRA_ESC} />
        {/* janela com lua e estrelas */}
        <rect
          x="520"
          y="160"
          width="270"
          height="290"
          rx="10"
          fill="#141C34"
          stroke={MADEIRA}
          strokeWidth={18}
        />
        <circle cx="700" cy="235" r="40" fill={COR.creme} />
        <circle cx="718" cy="222" r="36" fill="#141C34" />
        {[
          [560, 210],
          [610, 380],
          [745, 330],
          [650, 260],
          [580, 320],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={3 + (i % 2) * 2}
            fill={COR.creme}
            opacity={0.6 + 0.4 * Math.sin(t * 2 + i * 1.3)}
          />
        ))}
        <path
          d="M 655 160 L 655 450 M 520 305 L 790 305"
          stroke={MADEIRA}
          strokeWidth={12}
        />
        {/* cortinas roxas */}
        <path
          d="M 488 140 Q 520 300 498 480 L 560 480 Q 548 300 560 140 Z"
          fill={COR.roxo}
          {...CONTORNO}
        />
        <path
          d="M 822 140 Q 790 300 812 480 L 750 480 Q 762 300 750 140 Z"
          fill={COR.roxo}
          {...CONTORNO}
        />
        <rect
          x="470"
          y="128"
          width="370"
          height="20"
          rx="10"
          fill={MADEIRA}
          {...CONTORNO}
          strokeWidth={5}
        />
        {/* flâmula na parede */}
        <path
          d="M 1080 250 L 1300 290 L 1080 330 Z"
          fill={COR.mostarda}
          {...CONTORNO}
        />
        <rect
          x="1066"
          y="240"
          width="18"
          height="100"
          rx="6"
          fill={COR.creme}
          {...CONTORNO}
          strokeWidth={5}
        />
        {/* relógio de parede */}
        <g>
          <circle cx="300" cy="330" r="118" fill={MADEIRA} {...CONTORNO} />
          <circle
            cx="300"
            cy="330"
            r="98"
            fill={COR.creme}
            {...CONTORNO}
            strokeWidth={5}
          />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={300 + Math.sin(a) * 80}
                y1={330 - Math.cos(a) * 80}
                x2={300 + Math.sin(a) * (i % 3 === 0 ? 64 : 72)}
                y2={330 - Math.cos(a) * (i % 3 === 0 ? 64 : 72)}
                stroke={COR.marinho}
                strokeWidth={i % 3 === 0 ? 7 : 4}
                strokeLinecap="round"
              />
            );
          })}
          <line
            x1="300"
            y1="330"
            x2="300"
            y2="282"
            stroke={COR.marinho}
            strokeWidth={10}
            strokeLinecap="round"
            transform={`rotate(${horas} 300 330)`}
          />
          <line
            x1="300"
            y1="330"
            x2="300"
            y2="258"
            stroke={COR.coral}
            strokeWidth={6}
            strokeLinecap="round"
            transform={`rotate(${minutos} 300 330)`}
          />
          <circle cx="300" cy="330" r="9" fill={COR.marinho} />
        </g>
      </g>
      {/* chão */}
      <rect y="824" width="1920" height="256" fill="#2A2650" />
      <path
        d="M 0 900 L 1920 900 M 0 990 L 1920 990"
        stroke="#231F45"
        strokeWidth={6}
      />
    </svg>
  );
};

const SVG_CHEIO = { position: "absolute", inset: 0 } as const;

/** Cabeceira, travesseiro, colchão, criado-mudo e abajur (atrás do personagem). */
export const MoveisQuarto: React.FC = () => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={SVG_CHEIO}>
    {/* cabeceira */}
    <path
      d="M 820 700 L 820 500 Q 820 450 870 450 L 1430 450 Q 1480 450 1480 500 L 1480 700 Z"
      fill={MADEIRA}
      {...CONTORNO}
    />
    <rect
      x="860"
      y="490"
      width="580"
      height="150"
      rx="16"
      fill={MADEIRA_ESC}
      opacity={0.6}
    />
    {/* travesseiro */}
    <path
      d="M 1230 640 Q 1220 590 1270 588 L 1420 590 Q 1462 594 1452 642 Z"
      fill={COR.creme}
      {...CONTORNO}
    />
    {/* colchão */}
    <rect
      x="800"
      y="640"
      width="700"
      height="56"
      rx="18"
      fill={COR.creme}
      {...CONTORNO}
    />
    {/* criado-mudo */}
    <rect
      x="1540"
      y="640"
      width="190"
      height="200"
      rx="10"
      fill={MADEIRA}
      {...CONTORNO}
    />
    <rect
      x="1562"
      y="700"
      width="146"
      height="54"
      rx="6"
      fill={MADEIRA_ESC}
      {...CONTORNO}
      strokeWidth={4}
    />
    <circle cx="1635" cy="727" r="7" fill={COR.mostarda} />
    {/* abajur */}
    <path
      d="M 1600 640 L 1670 640 L 1650 616 L 1620 616 Z"
      fill={MADEIRA_ESC}
      {...CONTORNO}
      strokeWidth={5}
    />
    <rect x="1628" y="560" width="14" height="60" fill={MADEIRA_ESC} />
    <path
      d="M 1570 580 L 1700 580 L 1670 486 L 1600 486 Z"
      fill={COR.mostarda}
      {...CONTORNO}
    />
  </svg>
);

/** Cobertor roxo (na frente do personagem: ele está sentado NA cama, coberto). */
export const CobertorQuarto: React.FC = () => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={SVG_CHEIO}>
    <path
      d="M 790 672 Q 1150 652 1510 672 L 1520 812 Q 1150 830 780 812 Z"
      fill={COR.roxo}
      {...CONTORNO}
    />
    <path
      d="M 900 676 Q 960 700 1020 668"
      fill="none"
      stroke={COR.roxoClaro}
      strokeWidth={6}
      strokeLinecap="round"
    />
    {[880, 1000, 1120, 1240, 1360].map((x) => (
      <circle
        key={x}
        cx={x}
        cy={748}
        r={14}
        fill={COR.mostarda}
        opacity={0.55}
      />
    ))}
    <rect
      x="800"
      y="808"
      width="30"
      height="40"
      fill={MADEIRA_ESC}
      {...CONTORNO}
      strokeWidth={5}
    />
    <rect
      x="1470"
      y="808"
      width="30"
      height="40"
      fill={MADEIRA_ESC}
      {...CONTORNO}
      strokeWidth={5}
    />
  </svg>
);

/** Brilho âmbar do abajur (vai por cima de tudo, em modo "screen"). */
export const BrilhoAbajur: React.FC<{ intensidade?: number }> = ({
  intensidade = 1,
}) => (
  <svg
    viewBox="0 0 1920 1080"
    width={1920}
    height={1080}
    style={{ ...SVG_CHEIO, mixBlendMode: "screen", pointerEvents: "none" }}
  >
    <defs>
      <radialGradient
        id="luzAbajur"
        cx="1635"
        cy="540"
        r="900"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset="0"
          stopColor={COR.mostarda}
          stopOpacity={0.55 * intensidade}
        />
        <stop
          offset="0.35"
          stopColor={COR.ambar}
          stopOpacity={0.22 * intensidade}
        />
        <stop offset="1" stopColor={COR.ambar} stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#luzAbajur)" />
  </svg>
);
