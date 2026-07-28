import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingBagIcon,
  HeartIcon,
  ShareIcon,
  TruckIcon,
  ShieldCheckIcon,
  WrenchIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon } from
'lucide-react';
import { toast } from 'sonner';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { Button, ButtonLink } from '../components/ui/Button';
import { StarRating } from '../components/ui/StarRating';
import { ProductCard } from '../components/ProductCard';
import { Field, Input, Textarea } from '../components/ui/Field';
import { NotFound } from './NotFound';
import { useStore, useCurrentUser } from '../store/useStore';
import { getCategory } from '../data/catalog';
import { formatPrice, formatDate, cx, FREE_SHIPPING_THRESHOLD } from '../lib/format';

type Tab = 'description' | 'specs' | 'avis';

export function ProductDetail() {
  const { slug = '' } = useParams();
  const catalog = useStore((s) => s.catalog);
  const product = catalog.find((p) => p.slug === slug);
  const addToCart = useStore((s) => s.addToCart);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const isFavorite = useStore((s) => s.favorites.includes(slug));
  const addReview = useStore((s) => s.addProductReview);
  const user = useCurrentUser();

  const [image, setImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [tab, setTab] = React.useState<Tab>('description');
  const [reviewName, setReviewName] = React.useState('');
  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewText, setReviewText] = React.useState('');

  React.useEffect(() => {
    setImage(0);
    setQuantity(1);
    setTab('description');
  }, [slug]);

  React.useEffect(() => {
    if (user) setReviewName(`${user.firstName} ${user.lastName.charAt(0)}.`);
  }, [user]);

  if (!product) return <NotFound />;

  const category = getCategory(product.category);
  const similar = catalog.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 3);
  const avg =
  product.reviews.length > 0 ?
  product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length :
  product.rating;

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
        return;
      } catch {

        /* partage annulé par l'utilisateur */}
    }
    await navigator.clipboard.writeText(url);
    toast.success('Lien copié dans le presse-papiers');
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewName.trim().length < 2 || reviewText.trim().length < 10) {
      toast.error('Merci d’indiquer votre nom et un avis d’au moins 10 caractères.');
      return;
    }
    addReview(product.slug, reviewName.trim(), reviewRating, reviewText.trim());
    setReviewText('');
    toast.success('Merci, votre avis est publié.');
  };

  return (
    <>
      <Seo
        title={product.name}
        description={product.shortDescription}
        image={product.images[0]}
        type="product"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          image: product.images,
          description: product.shortDescription,
          sku: product.reference,
          brand: { '@type': 'Brand', name: product.brand },
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'EUR',
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: avg.toFixed(1),
            reviewCount: Math.max(1, product.reviews.length)
          }
        }} />
      
      <PageHeader
        eyebrow={product.brand}
        title={product.name}
        crumbs={[
        { label: 'Boutique', to: '/boutique' },
        ...(category ? [{ label: category.name, to: `/boutique/categorie/${category.slug}` }] : []),
        { label: product.name }]
        } />
      

      <section className="bg-ink py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16 xl:px-10">
          <div>
            <div className="group overflow-hidden rounded-3xl border border-paper/10 bg-steel">
              <img
                src={product.images[image]}
                alt={`${product.name} — vue ${image + 1}`}
                className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.12]" />
              
            </div>
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
              Survolez l’image pour zoomer
            </p>
            {product.images.length > 1 &&
            <ul className="mt-4 flex gap-3">
                {product.images.map((img, i) =>
              <li key={img + i}>
                    <button
                  type="button"
                  onClick={() => setImage(i)}
                  aria-label={`Voir la vue ${i + 1}`}
                  aria-current={i === image}
                  className={cx(
                    'h-20 w-24 overflow-hidden rounded-xl border transition-colors',
                    i === image ? 'border-volt' : 'border-paper/12 hover:border-paper/35'
                  )}>
                  
                      <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </button>
                  </li>
              )}
              </ul>
            }
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-4">
              <StarRating value={avg} showValue />
              <span className="font-mono text-[11px] text-fog">
                {product.reviews.length} avis · Réf. {product.reference}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-4">
              <p className="font-display text-4xl font-semibold tracking-tight text-paper">
                {formatPrice(product.price)}
              </p>
              {product.oldPrice &&
              <>
                  <p className="font-mono text-sm text-fog line-through">{formatPrice(product.oldPrice)}</p>
                  <span className="rounded-full bg-copper px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink">
                    −{Math.round((product.oldPrice - product.price) / product.oldPrice * 100)} %
                  </span>
                </>
              }
            </div>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
              Prix HT — TVA 20 % calculée au panier
            </p>

            <p className="mt-7 text-base leading-relaxed text-fog">{product.shortDescription}</p>

            <div className="mt-7 flex items-center gap-3">
              <span
                className={cx(
                  'h-2 w-2 rounded-full',
                  product.stock > 5 ? 'bg-volt' : product.stock > 0 ? 'bg-amber-400' : 'bg-red-500'
                )}
                aria-hidden="true" />
              
              <span className="text-sm text-paper">
                {product.stock > 5 ?
                `En stock (${product.stock} disponibles)` :
                product.stock > 0 ?
                `Stock limité — ${product.stock} restant${product.stock > 1 ? 's' : ''}` :
                'Rupture de stock — réapprovisionnement sous 10 jours'}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex h-14 items-center rounded-full border border-paper/15">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Diminuer la quantité"
                  className="flex h-full w-12 items-center justify-center rounded-l-full text-paper hover:bg-paper/5">
                  
                  <MinusIcon className="h-4 w-4" aria-hidden="true" />
                </button>
                <span aria-live="polite" className="w-10 text-center font-mono text-sm text-paper">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
                  aria-label="Augmenter la quantité"
                  className="flex h-full w-12 items-center justify-center rounded-r-full text-paper hover:bg-paper/5">
                  
                  <PlusIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <Button
                size="lg"
                disabled={product.stock === 0}
                onClick={() => {
                  addToCart(product.slug, quantity);
                  toast.success('Ajouté au panier', { description: `${quantity} × ${product.name}` });
                }}>
                
                <ShoppingBagIcon className="h-4 w-4" aria-hidden="true" />
                Ajouter au panier
              </Button>

              <button
                type="button"
                onClick={() => {
                  toggleFavorite(product.slug);
                  toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
                }}
                aria-pressed={isFavorite}
                aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-paper/15 transition-colors hover:border-volt">
                
                <HeartIcon
                  className={cx('h-5 w-5', isFavorite ? 'fill-volt text-volt' : 'text-paper')}
                  aria-hidden="true" />
                
              </button>

              <button
                type="button"
                onClick={share}
                aria-label="Partager ce produit"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-paper/15 text-paper transition-colors hover:border-volt hover:text-volt">
                
                <ShareIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <ul className="mt-9 grid gap-3 border-t border-paper/10 pt-8 sm:grid-cols-3">
              <li className="flex items-start gap-3 text-sm text-fog">
                <TruckIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                Livraison offerte dès {formatPrice(FREE_SHIPPING_THRESHOLD)}
              </li>
              <li className="flex items-start gap-3 text-sm text-fog">
                <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                {product.warranty}
              </li>
              <li className="flex items-start gap-3 text-sm text-fog">
                <WrenchIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                Installation possible par nos équipes
              </li>
            </ul>

            <div className="mt-8 rounded-2xl border border-paper/10 bg-coal p-6">
              <h2 className="font-display text-base font-semibold text-paper">
                Besoin de ce matériel installé et configuré ?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-fog">
                Nous chiffrons la pose, le paramétrage et la mise en service avec le produit.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <ButtonLink to={`/devis?produit=${product.slug}`} size="sm">
                  Devis d’installation
                </ButtonLink>
                <ButtonLink to="/rendez-vous" size="sm" variant="outline">
                  Réserver un créneau
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-paper/10 bg-coal py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
          <div role="tablist" aria-label="Informations produit" className="flex flex-wrap gap-2 border-b border-paper/10 pb-4">
            {(
            [
            ['description', 'Description'],
            ['specs', 'Fiche technique'],
            ['avis', `Avis (${product.reviews.length})`]] as
            [Tab, string][]).
            map(([key, label]) =>
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cx(
                'rounded-full px-5 py-2.5 text-sm transition-colors',
                tab === key ? 'bg-volt text-ink' : 'text-fog hover:bg-paper/5 hover:text-paper'
              )}>
              
                {label}
              </button>
            )}
          </div>

          <div className="mt-9 max-w-4xl">
            {tab === 'description' &&
            <div>
                <p className="text-base leading-relaxed text-fog">{product.description}</p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {product.specs.slice(0, 4).map((s) =>
                <li key={s.label} className="flex items-start gap-3 text-sm text-paper/85">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                      <span>
                        <span className="text-fog">{s.label} : </span>
                        {s.value}
                      </span>
                    </li>
                )}
                </ul>
              </div>
            }

            {tab === 'specs' &&
            <dl className="divide-y divide-paper/10 overflow-hidden rounded-2xl border border-paper/10">
                {product.specs.map((s) =>
              <div key={s.label} className="flex flex-col gap-1 bg-ink/40 px-6 py-4 sm:flex-row sm:gap-8">
                    <dt className="w-56 shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
                      {s.label}
                    </dt>
                    <dd className="text-sm text-paper">{s.value}</dd>
                  </div>
              )}
                <div className="flex flex-col gap-1 bg-ink/40 px-6 py-4 sm:flex-row sm:gap-8">
                  <dt className="w-56 shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
                    Garantie
                  </dt>
                  <dd className="text-sm text-paper">{product.warranty}</dd>
                </div>
              </dl>
            }

            {tab === 'avis' &&
            <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
                <div>
                  {product.reviews.length === 0 ?
                <p className="text-sm text-fog">Aucun avis pour le moment. Soyez le premier à en publier un.</p> :

                <ul className="space-y-6">
                      {product.reviews.map((r, i) =>
                  <li key={`${r.author}-${i}`} className="border-b border-paper/10 pb-6 last:border-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-medium text-paper">{r.author}</span>
                            <StarRating value={r.rating} size="sm" />
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                              {formatDate(r.date)}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-fog">{r.comment}</p>
                        </li>
                  )}
                    </ul>
                }
                </div>

                <form
                onSubmit={submitReview}
                className="rounded-2xl border border-paper/10 bg-ink p-6"
                aria-label="Publier un avis">
                
                  <h3 className="font-display text-lg font-semibold text-paper">Publier un avis</h3>
                  <div className="mt-5 space-y-4">
                    <Field label="Votre nom" htmlFor="review-name" required>
                      <Input
                      id="review-name"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="Prénom N."
                      required />
                    
                    </Field>
                    <Field label="Note" htmlFor="review-rating" required>
                      <div id="review-rating" className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((n) =>
                      <button
                        key={n}
                        type="button"
                        onClick={() => setReviewRating(n)}
                        aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
                        aria-pressed={reviewRating === n}
                        className={cx(
                          'h-10 w-10 rounded-xl border font-mono text-sm transition-colors',
                          reviewRating >= n ?
                          'border-volt bg-volt/15 text-volt' :
                          'border-paper/12 text-fog hover:border-paper/30'
                        )}>
                        
                            {n}
                          </button>
                      )}
                      </div>
                    </Field>
                    <Field label="Votre avis" htmlFor="review-text" required>
                      <Textarea
                      id="review-text"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Usage, installation, points forts et limites…"
                      required />
                    
                    </Field>
                    <Button type="submit" className="w-full">
                      Publier mon avis
                    </Button>
                  </div>
                </form>
              </div>
            }
          </div>
        </div>
      </section>

      {similar.length > 0 &&
      <section className="bg-ink py-14 lg:py-20" aria-labelledby="similaires">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
            <div className="flex items-end justify-between gap-4">
              <h2 id="similaires" className="font-display text-2xl font-semibold tracking-tight text-paper lg:text-3xl">
                Produits similaires
              </h2>
              <Link
              to={`/boutique/categorie/${product.category}`}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-volt hover:underline">
              
                Voir la catégorie
              </Link>
            </div>
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p, i) =>
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