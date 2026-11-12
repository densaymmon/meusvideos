import React from "react";
import { COR, CONTORNO } from "../tema";

// Randy (1963–64), estilizado e sem semelhança realista: adolescente magro,
// cabelo curto castanho-claro, camisa xadrez vermelha e azul-marinho, calça cáqui.
// Pose: sentado na beira da cama, de frente, segurando uma garrafa de refrigerante.
export type RandyProps = {
  piscada?: number; // 0…1
  cabecaGiro?: number; // graus
  braco?: number; // 0 = mão no joelho … 1 = punho erguido (pose de jogador)
  olheira?: number; // 0…1 intensidade das olheiras
  largura?: number;
};

const PELE = "#F2C6A4";
const CABELO = "#A9744A";
const CAMISA = "#C7463F";
const CAQUI = "#CDAA70";

export const Randy: React.FC<RandyProps> = ({
  piscada = 0,
  cabecaGiro = 0,
  braco = 0,
  olheira = 0.6,
  largura = 360,
}) => {
  const olho = (cx: number) => (
    <g>
      <ellipse
        cx={cx}
        cy={128}
        rx={17}
        ry={21}
        fill="#FFFFFF"
        {...CONTORNO}
        strokeWidth={4}
      />
      <circle cx={cx + 1} cy={130} r={6} fill={COR.marinho} />
      <circle cx={cx - 1} cy={127} r={2} fill="#FFFFFF" />
      {/* pálpebra */}
      <clipPath id={`randy-olho-${cx}`}>
        <ellipse cx={cx} cy={128} rx={17} ry={21} />
      </clipPath>
      <rect
        x={cx - 20}
        y={105}
        width={40}
        height={44 * piscada}
        fill={PELE}
        clipPath={`url(#randy-olho-${cx})`}
      />
      {/* olheiras roxas */}
      <path
        d={`M ${cx - 16} ${154} Q ${cx} ${163} ${cx + 16} ${154}`}
        fill="none"
        stroke={COR.roxoClaro}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={olheira}
      />
    </g>
  );

  // braço direito do personagem (lado esquerdo da tela): da mão no joelho até punho erguido
  const anguloBraco = 10 + braco * 155;
  return (
    <svg
      viewBox="0 0 360 540"
      width={largura}
      height={(largura * 540) / 360}
      style={{ overflow: "visible" }}
    >
      <defs>
        <pattern
          id="xadrez"
          width="34"
          height="34"
          patternUnits="userSpaceOnUse"
        >
          <rect width="34" height="34" fill={CAMISA} />
          <rect
            x="0"
            y="12"
            width="34"
            height="9"
            fill={COR.marinho}
            opacity="0.55"
          />
          <rect
            x="12"
            y="0"
            width="9"
            height="34"
            fill={COR.marinho}
            opacity="0.55"
          />
          <rect
            x="0"
            y="27"
            width="34"
            height="3"
            fill={COR.creme}
            opacity="0.35"
          />
          <rect
            x="27"
            y="0"
            width="3"
            height="34"
            fill={COR.creme}
            opacity="0.35"
          />
        </pattern>
      </defs>

      {/* pernas (canelas) e sapatos */}
      <path
        d="M 130 380 L 124 498 L 160 498 L 168 380 Z"
        fill={CAQUI}
        {...CONTORNO}
      />
      <path
        d="M 192 380 L 200 498 L 236 498 L 230 380 Z"
        fill={CAQUI}
        {...CONTORNO}
      />
      <path
        d="M 112 500 Q 112 482 142 484 Q 166 486 166 504 L 166 512 L 108 512 Z"
        fill="#5A3B2E"
        {...CONTORNO}
      />
      <path
        d="M 196 504 Q 196 486 220 484 Q 250 482 250 500 L 254 512 L 196 512 Z"
        fill="#5A3B2E"
        {...CONTORNO}
      />
      {/* coxas em escorço */}
      <path
        d="M 116 330 Q 112 392 146 394 L 214 394 Q 248 392 244 330 Z"
        fill={CAQUI}
        {...CONTORNO}
      />
      <path
        d="M 180 342 L 180 392"
        stroke={COR.marinho}
        strokeWidth={4}
        opacity={0.5}
      />

      {/* tronco com camisa xadrez */}
      <path
        d="M 120 200 Q 180 186 240 200 L 250 340 Q 180 352 110 340 Z"
        fill="url(#xadrez)"
        {...CONTORNO}
      />
      {/* gola */}
      <path
        d="M 156 196 L 180 226 L 204 196"
        fill={CAMISA}
        {...CONTORNO}
        strokeWidth={5}
      />

      {/* braço esquerdo do personagem (direita da tela) segurando a garrafa no colo */}
      <path
        d="M 238 204 Q 266 216 262 262 L 236 264 Z"
        fill="url(#xadrez)"
        {...CONTORNO}
        strokeWidth={5}
      />
      <path
        d="M 250 262 Q 258 306 222 324"
        fill="none"
        stroke={COR.marinho}
        strokeWidth={30}
        strokeLinecap="round"
      />
      <path
        d="M 250 262 Q 258 306 222 324"
        fill="none"
        stroke={PELE}
        strokeWidth={20}
        strokeLinecap="round"
      />
      {/* garrafa de vidro */}
      <g transform="rotate(-18 205 300)">
        <path
          d="M 196 230 L 214 230 L 216 258 Q 232 272 230 300 L 230 352 Q 205 362 180 352 L 180 300 Q 178 272 194 258 Z"
          fill="#D9EBDD"
          opacity={0.95}
          {...CONTORNO}
          strokeWidth={5}
        />
        <rect
          x={183}
          y={300}
          width={44}
          height={30}
          fill={COR.mostarda}
          stroke={COR.marinho}
          strokeWidth={3}
        />
        <rect
          x={194}
          y={222}
          width={22}
          height={10}
          rx={3}
          fill={COR.mostarda}
          {...CONTORNO}
          strokeWidth={4}
        />
        <path
          d="M 188 290 L 188 345"
          stroke="#FFFFFF"
          strokeWidth={5}
          strokeLinecap="round"
          opacity={0.8}
        />
      </g>
      <circle
        cx={222}
        cy={322}
        r={16}
        fill={PELE}
        {...CONTORNO}
        strokeWidth={5}
      />

      {/* braço direito do personagem (esquerda da tela): anima de joelho → punho erguido */}
      <g transform={`rotate(${anguloBraco} 126 210)`}>
        <path
          d="M 126 204 Q 98 214 100 258 L 126 262 Z"
          fill="url(#xadrez)"
          {...CONTORNO}
          strokeWidth={5}
        />
        <path
          d="M 112 258 L 112 330"
          fill="none"
          stroke={COR.marinho}
          strokeWidth={30}
          strokeLinecap="round"
        />
        <path
          d="M 112 258 L 112 330"
          fill="none"
          stroke={PELE}
          strokeWidth={20}
          strokeLinecap="round"
        />
        <circle
          cx={112}
          cy={338}
          r={17}
          fill={PELE}
          {...CONTORNO}
          strokeWidth={5}
        />
      </g>

      {/* pescoço */}
      <rect
        x={166}
        y={168}
        width={28}
        height={30}
        fill={PELE}
        {...CONTORNO}
        strokeWidth={5}
      />

      {/* cabeça */}
      <g transform={`rotate(${cabecaGiro} 180 180)`}>
        <ellipse
          cx={118}
          cy={130}
          rx={12}
          ry={18}
          fill={PELE}
          {...CONTORNO}
          strokeWidth={5}
        />
        <ellipse
          cx={242}
          cy={130}
          rx={12}
          ry={18}
          fill={PELE}
          {...CONTORNO}
          strokeWidth={5}
        />
        <ellipse cx={180} cy={122} rx={62} ry={70} fill={PELE} {...CONTORNO} />
        {/* cabelo curto (crew cut) */}
        <path
          d="M 120 108 Q 116 50 180 46 Q 244 50 240 108 Q 222 84 180 82 Q 138 84 120 108 Z"
          fill={CABELO}
          {...CONTORNO}
          strokeWidth={5}
        />
        <path
          d="M 150 60 l 4 14 M 172 54 l 2 14 M 194 54 l -1 14 M 214 60 l -4 14"
          stroke="#8A5B37"
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* sobrancelhas levantadas (espanto) */}
        <path
          d="M 142 98 Q 156 90 170 96"
          fill="none"
          stroke={CABELO}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <path
          d="M 190 96 Q 204 90 218 98"
          fill="none"
          stroke={CABELO}
          strokeWidth={6}
          strokeLinecap="round"
        />
        {olho(156)}
        {olho(204)}
        {/* nariz e boca */}
        <path
          d="M 180 140 q -6 12 2 14"
          fill="none"
          stroke={COR.marinho}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <path
          d="M 166 170 q 7 -5 14 0 q 7 5 14 0"
          fill="none"
          stroke={COR.marinho}
          strokeWidth={4}
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
