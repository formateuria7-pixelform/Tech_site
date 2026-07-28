import React from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { ButtonLink } from '../components/ui/Button';
import { services } from '../data/services';

export function NotFound() {
  return (
    <>
      <Seo title="Page introuvable (404)" description="La page demandée n’existe pas ou a été déplacée." />
      <section className="noise relative flex min-h-[72vh] w-full items-center overflow-hidden bg-ink">
        <div className="grid-tech absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-6 xl:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-volt">Erreur 404</p>
          <h1 className="mt-6 font-display text-[clamp(3.5rem,14vw,10rem)] font-semibold leading-none tracking-tightest text-outline">
            404
          </h1>
          <h2 className="mt-6 max-w-xl font-display text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
            Cette page n’existe pas — ou plus.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-fog">
            Le lien est peut-être obsolète. Vous pouvez revenir à l’accueil, parcourir nos services ou
            utiliser la recherche (⌘K) pour retrouver ce que vous cherchiez.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink to="/" size="lg">
              Retour à l’accueil
            </ButtonLink>
            <ButtonLink to="/contact" size="lg" variant="outline">
              Nous signaler le problème
            </ButtonLink>
          </div>
          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-paper/10 pt-8">
            {services.slice(0, 4).map((s) =>
            <li key={s.slug}>
                <Link
                to={`/services/${s.slug}`}
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog transition-colors hover:text-volt">
                
                  {s.name}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </section>
    </>);

}