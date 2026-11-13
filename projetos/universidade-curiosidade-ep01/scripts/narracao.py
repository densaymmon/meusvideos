#!/usr/bin/env python3
"""Gera a narração do vídeo com o Azure Speech e os tempos de cada palavra.

    python3 scripts/narracao.py            # gera tudo (usa cache)
    python3 scripts/narracao.py --refazer  # ignora o cache e pede de novo ao Azure

Lê `src/roteiro.json` e escreve:
  public/voz/narracao.wav   narração única, 48 kHz mono, −16 LUFS, pico −1,5 dBTP
  src/voz/cenas.json        início/fim de cada cena (a cena dura a fala + respiros)
  src/voz/palavras.json     início/fim de cada palavra, por cena

As cenas narradas são geradas num TAKE CONTÍNUO (uma requisição, com uma pausa entre
cenas), para a entonação não "recomeçar" a cada cena; depois a faixa é cortada nas
pausas entre cenas. A faixa passa pelo "tratamento suave" (roteiro.json → voz.tratamento)
antes da normalização de volume.

Tempos de palavra: a API REST não devolve WordBoundary (o SDK precisa de WebSocket),
então as pausas reais da fala são casadas com a pontuação do texto; dentro de cada
trecho entre pausas, as palavras são distribuídas pelas sílabas. Precisão típica: ~0,1 s.

Chave: variável AZURE_SPEECH_KEY. Na sessão de nuvem a chave é injetada pelo proxy,
então o valor da variável pode ser qualquer coisa (padrão: "proxy-injected").
Região: AZURE_SPEECH_REGION (padrão eastus).
"""
import argparse, hashlib, json, os, re, ssl, subprocess, sys, unicodedata, urllib.request, wave
from xml.sax.saxutils import escape

import numpy as np

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000


def caminho(*p):
    return os.path.join(RAIZ, *p)


def normaliza(s):
    s = unicodedata.normalize("NFD", s.lower())
    return re.sub(r"[^a-z0-9 ]", "", "".join(c for c in s if unicodedata.category(c) != "Mn"))


def silabas(w):
    digitos = re.sub(r"\W", "", w)
    if re.fullmatch(r"\d+", digitos):
        return len(digitos) * 2.8
    g = re.findall(r"[aeiouy]+", normaliza(w))
    return max(1, len(g))


def sintetiza(fragmento, voz, refazer):
    """`fragmento` é SSML já escapado (texto + <break/>). Prosódia só se o roteiro pedir
    (as vozes HD soam melhor sem ajuste de rate/pitch)."""
    if voz.get("rate") or voz.get("pitch"):
        fragmento = f'<prosody rate="{voz.get("rate", "0%")}" pitch="{voz.get("pitch", "0Hz")}">{fragmento}</prosody>'
    ssml = (
        f'<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="pt-BR">'
        f'<voice name="{voz["nome"]}">{fragmento}</voice></speak>'
    )
    os.makedirs(caminho("public", "voz", "cache"), exist_ok=True)
    arq = caminho("public", "voz", "cache", hashlib.sha1(ssml.encode()).hexdigest()[:16] + ".wav")
    if refazer or not os.path.exists(arq):
        regiao = os.environ.get("AZURE_SPEECH_REGION", "eastus")
        req = urllib.request.Request(
            f"https://{regiao}.tts.speech.microsoft.com/cognitiveservices/v1",
            data=ssml.encode("utf-8"),
            headers={
                "Content-Type": "application/ssml+xml",
                "X-Microsoft-OutputFormat": "riff-48khz-16bit-mono-pcm",
                "Ocp-Apim-Subscription-Key": os.environ.get("AZURE_SPEECH_KEY", "proxy-injected"),
                "User-Agent": "meusvideos-narracao",
            },
        )
        ctx = ssl.create_default_context(cafile=os.environ.get("SSL_CERT_FILE") or None)
        with urllib.request.urlopen(req, context=ctx, timeout=120) as r:
            open(arq, "wb").write(r.read())
    with wave.open(arq) as w:
        assert w.getframerate() == SR and w.getnchannels() == 1
        return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768


def envelope_db(x, passo=0.01):
    h = int(SR * passo)
    n = len(x) // h
    rms = np.sqrt(np.mean(x[: n * h].reshape(n, h) ** 2, axis=1) + 1e-12)
    return 20 * np.log10(rms), passo


def trechos_de_fala(x):
    """Devolve (inicio_fala, fim_fala, pausas[(ini, fim)]) em segundos."""
    db, p = envelope_db(x)
    limiar = max(-45.0, db.max() - 36)
    fala = db > limiar
    idx = np.flatnonzero(fala)
    ini, fim = idx[0] * p, (idx[-1] + 1) * p
    pausas, k = [], idx[0]
    while k <= idx[-1]:
        if not fala[k]:
            j = k
            while j <= idx[-1] and not fala[j]:
                j += 1
            if (j - k) * p >= 0.09:
                pausas.append((k * p, j * p))
            k = j
        else:
            k += 1
    return ini, fim, pausas


NIVEIS = [(r"[.!?…]$", 3), (r"[:;]$", 2), (r",$", 1)]


def nivel(w):
    return next((n for r, n in NIVEIS if re.search(r, w)), 0)


def tempos_palavras(texto, x):
    """Alinha as palavras às pausas reais, das fronteiras mais fortes (ponto) às mais
    fracas (vírgula), reestimando dentro de cada trecho já fixado."""
    ws = texto.split()
    sil = [silabas(w) for w in ws]
    ini, fim, pausas = trechos_de_fala(x)
    inicios = [0.0] * len(ws)
    fins = {}  # fim real da fala nas palavras seguidas de pausa casada
    casadas = set()

    def relogio(t0, t1):
        """Converte "segundos de fala desde t0" em tempo real, pulando as pausas internas.
        Devolve (função, segundos de fala no trecho)."""
        internas = [(max(a, t0), min(b, t1)) for a, b in pausas if b > t0 and a < t1]
        fala = (t1 - t0) - sum(b - a for a, b in internas)

        def f(s):
            t = t0
            for a, b in internas:
                if t + s <= a:
                    break
                s -= a - t
                t = b
            return t + s

        return f, fala

    def distribui(i0, i1, t0, t1):
        f, fala = relogio(t0, t1)
        total, acc = sum(sil[i0 : i1 + 1]), 0.0
        for i in range(i0, i1 + 1):
            inicios[i] = f(acc)
            acc += fala * sil[i] / total

    def alinha(i0, i1, t0, t1, teto=3):
        quebras = [i for i in range(i0, i1) if 0 < nivel(ws[i]) <= teto]
        if not quebras:
            return distribui(i0, i1, t0, t1)
        forte = max(nivel(ws[i]) for i in quebras)
        f, fala = relogio(t0, t1)
        total = sum(sil[i0 : i1 + 1])
        tolerancia = max(0.5, 0.25 * (t1 - t0))
        cortes, depois_de = [], t0
        for q in (i for i in quebras if nivel(ws[i]) == forte):
            alvo = f(fala * sum(sil[i0 : q + 1]) / total)
            cand = [(abs((a + b) / 2 - alvo), (a, b)) for a, b in pausas if a > depois_de and b < t1]
            if cand:
                d, p = min(cand)
                if d < tolerancia:
                    cortes.append((q, p))
                    depois_de = p[1]
                    casadas.add(q)
        if not cortes:  # nenhuma fronteira deste nível casou: tenta só as mais fracas
            return alinha(i0, i1, t0, t1, forte - 1) if forte > 1 else distribui(i0, i1, t0, t1)
        pi, pt = i0, t0
        for q, (a, b) in cortes:
            fins[q] = a
            alinha(pi, q, pt, a, forte - 1)
            pi, pt = q + 1, b
        alinha(pi, i1, pt, t1, forte)

    alinha(0, len(ws) - 1, ini, fim)
    saida = []
    for i, w in enumerate(ws):
        f = fins.get(i, inicios[i + 1] if i + 1 < len(ws) else fim)
        saida.append({"texto": w, "inicio": round(inicios[i], 3), "fim": round(min(f, inicios[i] + 1.2), 3)})
    total_quebras = sum(1 for w in ws[:-1] if nivel(w))
    return saida, ini, fim, len(casadas), total_quebras


def mede_volume(arq, filtro):
    r = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", arq, "-af", f"{filtro}loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
        capture_output=True, text=True,
    )
    return json.loads(r.stderr[r.stderr.rindex("{"):])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--refazer", action="store_true")
    a = ap.parse_args()
    rot = json.load(open(caminho("src", "roteiro.json")))
    voz, r0, r1 = rot["voz"], rot["respiroInicial"], rot["respiroFinal"]
    narradas = [c for c in rot["cenas"] if c["narracao"]]
    fixas = [c for c in rot["cenas"] if not c["narracao"]]
    assert rot["cenas"][: len(narradas)] == narradas, "as cenas narradas precisam vir antes das sem fala"

    # take contínuo: todas as cenas narradas numa requisição, com pausa entre elas
    pausa = voz.get("pausaEntreCenas", "700ms")
    fragmento = f' <break time="{pausa}"/> '.join(escape(c["narracao"]) for c in narradas)
    x = sintetiza(fragmento, voz, a.refazer)
    texto = " ".join(c["narracao"] for c in narradas)
    ws, ini, fim, ok, tot = tempos_palavras(texto, x)
    print(f"take contínuo: {len(x) / SR:.2f} s · pausas casadas {ok}/{tot}")

    # faixa: respiro inicial + fala contínua + respiro final + cenas sem fala
    desl = r0 - ini
    corpo = x[int(ini * SR) : min(len(x), int((fim + r1) * SR))]
    fim_fala = r0 + len(corpo) / SR
    faixa = [np.zeros(int(r0 * SR), np.float32), corpo]

    cenas, palavras, k = {}, {}, 0
    t = 0.0
    for n, c in enumerate(narradas):
        qtd = len(c["narracao"].split())
        pal = [{**w, "inicio": round(w["inicio"] + desl, 3), "fim": round(w["fim"] + desl, 3)} for w in ws[k : k + qtd]]
        k += qtd
        if n + 1 < len(narradas):
            prox = ws[k]["inicio"] + desl
            fim_cena = pal[-1]["fim"] + min(r1, 0.7 * (prox - pal[-1]["fim"]))
        else:
            fim_cena = fim_fala
        cenas[c["id"]] = {"inicio": round(t, 3), "fim": round(fim_cena, 3)}
        palavras[c["id"]] = pal
        est = c["estimativa"][1] - c["estimativa"][0]
        print(f'{c["id"]}: {fim_cena - t:5.2f} s (estimativa {est:.1f} s)')
        t = fim_cena
    for c in fixas:
        dur = c["duracaoFixa"]
        faixa.append(np.zeros(int(round(dur * SR)), np.float32))
        cenas[c["id"]] = {"inicio": round(t, 3), "fim": round(t + dur, 3)}
        palavras[c["id"]] = []
        t += dur

    bruto = caminho("public", "voz", "cache", "_bruto.wav")
    with wave.open(bruto, "wb") as w:
        w.setnchannels(1), w.setsampwidth(2), w.setframerate(SR)
        w.writeframes((np.clip(np.concatenate(faixa), -1, 1) * 32767).astype(np.int16).tobytes())
    trat = voz.get("tratamento", "")
    trat = trat + "," if trat else ""
    m = mede_volume(bruto, trat)
    filtro = (
        f"{trat}loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
        f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
    )
    saida = caminho("public", "voz", "narracao.wav")
    # -t: o eco do tratamento não pode esticar a faixa além da linha do tempo
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", bruto, "-af", filtro, "-ar", str(SR), "-ac", "1", "-t", f"{t:.3f}", saida], check=True)
    os.remove(bruto)
    f = mede_volume(saida, "")
    json.dump(cenas, open(caminho("src", "voz", "cenas.json"), "w"), ensure_ascii=False, indent=1)
    json.dump(palavras, open(caminho("src", "voz", "palavras.json"), "w"), ensure_ascii=False, indent=1)
    print(f"total {t:.2f} s · {f['input_i']} LUFS · pico {f['input_tp']} dBTP → {os.path.relpath(saida, RAIZ)}")


if __name__ == "__main__":
    sys.exit(main())
