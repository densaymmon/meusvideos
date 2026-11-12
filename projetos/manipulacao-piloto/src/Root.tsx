import {Composition} from 'remotion';
import {DURACAO_TOTAL} from './tempo';
import {VideoPiloto} from './Video';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Piloto-Gancho-Intro"
      component={VideoPiloto}
      durationInFrames={Math.ceil(DURACAO_TOTAL * 30)}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
