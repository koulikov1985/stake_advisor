import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  SITE_URL,
  getRobotsDisallowPaths,
  getSitemapRoutes,
} from '../src/seo/routeMetadata.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

function buildSitemap() {
  const urls = getSitemapRoutes()
    .map(({ path: routePath, lastmod, changefreq, priority }) => {
      const location = `${SITE_URL}${routePath === '/' ? '/' : routePath}`;
      return [
        '  <url>',
        `    <loc>${location}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');
}

function buildRobots() {
  const disallowPaths = [...new Set(['/api/', ...getRobotsDisallowPaths()])];
  const lines = [
    'User-agent: *',
    'Allow: /',
    ...disallowPaths.map((routePath) => `Disallow: ${routePath}`),
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ];

  return lines.join('\n');
}

await writeFile(path.join(publicDir, 'sitemap.xml'), buildSitemap(), 'utf8');
await writeFile(path.join(publicDir, 'robots.txt'), buildRobots(), 'utf8');
