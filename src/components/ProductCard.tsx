import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingBagIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '../data/catalog';
import { useStore } from '../store/useStore';
import { formatPrice, cx } from '../lib/format';
import { StarRating } from './ui/StarRating';

export function ProductCard({ product, compact = false }: {product: Product;compact?: boolean;}) {
  const addToCart = useStore((s) => s.addToCart);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const isFavorite = useStore((s) => s.favorites.includes(product.slug));
  const outOfStock = product.stock === 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-paper/10 bg-coal transition-colors duration-300 hover:border-paper/25">
      <Link
        to={`/boutique/produit/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-steel"
        aria-label={product.name}>
        
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.oldPrice &&
          <span className="rounded-full bg-copper px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink">
              −{Math.round((product.oldPrice - product.price) / product.oldPrice * 100)} %
            </span>
          }
          {product.tags.includes('nouveau') &&
          <span className="rounded-full bg-volt px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink">
              Nouveau
            </span>
          }
        </div>
        {outOfStock &&
        <span className="absolute inset-x-0 bottom-0 bg-ink/90 py-2 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-copper">
            Rupture de stock
          </span>
        }
      </Link>

      <button
        type="button"
        onClick={() => {
          toggleFavorite(product.slug);
          toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
        }}
        aria-label={isFavorite ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`}
        aria-pressed={isFavorite}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 backdrop-blur transition-colors hover:bg-ink">
        
        <HeartIcon
          className={cx('h-4 w-4', isFavorite ? 'fill-volt text-volt' : 'text-paper')}
          aria-hidden="true" />
        
      </button>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">{product.brand}</p>
        <h3 className="mt-2 font-display text-[15px] font-semibold leading-snug text-paper">
          <Link to={`/boutique/produit/${product.slug}`} className="hover:text-volt">
            {product.name}
          </Link>
        </h3>
        {!compact && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-fog">{product.shortDescription}</p>}

        <div className="mt-3 flex items-center gap-2">
          <StarRating value={product.rating} size="sm" />
          <span className="font-mono text-[10px] text-fog">({product.reviews.length})</span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="font-display text-xl font-semibold text-paper">{formatPrice(product.price)}</p>
            {product.oldPrice &&
            <p className="font-mono text-[11px] text-fog line-through">{formatPrice(product.oldPrice)}</p>
            }
          </div>
          <button
            type="button"
            disabled={outOfStock}
            onClick={() => {
              addToCart(product.slug);
              toast.success('Ajouté au panier', { description: product.name });
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-volt text-ink transition-colors hover:bg-[#d8ff6d] disabled:cursor-not-allowed disabled:bg-steel disabled:text-fog"
            aria-label={`Ajouter ${product.name} au panier`}>
            
            <ShoppingBagIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>);

}