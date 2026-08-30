import type { App } from './types';
import { getAllApps } from './apps';

export function websiteJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Can I Vibecode It?',
    url: siteUrl,
    description:
      'A directory answering whether you can replace paid SaaS apps with one AI coding prompt.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Can I Vibecode It?',
    url: siteUrl,
    description: 'The honest directory of SaaS apps you can replace with vibecoding.',
  };
}

export function itemListJsonLd(siteUrl: string) {
  const apps = getAllApps();
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'SaaS Apps — Can You Vibecode Them?',
    numberOfItems: apps.length,
    itemListElement: apps.map((app, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${siteUrl}/${app.slug}`,
      name: `Can I vibecode ${app.name}?`,
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  siteUrl: string,
  crumbs: { name: string; url?: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      ...(crumb.url ? { item: crumb.url } : {}),
    })),
  };
}

export function appPageJsonLd(siteUrl: string, app: App) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Can I vibecode ${app.name}?`,
    url: `${siteUrl}/${app.slug}`,
    description: app.notes,
    isPartOf: { '@type': 'WebSite', name: 'Can I Vibecode It?', url: siteUrl },
  };
}
