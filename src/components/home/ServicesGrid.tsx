import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { ButtonLink } from '../ui/Button';
import { services } from '../../data/services';

export function ServicesGrid() {
  return (
    <section className="bg-ink py-20 lg:py-28" aria-labelledby="services-title">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
        <SectionHeading
          eyebrow="Nos prestations"
          title={
          <span id="services-title">
              Six métiers, une seule
              <br className="hidden sm:block" /> exigence technique.
            </span>
          }
          intro="De l’étude à la maintenance, nos équipes couvrent l’ensemble de la chaîne : courants faibles, sûreté, réseaux, postes de travail et support."
          action={
          <ButtonLink to="/services" variant="outline">
              Tous les services
            </ButtonLink>
          } />
        

        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-paper/12 bg-paper/12 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) =>
          <Reveal as="li" key={service.slug} delay={i * 0.06} className="group relative bg-ink">
              <Link
              to={`/services/${service.slug}`}
              className="flex h-full flex-col p-7 transition-colors duration-300 hover:bg-coal lg:p-9">
              
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-volt">{service.index}</span>
                  <ArrowUpRightIcon
                  className="h-5 w-5 text-fog transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-volt"
                  aria-hidden="true" />
                
                </div>
                <h3 className="mt-8 font-display text-2xl font-semibold leading-tight tracking-tight text-paper">
                  {service.name}
                </h3>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-volt/80">
                  {service.tagline}
                </p>
                <p className="mt-5 flex-1 text-sm leading-relaxed text-fog">{service.summary}</p>
                <p className="mt-7 border-t border-paper/10 pt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-fog">
                  {service.duration}
                </p>
              </Link>
            </Reveal>
          )}
        </ul>
      </div>
    </section>);

}