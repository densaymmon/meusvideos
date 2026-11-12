// Renderiza um quadro (a ~65% de cada cena) de cada fala, para conferir as ilustrações.
// Uso: node ferramentas/quadros.mjs <composicao> <pasta-saida> [escala]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [comp, saida, escala = '0.4'] = process.argv.slice(2);
fs.mkdirSync(saida, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: comp, browserExecutable: '/opt/pw-browsers/chromium'});
const narr = JSON.parse(fs.readFileSync('src/narracao.json', 'utf8'));
const {ids, fatorPausa} = composition.props;
let t = 0;
const avisos = [];
for (const [i, id] of ids.entries()) {
  const f = narr.find((x) => x.id === id);
  const d = f.duracao + f.pausa * fatorPausa;
  const frame = Math.round((t + d * 0.65) * composition.fps);
  t += d;
  await renderStill({
    composition,
    serveUrl,
    frame,
    output: path.join(saida, `${String(i).padStart(3, '0')}-${id}.png`),
    scale: Number(escala),
    browserExecutable: '/opt/pw-browsers/chromium',
    onBrowserLog: (l) => l.text.includes('[momento]') && avisos.push(l.text),
  });
}
console.log('quadros:', ids.length);
console.log([...new Set(avisos)].join('\n') || 'sem avisos de palavras');
