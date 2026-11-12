# meusvideos

Repositório de criação de vídeos. As skills ficam em `.claude/skills/` e são carregadas automaticamente pelo Claude Code ao abrir este repositório.

## Regras
- Cada vídeo novo vai em `projetos/<nome>/`. Não edite os arquivos das skills para fazer um vídeo; copie o que precisar para a pasta do projeto.
- Vídeos renderizados (`*.mp4`, `out/`) e `node_modules/` não são versionados (ver `.gitignore`).
- Nunca coloque chaves de API (ex.: `GEMINI_API_KEY`) em arquivos do repositório. Use variável de ambiente ou o cofre de credenciais do ambiente.
- A skill `gbro-collage-broll` gera custo na conta Google da `GEMINI_API_KEY`: siga as aprovações da skill (ideia → imagem → vídeo) e só gere vídeo após o usuário confirmar.
- Este repositório não tem relação com o app `minhaconfeitaria` (Lovable); não copie nada daqui para lá.
