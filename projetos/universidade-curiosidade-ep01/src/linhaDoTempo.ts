// Linha do tempo do gancho (cenas 01–04), tirada do roteiro de direção.
//
// Enquanto não há narração final, o tempo de cada palavra é ESTIMADO
// (sílabas + pausas de pontuação dentro da janela da cena). Quando a voz do
// Azure chegar, `src/voz/palavras.json` recebe os tempos reais (WordBoundary)
// e tudo que está amarrado a palavras (animações, legendas) se move sozinho.
import palavrasReais from "./voz/palavras.json";

export type Palavra = { texto: string; inicio: number; fim: number };
export type Cena = {
  id: string;
  inicio: number;
  fim: number;
  narracao: string;
  destaques: string[];
};

export const CENAS: Cena[] = [
  {
    id: "c01",
    inicio: 0,
    fim: 7.1,
    narracao:
      "Em 1964, um garoto de dezessete anos decidiu não dormir. Nem um cochilo. Por onze dias seguidos.",
    destaques: ["1964", "onze dias"],
  },
  {
    id: "c02",
    inicio: 7.1,
    fim: 15.4,
    narracao:
      "No quarto dia, ele já via coisas que não estavam lá… e jurava ser um jogador famoso de futebol americano.",
    destaques: ["quarto dia", "coisas que não estavam lá"],
  },
  {
    id: "c03",
    inicio: 15.4,
    fim: 28.6,
    narracao:
      "Hoje, vamos ver o que acontece com o seu corpo, dia a dia, se você ficar sete dias sem dormir. E, spoiler: lá pelo terceiro dia, o cérebro começa a pregar peças.",
    destaques: ["sete dias sem dormir", "terceiro dia"],
  },
  { id: "c04", inicio: 28.6, fim: 31.6, narracao: "", destaques: [] },
];

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
  if (/^\d+$/.test(w)) return w.length * 2.8; // "mil novecentos e sessenta e quatro"
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

const reais = palavrasReais as unknown as Palavra[];

export const PALAVRAS: Record<string, Palavra[]> = Object.fromEntries(
  CENAS.map((c) => [
    c.id,
    reais.length
      ? reais.filter((p) => p.inicio >= c.inicio && p.inicio < c.fim)
      : estimaCena(c),
  ]),
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
