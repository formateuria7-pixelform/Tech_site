import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { ButtonLink } from '../ui/Button';
import { ProductCard } from '../ProductCard';
import { useStore } from '../../store/useStore';

export function PopularProducts() {
  const catalog = useStore((s) => s.catalog);
  const featured = React.useMemo(
    () =>
    [...catalog].
    sort((a, b) => Number(b.tags.includes('best-seller')) - Number(a.tags.includes('best-seller'))).
    slice(0, 4),
    [catalog]
  );
  const promos = React.useMemo(() => catalog.filter((p) => p.oldPrice).slice(0, 3), [catalog]);

  return (
    <section className="border-t border-paper/10 bg-coal py-20 lg:py-28" aria-labelledby="produits-title">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
        <SectionHeading
          eyebrow="Boutique"
          title={<span id="produits-title">Matériel professionnel sélectionné, en stock.</span>}
          intro="Références choisies pour leur fiabilité et leur disponibilité, avec garantie étendue et atelier local."
          action={
          <ButtonLink to="/boutique" variant="outline">
              Tout le catalogue
            </ButtonLink>
          } />
        

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) =>
          <Reveal key={p.slug} delay={i * 0.07}>
              <ProductCard product={p} />
            </Reveal>
          )}
        </div>

        {promos.length > 0 &&
        <Reveal className="mt-16 overflow-hidden rounded-3xl border border-volt/25 bg-ink">
            <div className="flex flex-col gap-8 p-7 lg:flex-row lg:items-center lg:justify-between lg:p-10">
              <div className="max-w-md">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-volt">Promotions en cours</p>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-paper lg:text-3xl">
                  {promos.length} références à prix réduit
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-fog">
                  Remises appliquées automatiquement au panier. Livraison offerte dès 500 € HT.
                </p>
                <ButtonLink to="/boutique?tri=promo" className="mt-6">
                  Voir les promotions
                </ButtonLink>
              </div>
              <ul className="grid flex-1 gap-3 sm:grid-cols-3">
                {promos.map((p) =>
              <li key={p.slug} className="rounded-2xl border border-paper/10 bg-coal p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-copper">
                      −{Math.round((p.oldPrice! - p.price) / p.oldPrice! * 100)} %
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-paper">{p.name}</p>
                  </li>
              )}
              </ul>
            </div>
          </Reveal>
        }
      </div>
    </section>);

}