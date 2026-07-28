import React from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import {
  UserIcon,
  PackageIcon,
  FileTextIcon,
  CalendarIcon,
  HeartIcon,
  BellIcon,
  FolderIcon,
  SettingsIcon,
  DownloadIcon,
  XIcon,
  CheckIcon,
  TrashIcon,
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Button, ButtonLink } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Field, Input } from '../components/ui/Field';
import { ProductCard } from '../components/ProductCard';
import { useCurrentUser, useStore } from '../store/useStore';
import { downloadInvoice, downloadQuote } from '../lib/documents';
import { formatPrice, formatDateTime, formatDate, cx } from '../lib/format';

const sections = [
  { key: '', label: 'Vue d’ensemble', icon: UserIcon },
  { key: 'commandes', label: 'Commandes', icon: PackageIcon },
  { key: 'devis', label: 'Devis', icon: FileTextIcon },
  { key: 'rendez-vous', label: 'Rendez-vous', icon: CalendarIcon },
  { key: 'favoris', label: 'Favoris', icon: HeartIcon },
  { key: 'notifications', label: 'Notifications', icon: BellIcon },
  { key: 'documents', label: 'Documents', icon: FolderIcon },
  { key: 'parametres', label: 'Paramètres', icon: SettingsIcon },
];

export function Account() {
  const { section = '' } = useParams();
  const user = useCurrentUser();
  const navigate = useNavigate();

  /* ------------------------------------------------------------------
   * IMPORTANT : les sélecteurs Zustand ne doivent JAMAIS créer un nouvel
   * objet/tableau (.filter, .map, .sort, {}, []). On sélectionne les
   * tranches brutes du store, puis on dérive avec useMemo.
   * ------------------------------------------------------------------ */
  const allOrders = useStore((s) => s.orders);
  const allQuotes = useStore((s) => s.quotes);
  const allAppointments = useStore((s) => s.appointments);
  const allNotifications = useStore((s) => s.notifications);
  const favoriteSlugs = useStore((s) => s.favorites);
  const catalog = useStore((s) => s.catalog);

  const markRead = useStore((s) => s.markNotificationRead);
  const markAllRead = useStore((s) => s.markAllNotificationsRead);
  const cancelOrder = useStore((s) => s.cancelOrder);
  const setAppointmentStatus = useStore((s) => s.setAppointmentStatus);
  const rescheduleAppointment = useStore((s) => s.rescheduleAppointment);
  const updateProfile = useStore((s) => s.updateProfile);
  const toggleFavorite = useStore((s) => s.toggleFavorite);

  const userId = user?.id;

  const orders = React.useMemo(
    () => allOrders.filter((o) => o.userId === userId),
    [allOrders, userId],
  );
  const quotes = React.useMemo(
    () => allQuotes.filter((q) => q.userId === userId),
    [allQuotes, userId],
  );
  const appointments = React.useMemo(
    () => allAppointments.filter((a) => a.userId === userId),
    [allAppointments, userId],
  );
  const notifications = React.useMemo(
    () => allNotifications.filter((n) => n.userId === userId),
    [allNotifications, userId],
  );
  const favorites = React.useMemo(
    () => catalog.filter((p) => favoriteSlugs.includes(p.slug)),
    [catalog, favoriteSlugs],
  );
  const unread = React.useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );
  const recentActivity = React.useMemo(
    () =>
      [
        ...orders.map((o) => ({
          date: o.createdAt,
          label: `Commande ${o.ref}`,
          status: o.status as string,
          to: '/compte/commandes',
        })),
        ...quotes.map((q) => ({
          date: q.createdAt,
          label: `Devis ${q.ref}`,
          status: q.status as string,
          to: '/compte/devis',
        })),
        ...appointments.map((a) => ({
          date: a.createdAt,
          label: `Rendez-vous ${a.ref}`,
          status: a.status as string,
          to: '/compte/rendez-vous',
        })),
      ]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 6),
    [orders, quotes, appointments],
  );

  // Les redirections viennent APRÈS tous les hooks (ordre des hooks stable).
  if (!user) return <Navigate to="/connexion" replace />;
  if (user.role === 'admin' && section === '') return <Navigate to="/admin" replace />;

  const summary: [string, number, string][] = [
    ['Commandes', orders.length, '/compte/commandes'],
    ['Devis', quotes.length, '/compte/devis'],
    ['Rendez-vous', appointments.length, '/compte/rendez-vous'],
    ['Favoris', favorites.length, '/compte/favoris'],
  ];

  return (
    <>
      <Seo
        title="Mon espace client"
        description="Suivi de vos commandes, devis, rendez-vous, favoris et documents."
      />
      <PageHeader
        eyebrow={`Bonjour ${user.firstName}`}
        title="Mon espace client"
        crumbs={[{ label: 'Espace client' }]}
      />

      <section className="bg-ink py-12 lg:py-16">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 sm:px-6 lg:grid-cols-[250px_1fr] lg:gap-12 xl:px-10">
          <nav aria-label="Navigation de l’espace client">
            <ul className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-28 lg:flex-col lg:overflow-visible lg:pb-0">
              {sections.map((s) => {
                const active = section === s.key;
                const Icon = s.icon;
                return (
                  <li key={s.key} className="shrink-0">
                    <Link
                      to={s.key ? `/compte/${s.key}` : '/compte'}
                      className={cx(
                        'flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm transition-colors',
                        active ? 'bg-coal text-volt' : 'text-fog hover:bg-coal/60 hover:text-paper',
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {s.label}
                      {s.key === 'notifications' && unread > 0 && (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-volt px-1.5 font-mono text-[10px] font-semibold text-ink">
                          {unread}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div>
            {section === '' && (
              <div className="space-y-8">
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {summary.map(([label, value, to]) => (
                    <li key={label}>
                      <Link
                        to={to}
                        className="block rounded-2xl border border-paper/10 bg-coal p-6 transition-colors hover:border-paper/25"
                      >
                        <p className="font-display text-3xl font-semibold text-volt">{value}</p>
                        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
                          {label}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="rounded-3xl border border-paper/10 bg-coal p-7">
                  <h2 className="font-display text-lg font-semibold text-paper">Vos informations</h2>
                  <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Nom</dt>
                      <dd className="mt-1 text-sm text-paper">
                        {user.firstName} {user.lastName}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">E-mail</dt>
                      <dd className="mt-1 text-sm text-paper">{user.email}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Téléphone</dt>
                      <dd className="mt-1 text-sm text-paper">{user.phone}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Adresse</dt>
                      <dd className="mt-1 text-sm text-paper">
                        {user.address.line1}, {user.address.postalCode} {user.address.city}
                      </dd>
                    </div>
                  </dl>
                  <ButtonLink to="/compte/parametres" variant="outline" size="sm" className="mt-6">
                    Modifier mes informations
                  </ButtonLink>
                </div>

                {recentActivity.length > 0 && (
                  <div className="rounded-3xl border border-paper/10 bg-coal p-7">
                    <h2 className="font-display text-lg font-semibold text-paper">Activité récente</h2>
                    <ul className="mt-5 divide-y divide-paper/10">
                      {recentActivity.map((item) => (
                        <li key={item.label} className="flex flex-wrap items-center gap-3 py-3.5">
                          <Link to={item.to} className="text-sm text-paper hover:text-volt">
                            {item.label}
                          </Link>
                          <StatusBadge status={item.status} />
                          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                            {formatDateTime(item.date)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {recentActivity.length === 0 && (
                  <div className="rounded-3xl border border-paper/10 bg-coal p-10 text-center">
                    <h2 className="font-display text-xl font-semibold text-paper">
                      Aucune activité pour le moment
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fog">
                      Demandez un devis, réservez un créneau ou passez commande : tout apparaîtra ici avec son
                      historique complet.
                    </p>
                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                      <ButtonLink to="/devis">Demander un devis</ButtonLink>
                      <ButtonLink to="/rendez-vous" variant="outline">
                        Prendre rendez-vous
                      </ButtonLink>
                      <ButtonLink to="/boutique" variant="ghost">
                        Voir la boutique
                      </ButtonLink>
                    </div>
                  </div>
                )}
              </div>
            )}

            {section === 'commandes' && (
              <div className="space-y-5">
                {orders.length === 0 ? (
                  <EmptyState
                    title="Aucune commande"
                    text="Vos commandes et leurs factures apparaîtront ici."
                    action={<ButtonLink to="/boutique">Voir le catalogue</ButtonLink>}
                  />
                ) : (
                  orders.map((order) => (
                    <article key={order.id} className="rounded-3xl border border-paper/10 bg-coal p-7">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h2 className="font-display text-lg font-semibold text-paper">
                            Commande {order.ref}
                          </h2>
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                            {formatDateTime(order.createdAt)} — {order.lines.length} article
                            {order.lines.length > 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={order.status} />
                          <span className="font-display text-xl font-semibold text-volt">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>

                      <ul className="mt-6 space-y-2 border-t border-paper/10 pt-5">
                        {order.lines.map((l) => (
                          <li key={l.slug} className="flex justify-between gap-4 text-sm">
                            <Link to={`/boutique/produit/${l.slug}`} className="text-paper hover:text-volt">
                              {l.quantity} × {l.name}
                            </Link>
                            <span className="text-fog">{formatPrice(l.unitPrice * l.quantity)}</span>
                          </li>
                        ))}
                      </ul>

                      <ul className="mt-5 space-y-1.5 border-t border-paper/10 pt-5">
                        {order.timeline.map((t, i) => (
                          <li key={i} className="flex justify-between gap-4 text-xs">
                            <span className="text-paper">{t.label}</span>
                            <span className="font-mono text-fog">{formatDateTime(t.date)}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 flex flex-wrap gap-2 border-t border-paper/10 pt-5">
                        <Button
                          size="sm"
                          onClick={() => {
                            const ok = downloadInvoice(order);
                            if (!ok) toast.error('Autorisez les fenêtres surgissantes.');
                          }}
                        >
                          <DownloadIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          Facture
                        </Button>
                        <ButtonLink to="/suivi-commande" size="sm" variant="outline">
                          Suivre
                        </ButtonLink>
                        {['payee', 'preparation'].includes(order.status) && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              cancelOrder(order.id);
                              toast.success('Demande d’annulation enregistrée');
                            }}
                          >
                            Annuler
                          </Button>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}

            {section === 'devis' && (
              <div className="space-y-5">
                {quotes.length === 0 ? (
                  <EmptyState
                    title="Aucun devis"
                    text="Déposez une demande : vous suivrez ici son statut et les échanges avec nos techniciens."
                    action={<ButtonLink to="/devis">Demander un devis</ButtonLink>}
                  />
                ) : (
                  quotes.map((quote) => (
                    <article key={quote.id} className="rounded-3xl border border-paper/10 bg-coal p-7">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h2 className="font-display text-lg font-semibold text-paper">Devis {quote.ref}</h2>
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                            {quote.serviceName} — {formatDateTime(quote.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={quote.status} />
                          {quote.amount && (
                            <span className="font-display text-xl font-semibold text-volt">
                              {formatPrice(quote.amount)}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="mt-5 border-t border-paper/10 pt-5 text-sm leading-relaxed text-fog">
                        {quote.description}
                      </p>

                      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                        <div>
                          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">Urgence</dt>
                          <dd className="mt-1 text-sm text-paper">{quote.urgency}</dd>
                        </div>
                        <div>
                          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">Budget</dt>
                          <dd className="mt-1 text-sm text-paper">{quote.budget}</dd>
                        </div>
                        <div>
                          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">Lieu</dt>
                          <dd className="mt-1 text-sm text-paper">{quote.address}</dd>
                        </div>
                      </dl>

                      <ul className="mt-5 space-y-3 border-t border-paper/10 pt-5">
                        {quote.messages.map((m, i) => (
                          <li key={i} className="rounded-xl bg-ink/60 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-volt">
                                {m.author}
                              </span>
                              <span className="font-mono text-[10px] text-fog">{formatDateTime(m.date)}</span>
                            </div>
                            <p className="mt-2 text-sm text-fog">{m.text}</p>
                          </li>
                        ))}
                      </ul>

                      <Button
                        size="sm"
                        className="mt-6"
                        onClick={() => {
                          const ok = downloadQuote(quote);
                          if (!ok) toast.error('Autorisez les fenêtres surgissantes.');
                        }}
                      >
                        <DownloadIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        Télécharger le récapitulatif
                      </Button>
                    </article>
                  ))
                )}
              </div>
            )}

            {section === 'rendez-vous' && (
              <div className="space-y-5">
                {appointments.length === 0 ? (
                  <EmptyState
                    title="Aucun rendez-vous"
                    text="Réservez un créneau : vous pourrez le modifier ou l’annuler ici jusqu’à 24 h avant."
                    action={<ButtonLink to="/rendez-vous">Prendre rendez-vous</ButtonLink>}
                  />
                ) : (
                  appointments.map((a) => (
                    <article key={a.id} className="rounded-3xl border border-paper/10 bg-coal p-7">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h2 className="font-display text-lg font-semibold text-paper">
                            {format(new Date(a.date), 'EEEE d MMMM yyyy', { locale: fr })} — {a.slot}
                          </h2>
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                            {a.ref} — {a.serviceName} — {a.mode}
                          </p>
                        </div>
                        <StatusBadge status={a.status} />
                      </div>

                      <dl className="mt-5 grid gap-4 border-t border-paper/10 pt-5 sm:grid-cols-2">
                        <div>
                          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">Lieu</dt>
                          <dd className="mt-1 text-sm text-paper">{a.address}</dd>
                        </div>
                        {a.note && (
                          <div>
                            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                              Précisions
                            </dt>
                            <dd className="mt-1 text-sm text-paper">{a.note}</dd>
                          </div>
                        )}
                      </dl>

                      {a.status === 'confirme' && (
                        <div className="mt-6 flex flex-wrap gap-2 border-t border-paper/10 pt-5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const nextDate = addDays(new Date(a.date), 7);
                              rescheduleAppointment(a.id, nextDate.toISOString(), a.slot);
                              toast.success('Rendez-vous reporté d’une semaine', {
                                description: format(nextDate, 'EEEE d MMMM', { locale: fr }),
                              });
                            }}
                          >
                            Reporter d’une semaine
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              setAppointmentStatus(a.id, 'annule');
                              toast.success('Rendez-vous annulé');
                            }}
                          >
                            <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
                            Annuler
                          </Button>
                        </div>
                      )}
                    </article>
                  ))
                )}
              </div>
            )}

            {section === 'favoris' && (
              <div>
                {favorites.length === 0 ? (
                  <EmptyState
                    title="Aucun favori"
                    text="Ajoutez des produits à vos favoris depuis la boutique pour les retrouver ici."
                    action={<ButtonLink to="/boutique">Voir le catalogue</ButtonLink>}
                  />
                ) : (
                  <>
                    <div className="mb-5 flex items-center justify-between">
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog">
                        {favorites.length} produit{favorites.length > 1 ? 's' : ''}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          favorites.forEach((f) => toggleFavorite(f.slug));
                          toast.success('Favoris vidés');
                        }}
                      >
                        <TrashIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        Tout retirer
                      </Button>
                    </div>
                    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {favorites.map((p) => (
                        <li key={p.slug}>
                          <ProductCard product={p} compact />
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {section === 'notifications' && (
              <div>
                {notifications.length === 0 ? (
                  <EmptyState
                    title="Aucune notification"
                    text="Les confirmations et mises à jour apparaîtront ici."
                  />
                ) : (
                  <>
                    <div className="mb-5 flex items-center justify-between">
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog">
                        {unread} non lue{unread > 1 ? 's' : ''} sur {notifications.length}
                      </p>
                      {unread > 0 && (
                        <Button size="sm" variant="ghost" onClick={() => markAllRead()}>
                          <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          Tout marquer comme lu
                        </Button>
                      )}
                    </div>
                    <ul className="space-y-3">
                      {notifications.map((n) => (
                        <li
                          key={n.id}
                          className={cx(
                            'rounded-2xl border p-5',
                            n.read ? 'border-paper/10 bg-coal' : 'border-volt/25 bg-volt/5',
                          )}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-paper">{n.title}</p>
                              <p className="mt-1.5 text-sm leading-relaxed text-fog">{n.body}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                                {formatDateTime(n.date)}
                              </span>
                              {!n.read && (
                                <button
                                  type="button"
                                  onClick={() => markRead(n.id)}
                                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-volt hover:underline"
                                >
                                  Marquer lu
                                </button>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {section === 'documents' && (
              <div>
                {orders.length === 0 && quotes.length === 0 ? (
                  <EmptyState
                    title="Aucun document"
                    text="Vos factures et récapitulatifs de devis seront disponibles ici."
                  />
                ) : (
                  <ul className="divide-y divide-paper/10 overflow-hidden rounded-3xl border border-paper/10 bg-coal">
                    {orders.map((o) => (
                      <li key={o.id} className="flex flex-wrap items-center gap-4 p-5">
                        <FileTextIcon className="h-5 w-5 shrink-0 text-volt" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-paper">Facture {o.ref}</p>
                          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                            {formatDate(o.createdAt)} — {formatPrice(o.total)}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => downloadInvoice(o)}>
                          <DownloadIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          PDF
                        </Button>
                      </li>
                    ))}
                    {quotes.map((q) => (
                      <li key={q.id} className="flex flex-wrap items-center gap-4 p-5">
                        <FileTextIcon className="h-5 w-5 shrink-0 text-volt" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-paper">Devis {q.ref}</p>
                          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                            {formatDate(q.createdAt)} — {q.serviceName}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => downloadQuote(q)}>
                          <DownloadIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          PDF
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {section === 'parametres' && (
              <ProfileSettings
                onSave={(patch) => {
                  updateProfile(patch);
                  toast.success('Informations mises à jour');
                }}
                onLogout={() => navigate('/')}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-paper/10 bg-coal p-10 text-center">
      <h2 className="font-display text-xl font-semibold text-paper">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fog">{text}</p>
      {action && <div className="mt-7 flex justify-center">{action}</div>}
    </div>
  );
}

function ProfileSettings({
  onSave,
  onLogout,
}: {
  onSave: (patch: Record<string, unknown>) => void;
  onLogout: () => void;
}) {
  const user = useCurrentUser()!;
  const logout = useStore((s) => s.logout);

  const [form, setForm] = React.useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    company: user.company ?? '',
    line1: user.address.line1,
    postalCode: user.address.postalCode,
    city: user.address.city,
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      company: form.company || undefined,
      address: {
        line1: form.line1,
        postalCode: form.postalCode,
        city: form.city,
        country: user.address.country,
      },
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="rounded-3xl border border-paper/10 bg-coal p-7">
        <h2 className="font-display text-lg font-semibold text-paper">Informations personnelles</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Prénom" htmlFor="p-first" required>
            <Input id="p-first" value={form.firstName} onChange={set('firstName')} required />
          </Field>
          <Field label="Nom" htmlFor="p-last" required>
            <Input id="p-last" value={form.lastName} onChange={set('lastName')} required />
          </Field>
          <Field label="E-mail" htmlFor="p-email" required>
            <Input id="p-email" type="email" value={form.email} onChange={set('email')} required />
          </Field>
          <Field label="Téléphone" htmlFor="p-phone" required>
            <Input id="p-phone" type="tel" value={form.phone} onChange={set('phone')} required />
          </Field>
          <Field label="Société" htmlFor="p-company" className="sm:col-span-2">
            <Input id="p-company" value={form.company} onChange={set('company')} />
          </Field>
          <Field label="Adresse" htmlFor="p-line1" required className="sm:col-span-2">
            <Input id="p-line1" value={form.line1} onChange={set('line1')} required />
          </Field>
          <Field label="Code postal" htmlFor="p-cp" required>
            <Input id="p-cp" inputMode="numeric" value={form.postalCode} onChange={set('postalCode')} required />
          </Field>
          <Field label="Ville" htmlFor="p-city" required>
            <Input id="p-city" value={form.city} onChange={set('city')} required />
          </Field>
        </div>
        <Button type="submit" className="mt-7">
          Enregistrer les modifications
        </Button>
      </form>

      <div className="rounded-3xl border border-paper/10 bg-coal p-7">
        <h2 className="font-display text-lg font-semibold text-paper">Session</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Compte créé le {formatDate(user.createdAt)} — rôle : {user.role}.
        </p>
        <Button
          variant="danger"
          className="mt-6"
          onClick={() => {
            logout();
            toast.success('Déconnecté');
            onLogout();
          }}
        >
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}
