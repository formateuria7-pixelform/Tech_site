import React from 'react';
import { useLocation } from 'react-router-dom';
import { company } from '../data/content';

type Props = {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  schema?: Record<string, unknown>;
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Métadonnées SEO, Open Graph et données structurées Schema.org par page. */
export function Seo({ title, description, image, type = 'website', schema }: Props) {
  const { pathname } = useLocation();
  const fullTitle = `${title} — ${company.name}`;
  const url = `https://ohmega-solutions.fr${pathname}`;

  React.useEffect(() => {
    document.title = fullTitle;
    document.documentElement.lang = 'fr';
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', 'index, follow');
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:site_name', company.name);
    upsertMeta('property', 'og:locale', 'fr_FR');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    if (image) {
      upsertMeta('property', 'og:image', image);
      upsertMeta('name', 'twitter:image', image);
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    const ldId = 'ohmega-structured-data';
    document.getElementById(ldId)?.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = ldId;
    script.textContent = JSON.stringify(
      schema ?? {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: company.name,
        legalName: company.legalName,
        description,
        url,
        telephone: company.phone,
        email: company.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: '18 rue des Ateliers',
          postalCode: '69007',
          addressLocality: 'Lyon',
          addressCountry: 'FR'
        },
        foundingDate: String(company.since)
      }
    );
    document.head.appendChild(script);
  }, [fullTitle, description, image, type, url, schema]);

  return null;
}