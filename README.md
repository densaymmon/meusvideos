# meusvideos

Skills do Claude Code para criar vídeos. Abra este repositório numa sessão do Claude Code e as skills de `.claude/skills/` ficam disponíveis (ex.: `/remotion-create`, `/gbro-collage-broll`).

## Skills instaladas

| Skill | Origem | Para que serve | Requisitos |
|---|---|---|---|
| `remotion-*` (13 skills) | Remotion (oficial, v4.0.543) | Vídeos com React: criar, animar, legendas, mapas, pré-visualizar, renderizar | Node.js; ffmpeg para renderizar |
| `gbro-collage-broll` | gbro-collage-broll | Frase curta → vídeo de 5 s em colagem de papel (via Gemini) | Python ≥ 3.10, ffmpeg, `GEMINI_API_KEY`, venv com `google-genai >= 2.10.0` |
| `claude-animation-base` | ClaudeAnimationBase (MIT) | Animação 2D pintada à mão do personagem Clawd (p5.js + p5.brush) → MP4 | Node.js, Chrome/Chromium, ffmpeg |

### Remotion
`remotion-best-practices` (ponto de partida), `remotion-create`, `remotion-markup`, `remotion-studio`, `remotion-render`, `remotion-captions`, `remotion-maps`, `remotion-multimedia`, `remotion-interactivity`, `remotion-saas`, `remotion-docs`, `remotion-upgrade`, `remotion-license`.

### gbro-collage-broll
Instruções em chinês (funciona normalmente). Fluxo com duas aprovações antes de gastar: 1) ideia visual, 2) imagem estática, 3) vídeo no Gemini (`gemini-omni-flash-preview`).
Observações:
- Feita para o Codex: a etapa da imagem usa uma ferramenta de imagem que o Claude Code não tem; forneça a imagem manualmente nessa etapa.
- `scripts/upload_file.py` chama um `prep_video.py` que não veio no pacote (só no envio interativo de vídeo grande).
- Configuração: `python3 -m venv ~/hyperframes-projects/.omni-venv && ~/hyperframes-projects/.omni-venv/bin/python -m pip install --upgrade "google-genai>=2.10.0" "httpx[socks]"`; verifique com `bash .claude/skills/gbro-collage-broll/scripts/check_setup.sh`.

### claude-animation-base
O pacote original é um projeto modelo, não uma skill; foi criado um `SKILL.md` que aponta para o kit em `.claude/skills/claude-animation-base/kit/`. Copie o kit para `projetos/<nome>/`, leia `ANIMATION_GUIDE.md`, rode `npm install` e `node render.mjs --clip --out=out/video.mp4`. Sem placa de vídeo use `--soft-gl` (lento no efeito aquarela).

## Revisão de segurança (12/11/2026)
Todo o código foi lido antes da instalação. Nenhum comando oculto, código ofuscado, envio de dados a servidores desconhecidos ou leitura de credenciais além das declaradas.
- **Remotion:** só documentação e exemplos (`.md`, `.tsx`, `.json`) e dois scripts de preparo de dados geográficos.
- **gbro-collage-broll:** os scripts só acessam o Google (`generativelanguage.googleapis.com`; o script alternativo do Veo usa Vertex AI e `gcloud storage`). A `GEMINI_API_KEY` vai apenas para o Google, no cabeçalho `x-goog-api-key`. Usa `ffmpeg` localmente.
- **claude-animation-base:** roda Chrome sem tela (`puppeteer-core`) e `ffmpeg` localmente; dependências (`p5`, `p5.brush`, `puppeteer-core`) vêm todas do npm oficial; a página de prévia carrega uma fonte do Google Fonts.

Ao atualizar uma skill, revise o código novo do mesmo jeito antes de fazer commit.
