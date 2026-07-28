import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { ButtonLink } from '../ui/Button';
import { realisations } from '../../data/content';

export function RealisationsPreview() {
  return (
    <section className="border-t border-paper/10 bg-coal py-20 lg:py-28" aria-labelledby="realisations-title">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
        <SectionHeading
          eyebrow="Réalisations"
          title={<span id="realisations-title">Des chantiers livrés, mesurés, documentés.</span>}
          intro="Quelques projets récents avec leurs indicateurs réels : durée, volumétrie et impact sur l’exploitation."
          action={
          <ButtonLink to="/realisations" variant="outline">
              Toutes les réalisations
            </ButtonLink>
          } />
        

        <ul className="mt-14 grid gap-6 lg:grid-cols-2">
          {realisations.slice(0, 4).map((r, i) =>
          <Reveal as="li" key={r.slug} delay={i * 0.07}>
              <Link
              to="/realisations"
              className="group relative block overflow-hidden rounded-3xl border border-paper/10">
              
                <div className="aspect-[16/10] overflow-hidden bg-steel">
                  <img
                  src={r.image}
                  alt={r.title}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-70 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-90" />
                
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,12,14,0.96)_20%,rgba(11,12,14,0.25)_70%)]" />
                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                  <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-volt">
                    <span>{r.sector}</span>
                    <span className="h-px w-6 bg-volt/50" aria-hidden="true" />
                    <span>{r.year}</span>
                  </div>
                  <h3 className="mt-3 max-w-md font-display text-xl font-semibold leading-snug text-paper lg:text-2xl">
                    {r.title}
                  </h3>
                  <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
                    {r.metrics.map((m) =>
                  <li key={m.label}>
                        <span className="block font-display text-lg font-semibold text-paper">{m.value}</span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">{m.label}</span>
                      </li>
                  )}
                  </ul>
                </div>
                <ArrowUpRightIcon
                className="absolute right-6 top-6 h-5 w-5 text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true" />
              
              </Link>
            </Reveal>
          )}
        </ul>
      </div>
    </section>);

}