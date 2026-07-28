import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2Icon, DownloadIcon, PackageIcon, MailIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Button, ButtonLink } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { NotFound } from './NotFound';
import { useStore } from '../store/useStore';
import { downloadInvoice } from '../lib/documents';
import { formatPrice, formatDateTime } from '../lib/format';

export function OrderConfirmation() {
  const { ref = '' } = useParams();
  const order = useStore((s) => s.orders.find((o) => o.ref === ref));

  if (!order) return <NotFound />;

  return (
    <>
      <Seo title={`Commande ${order.ref} confirmée`} description="Confirmation de commande et téléchargement de la facture." />
      <PageHeader
        eyebrow="Étape 3 sur 3"
        title="Commande confirmée"
        crumbs={[{ label: 'Boutique', to: '/boutique' }, { label: `Commande ${order.ref}` }]} />
      

      <section className="bg-ink py-14 lg:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-6 xl:px-10">
          <div className="rounded-3xl border border-volt/25 bg-coal p-8 lg:p-10">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="flex items-start gap-4">
                <CheckCircle2Icon className="mt-0.5 h-9 w-9 shrink-0 text-volt" aria-hidden="true" />
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-paper">
                    Merci, votre paiement a été accepté.
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-fog">
                    Référence <span className="font-mono text-paper">{order.ref}</span> — enregistrée le{' '}
                    {formatDateTime(order.createdAt)}.
                  </p>
                </div>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="mt-9 grid gap-6 border-t border-paper/10 pt-8 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                <p className="text-sm text-fog">
                  Confirmation envoyée par e-mail avec la facture en pièce jointe.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <PackageIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                <p className="text-sm text-fog">Préparation sous 24 à 48 h ouvrées, puis expédition suivie.</p>
              </div>
              <div className="flex items-start gap-3">
                <DownloadIcon className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                <p className="text-sm text-fog">Facture disponible à tout moment dans votre espace client.</p>
              </div>
            </div>

            <ul className="mt-9 divide-y divide-paper/10 border-y border-paper/10">
              {order.lines.map((l) =>
              <li key={l.slug} className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <Link to={`/boutique/produit/${l.slug}`} className="text-sm text-paper hover:text-volt">
                      {l.name}
                    </Link>
                    <p className="font-mono text-[11px] text-fog">
                      {l.quantity} × {formatPrice(l.unitPrice)}
                    </p>
                  </div>
                  <span className="text-sm text-paper">{formatPrice(l.unitPrice * l.quantity)}</span>
                </li>
              )}
            </ul>

            <dl className="mt-6 ml-auto max-w-xs space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-fog">Sous-total HT</dt>
                <dd className="text-paper">{formatPrice(order.subtotal)}</dd>
              </div>
              {order.discount > 0 &&
              <div className="flex justify-between">
                  <dt className="text-fog">Remise</dt>
                  <dd className="text-volt">−{formatPrice(order.discount)}</dd>
                </div>
              }
              <div className="flex justify-between">
                <dt className="text-fog">Livraison</dt>
                <dd className="text-paper">{order.shipping === 0 ? 'Offerte' : formatPrice(order.shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fog">TVA 20 %</dt>
                <dd className="text-paper">{formatPrice(order.tax)}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-paper/10 pt-3">
                <dt className="font-display font-semibold text-paper">Total TTC</dt>
                <dd className="font-display text-xl font-semibold text-volt">{formatPrice(order.total)}</dd>
              </div>
            </dl>

            <div className="mt-9 flex flex-wrap gap-3 border-t border-paper/10 pt-8">
              <Button
                onClick={() => {
                  const ok = downloadInvoice(order);
                  if (!ok) toast.error('Autorisez les fenêtres surgissantes pour générer la facture.');
                }}>
                
                <DownloadIcon className="h-4 w-4" aria-hidden="true" />
                Télécharger la facture
              </Button>
              <ButtonLink to="/compte/commandes" variant="outline">
                Suivre ma commande
              </ButtonLink>
              <ButtonLink to="/boutique" variant="ghost">
                Continuer mes achats
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>);

}