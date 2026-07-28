import React from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, PackageSearchIcon } from 'lucide-react';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Field, Input } from '../components/ui/Field';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useStore, type Order } from '../store/useStore';
import { formatPrice, formatDateTime } from '../lib/format';

const steps: Order['status'][] = ['payee', 'preparation', 'expediee', 'livree'];
const stepLabels: Record<string, string> = {
  payee: 'Paiement confirmé',
  preparation: 'En préparation',
  expediee: 'Expédiée',
  livree: 'Livrée'
};

export function OrderTracking() {
  const orders = useStore((s) => s.orders);
  const [ref, setRef] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [result, setResult] = React.useState<Order | null | 'none'>(null);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find((o) => o.ref.toUpperCase() === ref.trim().toUpperCase());
    setResult(found ?? 'none');
  };

  const currentStep = result && result !== 'none' ? steps.indexOf(result.status) : -1;

  return (
    <>
      <Seo title="Suivi de commande" description="Suivez l’avancement de votre commande avec sa référence." />
      <PageHeader
        eyebrow="Boutique"
        title="Suivre une commande"
        intro="Saisissez la référence figurant sur votre e-mail de confirmation pour connaître l’état d’avancement."
        crumbs={[{ label: 'Suivi de commande' }]} />
      

      <section className="bg-ink py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 xl:px-10">
          <form onSubmit={search} className="rounded-3xl border border-paper/10 bg-coal p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Référence de commande" htmlFor="track-ref" required hint="Format CMD-XXXXXXX">
                <Input
                  id="track-ref"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder="CMD-A1B2C3D"
                  required />
                
              </Field>
              <Field label="E-mail de commande" htmlFor="track-email" required>
                <Input
                  id="track-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.fr"
                  required />
                
              </Field>
            </div>
            <Button type="submit" className="mt-6">
              <SearchIcon className="h-4 w-4" aria-hidden="true" />
              Rechercher ma commande
            </Button>
          </form>

          <div aria-live="polite" className="mt-8">
            {result === 'none' &&
            <div className="rounded-3xl border border-paper/10 bg-coal p-8 text-center">
                <PackageSearchIcon className="mx-auto h-9 w-9 text-fog" aria-hidden="true" />
                <h2 className="mt-5 font-display text-lg font-semibold text-paper">Aucune commande trouvée</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fog">
                  Vérifiez la référence saisie. Si vous êtes connecté, retrouvez l’ensemble de vos commandes
                  dans{' '}
                  <Link to="/compte/commandes" className="text-volt underline">
                    votre espace client
                  </Link>
                  .
                </p>
              </div>
            }

            {result && result !== 'none' &&
            <article className="rounded-3xl border border-paper/10 bg-coal p-7 lg:p-9">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-paper">Commande {result.ref}</h2>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
                      Passée le {formatDateTime(result.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={result.status} />
                </div>

                {result.status !== 'annulee' &&
              <ol className="mt-9 grid gap-4 sm:grid-cols-4">
                    {steps.map((s, i) =>
                <li key={s} className="relative">
                        <div
                    className={`h-1 rounded-full ${i <= currentStep ? 'bg-volt' : 'bg-paper/12'}`}
                    aria-hidden="true" />
                  
                        <p
                    className={`mt-3 text-sm ${i <= currentStep ? 'text-paper' : 'text-fog'}`}>
                    
                          {stepLabels[s]}
                        </p>
                        {i === currentStep &&
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-volt">
                            Étape actuelle
                          </p>
                  }
                      </li>
                )}
                  </ol>
              }

                <ul className="mt-9 space-y-3 border-t border-paper/10 pt-7">
                  {result.timeline.map((t, i) =>
                <li key={`${t.label}-${i}`} className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-paper">{t.label}</span>
                      <span className="font-mono text-[11px] text-fog">{formatDateTime(t.date)}</span>
                    </li>
                )}
                </ul>

                <div className="mt-8 flex items-baseline justify-between border-t border-paper/10 pt-6">
                  <span className="text-sm text-fog">
                    {result.lines.length} article{result.lines.length > 1 ? 's' : ''}
                  </span>
                  <span className="font-display text-xl font-semibold text-volt">{formatPrice(result.total)}</span>
                </div>
              </article>
            }
          </div>
        </div>
      </section>
    </>);

}