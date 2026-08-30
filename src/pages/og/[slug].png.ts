import type { APIRoute } from 'astro';
import { getAppBySlug } from '../../lib/apps';
import { generateOgImage } from '../../lib/og';

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  try {
    let png: Uint8Array;

    if (!slug || slug === 'home') {
      png = await generateOgImage(null);
    } else {
      const app = getAppBySlug(slug);
      if (!app) {
        return new Response('Not found', { status: 404 });
      }
      png = await generateOgImage(app);
    }

    return new Response(png, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (e) {
    console.error('OG image generation failed:', e);
    return new Response('Error generating image', { status: 500 });
  }
};
