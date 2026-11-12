import React from "react";
import { COR, FONTE_TEXTO, FONTE_TITULO } from "../tema";

/** Placa de giz com moldura de madeira. `escrita` 0…1 revela o texto da esquerda p/ direita (write-on). */
export const PlacaGiz: React.FC<{
  texto: React.ReactNode;
  escrita?: number;
  largura?: number;
  tamanho?: number;
  style?: React.CSSProperties;
}> = ({ texto, escrita = 1, largura = 420, tamanho = 64, style }) => (
  <div
    style={{
      width: largura,
      padding: "22px 30px",
      background: COR.giz,
      border: `12px solid #A8754F`,
      borderRadius: 18,
      boxShadow: `0 0 0 5px ${COR.marinho}, 0 14px 0 rgba(0,0,0,0.25)`,
      ...style,
    }}
  >
    <div
      style={{
        fontFamily: FONTE_TITULO,
        fontWeight: 600,
        fontSize: tamanho,
        color: COR.creme,
        opacity: 0.93,
        textAlign: "center",
        whiteSpace: "nowrap",
        letterSpacing: 2,
        clipPath: `inset(0 ${100 - escrita * 100}% 0 0)`,
        textShadow: "0 0 2px rgba(255,244,227,0.6)",
      }}
    >
      {texto}
    </div>
  </div>
);

/** Selo obrigatório na primeira aparição do Téo. */
export const SeloFicticio: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => (
  <div
    style={{
      fontFamily: FONTE_TEXTO,
      fontWeight: 800,
      fontSize: 26,
      color: COR.marinho,
      background: COR.creme,
      border: `4px solid ${COR.marinho}`,
      borderRadius: 999,
      padding: "8px 22px",
      ...style,
    }}
  >
    Personagem fictício · simulação animada
  </div>
);
