"""Narration placement + subtitles → timeline.json and kit-emergencia-72h.srt. Run with the library's python."""
import json, os, sys
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIB = os.environ['LIB']; sys.path.insert(0, LIB)
lines = json.load(open(os.path.join(HERE, 'vo', 'lines.json')))
dur = json.load(open(os.path.join(HERE, 'vo', 'dur.json')))
START = {'a': 0.30, 'b': 5.45, 'c': 9.50, 'd': 12.60, 'e': 16.05, 'f': 19.25, 'g': 23.20, 'h': 25.75}
DUR = 31.0
vo, subs = {}, []
ids = [L['id'] for L in lines]
for i, L in enumerate(lines):
    k = L['id']; t0 = START[k]; t1 = t0 + dur[k]
    vo[k] = [t0, t1]
    nxt = START[ids[i + 1]] - .1 if i + 1 < len(ids) else t1 + 1.0
    end = max(t1 + .6, t0 + 1.8)
    assert end <= nxt + 1e-6, (k, end, nxt)
    subs.append({'id': k, 't0': t0, 't1': round(min(nxt, max(end, t1 + .9)), 3), 'text': L['sub']})
json.dump({'dur': DUR, 'vo': vo, 'subs': subs}, open(os.path.join(HERE, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
cues = [{'t0': s['t0'], 't1': s['t1'], 'text': s['text']} for s in subs]
json.dump(cues, open(os.path.join(HERE, 'out', 'cues.json'), 'w'), ensure_ascii=False)
print('timeline ok', DUR)
