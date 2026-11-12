import React from 'react';
import {interpolate} from 'remotion';
import {Cena} from '../arte/Cena';
import {Cadeado, Celular, Coracao, IconeSinal, Joinha, Lampada, Ovo, PesoCulpa, Raio, Sino} from '../arte/Icones';
import {dur, FraseChave, type P} from '../arte/Modelos';
import {Brilhos, Cartao, Interrogacao, useSegundos} from '../arte/Objetos';
import {LIA, Pessoa, RAFA} from '../arte/Pessoa';
import {nunito} from '../fontes';
import {momento} from '../tempo';
import {cores, entre, pop} from '../util';

const C = cores.tinta;
const BIA = {pele: '#8d5524', cabelo: '#1b1b1b', roupa: '#b8a1ff', cabeloTipo: 'coque' as const};

/* ───────────── FECHAMENTO ───────────── */

const F = '#3d405b';
const xSinal = (i: number) => 960 + (i - 3) * 240;

const LinhaDeSinais: React.FC<{t: number; inicio: number; fio: number; y?: number}> = ({t, inicio, fio, y = 330}) => (
  <>
    <path
      d={`M ${xSinal(0)} ${y} ${new Array(6)
        .fill(0)
        .map((_, i) => `Q ${(xSinal(i) + xSinal(i + 1)) / 2} ${y + (i % 2 ? -70 : 70)} ${xSinal(i + 1)} ${y}`)
        .join(' ')}`}
      stroke="#ffd23f"
      strokeWidth={10}
      fill="none"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - fio}
    />
    {new Array(7).fill(0).map((_, i) => (
      <g key={i} transform={`translate(${xSinal(i)} ${y + Math.sin(t * 2 + i) * 8}) scale(${pop(t, inicio + i * 0.12)})`}>
        <circle r={95} fill="#fff" stroke={C} strokeWidth={7} />
        <IconeSinal n={i + 1} s={0.95} />
      </g>
    ))}
  </>
);

export const FNenhum: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  return (
    <Cena fundo={F} dur={dur(fala)} decoracao="#fff">
      <LinhaDeSinais t={t} inicio={0.05} fio={0} />
      <g transform={`translate(960 640) scale(${pop(t, momento(fala, 'prova nada') - 0.1)})`}>
        <Cartao x={0} y={0} texto="sozinho, não prova nada" tamanho={60} cor={cores.amarelo} />
      </g>
    </Cena>
  );
};

export const FRepeticao: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tRep = momento(fala, 'repetição');
  const efeitos: [string, string, React.ReactNode][] = [
    ['confusão', 'confusão', <Interrogacao key="a" x={0} y={45} s={0.9} />],
    ['culpa constante', 'culpa', <PesoCulpa key="b" s={0.9} />],
    ['medo de reagir', 'medo', <Raio key="c" s={1} />],
    ['pisar em ovos', 'pisar em ovos', <g key="d"><Ovo x={-30} s={0.6} /><Ovo x={30} s={0.6} rachado /></g>],
  ];
  return (
    <Cena fundo={F} dur={dur(fala)} decoracao="#fff">
      <LinhaDeSinais t={t + 5} inicio={-5} fio={entre(t, tRep - 0.3, tRep + 1)} y={230} />
      <g transform={`translate(960 430) scale(${pop(t, tRep - 0.1)})`}>
        <Cartao x={0} y={0} texto="REPETIÇÃO" tamanho={60} cor={cores.amarelo} />
      </g>
      {efeitos.map(([palavra, rotulo, icone], i) => (
        <g key={palavra} transform={`translate(${960 + (i - 1.5) * 380} 640) scale(${pop(t, momento(fala, palavra) - 0.1)})`}>
          <circle r={85} fill="#fff" stroke={C} strokeWidth={7} />
          {icone}
          <Cartao x={0} y={130} texto={rotulo} tamanho={40} />
        </g>
      ))}
    </Cena>
  );
};

const PensandoLia: React.FC = () => {
  const t = useSegundos();
  return (
    <>
      <Pessoa x={960} y={1060} s={0.9} {...LIA} humor="confusa" />
      <Interrogacao x={1220} y={560 - Math.sin(t * 3) * 12} s={0.8 * pop(t, 0.2)} />
      <Interrogacao x={700} y={600 - Math.cos(t * 3) * 12} s={0.6 * pop(t, 0.5)} />
    </>
  );
};

export const FPergunta: React.FC<P> = ({fala}) => (
  <FraseChave
    fala={fala}
    fundo={F}
    decoracao="#fff"
    y={250}
    linhas={[{texto: '"Essa pessoa é má?"', palavra: 'essa pessoa', tamanho: 120, risca: 'má?'}]}
  >
    <PensandoLia />
  </FraseChave>
);

export const FSente: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tS = momento(fala, 'sinto');
  const rompe = entre(t, tS, tS + 1);
  return (
    <Cena fundo={interpolate(rompe, [0, 1], [0, 1]) > 0.5 ? '#ffd6a5' : F} dur={dur(fala)} decoracao="#fff">
      <circle cx={960} cy={560} r={200 + rompe * 500} fill="#fff3b0" opacity={0.35 * rompe} />
      <line x1={760} y1={0} x2={760} y2={300 - rompe * 200} stroke="#ffd23f" strokeWidth={6} opacity={1 - rompe} />
      <line x1={1160} y1={0} x2={1160} y2={300 - rompe * 200} stroke="#ffd23f" strokeWidth={6} opacity={1 - rompe} />
      <line x1={760} y1={420 + rompe * 300} x2={860} y2={700 + rompe * 300} stroke="#ffd23f" strokeWidth={6} opacity={1 - rompe} />
      <line x1={1160} y1={420 + rompe * 300} x2={1060} y2={700 + rompe * 300} stroke="#ffd23f" strokeWidth={6} opacity={1 - rompe} />
      <Pessoa x={960} y={1040} s={1.2} {...LIA} humor={rompe > 0.5 ? 'feliz' : 'neutro'}>
        <Coracao x={0} y={-110} s={0.7} />
      </Pessoa>
      <g transform={`translate(960 140) scale(${pop(t, momento(fala, 'como eu') - 0.1)})`}>
        <Cartao x={0} y={0} texto='"Como eu me sinto perto dela?"' tamanho={60} />
      </g>
      <Brilhos x={960} y={560} raio={450} qtd={8} visivel={rompe} />
    </Cena>
  );
};

/* ───────────── NOTA DE CUIDADO (CVV) ───────────── */

export const CSozinho: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const abre = entre(t, 0.2, 1.6);
  return (
    <Cena fundo="#ffe5b4" dur={dur(fala)} decoracao="#fff">
      <defs>
        <linearGradient id="amanhecer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffafcc" />
          <stop offset="0.6" stopColor="#ffd6a5" />
          <stop offset="1" stopColor="#fdffb6" />
        </linearGradient>
      </defs>
      <rect x={560} y={110} width={800} height={560} rx={16} fill="url(#amanhecer)" stroke={C} strokeWidth={10} />
      <circle cx={960} cy={560 - abre * 120} r={110} fill="#ffd23f" />
      <rect x={560} y={560} width={800} height={110} fill="#95d5b2" />
      <path d={`M 560 110 L ${560 + 400 * (1 - abre * 0.85)} ${110 + abre * 30} L ${560 + 400 * (1 - abre * 0.85)} ${670 - abre * 30} L 560 670 Z`} fill="#9c6644" stroke={C} strokeWidth={8} />
      <path d={`M 1360 110 L ${1360 - 400 * (1 - abre * 0.85)} ${110 + abre * 30} L ${1360 - 400 * (1 - abre * 0.85)} ${670 - abre * 30} L 1360 670 Z`} fill="#9c6644" stroke={C} strokeWidth={8} />
      <Pessoa x={760} y={1000} s={0.9} {...LIA} humor="neutro" olhar={1} />
      <Pessoa x={1160} y={1000} s={0.9} {...BIA} humor="feliz" olhar={-1} fasePiscar={30} />
      <g transform={`translate(1640 420) scale(${pop(t, momento(fala, 'não precisa') - 0.1)})`}>
        <Cartao x={0} y={0} texto="você não está só" tamanho={44} cor="#fff" rotacao={5} />
      </g>
    </Cena>
  );
};

export const CConversar: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  return (
    <Cena fundo="#ffe5b4" dur={dur(fala)} decoracao="#ffafcc">
      {[560, 1360].map((x) => (
        <g key={x}>
          <rect x={x - 170} y={760} width={340} height={60} rx={20} fill="#6d597a" stroke={C} strokeWidth={7} />
          <rect x={x - 170} y={540} width={60} height={280} rx={20} fill="#6d597a" stroke={C} strokeWidth={7} transform={x > 960 ? `translate(${280} 0)` : undefined} />
        </g>
      ))}
      <Pessoa x={560} y={900} s={1} {...LIA} humor="neutro" olhar={1} />
      <Pessoa x={1360} y={900} s={1} {...BIA} humor="feliz" olhar={-1} fasePiscar={30} />
      <g transform={`translate(800 230) scale(${pop(t, 0.3)})`}>
        <circle r={70} fill="#fff" stroke={C} strokeWidth={6} />
        <Coracao s={0.7} />
      </g>
      <g transform={`translate(1120 230) scale(${pop(t, momento(fala, 'perspectiva') - 0.3)})`}>
        <circle r={70} fill="#fff" stroke={C} strokeWidth={6} />
        <Lampada s={0.8} />
      </g>
      <g transform={`translate(560 90) scale(${pop(t, momento(fala, 'confiança') - 0.1)})`}>
        <Cartao x={0} y={0} texto="alguém de confiança" tamanho={44} />
      </g>
      <g transform={`translate(1360 90) scale(${pop(t, momento(fala, 'psicólogo') - 0.1)})`}>
        <Cartao x={0} y={0} texto="psicólogo(a)" tamanho={44} cor={cores.amarelo} />
      </g>
    </Cena>
  );
};

/** Cartão do CVV (fica na tela nas duas últimas falas do bloco). */
const CartaoCVV: React.FC<{t: number; entrada: boolean; sigilo: number}> = ({t, entrada, sigilo}) => (
  <g transform={`translate(960 450) scale(${entrada ? pop(t, 0, 0.6) : 1})`}>
    <rect x={-640} y={-340} width={1280} height={680} rx={50} fill={C} opacity={0.2} transform="translate(14 16)" />
    <rect x={-640} y={-340} width={1280} height={680} rx={50} fill="#fffdf7" stroke={C} strokeWidth={10} />
    <rect x={-640} y={-340} width={1280} height={150} rx={50} fill="#f6bd60" stroke={C} strokeWidth={10} />
    <rect x={-631} y={-250} width={1262} height={55} fill="#f6bd60" />
    <text y={-240} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={84} fill={C}>
      CVV
    </text>
    <text y={-130} textAnchor="middle" fontFamily={nunito} fontWeight={800} fontSize={44} fill="#495057">
      Centro de Valorização da Vida
    </text>
    <Celular x={-380} y={50} s={1.4} tela="#caffbf" />
    <text x={-250} y={60} fontFamily={nunito} fontWeight={900} fontSize={150} fill="#d00000">
      188
    </text>
    <text x={60} y={0} fontFamily={nunito} fontWeight={800} fontSize={46} fill={C}>
      ligação gratuita
    </text>
    <text x={60} y={60} fontFamily={nunito} fontWeight={800} fontSize={46} fill={C}>
      24 horas por dia
    </text>
    <text y={220} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={70} fill="#2b2d42">
      chat: cvv.org.br
    </text>
    <g opacity={sigilo} transform={`translate(0 ${(1 - sigilo) * 20})`}>
      <Cadeado x={-470} y={290} s={0.8} />
      <text x={-400} y={300} fontFamily={nunito} fontWeight={800} fontSize={40} fill="#2d6a4f">
        com sigilo, sem julgamento
      </text>
      <Coracao x={250} y={285} s={0.55} />
    </g>
    <Brilhos x={0} y={0} raio={700} qtd={8} cor="#f6bd60" />
  </g>
);

export const CCvv: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  return (
    <Cena fundo="#ffe5b4" dur={dur(fala)} decoracao="#f6bd60">
      <CartaoCVV t={t} entrada sigilo={0} />
    </Cena>
  );
};

export const CSigilo: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  return (
    <Cena fundo="#ffe5b4" dur={dur(fala)} decoracao="#f6bd60">
      <CartaoCVV t={t} entrada={false} sigilo={entre(t, 0.1, 0.5)} />
    </Cena>
  );
};

/* ───────────── CHAMADA PARA AÇÃO ───────────── */

const A = '#ffd23f';

export const ALike: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tL = momento(fala, 'like');
  const aperta = interpolate(t, [tL - 0.1, tL + 0.1, tL + 0.4], [1, 0.85, 1.1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Cena fundo={A} dur={dur(fala)} decoracao="#fff">
      <Pessoa x={520} y={1040} s={1.2} {...LIA} humor="feliz" olhar={1} />
      <g transform={`translate(1250 450) scale(${pop(t, 0.2) * aperta})`}>
        <circle r={230} fill={t > tL ? '#4361ee' : '#fff'} stroke={C} strokeWidth={10} />
        <Joinha s={2.2} cor={t > tL ? '#fff' : '#4cc9f0'} />
      </g>
      <Brilhos x={1250} y={450} raio={320} qtd={10} visivel={entre(t, tL, tL + 0.3)} />
      {[0, 1, 2, 3].map((i) => (
        <Coracao key={i} x={1250 + (i - 1.5) * 120} y={300 - ((t * 150 + i * 70) % 260) + 200 * (t > tL ? 0 : 5)} s={0.4} />
      ))}
    </Cena>
  );
};

const BotaoSeguir: React.FC<{fala: P['fala']; texto: string; palavra: string; cor: string}> = ({fala, texto, palavra, cor}) => {
  const t = useSegundos();
  const tI = momento(fala, palavra);
  const toque = t > tI;
  return (
    <Cena fundo={A} dur={dur(fala)} decoracao="#fff">
      <g transform={`translate(960 430) scale(${pop(t, 0.1) * (toque ? 1.05 : 1)})`}>
        <rect x={-430} y={-110} width={860} height={220} rx={110} fill={cor} stroke={C} strokeWidth={10} />
        <text y={34} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={96} fill="#fff">
          {texto}
        </text>
      </g>
      <g transform={`translate(1500 430) rotate(${toque ? Math.sin(t * 25) * 15 : 0}) scale(${pop(t, tI)})`}>
        <circle r={110} fill="#fff" stroke={C} strokeWidth={8} />
        <Sino s={1.2} />
      </g>
      <g transform={`translate(960 720) scale(${pop(t, momento(fala, 'psicologia') - 0.1)})`}>
        <Cartao x={0} y={0} texto="a psicologia por trás do que você faz" tamanho={46} />
      </g>
    </Cena>
  );
};

export const AInscreve: React.FC<P> = ({fala}) => <BotaoSeguir fala={fala} texto="INSCREVER-SE" palavra="inscreve" cor="#e63946" />;
export const XSegue: React.FC<P> = ({fala}) => <BotaoSeguir fala={fala} texto="SEGUIR" palavra="segue" cor="#ff4d6d" />;

export const AComenta: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tQ = momento(fala, 'qual');
  return (
    <Cena fundo={A} dur={dur(fala)} decoracao="#fff">
      <g transform={`translate(960 260) scale(${pop(t, 0.1)})`}>
        <path d="M -760 -150 L 760 -150 Q 800 -150 800 -110 L 800 110 Q 800 150 760 150 L -400 150 L -480 230 L -470 150 L -760 150 Q -800 150 -800 110 L -800 -110 Q -800 -150 -760 -150 Z" fill="#fff" stroke={C} strokeWidth={10} strokeLinejoin="round" />
        <text y={-15} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={66} fill={C} opacity={entre(t, tQ - 0.2, tQ + 0.2)}>
          Qual sinal é o mais difícil
        </text>
        <text y={70} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={66} fill="#d00000" opacity={entre(t, tQ, tQ + 0.4)}>
          de notar?
        </text>
      </g>
      {new Array(7).fill(0).map((_, i) => (
        <g key={i} transform={`translate(${xSinal(i)} ${640 + Math.sin(t * 3 + i) * 10}) scale(${pop(t, tQ + 0.3 + i * 0.12)})`}>
          <circle r={95} fill="#fff" stroke={C} strokeWidth={7} />
          <IconeSinal n={i + 1} s={0.95} />
          <text y={150} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={50} fill={C}>
            {i + 1}
          </text>
        </g>
      ))}
    </Cena>
  );
};

export const ATchau: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const d = dur(fala);
  return (
    <Cena fundo={A} dur={d} decoracao="#fff">
      <g opacity={1 - entre(t, d - 0.6, d)}>
        <Pessoa x={700} y={1040} s={1.2} {...RAFA} humor="feliz" bracos="acenar" />
        <Pessoa x={1220} y={1040} s={1.2} {...LIA} humor="feliz" bracos="acenar" fasePiscar={20} />
        <Brilhos x={960} y={450} raio={520} qtd={10} />
      </g>
    </Cena>
  );
};

/* ───────────── EXTRAS DAS PARTES PARA REDES SOCIAIS ───────────── */

export const XP1Gancho: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  return (
    <Cena fundo="#bc6c25" dur={dur(fala)} decoracao="#ffd6a5">
      <g transform={`translate(960 430) scale(${pop(t, 0, 0.5)})`}>
        <circle r={260} fill="#fff" stroke={C} strokeWidth={10} />
        <g opacity={0.25}>
          <PesoCulpa s={2.6} />
        </g>
        <Cadeado x={0} y={20} s={2} />
      </g>
      <g transform={`translate(960 800) scale(${pop(t, 0.3)})`}>
        <Cartao x={0} y={0} texto="SINAL 3" tamanho={70} cor={cores.amarelo} />
      </g>
      <g transform={`translate(1550 260) scale(${pop(t, momento(fala, 'culpado') - 0.1)})`}>
        <Cartao x={0} y={0} texto="culpa sem acusação" tamanho={44} rotacao={5} />
      </g>
    </Cena>
  );
};

const Continua: React.FC<P & {parte: number}> = ({fala, parte}) => {
  const t = useSegundos();
  const d = dur(fala);
  return (
    <Cena fundo={C} dur={d} decoracao={cores.amarelo}>
      <g opacity={1 - entre(t, d - 0.5, d)}>
        <text x={960} y={330} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={110} fill="#fff" opacity={entre(t, 0, 0.3)}>
          CONTINUA NA
        </text>
        <g transform={`translate(960 520) scale(${pop(t, 0.2, 0.5)})`}>
          <rect x={-420} y={-110} width={840} height={220} rx={110} fill={cores.amarelo} stroke="#fff" strokeWidth={10} />
          <text y={50} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={150} fill={C}>
            PARTE {parte}
          </text>
        </g>
        <g transform={`translate(${960 + Math.sin(t * 6) * 30} 760)`}>
          <path d="M -120 0 L 80 0 M 30 -60 L 100 0 L 30 60" stroke="#fff" strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </Cena>
  );
};

export const XP1Continua: React.FC<P> = ({fala}) => <Continua fala={fala} parte={2} />;
export const XP2Continua: React.FC<P> = ({fala}) => <Continua fala={fala} parte={3} />;

const InicioParte: React.FC<P & {parte: number; vistos: number}> = ({fala, parte, vistos}) => {
  const t = useSegundos();
  return (
    <Cena fundo={C} dur={dur(fala)} decoracao={cores.amarelo}>
      <g transform={`translate(960 260) scale(${pop(t, 0, 0.5)})`}>
        <rect x={-420} y={-110} width={840} height={220} rx={110} fill={cores.amarelo} stroke="#fff" strokeWidth={10} />
        <text y={50} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={150} fill={C}>
          PARTE {parte}
        </text>
      </g>
      {new Array(7).fill(0).map((_, i) => (
        <g key={i} transform={`translate(${xSinal(i)} 620) scale(${pop(t, 0.4 + i * 0.1)})`} opacity={i < vistos ? 0.45 : 1}>
          <circle r={95} fill="#fff" stroke={i < vistos ? '#adb5bd' : cores.amarelo} strokeWidth={9} />
          <IconeSinal n={i + 1} s={0.95} />
        </g>
      ))}
      <g transform={`translate(960 830) scale(${pop(t, momento(fala, 'perfil') - 0.1)})`}>
        <Cartao x={0} y={-40} texto="parte anterior no perfil" tamanho={42} />
      </g>
    </Cena>
  );
};

export const XP2Inicio: React.FC<P> = ({fala}) => <InicioParte fala={fala} parte={2} vistos={2} />;
export const XP3Inicio: React.FC<P> = ({fala}) => <InicioParte fala={fala} parte={3} vistos={5} />;

export const XP2Gancho: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const t7 = momento(fala, 'sétimo');
  return (
    <Cena fundo={C} dur={dur(fala)} decoracao="#fff">
      {[6, 7].map((n, i) => (
        <g key={n} transform={`translate(${720 + i * 480} 430) scale(${pop(t, i === 0 ? 0.1 : t7 - 0.2, 0.5)})`}>
          <circle r={200} fill="#fff" stroke={C} strokeWidth={10} />
          <g opacity={0.25}>
            <IconeSinal n={n} s={2} />
          </g>
          <Cadeado x={0} y={20} s={1.6} />
          <Cartao x={0} y={270} texto={`SINAL ${n}`} tamanho={56} cor={cores.amarelo} />
        </g>
      ))}
      <g transform={`translate(960 110) scale(${pop(t, momento(fala, 'difíceis') - 0.1)})`}>
        <Cartao x={0} y={0} texto="os mais difíceis de enxergar" tamanho={50} />
      </g>
    </Cena>
  );
};
