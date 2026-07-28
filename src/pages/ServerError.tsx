import React from 'react';
import { RefreshCwIcon } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Button, ButtonLink } from '../components/ui/Button';
import { company } from '../data/content';

export function ServerError() {
  return (
    <>
      <Seo title="Erreur serveur (500)" description="Une erreur technique est survenue. Nos équipes en sont informées." />
      <section className="noise relative flex min-h-[72vh] w-full items-center overflow-hidden bg-ink">
        <div className="grid-tech absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-6 xl:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-copper">Erreur 500</p>
          <h1 className="mt-6 font-display text-[clamp(3.5rem,14vw,10rem)] font-semibold leading-none tracking-tightest text-outline">
            500
          </h1>
          <h2 className="mt-6 max-w-xl font-display text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
            Le service a rencontré une erreur interne.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-fog">
            L’incident a été journalisé automatiquement. Si le problème persiste, contactez-nous au{' '}
            {company.phone} en précisant l’action que vous tentiez d’effectuer.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => window.location.reload()}>
              <RefreshCwIcon className="h-4 w-4" aria-hidden="true" />
              Recharger la page
            </Button>
            <ButtonLink to="/" size="lg" variant="outline">
              Retour à l’accueil
            </ButtonLink>
          </div>
        </div>
      </section>
    </>);

}