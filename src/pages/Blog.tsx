import React from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { useStore } from '../store/useStore';
import { formatDate, cx } from '../lib/format';

const CATEGORIES = ['Toutes', 'Sécurité', 'Informatique', 'Conseils', 'Entreprise'] as const;

export function Blog() {
  const journal = useStore((s) => s.journal);
  const [category, setCategory] = React.useState<(typeof CATEGORIES)[number]>('Toutes');
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    let list = [...journal].sort((a, b) => b.date.localeCompare(a.date));
    if (category !== 'Toutes') list = list.filter((p) => p.category === category);
    if (query.trim().length > 1) {
      const q = query.toLowerCase();
      list = list.filter((p) => `${p.title} ${p.excerpt} ${p.author}`.toLowerCase().includes(q));
    }
    return list;
  }, [journal, category, query]);

  const [featured, ...rest] = filtered;

  return (
    <>
      <Seo
        title="Actualités et conseils techniques"
        description="Retours d’expérience, veille technique et conseils pratiques sur la sécurité, les réseaux, l’informatique et la maintenance." />
      
      <PageHeader
        eyebrow="Actualités"
        title="Conseils et veille technique"
        intro="Ce que nous apprenons sur le terrain, mis en forme pour vous aider à décider."
        crumbs={[{ label: 'Actualités' }]} />
      

      <section className="bg-ink py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
          <div className="flex flex-col gap-5 border-b border-paper/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <ul className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrer par catégorie">
              {CATEGORIES.map((c) =>
              <li key={c}>
                  <button
                  type="button"
                  role="tab"
                  aria-selected={category === c}
                  onClick={() => setCategory(c)}
                  className={cx(
                    'rounded-full px-4 py-2 text-sm transition-colors',
                    category === c ? 'bg-volt text-ink' : 'text-fog hover:bg-paper/5 hover:text-paper'
                  )}>
                  
                    {c}
                  </button>
                </li>
              )}
            </ul>
            <label className="relative w-full lg:w-72">
              <span className="sr-only">Rechercher un article</span>
              <SearchIcon
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog"
                aria-hidden="true" />
              
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un article…"
                className="w-full rounded-full border border-paper/12 bg-coal py-2.5 pl-11 pr-4 text-sm text-paper placeholder:text-fog/60 focus:border-volt focus:outline-none" />
              
            </label>
          </div>

          {filtered.length === 0 ?
          <p className="mt-14 text-center text-sm text-fog">
              Aucun article ne correspond à cette recherche.
            </p> :

          <>
              <Reveal className="mt-12">
                <article className="group grid gap-0 overflow-hidden rounded-3xl border border-paper/10 bg-coal lg:grid-cols-2">
                  <Link
                  to={`/actualites/${featured.slug}`}
                  className="aspect-[16/10] overflow-hidden bg-steel lg:aspect-auto lg:min-h-[360px]">
                  
                    <img
                    src={featured.image}
                    alt={featured.title}
                    className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100" />
                  
                  </Link>
                  <div className="flex flex-col justify-center p-7 lg:p-12">
                    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
                      <span className="text-volt">À la une</span>
                      <span className="text-fog">{featured.category}</span>
                      <span className="text-fog">{featured.readingTime} min</span>
                    </div>
                    <h2 className="mt-5 font-display text-2xl font-semibold leading-tight tracking-tight text-paper lg:text-4xl">
                      <Link to={`/actualites/${featured.slug}`} className="hover:text-volt">
                        {featured.title}
                      </Link>
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-fog">{featured.excerpt}</p>
                    <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
                      {featured.author} — {formatDate(featured.date)}
                    </p>
                  </div>
                </article>
              </Reveal>

              {rest.length > 0 &&
            <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) =>
              <Reveal as="li" key={post.slug} delay={i * 0.06}>
                      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-paper/10 bg-coal transition-colors hover:border-paper/25">
                        <Link to={`/actualites/${post.slug}`} className="block aspect-[16/9] overflow-hidden bg-steel">
                          <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100" />
                    
                        </Link>
                        <div className="flex flex-1 flex-col p-6">
                          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em]">
                            <span className="text-volt">{post.category}</span>
                            <span className="text-fog">{post.readingTime} min</span>
                          </div>
                          <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-paper">
                            <Link to={`/actualites/${post.slug}`} className="hover:text-volt">
                              {post.title}
                            </Link>
                          </h3>
                          <p className="mt-3 flex-1 line-clamp-3 text-sm leading-relaxed text-fog">
                            {post.excerpt}
                          </p>
                          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
                            {formatDate(post.date)}
                          </p>
                        </div>
                      </article>
                    </Reveal>
              )}
                </ul>
            }
            </>
          }
        </div>
      </section>
    </>);

}