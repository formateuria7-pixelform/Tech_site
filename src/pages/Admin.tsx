import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  BoxIcon,
  ShoppingCartIcon,
  FileTextIcon,
  CalendarIcon,
  NewspaperIcon,
  MessageSquareIcon,
  UsersIcon,
  TagIcon,
  ScrollTextIcon,
  DownloadIcon } from
'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { DataTable, type Column } from '../components/admin/DataTable';
import { ProductManager } from '../components/admin/ProductManager';
import { PostManager } from '../components/admin/PostManager';
import {
  useCurrentUser,
  useStore,
  type Order,
  type Quote,
  type Appointment,
  type Comment,
  type Coupon,
  type User } from
'../store/useStore';
import { downloadInvoice, downloadQuote } from '../lib/documents';
import { formatPrice, formatDateTime, cx } from '../lib/format';

const sections = [
{ key: '', label: 'Tableau de bord', icon: LayoutDashboardIcon },
{ key: 'produits', label: 'Produits & stocks', icon: BoxIcon },
{ key: 'commandes', label: 'Commandes', icon: ShoppingCartIcon },
{ key: 'devis', label: 'Devis', icon: FileTextIcon },
{ key: 'rendez-vous', label: 'Rendez-vous', icon: CalendarIcon },
{ key: 'actualites', label: 'Actualités (CMS)', icon: NewspaperIcon },
{ key: 'commentaires', label: 'Commentaires', icon: MessageSquareIcon },
{ key: 'utilisateurs', label: 'Utilisateurs & rôles', icon: UsersIcon },
{ key: 'coupons', label: 'Coupons', icon: TagIcon },
{ key: 'journaux', label: 'Journaux', icon: ScrollTextIcon }];


const selectClass =
'rounded-lg border border-paper/12 bg-ink px-2.5 py-1.5 text-xs text-paper focus:border-volt focus:outline-none';

export function Admin() {
  const { section = '' } = useParams();
  const user = useCurrentUser();

  const orders = useStore((s) => s.orders);
  const quotes = useStore((s) => s.quotes);
  const appointments = useStore((s) => s.appointments);
  const comments = useStore((s) => s.comments);
  const users = useStore((s) => s.users);
  const coupons = useStore((s) => s.coupons);
  const logs = useStore((s) => s.logs);

  const advanceOrder = useStore((s) => s.advanceOrder);
  const setQuoteStatus = useStore((s) => s.setQuoteStatus);
  const setAppointmentStatus = useStore((s) => s.setAppointmentStatus);
  const setCommentStatus = useStore((s) => s.setCommentStatus);
  const setUserRole = useStore((s) => s.setUserRole);
  const saveCoupon = useStore((s) => s.saveCoupon);
  const deleteCoupon = useStore((s) => s.deleteCoupon);

  if (!user) return <Navigate to="/connexion" replace />;
  if (user.role !== 'admin') return <Navigate to="/compte" replace />;

  const orderColumns: Column<Order>[] = [
  { key: 'ref', header: 'Référence', render: (o) => <span className="font-mono text-sm">{o.ref}</span>, exportValue: (o) => o.ref },
  { key: 'date', header: 'Date', render: (o) => formatDateTime(o.createdAt), exportValue: (o) => o.createdAt },
  {
    key: 'client',
    header: 'Client',
    render: (o) => users.find((u) => u.id === o.userId)?.email ?? 'Invité',
    exportValue: (o) => users.find((u) => u.id === o.userId)?.email ?? 'Invité'
  },
  { key: 'total', header: 'Total TTC', render: (o) => formatPrice(o.total), exportValue: (o) => String(o.total) },
  {
    key: 'status',
    header: 'Statut',
    render: (o) =>
    <select
      value={o.status}
      onChange={(e) => {
        advanceOrder(o.id, e.target.value as Order['status']);
        toast.success('Statut de commande mis à jour');
      }}
      aria-label={`Statut de la commande ${o.ref}`}
      className={selectClass}>
      
          {['en-attente', 'payee', 'preparation', 'expediee', 'livree', 'annulee'].map((s) =>
      <option key={s} value={s}>
              {s}
            </option>
      )}
        </select>,

    exportValue: (o) => o.status
  },
  {
    key: 'actions',
    header: 'Facture',
    render: (o) =>
    <Button size="sm" variant="outline" onClick={() => downloadInvoice(o)}>
          <DownloadIcon className="h-3.5 w-3.5" aria-hidden="true" />
          PDF
        </Button>,

    exportValue: () => ''
  }];


  const quoteColumns: Column<Quote>[] = [
  { key: 'ref', header: 'Référence', render: (q) => <span className="font-mono text-sm">{q.ref}</span>, exportValue: (q) => q.ref },
  { key: 'service', header: 'Prestation', render: (q) => q.serviceName, exportValue: (q) => q.serviceName },
  {
    key: 'contact',
    header: 'Demandeur',
    render: (q) =>
    <span>
          <span className="block text-sm">{q.contact.name}</span>
          <span className="font-mono text-[10px] text-fog">{q.contact.email}</span>
        </span>,

    exportValue: (q) => `${q.contact.name} — ${q.contact.email}`
  },
  { key: 'urgency', header: 'Urgence', render: (q) => q.urgency, exportValue: (q) => q.urgency },
  {
    key: 'status',
    header: 'Statut',
    render: (q) =>
    <select
      value={q.status}
      onChange={(e) => {
        setQuoteStatus(q.id, e.target.value as Quote['status']);
        toast.success('Statut du devis mis à jour');
      }}
      aria-label={`Statut du devis ${q.ref}`}
      className={selectClass}>
      
          {['nouvelle', 'en-etude', 'envoye', 'accepte', 'refuse'].map((s) =>
      <option key={s} value={s}>
              {s}
            </option>
      )}
        </select>,

    exportValue: (q) => q.status
  },
  {
    key: 'amount',
    header: 'Montant',
    render: (q) =>
    <input
      type="number"
      min={0}
      placeholder="—"
      defaultValue={q.amount ?? ''}
      onBlur={(e) => {
        const value = Number(e.target.value);
        if (value > 0 && value !== q.amount) {
          setQuoteStatus(q.id, q.status, value);
          toast.success('Montant enregistré');
        }
      }}
      aria-label={`Montant du devis ${q.ref}`}
      className="w-24 rounded-lg border border-paper/12 bg-ink px-2 py-1.5 font-mono text-sm text-paper focus:border-volt focus:outline-none" />,


    exportValue: (q) => q.amount ? String(q.amount) : ''
  },
  {
    key: 'pdf',
    header: 'Document',
    render: (q) =>
    <Button size="sm" variant="outline" onClick={() => downloadQuote(q)}>
          <DownloadIcon className="h-3.5 w-3.5" aria-hidden="true" />
          PDF
        </Button>,

    exportValue: () => ''
  }];


  const appointmentColumns: Column<Appointment>[] = [
  { key: 'ref', header: 'Référence', render: (a) => <span className="font-mono text-sm">{a.ref}</span>, exportValue: (a) => a.ref },
  {
    key: 'date',
    header: 'Créneau',
    render: (a) => `${format(new Date(a.date), 'EEE d MMM yyyy', { locale: fr })} — ${a.slot}`,
    exportValue: (a) => `${a.date} ${a.slot}`
  },
  { key: 'service', header: 'Prestation', render: (a) => a.serviceName, exportValue: (a) => a.serviceName },
  {
    key: 'contact',
    header: 'Client',
    render: (a) =>
    <span>
          <span className="block text-sm">{a.contact.name}</span>
          <span className="font-mono text-[10px] text-fog">{a.contact.phone}</span>
        </span>,

    exportValue: (a) => `${a.contact.name} — ${a.contact.phone}`
  },
  { key: 'mode', header: 'Mode', render: (a) => a.mode, exportValue: (a) => a.mode },
  {
    key: 'status',
    header: 'Statut',
    render: (a) =>
    <select
      value={a.status}
      onChange={(e) => {
        setAppointmentStatus(a.id, e.target.value as Appointment['status']);
        toast.success('Statut du rendez-vous mis à jour');
      }}
      aria-label={`Statut du rendez-vous ${a.ref}`}
      className={selectClass}>
      
          {['demande', 'confirme', 'termine', 'annule'].map((s) =>
      <option key={s} value={s}>
              {s}
            </option>
      )}
        </select>,

    exportValue: (a) => a.status
  }];


  const commentColumns: Column<Comment>[] = [
  { key: 'author', header: 'Auteur', render: (c) => c.author, exportValue: (c) => c.author },
  {
    key: 'post',
    header: 'Article',
    render: (c) =>
    <Link to={`/actualites/${c.postSlug}`} className="text-sm text-paper hover:text-volt">
          {c.postSlug}
        </Link>,

    exportValue: (c) => c.postSlug
  },
  {
    key: 'text',
    header: 'Commentaire',
    render: (c) => <span className="line-clamp-2 max-w-md text-sm text-fog">{c.text}</span>,
    exportValue: (c) => c.text
  },
  { key: 'date', header: 'Date', render: (c) => formatDateTime(c.date), exportValue: (c) => c.date },
  {
    key: 'status',
    header: 'Modération',
    render: (c) =>
    <div className="flex items-center gap-2">
          <StatusBadge status={c.status} />
          {c.status !== 'publie' &&
      <Button size="sm" variant="outline" onClick={() => setCommentStatus(c.id, 'publie')}>
              Publier
            </Button>
      }
          {c.status !== 'rejete' &&
      <Button size="sm" variant="danger" onClick={() => setCommentStatus(c.id, 'rejete')}>
              Rejeter
            </Button>
      }
        </div>,

    exportValue: (c) => c.status
  }];


  const userColumns: Column<User>[] = [
  {
    key: 'name',
    header: 'Utilisateur',
    render: (u) =>
    <span>
          <span className="block text-sm">
            {u.firstName} {u.lastName}
          </span>
          <span className="font-mono text-[10px] text-fog">{u.email}</span>
        </span>,

    exportValue: (u) => `${u.firstName} ${u.lastName} — ${u.email}`
  },
  { key: 'company', header: 'Société', render: (u) => u.company ?? '—', exportValue: (u) => u.company ?? '' },
  { key: 'phone', header: 'Téléphone', render: (u) => u.phone, exportValue: (u) => u.phone },
  { key: 'created', header: 'Inscription', render: (u) => formatDateTime(u.createdAt), exportValue: (u) => u.createdAt },
  {
    key: 'role',
    header: 'Rôle',
    render: (u) =>
    <select
      value={u.role}
      onChange={(e) => {
        setUserRole(u.id, e.target.value as User['role']);
        toast.success('Rôle mis à jour');
      }}
      aria-label={`Rôle de ${u.email}`}
      className={selectClass}>
      
          <option value="client">client</option>
          <option value="admin">admin</option>
        </select>,

    exportValue: (u) => u.role
  }];


  const couponColumns: Column<Coupon>[] = [
  { key: 'code', header: 'Code', render: (c) => <span className="font-mono text-sm">{c.code}</span>, exportValue: (c) => c.code },
  { key: 'label', header: 'Libellé', render: (c) => c.label, exportValue: (c) => c.label },
  { key: 'percent', header: 'Remise', render: (c) => `${c.percent} %`, exportValue: (c) => String(c.percent) },
  {
    key: 'active',
    header: 'Actif',
    render: (c) =>
    <label className="flex items-center gap-2 text-xs text-fog">
          <input
        type="checkbox"
        checked={c.active}
        onChange={(e) => {
          saveCoupon({ ...c, active: e.target.checked });
          toast.success(e.target.checked ? 'Coupon activé' : 'Coupon désactivé');
        }}
        className="h-4 w-4 rounded accent-volt" />
      
          {c.active ? 'Actif' : 'Inactif'}
        </label>,

    exportValue: (c) => c.active ? 'oui' : 'non'
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (c) =>
    <Button
      size="sm"
      variant="danger"
      onClick={() => {
        if (window.confirm(`Supprimer le coupon ${c.code} ?`)) {
          deleteCoupon(c.code);
          toast.success('Coupon supprimé');
        }
      }}>
      
          Supprimer
        </Button>,

    exportValue: () => ''
  }];


  return (
    <>
      <Seo title="Administration" description="Tableau de bord et gestion de la plateforme OHMEGA." />
      <PageHeader eyebrow="Administration" title="Console de gestion" crumbs={[{ label: 'Administration' }]} />

      <section className="bg-ink py-12 lg:py-16">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 sm:px-6 lg:grid-cols-[250px_1fr] lg:gap-12 xl:px-10">
          <nav aria-label="Navigation de l’administration">
            <ul className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-28 lg:flex-col lg:overflow-visible lg:pb-0">
              {sections.map((s) => {
                const Icon = s.icon;
                const active = section === s.key;
                return (
                  <li key={s.key} className="shrink-0">
                    <Link
                      to={s.key ? `/admin/${s.key}` : '/admin'}
                      className={cx(
                        'flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm transition-colors',
                        active ? 'bg-coal text-volt' : 'text-fog hover:bg-coal/60 hover:text-paper'
                      )}>
                      
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {s.label}
                    </Link>
                  </li>);

              })}
            </ul>
          </nav>

          <div className="min-w-0">
            {section === '' && <AdminDashboard />}
            {section === 'produits' && <ProductManager />}
            {section === 'actualites' && <PostManager />}
            {section === 'commandes' &&
            <DataTable
              title="Commandes"
              rows={orders}
              columns={orderColumns}
              rowKey={(o) => o.id}
              searchKeys={(o) => `${o.ref} ${o.status} ${o.lines.map((l) => l.name).join(' ')}`}
              emptyText="Aucune commande enregistrée." />

            }
            {section === 'devis' &&
            <DataTable
              title="Devis"
              rows={quotes}
              columns={quoteColumns}
              rowKey={(q) => q.id}
              searchKeys={(q) => `${q.ref} ${q.serviceName} ${q.contact.name} ${q.contact.email} ${q.status}`}
              emptyText="Aucune demande de devis." />

            }
            {section === 'rendez-vous' &&
            <DataTable
              title="Rendez-vous"
              rows={appointments}
              columns={appointmentColumns}
              rowKey={(a) => a.id}
              searchKeys={(a) => `${a.ref} ${a.serviceName} ${a.contact.name} ${a.status} ${a.mode}`}
              emptyText="Aucun rendez-vous planifié." />

            }
            {section === 'commentaires' &&
            <DataTable
              title="Commentaires"
              rows={comments}
              columns={commentColumns}
              rowKey={(c) => c.id}
              searchKeys={(c) => `${c.author} ${c.text} ${c.postSlug} ${c.status}`}
              emptyText="Aucun commentaire à modérer." />

            }
            {section === 'utilisateurs' &&
            <DataTable
              title="Utilisateurs"
              rows={users}
              columns={userColumns}
              rowKey={(u) => u.id}
              searchKeys={(u) => `${u.firstName} ${u.lastName} ${u.email} ${u.role} ${u.company ?? ''}`}
              emptyText="Aucun utilisateur." />

            }
            {section === 'coupons' &&
            <DataTable
              title="Coupons"
              rows={coupons}
              columns={couponColumns}
              rowKey={(c) => c.code}
              searchKeys={(c) => `${c.code} ${c.label}`}
              emptyText="Aucun coupon configuré."
              actions={
              <Button
                size="sm"
                onClick={() => {
                  const code = window.prompt('Code du coupon (ex. RENTREE10)');
                  if (!code) return;
                  const percent = Number(window.prompt('Remise en pourcentage', '10') ?? '0');
                  if (percent <= 0 || percent > 90) {
                    toast.error('Remise invalide (1 à 90 %).');
                    return;
                  }
                  saveCoupon({
                    code: code.toUpperCase(),
                    percent,
                    label: `${code.toUpperCase()} — ${percent} %`,
                    active: true
                  });
                  toast.success('Coupon créé');
                }}>
                
                    Nouveau coupon
                  </Button>
              } />

            }
            {section === 'journaux' &&
            <DataTable
              title="Journaux d’activité"
              rows={logs}
              columns={[
              { key: 'date', header: 'Horodatage', render: (l) => formatDateTime(l.date), exportValue: (l) => l.date },
              { key: 'actor', header: 'Acteur', render: (l) => l.actor, exportValue: (l) => l.actor },
              { key: 'action', header: 'Action', render: (l) => l.action, exportValue: (l) => l.action }]
              }
              rowKey={(l) => l.id}
              searchKeys={(l) => `${l.actor} ${l.action}`}
              emptyText="Aucun événement journalisé pour le moment."
              pageSize={12} />

            }
          </div>
        </div>
      </section>
    </>);

}