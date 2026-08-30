import type { APIRoute } from 'astro';
import { castVote } from '../../lib/db';
import { getAppBySlug } from '../../lib/apps';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug || typeof slug !== 'string') {
      return new Response(JSON.stringify({ success: false, error: 'invalid_slug' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const app = getAppBySlug(slug);
    if (!app) {
      return new Response(JSON.stringify({ success: false, error: 'not_found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      clientAddress ??
      'unknown';

    const result = castVote(slug, ip);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 429,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'server_error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
