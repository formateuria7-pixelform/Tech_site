import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontalIcon, XIcon } from 'lucide-react';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/ProductCard';
import { categories, getCategory } from '../data/catalog';
import { useStore } from '../store/useStore';
import { formatPrice, cx } from '../lib/format';

type SortKey = 'pertinence' | 'prix-asc' | 'prix-desc' | 'note' | 'promo';

const sorts: {key: SortKey;label: string;}[] = [
{ key: 'pertinence', label: 'Pertinence' },
{ key: 'prix-asc', label: 'Prix croissant' },
{ key: 'prix-desc', label: 'Prix décroissant' },
{ key: 'note', label: 'Mieux notés' },
{ key: 'promo', label: 'Promotions' }];


export function Shop() {
  const { category: categoryParam } = useParams();
  const [params, setParams] = useSearchParams();
  const catalog = useStore((s) => s.catalog);

  const activeCategory = categoryParam ? getCategory(categoryParam) : undefined;
  const [sub, setSub] = React.useState<string | null>(null);
  const [brands, setBrands] = React.useState<string[]>([]);
  const [maxPrice, setMaxPrice] = React.useState(1500);
  const [inStockOnly, setInStockOnly] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const sort = params.get('tri') as SortKey ?? 'pertinence';

  React.useEffect(() => {
    setSub(null);
    setBrands([]);
    setMaxPrice(1500);
    setInStockOnly(false);
  }, [categoryParam]);

  const allBrands = React.useMemo(
    () => Array.from(new Set(catalog.map((p) => p.brand))).sort(),
    [catalog]
  );

  const filtered = React.useMemo(() => {
    let list = [...catalog];
    if (activeCategory) list = list.filter((p) => p.category === activeCategory.slug);
    if (sub) list = list.filter((p) => p.subcategory === sub);
    if (brands.length > 0) list = list.filter((p) => brands.includes(p.brand));
    list = list.filter((p) => p.price <= maxPrice);
    if (inStockOnly) list = list.filter((p) => p.stock > 0);
    if (search.trim().length > 1) {
      const q = search.toLowerCase();
      list = list.filter((p) => `${p.name} ${p.brand} ${p.reference}`.toLowerCase().includes(q));
    }
    switch (sort) {
      case 'prix-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'prix-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'note':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'promo':
        list = list.filter((p) => p.oldPrice).sort((a, b) => a.price / a.oldPrice! - b.price / b.oldPrice!);
        break;
      default:
        list.sort((a, b) => Number(b.tags.includes('best-seller')) - Number(a.tags.includes('best-seller')));
    }
    return list;
  }, [catalog, activeCategory, sub, brands, maxPrice, inStockOnly, search, sort]);

  const resetFilters = () => {
    setSub(null);
    setBrands([]);
    setMaxPrice(1500);
    setInStockOnly(false);
    setSearch('');
  };

  const activeFilterCount =
  (sub ? 1 : 0) + brands.length + (maxPrice < 1500 ? 1 : 0) + (inStockOnly ? 1 : 0) + (search ? 1 : 0);

  const filtersPanel =
  <div className="space-y-8">
      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">Recherche</h3>
        <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Nom, marque, référence…"
        aria-label="Filtrer par mot-clé"
        className="mt-4 w-full rounded-xl border border-paper/12 bg-ink px-4 py-2.5 text-sm text-paper placeholder:text-fog/60 focus:border-volt focus:outline-none" />
      
      </div>

      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">Catégories</h3>
        <ul className="mt-4 space-y-1">
          <li>
            <Link
            to="/boutique"
            className={cx(
              'block rounded-lg px-3 py-2 text-sm transition-colors',
              !activeCategory ? 'bg-paper/8 text-paper' : 'text-fog hover:text-paper'
            )}>
            
              Tout le catalogue
            </Link>
          </li>
          {categories.map((c) =>
        <li key={c.slug}>
              <Link
            to={`/boutique/categorie/${c.slug}`}
            className={cx(
              'block rounded-lg px-3 py-2 text-sm transition-colors',
              activeCategory?.slug === c.slug ? 'bg-paper/8 text-paper' : 'text-fog hover:text-paper'
            )}>
            
                {c.name}
              </Link>
              {activeCategory?.slug === c.slug &&
          <ul className="ml-3 mt-1 space-y-1 border-l border-paper/10 pl-3">
                  {c.children.map((child) =>
            <li key={child.slug}>
                      <button
                type="button"
                onClick={() => setSub(sub === child.slug ? null : child.slug)}
                aria-pressed={sub === child.slug}
                className={cx(
                  'w-full rounded-lg px-3 py-1.5 text-left text-[13px] transition-colors',
                  sub === child.slug ? 'text-volt' : 'text-fog hover:text-paper'
                )}>
                
                        {child.name}
                      </button>
                    </li>
            )}
                </ul>
          }
            </li>
        )}
        </ul>
      </div>

      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">Marques</h3>
        <ul className="mt-4 space-y-2.5">
          {allBrands.map((b) =>
        <li key={b}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-fog hover:text-paper">
                <input
              type="checkbox"
              checked={brands.includes(b)}
              onChange={() =>
              setBrands((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b])
              }
              className="h-4 w-4 rounded border-paper/25 bg-ink text-volt accent-volt" />
            
                {b}
              </label>
            </li>
        )}
        </ul>
      </div>

      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">Budget maximum</h3>
        <input
        type="range"
        min={100}
        max={1500}
        step={50}
        value={maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value))}
        aria-label="Prix maximum"
        className="mt-5 w-full accent-volt" />
      
        <p className="mt-2 font-mono text-xs text-fog">Jusqu’à {formatPrice(maxPrice)}</p>
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm text-fog hover:text-paper">
        <input
        type="checkbox"
        checked={inStockOnly}
        onChange={(e) => setInStockOnly(e.target.checked)}
        className="h-4 w-4 rounded border-paper/25 bg-ink accent-volt" />
      
        Uniquement les produits en stock
      </label>

      {activeFilterCount > 0 &&
    <Button variant="outline" size="sm" onClick={resetFilters} className="w-full">
          Réinitialiser les filtres ({activeFilterCount})
        </Button>
    }
    </div>;


  return (
    <>
      <Seo
        title={activeCategory ? activeCategory.name : 'Boutique — matériel professionnel'}
        description={
        activeCategory?.description ??
        'Matériel informatique, réseau, sécurité et bureautique sélectionné pour les professionnels. Livraison offerte dès 500 € HT.'
        } />
      
      <PageHeader
        eyebrow="Boutique"
        title={activeCategory ? activeCategory.name : 'Matériel professionnel'}
        intro={
        activeCategory?.description ??
        'Références sélectionnées pour leur fiabilité, disponibles en stock, garanties de 2 à 5 ans et installables par nos équipes.'
        }
        crumbs={
        activeCategory ?
        [{ label: 'Boutique', to: '/boutique' }, { label: activeCategory.name }] :
        [{ label: 'Boutique' }]
        } />
      

      <section className="bg-ink py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-paper/10 pb-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog">
              {filtered.length} produit{filtered.length > 1 ? 's' : ''}
              {activeFilterCount > 0 && ` — ${activeFilterCount} filtre(s) actif(s)`}
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden">
                
                <SlidersHorizontalIcon className="h-4 w-4" aria-hidden="true" />
                Filtres
              </Button>
              <label className="flex items-center gap-2 text-xs text-fog">
                Trier par
                <select
                  value={sort}
                  onChange={(e) => {
                    const next = new URLSearchParams(params);
                    next.set('tri', e.target.value);
                    setParams(next);
                  }}
                  className="rounded-full border border-paper/15 bg-coal px-3 py-2 text-xs text-paper focus:border-volt focus:outline-none">
                  
                  {sorts.map((s) =>
                  <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  )}
                </select>
              </label>
            </div>
          </div>

          <div className="mt-9 grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-12">
            <aside className="hidden lg:block">
              <div className="sticky top-28">{filtersPanel}</div>
            </aside>

            {filtersOpen &&
            <div className="fixed inset-0 z-[70] flex lg:hidden" role="dialog" aria-modal="true" aria-label="Filtres">
                <button
                type="button"
                className="flex-1 bg-ink/80 backdrop-blur-sm"
                onClick={() => setFiltersOpen(false)}
                aria-label="Fermer les filtres" />
              
                <div className="w-[86%] max-w-sm overflow-y-auto border-l border-paper/12 bg-coal p-6">
                  <div className="mb-7 flex items-center justify-between">
                    <h2 className="font-display text-lg font-semibold text-paper">Filtres</h2>
                    <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    aria-label="Fermer"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-fog hover:bg-paper/5 hover:text-paper">
                    
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                  {filtersPanel}
                  <Button className="mt-8 w-full" onClick={() => setFiltersOpen(false)}>
                    Voir {filtered.length} produit{filtered.length > 1 ? 's' : ''}
                  </Button>
                </div>
              </div>
            }

            <div>
              {filtered.length === 0 ?
              <div className="rounded-3xl border border-paper/10 bg-coal p-12 text-center">
                  <h2 className="font-display text-xl font-semibold text-paper">Aucun produit ne correspond</h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fog">
                    Élargissez votre budget, retirez un filtre de marque, ou demandez-nous une référence
                    spécifique : nous sourçons sur demande.
                  </p>
                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <Button variant="outline" onClick={resetFilters}>
                      Réinitialiser les filtres
                    </Button>
                    <Link
                    to="/devis"
                    className="inline-flex h-11 items-center rounded-full bg-volt px-5 text-sm font-medium text-ink hover:bg-[#d8ff6d]">
                    
                      Demander une référence
                    </Link>
                  </div>
                </div> :

              <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((p, i) =>
                <Reveal as="li" key={p.slug} delay={Math.min(i, 6) * 0.05}>
                      <ProductCard product={p} />
                    </Reveal>
                )}
                </ul>
              }
            </div>
          </div>
        </div>
      </section>
    </>);

}