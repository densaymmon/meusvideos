import React from "react";
import { COR, CONTORNO } from "../tema";

// Professora Lumi — coruja de capelo (ficha da seção 2 do roteiro).
// Camadas animáveis: piscada, bico (3 posições), asas, capelo, inclinação.
export type LumiProps = {
  piscada?: number; // 0 aberto … 1 fechado
  bico?: 0 | 1 | 2; // fechado, meio, aberto
  asaEsq?: number; // graus (positivo = levanta)
  asaDir?: number;
  capeloY?: number; // deslocamento do capelo (px, negativo = sobe)
  capeloGiro?: number; // graus
  olhar?: { x: number; y: number }; // direção das pupilas (-1…1)
  largura?: number;
};

const OlhoLumi: React.FC<{
  cx: number;
  cy: number;
  piscada: number;
  olhar: { x: number; y: number };
}> = ({ cx, cy, piscada, olhar }) => {
  const id = `palpebra-${cx}`;
  return (
    <g>
      <clipPath id={id}>
        <circle cx={cx} cy={cy} r={47} />
      </clipPath>
      <circle
        cx={cx}
        cy={cy}
        r={47}
        fill="#FFFFFF"
        {...CONTORNO}
        strokeWidth={5}
      />
      <g clipPath={`url(#${id})`}>
        <circle
          cx={cx + olhar.x * 8}
          cy={cy + olhar.y * 6}
          r={38}
          fill={COR.ambar}
        />
        <circle
          cx={cx + olhar.x * 11}
          cy={cy + olhar.y * 8}
          r={20}
          fill={COR.marinho}
        />
        <circle
          cx={cx + olhar.x * 11 - 11}
          cy={cy + olhar.y * 8 - 13}
          r={10}
          fill="#FFFFFF"
        />
        <circle
          cx={cx + olhar.x * 11 + 10}
          cy={cy + olhar.y * 8 + 8}
          r={4.5}
          fill="#FFFFFF"
        />
        {/* pálpebra: desce de cima */}
        <rect
          x={cx - 50}
          y={cy - 50}
          width={100}
          height={100 * piscada}
          fill={COR.pessego}
        />
        {piscada > 0.05 && (
          <path
            d={`M ${cx - 46} ${cy - 50 + 100 * piscada} Q ${cx} ${cy - 40 + 100 * piscada} ${cx + 46} ${cy - 50 + 100 * piscada}`}
            fill="none"
            {...CONTORNO}
            strokeWidth={5}
          />
        )}
      </g>
    </g>
  );
};

export const Lumi: React.FC<LumiProps> = ({
  piscada = 0,
  bico = 0,
  asaEsq = 0,
  asaDir = 0,
  capeloY = 0,
  capeloGiro = 0,
  olhar = { x: 0, y: 0 },
  largura = 400,
}) => {
  const abertura = [0, 9, 20][bico];
  return (
    <svg
      viewBox="0 0 400 470"
      width={largura}
      height={(largura * 470) / 400}
      style={{ overflow: "visible" }}
    >
      {/* pés */}
      <ellipse
        cx={160}
        cy={452}
        rx={30}
        ry={13}
        fill={COR.mostarda}
        {...CONTORNO}
        strokeWidth={5}
      />
      <ellipse
        cx={240}
        cy={452}
        rx={30}
        ry={13}
        fill={COR.mostarda}
        {...CONTORNO}
        strokeWidth={5}
      />

      {/* asa esquerda (atrás do corpo) */}
      <g transform={`rotate(${asaEsq} 85 250)`}>
        <path
          d="M 85 230 C 20 260 18 360 70 410 C 80 380 95 330 110 300 Z"
          fill={COR.pessego}
          {...CONTORNO}
        />
        <path
          d="M 52 372 C 60 390 66 402 70 410 C 74 392 80 375 86 360"
          fill={COR.pessegoEscuro}
          stroke="none"
        />
      </g>
      {/* asa direita */}
      <g transform={`rotate(${-asaDir} 315 250)`}>
        <path
          d="M 315 230 C 380 260 382 360 330 410 C 320 380 305 330 290 300 Z"
          fill={COR.pessego}
          {...CONTORNO}
        />
        <path
          d="M 348 372 C 340 390 334 402 330 410 C 326 392 320 375 314 360"
          fill={COR.pessegoEscuro}
          stroke="none"
        />
      </g>

      {/* corpo */}
      <ellipse
        cx={200}
        cy={285}
        rx={150}
        ry={170}
        fill={COR.pessego}
        {...CONTORNO}
      />
      {/* peito creme com "penas" */}
      <ellipse cx={200} cy={330} rx={100} ry={112} fill={COR.creme} />
      {[0, 1, 2].map((r) =>
        [-1, 0, 1].map((c) => (
          <path
            key={`${r}${c}`}
            d={`M ${200 + c * 42 - 12} ${330 + r * 34} q 12 12 24 0`}
            fill="none"
            stroke={COR.pessegoEscuro}
            strokeWidth={4}
            strokeLinecap="round"
          />
        )),
      )}

      {/* tufos das orelhas */}
      <path d="M 92 150 L 78 92 L 140 128 Z" fill={COR.pessego} {...CONTORNO} />
      <path
        d="M 308 150 L 322 92 L 260 128 Z"
        fill={COR.pessego}
        {...CONTORNO}
      />

      {/* máscara facial creme */}
      <circle cx={148} cy={200} r={74} fill={COR.creme} />
      <circle cx={252} cy={200} r={74} fill={COR.creme} />

      {/* cachecol de tricô mostarda */}
      <path
        d="M 92 262 Q 200 300 308 262 L 312 292 Q 200 336 88 292 Z"
        fill={COR.mostarda}
        {...CONTORNO}
      />
      <path
        d="M 250 292 L 262 368 L 292 360 L 280 286"
        fill={COR.mostarda}
        {...CONTORNO}
      />
      {[105, 130, 155, 180, 205, 230, 255, 280].map((x) => (
        <path
          key={x}
          d={`M ${x} ${276 + Math.abs(x - 200) * -0.06} l 6 14`}
          stroke={COR.pessegoEscuro}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}

      {/* olhos */}
      <OlhoLumi cx={148} cy={198} piscada={piscada} olhar={olhar} />
      <OlhoLumi cx={252} cy={198} piscada={piscada} olhar={olhar} />

      {/* óculos redondos roxos */}
      <circle
        cx={148}
        cy={198}
        r={57}
        fill="none"
        stroke={COR.roxo}
        strokeWidth={7}
      />
      <circle
        cx={252}
        cy={198}
        r={57}
        fill="none"
        stroke={COR.roxo}
        strokeWidth={7}
      />
      <path
        d="M 196 190 Q 200 182 204 190"
        fill="none"
        stroke={COR.roxo}
        strokeWidth={7}
        strokeLinecap="round"
      />

      {/* bico: 3 posições */}
      <path
        d={`M 182 248 L 218 248 L 200 ${270 + abertura * 0.2} Z`}
        fill="#EE8A3C"
        {...CONTORNO}
        strokeWidth={5}
      />
      {abertura > 0 && (
        <path
          d={`M 186 ${254 + abertura * 0.45} L 214 ${254 + abertura * 0.45} L 200 ${270 + abertura} Z`}
          fill="#D9702A"
          {...CONTORNO}
          strokeWidth={5}
        />
      )}

      {/* capelo azul-marinho com pingente mostarda */}
      <g transform={`translate(0 ${capeloY}) rotate(${capeloGiro} 200 90)`}>
        <path
          d="M 140 112 Q 200 128 260 112 L 256 80 L 144 80 Z"
          fill={COR.marinho}
          {...CONTORNO}
        />
        <path
          d="M 200 40 L 312 80 L 200 116 L 88 80 Z"
          fill={COR.marinhoClaro}
          {...CONTORNO}
        />
        <circle cx={200} cy={78} r={7} fill={COR.mostarda} />
        <path
          d="M 200 78 Q 268 86 290 110 L 292 142"
          fill="none"
          stroke={COR.mostarda}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <path
          d="M 284 140 L 300 140 L 304 168 L 280 168 Z"
          fill={COR.mostarda}
          {...CONTORNO}
          strokeWidth={4}
        />
      </g>
    </svg>
  );
};
