// Linha do tempo do gancho (cenas 01–04).
//
// O texto vem de `roteiro.json`. Os tempos vêm da narração gerada por
// `scripts/narracao.py` (`voz/cenas.json` e `voz/palavras.json`). Sem narração,
// usa a estimativa do roteiro de direção e distribui as palavras por sílabas.
// Tudo que está amarrado a palavras (animações, legendas) segue esses tempos.
import roteiro from "./roteiro.json";
import cenasReais from "./voz/cenas.json";
import palavrasReais from "./voz/palavras.json";

export type Palavra = { texto: string; inicio: number; fim: number };
export type Cena = {
  id: string;
  inicio: number;
  fim: number;
  narracao: string;
  destaques: string[];
};

const tempos = cenasReais as Record<string, { inicio: number; fim: number }>;
export const TEM_NARRACAO = Object.keys(tempos).length > 0;

export const CENAS: Cena[] = roteiro.cenas.map((c) => ({
  id: c.id,
  narracao: c.narracao,
  destaques: c.destaques,
  inicio: TEM_NARRACAO ? tempos[c.id].inicio : c.estimativa[0],
  fim: TEM_NARRACAO ? tempos[c.id].fim : c.estimativa[1],
}));

export const DURACAO_TOTAL = CENAS[CENAS.length - 1].fim;

// Forma curta na legenda (a voz lê por extenso; a legenda mostra o número)
export const LEGENDA_CURTA: Record<string, string> = {
  dezessete: "17",
  onze: "11",
  sete: "7",
  quarto: "4º",
};

export const normaliza = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, "");

const silabas = (w: string) => {
  const nums = w.replace(/\W/g, "");
  if (/^\d+$/.test(nums)) return nums.length * 2.8; // "mil novecentos e sessenta e quatro"
  const g = normaliza(w).match(/[aeiouy]+/g);
  return Math.max(1, g ? g.length : 1);
};

const pausaDepois = (w: string) => {
  if (/…$|\.\.\.$/.test(w)) return 0.5;
  if (/[.?!]$/.test(w)) return 0.35;
  if (/[:;]$/.test(w)) return 0.22;
  if (/,$/.test(w)) return 0.15;
  return 0;
};

const estimaCena = (c: Cena): Palavra[] => {
  const ws = c.narracao.split(/\s+/).filter(Boolean);
  if (!ws.length) return [];
  const ini = c.inicio + 0.12;
  const fim = c.fim - 0.35;
  const pausas = ws.slice(0, -1).reduce((a, w) => a + pausaDepois(w), 0);
  const totalSil = ws.reduce((a, w) => a + silabas(w), 0);
  const porSil = (fim - ini - pausas) / totalSil;
  let t = ini;
  return ws.map((w) => {
    const d = silabas(w) * porSil;
    const p: Palavra = { texto: w, inicio: t, fim: t + d };
    t += d + pausaDepois(w);
    return p;
  });
};

const reais = palavrasReais as unknown as Record<string, Palavra[]>;

export const PALAVRAS: Record<string, Palavra[]> = Object.fromEntries(
  CENAS.map((c) => [c.id, TEM_NARRACAO ? (reais[c.id] ?? []) : estimaCena(c)]),
);

/** Índice da primeira palavra da expressão dentro da cena. */
export const indiceDe = (cenaId: string, expressao: string): number => {
  const ws = PALAVRAS[cenaId].map((p) => normaliza(p.texto));
  const alvo = normaliza(expressao).split(" ").filter(Boolean);
  for (let i = 0; i + alvo.length <= ws.length; i++) {
    if (alvo.every((a, k) => ws[i + k] === a)) return i;
  }
  throw new Error(
    `Gatilho «${expressao}» não está na narração da cena ${cenaId}`,
  );
};

/**
 * Segundo (relativo ao início da cena) em que a animação do gatilho «expressão»
 * deve começar: 3 frames antes da palavra, como pede o roteiro
 * ("o olho chega junto com o ouvido").
 */
export const gatilho = (
  cenaId: string,
  expressao: string,
  fps = 30,
): number => {
  const cena = CENAS.find((c) => c.id === cenaId)!;
  const p = PALAVRAS[cenaId][indiceDe(cenaId, expressao)];
  return p.inicio - cena.inicio - 3 / fps;
};
