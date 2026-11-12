import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Paleta do roteiro (seção 3 · Identidade visual)
export const COR = {
  marinho: "#1F2A4A",
  roxo: "#5B3F8C",
  pessego: "#F6B99A",
  mostarda: "#E3A83B",
  creme: "#FFF4E3",
  coral: "#E86A5C",
  // apoio (derivadas da paleta)
  marinhoClaro: "#2B3961",
  roxoClaro: "#7A5FB0",
  lavanda: "#B9A3E3",
  pessegoEscuro: "#D98E6E",
  ambar: "#E39A3B",
  pele: "#F3C29F",
  peleMorena: "#C68B5E",
  giz: "#2E4A40",
} as const;

export const CONTORNO = {
  stroke: COR.marinho,
  strokeWidth: 6,
  strokeLinejoin: "round",
  strokeLinecap: "round",
} as const;

export const FONTE_TITULO = "Fredoka";
export const FONTE_TEXTO = "Nunito";

const fonte = (
  family: string,
  file: string,
  weight: string,
  style = "normal",
) => loadFont({ family, url: staticFile(`fonts/${file}`), weight, style });

export const fontesProntas = Promise.all([
  fonte(FONTE_TITULO, "fredoka-latin-600-normal.woff2", "600"),
  fonte(FONTE_TITULO, "fredoka-latin-700-normal.woff2", "700"),
  fonte(FONTE_TEXTO, "nunito-latin-700-normal.woff2", "700"),
  fonte(FONTE_TEXTO, "nunito-latin-800-normal.woff2", "800"),
  fonte(FONTE_TEXTO, "nunito-latin-700-italic.woff2", "700", "italic"),
]);
