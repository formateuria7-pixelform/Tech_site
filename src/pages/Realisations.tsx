import React from 'react';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { ButtonLink } from '../components/ui/Button';
import { realisations } from '../data/content';
import { cx } from '../lib/format';

export function Realisations() {
  const sectors = ['Tous', ...Array.from(new Set(realisations.map((r) => r.sector)))];
  const [sector, setSector] = React.useState('Tous');

  const filtered = sector === 'Tous' ? realisations : realisations.filter((r) => r.sector === sector);

  return (
    <>
      <Seo
        title="Nos réalisations"
        description="Chantiers réalisés en vidéoprotection, réseaux, informatique et automatismes, avec indicateurs mesurés : volumétrie, durée et impact sur l’exploitation." />
      
      <PageHeader
        eyebrow="Catalogue des installations"
        title="Nos réalisations"
        intro="Une sélection de chantiers récents, avec leurs chiffres réels plutôt que des superlatifs."
        crumbs={[{ label: 'Réalisations' }]}>
        
        <ul className="flex flex-wrap gap-2">
          {sectors.map((s) =>
          <li key={s}>
              <button
              type="button"
              onClick={() => setSector(s)}
              aria-pressed={sector === s}
              className={cx(
                'rounded-full px-4 py-2 text-sm transition-colors',
                sector === s ? 'bg-volt text-ink' : 'border border-paper/15 text-fog hover:text-paper'
              )}>
              
                {s}
              </button>
            </li>
          )}
        </ul>
      </PageHeader>

      <section className="bg-ink py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
          <ul className="space-y-8">
            {filtered.map((r, i) =>
            <Reveal as="li" key={r.slug} delay={i * 0.06}>
                <article
                className={cx(
                  'grid gap-0 overflow-hidden rounded-3xl border border-paper/10 bg-coal lg:grid-cols-2',
                  i % 2 === 1 && 'lg:[&>figure]:order-2'
                )}>
                
                  <figure className="m-0 aspect-[16/10] overflow-hidden bg-steel lg:aspect-auto lg:min-h-[380px]">
                    <img
                    src={r.image}
                    alt={r.title}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-80 transition-opacity duration-500 hover:opacity-100" />
                  
                  </figure>
                  <div className="flex flex-col justify-center p-7 lg:p-12">
                    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
                      <span className="text-volt">{r.sector}</span>
                      <span className="h-px w-6 bg-volt/40" aria-hidden="true" />
                      <span className="text-fog">{r.year}</span>
                    </div>
                    <h2 className="mt-5 font-display text-2xl font-semibold leading-tight tracking-tight text-paper lg:text-3xl">
                      {r.title}
                    </h2>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fog">{r.client}</p>
                    <p className="mt-6 text-base leading-relaxed text-fog">{r.summary}</p>
                    <dl className="mt-8 grid gap-6 border-t border-paper/10 pt-7 sm:grid-cols-3">
                      {r.metrics.map((m) =>
                    <div key={m.label}>
                          <dd className="font-display text-2xl font-semibold text-volt">{m.value}</dd>
                          <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                            {m.label}
                          </dt>
                        </div>
                    )}
                    </dl>
                  </div>
                </article>
              </Reveal>
            )}
          </ul>

          <Reveal className="mt-16 rounded-3xl border border-volt/25 bg-coal p-8 text-center lg:p-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-paper lg:text-3xl">
              Un projet comparable ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-fog">
              Nous pouvons vous mettre en relation avec l’un de ces clients pour un retour direct sur le
              déroulement du chantier.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink to="/devis">Demander un devis</ButtonLink>
              <ButtonLink to="/contact" variant="outline">
                Demander une référence client
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>);

}