import narracao from './narracao.json';

export type Fala = {
  id: string;
  texto: string;
  duracao: number;
  pausa: number;
};

export type Deixa = Fala & {inicio: number; fim: number};

/** Silêncio antes da primeira fala e depois da última (segundos). */
export const RESPIRO_INICIAL = 0;
export const RESPIRO_FINAL = 0.4;
/** A voz entra um pouco depois do corte da cena. */
export const ATRASO_VOZ = 0.12;

const montar = (): Deixa[] => {
  let t = RESPIRO_INICIAL;
  return (narracao as Fala[]).map((f) => {
    const d = {...f, inicio: t, fim: t + f.duracao + f.pausa};
    t = d.fim;
    return d;
  });
};

export const deixas = montar();
export const DURACAO_TOTAL = deixas[deixas.length - 1].fim + RESPIRO_FINAL;

export const deixa = (id: string): Deixa => {
  const d = deixas.find((x) => x.id === id);
  if (!d) throw new Error(`Fala não encontrada: ${id}`);
  return d;
};

/** Segundo (relativo ao início da cena) em que a palavra é dita, estimado pela posição no texto. */
export const momento = (fala: Fala, palavra: string): number => {
  const i = fala.texto.toLowerCase().indexOf(palavra.toLowerCase());
  return ATRASO_VOZ + (fala.duracao * Math.max(0, i)) / fala.texto.length;
};
