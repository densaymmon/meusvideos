"""Sound for "Kit 72 h": paper and packing foley, a small counting score (marimba, glockenspiel, pizzicato, harp) and the narration.

Reads events.json (window.EV) and timeline.json; writes out/mix.wav (48 kHz stereo). Run with LIB set to the library root.
Score idea: a tidy little machine in C major at 100 BPM that counts the items into the bag, one glockenspiel note per item,
rising through the scale. It stops dead before the red ✗ (the panic-buying cart), comes back on the blue ✓, thins out under the
calendar and leaves the room for the pull-back: near silence, then one chime as the calendar turns yellow.
"""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ['LIB']; sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, bp, lp, hp, add, compress, limit, click, clack, whoosh, thump

HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'events.json'))); TL = json.load(open(os.path.join(HERE, 'timeline.json')))
DUR = float(D['dur']); EV = D['ev']; N = int(DUR * SR)
rng = np.random.default_rng(72)
ev_of = lambda typ: [e for e in EV if e['type'] == typ]
one = lambda typ: ev_of(typ)[0]['t']

# ---------------- foley ----------------
fol = np.zeros((N, 2))
def burst(d, lo, hi, shape=1.5):
    n = int(d * SR); x = bp(rng.standard_normal(n), lo, hi); return x * np.sin(np.linspace(0, np.pi, n)) ** shape
def pencil(d):
    n = int(d * SR); x = bp(rng.standard_normal(n), 1800, 6500)
    g = (lp(np.abs(rng.standard_normal(n)), 9, 1) > .55).astype(float); g = np.convolve(g, np.ones(600) / 600, 'same'); return x * g
for e in EV:
    t, ty = e['t'], e['type']
    if ty == 'land':      # a soft backpack dropped on a table: cloth thump
        add(fol, lp(thump(1.0, 80), 700) * .8, t - .01, 1.0, -.1); add(fol, burst(.18, 200, 1800, 2) * .25, t, 1.0, -.1)
    elif ty == 'lid':     # the flap: fabric swish
        add(fol, burst(e['d'] + .1, 600, 4000, 1.2) * .12, t, 1.0, .15)
    elif ty == 'print':
        add(fol, lp(thump(.5, 140), 2000) * .28, t, 1.0, -.2)
    elif ty == 'slide':   # the page sliding past
        add(fol, burst(e['d'], 500, 3500, 1.2) * .14, t, 1.0, -.2)
    elif ty in ('pop', 'mag'):
        add(fol, hp(click(pitch=.8, v=1.0), 800) * .22, t, 1.0, .3)
    elif ty == 'draw':
        add(fol, pencil(e['d']) * .045, t, 1.0, .15)
    elif ty == 'guide':
        add(fol, pencil(.3) * .03, t, 1.0, -.15)
    elif ty == 'stamp':   # the red cross: a rubber stamp on paper
        add(fol, lp(thump(1.0, 90), 1000) * .75, t - .01, 1.0, -.2); add(fol, bp(click(pitch=.35, v=1.0), 300, 3000) * .3, t, 1.0, -.2)
    elif ty == 'tick':
        add(fol, lp(thump(.8, 110), 1400) * .55, t - .01, 1.0, .2); add(fol, bp(click(pitch=.45, v=1.0), 400, 3500) * .25, t, 1.0, .2)
    elif ty == 'push':
        add(fol, lp(whoosh(e['d'] + .1, .9), 2600) * .3, t, 1.0, 0)
    elif ty == 'portal':
        add(fol, burst(.35, 1500, 7000, 2) * .1, t - .1, 1.0, 0)
    elif ty == 'rise':
        add(fol, lp(whoosh(.45, .6), 3200) * .09, t, 1.0, .15)
    elif ty == 'drop':    # the item lands among the others: material by item
        nm = e['name']
        if nm in ('can', 'opener', 'battery'): add(fol, bp(clack(pitch=1.7, v=1.0), 1200, 9000) * .22, t, 1.0, .2)
        elif nm == 'bottle': add(fol, lp(thump(.6, 160), 2500) * .35, t, 1.0, .2); add(fol, burst(.12, 900, 5000) * .12, t, 1.0, .2)
        else: add(fol, bp(clack(pitch=1.0 + rng.random() * .3, v=1.0), 500, 5000) * .2, t, 1.0, .2)
    elif ty == 'zip':     # a press-seal zip: tiny regular clicks
        n = int(e['d'] / .045)
        for i in range(n): add(fol, bp(click(pitch=2.2, v=1.0), 2500, 10000) * .07, t + i * .045, 1.0, -.3)
    elif ty == 'click':
        add(fol, bp(clack(pitch=1.3, v=1.0), 700, 9000) * .6, t, 1.0, -.3)
    elif ty == 'buckle':
        add(fol, bp(clack(pitch=1.0, v=1.0), 600, 7000) * .5, t, 1.0, .1); add(fol, hp(click(pitch=1.2, v=1.0), 1500) * .3, t + .05, 1.0, .1)
    elif ty == 'scrape':  # the bag slid across the floor
        add(fol, burst(e['d'], 250, 2200, .8) * .16, t, 1.0, -.1)
    elif ty == 'set':
        add(fol, lp(thump(.8, 90), 900) * .55, t, 1.0, .1)
    elif ty == 'turn':
        add(fol, pencil(e['d']) * .05, t, 1.0, 0)
    elif ty == 'out':
        add(fol, lp(whoosh(e['d'], .7), 1800) * .2, t, 1.0, 0)
room = lp(rng.standard_normal(N), 380, 2) * .003
fol += np.stack([room, np.roll(room, 997)], 1)

# ---------------- score ----------------
B = 60 / 100; ev = []
CH = {'C': [36, 52, 55, 60, 64], 'F': [41, 53, 57, 60, 65], 'G': [43, 50, 55, 59, 62], 'Am': [45, 52, 57, 60, 64], 'Dm': [38, 50, 53, 57, 62]}
def bar(t0, ch, v=1.0, ost=True, end=None):
    n = CH[ch]
    for i in (0, 2):
        if end is None or t0 + i * B < end: ev.append((t0 + i * B, 'cellos_pizz', n[0] + (12 if n[0] < 40 else 0), .7, .48 * v, -.15))
    if ost:
        for i, k in enumerate([3, 1, 4, 2, 3, 1, 4, 2]):
            tt = t0 + i * B / 2
            if end is None or tt < end: ev.append((tt, 'marimba', n[k] + 12, .3, (.2 + .06 * (i % 2 == 0)) * v, .15))
def run(t0, t1, chords, v=1.0, ost=True):
    t, i = t0, 0
    while t < t1 - .05:
        bar(t, chords[i % len(chords)], v, ost, end=t1); t += 4 * B; i += 1
L = one('land')
ev += [(L, 'glockenspiel', 72, 1.2, .25, .2), (L, 'vibraphone', 60, 2.0, .25, 0), (L, 'vibraphone', 64, 2.0, .2, 0)]
ev += [(one('lid') + i * .08, 'harp', p, 1.2, .2, -.2 + .1 * i) for i, p in enumerate([60, 64, 67, 72])]
run(2.4, one('stop'), ['C', 'Am', 'F'], v=.75)
# the cross: the machine stops dead, a wrong low note; the tick: it picks itself up
X = one('stamp'); ev += [(X, 'cellos_pizz', 37, .9, .6, 0), (X + .01, 'vibraphone', 49, 1.2, .25, 0)]
K = one('tick'); ev += [(K, 'glockenspiel', 84, 1.4, .32, .2), (K, 'vibraphone', 64, 1.6, .25, 0), (K, 'vibraphone', 67, 1.6, .22, 0), (K, 'cellos_pizz', 48, .8, .45, -.1)]
# push through the tick: a harp running up into the white
P0 = one('push'); ev += [(P0 + i * .055, 'harp', 60 + [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19][i], .9, .18 + .01 * i, -.3 + .05 * i) for i in range(12)]
Po = one('portal'); ev += [(Po, 'hand_chimes', 72, 2.0, .25, 0)]
# packing: the machine runs, one glockenspiel note per item, rising through the scale
run(Po + .05, one('turn'), ['C', 'F', 'G', 'C', 'Am', 'F', 'G', 'C'], v=.68)
scale = [72, 74, 76, 77, 79, 81, 83, 84, 86, 88, 89, 91, 93, 96]
for e in ev_of('drop'): ev.append((e['t'], 'glockenspiel', scale[e['n'] % len(scale)], 1.0, .22, .25))
Z = one('click'); ev += [(Z, 'glockenspiel', 96, 1.4, .3, -.25), (Z, 'vibraphone', 72, 1.4, .2, 0)]
St = one('set'); ev += [(St, 'cellos_pizz', 36, .9, .5, -.1), (St, 'marimba', 72, .6, .3, .1)]
# the calendar: only pizzicato on the beat, then the room empties for the pull-back
run(one('turn'), one('out'), ['F', 'G'], v=.5, ost=False)
O = one('out'); ev += [(O + i * .14, 'harp', p, 1.4, .16, -.3 + .05 * i) for i, p in enumerate([60, 64, 67, 72, 76, 79])]
G = one('gold')
ev += [(G, 'hand_chimes', 84, 3.0, .38, .1), (G + .02, 'glockenspiel', 96, 2.2, .26, .25), (G, 'vibraphone', 60, 3.0, .3, -.1), (G, 'vibraphone', 64, 3.0, .26, .1), (G, 'vibraphone', 67, 3.0, .24, 0), (G, 'cellos_pizz', 36, 1.2, .45, -.1)]
S.seed(7)
music = S.render(ev, dur=DUR + 3, master=False)[:N]
music = S.room(music, size=.35, mix=.18)

# ---------------- narration ----------------
voice = np.zeros(N)
for k, (a, b) in TL['vo'].items():
    x, sr = sf.read(os.path.join(HERE, 'vo', f'{k}.wav'))
    if x.ndim > 1: x = x.mean(1)
    if sr != SR:
        from scipy.signal import resample_poly
        x = resample_poly(x, SR, sr)
    i0 = int(a * SR); x = x[:N - i0]; voice[i0:i0 + len(x)] += x
voice = hp(voice, 80)
voice = compress(voice, thr=.12, ratio=3.0, att=.003, rel=.12)
env = np.convolve(np.abs(voice), np.ones(int(.05 * SR)) / int(.05 * SR), 'same'); env = np.clip(env / (np.percentile(env[env > 1e-4], 70) + 1e-9), 0, 1)
env = np.convolve(env, np.ones(int(.25 * SR)) / int(.25 * SR), 'same')
mid = np.stack([bp(music[:, c], 300, 4000, 2) for c in (0, 1)], 1); rest = music - mid
music = rest * (1 - .2 * env)[:, None] + mid * (1 - .6 * env)[:, None]
vst = np.stack([voice, voice], 1); vmask = env > .5
m_rms = float(np.sqrt(np.mean(music[vmask] ** 2))); v_rms = float(np.sqrt(np.mean(vst[vmask] ** 2)))
g_music = (v_rms / m_rms) * 10 ** (-10.0 / 20)            # music ≈ 10 dB under the voice
mix = vst + music * g_music + fol * (v_rms / .06)
mix = np.stack([compress(mix[:, c], thr=.5, ratio=2.0) for c in (0, 1)], 1)
mix = mix / (np.abs(mix).max() + 1e-9) * .9
mix = np.stack([limit(mix[:, c], .95) for c in (0, 1)], 1)
nf = int(1.0 * SR); mix[-nf:] *= (np.cos(np.linspace(0, np.pi / 2, nf)) ** 2)[:, None]
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR)
used = sorted({e[1] for e in ev})
open(os.path.join(HERE, 'out', 'instruments.txt'), 'w').write(str(S.credits(used)))
print('mix', mix.shape, 'music gain', round(20 * np.log10(g_music), 1), 'dB', 'instruments', used)
