import React from "react";
import { COR, CONTORNO } from "../tema";

// Téo — aluno-cobaia de desenho: ~20 anos, cabelo castanho-escuro bagunçado,
// pele morena clara, rosto redondo, moletom lavanda largo com patch creme.
// `cansaco` 0 = descansado, 1 = cansado, 2 = exausto (olheiras, cabelo, postura).
export type TeoProps = {
  piscada?: number;
  cansaco?: number;
  aceno?: number; // 0…1 mão levantada acenando
  sorriso?: number; // 0…1
  largura?: number;
};

const CABELO = "#3B2A22";

export const Teo: React.FC<TeoProps> = ({
  piscada = 0,
  cansaco = 0,
  aceno = 0,
  sorriso = 1,
  largura = 420,
}) => {
  const curva = Math.min(cansaco, 2) * 6; // postura curvada
  const olheira = Math.min(1, cansaco / 1.5);
  const olho = (cx: number) => (
    <g>
      {sorriso > 0.6 && cansaco < 0.5 ? (
        // olhos sorridentes (arcos), fecham na piscada
        <path
          d={`M ${cx - 14} ${150 + piscada * 3} Q ${cx} ${136 + piscada * 14} ${cx + 14} ${150 + piscada * 3}`}
          fill="none"
          stroke={COR.marinho}
          strokeWidth={6}
          strokeLinecap="round"
        />
      ) : (
        <g>
          <ellipse
            cx={cx}
            cy={148}
            rx={11}
            ry={13 * (1 - piscada * 0.92)}
            fill={COR.marinho}
          />
          <circle
            cx={cx - 3}
            cy={144}
            r={3}
            fill="#FFFFFF"
            opacity={1 - piscada}
          />
        </g>
      )}
      <path
        d={`M ${cx - 15} 168 Q ${cx} 176 ${cx + 15} 168`}
        fill="none"
        stroke={COR.roxo}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={olheira}
      />
    </g>
  );
  return (
    <svg
      viewBox="0 0 420 520"
      width={largura}
      height={(largura * 520) / 420}
      style={{ overflow: "visible" }}
    >
      <g transform={`translate(0 ${curva}) rotate(${curva * 0.5} 210 520)`}>
        {/* moletom lavanda largo */}
        <path
          d="M 70 520 Q 60 330 130 290 Q 210 262 290 290 Q 360 330 350 520 Z"
          fill={COR.lavanda}
          {...CONTORNO}
        />
        {/* capuz atrás do pescoço */}
        <path
          d="M 140 292 Q 210 330 280 292 Q 270 270 210 268 Q 150 270 140 292 Z"
          fill="#A58FD6"
          {...CONTORNO}
          strokeWidth={5}
        />
        {/* cordões */}
        <path
          d="M 188 306 L 182 372 M 232 306 L 238 372"
          stroke={COR.creme}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <circle
          cx={182}
          cy={376}
          r={6}
          fill={COR.creme}
          {...CONTORNO}
          strokeWidth={3}
        />
        <circle
          cx={238}
          cy={376}
          r={6}
          fill={COR.creme}
          {...CONTORNO}
          strokeWidth={3}
        />
        {/* patch creme redondo no peito */}
        <circle
          cx={262}
          cy={410}
          r={24}
          fill={COR.creme}
          {...CONTORNO}
          strokeWidth={4}
        />
        <path d="M 252 410 q 10 -12 20 0 q -10 12 -20 0" fill={COR.mostarda} />

        {/* braço parado (lado direito da tela) */}
        <path
          d="M 308 320 Q 350 380 336 470"
          fill="none"
          stroke={COR.marinho}
          strokeWidth={60}
          strokeLinecap="round"
        />
        <path
          d="M 308 320 Q 350 380 336 470"
          fill="none"
          stroke={COR.lavanda}
          strokeWidth={48}
          strokeLinecap="round"
        />
        <circle
          cx={334}
          cy={486}
          r={22}
          fill={COR.peleMorena}
          {...CONTORNO}
          strokeWidth={5}
        />

        {/* braço que acena */}
        <g
          transform={`rotate(${-aceno * 120 + Math.sin(aceno * 12) * 8 * aceno} 112 330)`}
        >
          <path
            d="M 112 320 Q 70 380 84 470"
            fill="none"
            stroke={COR.marinho}
            strokeWidth={60}
            strokeLinecap="round"
          />
          <path
            d="M 112 320 Q 70 380 84 470"
            fill="none"
            stroke={COR.lavanda}
            strokeWidth={48}
            strokeLinecap="round"
          />
          <circle
            cx={86}
            cy={486}
            r={22}
            fill={COR.peleMorena}
            {...CONTORNO}
            strokeWidth={5}
          />
        </g>

        {/* pescoço */}
        <rect
          x={192}
          y={240}
          width={36}
          height={40}
          fill={COR.peleMorena}
          {...CONTORNO}
          strokeWidth={5}
        />

        {/* cabeça */}
        <g transform={`rotate(${cansaco * 4} 210 250)`}>
          <ellipse
            cx={128}
            cy={160}
            rx={14}
            ry={20}
            fill={COR.peleMorena}
            {...CONTORNO}
            strokeWidth={5}
          />
          <ellipse
            cx={292}
            cy={160}
            rx={14}
            ry={20}
            fill={COR.peleMorena}
            {...CONTORNO}
            strokeWidth={5}
          />
          <circle
            cx={210}
            cy={160}
            r={86}
            fill={COR.peleMorena}
            {...CONTORNO}
          />
          {/* bochechas */}
          <ellipse
            cx={158}
            cy={190}
            rx={16}
            ry={10}
            fill={COR.coral}
            opacity={0.35 * (1 - olheira)}
          />
          <ellipse
            cx={262}
            cy={190}
            rx={16}
            ry={10}
            fill={COR.coral}
            opacity={0.35 * (1 - olheira)}
          />
          {/* cabelo bagunçado (mais bagunçado com cansaço) */}
          <path
            d={`M 122 150 Q 112 70 170 60 L ${178 - cansaco * 4} ${30 - cansaco * 8} L 200 62 L ${222 + cansaco * 3} ${26 - cansaco * 10} L 236 64 L ${276 + cansaco * 6} ${44 - cansaco * 8} Q 304 90 298 150 Q 280 108 236 110 L 246 92 Q 210 104 196 110 L 196 92 Q 160 108 122 150 Z`}
            fill={CABELO}
            {...CONTORNO}
            strokeWidth={5}
          />
          {olho(176)}
          {olho(244)}
          {/* nariz */}
          <path
            d="M 210 168 q -7 14 3 16"
            fill="none"
            stroke={COR.marinho}
            strokeWidth={4}
            strokeLinecap="round"
          />
          {/* boca */}
          {sorriso > 0.5 ? (
            <path
              d="M 180 202 Q 210 232 240 202 Z"
              fill="#7A2E2E"
              {...CONTORNO}
              strokeWidth={5}
            />
          ) : (
            <path
              d="M 188 214 Q 210 206 232 214"
              fill="none"
              stroke={COR.marinho}
              strokeWidth={5}
              strokeLinecap="round"
            />
          )}
        </g>
      </g>
    </svg>
  );
};
