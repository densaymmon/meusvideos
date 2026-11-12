import React from 'react';
import {interpolate} from 'remotion';
import {Cena} from '../arte/Cena';
import {
  Amuleto,
  BalaoFala,
  Bandeira,
  Camisa,
  Celular,
  Check,
  Coracao,
  Estrela,
  Grafico,
  Grupo,
  Livro,
  Lupa,
  Mudo,
  Pessoinha,
  Triangulo,
  Volante,
} from '../arte/Icones';
import {CartaoEstudo, Citacoes, dur, FraseChave, IconesNaHora, type P, TituloSinal} from '../arte/Modelos';
import {Brilhos, Cafe, Cartao, Nuvem, useSegundos} from '../arte/Objetos';
import {LIA, Pessoa, RAFA} from '../arte/Pessoa';
import {nunito} from '../fontes';
import {momento} from '../tempo';
import {cores, entre, pop} from '../util';

const C = cores.tinta;

/* ───────────── GANCHO DE RETENÇÃO ───────────── */

const NOITE = '#26315f';

/** Labirinto visto de cima, com um ponto de luz no centro. */
const Labirinto: React.FC<{t: number; escala: number}> = ({t, escala}) => {
  const paredes: string[] = [];
  const N = 9;
  const passo = 90;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const h = (i * 7 + j * 13 + i * j) % 5;
      const x = (i - N / 2) * passo;
      const y = (j - N / 2) * passo;
      if (i === 4 && j === 4) continue;
      if (h < 2) paredes.push(`M ${x} ${y} L ${x + passo} ${y}`);
      else if (h < 4) paredes.push(`M ${x} ${y} L ${x} ${y + passo}`);
    }
  }
  const pulso = 1 + 0.2 * Math.sin(t * 4);
  return (
    <g transform={`translate(960 470) scale(${escala})`}>
      <rect x={-405} y={-405} width={810} height={810} rx={12} fill="#1a2247" stroke="#8ecae6" strokeWidth={10} />
      <path d={paredes.join(' ')} stroke="#8ecae6" strokeWidth={10} strokeLinecap="round" />
      <circle cx={0 + passo / 2 - 45} cy={0 + passo / 2 - 45} r={60 * pulso} fill="#ffd23f" opacity={0.3} />
      <circle cx={0 + passo / 2 - 45} cy={0 + passo / 2 - 45} r={22} fill="#ffd23f" />
    </g>
  );
};

export const RPensando: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tF = momento(fala, 'fácil');
  return (
    <Cena fundo={NOITE} dur={dur(fala)} decoracao="#8ecae6">
      <Pessoa x={560} y={1040} s={1.25} {...LIA} humor="feliz" olhar={1} />
      <circle cx={800} cy={420} r={18} fill="#fff" opacity={pop(t, 0.1)} />
      <circle cx={860} cy={350} r={28} fill="#fff" opacity={pop(t, 0.2)} />
      <g transform={`translate(1250 280) scale(${pop(t, 0.3, 0.5)})`}>
        <Nuvem x={0} y={0} s={3.2} />
        <text y={-10} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={54} fill={C}>
          "tá, mas isso é
        </text>
        <text y={60} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={54} fill={C}>
          fácil de perceber"
        </text>
      </g>
      <Check x={1600} y={450} s={1.4} visivel={entre(t, tF, tF + 0.4)} />
    </Cena>
  );
};

export const RDiferentes: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  return (
    <Cena fundo={NOITE} dur={dur(fala)} decoracao="#8ecae6">
      <Labirinto t={t} escala={entre(t, 0, dur(fala), 2.4, 0.95)} />
    </Cena>
  );
};

export const RAtaques: React.FC<P> = ({fala}) => (
  <FraseChave
    fala={fala}
    fundo={NOITE}
    decoracao="#8ecae6"
    y={360}
    linhas={[
      {texto: 'Não parecem', palavra: 'não parecem', tamanho: 100},
      {texto: 'ATAQUES', palavra: 'ataques', cor: cores.coral, tamanho: 150, risca: 'ataques'},
    ]}
  />
);

export const RAmor: React.FC<P> = ({fala}) => (
  <IconesNaHora
    fala={fala}
    fundo={NOITE}
    decoracao="#8ecae6"
    titulo={{texto: 'PARECEM…', palavra: 'parecem amor'}}
    itens={[
      {palavra: 'amor', rotulo: 'amor', icone: <Amuleto tipo="mascara-amor" s={1.3} />},
      {palavra: 'silêncio', rotulo: 'silêncio', icone: <Amuleto tipo="mascara-silencio" s={1.3} />},
      {palavra: 'cuidado', rotulo: 'cuidado', icone: <Amuleto tipo="mascara-cuidado" s={1.3} />},
    ]}
  />
);

export const RSetimo: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const t7 = momento(fala, 'sétimo');
  return (
    <Cena fundo={NOITE} dur={dur(fala)} decoracao="#8ecae6">
      <g transform={`translate(960 430) scale(${pop(t, t7 - 0.2, 0.5)}) rotate(${Math.sin(t * 2) * 5})`}>
        <circle r={240} fill="#ffd23f" stroke={C} strokeWidth={12} />
        <text y={110} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={320} fill={C}>
          7
        </text>
      </g>
      <g transform={`translate(960 780) scale(${pop(t, momento(fala, 'sem dar nome') - 0.1)})`}>
        <Cartao x={0} y={0} texto="sem nome?" tamanho={60} />
      </g>
      <Brilhos x={960} y={430} raio={320} qtd={8} visivel={entre(t, t7, t7 + 0.4)} />
    </Cena>
  );
};

export const RFim: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  return (
    <Cena fundo={NOITE} dur={dur(fala)} decoracao="#8ecae6">
      <Labirinto t={t * 2} escala={entre(t, 0, dur(fala), 0.95, 1.6)} />
      <g transform={`translate(960 150) scale(${pop(t, 0.1)})`}>
        <Cartao x={0} y={0} texto="FICA ATÉ O FIM" tamanho={72} cor={cores.amarelo} />
      </g>
    </Cena>
  );
};

/* ───────────── SINAL 4 — REFORÇO INTERMITENTE ───────────── */

const S4 = '#2a9d8f';

export const S4Titulo: React.FC<P> = ({fala}) => <TituloSinal fala={fala} n={4} linhas={['O carinho', 'imprevisível']} fundo={S4} />;

const Sol: React.FC<{x: number; y: number; s?: number; t: number}> = ({x, y, s = 1, t}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${t * 20})`}>
    {new Array(10).fill(0).map((_, i) => (
      <rect key={i} x={-10} y={-150} width={20} height={50} rx={10} fill="#ff9f1c" transform={`rotate(${i * 36})`} />
    ))}
    <circle r={90} fill="#ffd23f" stroke={C} strokeWidth={8} />
  </g>
);

const Tags: React.FC<{t: number; itens: [string, number][]; y?: number}> = ({t, itens, y = 160}) => (
  <>
    {itens.map(([texto, m], i) => (
      <g key={texto} transform={`translate(${560 + i * 400} ${y}) scale(${pop(t, m - 0.1)})`}>
        <Cartao x={0} y={0} texto={texto} tamanho={52} rotacao={i % 2 ? 4 : -4} />
      </g>
    ))}
  </>
);

export const S4Bom: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  return (
    <Cena fundo="#ffd166" dur={dur(fala)} decoracao="#fff">
      <Sol x={1700} y={180} t={t} />
      <Pessoa x={700} y={1040} s={1.2} {...RAFA} humor="feliz" olhar={1} />
      <Pessoa x={1250} y={1040} s={1.2} {...LIA} humor="feliz" olhar={-1} fasePiscar={20} />
      {[0, 1, 2].map((i) => (
        <Coracao key={i} x={960 + (i - 1) * 60} y={520 - ((t * 140 + i * 60) % 220)} s={0.5} />
      ))}
      <Tags t={t} itens={[['incrível', momento(fala, 'incrível')], ['atenciosa', momento(fala, 'atenciosa')], ['presente', momento(fala, 'presente')]]} />
    </Cena>
  );
};

export const S4Frio: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tNao = momento(fala, 'não existisse');
  return (
    <Cena fundo="#a9d6e5" dur={dur(fala)} decoracao="#fff">
      {new Array(16).fill(0).map((_, i) => (
        <Brilhos key={i} x={(i * 241) % 1920} y={((t * 120 + i * 113) % 1100) - 20} raio={0} qtd={1} />
      ))}
      <g>
        <Pessoa x={700} y={1040} s={1.2} {...RAFA} roupa="#457b9d" humor="neutro" olhar={1} />
      </g>
      <g opacity={entre(t, tNao - 0.2, tNao + 0.6, 1, 0.25)}>
        <Pessoa x={1250} y={1040} s={1.2} {...LIA} humor="triste" olhar={-1} fasePiscar={20} />
      </g>
      <Tags t={t} itens={[['fria', momento(fala, 'fria')], ['distante', momento(fala, 'distante')], ['invisível', tNao]]} />
    </Cena>
  );
};

export const S4Semana: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const dias = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  const tempo = [1, 0, 0, 1, 0, 0, 0];
  return (
    <Cena fundo="#e9f5db" dur={dur(fala)} decoracao={S4}>
      {dias.map((d, i) => (
        <g key={i} transform={`translate(${420 + i * 180} 230) scale(${pop(t, 0.1 + i * 0.18)})`}>
          <rect x={-75} y={-100} width={150} height={190} rx={18} fill="#fff" stroke={C} strokeWidth={7} />
          <text y={-50} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={40} fill={C}>
            {d}
          </text>
          {tempo[i] ? <Sol x={0} y={30} s={0.35} t={t} /> : <Nuvem x={0} y={30} s={0.45} cor="#8d99ae" />}
        </g>
      ))}
      <Pessoa x={760} y={1040} s={1.05} {...LIA} humor="confusa" olhar={1} />
      <g transform={`translate(${1150 + Math.sin(t * 2) * 120} 600) scale(${pop(t, 0.8)})`}>
        <Lupa s={1.6} />
      </g>
      <g transform={`translate(1450 760) scale(${pop(t, momento(fala, 'dia bom') - 0.1)})`}>
        <Cartao x={0} y={0} texto="o dia bom volta?" tamanho={50} cor={cores.amarelo} />
      </g>
    </Cena>
  );
};

export const S4Decadas: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tD = momento(fala, 'décadas');
  return (
    <Cena fundo="#caf0f8" dur={dur(fala)} decoracao={S4}>
      <g transform={`translate(560 430) scale(${pop(t, 0)})`}>
        <Livro x={-60} y={40} s={1.6} cor="#2a9d8f" />
        <Livro x={70} y={60} s={1.4} cor="#e76f51" />
      </g>
      <g transform={`translate(1350 430) scale(${pop(t, 0.3)})`}>
        <Grafico s={2.4} />
      </g>
      <line x1={400} y1={760} x2={400 + 1120 * entre(t, tD - 0.3, tD + 0.6)} y2={760} stroke={C} strokeWidth={12} strokeLinecap="round" />
      <g opacity={entre(t, tD - 0.3, tD)}>
        <Cartao x={400} y={760} texto="1950" tamanho={46} />
      </g>
      <g opacity={entre(t, tD + 0.4, tD + 0.7)}>
        <Cartao x={1520} y={760} texto="hoje" tamanho={46} cor={cores.amarelo} />
      </g>
    </Cena>
  );
};

export const S4Skinner: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tImp = momento(fala, 'imprevisível');
  const tConst = momento(fala, 'constantes');
  return (
    <CartaoEstudo
      fala={fala}
      fundo="#b7e4c7"
      ano="1957"
      topo="ESTUDO · ANOS 1950"
      autores={['Ferster & Skinner']}
      fonte={['Schedules of Reinforcement', '(1957)']}
      corLivro={S4}
    >
      <line x1={1060} y1={620} x2={1800} y2={620} stroke={C} strokeWidth={8} />
      <rect x={1150} y={620 - entre(t, tConst - 0.3, tConst + 0.4, 0, 150)} width={200} height={entre(t, tConst - 0.3, tConst + 0.4, 0, 150)} fill="#8ecae6" stroke={C} strokeWidth={6} />
      <rect x={1500} y={620 - entre(t, tImp - 0.1, tImp + 1.2, 0, 360)} width={200} height={entre(t, tImp - 0.1, tImp + 1.2, 0, 360)} fill="#ff9f1c" stroke={C} strokeWidth={6} />
      <text x={1250} y={680} textAnchor="middle" fontFamily={nunito} fontWeight={800} fontSize={40} fill={C}>
        constante
      </text>
      <text x={1600} y={680} textAnchor="middle" fontFamily={nunito} fontWeight={800} fontSize={40} fill={C}>
        imprevisível
      </text>
      <g opacity={entre(t, momento(fala, 'mais tempo'), momento(fala, 'mais tempo') + 0.3)}>
        <Cartao x={1430} y={160} texto="dura mais tempo" tamanho={44} cor={cores.amarelo} />
      </g>
    </CartaoEstudo>
  );
};

const SIMBOLOS = ['coracao', 'frio'] as const;
const Simbolo: React.FC<{tipo: (typeof SIMBOLOS)[number]}> = ({tipo}) =>
  tipo === 'coracao' ? (
    <Coracao s={1.1} />
  ) : (
    <g>
      <circle r={50} fill="#8ecae6" stroke={C} strokeWidth={6} />
      <circle cx={-16} cy={-8} r={6} fill={C} />
      <circle cx={16} cy={-8} r={6} fill={C} />
      <path d="M -18 22 L 18 22" stroke={C} strokeWidth={6} strokeLinecap="round" />
    </g>
  );

export const S4Caca: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const finais: (typeof SIMBOLOS)[number][] = ['coracao', 'frio', 'coracao'];
  const alavanca = interpolate(t, [0, 0.3, 0.6], [0, 50, 0], {extrapolateRight: 'clamp'});
  return (
    <Cena fundo="#6a4c93" dur={dur(fala)} decoracao="#ffd23f">
      <g transform={`translate(960 470) scale(${pop(t, 0, 0.5)})`}>
        <rect x={-420} y={-330} width={840} height={620} rx={50} fill="#ff9f1c" stroke={C} strokeWidth={12} />
        <rect x={-360} y={-280} width={720} height={90} rx={20} fill="#d00000" stroke={C} strokeWidth={8} />
        <text y={-215} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={60} fill="#fff">
          CAÇA-NÍQUEL
        </text>
        {[0, 1, 2].map((i) => {
          const para = 0.9 + i * 0.4;
          const idx = t < para ? Math.floor(t * 12 + i) % 2 : SIMBOLOS.indexOf(finais[i]);
          return (
            <g key={i} transform={`translate(${(i - 1) * 230} 20)`}>
              <rect x={-100} y={-130} width={200} height={260} rx={20} fill="#fff" stroke={C} strokeWidth={8} />
              <g transform={`translate(0 ${t < para ? ((t * 900) % 60) - 30 : 0})`}>
                <Simbolo tipo={SIMBOLOS[idx]} />
              </g>
            </g>
          );
        })}
        <path d={`M 420 -40 L 520 ${-200 + alavanca * 4}`} stroke={C} strokeWidth={18} strokeLinecap="round" />
        <circle cx={520} cy={-200 + alavanca * 4} r={40} fill="#d00000" stroke={C} strokeWidth={8} />
      </g>
    </Cena>
  );
};

/** Fio dourado que vira corrente. */
const FioCorrente: React.FC<{t: number; virar: number; x1: number; x2: number; y: number}> = ({virar, x1, x2, y}) => {
  const elos = 8;
  return (
    <>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="#ffd23f" strokeWidth={8} opacity={1 - virar} />
      {new Array(elos).fill(0).map((_, i) => {
        const x = x1 + ((i + 0.5) / elos) * (x2 - x1);
        const vis = interpolate(virar, [i / elos, (i + 1) / elos], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return <ellipse key={i} cx={x} cy={y} rx={30} ry={18} fill="none" stroke="#adb5bd" strokeWidth={10 * vis} opacity={vis} transform={`rotate(${i % 2 ? 0 : 90} ${x} ${y})`} />;
      })}
    </>
  );
};

export const S4Dutton: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tA = momento(fala, 'alternância');
  const virar = entre(t, tA, momento(fala, 'apego') + 0.5);
  return (
    <CartaoEstudo
      fala={fala}
      fundo="#ffd6a5"
      ano="1981"
      topo="ESTUDO · 1981 e 1993"
      autores={['Dutton & Painter']}
      fonte={['Traumatic bonding', 'Violence and Victims, 8(2)']}
      corLivro="#e76f51"
    >
      <Pessoinha x={1150} y={430} s={2.4} cor="#2ec4b6" />
      <Pessoinha x={1720} y={430} s={2.4} cor="#ff6b6b" />
      <FioCorrente t={t} virar={virar} x1={1220} x2={1650} y={440} />
      <g transform={`translate(1435 700) scale(${pop(t, momento(fala, 'vínculo') - 0.1)})`}>
        <Cartao x={0} y={0} texto="vínculo traumático" tamanho={50} cor={cores.amarelo} />
      </g>
    </CartaoEstudo>
  );
};

export const S41993: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const t75 = momento(fala, 'setenta');
  const n = Math.floor(entre(t, t75 - 0.2, t75 + 1, 0, 75));
  const tMeses = momento(fala, 'meses depois');
  return (
    <CartaoEstudo
      fala={fala}
      fundo="#ffd6a5"
      ano="1993"
      autores={['Dutton & Painter']}
      fonte={['75 mulheres', 'Violence and Victims, 8(2)']}
      corLivro="#e76f51"
    >
      {new Array(75).fill(0).map((_, i) => (
        <Pessoinha key={i} x={1080 + (i % 15) * 48} y={230 + Math.floor(i / 15) * 80} s={0.55} cor={i < n ? '#e76f51' : '#ffffff'} opacidade={i < n ? 1 : 0.5} />
      ))}
      <g transform={`translate(1420 690) scale(${pop(t, t75 - 0.1)})`}>
        <Cartao x={0} y={0} texto="75 mulheres" tamanho={50} />
      </g>
      <g transform={`translate(1420 800) scale(${pop(t, tMeses - 0.1)})`}>
        <Cartao x={0} y={0} texto="ainda ligadas, meses depois" tamanho={40} cor={cores.amarelo} />
      </g>
    </CartaoEstudo>
  );
};

export const S4Aprendizado: React.FC<P> = ({fala}) => (
  <FraseChave
    fala={fala}
    fundo={S4}
    y={330}
    linhas={[
      {texto: 'FRAQUEZA', palavra: 'fraqueza', cor: '#ced4da', tamanho: 130, risca: 'fraqueza'},
      {texto: 'APRENDIZADO', palavra: 'aprendizado', cor: cores.amarelo, tamanho: 150},
    ]}
  />
);

/* ───────────── SINAL 5 — TRIANGULAÇÃO ───────────── */

const S5 = '#4895ef';

export const S5Titulo: React.FC<P> = ({fala}) => <TituloSinal fala={fala} n={5} linhas={['Uma terceira', 'pessoa na conversa']} fundo={S5} />;

export const S5Frases: React.FC<P> = ({fala}) => {
  const palavras = ['minha ex', 'até a sua', 'fulano'];
  return (
    <Citacoes
      fala={fala}
      fundo="#a2d2ff"
      reacao="triste"
      quem="neutro"
      citacoes={[
        {texto: ['"Minha ex nunca', 'reclamava disso."'], palavra: palavras[0]},
        {texto: ['"Até a sua irmã acha', 'que você exagera."'], palavra: palavras[1]},
        {texto: ['"Fulano me entende', 'melhor."'], palavra: palavras[2]},
      ]}
      extra={(t) =>
        palavras.map((p, i) => (
          <Pessoinha key={p} x={120 + i * 140} y={360 + (i % 2) * 60} s={2.2} cor="#ffffff" opacidade={0.55 * entre(t, momento(fala, p), momento(fala, p) + 0.4)} />
        ))
      }
    />
  );
};

export const S5Plateia: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tP = momento(fala, 'competindo');
  return (
    <Cena fundo="#3a0ca3" dur={dur(fala)} decoracao="#a2d2ff">
      <path d="M 960 0 L 1300 900 L 620 900 Z" fill="#fff3b0" opacity={0.25} />
      <ellipse cx={960} cy={900} rx={360} ry={60} fill="#fff3b0" opacity={0.4} />
      <Pessoa x={960} y={940} s={1.05} {...LIA} humor={t > tP ? 'preocupada' : 'neutro'} />
      {[180, 420, 660, 1260, 1500, 1740].map((x, i) => {
        const vis = pop(t, tP + i * 0.1);
        return (
          <g key={x} transform={`translate(${x} ${1000 - vis * 60})`} opacity={vis > 0 ? 1 : 0}>
            <Pessoinha s={3} cor="#14213d" />
            <g transform={`translate(0 -190) scale(${vis})`}>
              <rect x={-55} y={-45} width={110} height={90} rx={10} fill="#fff" stroke={C} strokeWidth={6} />
              <text y={22} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={60} fill="#d00000">
                {[3, 5, 2, 4, 1, 3][i]}
              </text>
            </g>
          </g>
        );
      })}
      <g transform={`translate(960 130) scale(${pop(t, momento(fala, 'plateia') - 0.1)})`}>
        <Cartao x={0} y={0} texto="competindo com uma plateia" tamanho={54} cor={cores.amarelo} />
      </g>
    </Cena>
  );
};

export const S5Bowen: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tTri = momento(fala, 'triângulo');
  return (
    <CartaoEstudo
      fala={fala}
      fundo="#bde0fe"
      ano=""
      topo="TEORIA · BOWEN"
      autores={['Murray Bowen']}
      fonte={['Teoria dos sistemas familiares', 'The Bowen Center: "Triangles"']}
      corLivro="#3a0ca3"
    >
      <g transform={`translate(1430 420) scale(${3.2 * pop(t, tTri - 0.1)})`}>
        <circle r={90} fill="#3a0ca3" />
        <Triangulo />
      </g>
      <g transform={`translate(1430 760) scale(${pop(t, momento(fala, 'menor unidade') - 0.1)})`}>
        <Cartao x={0} y={0} texto="menor unidade estável" tamanho={46} cor={cores.amarelo} />
      </g>
    </CartaoEstudo>
  );
};

/** Duas pessoas em tensão; uma terceira é puxada para dentro. */
const Triangulacao: React.FC<{t: number; terceira: number; alivio: number; fora: number}> = ({t, terceira, alivio, fora}) => {
  const A = {x: 620, y: 600};
  const B = {x: 1300, y: 600};
  const cx = interpolate(fora, [0, 1], [960, 1660]);
  const cy = interpolate(terceira, [0, 1], [-200, 220]) + fora * 60;
  const zig = new Array(9)
    .fill(0)
    .map((_, i) => `${A.x + 90 + i * ((B.x - A.x - 180) / 8)},${A.y + (i % 2 ? -1 : 1) * 40 * (1 - alivio) * (1 + 0.3 * Math.sin(t * 20))}`)
    .join(' ');
  return (
    <>
      <polyline points={zig} fill="none" stroke={alivio > 0.5 ? '#fff' : '#ff6b6b'} strokeWidth={12} strokeLinejoin="round" />
      <g opacity={terceira * (1 - fora * 0.6)}>
        <line x1={A.x} y1={A.y - 40} x2={cx} y2={cy + 40} stroke="#fff" strokeWidth={8} strokeDasharray="16 14" />
        <line x1={B.x} y1={B.y - 40} x2={cx} y2={cy + 40} stroke="#fff" strokeWidth={8} strokeDasharray="16 14" />
        <Pessoinha x={cx} y={cy} s={2.6} cor="#ffd23f" />
      </g>
      <Pessoinha x={A.x} y={A.y} s={2.6} cor="#2ec4b6" />
      <Pessoinha x={B.x} y={B.y} s={2.6} cor="#ff6b6b" />
    </>
  );
};

export const S5Tensao: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tT = momento(fala, 'terceira');
  return (
    <Cena fundo={S5} dur={dur(fala)} decoracao="#fff">
      <Triangulacao t={t} terceira={entre(t, tT - 0.1, tT + 0.8)} alivio={0} fora={0} />
      <g transform={`translate(960 830) scale(${pop(t, momento(fala, 'tensão') - 0.1)})`}>
        <Cartao x={0} y={-40} texto="tensão" tamanho={56} cor="#fff" corTexto="#d00000" />
      </g>
    </Cena>
  );
};

export const S5Alivia: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tAl = momento(fala, 'alivia');
  const tFora = momento(fala, 'de fora');
  return (
    <Cena fundo={S5} dur={dur(fala)} decoracao="#fff">
      <Triangulacao t={t} terceira={1} alivio={entre(t, tAl - 0.1, tAl + 0.5)} fora={entre(t, tFora - 0.3, tFora + 0.6)} />
      <g transform={`translate(560 180) scale(${pop(t, momento(fala, 'não resolve') - 0.1)})`}>
        <Cartao x={0} y={0} texto="não resolve nada" tamanho={50} rotacao={-4} />
      </g>
      <g transform={`translate(1600 520) scale(${pop(t, tFora)})`}>
        <Cartao x={0} y={0} texto="de fora" tamanho={50} cor={cores.amarelo} />
      </g>
    </Cena>
  );
};

export const S5Regua: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const marca = 520 - entre(t, 0, dur(fala), 0, 330);
  const tTer = momento(fala, 'terceiro');
  return (
    <Cena fundo="#bde0fe" dur={dur(fala)} decoracao={S5}>
      <rect x={1060} y={90} width={150} height={850} rx={12} fill="#ffd23f" stroke={C} strokeWidth={8} />
      {new Array(17).fill(0).map((_, i) => (
        <line key={i} x1={1060} y1={130 + i * 48} x2={1060 + (i % 2 ? 40 : 70)} y2={130 + i * 48} stroke={C} strokeWidth={6} />
      ))}
      <line x1={1000} y1={marca} x2={1270} y2={marca} stroke="#d00000" strokeWidth={12} strokeLinecap="round" />
      <Pessoa x={760} y={1040} s={1.1} {...LIA} humor="triste" olhar={1} />
      <g opacity={entre(t, tTer - 0.1, tTer + 0.4, 0, 0.7)}>
        <Pessoinha x={1450} y={500} s={3.2} cor="#ffffff" />
      </g>
      <g transform={`translate(1500 830) scale(${pop(t, momento(fala, 'suficiente') - 0.2)})`}>
        <Cartao x={0} y={0} texto="nunca suficiente" tamanho={52} cor="#fff" corTexto="#d00000" />
      </g>
    </Cena>
  );
};

/* ───────────── SINAL 6 — METAS QUE SE MOVEM ───────────── */

const S6 = '#70a83a';

export const S6Titulo: React.FC<P> = ({fala}) => <TituloSinal fala={fala} n={6} linhas={['A linha de chegada', 'que muda de lugar']} fundo={S6} />;

export const S6Melhora: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tM = momento(fala, 'melhora');
  const tC = momento(fala, 'consegue');
  const tO = momento(fala, 'outra exigência');
  const itens: [string, number, number][] = [
    ['responder rápido', tM - 0.3, tC],
    ['mudar o tom', tO - 0.1, 99],
  ];
  return (
    <Cena fundo="#d9ed92" dur={dur(fala)} decoracao={S6}>
      <g transform={`translate(1150 470) scale(${pop(t, 0)})`}>
        <rect x={-330} y={-340} width={660} height={700} rx={30} fill="#fff" stroke={C} strokeWidth={9} />
        <rect x={-110} y={-370} width={220} height={70} rx={20} fill="#adb5bd" stroke={C} strokeWidth={7} />
        {itens.map(([txt, ap, ok], i) => (
          <g key={txt} transform={`translate(-260 ${-180 + i * 150})`} opacity={entre(t, ap, ap + 0.3)}>
            <rect x={0} y={-40} width={80} height={80} rx={14} fill="#fff" stroke={C} strokeWidth={7} />
            {t > ok ? <path d="M 15 0 L 35 22 L 70 -25" stroke="#2d6a4f" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
            <text x={110} y={16} fontFamily={nunito} fontWeight={800} fontSize={48} fill={C}>
              {txt}
            </text>
          </g>
        ))}
        <g transform="translate(-260 120)" opacity={entre(t, tO + 0.6, tO + 0.9)}>
          <text x={0} y={16} fontFamily={nunito} fontWeight={800} fontSize={48} fill="#adb5bd">
            …e mais uma coisa
          </text>
        </g>
      </g>
      <Pessoa x={420} y={1040} s={1.1} {...LIA} humor={t > tO ? 'preocupada' : 'feliz'} olhar={1} />
    </Cena>
  );
};

export const S6Exemplos: React.FC<P> = ({fala}) => (
  <IconesNaHora
    fala={fala}
    fundo="#d9ed92"
    decoracao={S6}
    itens={[
      {palavra: 'respondeu', rotulo: 'responder rápido', icone: <Celular s={1.3} />, risca: 'agora é o tom'},
      {palavra: 'agora é o tom', rotulo: 'o tom', icone: <BalaoFala s={1.3} />, risca: 'agora é a roupa'},
      {palavra: 'agora é a roupa', rotulo: 'a roupa', icone: <Camisa s={1.3} />},
    ]}
  />
);

export const S6Nome: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const gol = 1050 + Math.max(0, t - 0.6) * 90;
  const bola = 300 + Math.min(t, 6) * 140;
  return (
    <Cena fundo="#55a630" dur={dur(fala)} decoracao="#fff">
      <rect x={0} y={780} width={1920} height={8} fill="#fff" opacity={0.7} />
      <g transform={`translate(${gol} 780)`}>
        <path d="M 0 0 L 0 -360 L 380 -360 L 380 0" fill="none" stroke="#fff" strokeWidth={18} />
        <path d="M 0 -360 L 60 -300 L 380 -300 M 60 -300 L 60 0" stroke="#fff" strokeWidth={6} opacity={0.6} />
      </g>
      <g transform={`translate(${bola} 730) rotate(${t * 300})`}>
        <circle r={50} fill="#fff" stroke={C} strokeWidth={7} />
        <polygon points="0,-18 17,-6 11,15 -11,15 -17,-6" fill={C} />
      </g>
      <g transform={`translate(960 150) scale(${pop(t, momento(fala, 'moving') - 0.1)})`}>
        <Cartao x={0} y={0} texto="MOVING THE GOALPOSTS" tamanho={64} cor={cores.amarelo} />
      </g>
      <g transform={`translate(960 290) scale(${pop(t, momento(fala, 'mover') - 0.1)})`}>
        <Cartao x={0} y={0} texto="mover as traves do gol" tamanho={46} />
      </g>
    </Cena>
  );
};

export const S6Diagnostico: React.FC<P> = ({fala}) => (
  <IconesNaHora
    fala={fala}
    fundo="#d9ed92"
    decoracao={S6}
    itens={[
      {
        palavra: 'diagnóstico',
        rotulo: 'diagnóstico clínico',
        icone: (
          <g>
            <rect x={-50} y={-60} width={100} height={120} rx={12} fill="#fff" stroke={C} strokeWidth={6} />
            <path d="M 0 -30 L 0 30 M -30 0 L 30 0" stroke="#d00000" strokeWidth={16} strokeLinecap="round" />
          </g>
        ),
        risca: 'diagnóstico',
      },
      {palavra: 'descrição', rotulo: 'descrição de comportamento', icone: <Lupa s={1.3} />, cor: '#d8f3dc'},
    ]}
  />
);

export const S6Stark: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tI = momento(fala, 'episódio isolado');
  const tP = momento(fala, 'padrão contínuo');
  const n = Math.floor(entre(t, tP - 0.2, tP + 1.2, 1, 14));
  return (
    <CartaoEstudo
      fala={fala}
      fundo="#d9ed92"
      ano="2007"
      topo="LIVRO · 2007"
      autores={['Evan Stark']}
      fonte={['Coercive Control', 'Oxford University Press']}
      corLivro="#2b9348"
    >
      <line x1={1050} y1={450} x2={1820} y2={450} stroke={C} strokeWidth={10} strokeLinecap="round" />
      {new Array(n).fill(0).map((_, i) => (
        <circle key={i} cx={1080 + i * 55} cy={450} r={20} fill="#d00000" opacity={t > tI - 0.2 ? 1 : 0} />
      ))}
      <g transform={`translate(1430 300) scale(${pop(t, tI - 0.1) * (1 - entre(t, tP - 0.3, tP))})`}>
        <Cartao x={0} y={0} texto="episódio isolado?" tamanho={46} />
      </g>
      <g transform={`translate(1430 600) scale(${pop(t, tP)})`}>
        <Cartao x={0} y={0} texto="padrão contínuo" tamanho={52} cor={cores.amarelo} />
      </g>
      <g transform={`translate(1430 740) scale(${pop(t, momento(fala, 'vida cotidiana') - 0.1)})`}>
        <Cartao x={0} y={0} texto="na vida cotidiana" tamanho={40} />
      </g>
    </CartaoEstudo>
  );
};

export const S6Cansativo: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const linha = 1150 + t * 60;
  const pulo = Math.abs(Math.sin(t * 9)) * 30;
  return (
    <Cena fundo="#d9ed92" dur={dur(fala)} decoracao={S6}>
      <rect x={0} y={860} width={1920} height={40} fill="#bc6c25" />
      <rect x={linha} y={300} width={24} height={580} fill="#fff" stroke={C} strokeWidth={5} />
      <g transform={`translate(${linha + 12} 300)`}>
        <Bandeira x={40} y={0} s={1.2} />
      </g>
      <Pessoa x={700} y={1040 - pulo} s={1.05} {...LIA} humor="triste" olhar={1} />
      {[0, 1, 2].map((i) => (
        <line key={i} x1={420 - i * 20} y1={620 + i * 70} x2={520 - i * 20} y2={620 + i * 70} stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.8} />
      ))}
      {/* ampulheta */}
      <g transform={`translate(1650 230) rotate(${Math.floor(t / 2) * 180 + Math.min(1, (t % 2) * 4) * 0})`}>
        <path d="M -60 -90 L 60 -90 L 0 0 L 60 90 L -60 90 L 0 0 Z" fill="#fff" stroke={C} strokeWidth={8} strokeLinejoin="round" />
        <path d={`M -40 ${-70 + (t % 2) * 30} L 40 ${-70 + (t % 2) * 30} L 0 0 Z`} fill="#e9c46a" />
        <path d={`M 0 ${90 - (t % 2) * 30} L ${30 * ((t % 2) / 2 + 0.5)} 90 L ${-30 * ((t % 2) / 2 + 0.5)} 90 Z`} fill="#e9c46a" />
      </g>
      <g transform={`translate(560 170) scale(${pop(t, momento(fala, 'cansativo') - 0.1)})`}>
        <Cartao x={0} y={0} texto="cansativo" tamanho={56} />
      </g>
      <g transform={`translate(1060 170) scale(${pop(t, momento(fala, 'silencioso') - 0.1)})`}>
        <Cartao x={0} y={0} texto="silencioso" tamanho={56} cor={cores.amarelo} />
      </g>
    </Cena>
  );
};

export const S6Pergunta: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tTroca = momento(fala, 'passa a perguntar');
  const some = entre(t, tTroca - 0.2, tTroca + 0.4);
  return (
    <Cena fundo={S6} dur={dur(fala)} decoracao="#fff">
      <Pessoa x={520} y={1040} s={1.2} {...LIA} humor={t > tTroca ? 'triste' : 'neutro'} olhar={1} />
      <g transform={`translate(1200 300) scale(${pop(t, 0.1) * (1 - some * 0.5)})`} opacity={1 - some * 0.85}>
        <Nuvem x={0} y={0} s={2.6} />
        <text y={20} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={62} fill={C}>
          o que eu quero?
        </text>
      </g>
      <g transform={`translate(1300 620) scale(${pop(t, momento(fala, 'agradar') - 0.4)})`}>
        <Nuvem x={0} y={0} s={2.8} cor="#ffd6a5" />
        <text y={20} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={62} fill={C}>
          o que vai agradar?
        </text>
      </g>
    </Cena>
  );
};

/* ───────────── SINAL 7 — SILÊNCIO ───────────── */

const S7 = '#6c757d';

export const S7Titulo: React.FC<P> = ({fala}) => <TituloSinal fala={fala} n={7} linhas={['O silêncio', 'como punição']} fundo={S7} />;

export const S7Calma: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tA = momento(fala, 'acalmar');
  return (
    <Cena fundo="#b7e4c7" dur={dur(fala)} decoracao="#fff">
      <Pessoa x={800} y={1040} s={1.15} {...RAFA} humor="neutro" bracos="oferecer">
        <Cafe x={300} y={-230} s={0.7} />
      </Pessoa>
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={300 + i * 130} cy={((t * 50 + i * 120) % 700) + 100} rx={30} ry={14} fill="#52b788" transform={`rotate(${t * 40 + i * 60} ${300 + i * 130} ${((t * 50 + i * 120) % 700) + 100})`} />
      ))}
      <Check x={1450} y={330} s={1.6} visivel={entre(t, tA, tA + 0.4)} />
      <g transform={`translate(1450 520) scale(${pop(t, tA - 0.1)})`}>
        <Cartao x={0} y={0} texto="um tempo para se acalmar" tamanho={42} />
      </g>
    </Cena>
  );
};

export const S7Dias: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const msgs: [string, number][] = [
    ['Oi?', 0.2],
    ['Tá tudo bem?', momento(fala, 'ignora')],
    ['O que houve?', momento(fala, 'o que houve') - 0.3],
  ];
  const tNada = momento(fala, "'nada'");
  const dia = 1 + Math.min(4, Math.floor(t / 1.8));
  return (
    <Cena fundo="#22223b" dur={dur(fala)} decoracao="#4a4e69">
      {/* relógio girando */}
      <g transform="translate(360 330)">
        <circle r={150} fill="#f2e9e4" stroke={C} strokeWidth={10} />
        <line x1={0} y1={0} x2={0} y2={-110} stroke={C} strokeWidth={10} strokeLinecap="round" transform={`rotate(${t * 720})`} />
        <line x1={0} y1={0} x2={0} y2={-70} stroke={C} strokeWidth={14} strokeLinecap="round" transform={`rotate(${t * 60})`} />
        <Cartao x={0} y={230} texto={`dia ${dia}`} tamanho={50} cor={cores.amarelo} />
      </g>
      {/* celular */}
      <g transform="translate(1180 470)">
        <rect x={-300} y={-420} width={600} height={840} rx={50} fill="#1b1b2f" stroke={C} strokeWidth={8} />
        <rect x={-270} y={-385} width={540} height={770} rx={30} fill="#f8f9fa" />
        {msgs.map(([m, tm], i) => (
          <g key={m} opacity={entre(t, tm, tm + 0.3)} transform={`translate(0 ${-280 + i * 150})`}>
            <rect x={-20} y={-45} width={270} height={80} rx={26} fill="#95d5b2" />
            <text x={0} y={8} fontFamily={nunito} fontWeight={800} fontSize={36} fill={C}>
              {m}
            </text>
            <text x={245} y={68} textAnchor="end" fontFamily={nunito} fontWeight={700} fontSize={24} fill="#6c757d">
              visualizado
            </text>
          </g>
        ))}
        <g opacity={entre(t, tNada - 0.1, tNada + 0.2)} transform="translate(0 200)">
          <rect x={-250} y={-45} width={170} height={80} rx={26} fill="#dee2e6" />
          <text x={-225} y={8} fontFamily={nunito} fontWeight={800} fontSize={36} fill={C}>
            nada.
          </text>
        </g>
      </g>
    </Cena>
  );
};

export const S7Williams: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tEx = momento(fala, 'excluir');
  return (
    <CartaoEstudo
      fala={fala}
      fundo="#c9ada7"
      ano=""
      topo="PESQUISA · PURDUE"
      autores={['Kipling D. Williams']}
      fonte={['Ostracismo', 'Universidade Purdue']}
      corLivro="#5e548e"
    >
      <Pessoinha x={1180} y={420} s={2.2} cor="#ff9f1c" />
      <Pessoinha x={1340} y={400} s={2.2} cor="#b8a1ff" />
      <Pessoinha x={1260} y={360} s={2.2} cor="#ff6b6b" />
      <Pessoinha x={entre(t, tEx - 0.4, tEx + 0.6, 1420, 1720)} y={420} s={2.2} cor="#2ec4b6" opacidade={entre(t, tEx - 0.4, tEx + 0.6, 1, 0.4)} />
      <g transform={`translate(1430 700) scale(${pop(t, momento(fala, 'ostracismo') - 0.1)})`}>
        <Cartao x={0} y={0} texto="ostracismo" tamanho={56} cor={cores.amarelo} />
      </g>
    </CartaoEstudo>
  );
};

export const S7Necessidades: React.FC<P> = ({fala}) => (
  <IconesNaHora
    fala={fala}
    fundo={S7}
    decoracao="#fff"
    titulo={{texto: '4 NECESSIDADES AMEAÇADAS', palavra: 'quatro'}}
    itens={[
      {palavra: 'pertencer', rotulo: 'pertencer', icone: <Grupo s={1.4} />},
      {palavra: 'autoestima', rotulo: 'autoestima', icone: <Estrela s={1.4} />},
      {palavra: 'ter controle', rotulo: 'controle', icone: <Volante s={1.4} />},
      {palavra: 'existência', rotulo: 'existir importa', icone: <Coracao s={1.4} />},
    ]}
  />
);

export const S7Schrodt: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tCobra = momento(fala, 'cobra');
  const tFecha = momento(fala, 'se fecha');
  return (
    <CartaoEstudo
      fala={fala}
      fundo="#c9ada7"
      ano="2014"
      topo="META-ANÁLISE · 2014"
      autores={['Schrodt, Witt', '& Shimkowski']}
      fonte={['74 estudos', 'Communication Monographs, 81(1)']}
      corLivro="#4a4e69"
    >
      <Pessoinha x={1130} y={480} s={2.4} cor="#2ec4b6" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${1170 + i * 40} ${300 - i * 60}) scale(${pop(t, tCobra - 0.2 + i * 0.2) * 0.7})`}>
          <BalaoFala />
        </g>
      ))}
      <g opacity={entre(t, tFecha - 0.2, tFecha + 0.3)}>
        {new Array(5).fill(0).map((_, r) =>
          new Array(2).fill(0).map((__, c) => (
            <rect key={`${r}-${c}`} x={1460 + c * 70 + (r % 2) * 35} y={260 + r * 60} width={70} height={60} fill="#bc4749" stroke={C} strokeWidth={5} />
          )),
        )}
      </g>
      <Pessoinha x={1730} y={480} s={2.4} cor="#ff6b6b" />
      <g transform={`translate(1200 700) scale(${pop(t, tCobra - 0.1)})`}>
        <Cartao x={0} y={0} texto="cobra" tamanho={46} />
      </g>
      <g transform={`translate(1650 700) scale(${pop(t, tFecha - 0.1)})`}>
        <Cartao x={0} y={0} texto="se fecha" tamanho={46} />
      </g>
      <g transform={`translate(1430 820) scale(${pop(t, momento(fala, 'menor satisfação') - 0.1)})`}>
        <Cartao x={0} y={0} texto="menos satisfação" tamanho={40} cor={cores.amarelo} />
      </g>
    </CartaoEstudo>
  );
};

export const S7Paz: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  return (
    <FraseChave
      fala={fala}
      fundo={S7}
      decoracao="#fff"
      y={560}
      linhas={[
        {texto: 'SILÊNCIO', palavra: 'silêncio', tamanho: 140},
        {texto: 'não é paz', palavra: 'não é paz', cor: cores.coral, tamanho: 110},
      ]}
    >
      <Mudo x={960} y={250} s={2.4 * pop(t, 0)} />
    </FraseChave>
  );
};

export const S7Existe: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tQ = momento(fala, 'você só existe');
  const ligado = t < tQ ? 1 : Math.floor((t - tQ) * 1.6) % 2 === 0 ? 0.2 : 1;
  return (
    <Cena fundo="#22223b" dur={dur(fala)} decoracao="#4a4e69">
      <circle cx={760} cy={600} r={420} fill="#fff3b0" opacity={0.15 * ligado} />
      <g opacity={ligado}>
        <Pessoa x={760} y={1040} s={1.2} {...LIA} humor="triste" />
      </g>
      {/* interruptor */}
      <g transform="translate(1480 470)">
        <rect x={-110} y={-170} width={220} height={340} rx={30} fill="#f2e9e4" stroke={C} strokeWidth={9} />
        <rect x={-40} y={-90} width={80} height={180} rx={20} fill="#adb5bd" stroke={C} strokeWidth={7} />
        <rect x={-34} y={ligado > 0.5 ? -84 : 4} width={68} height={80} rx={16} fill={ligado > 0.5 ? '#ffd23f' : '#495057'} />
      </g>
      <g transform={`translate(1300 140) scale(${pop(t, tQ - 0.1)})`}>
        <Cartao x={0} y={0} texto='"você só existe quando eu deixo"' tamanho={44} />
      </g>
    </Cena>
  );
};

