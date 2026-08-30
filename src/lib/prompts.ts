import type { App } from './types';

const AGENT_PREFIXES: Record<string, string> = {
  claude: `Run this in Claude Code. Create all files, install dependencies, and verify the build works before reporting done.\n\n`,
  codex: `Run this in OpenAI Codex. Scaffold the project, write tests where appropriate, and ensure \`npm run build\` passes.\n\n`,
  cursor: `Run this in Cursor Agent mode. Follow existing conventions, keep scope minimal, and commit when done.\n\n`,
};

export function getAgentPrompt(agent: string, prompt: string): string {
  const prefix = AGENT_PREFIXES[agent] ?? '';
  return prefix + prompt;
}

export function getFaqItems(app: App): { question: string; answer: string }[] {
  const verdictText =
    app.verdict === 'yes'
      ? 'Yes — a skilled developer with AI coding tools can realistically replace this with a focused build.'
      : app.verdict === 'kinda'
        ? 'Partially — you can replicate the core workflow, but some features will be missing or require ongoing maintenance.'
        : 'Not really — the complexity, integrations, or compliance requirements make a one-prompt replacement impractical.';

  return [
    {
      question: `Can I vibecode ${app.name}?`,
      answer: verdictText,
    },
    {
      question: `How much does ${app.name} cost per month?`,
      answer:
        app.priceMonthly === 0
          ? `${app.name} has a free tier, though paid plans unlock more features.`
          : `${app.name} starts at approximately $${app.priceMonthly}/month for a typical team plan.`,
    },
    {
      question: `What do I lose if I replace ${app.name}?`,
      answer:
        app.whatYouLose.length > 0
          ? `You lose: ${app.whatYouLose.join('; ')}.`
          : `The main tradeoff is ongoing maintenance — you own the code, the hosting, and the bug fixes.`,
    },
    {
      question: `Has anyone actually replaced ${app.name} with AI coding?`,
      answer:
        app.priorArt.length > 0
          ? `Yes — see prior art including ${app.priorArt.map((p) => p.title).join(', ')}.`
          : `No documented prior art yet, but the prompt below is a solid starting point.`,
    },
  ];
}

export function getShareText(app: App, siteUrl: string): string {
  const verdict =
    app.verdict === 'yes' ? '✅ YES' : app.verdict === 'kinda' ? '🟡 KINDA' : '🔴 NOT REALLY';
  return encodeURIComponent(
    `Can you vibecode ${app.name}? ${verdict}\n\n${siteUrl}/${app.slug}`
  );
}
