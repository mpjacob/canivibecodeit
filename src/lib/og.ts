import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { App } from './types';

const VERDICT_COLORS: Record<App['verdict'], string> = {
  yes: '#39ff14',
  kinda: '#ffb000',
  no: '#ff3333',
};

const VERDICT_LABELS: Record<App['verdict'], string> = {
  yes: 'YES',
  kinda: 'KINDA',
  no: 'NOT REALLY',
};

const FONTS_DIR = join(process.cwd(), 'public/fonts');

function loadLocalFont(filename: string): ArrayBuffer {
  const buf = readFileSync(join(FONTS_DIR, filename));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

export async function generateOgImage(app: App | null): Promise<Uint8Array> {
  const jetbrains = loadLocalFont('JetBrainsMono-Bold.ttf');
  const spaceGrotesk = loadLocalFont('SpaceGrotesk-Bold.ttf');

  const isHome = !app;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0a0a0a',
          padding: '60px',
          fontFamily: 'Space Grotesk',
        },
        children: isHome
          ? [
              {
                type: 'div',
                props: {
                  style: { fontSize: 28, color: '#39ff14', fontFamily: 'JetBrains Mono', marginBottom: 20 },
                  children: '// can_i_vibecode_it',
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: 64, fontWeight: 700, color: '#e0e0e0', textAlign: 'center', lineHeight: 1.1 },
                  children: 'Can I Vibecode It?',
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: 28, color: '#888888', marginTop: 24, textAlign: 'center' },
                  children: 'Replace paid SaaS with one AI prompt',
                },
              },
            ]
          : [
              {
                type: 'div',
                props: {
                  style: { fontSize: 24, color: '#39ff14', fontFamily: 'JetBrains Mono', marginBottom: 16 },
                  children: `// ${app!.slug}`,
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: 56, fontWeight: 700, color: '#e0e0e0', textAlign: 'center' },
                  children: `Can I vibecode ${app!.name}?`,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 36,
                    fontWeight: 700,
                    color: VERDICT_COLORS[app!.verdict],
                    marginTop: 32,
                    padding: '12px 40px',
                    border: `3px solid ${VERDICT_COLORS[app!.verdict]}`,
                    borderRadius: 8,
                    fontFamily: 'JetBrains Mono',
                  },
                  children: VERDICT_LABELS[app!.verdict],
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: 22, color: '#666666', marginTop: 24, fontFamily: 'JetBrains Mono' },
                  children: `$${app!.priceMonthly}/mo → $0 with vibecoding`,
                },
              },
            ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'JetBrains Mono', data: jetbrains, weight: 700, style: 'normal' },
        { name: 'Space Grotesk', data: spaceGrotesk, weight: 700, style: 'normal' },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  return resvg.render().asPng();
}
