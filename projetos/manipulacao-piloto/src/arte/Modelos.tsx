import React from 'react';
import {nunito} from '../fontes';
import {type Deixa, momento} from '../tempo';
import {cores, entre, pop} from '../util';
import {Cena} from './Cena';
import {IconeSinal, Livro, Riscado} from './Icones';
import {Brilhos, Cartao, useSegundos} from './Objetos';
import {type Humor, LIA, Pessoa, RAFA} from './Pessoa';

export type P = {fala: Deixa};
export const dur = (f: Deixa) => f.duracao + f.pausa;
const C = cores.tinta;

/** Abertura de cada sinal: número, ícone e nome. */
export const TituloSinal: React.FC<P & {n: number; linhas: string[]; fundo: string; decoracao?: string}> = ({
  fala,
  n,
  linhas,
  fundo,
  decoracao,
}) => {
  const t = useSegundos();
  const tNome = momento(fala, ':') + 0.1;
  const tam = Math.min(100, 820 / (Math.max(...linhas.map((l) => l.length)) * 0.56));
  return (
    <Cena fundo={fundo} dur={dur(fala)} decoracao={decoracao}>
      <g transform={`translate(520 470) scale(${pop(t, 0, 0.5)}) rotate(${Math.sin(t * 2) * 4})`}>
        <circle r={230} fill="#fff" stroke={C} strokeWidth={10} />
        <circle r={200} fill={fundo} opacity={0.35} />
        <IconeSinal n={n} s={2.4} />
      </g>
      <g transform={`translate(1040 300) scale(${pop(t, 0.15, 0.4)})`}>
        <rect x={0} y={-70} width={420} height={120} rx={60} fill={C} />
        <text x={210} y={14} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={76} fill="#fff">
          SINAL {n}
        </text>
      </g>
      {linhas.map((l, i) => (
        <text
          key={l}
          x={1040}
          y={480 + i * tam * 1.2}
          fontFamily={nunito}
          fontWeight={900}
          fontSize={tam}
          fill="#fff"
          stroke={C}
          strokeWidth={12}
          paintOrder="stroke"
          opacity={entre(t, tNome + i * 0.2, tNome + i * 0.2 + 0.3)}
          transform={`translate(${entre(t, tNome + i * 0.2, tNome + i * 0.2 + 0.4, 40, 0)} 0)`}
        >
          {l}
        </text>
      ))}
      <Brilhos x={520} y={470} raio={300} qtd={7} visivel={entre(t, 0.4, 0.7)} />
    </Cena>
  );
};

/** Cartão de fonte de um estudo (autor, ano, revista) + ilustração ao lado. */
export const CartaoEstudo: React.FC<
  P & {
    fundo: string;
    ano: string;
    /** Texto da faixa do topo (padrão: "ESTUDO · ano"). */
    topo?: string;
    autores: string[];
    fonte: string[];
    corLivro?: string;
    children?: React.ReactNode;
  }
> = ({fala, fundo, ano, topo, autores, fonte, corLivro = '#4361ee', children}) => {
  const t = useSegundos();
  return (
    <Cena fundo={fundo} dur={dur(fala)}>
      <g transform={`translate(${entre(t, 0, 0.5, -700, 0)} 0)`}>
        <rect x={130} y={150} width={800} height={640} rx={36} fill={C} opacity={0.25} transform="translate(12 14)" />
        <rect x={130} y={150} width={800} height={640} rx={36} fill="#fffdf7" stroke={C} strokeWidth={9} />
        <rect x={130} y={150} width={800} height={130} rx={36} fill={corLivro} stroke={C} strokeWidth={9} />
        <rect x={139} y={240} width={782} height={36} fill={corLivro} />
        <text x={190} y={240} fontFamily={nunito} fontWeight={900} fontSize={64} fill="#fff">
          {topo ?? `ESTUDO · ${ano}`}
        </text>
        <Livro x={850} y={210} s={0.75} cor="#fffdf7" />
        {autores.map((a, i) => (
          <text key={a} x={180} y={370 + i * 66} fontFamily={nunito} fontWeight={900} fontSize={56} fill={C}>
            {a}
          </text>
        ))}
        {fonte.map((f, i) => (
          <text key={f} x={180} y={370 + autores.length * 66 + 40 + i * 52} fontFamily={nunito} fontWeight={700} fontStyle="italic" fontSize={42} fill="#495057">
            {f}
          </text>
        ))}
      </g>
      <g opacity={entre(t, 0.3, 0.7)}>{children}</g>
    </Cena>
  );
};

type Citacao = {texto: string[]; palavra: string; cor?: string};

/** Rafa diz frases (em balões) e a Lia reage. */
export const Citacoes: React.FC<
  P & {fundo: string; citacoes: Citacao[]; reacao?: Humor; quem?: Humor; extra?: (t: number) => React.ReactNode}
> = ({fala, fundo, citacoes, reacao = 'triste', quem = 'bravo', extra}) => {
  const t = useSegundos();
  const t1 = momento(fala, citacoes[0].palavra);
  return (
    <Cena fundo={fundo} dur={dur(fala)}>
      {extra ? extra(t) : null}
      <Pessoa x={330} y={1040} s={1.15} {...RAFA} humor={quem} olhar={1} />
      <Pessoa x={1600} y={1040} s={1.15} {...LIA} humor={t > t1 + 0.6 ? reacao : 'neutro'} olhar={-1} fasePiscar={25} />
      {citacoes.map((c, i) => {
        const m = momento(fala, c.palavra) - 0.05;
        const larg = Math.max(...c.texto.map((l) => l.length)) * 27 + 90;
        const alt = c.texto.length * 58 + 50;
        const y = 150 + i * 200;
        const x = 960 - larg / 2 + (i - 1) * 40;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${pop(t, m, 0.35)})`}>
            <rect x={6} y={8} width={larg} height={alt} rx={30} fill={C} opacity={0.25} />
            <rect width={larg} height={alt} rx={30} fill={c.cor ?? '#fff'} stroke={C} strokeWidth={7} />
            <path d={`M 40 ${alt - 4} L 10 ${alt + 40} L 90 ${alt - 4}`} fill={c.cor ?? '#fff'} stroke={C} strokeWidth={7} strokeLinejoin="round" />
            <rect x={44} y={alt - 12} width={42} height={14} fill={c.cor ?? '#fff'} />
            {c.texto.map((l, j) => (
              <text key={j} x={45} y={68 + j * 58} fontFamily={nunito} fontWeight={800} fontSize={46} fill={C}>
                {l}
              </text>
            ))}
          </g>
        );
      })}
    </Cena>
  );
};

/** Rótulo em cartão que quebra em duas linhas quando não cabe. */
const Rotulo: React.FC<{y: number; texto: string; largMax: number}> = ({y, texto, largMax}) => {
  const cabe = (linhas: string[], tam: number) => Math.max(...linhas.map((l) => l.length)) * tam * 0.58 + 60 <= largMax;
  let linhas = [texto];
  let tam = 48;
  if (!cabe(linhas, tam) && texto.includes(' ')) {
    const meio = texto.length / 2;
    const espacos = [...texto].map((c, i) => (c === ' ' ? i : -1)).filter((i) => i > 0);
    const corte = espacos.reduce((a, b) => (Math.abs(b - meio) < Math.abs(a - meio) ? b : a));
    linhas = [texto.slice(0, corte), texto.slice(corte + 1)];
  }
  while (!cabe(linhas, tam) && tam > 24) tam -= 2;
  const w = Math.max(...linhas.map((l) => l.length)) * tam * 0.58 + 60;
  const h = linhas.length * tam * 1.15 + 34;
  return (
    <g transform={`translate(0 ${y})`}>
      <rect x={-w / 2 + 6} y={-h / 2 + 8} width={w} height={h} rx={22} fill={C} opacity={0.25} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={22} fill="#fff" stroke={C} strokeWidth={6} />
      {linhas.map((l, i) => (
        <text key={i} y={-h / 2 + 17 + tam * 0.9 + i * tam * 1.15} textAnchor="middle" fontFamily={nunito} fontWeight={900} fontSize={tam} fill={C}>
          {l}
        </text>
      ))}
    </g>
  );
};

export type Item = {palavra: string; rotulo: string; icone: React.ReactNode; risca?: string; cor?: string};

/** Ícones que surgem no momento em que cada palavra é dita. */
export const IconesNaHora: React.FC<
  P & {fundo: string; itens: Item[]; decoracao?: string; y?: number; titulo?: {texto: string; palavra: string}; children?: React.ReactNode}
> = ({fala, fundo, itens, decoracao, y = 470, titulo, children}) => {
  const t = useSegundos();
  const n = itens.length;
  const passo = Math.min(560, 1680 / n);
  const r = Math.min(150, passo * 0.42);
  return (
    <Cena fundo={fundo} dur={dur(fala)} decoracao={decoracao}>
      {children}
      {titulo ? (
        <g transform={`translate(960 150) scale(${pop(t, momento(fala, titulo.palavra) - 0.1, 0.4)})`}>
          <Cartao x={0} y={0} texto={titulo.texto} cor={cores.amarelo} tamanho={64} />
        </g>
      ) : null}
      {itens.map((it, i) => {
        const x = 960 + (i - (n - 1) / 2) * passo;
        const m = momento(fala, it.palavra) - 0.1;
        const risco = it.risca ? entre(t, momento(fala, it.risca) + 0.35, momento(fala, it.risca) + 0.75) : 0;
        return (
          <g key={i} transform={`translate(${x} ${y + Math.sin(t * 2.5 + i) * 8}) scale(${pop(t, m, 0.4)})`}>
            <circle r={r} fill={it.cor ?? '#fff'} stroke={C} strokeWidth={8} />
            <g transform={`scale(${r / 105})`}>{it.icone}</g>
            <Rotulo y={r + 70} texto={it.rotulo} largMax={passo - 30} />
            {it.risca ? <Riscado p={risco} tam={r * 0.8} /> : null}
          </g>
        );
      })}
    </Cena>
  );
};

type Linha = {texto: string; palavra: string; cor?: string; tamanho?: number; risca?: string};

/** Frase de destaque, linha a linha, no ritmo da fala. */
export const FraseChave: React.FC<P & {fundo: string; linhas: Linha[]; decoracao?: string; y?: number; children?: React.ReactNode}> = ({
  fala,
  fundo,
  linhas,
  decoracao,
  y = 300,
  children,
}) => {
  const t = useSegundos();
  return (
    <Cena fundo={fundo} dur={dur(fala)} decoracao={decoracao}>
      {children}
      {linhas.map((l, i) => {
        const m = momento(fala, l.palavra) - 0.1;
        const tam = l.tamanho ?? 110;
        const risco = l.risca ? entre(t, momento(fala, l.risca) + 0.35, momento(fala, l.risca) + 0.7) : 0;
        const larg = l.texto.length * tam * 0.62;
        return (
          <g key={i} transform={`translate(960 ${y + i * (tam * 1.35)}) scale(${pop(t, m, 0.4)})`}>
            <text
              textAnchor="middle"
              y={tam * 0.35}
              fontFamily={nunito}
              fontWeight={900}
              fontSize={tam}
              fill={l.cor ?? '#fff'}
              stroke={C}
              strokeWidth={tam / 9}
              paintOrder="stroke"
            >
              {l.texto}
            </text>
            {l.risca ? (
              <path
                d={`M ${-larg / 2} 0 L ${larg / 2} 0`}
                stroke="#d00000"
                strokeWidth={tam / 6}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - risco}
              />
            ) : null}
          </g>
        );
      })}
    </Cena>
  );
};
