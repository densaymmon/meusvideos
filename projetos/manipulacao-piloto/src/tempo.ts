import narracao from './narracao.json';

export type Fala = {
  id: string;
  texto: string;
  duracao: number;
  pausa: number;
  bloco: string;
};

export type Deixa = Fala & {inicio: number; fim: number};

/** Silêncio depois da última fala (segundos). */
export const RESPIRO_FINAL = 0.4;
/** A voz entra um pouco depois do corte da cena. */
export const ATRASO_VOZ = 0.12;

export const falas = narracao as Fala[];

const porId = (id: string): Fala => {
  const f = falas.find((x) => x.id === id);
  if (!f) throw new Error(`Fala não encontrada: ${id}`);
  return f;
};

/** Ids de todas as falas de um ou mais blocos, na ordem do roteiro. */
export const blocos = (...nomes: string[]) => nomes.flatMap((b) => falas.filter((f) => f.bloco === b).map((f) => f.id));

/**
 * Monta a linha do tempo de um trecho.
 * `fatorPausa` encurta as pausas (usado nas partes para redes sociais).
 */
export const montarTrecho = (ids: string[], fatorPausa = 1): Deixa[] => {
  let t = 0;
  return ids.map((id) => {
    const f = porId(id);
    const pausa = f.pausa * fatorPausa;
    const d = {...f, pausa, inicio: t, fim: t + f.duracao + pausa};
    t = d.fim;
    return d;
  });
};

export const duracaoTrecho = (d: Deixa[]) => d[d.length - 1].fim + RESPIRO_FINAL;

/** Segundo (relativo ao início da cena) em que a palavra é dita, estimado pela posição no texto. */
export const momento = (fala: Fala, palavra: string): number => {
  const i = fala.texto.toLowerCase().indexOf(palavra.toLowerCase());
  if (i < 0) console.warn(`[momento] "${palavra}" não está na fala ${fala.id}`);
  return ATRASO_VOZ + (fala.duracao * Math.max(0, i)) / fala.texto.length;
};
