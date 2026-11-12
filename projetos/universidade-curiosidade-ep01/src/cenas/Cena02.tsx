import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { piscada, pop, rampa, respira } from "../anim";
import { gatilho } from "../linhaDoTempo";
import { Randy } from "../personagens/Randy";
import { COR } from "../tema";
import { PlacaGiz } from "../ui/Placas";
import { RANDY_POS, SEPIA } from "./Cena01";
import {
  BrilhoAbajur,
  CobertorQuarto,
  MoveisQuarto,
  ParedeQuarto,
} from "./Quarto";

// Cena 02 · 0:07.1–0:15.4 · PLANO MÉDIO. Parede "derretendo" em «coisas que não
// estavam lá»; em «jogador famoso» a sombra magrinha vira a silhueta de um jogador
// gigante (morph 0,8 s) com estrelinhas; Randy faz pose. Parallax 3 camadas.
// Saída: whip-pan para a direita.

const SOMBRA = "#0E0B24";

const SombraMagra: React.FC = () => (
  <svg viewBox="0 0 300 420" width={300} height={420}>
    <circle cx="150" cy="80" r="62" fill={SOMBRA} />
    <path d="M 90 170 Q 150 150 210 170 L 220 420 L 80 420 Z" fill={SOMBRA} />
    <rect x="58" y="176" width="34" height="170" rx="17" fill={SOMBRA} />
    <rect x="208" y="176" width="34" height="170" rx="17" fill={SOMBRA} />
  </svg>
);

// Jogador de futebol americano genérico (sem logotipo de time): capacete,
// ombreiras enormes, braços flexionados.
const SombraJogador: React.FC = () => (
  <svg viewBox="0 0 520 560" width={520} height={560}>
    {/* capacete com grade */}
    <path
      d="M 190 120 Q 190 30 265 30 Q 340 30 344 112 L 344 150 L 300 150 L 300 168 L 206 168 Q 186 150 190 120 Z"
      fill={SOMBRA}
    />
    <path
      d="M 300 120 L 360 120 M 300 145 L 356 145 M 340 112 L 340 160"
      stroke={SOMBRA}
      strokeWidth={12}
      strokeLinecap="round"
    />
    {/* ombreiras */}
    <path
      d="M 70 230 Q 90 160 260 168 Q 430 160 450 230 Q 452 262 420 268 L 100 268 Q 66 262 70 230 Z"
      fill={SOMBRA}
    />
    {/* tronco em V */}
    <path d="M 120 260 L 400 260 L 340 470 L 180 470 Z" fill={SOMBRA} />
    <path
      d="M 180 460 L 160 560 L 230 560 L 260 470 L 290 560 L 360 560 L 340 460 Z"
      fill={SOMBRA}
    />
    {/* braços flexionados (bíceps) */}
    <path
      d="M 92 240 Q 20 250 22 180 Q 24 120 60 92 Q 86 76 96 100 Q 76 130 82 170 Q 120 170 132 230 Z"
      fill={SOMBRA}
    />
    <circle cx="68" cy="84" r="34" fill={SOMBRA} />
    <path
      d="M 428 240 Q 500 250 498 180 Q 496 120 460 92 Q 434 76 424 100 Q 444 130 438 170 Q 400 170 388 230 Z"
      fill={SOMBRA}
    />
    <circle cx="452" cy="84" r="34" fill={SOMBRA} />
  </svg>
);

const Estrela: React.FC<{ tamanho: number }> = ({ tamanho }) => (
  <svg viewBox="-50 -50 100 100" width={tamanho} height={tamanho}>
    <path
      d="M 0 -48 Q 8 -8 48 0 Q 8 8 0 48 Q -8 8 -48 0 Q -8 -8 0 -48 Z"
      fill={COR.mostarda}
      stroke={COR.marinho}
      strokeWidth={5}
    />
  </svg>
);

const ESTRELAS = [
  { x: 560, y: 260, s: 70, d: 0 },
  { x: 860, y: 230, s: 50, d: 0.08 },
  { x: 500, y: 520, s: 46, d: 0.14 },
  { x: 900, y: 470, s: 60, d: 0.05 },
  { x: 700, y: 180, s: 40, d: 0.18 },
  { x: 940, y: 340, s: 36, d: 0.22 },
];

export const Cena02: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;

  const tCoisas = gatilho("c02", "coisas que não estavam lá", fps);
  const tJogador = gatilho("c02", "jogador famoso", fps);

  // ondulação: sobe e desce em 2 s; formas derretidas ficam
  const onda = Math.sin(
    Math.PI * rampa(t, tCoisas, tCoisas + 2, Easing.linear),
  );
  const derrete = rampa(t, tCoisas, tCoisas + 1.6);

  const morph = rampa(
    t,
    tJogador,
    tJogador + 0.8,
    Easing.bezier(0.34, 1.4, 0.64, 1),
  );
  const pose = pop(frame, fps, tJogador + 0.1, { damping: 11 });
  const placa = pop(frame, fps, 0.15);

  // parallax: cada camada desliza numa velocidade
  const desliza = (vel: number) => -vel * t;

  // whip-pan de saída: últimos 7 frames
  const inicioWhip = durationInFrames - 7;
  const whip = interpolate(frame, [inicioWhip, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ background: COR.marinho, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          filter: `${SEPIA} blur(${whip * 18}px)`,
          transform: `translateX(${-whip * 1700}px)`,
        }}
      >
        {/* câmera em plano médio */}
        <AbsoluteFill
          style={{ transform: "scale(1.32)", transformOrigin: "880px 560px" }}
        >
          {/* camada 1: parede */}
          <AbsoluteFill style={{ transform: `translateX(${desliza(5)}px)` }}>
            <ParedeQuarto t={t + 7.1} onda={onda} derrete={derrete} />
          </AbsoluteFill>
          {/* camada 2: sombra na parede */}
          <AbsoluteFill style={{ transform: `translateX(${desliza(9)}px)` }}>
            <div
              style={{
                position: "absolute",
                left: 590,
                top: 380,
                opacity: 0.55 * (1 - morph),
                transform: `scale(${1 + morph * 0.4})`,
                transformOrigin: "50% 100%",
              }}
            >
              <SombraMagra />
            </div>
            <div
              style={{
                position: "absolute",
                left: 470,
                top: 240,
                opacity: 0.6 * Math.min(1, morph * 1.4),
                transform: `scale(${0.55 + 0.45 * morph}, ${0.7 + 0.3 * morph})`,
                transformOrigin: "50% 100%",
              }}
            >
              <SombraJogador />
            </div>
            {ESTRELAS.map((e, i) => {
              const p = pop(frame, fps, tJogador + 0.5 + e.d, { damping: 8 });
              const some =
                1 - rampa(t, tJogador + 1.6 + e.d, tJogador + 2.1 + e.d);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: e.x,
                    top: e.y,
                    transform: `scale(${p}) rotate(${(t - tJogador) * 40}deg)`,
                    opacity: some,
                  }}
                >
                  <Estrela tamanho={e.s} />
                </div>
              );
            })}
          </AbsoluteFill>
          {/* camada 3: cama + Randy */}
          <AbsoluteFill style={{ transform: `translateX(${desliza(15)}px)` }}>
            <MoveisQuarto />
            <div
              style={{
                position: "absolute",
                left: RANDY_POS.left,
                top: RANDY_POS.top,
                transform: `scaleY(${respira(t)})`,
                transformOrigin: "50% 100%",
              }}
            >
              <Randy
                largura={RANDY_POS.largura}
                piscada={piscada(t, 5)}
                braco={pose}
                cabecaGiro={-6 * pose}
                olheira={0.8}
              />
            </div>
            <CobertorQuarto />
          </AbsoluteFill>
          <BrilhoAbajur intensidade={0.9} />
        </AbsoluteFill>

        {/* placa de giz DIA 4 */}
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 70,
            transform: `scale(${placa}) rotate(-3deg)`,
            transformOrigin: "0 0",
          }}
        >
          <PlacaGiz texto="DIA 4" largura={300} tamanho={78} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
