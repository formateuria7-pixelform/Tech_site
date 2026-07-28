import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon, CheckIcon } from 'lucide-react';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { ButtonLink } from '../components/ui/Button';
import { services } from '../data/services';
import { formatPrice } from '../lib/format';

export function Services() {
  return (
    <>
      <Seo
        title="Nos services"
        description="Installation électronique, systèmes de sécurité, informatique, maintenance, assistance technique et équipement des entreprises. Prestations détaillées et tarifs indicatifs."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: services.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: s.name,
            url: `https://ohmega-solutions.fr/services/${s.slug}`
          }))
        }} />
      
      <PageHeader
        eyebrow="Prestations"
        title="Nos services techniques"
        intro="Six domaines d’intervention complémentaires. Chaque prestation détaille son périmètre, ses livrables, ses tarifs indicatifs et permet de demander un devis ou de réserver un créneau."
        crumbs={[{ label: 'Services' }]} />
      

      <section className="bg-ink py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
          <ul className="space-y-6">
            {services.map((service, i) =>
            <Reveal as="li" key={service.slug} delay={i * 0.05}>
                <article className="group grid gap-0 overflow-hidden rounded-3xl border border-paper/10 bg-coal lg:grid-cols-[0.9fr_1.1fr]">
                  <Link
                  to={`/services/${service.slug}`}
                  className="relative aspect-[16/10] overflow-hidden bg-steel lg:aspect-auto lg:min-h-[320px]"
                  aria-label={service.name}>
                  
                    <img
                    src={service.image}
                    alt={service.name}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90" />
                  
                    <span className="absolute left-5 top-5 rounded-full bg-ink/85 px-3 py-1.5 font-mono text-[11px] tracking-[0.2em] text-volt backdrop-blur">
                      {service.index}
                    </span>
                  </Link>

                  <div className="flex flex-col p-7 lg:p-10">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-2xl font-semibold tracking-tight text-paper lg:text-3xl">
                          <Link to={`/services/${service.slug}`} className="hover:text-volt">
                            {service.name}
                          </Link>
                        </h2>
                        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-volt/80">
                          {service.tagline}
                        </p>
                      </div>
                      <Link
                      to={`/services/${service.slug}`}
                      aria-label={`Détail du service ${service.name}`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/15 text-paper transition-colors hover:border-volt hover:text-volt">
                      
                        <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>

                    <p className="mt-5 text-sm leading-relaxed text-fog">{service.summary}</p>

                    <ul className="mt-7 grid gap-2 sm:grid-cols-2">
                      {service.deliverables.slice(0, 4).map((d) =>
                    <li key={d} className="flex items-start gap-2 text-sm text-paper/80">
                          <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                          {d}
                        </li>
                    )}
                    </ul>

                    <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-paper/10 pt-7">
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
                        À partir de{' '}
                        <span className="text-paper">
                          {formatPrice(Math.min(...service.pricing.map((p) => p.from)))}
                        </span>
                      </p>
                      <div className="ml-auto flex flex-wrap gap-2">
                        <ButtonLink to={`/devis?service=${service.slug}`} size="sm">
                          Devis
                        </ButtonLink>
                        <ButtonLink to={`/rendez-vous?service=${service.slug}`} size="sm" variant="outline">
                          Rendez-vous
                        </ButtonLink>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            )}
          </ul>
        </div>
      </section>
    </>);

}