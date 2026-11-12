# 7 sinais de manipulação emocional — vídeo animado

Vídeo em desenho 2D (Remotion) feito a partir do roteiro do canal. Cada frase da narração tem a sua cena ilustrada, e os elementos aparecem no momento em que as palavras são ditas.

## Saídas

| Composição | Formato | Uso | Duração aprox. |
|---|---|---|---|
| `YouTube-Completo` | 1920×1080 | YouTube | 9:03 |
| `Social-Parte1` | 1080×1920 | Reels / Shorts / TikTok (gancho, intro, sinais 1–2) | ~3:00 |
| `Social-Parte2` | 1080×1920 | sinais 3–5 | ~2:55 |
| `Social-Parte3` | 1080×1920 | sinais 6–7, fechamento, CVV | ~2:50 |

Cada parte termina com um gancho para a próxima ("continua na parte 2/3") e começa com uma abertura curta.

## Como renderizar

```bash
npm install
npx remotion render YouTube-Completo out/YouTube-Completo.mp4 --browser-executable=/opt/pw-browsers/chromium
npx remotion render Social-Parte1 out/Social-Parte1.mp4 --browser-executable=/opt/pw-browsers/chromium
```

Prévia: `npm run dev` (Remotion Studio).

## Narração (voz gratuita)

- Voz: [Kokoro](https://github.com/thewh1teagle/kokoro-onnx) (código aberto), voz feminina pt-BR `pf_dora`, velocidade 0,88.
- Texto de cada fala: `ferramentas/falas.json` (`texto` = legenda; `voz` = grafia para a pronúncia de nomes em inglês).
- Gerar/atualizar áudios (só regera o que mudou):
  ```bash
  pip install kokoro-onnx soundfile
  python3 ferramentas/gerar_narracao.py <pasta-com-kokoro-v1.0.onnx-e-voices-v1.0.bin>
  ```

## Estrutura

- `src/roteiro.ts` — qual cena acompanha cada fala e a ordem de cada vídeo.
- `src/cenas/` — cenas ilustradas (gancho, introdução, sinais, fechamento, CVV, CTA e extras das partes).
- `src/arte/` — personagens (Lia, Rafa, Bia), ícones e modelos (título de sinal, cartão de estudo, citações, ícones na hora da palavra).
- `ferramentas/quadros.mjs` — gera um quadro de cada cena para conferência.

## Descrição do YouTube — capítulos (tempos do vídeo renderizado)

```
0:00 Introdução
1:01 1. O excesso no começo (love bombing)
1:55 2. Duvidar da própria memória (gaslighting)
2:55 3. A culpa como ferramenta
4:07 4. O carinho imprevisível (reforço intermitente)
5:17 5. A terceira pessoa (triangulação)
6:00 6. A linha de chegada que muda de lugar
6:47 7. O silêncio como punição
7:45 Não é um gesto, é um padrão
8:09 Onde buscar ajuda (CVV 188)
```
