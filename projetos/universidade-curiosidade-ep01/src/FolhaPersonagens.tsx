import React from "react";
import { AbsoluteFill } from "remotion";
import { COR } from "./tema";
import { Lumi } from "./personagens/Lumi";
import { Randy } from "./personagens/Randy";
import { Teo } from "./personagens/Teo";
import { Cerebro } from "./personagens/Cerebro";

export const FolhaPersonagens: React.FC = () => (
  <AbsoluteFill
    style={{
      background: COR.creme,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-around",
      padding: 60,
    }}
  >
    <Lumi largura={380} />
    <Lumi
      largura={260}
      piscada={1}
      bico={2}
      asaDir={70}
      capeloY={-60}
      capeloGiro={-20}
    />
    <Randy largura={320} />
    <Randy largura={260} braco={1} piscada={0.5} />
    <Teo largura={340} />
    <Cerebro largura={420} piscadela={1} serpentina={1} />
  </AbsoluteFill>
);
