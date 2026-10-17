import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = new URL('../', import.meta.url);
let html = await readFile(new URL('dist/index.html', root), 'utf8');
for (const name of ['styles.css', 'extras.css']) {
  const css = await readFile(new URL(`dist/${name}`, root), 'utf8');
  html = html.replace(`<link rel="stylesheet" href="./${name}">`, `<style>\n${css}\n</style>`);
}
const code = [];
for (const name of ['icons.js', 'data.js', 'medications.js', 'nurse.js', 'clinician.js', 'app.js']) {
  let source = await readFile(new URL(`dist/${name}`, root), 'utf8');
  source = source.replace(/^import .*;\n/gm, '').replace(/^export /gm, '');
  if (name === 'app.js') source = `const e = escapeHTML;\n${source}`;
  code.push(source);
}
html = html.replace('<script type="module" src="./app.js"></script>', `<script>\n(() => {\n${code.join('\n')}\n})();\n</script>`);
const output = resolve(process.argv[2] || 'preview.html');
await writeFile(output, html);
console.log(`Standalone website written to ${output}`);
