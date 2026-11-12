import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CENAS,
  LEGENDA_CURTA,
  PALAVRAS,
  Palavra,
  indiceDe,
  normaliza,
} from "../linhaDoTempo";
import { COR, FONTE_TEXTO } from "../tema";

// Legendas queimadas: 2 linhas no máximo, terço inferior (y 860–1000),
// palavra-destaque em mostarda com "pop" de 110% por 4 frames quando é falada.

type Bloco = {
  palavras: (Palavra & { destaque: boolean })[];
  inicio: number;
  fim: number;
};

const MAX_CARACTERES = 66; // ~2 linhas a 54 px em 1500 px
const MIN_PARA_VIRGULA = 28;

const montaBlocos = (): Bloco[] => {
  const blocos: Bloco[] = [];
  for (const cena of CENAS) {
    const ws = PALAVRAS[cena.id];
    if (!ws.length) continue;
    const marcadas = new Set<number>();
    for (const d of cena.destaques) {
      const i = indiceDe(cena.id, d);
      d.split(" ").forEach((_, k) => marcadas.add(i + k));
    }
    let atual: Bloco["palavras"] = [];
    const fecha = () => {
      if (atual.length)
        blocos.push({ palavras: atual, inicio: atual[0].inicio - 0.1, fim: 0 });
      atual = [];
    };
    ws.forEach((w, i) => {
      atual.push({ ...w, destaque: marcadas.has(i) });
      const chars = atual.map((p) => p.texto).join(" ").length;
      const proxima = ws[i + 1]?.texto.length ?? 0;
      const fimFrase = /[.?!…:]$/.test(w.texto);
      const virgulaLonga = /,$/.test(w.texto) && chars >= MIN_PARA_VIRGULA;
      if (fimFrase || virgulaLonga || chars + 1 + proxima > MAX_CARACTERES)
        fecha();
    });
    fecha();
    // cada bloco fica até o próximo começar (ou até o fim da cena)
    const daCena = blocos.filter(
      (b) => b.inicio >= cena.inicio - 0.2 && b.fim === 0,
    );
    daCena.forEach((b, k) => {
      b.fim =
        k + 1 < daCena.length
          ? daCena[k + 1].inicio
          : Math.min(cena.fim, b.palavras[b.palavras.length - 1].fim + 0.6);
    });
  }
  return blocos;
};

const BLOCOS = montaBlocos();

const textoLegenda = (w: string) => {
  const base = normaliza(w);
  const curta = LEGENDA_CURTA[base];
  return curta
    ? w.replace(new RegExp(w.replace(/[^\p{L}\d]/gu, ""), "u"), curta)
    : w;
};

export const Legenda: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const bloco = BLOCOS.find((b) => t >= b.inicio && t < b.fim);
  if (!bloco) return null;
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 1080 - 1000,
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          textAlign: "center",
          fontFamily: FONTE_TEXTO,
          fontWeight: 800,
          fontSize: 54,
          lineHeight: 1.22,
          color: COR.creme,
          // contorno marinho para ler em qualquer fundo
          textShadow: [
            `0 4px 0 ${COR.marinho}`,
            `3px 0 0 ${COR.marinho}`,
            `-3px 0 0 ${COR.marinho}`,
            `0 -3px 0 ${COR.marinho}`,
            `0 3px 0 ${COR.marinho}`,
            `3px 3px 0 ${COR.marinho}`,
            `-3px 3px 0 ${COR.marinho}`,
            `3px -3px 0 ${COR.marinho}`,
            `-3px -3px 0 ${COR.marinho}`,
            `0 8px 18px rgba(31,42,74,0.45)`,
          ].join(","),
        }}
      >
        {bloco.palavras.map((w, i) => {
          const dt = t - w.inicio;
          const popAtivo = w.destaque && dt >= 0 && dt < 4 / fps;
          return (
            <React.Fragment key={i}>
              <span
                style={{
                  display: "inline-block",
                  color: w.destaque ? COR.mostarda : COR.creme,
                  transform: `scale(${popAtivo ? 1.1 : 1})`,
                  opacity: dt >= -0.1 ? 1 : 0.55,
                }}
              >
                {textoLegenda(w.texto)}
              </span>{" "}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
