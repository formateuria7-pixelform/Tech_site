import React from 'react';
import { MapPinIcon, PhoneIcon, MailIcon, ArrowRightIcon } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { ButtonLink } from '../ui/Button';
import { company } from '../../data/content';

export function CtaMapSection() {
  const query = encodeURIComponent(company.address);

  return (
    <section className="border-t border-paper/10 bg-coal" aria-labelledby="cta-title">
      <div className="mx-auto grid max-w-[1400px] gap-0 lg:grid-cols-2">
        <Reveal className="flex flex-col justify-center px-5 py-20 sm:px-6 lg:py-28 xl:px-10">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-volt" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-volt">Passons à l’action</span>
          </div>
          <h2
            id="cta-title"
            className="mt-5 max-w-xl font-display text-3xl font-semibold leading-[1.05] tracking-tightest text-paper sm:text-4xl lg:text-[3.25rem]">
            
            Décrivez votre besoin, recevez un devis sous 48 h.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-fog">
            Un formulaire structuré, la possibilité de joindre photos et plans, puis un échange avec un
            technicien. Sans engagement, et sans relance commerciale.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink to="/devis" size="lg" className="group">
              Demander un devis
              <ArrowRightIcon
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true" />
              
            </ButtonLink>
            <ButtonLink to="/rendez-vous" size="lg" variant="outline">
              Réserver un créneau
            </ButtonLink>
          </div>

          <ul className="mt-12 space-y-4 border-t border-paper/10 pt-8 text-sm">
            <li className="flex items-center gap-3 text-fog">
              <MapPinIcon className="h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
              {company.address}
            </li>
            <li>
              <a
                href={`tel:${company.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-fog transition-colors hover:text-paper">
                
                <PhoneIcon className="h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                {company.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-3 text-fog transition-colors hover:text-paper">
                
                <MailIcon className="h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                {company.email}
              </a>
            </li>
          </ul>
        </Reveal>

        <div className="relative min-h-[380px] border-t border-paper/10 lg:min-h-full lg:border-l lg:border-t-0">
          <iframe
            title={`Localisation de ${company.name} sur la carte`}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=4.82%2C45.72%2C4.88%2C45.76&layer=mapnik&marker=45.74%2C4.85`}
            className="h-full w-full grayscale-[0.85] contrast-[1.1]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" />
          
          <a
            href={`https://www.openstreetmap.org/search?query=${query}`}
            target="_blank"
            rel="noreferrer noopener"
            className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-ink/90 px-4 py-2.5 text-sm text-paper backdrop-blur transition-colors hover:bg-ink">
            
            <MapPinIcon className="h-4 w-4 text-volt" aria-hidden="true" />
            Ouvrir l’itinéraire
          </a>
        </div>
      </div>
    </section>);

}