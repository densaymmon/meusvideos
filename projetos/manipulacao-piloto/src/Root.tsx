import {Composition, Folder} from 'remotion';
import {FATOR_PAUSA_SOCIAL, PARTES, YOUTUBE} from './roteiro';
import {duracaoEmFrames, Trecho} from './Video';

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="YouTube-Completo"
        component={Trecho}
        durationInFrames={duracaoEmFrames(YOUTUBE, 1, FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ids: YOUTUBE, fatorPausa: 1, parte: 0, totalPartes: 3}}
      />
      <Folder name="Redes-sociais">
        <Composition
          id="Social-Parte1"
          component={Trecho}
          durationInFrames={duracaoEmFrames(PARTES[0], FATOR_PAUSA_SOCIAL, FPS)}
          fps={FPS}
          width={1080}
          height={1920}
          defaultProps={{ids: PARTES[0], fatorPausa: FATOR_PAUSA_SOCIAL, parte: 1, totalPartes: 3}}
        />
        <Composition
          id="Social-Parte2"
          component={Trecho}
          durationInFrames={duracaoEmFrames(PARTES[1], FATOR_PAUSA_SOCIAL, FPS)}
          fps={FPS}
          width={1080}
          height={1920}
          defaultProps={{ids: PARTES[1], fatorPausa: FATOR_PAUSA_SOCIAL, parte: 2, totalPartes: 3}}
        />
        <Composition
          id="Social-Parte3"
          component={Trecho}
          durationInFrames={duracaoEmFrames(PARTES[2], FATOR_PAUSA_SOCIAL, FPS)}
          fps={FPS}
          width={1080}
          height={1920}
          defaultProps={{ids: PARTES[2], fatorPausa: FATOR_PAUSA_SOCIAL, parte: 3, totalPartes: 3}}
        />
      </Folder>
    </>
  );
};
