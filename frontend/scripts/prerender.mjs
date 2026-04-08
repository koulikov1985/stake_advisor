import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { getPrerenderRoutes } from '../src/seo/routeMetadata.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const templatePath = path.join(distDir, 'index.html');
const serverEntryPath = path.join(distDir, 'server', 'entry-server.js');

const template = await readFile(templatePath, 'utf8');
const { render } = await import(pathToFileURL(serverEntryPath).href);

function getHelmetString(value) {
  return value && typeof value.toString === 'function' ? value.toString() : '';
}

for (const route of getPrerenderRoutes()) {
  const { appHtml, helmet } = render(route.path);
  const head = [
    getHelmetString(helmet?.title),
    getHelmetString(helmet?.meta),
    getHelmetString(helmet?.link),
    getHelmetString(helmet?.script),
  ]
    .filter(Boolean)
    .join('\n');

  const html = template
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    .replace(/<!--app-head-->[\s\S]*?<!--\/app-head-->/, `<!--app-head-->\n${head}\n<!--/app-head-->`);

  const outputPath = route.path === '/'
    ? path.join(distDir, 'index.html')
    : path.join(distDir, route.path.slice(1), 'index.html');

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, 'utf8');
}
