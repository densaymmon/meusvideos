import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Cena01 } from "./cenas/Cena01";
import { Cena02 } from "./cenas/Cena02";
import { Cena03 } from "./cenas/Cena03";
import { Cena04 } from "./cenas/Cena04";
import { CENAS } from "./linhaDoTempo";
import { COR } from "./tema";
import { Legenda } from "./ui/Legenda";

// Gancho + vinheta (cenas 01–04) do Vídeo 1 · "7 dias sem dormir".
const COMPONENTES: Record<string, React.FC> = {
  c01: Cena01,
  c02: Cena02,
  c03: Cena03,
  c04: Cena04,
};

export const Gancho: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: COR.marinho }}>
      {CENAS.map((c) => {
        const Comp = COMPONENTES[c.id];
        const de = Math.round(c.inicio * fps);
        return (
          <Sequence
            key={c.id}
            name={`Cena ${c.id.slice(1)}`}
            from={de}
            durationInFrames={Math.round(c.fim * fps) - de}
          >
            <Comp />
          </Sequence>
        );
      })}
      <Legenda />
    </AbsoluteFill>
  );
};
