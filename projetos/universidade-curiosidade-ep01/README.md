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
| `src/linhaDoTempo.ts` | cenas (tempo, narração, destaques) e `gatilho(cena, «palavra»)`, que devolve quando cada animação começa (3 frames antes da palavra) |
| `src/voz/palavras.json` | tempos reais de cada palavra (vazio = tempos estimados). Recebe o WordBoundary do Azure |
| `src/personagens/` | Lumi, Randy, Téo, Cérebro: SVG com props de animação (piscada, bico, braços, capelo…) |
| `src/cenas/` | Cena01…Cena04 e o cenário do quarto (`Quarto.tsx`) em camadas para parallax |
| `src/ui/` | legenda queimada (destaque mostarda + pop 110%) e placas (giz, selo de personagem fictício) |
| `src/Gancho.tsx` | monta as cenas na linha do tempo + legenda |

## Comandos

```bash
npm i
npx remotion studio                       # pré-visualizar
npx remotion render Gancho out/gancho.mp4 --browser-executable=/opt/pw-browsers/chromium
npx remotion still Personagens out/personagens.png --browser-executable=/opt/pw-browsers/chromium
```

## Pendências

- Narração final (Azure Speech, voz `pt-BR-ThalitaMultilingualNeural`, rate −6%, pitch +1 Hz) com
  tempos de palavra → `src/voz/palavras.json` e ajuste dos tempos das cenas pelo áudio real.
- Trilha e efeitos sonoros (tique-taque, whoosh, plins, jingle da vinheta).
