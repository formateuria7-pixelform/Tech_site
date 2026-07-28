import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckIcon, PlusIcon, MinusIcon } from 'lucide-react';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { ButtonLink } from '../components/ui/Button';
import { ProductCard } from '../components/ProductCard';
import { NotFound } from './NotFound';
import { getService, services } from '../data/services';
import { useStore } from '../store/useStore';
import { formatPrice, cx } from '../lib/format';

export function ServiceDetail() {
  const { slug = '' } = useParams();
  const service = getService(slug);
  const catalog = useStore((s) => s.catalog);
  const [activeImage, setActiveImage] = React.useState(0);
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  React.useEffect(() => {
    setActiveImage(0);
    setOpenFaq(0);
  }, [slug]);

  if (!service) return <NotFound />;

  const related = catalog.filter((p) => service.relatedProducts.includes(p.slug));
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <Seo
        title={service.name}
        description={service.summary}
        image={service.image}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.name,
          description: service.summary,
          provider: { '@type': 'LocalBusiness', name: 'OHMEGA' },
          areaServed: 'Auvergne-Rhône-Alpes',
          offers: service.pricing.map((p) => ({
            '@type': 'Offer',
            name: p.label,
            price: p.from,
            priceCurrency: 'EUR'
          }))
        }} />
      
      <PageHeader
        eyebrow={`Service ${service.index}`}
        title={service.name}
        intro={service.summary}
        crumbs={[{ label: 'Services', to: '/services' }, { label: service.name }]}>
        
        <div className="flex flex-wrap gap-3">
          <ButtonLink to={`/devis?service=${service.slug}`} size="lg">
            Demander un devis
          </ButtonLink>
          <ButtonLink to={`/rendez-vous?service=${service.slug}`} size="lg" variant="outline">
            Prendre rendez-vous
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="bg-ink py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-5 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:gap-16 xl:px-10">
          <div>
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-paper/10 bg-steel">
                <img
                  src={service.gallery[activeImage]}
                  alt={`${service.name} — visuel ${activeImage + 1}`}
                  className="aspect-[16/10] w-full object-cover" />
                
              </div>
              <ul className="mt-3 flex gap-3">
                {service.gallery.map((img, i) =>
                <li key={img + i}>
                    <button
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Afficher le visuel ${i + 1}`}
                    aria-current={i === activeImage}
                    className={cx(
                      'h-20 w-28 overflow-hidden rounded-xl border transition-colors',
                      i === activeImage ? 'border-volt' : 'border-paper/12 hover:border-paper/30'
                    )}>
                    
                      <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </button>
                  </li>
                )}
              </ul>
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-paper lg:text-3xl">
                Notre approche
              </h2>
              {service.description.map((p) =>
              <p key={p} className="mt-5 text-base leading-relaxed text-fog">
                  {p}
                </p>
              )}
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-paper lg:text-3xl">
                Ce que comprend la prestation
              </h2>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {service.deliverables.map((d) =>
                <li
                  key={d}
                  className="flex items-start gap-3 rounded-xl border border-paper/10 bg-coal p-4 text-sm text-paper/85">
                  
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                    {d}
                  </li>
                )}
              </ul>
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-paper lg:text-3xl">
                Questions fréquentes
              </h2>
              <ul className="mt-7 divide-y divide-paper/10 border-y border-paper/10">
                {service.faq.map((item, i) =>
                <li key={item.question}>
                    <h3>
                      <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left">
                      
                        <span className="text-base font-medium text-paper">{item.question}</span>
                        {openFaq === i ?
                      <MinusIcon className="h-4 w-4 shrink-0 text-volt" aria-hidden="true" /> :

                      <PlusIcon className="h-4 w-4 shrink-0 text-fog" aria-hidden="true" />
                      }
                      </button>
                    </h3>
                    {openFaq === i &&
                  <p className="pb-6 pr-8 text-sm leading-relaxed text-fog">{item.answer}</p>
                  }
                  </li>
                )}
              </ul>
            </Reveal>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal className="rounded-3xl border border-paper/10 bg-coal p-7">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-volt">Tarifs indicatifs</h2>
              <ul className="mt-6 space-y-5">
                {service.pricing.map((p) =>
                <li key={p.label} className="border-b border-paper/10 pb-5 last:border-0 last:pb-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-medium text-paper">{p.label}</span>
                      <span className="whitespace-nowrap font-display text-lg font-semibold text-volt">
                        {formatPrice(p.from)}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                      par {p.unit}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-fog">{p.note}</p>
                  </li>
                )}
              </ul>
              <p className="mt-6 rounded-xl bg-ink/60 p-4 text-xs leading-relaxed text-fog">
                Montants HT donnés à titre indicatif. Seul le devis nominatif, établi après qualification du
                besoin, a valeur d’engagement.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <ButtonLink to={`/devis?service=${service.slug}`}>Devis personnalisé</ButtonLink>
                <ButtonLink to={`/rendez-vous?service=${service.slug}`} variant="outline">
                  Réserver un créneau
                </ButtonLink>
              </div>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
                Délai type : {service.duration}
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-6 rounded-3xl border border-paper/10 bg-coal p-7">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-volt">Autres services</h2>
              <ul className="mt-5 space-y-3">
                {others.map((s) =>
                <li key={s.slug}>
                    <Link
                    to={`/services/${s.slug}`}
                    className="flex items-center justify-between gap-3 rounded-xl p-3 text-sm text-paper/80 transition-colors hover:bg-paper/5 hover:text-paper">
                    
                      {s.name}
                      <span className="font-mono text-[10px] text-volt">{s.index}</span>
                    </Link>
                  </li>
                )}
              </ul>
            </Reveal>
          </aside>
        </div>
      </section>

      {related.length > 0 &&
      <section className="border-t border-paper/10 bg-coal py-16 lg:py-24" aria-labelledby="produits-lies">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
            <h2
            id="produits-lies"
            className="font-display text-2xl font-semibold tracking-tight text-paper lg:text-3xl">
            
              Matériel associé à cette prestation
            </h2>
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) =>
            <Reveal key={p.slug} delay={i * 0.06}>
                  <ProductCard product={p} />
                </Reveal>
            )}
            </div>
          </div>
        </section>
      }
    </>);

}