import type { APIRoute } from 'astro';
import { getAllApps } from '../lib/apps';

export const GET: APIRoute = () => {
  const apps = getAllApps();
  const siteUrl = 'https://canivibecodeit.com';

  const urls = [
    { loc: siteUrl, changefreq: 'daily', priority: '1.0' },
    ...apps.map((app) => ({
      loc: `${siteUrl}/${app.slug}`,
      changefreq: 'weekly',
      priority: '0.8',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
