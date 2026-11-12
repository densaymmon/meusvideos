"""Gera uma ilustração de cena com o Gemini (imagem), usando a folha de personagens como referência.

Uso: python3 ferramentas/gerar_imagem.py <saida.png> "<descrição da cena>" [--sem-personagens]
A chave é injetada pelo proxy do ambiente (segredo de rede) ou lida de GEMINI_API_KEY.
"""
import base64, json, os, sys, urllib.request

MODELO = os.environ.get("MODELO_IMAGEM", "gemini-3.1-flash-image")
AQUI = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(AQUI, "..", "referencias", "personagens.png")

ESTILO = (
    "2D digital illustration with a soft hand-painted look, clean dark outlines, cozy storybook "
    "animation style, soft shading with gentle gradients, warm lamp light, dusky purple and warm "
    "orange evening palette, cinematic 16:9 composition, no text, no letters, no captions, no watermark."
)
PERSONAGENS = (
    "Keep the characters exactly as in the reference sheet: the young woman with voluminous dark-brown "
    "curly hair and mustard-yellow cable-knit sweater with dark jeans, and the young man with short wavy "
    "dark hair, teal shirt with rolled sleeves and beige trousers. Same faces, proportions and art style."
)


def main():
    saida, cena = sys.argv[1], sys.argv[2]
    com_ref = "--sem-personagens" not in sys.argv
    partes = []
    if com_ref:
        partes.append({"inline_data": {"mime_type": "image/png", "data": base64.b64encode(open(REF, "rb").read()).decode()}})
    partes.append({"text": f"{cena}\n\nStyle: {ESTILO}" + (f"\n{PERSONAGENS}" if com_ref else "")})
    corpo = {
        "contents": [{"parts": partes}],
        "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9"}},
    }
    cab = {"Content-Type": "application/json"}
    if os.environ.get("GEMINI_API_KEY"):
        cab["x-goog-api-key"] = os.environ["GEMINI_API_KEY"]
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{MODELO}:generateContent",
        data=json.dumps(corpo).encode(), headers=cab,
    )
    try:
        resp = json.load(urllib.request.urlopen(req, timeout=300))
    except urllib.error.HTTPError as e:
        sys.exit(f"erro {e.code}: {e.read().decode()[:500]}")
    for c in resp.get("candidates", []):
        for p in c.get("content", {}).get("parts", []):
            dado = p.get("inline_data") or p.get("inlineData")
            if dado:
                open(saida, "wb").write(base64.b64decode(dado["data"]))
                print("ok", saida)
                return
    sys.exit("sem imagem na resposta: " + json.dumps(resp)[:500])


if __name__ == "__main__":
    main()
