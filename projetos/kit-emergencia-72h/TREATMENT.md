# TREATMENT — "Kit 72 h"

Estilo: **Instruction Manual Art** (`instruction-manual`). Vertical 1080×1920, 30 fps, ~30 s. Narração em português (Kokoro `pf_dora`, offline) + legendas grandes queimadas na tela e `.srt`.

Tema: a orientação da Defesa Civil Nacional (6/11/2026) para cada família montar um kit para 72 horas — e o esclarecimento de que é **prevenção, não alarme**. Fatos e fontes: `FACTS.md`.

## 1. Três estruturas candidatas

1. **Lista que enche a mochila.** Uma mochila vazia aberta; cada passo um grupo de itens voa pela linha pontilhada e cai dentro dela, amarelo → branco. Termina com a mochila fechada ao lado da porta.
2. **Faça / não faça primeiro.** Abre num quadro ✗/✓ (carrinho de supermercado transbordando ✗ / uma mochila ✓), depois mergulha no ✓ e monta a mochila.
3. **Contagem de 72 h.** Um relógio 72 → 0 dividido em três dias, cada dia mostrando água e comida consumidas.

**Escolha: 1 com a virada de 2** — o vídeo abre direto na mochila aberta com o "72h" impresso (gancho visual em 1 s, o tema em uma imagem), depois um quadro faça/não faça curto responde ao pânico da notícia ("sem estocar"), e a câmera atravessa o ✓ para a montagem. A 3 é abstrata demais para 30 s de redes sociais.

Abertura: a mochila **amarela** cai na página (é o objeto "novo"). Final: a página inteira (todos os passos) e **um último item fica amarelo**: a seta de rotação "6 meses" — a revisão, a única coisa que continua depois que o kit está pronto.

## 2. Logline e arco

Uma mochila vazia vira um kit de 72 horas em cinco passos de manual — calma, sem pânico.

- Setup: mochila vazia + "72h"; a notícia (Defesa Civil recomenda).
- Virada: ✗ carrinho lotado / ✓ uma mochila — prevenção, não alarme.
- Desenvolvimento: água → comida → luz e rádio → remédios e documentos.
- Final: mochila fechada junto à porta; recuo para a página inteira; seta "6 meses" amarela.

## 3. Benchmark

- **Cartões de segurança de avião** — aprender: ícones sem rosto, sinais ✗/✓, uma ação por quadro, legível sem texto. Não pegar: layout, cores ou figuras de nenhuma companhia.
- **Manuais de montagem de móveis desmontáveis** — aprender: caixa de peças com contagem ("3×"), setas planas isométricas, lupa de detalhe. Não pegar: nenhuma marca, código de produto ou figura.

## 4. Lista de planos (1080×1920, câmera 2D sobre uma folha longa em coluna única)

| # | t (s) | Enquadramento | Movimento | Duração | Por quê |
|---|---|---|---|---|---|
| 1 | 0.0–4.6 | Médio: mochila aberta ocupando ~45 % da altura, "72h" impresso em cima | push lento (1.0→1.12) | 4.6 | gancho: o objeto e o número em 1 s |
| 2 | 4.6–8.6 | Quadro faça/não faça, travado | tilt para baixo até o quadro, travado | 4.0 | julgamento: responde ao pânico |
| 3 | 8.6–9.2 | Push através da célula ✓ | push rápido (whip) | 0.6 | movimento nativo: entra no jeito certo |
| 4 | 9.2–12.4 | Passo 1 — água: 3 garrafas + caixa de peças "3×" voam para a mochila | pan lateral curto | 3.2 | o item mais importante primeiro |
| 5 | 12.4–15.8 | Passo 2 — comida: latas, barras, abridor | tilt para o próximo passo (número entra primeiro) | 3.4 | progresso |
| 6 | 15.8–19.2 | Passo 3 — lanterna, rádio, pilhas, carregador | tilt | 3.4 | progresso |
| 7 | 19.2–23.0 | Passo 4 — remédios + documentos; **lupa** sobre o fecho do saco com mão pressionando | tilt + push na lupa | 3.8 | detalhe: impermeável |
| 8 | 23.0–26.2 | Passo 5 — mochila fechada desliza pela seta até ao lado da porta | tilt | 3.2 | consequência: lugar certo |
| 9 | 26.2–30.0 | Página inteira; a seta circular "6 meses" fica amarela | pull back (zoom-out) e segura | 3.8 | resumo + última peça amarela |

Movimentos: push, tilt, whip/push-through, pan, push na lupa, pull back (≥ 4). Plano-assinatura: a passagem pelo ✓ e o recuo final mostrando a página.

## 5. Beat sheet / narração

| t | Fala (TTS) | Legenda |
|---|---|---|
| 0.4 | A Defesa Civil recomenda: tenha em casa um kit para setenta e duas horas. | A Defesa Civil recomenda: tenha em casa um kit para 72 horas. |
| 5.0 | É prevenção, não alarme. Sem pânico, e sem estocar. | É prevenção, não alarme. Sem pânico e sem estocar. |
| 9.4 | Água: dois litros por pessoa, por dia. | Água: 2 litros por pessoa, por dia. |
| 12.7 | Comida que não vai ao fogo, e um abridor de latas. | Comida que não vai ao fogo e um abridor de latas. |
| 16.1 | Lanterna, rádio, pilhas e carregador. | Lanterna, rádio, pilhas e carregador. |
| 19.5 | Remédios, receitas e documentos, num saco impermeável. | Remédios, receitas e documentos num saco impermeável. |
| 23.3 | Deixe a mochila perto da porta. | Deixe a mochila perto da porta. |
| 26.5 | E revise tudo a cada seis meses. | E revise tudo a cada 6 meses. |

Os tempos finais seguem as durações reais do TTS (o `timeline` é gerado a partir de `voice/dur.json`).

## 6. Mapa de cues

- 100 BPM (batida 0,6 s), compasso 4/4. Marimba + glockenspiel + pizzicato, leve.
- Cada peça que pousa = uma nota de glockenspiel subindo no acorde (C maior → F → G).
- 4.6: música para seco no ✗ (silêncio de ~0,5 s), carimbo do ✗; ✓ com carimbo + nota.
- 8.6: whoosh do push-through, música volta no tempo 1.
- 26.2: música cai para quase silêncio; 28.4 um único sino quando a seta fica amarela.

## 7. Som

| Seção | Ambiência | Foley | Música |
|---|---|---|---|
| Abertura | quarto de papel (ruído rosa bem baixo) | mochila pousando (thump macio), papel | marimba entra no 1 |
| Faça/não faça | idem | carimbo ✗, carimbo ✓ | pausa seca antes do ✗ (silêncio 1) |
| Passos 1–4 | idem | whoosh curto por peça, clique ao pousar, plástico (garrafa), lata (metal), clique do fecho | marimba + glock, nota por peça |
| Passo 5 | idem | zíper, deslize, thump | pizzicato descendo |
| Final | quase silêncio (silêncio 2) | lápis/papel no recuo | sino único |

J-cut: o whoosh do push-through começa antes do corte; L-cut: o zíper atravessa a transição para o recuo.

## 8. Tipografia

- Na página: só números de passo (Inter 700) e contagens ("3×", "6 L", "72h", "199 · 193" no rodapé) — impressos no papel, movendo-se com ele.
- Título impresso como rodapé de manual: "KIT DE EMERGÊNCIA · 72 H".
- Legendas: só português, Inter 600 ~52 px (maior que o 38 px do estilo, por ser vertical para celular), canto inferior esquerdo, barra amarela de 10 px à esquerda, base cor de papel. Área de legenda reservada (y > 1500) — nada importante passa por ali.
- Sem logotipo nem brasão da Defesa Civil (apenas o nome na narração/legenda, como fonte).
