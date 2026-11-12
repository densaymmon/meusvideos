import React from "react";
import { Composition, Still } from "remotion";
import { FolhaPersonagens } from "./FolhaPersonagens";
import { Gancho } from "./Gancho";
import { DURACAO_TOTAL } from "./linhaDoTempo";
import "./tema";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Gancho"
      component={Gancho}
      durationInFrames={Math.round(DURACAO_TOTAL * 30)}
      fps={30}
      width={1920}
      height={1080}
    />
    <Still
      id="Personagens"
      component={FolhaPersonagens}
      width={2400}
      height={800}
    />
  </>
);
