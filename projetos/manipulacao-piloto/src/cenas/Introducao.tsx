import React from 'react';
import {interpolate} from 'remotion';
import {Cena} from '../arte/Cena';
import {BalaoCoracao, Brilhos, Cafe, Cartao, Engrenagem, Flor, Nuvem, useSegundos} from '../arte/Objetos';
import {LIA, Pessoa, RAFA} from '../arte/Pessoa';
import {Marionete, Vilao} from '../arte/Vilao';
import {nunito} from '../fontes';
import {type Deixa, momento} from '../tempo';
import {cores, entre, pop} from '../util';

type P = {fala: Deixa};
const dur = (f: Deixa) => f.duracao + f.pausa;

/** "Quando pensamos em manipulação, imaginamos um vilão óbvio, alguém que grita, ameaça, controla tudo." */
export const CenaVilao: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tVilao = momento(fala, 'vilão');
  const palavras: [string, string, number, number, number, string][] = [
    ['GRITA!', 'grita', 330, 300, -8, cores.amarelo],
    ['AMEAÇA!', 'ameaça', 300, 640, 6, '#ffffff'],
    ['CONTROLA!', 'controla', 1500, 200, 5, cores.menta],
  ];
  return (
    <Cena fundo={cores.coral} dur={dur(fala)} decoracao="#7a1f1f">
      {/* pensamento: primeiro um balão vazio, depois o vilão surge */}
      <g transform={`translate(960 1020) scale(${pop(t, tVilao - 0.3, 0.6)})`}>
        <Vilao x={0} y={0} s={1.25} gritando={t > momento(fala, 'grita') - 0.1} />
      </g>
      <Marionete
        x={1500}
        y={830}
        controleX={1300}
        controleY={interpolate(Math.sin(t * 4), [-1, 1], [610, 650])}
        balanco={Math.sin(t * 3) * 30}
      />
      <g opacity={1 - entre(t, tVilao - 0.4, tVilao)}>
        <Nuvem x={960} y={480} s={2.4} />
        <text x={960} y={500} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={70} fill={cores.tinta}>
          manipulação = ?
        </text>
      </g>
      {palavras.map(([txt, chave, x, y, rot, cor]) => {
        const m = momento(fala, chave);
        return (
          <g key={txt} transform={`translate(${x} ${y}) scale(${pop(t, m - 0.05, 0.35)})`}>
            <Cartao x={0} y={0} texto={txt} cor={cor} rotacao={rot} tamanho={70} />
          </g>
        );
      })}
    </Cena>
  );
};

/** "Na vida real, quase nunca é assim." */
export const CenaVidaReal: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const fumaca = entre(t, 0.15, 0.9);
  return (
    <Cena fundo={cores.menta} dur={dur(fala)}>
      {/* vilão some numa nuvem de fumaça */}
      <g opacity={1 - entre(t, 0.2, 0.45)} transform={`translate(960 1020) scale(${1.25 * (1 - entre(t, 0.1, 0.45, 0, 0.5))})`}>
        <Vilao x={0} y={0} gritando={false} />
      </g>
      {[
        [-160, -40],
        [150, -60],
        [0, -160],
        [-90, 110],
        [120, 100],
      ].map(([dx, dy], i) => (
        <Nuvem key={i} x={960 + dx * (0.6 + fumaca)} y={520 + dy * (0.6 + fumaca)} s={0.9 + fumaca * 0.6} opacidade={interpolate(t, [0.15, 0.4, 1.1], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} contorno={false} />
      ))}
      {/* pessoa comum, simpática */}
      <g transform={`translate(960 1030) scale(${pop(t, 0.55, 0.5)})`}>
        <Pessoa x={0} y={0} s={1.5} {...RAFA} humor="feliz" bracos="acenar" />
      </g>
      <Brilhos x={960} y={520} raio={380} visivel={entre(t, 0.7, 1)} />
    </Cena>
  );
};

/** "Ela aparece em gestos pequenos, repetidos, às vezes até gentis." */
export const CenaGestos: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const d = dur(fala);
  const itens = [
    {chave: 'pequenos', x: 560},
    {chave: 'repetidos', x: 960},
    {chave: 'gentis', x: 1360},
  ];
  const fios = entre(t, momento(fala, 'gentis'), d, 0, 0.75);
  return (
    <Cena fundo="#ffe5ec" dur={d} decoracao={cores.coral}>
      {/* três gestos pequenos */}
      {itens.map((it, i) => {
        const m = momento(fala, it.chave);
        return (
          <g key={it.chave} transform={`translate(${it.x} 220) scale(${pop(t, m - 0.1, 0.4)})`}>
            <circle r={110} fill="#fff" stroke={cores.tinta} strokeWidth={7} />
            {i === 0 ? <Flor x={0} y={-10} s={0.75} /> : null}
            {i === 1 ? <Cafe x={0} y={20} s={0.9} /> : null}
            {i === 2 ? <BalaoCoracao x={0} y={-5} s={0.9} /> : null}
          </g>
        );
      })}
      {/* fios de marionete, quase invisíveis */}
      {[1240, 1460].map((x) => (
        <line key={x} x1={x} y1={0} x2={x} y2={interpolate(fios, [0, 0.75], [0, 760])} stroke="#ffffff" strokeWidth={4} opacity={fios} />
      ))}
      <Pessoa x={650} y={1030} s={1.3} {...RAFA} humor="feliz" bracos="oferecer" olhar={1}>
        <Flor x={290} y={-210} s={0.7} />
      </Pessoa>
      <Pessoa x={1350} y={1030} s={1.3} {...LIA} humor="feliz" olhar={-1} fasePiscar={30} />
    </Cena>
  );
};

/** "Hoje vamos ver sete sinais sutis de manipulação emocional," */
export const CenaSeteSinais: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tSete = momento(fala, 'sete');
  const paleta = [cores.coral, cores.laranja, cores.amarelo, cores.menta, cores.ceu, cores.lavanda, cores.rosa];
  return (
    <Cena fundo={cores.turquesa} dur={dur(fala)}>
      <g transform={`translate(960 330) scale(${pop(t, tSete - 0.1, 0.5)})`}>
        <text textAnchor="middle" y={60} fontFamily={nunito} fontWeight={900} fontSize={190} fill="#fff" stroke={cores.tinta} strokeWidth={12} paintOrder="stroke">
          7 SINAIS
        </text>
      </g>
      {paleta.map((c, i) => {
        const x = 960 + (i - 3) * 215;
        const s = pop(t, tSete + 0.15 + i * 0.16, 0.4);
        return (
          <g key={i} transform={`translate(${x} ${640 + Math.sin(t * 4 + i) * 10}) scale(${s})`}>
            <circle r={90} fill={c} stroke={cores.tinta} strokeWidth={8} />
            <text textAnchor="middle" y={36} fontFamily={nunito} fontWeight={900} fontSize={100} fill={cores.tinta}>
              {i + 1}
            </text>
          </g>
        );
      })}
    </Cena>
  );
};

/** "o que a pesquisa já descobriu sobre cada um," */
export const CenaPesquisa: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const lupaX = interpolate(t, [0, 2.6], [600, 1300], {extrapolateRight: 'clamp'});
  const lupaY = 460 + Math.sin(t * 3) * 60;
  return (
    <Cena fundo={cores.creme} dur={dur(fala)} decoracao={cores.laranja}>
      {/* papéis de estudos */}
      {[
        [700, 520, -8],
        [960, 480, 3],
        [1220, 530, 9],
      ].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${pop(t, 0.05 + i * 0.12, 0.4)})`}>
          <rect x={-160} y={-210} width={320} height={420} rx={14} fill="#fff" stroke={cores.tinta} strokeWidth={7} />
          {[0, 1, 2, 3].map((l) => (
            <rect key={l} x={-120} y={-160 + l * 40} width={l === 0 ? 180 : 240} height={14} rx={7} fill={l === 0 ? cores.tinta : '#ced4da'} />
          ))}
          {[0, 1, 2].map((b) => (
            <rect key={b} x={-100 + b * 75} y={140 - (b + 1) * 45} width={50} height={(b + 1) * 45} fill={[cores.ceu, cores.turquesa, cores.coral][b]} />
          ))}
          <path
            d="M 60 120 L 90 150 L 140 80"
            stroke="#2d6a4f"
            strokeWidth={16}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - entre(t, 0.9 + i * 0.45, 1.2 + i * 0.45)}
          />
        </g>
      ))}
      {/* lupa */}
      <g transform={`translate(${lupaX} ${lupaY}) rotate(-20)`}>
        <rect x={-20} y={110} width={40} height={180} rx={18} fill="#8d5524" stroke={cores.tinta} strokeWidth={7} />
        <circle r={120} fill="#bde0fe" opacity={0.45} stroke={cores.tinta} strokeWidth={16} />
        <path d="M -60 -50 Q -40 -80 0 -88" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" />
      </g>
    </Cena>
  );
};

/** "e por que eles funcionam tão bem." */
export const CenaFuncionam: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tBem = momento(fala, 'tão bem');
  return (
    <Cena fundo={cores.rosa} dur={dur(fala)} decoracao="#c9184a">
      {/* cérebro */}
      <g transform={`translate(960 520) scale(${pop(t, 0, 0.5)})`}>
        {[
          [-170, -40, 120],
          [-60, -130, 120],
          [80, -120, 125],
          [180, -20, 115],
          [110, 90, 120],
          [-40, 80, 130],
          [-180, 70, 95],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#ff8fab" stroke={cores.tinta} strokeWidth={8} />
        ))}
        {[
          [-170, -40, 120],
          [-60, -130, 120],
          [80, -120, 125],
          [180, -20, 115],
          [110, 90, 120],
          [-40, 80, 130],
          [-180, 70, 95],
        ].map(([x, y, r], i) => (
          <circle key={`b${i}`} cx={x} cy={y} r={r - 4} fill="#ff8fab" />
        ))}
        <Engrenagem x={-70} y={-20} r={95} angulo={t * 90} cor={cores.amarelo} />
        <Engrenagem x={90} y={40} r={70} dentes={8} angulo={-t * 122 + 20} cor={cores.turquesa} />
      </g>
      {/* lâmpada */}
      <g transform={`translate(960 130) scale(${pop(t, tBem - 0.1, 0.4)})`}>
        <circle r={70} fill="#fff3b0" stroke={cores.tinta} strokeWidth={7} />
        <rect x={-30} y={60} width={60} height={40} rx={8} fill="#adb5bd" stroke={cores.tinta} strokeWidth={6} />
        <Brilhos x={0} y={0} raio={120} qtd={6} cor="#fff" />
      </g>
    </Cena>
  );
};

/** "Antes, um aviso importante:" */
export const CenaAviso: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const q = Math.abs(Math.sin(t * 5)) * 30;
  return (
    <Cena fundo={cores.laranja} dur={dur(fala)} decoracao="#ffffff">
      {[0, 1, 2].map((i) => {
        const fase = (t * 0.9 + i / 3) % 1;
        return <circle key={i} cx={960} cy={470} r={200 + fase * 450} fill="none" stroke="#fff" strokeWidth={14} opacity={1 - fase} />;
      })}
      <g transform={`translate(960 ${470 - q}) scale(${pop(t, 0, 0.5)})`}>
        <path d="M 0 -250 L 260 200 L -260 200 Z" fill={cores.amarelo} stroke={cores.tinta} strokeWidth={22} strokeLinejoin="round" />
        <rect x={-24} y={-120} width={48} height={190} rx={22} fill={cores.tinta} />
        <circle cx={0} cy={130} r={30} fill={cores.tinta} />
      </g>
    </Cena>
  );
};

/** "reconhecer um desses comportamentos em alguém não transforma essa pessoa automaticamente num manipulador." */
export const CenaNaoRotular: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tComp = momento(fala, 'comportamentos');
  const tNao = momento(fala, 'não transforma');
  const tManip = momento(fala, 'manipulador');
  const cai = entre(t, tManip + 0.5, tManip + 1.1);
  return (
    <Cena fundo="#caf0f8" dur={dur(fala)} decoracao={cores.ceu}>
      {/* balão de mau humor (um comportamento) */}
      <g transform={`translate(1280 260) scale(${pop(t, tComp - 0.1, 0.4) * (1 - entre(t, tNao, tNao + 0.3))})`}>
        <path d="M -150 -90 Q -150 -110 -130 -110 L 130 -110 Q 150 -110 150 -90 L 150 50 Q 150 70 130 70 L -40 70 L -90 120 L -80 70 L -130 70 Q -150 70 -150 50 Z" fill="#fff" stroke={cores.tinta} strokeWidth={7} />
        <path d="M -100 -20 L -60 -60 L -20 -10 L 20 -60 L 60 -10 L 100 -50" stroke={cores.coral} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Pessoa x={960} y={1030} s={1.5} {...RAFA} humor={t > tManip + 0.6 ? 'feliz' : t > tComp ? 'triste' : 'neutro'} />
      {/* etiqueta "MANIPULADOR" pendurada */}
      <g
        transform={`translate(1450 ${interpolate(t, [tNao, tNao + 0.6], [-200, 470], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) + cai * 700}) rotate(${Math.sin(t * 4) * 6 + cai * 40})`}
        opacity={1 - cai}
      >
        <line x1={0} y1={-800} x2={0} y2={-60} stroke={cores.tinta} strokeWidth={5} />
        <Cartao x={0} y={0} texto="MANIPULADOR?" cor="#ffffff" corTexto="#d00000" tamanho={58} />
        <g stroke="#d00000" strokeWidth={26} strokeLinecap="round">
          <path d="M -280 -70 L 280 70" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - entre(t, tManip + 0.1, tManip + 0.4)} />
        </g>
      </g>
    </Cena>
  );
};

/** "Todo mundo erra, todo mundo tem dias ruins." */
export const CenaDiasRuins: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tErra = momento(fala, 'erra');
  const tDias = momento(fala, 'dias ruins');
  const tomba = entre(t, tErra - 0.1, tErra + 0.3, 0, 110);
  return (
    <Cena fundo="#dde5f0" dur={dur(fala)} decoracao="#6c757d">
      {/* Rafa derruba o café */}
      <Pessoa x={560} y={1030} s={1.3} {...RAFA} humor={t > tErra + 0.2 ? 'surpresa' : 'neutro'} bracos="oferecer" fasePiscar={15}>
        <g transform={`translate(290 -230) rotate(${tomba})`}>
          <Cafe x={0} y={0} s={0.7} vapor={false} />
        </g>
        <ellipse cx={330} cy={-60} rx={entre(t, tErra + 0.2, tErra + 0.5, 0, 80)} ry={entre(t, tErra + 0.2, tErra + 0.5, 0, 26)} fill="#7f4f24" />
      </Pessoa>
      {/* Lia com nuvem de chuva */}
      <Pessoa x={1360} y={1030} s={1.3} {...LIA} humor={t > tDias ? 'triste' : 'neutro'} />
      <g opacity={entre(t, tDias - 0.15, tDias + 0.2)} transform={`translate(0 ${entre(t, tDias - 0.15, tDias + 0.3, -80, 0)})`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const y = ((t * 900 + i * 137) % 260) + 260;
          return <line key={i} x1={1250 + i * 55} y1={y} x2={1244 + i * 55} y2={y + 34} stroke="#4895ef" strokeWidth={9} strokeLinecap="round" />;
        })}
        <Nuvem x={1360} y={200} s={1.3} cor="#8d99ae" />
      </g>
    </Cena>
  );
};

/** "O que importa é o padrão." */
export const CenaPadrao: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tPadrao = momento(fala, 'padrão');
  const marcados = [2, 5, 9, 12, 16, 19, 23, 26];
  const cx = (i: number) => 520 + (i % 7) * 147;
  const cy = (i: number) => 260 + Math.floor(i / 7) * 150;
  const n = Math.floor(entre(t, 0.2, tPadrao + 0.2, 0, marcados.length));
  const linha = entre(t, tPadrao + 0.2, tPadrao + 0.8);
  return (
    <Cena fundo="#fefae0" dur={dur(fala)} decoracao={cores.laranja}>
      <g transform={`translate(960 480) scale(${pop(t, 0, 0.45)}) translate(-960 -480)`}>
        <rect x={430} y={110} width={1060} height={720} rx={30} fill="#fff" stroke={cores.tinta} strokeWidth={8} />
        <rect x={430} y={110} width={1060} height={90} rx={30} fill={cores.coral} stroke={cores.tinta} strokeWidth={8} />
        {new Array(28).fill(0).map((_, i) => (
          <rect key={i} x={cx(i) - 60} y={cy(i) - 55} width={120} height={110} rx={14} fill="#f1f3f5" />
        ))}
        {marcados.slice(0, n).map((i) => (
          <circle key={i} cx={cx(i)} cy={cy(i)} r={36} fill="#d00000" opacity={0.85} />
        ))}
        <polyline
          points={marcados.map((i) => `${cx(i)},${cy(i)}`).join(' ')}
          fill="none"
          stroke={cores.amarelo}
          strokeWidth={14}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - linha}
        />
      </g>
    </Cena>
  );
};

/** "Guarde essa palavra." */
export const CenaGuarde: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const desce = entre(t, 0.2, 1.1);
  const tampa = entre(t, 1.1, 1.4, -70, 0);
  return (
    <Cena fundo={cores.lavanda} dur={dur(fala)} decoracao="#ffffff">
      {/* cartão com a palavra entrando na caixa */}
      <g transform={`translate(960 ${interpolate(desce, [0, 1], [200, 640])}) scale(${interpolate(desce, [0, 1], [1, 0.5])})`} opacity={t < 1.15 ? 1 : 0}>
        <Cartao x={0} y={0} texto="padrão" cor={cores.amarelo} tamanho={90} />
      </g>
      {/* caixa */}
      <g transform="translate(960 720)">
        <rect x={-260} y={-60} width={520} height={260} rx={20} fill="#e76f51" stroke={cores.tinta} strokeWidth={9} />
        <rect x={-40} y={-60} width={80} height={260} fill={cores.amarelo} stroke={cores.tinta} strokeWidth={7} />
        <g transform={`rotate(${tampa} -280 -60)`}>
          <rect x={-280} y={-120} width={560} height={70} rx={18} fill="#f4a261" stroke={cores.tinta} strokeWidth={9} />
          <rect x={-40} y={-120} width={80} height={70} fill={cores.amarelo} stroke={cores.tinta} strokeWidth={7} />
        </g>
      </g>
      <Brilhos x={960} y={640} raio={330} qtd={7} cor="#fff" visivel={entre(t, 1.3, 1.5)} />
    </Cena>
  );
};

/** "Padrão." */
export const CenaPadraoFinal: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const d = dur(fala);
  const letras = 'PADRÃO'.split('');
  const paleta = [cores.coral, cores.laranja, cores.amarelo, cores.menta, cores.ceu, cores.lavanda];
  return (
    <Cena fundo={cores.tinta} dur={d} decoracao={cores.amarelo}>
      <g opacity={1 - entre(t, d - 0.6, d)}>
        {letras.map((l, i) => (
          <g key={i} transform={`translate(${960 + (i - 2.5) * 205} ${520 + Math.sin(t * 4 + i) * 12}) scale(${pop(t, 0.05 + i * 0.07, 0.4)})`}>
            <text textAnchor="middle" y={95} fontFamily={nunito} fontWeight={900} fontSize={280} fill={paleta[i]} stroke="#fff" strokeWidth={10} paintOrder="stroke">
              {l}
            </text>
          </g>
        ))}
        <Brilhos x={960} y={480} raio={680} qtd={10} cor={cores.amarelo} visivel={entre(t, 0.5, 0.8)} />
      </g>
    </Cena>
  );
};
