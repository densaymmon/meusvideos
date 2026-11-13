# Universidade da Curiosidade · Vídeo 1 — "7 dias sem dormir"

Projeto Remotion do episódio. Por enquanto contém o **gancho + vinheta (cenas 01–04, 0:00–0:31.6)**
para aprovar o estilo visual.

## Estilo

Bonecos vetoriais em camadas (SVG) animados em código: as personagens ficam idênticas em todas
as cenas, e piscadas, bico, gestos e legendas são sincronizados por palavra. Paleta, fontes
(Fredoka + Nunito) e regras seguem a seção 3 do roteiro de direção.

## Estrutura

| arquivo | o quê |
|---|---|
| `src/roteiro.json` | texto da narração de cada cena, destaques da legenda e parâmetros da voz |
| `scripts/narracao.py` | gera a narração no Azure Speech → `public/voz/narracao.wav` + `src/voz/cenas.json` + `src/voz/palavras.json` |
| `src/linhaDoTempo.ts` | junta roteiro e tempos; `gatilho(cena, «palavra»)` devolve quando cada animação começa (3 frames antes da palavra) |
| `src/personagens/` | Lumi, Randy, Téo, Cérebro: SVG com props de animação (piscada, bico, braços, capelo…) |
| `src/cenas/` | Cena01…Cena04 e o cenário do quarto (`Quarto.tsx`) em camadas para parallax |
| `src/ui/` | legenda queimada (destaque mostarda + pop 110%) e placas (giz, selo de personagem fictício) |
| `src/Gancho.tsx` | monta as cenas na linha do tempo + legenda |

## Narração

Voz `pt-BR-ThalitaMultilingualNeural` (rate −6%, pitch +1 Hz) gerada por cena, com 0,15 s de respiro antes e
0,35 s depois, juntada em uma faixa a −16 LUFS / −1,5 dBTP. A duração de cada cena passa a ser a da fala real.
Na sessão de nuvem, a chave é injetada pelo proxy; fora dela, defina `AZURE_SPEECH_KEY` (nunca no repositório).

## Comandos

```bash
python3 scripts/narracao.py               # narração (Azure Speech, região eastus)
npm i
npx remotion studio                       # pré-visualizar
npx remotion render Gancho out/gancho.mp4 --browser-executable=/opt/pw-browsers/chromium
npx remotion still Personagens out/personagens.png --browser-executable=/opt/pw-browsers/chromium
```

## Pendências

- Tempos de palavra vêm das pausas reais da fala + sílabas (~0,1 s de precisão). A API REST do Azure não
  devolve WordBoundary e o SDK (que devolve) usa WebSocket, que o proxy da sessão de nuvem não aceita.
- Trilha e efeitos sonoros (tique-taque, whoosh, plins, jingle da vinheta).
