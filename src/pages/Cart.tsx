import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon, MinusIcon, PlusIcon, TagIcon, TruckIcon, ArrowRightIcon, ShoppingBagIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Button, ButtonLink } from '../components/ui/Button';
import { useCartDetails, useStore } from '../store/useStore';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '../lib/format';

export function Cart() {
  const { lines, subtotal, discount, shipping, tax, total, coupon, count } = useCartDetails();
  const setQuantity = useStore((s) => s.setQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const applyCoupon = useStore((s) => s.applyCoupon);
  const removeCoupon = useStore((s) => s.removeCoupon);
  const clearCart = useStore((s) => s.clearCart);
  const [code, setCode] = React.useState('');
  const navigate = useNavigate();

  const submitCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyCoupon(code);
    if (result.ok) {
      toast.success('Code promotionnel appliqué');
      setCode('');
    } else {
      toast.error(result.error ?? 'Code invalide');
    }
  };

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - (subtotal - discount));

  return (
    <>
      <Seo title="Panier" description="Récapitulatif de votre panier, codes promotionnels, livraison et taxes." />
      <PageHeader
        eyebrow="Boutique"
        title="Votre panier"
        intro={count > 0 ? `${count} article${count > 1 ? 's' : ''} — prix hors taxes, TVA calculée ci-dessous.` : undefined}
        crumbs={[{ label: 'Boutique', to: '/boutique' }, { label: 'Panier' }]} />
      

      <section className="bg-ink py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 xl:px-10">
          {lines.length === 0 ?
          <div className="mx-auto max-w-lg rounded-3xl border border-paper/10 bg-coal p-12 text-center">
              <ShoppingBagIcon className="mx-auto h-10 w-10 text-fog" aria-hidden="true" />
              <h2 className="mt-6 font-display text-2xl font-semibold text-paper">Votre panier est vide</h2>
              <p className="mt-3 text-sm leading-relaxed text-fog">
                Parcourez le catalogue ou demandez-nous un devis si vous cherchez une référence précise.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink to="/boutique">Voir le catalogue</ButtonLink>
                <ButtonLink to="/devis" variant="outline">
                  Demander un devis
                </ButtonLink>
              </div>
            </div> :

          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
              <div>
                <ul className="divide-y divide-paper/10 overflow-hidden rounded-3xl border border-paper/10 bg-coal">
                  {lines.map(({ product, quantity }) =>
                <li key={product.slug} className="flex gap-4 p-5 sm:gap-6 sm:p-6">
                      <Link
                    to={`/boutique/produit/${product.slug}`}
                    className="h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-steel sm:h-28 sm:w-36">
                    
                        <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover" />
                    
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fog">
                              {product.brand}
                            </p>
                            <h2 className="mt-1 font-display text-base font-semibold leading-snug text-paper">
                              <Link to={`/boutique/produit/${product.slug}`} className="hover:text-volt">
                                {product.name}
                              </Link>
                            </h2>
                            <p className="mt-1 font-mono text-[11px] text-fog">Réf. {product.reference}</p>
                          </div>
                          <button
                        type="button"
                        onClick={() => {
                          removeFromCart(product.slug);
                          toast.success('Article retiré du panier');
                        }}
                        aria-label={`Retirer ${product.name} du panier`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-fog transition-colors hover:bg-red-500/10 hover:text-red-300">
                        
                            <TrashIcon className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex h-10 items-center rounded-full border border-paper/15">
                            <button
                          type="button"
                          onClick={() => setQuantity(product.slug, quantity - 1)}
                          aria-label="Diminuer la quantité"
                          className="flex h-full w-9 items-center justify-center rounded-l-full text-paper hover:bg-paper/5">
                          
                              <MinusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <span className="w-8 text-center font-mono text-sm text-paper" aria-live="polite">
                              {quantity}
                            </span>
                            <button
                          type="button"
                          disabled={quantity >= product.stock}
                          onClick={() => setQuantity(product.slug, quantity + 1)}
                          aria-label="Augmenter la quantité"
                          className="flex h-full w-9 items-center justify-center rounded-r-full text-paper hover:bg-paper/5 disabled:opacity-30">
                          
                              <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-display text-lg font-semibold text-paper">
                              {formatPrice(product.price * quantity)}
                            </p>
                            <p className="font-mono text-[10px] text-fog">
                              {formatPrice(product.price)} l’unité
                            </p>
                          </div>
                        </div>

                        {quantity >= product.stock &&
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-300">
                            Quantité maximale disponible atteinte
                          </p>
                    }
                      </div>
                    </li>
                )}
                </ul>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <Link
                  to="/boutique"
                  className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog transition-colors hover:text-volt">
                  
                    ← Continuer mes achats
                  </Link>
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearCart();
                    toast.success('Panier vidé');
                  }}>
                  
                    Vider le panier
                  </Button>
                </div>
              </div>

              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="rounded-3xl border border-paper/10 bg-coal p-7">
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-volt">Récapitulatif</h2>

                  <form onSubmit={submitCoupon} className="mt-6">
                    <label
                    htmlFor="coupon"
                    className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog">
                    
                      Code promotionnel
                    </label>
                    <div className="mt-2 flex gap-2">
                      <input
                      id="coupon"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="OHMEGA10"
                      className="w-full rounded-xl border border-paper/12 bg-ink px-4 py-2.5 text-sm uppercase text-paper placeholder:normal-case placeholder:text-fog/60 focus:border-volt focus:outline-none" />
                    
                      <Button type="submit" variant="outline" size="md" className="shrink-0">
                        Appliquer
                      </Button>
                    </div>
                    {coupon &&
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-volt/25 bg-volt/8 px-4 py-2.5">
                        <span className="flex items-center gap-2 text-xs text-volt">
                          <TagIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          {coupon.label}
                        </span>
                        <button
                      type="button"
                      onClick={() => {
                        removeCoupon();
                        toast.success('Code retiré');
                      }}
                      className="text-xs text-fog underline hover:text-paper">
                      
                          Retirer
                        </button>
                      </div>
                  }
                  </form>

                  <dl className="mt-7 space-y-3 border-t border-paper/10 pt-6 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-fog">Sous-total HT</dt>
                      <dd className="text-paper">{formatPrice(subtotal)}</dd>
                    </div>
                    {discount > 0 &&
                  <div className="flex justify-between">
                        <dt className="text-fog">Remise</dt>
                        <dd className="text-volt">−{formatPrice(discount)}</dd>
                      </div>
                  }
                    <div className="flex justify-between">
                      <dt className="text-fog">Livraison</dt>
                      <dd className="text-paper">{shipping === 0 ? 'Offerte' : formatPrice(shipping)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-fog">TVA 20 %</dt>
                      <dd className="text-paper">{formatPrice(tax)}</dd>
                    </div>
                    <div className="flex items-baseline justify-between border-t border-paper/10 pt-4">
                      <dt className="font-display text-base font-semibold text-paper">Total TTC</dt>
                      <dd className="font-display text-2xl font-semibold text-volt">{formatPrice(total)}</dd>
                    </div>
                  </dl>

                  {remainingForFreeShipping > 0 &&
                <p className="mt-5 flex items-start gap-2 rounded-xl bg-ink/60 p-4 text-xs leading-relaxed text-fog">
                      <TruckIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                      Encore {formatPrice(remainingForFreeShipping)} pour bénéficier de la livraison offerte.
                    </p>
                }

                  <Button size="lg" className="mt-6 w-full" onClick={() => navigate('/paiement')}>
                    Passer au paiement
                    <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                    Paiement sécurisé · Facture PDF fournie
                  </p>
                </div>
              </aside>
            </div>
          }
        </div>
      </section>
    </>);

}