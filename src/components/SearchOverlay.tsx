import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon, CornerDownLeftIcon, XIcon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { services } from '../data/services';
import { formatPrice } from '../lib/format';

type Result = {label: string;sub: string;to: string;kind: string;};

/** Recherche instantanée avec auto-complétion sur produits, services et articles. */
export function SearchOverlay({ open, onClose }: {open: boolean;onClose: () => void;}) {
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(0);
  const catalog = useStore((s) => s.catalog);
  const journal = useStore((s) => s.journal);
  const navigate = useNavigate();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const results = React.useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const items: Result[] = [
    ...catalog.
    filter((p) => `${p.name} ${p.brand} ${p.reference} ${p.shortDescription}`.toLowerCase().includes(q)).
    map((p) => ({
      label: p.name,
      sub: `${p.brand} · ${formatPrice(p.price)}`,
      to: `/boutique/produit/${p.slug}`,
      kind: 'Produit'
    })),
    ...services.
    filter((s) => `${s.name} ${s.summary} ${s.tagline}`.toLowerCase().includes(q)).
    map((s) => ({ label: s.name, sub: s.tagline, to: `/services/${s.slug}`, kind: 'Service' })),
    ...journal.
    filter((p) => `${p.title} ${p.excerpt}`.toLowerCase().includes(q)).
    map((p) => ({ label: p.title, sub: p.category, to: `/actualites/${p.slug}`, kind: 'Article' }))];

    return items.slice(0, 8);
  }, [query, catalog, journal]);

  const go = (to: string) => {
    onClose();
    navigate(to);
  };

  return (
    <AnimatePresence>
      {open &&
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-ink/80 backdrop-blur-md"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Recherche">
        
          <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="mx-auto mt-[10vh] w-[92%] max-w-2xl overflow-hidden rounded-2xl border border-paper/12 bg-coal shadow-2xl shadow-black/70">
          
            <div className="flex items-center gap-3 border-b border-paper/10 px-5">
              <SearchIcon className="h-5 w-5 shrink-0 text-fog" aria-hidden="true" />
              <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setActive((i) => Math.min(results.length - 1, i + 1));
                }
                if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setActive((i) => Math.max(0, i - 1));
                }
                if (e.key === 'Enter' && results[active]) go(results[active].to);
                if (e.key === 'Escape') onClose();
              }}
              placeholder="Rechercher un produit, un service, un article…"
              aria-label="Rechercher"
              className="h-16 w-full bg-transparent text-[15px] text-paper placeholder:text-fog/60 focus:outline-none" />
            
              <button
              type="button"
              onClick={onClose}
              aria-label="Fermer la recherche"
              className="flex h-8 w-8 items-center justify-center rounded-full text-fog hover:bg-paper/5 hover:text-paper">
              
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {query.trim().length < 2 &&
            <p className="px-4 py-6 text-sm text-fog">
                  Saisissez au moins deux caractères. Raccourci&nbsp;: <span className="font-mono">⌘K</span>
                </p>
            }
              {query.trim().length >= 2 && results.length === 0 &&
            <p className="px-4 py-6 text-sm text-fog">
                  Aucun résultat pour « {query} ». Essayez « caméra », « switch » ou « maintenance ».
                </p>
            }
              {results.map((r, i) =>
            <button
              key={`${r.to}-${i}`}
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={() => go(r.to)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
              i === active ? 'bg-paper/8' : 'hover:bg-paper/5'}`
              }>
              
                  <span className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-volt">
                    {r.kind}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-paper">{r.label}</span>
                    <span className="block truncate text-xs text-fog">{r.sub}</span>
                  </span>
                  {i === active && <CornerDownLeftIcon className="h-4 w-4 text-fog" aria-hidden="true" />}
                </button>
            )}
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}