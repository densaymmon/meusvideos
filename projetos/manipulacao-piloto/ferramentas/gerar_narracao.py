"""Gera a narração (voz gratuita Kokoro, pf_dora) frase a frase.
Uso: python3 ferramentas/gerar_narracao.py <pasta-do-modelo-kokoro>
A pasta deve ter kokoro-v1.0.onnx e voices-v1.0.bin
(github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0).
Saída: public/narracao/<id>.wav e src/narracao.json (durações em segundos)."""
import json, sys, os
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

modelo = sys.argv[1]
VOZ, VELOCIDADE = "pf_dora", 0.88
k = Kokoro(os.path.join(modelo, "kokoro-v1.0.onnx"), os.path.join(modelo, "voices-v1.0.bin"))
falas = json.load(open("ferramentas/falas.json", encoding="utf-8"))
saida = []
for f in falas:
    amostras, sr = k.create(f["texto"], voice=VOZ, speed=VELOCIDADE, lang="pt-br")
    sf.write(f"public/narracao/{f['id']}.wav", amostras, sr)
    saida.append({"id": f["id"], "texto": f["texto"], "duracao": round(len(amostras) / sr, 3), "pausa": f["pausa"]})
    print(f["id"], saida[-1]["duracao"])
json.dump(saida, open("src/narracao.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
