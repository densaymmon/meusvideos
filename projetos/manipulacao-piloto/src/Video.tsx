import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, staticFile, Track, useCurrentFrame, useVideoConfig} from 'remotion';
import {nunito} from './fontes';
import {Legenda} from './Legenda';
import {CENAS} from './roteiro';
import {ATRASO_VOZ, type Deixa, duracaoTrecho, montarTrecho, RESPIRO_FINAL} from './tempo';

export type PropsTrecho = {
  ids: string[];
  fatorPausa: number;
  /** 0 = vídeo horizontal (YouTube); 1..3 = parte vertical para redes sociais. */
  parte: number;
  totalPartes: number;
};

const Cenas: React.FC<{deixas: Deixa[]}> = ({deixas}) => {
  const {fps} = useVideoConfig();
  return (
    <Track name="Cenas">
      {deixas.map((d, i) => {
        const C = CENAS[d.id];
        const de = Math.round(d.inicio * fps);
        const ate = Math.round((i === deixas.length - 1 ? d.fim + RESPIRO_FINAL : d.fim) * fps);
        return (
          <Sequence key={d.id} name={`Cena: ${d.id}`} from={de} durationInFrames={ate - de}>
            <C fala={d} />
          </Sequence>
        );
      })}
    </Track>
  );
};

const Legendas: React.FC<{deixas: Deixa[]; vertical: boolean}> = ({deixas, vertical}) => {
  const {fps} = useVideoConfig();
  return (
    <Track name="Legendas">
      {deixas.map((d) => (
        <Sequence key={d.id} name={`Legenda: ${d.id}`} from={Math.round(d.inicio * fps)} durationInFrames={Math.round((d.fim - d.inicio) * fps)}>
          <Legenda fala={d} vertical={vertical} />
        </Sequence>
      ))}
    </Track>
  );
};

const Narracao: React.FC<{deixas: Deixa[]}> = ({deixas}) => {
  const {fps} = useVideoConfig();
  return (
    <Track name="Narração">
      {deixas.map((d) => (
        <Audio key={d.id} name={`Voz: ${d.id}`} src={staticFile(`narracao/${d.id}.wav`)} from={Math.round((d.inicio + ATRASO_VOZ) * fps)} />
      ))}
    </Track>
  );
};

const BarraProgresso: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1236, height: 12, borderRadius: 6, backgroundColor: '#3d405b'}}>
      <div style={{height: '100%', borderRadius: 6, backgroundColor: '#ffd23f', width: `${interpolate(frame, [0, durationInFrames], [0, 100])}%`}} />
    </div>
  );
};

/** Um trecho do roteiro: vídeo completo (16:9) ou uma parte vertical (9:16). */
export const Trecho: React.FC<PropsTrecho> = ({ids, fatorPausa, parte, totalPartes}) => {
  const deixas = montarTrecho(ids, fatorPausa);
  if (parte === 0) {
    return (
      <>
        <Cenas deixas={deixas} />
        <Legendas deixas={deixas} vertical={false} />
        <Narracao deixas={deixas} />
      </>
    );
  }
  return (
    <AbsoluteFill style={{backgroundColor: '#1e2032'}}>
      <div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center', fontFamily: nunito, fontWeight: 900, color: '#fffdf7'}}>
        <div style={{fontSize: 70, lineHeight: 1.05}}>7 SINAIS DE</div>
        <div style={{fontSize: 70, lineHeight: 1.05}}>MANIPULAÇÃO EMOCIONAL</div>
        <div
          style={{
            display: 'inline-block',
            marginTop: 24,
            padding: '8px 36px',
            borderRadius: 40,
            backgroundColor: '#ffd23f',
            color: '#2b2d42',
            fontSize: 46,
          }}
        >
          PARTE {parte}/{totalPartes}
        </div>
      </div>
      <div style={{position: 'absolute', top: 560, left: 0, width: 1080, height: 648, overflow: 'hidden'}}>
        <div style={{width: 1920, height: 1080, scale: 0.6, transformOrigin: '0 0', position: 'relative', left: -36}}>
          <Cenas deixas={deixas} />
        </div>
      </div>
      <BarraProgresso />
      <Legendas deixas={deixas} vertical />
      <Narracao deixas={deixas} />
    </AbsoluteFill>
  );
};

export const duracaoEmFrames = (ids: string[], fatorPausa: number, fps: number) =>
  Math.ceil(duracaoTrecho(montarTrecho(ids, fatorPausa)) * fps);
