import {Audio} from '@remotion/media';
import React from 'react';
import {Sequence, staticFile, Track, useVideoConfig} from 'remotion';
import {CenaDesculpa, CenaEspelho, CenaNaoGrita, CenaPraVoce, CenaSussurra} from './cenas/Gancho';
import {
  CenaAviso,
  CenaDiasRuins,
  CenaFuncionam,
  CenaGestos,
  CenaGuarde,
  CenaNaoRotular,
  CenaPadrao,
  CenaPadraoFinal,
  CenaPesquisa,
  CenaSeteSinais,
  CenaVidaReal,
  CenaVilao,
} from './cenas/Introducao';
import {Legenda} from './Legenda';
import {ATRASO_VOZ, type Deixa, deixas, RESPIRO_FINAL} from './tempo';

type CenaComp = React.FC<{fala: Deixa}>;

/** Cada fala da narração tem a sua cena ilustrada, no mesmo intervalo de tempo. */
const cenas: Record<string, CenaComp> = {
  desculpa: CenaDesculpa,
  'pra-voce': CenaPraVoce,
  'nao-grita': CenaNaoGrita,
  sussurra: CenaSussurra,
  espelho: CenaEspelho,
  vilao: CenaVilao,
  'vida-real': CenaVidaReal,
  gestos: CenaGestos,
  'sete-sinais': CenaSeteSinais,
  pesquisa: CenaPesquisa,
  funcionam: CenaFuncionam,
  aviso: CenaAviso,
  'nao-rotular': CenaNaoRotular,
  'dias-ruins': CenaDiasRuins,
  padrao: CenaPadrao,
  guarde: CenaGuarde,
  'padrao-final': CenaPadraoFinal,
};

export const VideoPiloto: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <>
      <Track name="Cenas">
        {deixas.map((d, i) => {
          const C = cenas[d.id];
          const de = Math.round(d.inicio * fps);
          const ate = Math.round((i === deixas.length - 1 ? d.fim + RESPIRO_FINAL : d.fim) * fps);
          return (
            <Sequence key={d.id} name={`Cena: ${d.id}`} from={de} durationInFrames={ate - de}>
              <C fala={d} />
            </Sequence>
          );
        })}
      </Track>
      <Track name="Legendas">
        {deixas.map((d) => (
          <Sequence key={d.id} name={`Legenda: ${d.id}`} from={Math.round(d.inicio * fps)} durationInFrames={Math.round((d.fim - d.inicio) * fps)}>
            <Legenda fala={d} />
          </Sequence>
        ))}
      </Track>
      <Track name="Narração">
        {deixas.map((d) => (
          <Audio key={d.id} name={`Voz: ${d.id}`} src={staticFile(`narracao/${d.id}.wav`)} from={Math.round((d.inicio + ATRASO_VOZ) * fps)} />
        ))}
      </Track>
    </>
  );
};
