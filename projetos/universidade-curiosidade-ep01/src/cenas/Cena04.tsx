import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { pop, rampa } from "../anim";
import { Lumi } from "../personagens/Lumi";
import { COR, CONTORNO, FONTE_TITULO } from "../tema";
import { PlacaGiz } from "../ui/Placas";

// Cena 04 · 0:28.6–0:31.6 · VINHETA 3 s (sem narração).
// 0,0–0,8 Lumi entra voando e pousa no brasão · 0,8–1,6 logo com overshoot ·
// 1,6–2,4 capelo lançado e volta · 2,4–3,0 placa "Matéria: CORPO HUMANO" (write-on).
// Saída: íris-out circular.

const ESTRELAS = Array.from({ length: 60 }).map((_, i) => ({
  x: random(`ex${i}`) * 1920,
  y: random(`ey${i}`) * 1080,
  r: 2 + random(`er${i}`) * 4,
  fase: random(`ef${i}`) * 6.28,
}));

const Brasao: React.FC = () => (
  <svg viewBox="0 0 320 360" width={320} height={360}>
    <path
      d="M 20 30 Q 160 -6 300 30 L 300 170 Q 300 290 160 350 Q 20 290 20 170 Z"
      fill={COR.roxo}
      {...CONTORNO}
      strokeWidth={8}
    />
    <path
      d="M 44 50 Q 160 22 276 50 L 276 170 Q 276 270 160 322 Q 44 270 44 170 Z"
      fill="none"
      stroke={COR.mostarda}
      strokeWidth={8}
    />
    {/* livro aberto */}
    <path
      d="M 160 150 Q 110 124 64 136 L 64 250 Q 112 238 160 262 Z"
      fill={COR.creme}
      {...CONTORNO}
      strokeWidth={6}
    />
    <path
      d="M 160 150 Q 210 124 256 136 L 256 250 Q 208 238 160 262 Z"
      fill={COR.creme}
      {...CONTORNO}
      strokeWidth={6}
    />
    {[170, 192, 214].map((y) => (
      <g key={y}>
        <path
          d={`M 84 ${y - 16} Q 116 ${y - 24} 144 ${y - 8}`}
          fill="none"
          stroke={COR.pessegoEscuro}
          strokeWidth={4}
          strokeLinecap="round"
        />
      </g>
    ))}
    {/* ponto de interrogação */}
    <text
      x={206}
      y={232}
      textAnchor="middle"
      fontFamily={FONTE_TITULO}
      fontWeight={700}
      fontSize={110}
      fill={COR.mostarda}
      stroke={COR.marinho}
      strokeWidth={5}
      paintOrder="stroke"
    >
      ?
    </text>
  </svg>
);

// Lumi: largura 230 → altura 270. Pousa com os pés no topo do brasão.
const LUMI_L = 230;
const LUMI_H = (LUMI_L * 470) / 400;
const BRASAO_TOPO = 300;
const POUSO = { x: 960 - LUMI_L / 2, y: BRASAO_TOPO - LUMI_H + 18 };

export const Cena04: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;

  // voo: curva da esquerda até o pouso, com bater de asas
  const v = rampa(t, 0, 0.8, Easing.out(Easing.cubic));
  const x = interpolate(v, [0, 1], [-320, POUSO.x]);
  const y =
    interpolate(v, [0, 1], [380, POUSO.y]) - Math.sin(v * Math.PI) * 160;
  const voando = t < 0.8;
  const bate = voando ? 35 + 45 * Math.sin(t * Math.PI * 2 * 7) : 0;
  const amassa =
    t >= 0.8 ? 0.12 * Math.exp(-(t - 0.8) * 7) * Math.cos((t - 0.8) * 30) : 0;

  // capelo: sobe e volta (1,6–2,4)
  const c = rampa(t, 1.6, 2.4, Easing.linear);
  const capeloY = -Math.sin(c * Math.PI) * 230;
  const capeloGiro = c * 360;
  const asaComemora = t >= 1.6 && t < 2.4 ? 60 * Math.sin(c * Math.PI) : 0;

  const brasao = pop(frame, fps, 0.05, { damping: 12 });
  const logo = pop(frame, fps, 0.8, { damping: 7, stiffness: 160 });
  const placa = pop(frame, fps, 2.35, { damping: 13 });
  const escrita = rampa(t, 2.4, 2.85, Easing.linear);

  // íris-out nos últimos 6 frames, fechando sobre a Lumi
  const iris = interpolate(
    frame,
    [durationInFrames - 6, durationInFrames - 1],
    [1300, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    },
  );

  return (
    <AbsoluteFill style={{ background: "#11182E" }}>
      <AbsoluteFill
        style={{
          background: COR.marinho,
          clipPath: `circle(${iris}px at 960px 330px)`,
        }}
      >
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          {ESTRELAS.map((e, i) => (
            <circle
              key={i}
              cx={e.x}
              cy={e.y}
              r={e.r}
              fill={COR.creme}
              opacity={0.35 + 0.35 * Math.sin(t * 5 + e.fase)}
            />
          ))}
        </svg>

        {/* brasão */}
        <div
          style={{
            position: "absolute",
            left: 960 - 160,
            top: BRASAO_TOPO,
            transform: `scale(${brasao}, ${brasao * (1 - amassa * 0.4)})`,
            transformOrigin: "50% 100%",
          }}
        >
          <Brasao />
        </div>

        {/* logo */}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1920,
            top: 668,
            textAlign: "center",
            fontFamily: FONTE_TITULO,
            fontWeight: 700,
            transform: `scale(${logo})`,
            transformOrigin: "50% 50%",
            lineHeight: 1,
            textShadow: `0 8px 0 ${COR.marinho}, 0 0 30px rgba(0,0,0,0.25)`,
          }}
        >
          <div style={{ fontSize: 54, color: COR.creme, letterSpacing: 4 }}>
            UNIVERSIDADE DA
          </div>
          <div style={{ fontSize: 118, color: COR.mostarda }}>Curiosidade</div>
        </div>

        {/* Lumi */}
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
            transform: `rotate(${voando ? 10 - v * 10 : 0}deg) scale(${1 + amassa}, ${1 - amassa})`,
            transformOrigin: "50% 100%",
          }}
        >
          <Lumi
            largura={LUMI_L}
            asaEsq={bate + asaComemora}
            asaDir={bate + asaComemora}
            capeloY={capeloY}
            capeloGiro={capeloGiro}
            piscada={t > 2.0 && t < 2.12 ? 1 : 0}
            olhar={{ x: voando ? 0.6 : 0, y: 0.2 }}
          />
        </div>

        {/* placa "Matéria: CORPO HUMANO" */}
        <div
          style={{
            position: "absolute",
            left: 960 - 330,
            top: 900,
            transform: `scale(${placa})`,
            transformOrigin: "50% 0%",
          }}
        >
          <PlacaGiz
            largura={660}
            tamanho={52}
            escrita={escrita}
            texto={
              <>
                Matéria:{" "}
                <span style={{ color: COR.mostarda }}>CORPO HUMANO</span>
              </>
            }
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
