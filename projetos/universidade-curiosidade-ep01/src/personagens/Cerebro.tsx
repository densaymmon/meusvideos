import React from "react";
import { COR, CONTORNO } from "../tema";

// Cérebro cartoon "travesso": pisca um olho e solta uma língua-de-sogra.
export type CerebroProps = {
  piscadela?: number; // 0…1 olho direito fecha
  serpentina?: number; // 0…1 quanto a língua-de-sogra desenrolou
  largura?: number;
};

const ROSA = "#F4A9A0";
const DOBRA = "#D9776E";

export const Cerebro: React.FC<CerebroProps> = ({
  piscadela = 0,
  serpentina = 0,
  largura = 520,
}) => {
  // língua-de-sogra: tubo reto que sai da boca e enrola na ponta
  const comp = 20 + serpentina * 190;
  const enrolado = 1 - serpentina;
  return (
    <svg
      viewBox="0 0 520 420"
      width={largura}
      height={(largura * 420) / 520}
      style={{ overflow: "visible" }}
    >
      {/* tronco cerebral */}
      <path
        d="M 240 330 Q 236 390 214 410 L 266 410 Q 262 380 276 330 Z"
        fill={DOBRA}
        {...CONTORNO}
      />
      {/* contorno do cérebro em "nuvem" */}
      <path
        d="M 90 230 C 40 210 44 130 100 118 C 104 64 170 40 210 66 C 236 28 306 30 326 70 C 376 46 440 84 430 140 C 486 160 482 240 432 262 C 440 316 380 350 336 330 C 310 362 240 364 214 334 C 170 360 100 340 104 296 C 62 290 54 244 90 230 Z"
        fill={ROSA}
        {...CONTORNO}
      />
      {/* divisão dos hemisférios e dobras */}
      <path
        d="M 262 58 Q 250 120 268 170"
        fill="none"
        stroke={DOBRA}
        strokeWidth={6}
        strokeLinecap="round"
      />
      {[
        "M 120 150 q 30 -20 60 0 q 20 18 50 2",
        "M 300 110 q 30 -18 56 4 q 22 18 48 4",
        "M 96 262 q 30 18 62 -2",
        "M 360 290 q 24 -24 56 -10",
        "M 150 92 q 22 14 46 -2",
        "M 330 220 q -10 30 24 44",
      ].map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={DOBRA}
          strokeWidth={6}
          strokeLinecap="round"
        />
      ))}

      {/* rosto travesso */}
      {/* sobrancelhas: uma arqueada, outra baixa */}
      <path
        d="M 170 168 Q 196 150 224 162"
        fill="none"
        stroke={COR.marinho}
        strokeWidth={7}
        strokeLinecap="round"
      />
      <path
        d="M 288 170 Q 314 172 340 160"
        fill="none"
        stroke={COR.marinho}
        strokeWidth={7}
        strokeLinecap="round"
      />
      {/* olho esquerdo aberto */}
      <ellipse
        cx={198}
        cy={200}
        rx={22}
        ry={26}
        fill="#FFFFFF"
        {...CONTORNO}
        strokeWidth={5}
      />
      <circle cx={204} cy={204} r={11} fill={COR.marinho} />
      <circle cx={200} cy={198} r={4} fill="#FFFFFF" />
      {/* olho direito: aberto → piscadela */}
      {piscadela < 0.5 ? (
        <g>
          <ellipse
            cx={312}
            cy={200}
            rx={22}
            ry={26 * (1 - piscadela * 1.6)}
            fill="#FFFFFF"
            {...CONTORNO}
            strokeWidth={5}
          />
          <circle
            cx={318}
            cy={204}
            r={11 * (1 - piscadela)}
            fill={COR.marinho}
          />
        </g>
      ) : (
        <path
          d="M 290 206 Q 312 190 334 206"
          fill="none"
          stroke={COR.marinho}
          strokeWidth={7}
          strokeLinecap="round"
        />
      )}
      {/* sorriso de canto */}
      <path
        d="M 214 254 Q 262 290 314 246"
        fill="none"
        stroke={COR.marinho}
        strokeWidth={7}
        strokeLinecap="round"
      />

      {/* língua-de-sogra (squash & stretch fica no componente pai) */}
      {serpentina > 0.01 && (
        <g transform="translate(300 262) rotate(-14)">
          <rect
            x={0}
            y={-12}
            width={comp}
            height={24}
            rx={6}
            fill={COR.mostarda}
            {...CONTORNO}
            strokeWidth={5}
          />
          {[0.25, 0.5, 0.75].map((f) => (
            <rect
              key={f}
              x={comp * f}
              y={-12}
              width={8}
              height={24}
              fill={COR.coral}
            />
          ))}
          {enrolado > 0.05 && (
            <circle
              cx={comp + 18 * enrolado}
              cy={0}
              r={6 + 22 * enrolado}
              fill="none"
              stroke={COR.mostarda}
              strokeWidth={22}
            />
          )}
          {enrolado > 0.05 && (
            <circle
              cx={comp + 18 * enrolado}
              cy={0}
              r={6 + 22 * enrolado}
              fill="none"
              {...CONTORNO}
              strokeWidth={4}
            />
          )}
          {serpentina > 0.95 && (
            <path
              d={`M ${comp} -12 L ${comp + 26} 0 L ${comp} 12`}
              fill={COR.mostarda}
              {...CONTORNO}
              strokeWidth={5}
            />
          )}
        </g>
      )}
    </svg>
  );
};
