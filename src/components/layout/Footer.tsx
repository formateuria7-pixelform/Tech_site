import React from 'react';
import { Link } from 'react-router-dom';
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon, ArrowUpRightIcon } from 'lucide-react';
import { company } from '../../data/content';
import { services } from '../../data/services';
import { categories } from '../../data/catalog';

const legal = [
{ to: '/mentions-legales', label: 'Mentions légales' },
{ to: '/confidentialite', label: 'Politique de confidentialité' },
{ to: '/cgv', label: 'Conditions générales de vente' }];


export function Footer() {
  return (
    <footer className="relative border-t border-paper/10 bg-ink" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Informations et navigation de bas de page
      </h2>

      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-6 xl:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-volt font-display text-xl font-bold text-ink">
                Ω
              </span>
              <span className="font-display text-lg font-bold text-paper">{company.name}</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-fog">{company.claim}</p>

            <ul className="mt-7 space-y-3 text-sm">
              <li className="flex items-start gap-3 text-fog">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                {company.address}
              </li>
              <li>
                <a
                  href={`tel:${company.phone.replace(/\s/g, '')}`}
                  className="flex items-start gap-3 text-fog transition-colors hover:text-paper">
                  
                  <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                  {company.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-start gap-3 text-fog transition-colors hover:text-paper">
                  
                  <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-fog">
                <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                <span>
                  {company.hours.map((h) =>
                  <span key={h.day} className="block">
                      {h.day} — {h.value}
                    </span>
                  )}
                </span>
              </li>
            </ul>
          </div>

          <nav aria-label="Services">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-paper">Services</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {services.map((s) =>
              <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="text-fog transition-colors hover:text-volt">
                    {s.name}
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <nav aria-label="Boutique">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-paper">Boutique</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {categories.map((c) =>
              <li key={c.slug}>
                  <Link to={`/boutique/categorie/${c.slug}`} className="text-fog transition-colors hover:text-volt">
                    {c.name}
                  </Link>
                </li>
              )}
              <li>
                <Link to="/boutique" className="text-fog transition-colors hover:text-volt">
                  Tout le catalogue
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Espace client et ressources">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-paper">Votre espace</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {[
              { to: '/devis', label: 'Demander un devis' },
              { to: '/rendez-vous', label: 'Prendre rendez-vous' },
              { to: '/compte/commandes', label: 'Suivre une commande' },
              { to: '/compte/devis', label: 'Mes devis' },
              { to: '/compte/rendez-vous', label: 'Mes rendez-vous' },
              { to: '/faq', label: 'FAQ' },
              { to: '/actualites', label: 'Actualités' }].
              map((l) =>
              <li key={l.to}>
                  <Link to={l.to} className="text-fog transition-colors hover:text-volt">
                    {l.label}
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-paper/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog">
            © {new Date().getFullYear()} {company.legalName} — SIRET {company.siret} — TVA {company.vat}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-fog">
            {legal.map((l) =>
            <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-paper">
                  {l.label}
                </Link>
              </li>
            )}
            <li>
              <a
                href="https://www.service-public.fr"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 transition-colors hover:text-paper">
                
                Médiation de la consommation
                <ArrowUpRightIcon className="h-3 w-3" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>);

}