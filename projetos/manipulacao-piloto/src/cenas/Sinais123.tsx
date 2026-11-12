import React from 'react';
import {interpolate} from 'remotion';
import {Cena} from '../arte/Cena';
import {
  BalaoFala,
  Bateria,
  BombaCoracao,
  Cadeado,
  Calendario,
  Celular,
  Check,
  Coracao,
  Espelho,
  Estrela,
  Grafico,
  Grupo,
  Lampada,
  Livro,
  Martelo,
  PesoCulpa,
  Pessoinha,
} from '../arte/Icones';
import {CartaoEstudo, Citacoes, dur, FraseChave, IconesNaHora, type P, TituloSinal} from '../arte/Modelos';
import {Cartao, Interrogacao, Nuvem, useSegundos} from '../arte/Objetos';
import {LIA, Pessoa, RAFA} from '../arte/Pessoa';
import {nunito} from '../fontes';
import {momento} from '../tempo';
import {cores, entre, pop} from '../util';

const C = cores.tinta;

/* ───────────── SINAL 1 — LOVE BOMBING ───────────── */

const S1 = '#ff8fab';

export const S1Titulo: React.FC<P> = ({fala}) => <TituloSinal fala={fala} n={1} linhas={['O excesso', 'no começo']} fundo={S1} />;

const NOTAS = ['Bom dia, linda!', 'Você é perfeita!', 'Vamos viajar juntos?', 'Nunca senti isso por ninguém'];

/** Celular com notificações empilhando como uma torre. */
const TorreNotificacoes: React.FC<{t: number; tempos: number[]; balanco: number}> = ({t, tempos, balanco}) => {
  const vibra = tempos.some((m) => t > m && t < m + 0.35) ? Math.sin(t * 90) * 6 : 0;
  return (
    <g transform={`rotate(${balanco} 600 900)`}>
      <g transform={`translate(${600 + vibra} 760)`}>
        <rect x={-130} y={-200} width={260} height={400} rx={36} fill="#1b1b2f" stroke={C} strokeWidth={8} />
        <rect x={-112} y={-176} width={224} height={350} rx={20} fill="#ffe5ec" />
        <Coracao s={0.9} />
      </g>
      {NOTAS.map((n, i) => {
        const m = tempos[i];
        const entrada = entre(t, m, m + 0.35);
        return (
          <g key={n} transform={`translate(${600 + (1 - entrada) * 600} ${470 - i * 105}) rotate(${i % 2 ? 3 : -3})`} opacity={entrada}>
            <rect x={-300} y={-44} width={600} height={88} rx={24} fill="#fff" stroke={C} strokeWidth={6} />
            <circle cx={-250} cy={0} r={26} fill={cores.coral} />
            <path d="M -250 12 C -268 0 -262 -14 -250 -6 C -238 -14 -232 0 -250 12 Z" fill="#fff" />
            <text x={-205} y={14} fontFamily={nunito} fontWeight={800} fontSize={n.length > 22 ? 32 : 38} fill={C}>
              {n}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export const S1Conhece: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tempos = ['mensagens', 'elogios', 'planos', 'nunca senti'].map((p) => momento(fala, p) - 0.1);
  return (
    <Cena fundo="#ffe5ec" dur={dur(fala)} decoracao={S1}>
      <TorreNotificacoes t={t} tempos={tempos} balanco={0} />
      <Pessoa x={1450} y={1040} s={1.2} {...LIA} humor={t > tempos[1] ? 'feliz' : 'surpresa'} olhar={-1} />
      {[0, 1, 2, 3, 4].map((i) => {
        const fase = (t * 0.6 + i * 0.2) % 1;
        return <Coracao key={i} x={1300 + i * 70} y={600 - fase * 400} s={0.4} cor="#ff4d6d" />;
      })}
    </Cena>
  );
};

export const S1Filme: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  return (
    <Cena fundo="#9d0208" dur={dur(fala)} decoracao="#ffba08">
      <rect x={360} y={110} width={1200} height={620} rx={20} fill="#fff" stroke={C} strokeWidth={10} />
      <g clipPath="url(#tela-filme)">
        <defs>
          <clipPath id="tela-filme">
            <rect x={370} y={120} width={1180} height={600} rx={14} />
          </clipPath>
        </defs>
        <rect x={370} y={120} width={1180} height={600} fill="#ffd6e0" />
        <circle cx={960} cy={760} r={entre(t, 0, 1.2, 200, 420)} fill="#ffb3c6" />
        <Pessoa x={800} y={830} s={0.95} {...RAFA} humor="feliz" olhar={1} />
        <Pessoa x={1120} y={830} s={0.95} {...LIA} humor="feliz" olhar={-1} fasePiscar={30} />
        {[0, 1, 2, 3].map((i) => (
          <Coracao key={i} x={880 + i * 55} y={300 - ((t * 120 + i * 50) % 160)} s={0.35} />
        ))}
      </g>
      {/* cortinas */}
      <path d={`M 0 0 L ${380 + Math.sin(t * 2) * 10} 0 Q 300 400 ${340 + Math.sin(t * 2) * 10} 1080 L 0 1080 Z`} fill="#d00000" stroke={C} strokeWidth={8} />
      <path d={`M 1920 0 L ${1540 - Math.sin(t * 2) * 10} 0 Q 1620 400 ${1580 - Math.sin(t * 2) * 10} 1080 L 1920 1080 Z`} fill="#d00000" stroke={C} strokeWidth={8} />
      {/* pipoca */}
      <g transform={`translate(1700 ${820 - pop(t, 0.2) * 40})`}>
        <path d="M -70 -60 L 70 -60 L 50 110 L -50 110 Z" fill="#fff" stroke={C} strokeWidth={7} />
        <path d="M -45 -60 L -32 110 M 0 -60 L 0 110 M 45 -60 L 32 110" stroke="#e63946" strokeWidth={16} />
        {[-50, -15, 20, 55, -30, 35].map((x, i) => (
          <circle key={i} cx={x} cy={-70 - (i > 3 ? 30 : 0)} r={24} fill="#fff3b0" stroke={C} strokeWidth={5} />
        ))}
      </g>
    </Cena>
  );
};

export const S1Problema: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tProb = momento(fala, 'problema');
  const tempos = [-1, -1, -1, -1];
  const balanco = Math.sin(t * 5) * entre(t, 0, tProb + 0.5, 2, 9);
  return (
    <Cena fundo="#ffe5ec" dur={dur(fala)} decoracao={S1}>
      <TorreNotificacoes t={t} tempos={tempos} balanco={balanco} />
      <Pessoa x={1450} y={1040} s={1.2} {...LIA} humor={t > tProb ? 'preocupada' : 'feliz'} olhar={-1} />
      <g transform={`translate(1450 230) scale(${pop(t, tProb - 0.1)})`}>
        <path d="M 0 -110 L 120 90 L -120 90 Z" fill={cores.amarelo} stroke={C} strokeWidth={12} strokeLinejoin="round" />
        <rect x={-13} y={-50} width={26} height={90} rx={12} fill={C} />
        <circle cx={0} cy={65} r={15} fill={C} />
      </g>
    </Cena>
  );
};

export const S1Nome: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  return (
    <Cena fundo={S1} dur={dur(fala)} decoracao="#fff">
      {new Array(10).fill(0).map((_, i) => {
        const x = 200 + ((i * 397) % 1520);
        const queda = ((t * 0.55 + i * 0.13) % 1) * 1300 - 200;
        return <BombaCoracao key={i} x={x} y={queda} s={0.8} />;
      })}
      <Pessoa x={960} y={1040} s={1.25} {...LIA} humor="preocupada" />
      <g transform={`translate(960 170) scale(${pop(t, momento(fala, 'love') - 0.1)})`}>
        <Cartao x={0} y={0} texto="LOVE BOMBING" cor={cores.amarelo} tamanho={90} />
      </g>
      <g transform={`translate(960 330) scale(${pop(t, momento(fala, 'bombardeio') - 0.1)})`}>
        <Cartao x={0} y={0} texto="bombardeio de afeto" tamanho={52} />
      </g>
    </Cena>
  );
};

export const S1Estudo: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tNum = momento(fala, 'quatrocentos');
  const n = Math.floor(entre(t, tNum - 0.2, tNum + 1.6, 0, 484));
  return (
    <CartaoEstudo
      fala={fala}
      fundo="#ffccd5"
      ano="2017"
      autores={['Strutzenberg et al.']}
      fonte={['Universidade do Arkansas', 'Discovery, 18(1)']}
      corLivro="#c9184a"
    >
      {new Array(484).fill(0).map((_, i) => (
        <circle key={i} cx={1060 + (i % 22) * 32} cy={200 + Math.floor(i / 22) * 24} r={9} fill={i < n ? '#c9184a' : '#ffffff'} opacity={i < n ? 1 : 0.6} />
      ))}
      <g transform={`translate(1395 770) scale(${pop(t, tNum - 0.1)})`}>
        <Cartao x={0} y={0} texto={`${n} universitários`} tamanho={56} cor={cores.amarelo} />
      </g>
    </CartaoEstudo>
  );
};

export const S1Achado: React.FC<P> = ({fala}) => (
  <IconesNaHora
    fala={fala}
    fundo="#ffccd5"
    titulo={{texto: 'ASSOCIAÇÃO', palavra: 'associação'}}
    itens={[
      {palavra: 'comportamento', rotulo: 'love bombing', icone: <BombaCoracao s={1.3} />},
      {palavra: 'narcisistas', rotulo: 'traços narcisistas', icone: <Espelho s={1.4} />},
      {palavra: 'autoestima', rotulo: 'menor autoestima', icone: <Bateria s={1.3} nivel={0.2} />},
    ]}
  />
);

export const S1Correlacao: React.FC<P> = ({fala}) => (
  <IconesNaHora
    fala={fala}
    fundo="#ffe5ec"
    itens={[
      {palavra: 'correlação', rotulo: 'correlação', icone: <Grafico s={1.4} />, cor: '#d8f3dc'},
      {palavra: 'sentença', rotulo: 'sentença', icone: <Martelo s={1.2} />, risca: 'sentença'},
    ]}
  />
);

const AlertaNao: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tNao = momento(fala, "'não'");
  return (
    <>
      <Pessoa x={270} y={1060} s={0.95} {...RAFA} humor={t > tNao + 0.4 ? 'bravo' : 'feliz'} olhar={1} />
      <Pessoa x={1650} y={1060} s={0.95} {...LIA} humor="neutro" olhar={-1} />
      <g transform={`translate(1430 620) scale(${pop(t, tNao - 0.1)})`}>
        <BalaoFala s={1.5}>
          <text y={8} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={44} fill={C}>
            Não.
          </text>
        </BalaoFala>
      </g>
    </>
  );
};

export const S1Alerta: React.FC<P> = ({fala}) => (
  <FraseChave
    fala={fala}
    fundo={S1}
    y={190}
    linhas={[
      {texto: 'INTENSIDADE', palavra: 'intensidade', cor: '#ff4d6d'},
      {texto: 'antes da', palavra: 'antes da', tamanho: 70},
      {texto: 'INTIMIDADE', palavra: 'intimidade', cor: cores.amarelo},
    ]}
  >
    <AlertaNao fala={fala} />
  </FraseChave>
);

/* ───────────── SINAL 2 — GASLIGHTING ───────────── */

const S2 = '#9d8df1';

export const S2Titulo: React.FC<P> = ({fala}) => <TituloSinal fala={fala} n={2} linhas={['Duvidar da', 'própria memória']} fundo={S2} />;

export const S2Frases: React.FC<P> = ({fala}) => (
  <Citacoes
    fala={fala}
    fundo="#cdb4db"
    reacao="confusa"
    citacoes={[
      {texto: ['"Eu nunca disse isso."'], palavra: 'eu nunca'},
      {texto: ['"Você está exagerando."'], palavra: 'você está'},
      {texto: ['"Você é sensível demais."'], palavra: 'você é'},
    ]}
  />
);

export const S2Rotina: React.FC<P> = ({fala}) => (
  <IconesNaHora
    fala={fala}
    fundo="#e0c3fc"
    itens={[
      {palavra: 'uma vez', rotulo: 'uma vez', icone: <Calendario s={1.3} marcas={[4]} />},
      {palavra: 'rotina', rotulo: 'rotina', icone: <Calendario s={1.3} marcas={[0, 1, 2, 3, 4, 5, 6, 7, 8]} />},
      {palavra: 'prints', rotulo: 'conferir prints', icone: <Celular s={1.3} tela="#ffd6a5" />},
      {
        palavra: 'ensaiar',
        rotulo: 'ensaiar conversas',
        icone: (
          <BalaoFala s={1.2}>
            <rect x={-40} y={-20} width={80} height={10} rx={5} fill="#adb5bd" />
            <rect x={-40} y={0} width={60} height={10} rx={5} fill="#adb5bd" />
          </BalaoFala>
        ),
      },
      {palavra: 'confirmarem', rotulo: 'pedir confirmação', icone: <Grupo s={1.3} />},
    ]}
  />
);

export const S2Nome: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const pisca = Math.sin(t * 13) * Math.sin(t * 7.3) > -0.25 ? 1 : 0.25;
  const tMarido = momento(fala, 'marido');
  return (
    <Cena fundo="#3c096c" dur={dur(fala)} decoracao="#c77dff">
      <rect x={0} y={760} width={1920} height={320} fill="#7f5539" />
      <rect x={0} y={760} width={1920} height={24} fill="#582f0e" />
      {/* luz da lâmpada */}
      <ellipse cx={960} cy={760} rx={520} ry={70} fill="#fff3b0" opacity={0.25 * pisca} />
      <path d="M 960 0 L 960 260" stroke={C} strokeWidth={6} />
      <Lampada x={960} y={320} s={1.4} acesa={pisca} />
      <g opacity={entre(t, tMarido - 0.1, tMarido + 0.3)}>
        <Pessoa x={810} y={800} s={0.75} {...RAFA} humor="neutro" olhar={1} />
        <Pessoa x={1110} y={800} s={0.75} {...LIA} humor="confusa" olhar={-1} />
      </g>
      {/* cortinas */}
      <path d={`M 0 0 L ${420 + Math.sin(t * 2) * 12} 0 Q 330 450 ${380 + Math.sin(t * 2) * 12} 1080 L 0 1080 Z`} fill="#9d0208" stroke={C} strokeWidth={8} />
      <path d={`M 1920 0 L ${1500 - Math.sin(t * 2) * 12} 0 Q 1590 450 ${1540 - Math.sin(t * 2) * 12} 1080 L 1920 1080 Z`} fill="#9d0208" stroke={C} strokeWidth={8} />
      <g transform={`translate(960 140) scale(${pop(t, momento(fala, 'gaslighting') - 0.1)})`}>
        <Cartao x={0} y={0} texto="GASLIGHTING" cor={cores.amarelo} tamanho={86} />
      </g>
      <g transform={`translate(260 330) scale(${pop(t, momento(fala, 'teatro') - 0.1)})`}>
        <Cartao x={0} y={0} texto="1938 · teatro" tamanho={46} rotacao={-6} />
      </g>
      <g transform={`translate(1660 330) scale(${pop(t, momento(fala, 'cinema') - 0.1)})`}>
        <Cartao x={0} y={0} texto="1944 · cinema" tamanho={46} rotacao={6} />
      </g>
    </Cena>
  );
};

export const S2Estudo: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tPoder = momento(fala, 'poder');
  const incl = entre(t, tPoder - 0.2, tPoder + 0.6, 0, 16);
  const tEmo = momento(fala, 'emocionais');
  return (
    <CartaoEstudo
      fala={fala}
      fundo="#cdb4db"
      ano="2019"
      autores={['Paige L. Sweet']}
      fonte={['Universidade Harvard', 'American Sociological Review', '84(5)']}
      corLivro="#7209b7"
    >
      {/* balança do poder */}
      <g transform="translate(1420 380)">
        <rect x={-10} y={-120} width={20} height={250} fill="#8d5524" stroke={C} strokeWidth={5} />
        <rect x={-90} y={120} width={180} height={30} rx={10} fill="#8d5524" stroke={C} strokeWidth={5} />
        <g transform={`rotate(${incl})`}>
          <rect x={-260} y={-130} width={520} height={20} rx={8} fill="#e9a23b" stroke={C} strokeWidth={5} />
          <g transform="translate(-240 -120)">
            <path d="M 0 0 L -50 120 M 0 0 L 50 120" stroke={C} strokeWidth={4} />
            <path d="M -70 120 L 70 120 Q 0 170 -70 120 Z" fill="#e9a23b" stroke={C} strokeWidth={5} />
            <Pessoinha y={80} s={0.9} cor="#2ec4b6" />
          </g>
          <g transform="translate(240 -120)">
            <path d="M 0 0 L -50 120 M 0 0 L 50 120" stroke={C} strokeWidth={4} />
            <path d="M -70 120 L 70 120 Q 0 170 -70 120 Z" fill="#e9a23b" stroke={C} strokeWidth={5} />
            <Pessoinha y={60} s={1.3} cor="#ff6b6b" />
          </g>
        </g>
      </g>
      <g transform={`translate(1420 640) scale(${pop(t, tPoder - 0.1)})`}>
        <Cartao x={0} y={0} texto="desigualdade de poder" tamanho={44} />
      </g>
      <g transform={`translate(1420 780) scale(${pop(t, tEmo - 0.1)})`}>
        <Cartao x={0} y={0} texto="EMOCIONAL DEMAIS?" tamanho={50} cor="#fff" corTexto="#d00000" rotacao={-5} />
      </g>
    </CartaoEstudo>
  );
};

export const S2Surreal: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  return (
    <Cena fundo={S2} dur={dur(fala)} decoracao="#fff">
      <defs>
        <filter id="ondas-surreal">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves={2} seed={Math.floor(t * 8)} result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale={entre(t, 0, 1.5, 0, 70)} />
        </filter>
      </defs>
      <g filter="url(#ondas-surreal)">
        <rect x={260} y={100} width={1400} height={700} rx={20} fill="#ffe5ec" stroke={C} strokeWidth={8} />
        <rect x={260} y={700} width={1400} height={100} fill="#e5989b" />
        <rect x={360} y={200} width={300} height={240} rx={10} fill="#8ecae6" stroke={C} strokeWidth={8} />
        <path d="M 510 200 L 510 440 M 360 320 L 660 320" stroke={C} strokeWidth={8} />
        <rect x={1320} y={220} width={200} height={150} fill="#ffd23f" stroke={C} strokeWidth={8} transform="rotate(8 1420 295)" />
        <Lampada x={1180} y={520} s={1} />
        <Pessoa x={900} y={800} s={0.95} {...LIA} humor="confusa" />
      </g>
      <g transform={`translate(960 920) scale(${pop(t, momento(fala, 'surreal') - 0.1)})`}>
        <Cartao x={0} y={-60} texto="SURREAL" cor={cores.amarelo} tamanho={80} rotacao={-3} />
      </g>
    </Cena>
  );
};

export const S2Sinal: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tReal = momento(fala, 'real');
  const x = entre(t, 0, dur(fala), 650, 1050);
  return (
    <Cena fundo="#cdb4db" dur={dur(fala)} decoracao={S2}>
      <rect x={1380} y={160} width={360} height={720} rx={10} fill="#3c096c" stroke={C} strokeWidth={10} />
      <path d="M 1380 160 L 1500 210 L 1500 830 L 1380 880 Z" fill="#9d4edd" stroke={C} strokeWidth={8} />
      <Pessoa x={x} y={1040} s={1.15} {...LIA} humor="confusa" />
      {[0, 1, 2].map((i) => {
        const a = t * 2 + (i * Math.PI * 2) / 3;
        return <Interrogacao key={i} x={x + Math.cos(a) * 230} y={420 + Math.sin(a) * 60} s={0.6} />;
      })}
      <g transform={`translate(${x + 330} 230) scale(${pop(t, tReal - 0.4)})`}>
        <Nuvem x={0} y={0} s={1.7} />
        <text y={20} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={52} fill={C}>
          o que é real?
        </text>
      </g>
    </Cena>
  );
};

/* ───────────── SINAL 3 — CULPA ───────────── */

const S3 = '#f4a261';

export const S3Titulo: React.FC<P> = ({fala}) => <TituloSinal fala={fala} n={3} linhas={['A culpa chega', 'antes da conversa']} fundo={S3} />;

/** Sala com sofá (Rafa) e uma porta entreaberta com luz e amigos lá fora. */
const Sala: React.FC<{abertura: number; humorLia: React.ComponentProps<typeof Pessoa>['humor']; humorRafa: React.ComponentProps<typeof Pessoa>['humor']; children?: React.ReactNode}> = ({
  abertura,
  humorLia,
  humorRafa,
  children,
}) => {
  const larg = 300 * (1 - abertura * 0.8);
  return (
    <>
      <rect x={0} y={820} width={1920} height={260} fill="#bc6c25" />
      {/* porta */}
      <rect x={1300} y={150} width={320} height={680} fill="#ffe066" stroke={C} strokeWidth={10} />
      <g opacity={abertura}>
        <rect x={1300} y={150} width={320} height={680} fill="#ffd23f" />
        <Pessoinha x={1400} y={600} s={1.6} cor="#ff6b6b" />
        <Pessoinha x={1530} y={620} s={1.5} cor="#b8a1ff" />
        <circle cx={1460} cy={300} r={60} fill="#fff3b0" />
      </g>
      <path d={`M 1300 150 L ${1300 + larg} ${150 + abertura * 40} L ${1300 + larg} ${830 - abertura * 40} L 1300 830 Z`} fill="#9c6644" stroke={C} strokeWidth={8} strokeLinejoin="round" />
      <circle cx={1300 + larg - 30} cy={500} r={14} fill={cores.amarelo} stroke={C} strokeWidth={4} />
      {/* luz entrando */}
      <path d={`M 1300 830 L ${1300 + 320 * abertura} 830 L ${1100 + 200 * abertura} 1080 L 900 1080 Z`} fill="#ffe066" opacity={0.35 * abertura} />
      {/* sofá */}
      <rect x={140} y={620} width={560} height={240} rx={40} fill="#6d597a" stroke={C} strokeWidth={8} />
      <Pessoa x={420} y={900} s={0.95} {...RAFA} humor={humorRafa} olhar={1} />
      <rect x={110} y={760} width={620} height={140} rx={40} fill="#8d7299" stroke={C} strokeWidth={8} />
      <Pessoa x={1080} y={1040} s={1.05} {...LIA} humor={humorLia} olhar={-1} fasePiscar={20} />
      {children}
    </>
  );
};

export const S3Sair: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tFrase = momento(fala, 'tudo bem');
  return (
    <Cena fundo="#f7d6b0" dur={dur(fala)} decoracao={S3}>
      <Sala abertura={0.85} humorLia={t > tFrase + 0.5 ? 'preocupada' : 'feliz'} humorRafa="triste">
        <g transform={`translate(560 230) scale(${pop(t, tFrase - 0.1)})`}>
          <rect x={-330} y={-120} width={660} height={210} rx={30} fill="#fff" stroke={C} strokeWidth={7} />
          <path d="M -60 88 L -110 150 L 0 88" fill="#fff" stroke={C} strokeWidth={7} strokeLinejoin="round" />
          {['"Tudo bem, vai lá…', 'eu fico aqui', 'sozinho mesmo."'].map((l, i) => (
            <text key={l} x={-300} y={-50 + i * 58} fontFamily={nunito} fontWeight={800} fontSize={46} fill={C}>
              {l}
            </text>
          ))}
        </g>
      </Sala>
    </Cena>
  );
};

export const S3Ninguem: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tP = momento(fala, 'proibiu');
  return (
    <Cena fundo="#f7d6b0" dur={dur(fala)} decoracao={S3}>
      <Sala abertura={0.85} humorLia="confusa" humorRafa="triste">
        <g transform={`translate(1460 100) scale(${pop(t, tP - 0.2)})`}>
          <Cartao x={0} y={0} texto="nenhuma proibição" tamanho={46} />
        </g>
        <Cadeado x={1250} y={300} s={pop(t, tP - 0.4) * 1.2} aberto />
      </Sala>
    </Cena>
  );
};

export const S3Fica: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tFica = momento(fala, 'fica');
  const ab = entre(t, tFica - 0.2, tFica + 0.8, 0.85, 0);
  return (
    <Cena fundo={interpolate(ab, [0, 0.85], [0, 1]) > 0.5 ? '#f7d6b0' : '#e0b98f'} dur={dur(fala)} decoracao={S3}>
      <Sala abertura={ab} humorLia={t > tFica ? 'triste' : 'preocupada'} humorRafa={t > tFica + 0.6 ? 'feliz' : 'triste'} />
      <rect width={1920} height={1080} fill="#2b2d42" opacity={0.25 * (1 - ab / 0.85)} />
    </Cena>
  );
};

export const S3Estudo: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tI = momento(fala, 'interpessoal');
  return (
    <CartaoEstudo
      fala={fala}
      fundo="#ffd6a5"
      ano="1994"
      autores={['Baumeister,', 'Stillwell & Heatherton']}
      fonte={['Psychological Bulletin', '115(2)']}
      corLivro="#bc6c25"
    >
      <Pessoinha x={1230} y={430} s={2.4} cor="#2ec4b6" />
      <Pessoinha x={1670} y={430} s={2.4} cor="#ff6b6b" />
      <path d={`M 1300 450 Q 1450 ${500 + Math.sin(t * 3) * 20} 1600 450`} stroke="#8d5524" strokeWidth={10} fill="none" />
      <Coracao x={1450} y={490} s={pop(t, tI - 0.4) * 0.8} />
      <g transform={`translate(1450 700) scale(${pop(t, tI - 0.2)})`}>
        <Cartao x={0} y={0} texto="emoção interpessoal" tamanho={48} cor={cores.amarelo} />
      </g>
    </CartaoEstudo>
  );
};

export const S3Protege: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  return (
    <Cena fundo="#a2d2ff" dur={dur(fala)} decoracao="#fff">
      {new Array(14).fill(0).map((_, i) => {
        const x = 220 + i * 110;
        const y = ((t * 700 + i * 97) % 700) + 80;
        const protegido = x > 620 && x < 1300 && y > 300;
        return protegido ? null : <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 40} stroke="#4361ee" strokeWidth={9} strokeLinecap="round" />;
      })}
      <g transform={`translate(960 280) scale(${pop(t, 0)})`}>
        <path d="M -360 0 Q -360 -230 0 -230 Q 360 -230 360 0 Q 300 -40 240 0 Q 180 -40 120 0 Q 60 -40 0 0 Q -60 -40 -120 0 Q -180 -40 -240 0 Q -300 -40 -360 0 Z" fill="#ff6b6b" stroke={C} strokeWidth={9} strokeLinejoin="round" />
        <path d="M 0 -230 L 0 330 Q 0 380 -50 370" stroke={C} strokeWidth={14} fill="none" strokeLinecap="round" />
      </g>
      <Coracao x={960} y={560} s={2.2 * pop(t, 0.3)} />
      <g transform={`translate(960 860) scale(${pop(t, momento(fala, 'proteger') - 0.1)})`}>
        <Cartao x={0} y={-40} texto="protege relações" tamanho={58} cor={cores.amarelo} />
      </g>
    </Cena>
  );
};

export const S3Influenciar: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tCeda = momento(fala, 'ceda');
  const xLia = entre(t, tCeda - 0.3, tCeda + 1.2, 1500, 1120);
  const lagrima = (t * 0.8) % 1;
  return (
    <Cena fundo="#f7d6b0" dur={dur(fala)} decoracao={S3}>
      <Pessoa x={420} y={1040} s={1.15} {...RAFA} humor="triste" bracos="oferecer" />
      <path d={`M ${420 + 285 * 1.15} ${1040 - 180 * 1.15} Q ${(760 + xLia) / 2} ${780 + Math.sin(t * 3) * 10} ${xLia - 120} 860`} stroke="#8d5524" strokeWidth={12} fill="none" strokeLinecap="round" />
      <ellipse cx={420 - 50} cy={1040 - 300 * 1.15 + lagrima * 60} rx={10} ry={15} fill="#4cc9f0" opacity={1 - lagrima} />
      <Pessoa x={xLia} y={1040} s={1.15} {...LIA} humor={t > tCeda ? 'triste' : 'preocupada'} olhar={-1} />
      <g transform={`translate(420 200) scale(${pop(t, momento(fala, 'magoado') - 0.1)})`}>
        <Cartao x={0} y={0} texto="se mostra magoado" tamanho={50} />
      </g>
      <g transform={`translate(1350 200) scale(${pop(t, tCeda - 0.1)})`}>
        <Cartao x={0} y={0} texto="o outro cede" tamanho={50} cor={cores.amarelo} />
      </g>
      <g transform={`translate(900 420) scale(${pop(t, momento(fala, 'sem precisar') - 0.1)})`}>
        <Cartao x={0} y={0} texto="sem pedir nada" tamanho={44} rotacao={-4} />
      </g>
    </Cena>
  );
};

export const S3Saudavel: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tErro = momento(fala, 'erro real');
  return (
    <Cena fundo="#b7e4c7" dur={dur(fala)} decoracao="#2d6a4f">
      <g transform={`translate(640 300) scale(${pop(t, momento(fala, 'culpa saudável'))})`}>
        <Cartao x={0} y={0} texto="CULPA SAUDÁVEL" tamanho={76} cor="#fff" corTexto="#2d6a4f" />
      </g>
      <path
        d="M 900 360 Q 1150 360 1250 560"
        stroke={C}
        strokeWidth={14}
        fill="none"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - entre(t, tErro - 0.4, tErro + 0.1)}
      />
      {/* vaso quebrado */}
      <g transform="translate(1340 680)">
        <path d="M -80 -100 L -20 -110 L -40 -20 L -10 60 L -90 60 Q -120 -20 -80 -100 Z" fill="#e76f51" stroke={C} strokeWidth={7} />
        <path d="M 10 -110 L 80 -100 Q 120 -20 90 60 L 20 60 L 40 -10 Z" fill="#e76f51" stroke={C} strokeWidth={7} transform={`rotate(${entre(t, 0.2, 0.6, 0, 18)} 90 60)`} />
      </g>
      <Check x={1540} y={520} s={1.5} visivel={entre(t, tErro, tErro + 0.4)} />
      <g transform={`translate(1340 860) scale(${pop(t, tErro - 0.1)})`}>
        <Cartao x={0} y={-30} texto="erro real" tamanho={52} cor={cores.amarelo} />
      </g>
    </Cena>
  );
};

export const S3Fabricada: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tempos = ['aparece', 'toda vez', 'vida própria'].map((p) => momento(fala, p));
  const alvo = [
    {x: 1100, icone: <Grupo s={1.1} />},
    {x: 1400, icone: <Livro s={1} cor="#4361ee" />},
    {x: 1700, icone: <Estrela s={1} />},
  ];
  return (
    <Cena fundo="#e5989b" dur={dur(fala)} decoracao="#fff">
      {/* fábrica de culpa */}
      <g transform="translate(330 300)">
        <rect x={-180} y={-120} width={360} height={260} rx={20} fill="#6c757d" stroke={C} strokeWidth={9} />
        <rect x={-130} y={-230} width={70} height={120} fill="#495057" stroke={C} strokeWidth={8} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={-95 + Math.sin(t * 2 + i) * 20} cy={-260 - ((t * 60 + i * 40) % 120)} r={26 + i * 6} fill="#adb5bd" opacity={0.7} />
        ))}
        <text y={30} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={44} fill="#fff">
          CULPA S.A.
        </text>
      </g>
      <g transform={`translate(330 610) scale(${pop(t, momento(fala, 'fabricada') - 0.1)})`}>
        <Cartao x={0} y={0} texto="CULPA FABRICADA" tamanho={52} cor={cores.amarelo} />
      </g>
      {alvo.map((a, i) => (
        <g key={i} transform={`translate(${a.x} 300)`}>
          <circle r={95} fill="#fff" stroke={C} strokeWidth={7} />
          {a.icone}
        </g>
      ))}
      {tempos.map((m, i) => {
        const y = interpolate(t, [m, m + 0.5], [-100, 560], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return t > m ? <PesoCulpa key={i} x={alvo[i].x} y={y} s={1.1} /> : null;
      })}
      <Pessoa x={entre(t, 0, dur(fala), 820, 900)} y={1040} s={1} {...LIA} humor={t > tempos[1] ? 'triste' : 'preocupada'} olhar={1} />
    </Cena>
  );
};
