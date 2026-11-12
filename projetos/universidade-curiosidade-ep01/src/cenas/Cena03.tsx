import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { balanco, piscada, pop, rampa, respira } from "../anim";
import { gatilho } from "../linhaDoTempo";
import { Cerebro } from "../personagens/Cerebro";
import { Teo } from "../personagens/Teo";
import { COR, FONTE_TITULO } from "../tema";
import { SeloFicticio } from "../ui/Placas";

// Cena 03 · 0:15.4–0:28.6 · PLANO GERAL com quadro dividido: Téo descansado à
// esquerda, linha do tempo de 7 bolinhas à direita. «dia a dia» bolinhas acendem
// (0,25 s cada); «sete dias» 7 em tipografia cinética; «terceiro dia» bolinha 3
// pisca e treme; «pregar peças» close no cérebro que pisca e solta a serpentina.
// Entrada: fim do whip-pan. Saída: flash branco suave (2 frames).

const BOLINHAS_Y = 600;
const bolinhaX = (i: number) => 1060 + i * 128;

export const Cena03: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;

  const tDiaADia = gatilho("c03", "dia a dia", fps);
  const tSete = gatilho("c03", "sete dias", fps);
  const tTerceiro = gatilho("c03", "terceiro dia", fps);
  const tCerebro = gatilho("c03", "o cérebro", fps);
  const tPecas = gatilho("c03", "pregar peças", fps);

  // entrada do whip-pan (primeiros 7 frames)
  const whip = interpolate(frame, [0, 7], [1, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const aceno =
    pop(frame, fps, 0.35, { damping: 14 }) * (1 - rampa(t, 2.4, 3.0));
  const sete = pop(frame, fps, tSete, { damping: 7, stiffness: 140 });
  const selo = pop(frame, fps, 0.6, { damping: 14 });

  // close no cérebro: cresce a partir da bolinha 3
  const close = pop(frame, fps, tCerebro, { damping: 15, stiffness: 90 });
  const piscadela =
    rampa(t, tPecas, tPecas + 0.18) *
    (1 - rampa(t, tPecas + 1.3, tPecas + 1.5));
  const serp = rampa(
    t,
    tPecas + 0.1,
    tPecas + 0.55,
    Easing.out(Easing.back(2)),
  );
  const squash = balanco(t, tPecas + 0.1, 0.12, 3, 3);

  const flash = interpolate(
    frame,
    [durationInFrames - 2, durationInFrames - 1],
    [0.6, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ background: COR.roxo, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translateX(${whip * 1700}px)`,
          filter: `blur(${whip * 18}px)`,
        }}
      >
        {/* metade esquerda: Téo */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 960,
            height: 1080,
            background: COR.pessego,
            overflow: "hidden",
          }}
        >
          <svg width={960} height={1080} style={{ position: "absolute" }}>
            <circle cx={480} cy={520} r={330} fill={COR.creme} opacity={0.55} />
          </svg>
          <div
            style={{
              position: "absolute",
              left: 250,
              top: 300,
              transform: `scaleY(${respira(t)})`,
              transformOrigin: "50% 100%",
            }}
          >
            <Teo largura={460} piscada={piscada(t, 1)} aceno={aceno} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 40,
              transform: `scale(${selo})`,
              transformOrigin: "0 0",
            }}
          >
            <SeloFicticio />
          </div>
        </div>

        {/* metade direita: linha do tempo */}
        <svg
          width={960}
          height={1080}
          viewBox="960 0 960 1080"
          style={{ position: "absolute", left: 960, top: 0 }}
        >
          <line
            x1={bolinhaX(0)}
            y1={BOLINHAS_Y}
            x2={bolinhaX(6)}
            y2={BOLINHAS_Y}
            stroke={COR.creme}
            strokeWidth={8}
            strokeLinecap="round"
            opacity={0.35}
          />
          {Array.from({ length: 7 }).map((_, i) => {
            const tAcende = tDiaADia + i * 0.25;
            const acesa = pop(frame, fps, tAcende, { damping: 9 });
            const ligada = t >= tAcende;
            let cor: string = ligada ? COR.mostarda : COR.roxoClaro;
            let dx = 0;
            if (i === 2 && t >= tTerceiro && t < tTerceiro + 1.4) {
              cor =
                Math.floor((t - tTerceiro) * 8) % 2 === 0
                  ? COR.coral
                  : COR.mostarda;
              dx = balanco(t, tTerceiro, 9, 7, 2.2);
            }
            const r = 34 * (ligada ? 0.75 + 0.25 * acesa : 0.75);
            return (
              <g key={i} transform={`translate(${dx} 0)`}>
                <circle
                  cx={bolinhaX(i)}
                  cy={BOLINHAS_Y}
                  r={r}
                  fill={cor}
                  stroke={COR.marinho}
                  strokeWidth={6}
                />
                <text
                  x={bolinhaX(i)}
                  y={BOLINHAS_Y + 80}
                  textAnchor="middle"
                  fontFamily={FONTE_TITULO}
                  fontWeight={600}
                  fontSize={30}
                  fill={COR.creme}
                >
                  DIA {i + 1}
                </text>
              </g>
            );
          })}
        </svg>

        {/* «sete dias»: 7 grande em tipografia cinética */}
        <div
          style={{
            position: "absolute",
            left: 960,
            width: 960,
            top: 170,
            textAlign: "center",
            fontFamily: FONTE_TITULO,
            fontWeight: 700,
            color: COR.mostarda,
            transform: `scale(${sete}) rotate(${(1 - sete) * -12}deg)`,
            opacity: t >= tSete ? 1 : 0,
            textShadow: `0 10px 0 ${COR.marinho}`,
            lineHeight: 0.9,
          }}
        >
          <div style={{ fontSize: 250 }}>7</div>
          <div style={{ fontSize: 58, color: COR.creme, marginTop: 10 }}>
            dias sem dormir
          </div>
        </div>
      </AbsoluteFill>

      {/* close no cérebro */}
      {t >= tCerebro && (
        <AbsoluteFill
          style={{
            background: COR.roxo,
            clipPath: `circle(${close * 1300}px at ${bolinhaX(2)}px ${BOLINHAS_Y}px)`,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            {Array.from({ length: 14 }).map((_, i) => (
              <path
                key={i}
                d={`M 960 470 L ${960 + Math.cos((i / 14) * Math.PI * 2) * 1400} ${470 + Math.sin((i / 14) * Math.PI * 2) * 1400} L ${960 + Math.cos(((i + 0.5) / 14) * Math.PI * 2) * 1400} ${470 + Math.sin(((i + 0.5) / 14) * Math.PI * 2) * 1400} Z`}
                fill={COR.roxoClaro}
                opacity={0.35}
                transform={`rotate(${t * 6} 960 470)`}
              />
            ))}
          </svg>
          <div
            style={{
              transform: `translateY(-70px) scale(${1 + squash}, ${1 - squash})`,
              transformOrigin: "50% 100%",
            }}
          >
            <Cerebro largura={760} piscadela={piscadela} serpentina={serp} />
          </div>
        </AbsoluteFill>
      )}

      {/* flash branco suave (2 frames) */}
      {frame >= durationInFrames - 2 && (
        <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />
      )}
    </AbsoluteFill>
  );
};
