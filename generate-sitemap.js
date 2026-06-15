import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://neura-music.com/';
const DATA_DIR = path.join(__dirname, 'data');
const OUTPUT_FILE = path.join(__dirname, 'sitemap.xml');

const today = new Date().toISOString().split('T')[0];

function generateSitemap() {
  const urls = [];

  urls.push(`  <url>\n    <loc>${BASE_URL}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>1.0</priority>\n  </url>`);

  const manifestPath = path.join(DATA_DIR, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('Error: manifest.json が見つかりません。パスを確認してください。');
    return;
  }
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  if (manifest.theme_files && Array.isArray(manifest.theme_files)) {
    for (const themeFile of manifest.theme_files) {
      const themeId = themeFile.id;
      
      urls.push(`  <url>\n    <loc>${BASE_URL}theme/${themeId}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>0.8</priority>\n  </url>`);

      const themeDataPath = path.join(DATA_DIR, themeFile.fileName);
      if (fs.existsSync(themeDataPath)) {
        const themeData = JSON.parse(fs.readFileSync(themeDataPath, 'utf8'));
        if (themeData.albums && Array.isArray(themeData.albums)) {
          for (const album of themeData.albums) {
            urls.push(`  <url>\n    <loc>${BASE_URL}theme/${themeId}/album/${album.id}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>0.6</priority>\n  </url>`);
          }
        }
      } else {
        console.warn(`Warn: テーマファイル ${themeFile.fileName} が見つかりません。スキップします。`);
      }
    }
  }

  if (manifest.tools && Array.isArray(manifest.tools)) {
    for (const tool of manifest.tools) {
      urls.push(`  <url>\n    <loc>${BASE_URL}tool/${tool.id}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>0.8</priority>\n  </url>`);
    }
  }

  if (manifest.articles && Array.isArray(manifest.articles)) {
    for (const article of manifest.articles) {
      urls.push(`  <url>\n    <loc>${BASE_URL}article/${article.id}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>0.8</priority>\n  </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  fs.writeFileSync(OUTPUT_FILE, xml, 'utf8');
  console.log(`sitemap.xml を生成しました。 (総URL数: ${urls.length})`);
}

generateSitemap();

/*
  実行方法：
    node generate-sitemap.js

  備考：
    manifest.json と data/*.json を元に sitemap.xml を自動生成する。
*/

