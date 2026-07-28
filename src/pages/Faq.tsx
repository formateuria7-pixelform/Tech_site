import React from 'react';
import { PlusIcon, MinusIcon, SearchIcon } from 'lucide-react';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { ButtonLink } from '../components/ui/Button';
import { faq } from '../data/content';
import { cx } from '../lib/format';

export function Faq() {
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState<string | null>(`${faq[0].category}-0`);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return faq;
    return faq.
    map((group) => ({
      ...group,
      items: group.items.filter((i) => `${i.question} ${i.answer}`.toLowerCase().includes(q))
    })).
    filter((g) => g.items.length > 0);
  }, [query]);

  return (
    <>
      <Seo
        title="Questions fréquentes"
        description="Devis, délais, zone d’intervention, livraison, garanties et retours : les réponses aux questions les plus courantes."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.flatMap((g) =>
          g.items.map((i) => ({
            '@type': 'Question',
            name: i.question,
            acceptedAnswer: { '@type': 'Answer', text: i.answer }
          }))
          )
        }} />
      
      <PageHeader
        eyebrow="Aide"
        title="Questions fréquentes"
        intro="Si vous ne trouvez pas votre réponse ici, écrivez-nous : nous répondons sous 2 heures ouvrées."
        crumbs={[{ label: 'FAQ' }]}>
        
        <label className="relative block max-w-md">
          <span className="sr-only">Rechercher dans la FAQ</span>
          <SearchIcon
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog"
            aria-hidden="true" />
          
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une question…"
            className="w-full rounded-full border border-paper/12 bg-ink py-3 pl-11 pr-4 text-sm text-paper placeholder:text-fog/60 focus:border-volt focus:outline-none" />
          
        </label>
      </PageHeader>

      <section className="bg-ink py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
          {filtered.length === 0 ?
          <p className="text-center text-sm text-fog">
              Aucune question ne correspond. Utilisez le formulaire de contact pour nous interroger directement.
            </p> :

          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
              <div className="space-y-12">
                {filtered.map((group) =>
              <Reveal key={group.category}>
                    <section aria-labelledby={`faq-${group.category}`}>
                      <h2
                    id={`faq-${group.category}`}
                    className="font-mono text-[11px] uppercase tracking-[0.24em] text-volt">
                    
                        {group.category}
                      </h2>
                      <ul className="mt-5 divide-y divide-paper/10 border-y border-paper/10">
                        {group.items.map((item, i) => {
                      const key = `${group.category}-${i}`;
                      const isOpen = open === key;
                      return (
                        <li key={item.question}>
                              <h3>
                                <button
                              type="button"
                              onClick={() => setOpen(isOpen ? null : key)}
                              aria-expanded={isOpen}
                              className="flex w-full items-center justify-between gap-5 py-5 text-left">
                              
                                  <span
                                className={cx(
                                  'text-base font-medium transition-colors',
                                  isOpen ? 'text-volt' : 'text-paper'
                                )}>
                                
                                    {item.question}
                                  </span>
                                  {isOpen ?
                              <MinusIcon className="h-4 w-4 shrink-0 text-volt" aria-hidden="true" /> :

                              <PlusIcon className="h-4 w-4 shrink-0 text-fog" aria-hidden="true" />
                              }
                                </button>
                              </h3>
                              {isOpen &&
                          <p className="max-w-2xl pb-6 pr-8 text-sm leading-relaxed text-fog">
                                  {item.answer}
                                </p>
                          }
                            </li>);

                    })}
                      </ul>
                    </section>
                  </Reveal>
              )}
              </div>

              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="rounded-3xl border border-paper/10 bg-coal p-7">
                  <h2 className="font-display text-xl font-semibold tracking-tight text-paper">
                    Votre question n’est pas là ?
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-fog">
                    Écrivez-nous ou appelez-nous. Pour un besoin chiffré, la demande de devis est la voie la
                    plus rapide.
                  </p>
                  <div className="mt-6 flex flex-col gap-2">
                    <ButtonLink to="/contact">Nous contacter</ButtonLink>
                    <ButtonLink to="/devis" variant="outline">
                      Demander un devis
                    </ButtonLink>
                  </div>
                </div>
              </aside>
            </div>
          }
        </div>
      </section>
    </>);

}