import React from 'react';
import {Composition} from 'remotion';
import {duracaoPiloto, Piloto} from './Piloto';

const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Piloto-Gancho-Vertical"
    component={Piloto}
    durationInFrames={duracaoPiloto(FPS)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
