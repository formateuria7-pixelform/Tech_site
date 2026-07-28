import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
import { TrendingUpIcon, ShoppingCartIcon, FileTextIcon, CalendarIcon, UsersIcon, BoxIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatPrice, formatDateTime } from '../../lib/format';
import { StatusBadge } from '../ui/StatusBadge';

const CHART_COLORS = ['#C8FF3D', '#E0703C', '#6EA8FE', '#8B929E'];

export function AdminDashboard() {
  const orders = useStore((s) => s.orders);
  const quotes = useStore((s) => s.quotes);
  const appointments = useStore((s) => s.appointments);
  const users = useStore((s) => s.users);
  const catalog = useStore((s) => s.catalog);

  const revenue = orders.filter((o) => o.status !== 'annulee').reduce((a, o) => a + o.total, 0);
  const unitsSold = orders.reduce((a, o) => a + o.lines.reduce((b, l) => b + l.quantity, 0), 0);

  const monthly = React.useMemo(() => {
    const map = new Map<string, {mois: string;ca: number;commandes: number;}>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleDateString('fr-FR', { month: 'short' });
      map.set(key, { mois: key, ca: 0, commandes: 0 });
    }
    orders.forEach((o) => {
      const key = new Date(o.createdAt).toLocaleDateString('fr-FR', { month: 'short' });
      const entry = map.get(key);
      if (entry) {
        entry.ca += o.total;
        entry.commandes += 1;
      }
    });
    return Array.from(map.values());
  }, [orders]);

  const categoryData = React.useMemo(() => {
    const map = new Map<string, number>();
    catalog.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + p.stock));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [catalog]);

  const lowStock = catalog.filter((p) => p.stock <= 8).sort((a, b) => a.stock - b.stock);

  const kpis = [
  { label: 'Chiffre d’affaires', value: formatPrice(revenue), icon: TrendingUpIcon, detail: `${orders.length} commande(s)` },
  { label: 'Commandes', value: String(orders.length), icon: ShoppingCartIcon, detail: `${unitsSold} article(s) vendus` },
  { label: 'Devis', value: String(quotes.length), icon: FileTextIcon, detail: `${quotes.filter((q) => q.status === 'nouvelle').length} à traiter` },
  { label: 'Rendez-vous', value: String(appointments.length), icon: CalendarIcon, detail: `${appointments.filter((a) => a.status === 'confirme').length} confirmé(s)` },
  { label: 'Comptes', value: String(users.length), icon: UsersIcon, detail: `${users.filter((u) => u.role === 'admin').length} administrateur(s)` },
  { label: 'Références', value: String(catalog.length), icon: BoxIcon, detail: `${lowStock.length} en stock faible` }];


  const recent = [
  ...orders.map((o) => ({ date: o.createdAt, label: `Commande ${o.ref}`, status: o.status, amount: o.total })),
  ...quotes.map((q) => ({ date: q.createdAt, label: `Devis ${q.ref}`, status: q.status, amount: q.amount })),
  ...appointments.map((a) => ({ date: a.createdAt, label: `RDV ${a.ref}`, status: a.status, amount: undefined }))].

  sort((a, b) => b.date.localeCompare(a.date)).
  slice(0, 8);

  return (
    <div className="space-y-6">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map(({ label, value, icon: Icon, detail }) =>
        <li key={label} className="rounded-2xl border border-paper/10 bg-coal p-6">
            <div className="flex items-start justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">{label}</p>
              <Icon className="h-4 w-4 text-volt" aria-hidden="true" />
            </div>
            <p className="mt-4 font-display text-2xl font-semibold text-paper">{value}</p>
            <p className="mt-1 text-xs text-fog">{detail}</p>
          </li>
        )}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-paper/10 bg-coal p-6">
          <h2 className="font-display text-base font-semibold text-paper">Chiffre d’affaires — 6 mois</h2>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="ca" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C8FF3D" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#C8FF3D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(244,242,237,0.08)" vertical={false} />
                <XAxis dataKey="mois" stroke="#8B929E" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#8B929E" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#12141A',
                    border: '1px solid rgba(244,242,237,0.12)',
                    borderRadius: 12,
                    fontSize: 12
                  }}
                  formatter={(v: number) => formatPrice(v)} />
                
                <Area type="monotone" dataKey="ca" stroke="#C8FF3D" strokeWidth={2} fill="url(#ca)" name="CA" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-paper/10 bg-coal p-6">
          <h2 className="font-display text-base font-semibold text-paper">Commandes par mois</h2>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid stroke="rgba(244,242,237,0.08)" vertical={false} />
                <XAxis dataKey="mois" stroke="#8B929E" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#8B929E" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: '#12141A',
                    border: '1px solid rgba(244,242,237,0.12)',
                    borderRadius: 12,
                    fontSize: 12
                  }} />
                
                <Bar dataKey="commandes" fill="#C8FF3D" radius={[6, 6, 0, 0]} name="Commandes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-paper/10 bg-coal p-6">
          <h2 className="font-display text-base font-semibold text-paper">Stock par catégorie</h2>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {categoryData.map((_, i) =>
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="none" />
                  )}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#12141A',
                    border: '1px solid rgba(244,242,237,0.12)',
                    borderRadius: 12,
                    fontSize: 12
                  }} />
                
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {categoryData.map((c, i) =>
            <li key={c.name} className="flex items-center gap-2 text-xs text-fog">
                <span
                className="h-2 w-2 rounded-full"
                style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                aria-hidden="true" />
              
                {c.name} ({c.value})
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-paper/10 bg-coal p-6">
          <h2 className="font-display text-base font-semibold text-paper">Activité récente</h2>
          {recent.length === 0 ?
          <p className="mt-5 text-sm text-fog">
              Aucune activité enregistrée. Les commandes, devis et rendez-vous apparaîtront ici.
            </p> :

          <ul className="mt-5 divide-y divide-paper/10">
              {recent.map((r, i) =>
            <li key={i} className="flex flex-wrap items-center gap-3 py-3">
                  <span className="text-sm text-paper">{r.label}</span>
                  <StatusBadge status={r.status} />
                  {r.amount !== undefined &&
              <span className="text-sm text-volt">{formatPrice(r.amount)}</span>
              }
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                    {formatDateTime(r.date)}
                  </span>
                </li>
            )}
            </ul>
          }
        </div>
      </div>

      {lowStock.length > 0 &&
      <div className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-6">
          <h2 className="font-display text-base font-semibold text-paper">Alertes de stock</h2>
          <ul className="mt-4 divide-y divide-paper/10">
            {lowStock.map((p) =>
          <li key={p.slug} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="text-paper">{p.name}</span>
                <span className={p.stock === 0 ? 'font-mono text-red-300' : 'font-mono text-amber-300'}>
                  {p.stock} en stock
                </span>
              </li>
          )}
          </ul>
        </div>
      }
    </div>);

}