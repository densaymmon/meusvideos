import React from "react";
import {
  AbsoluteFill,
  Easing,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { balanco, piscada, pop, rampa, respira } from "../anim";
import { gatilho } from "../linhaDoTempo";
import { Randy } from "../personagens/Randy";
import { COR, FONTE_TITULO } from "../tema";
import {
  BrilhoAbajur,
  CobertorQuarto,
  MoveisQuarto,
  ParedeQuarto,
} from "./Quarto";

// Cena 01 · 0:00.0–0:07.1 · Gancho. PLANO GERAL → PLANO MÉDIO.
// Randy no quarto de 1964; «1964» pop-in; «Nem um cochilo» pisca forte e balança a
// cabeça; «onze dias» ponteiros em time-lapse + contador DIA 1 → DIA 11.

export const SEPIA = "sepia(0.22) saturate(0.82) brightness(1.03)";

// posição do Randy sentado na cama (cintura escondida pelo cobertor)
export const RANDY_POS = { left: 940, top: 372, largura: 300 };

export const Cena01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const tAno = gatilho("c01", "1964", fps);
  const tCochilo = gatilho("c01", "Nem um cochilo", fps);
  const tOnze = gatilho("c01", "onze dias", fps);

  const zoom = 1 + 0.08 * rampa(t, 0, 6.6, Easing.inOut(Easing.sin));
  const giro = 11 * rampa(t, tOnze, tOnze + 2.4, Easing.inOut(Easing.cubic));
  const dia =
    1 +
    Math.floor(
      10 * rampa(t, tOnze, tOnze + 2.4, Easing.inOut(Easing.cubic)) + 0.0001,
    );
  const contador = pop(frame, fps, tOnze);
  const ano = pop(frame, fps, tAno, { damping: 7 });

  // piscada forte em «Nem um cochilo» (fecha por 0,35 s)
  const forte = t >= tCochilo && t < tCochilo + 0.35 ? 1 : 0;

  return (
    <AbsoluteFill style={{ background: COR.marinho, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          filter: SEPIA,
          transform: `scale(${zoom})`,
          transformOrigin: "1090px 600px",
        }}
      >
        <ParedeQuarto t={t} giroRelogio={giro} />
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
            piscada={Math.max(forte, piscada(t, 2))}
            cabecaGiro={balanco(t, tCochilo + 0.05, 9, 2.6, 1.6)}
            olheira={0.45}
          />
        </div>
        <CobertorQuarto />
        <BrilhoAbajur />
      </AbsoluteFill>

      {/* «1964» — Fredoka, mostarda, canto superior esquerdo */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 60,
          fontFamily: FONTE_TITULO,
          fontWeight: 700,
          fontSize: 150,
          color: COR.mostarda,
          transform: `scale(${ano})`,
          transformOrigin: "20% 70%",
          textShadow: `0 8px 0 ${COR.marinho}`,
        }}
      >
        1964
      </div>

      {/* contador DIA 1 → DIA 11 */}
      {t >= tOnze && (
        <div
          style={{
            position: "absolute",
            right: 90,
            top: 80,
            padding: "14px 34px",
            borderRadius: 24,
            background: COR.creme,
            border: `6px solid ${COR.marinho}`,
            fontFamily: FONTE_TITULO,
            fontWeight: 700,
            fontSize: 70,
            color: COR.marinho,
            transform: `scale(${contador})`,
            transformOrigin: "100% 0%",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          DIA <span style={{ color: COR.coral }}>{dia}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
