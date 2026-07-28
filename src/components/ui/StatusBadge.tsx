import React from 'react';
import { cx } from '../../lib/format';

const tone: Record<string, string> = {
  'en-attente': 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  payee: 'border-volt/30 bg-volt/10 text-volt',
  preparation: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
  expediee: 'border-indigo-400/30 bg-indigo-400/10 text-indigo-300',
  livree: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  annulee: 'border-red-400/30 bg-red-400/10 text-red-300',
  nouvelle: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  'en-etude': 'border-sky-400/30 bg-sky-400/10 text-sky-300',
  envoye: 'border-indigo-400/30 bg-indigo-400/10 text-indigo-300',
  accepte: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  refuse: 'border-red-400/30 bg-red-400/10 text-red-300',
  demande: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  confirme: 'border-volt/30 bg-volt/10 text-volt',
  termine: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  'en-moderation': 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  publie: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  rejete: 'border-red-400/30 bg-red-400/10 text-red-300'
};

const labels: Record<string, string> = {
  'en-attente': 'En attente',
  payee: 'Payée',
  preparation: 'En préparation',
  expediee: 'Expédiée',
  livree: 'Livrée',
  annulee: 'Annulée',
  nouvelle: 'Nouvelle',
  'en-etude': 'En étude',
  envoye: 'Devis envoyé',
  accepte: 'Accepté',
  refuse: 'Refusé',
  demande: 'Demandé',
  confirme: 'Confirmé',
  termine: 'Terminé',
  'en-moderation': 'En modération',
  publie: 'Publié',
  rejete: 'Rejeté'
};

export function StatusBadge({ status, className }: {status: string;className?: string;}) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]',
        tone[status] ?? 'border-paper/20 bg-paper/5 text-fog',
        className
      )}>
      
      {labels[status] ?? status}
    </span>);

}