/**
 * Génération de documents téléchargeables côté client (facture, devis).
 * Le document est produit en HTML imprimable puis ouvert dans un onglet
 * dédié où l'utilisateur peut l'enregistrer en PDF via l'impression.
 */
import type { Order, Quote } from '../store/useStore';
import { company } from '../data/content';
import { formatPrice, formatDate, formatDateTime } from './format';

const styles = `
  *{box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111;margin:0;padding:48px;background:#fff}
  header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #111;padding-bottom:24px}
  .logo{font-size:28px;font-weight:800;letter-spacing:-0.03em}
  .muted{color:#666;font-size:12px;line-height:1.7}
  h1{font-size:20px;margin:32px 0 4px}
  table{width:100%;border-collapse:collapse;margin-top:24px;font-size:13px}
  th{text-align:left;border-bottom:1px solid #111;padding:10px 8px;font-size:11px;text-transform:uppercase;letter-spacing:.08em}
  td{padding:10px 8px;border-bottom:1px solid #eee}
  td.num,th.num{text-align:right}
  .totals{margin-top:24px;margin-left:auto;width:300px;font-size:13px}
  .totals div{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #eee}
  .totals .grand{border-bottom:none;border-top:2px solid #111;font-size:17px;font-weight:700;padding-top:12px}
  footer{margin-top:56px;border-top:1px solid #ddd;padding-top:16px;font-size:11px;color:#666;line-height:1.7}
  .grid{display:flex;gap:48px;margin-top:32px;font-size:13px;line-height:1.7}
  .grid h2{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#666;margin:0 0 6px}
  @media print{body{padding:24px}}
`;

function open(html: string, title: string) {
  const win = window.open('', '_blank', 'width=900,height=1000');
  if (!win) return false;
  win.document.write(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${title}</title><style>${styles}</style></head><body>${html}<script>window.onload=function(){setTimeout(function(){window.print()},250)}</script></body></html>`
  );
  win.document.close();
  return true;
}

const header = `
  <header>
    <div>
      <div class="logo">Ω ${company.name}</div>
      <p class="muted">${company.legalName}<br/>${company.address}<br/>${company.phone} — ${company.email}<br/>SIRET ${company.siret} — TVA ${company.vat}</p>
    </div>
  </header>
`;

export function downloadInvoice(order: Order): boolean {
  const rows = order.lines.
  map(
    (l) => `<tr>
        <td>${l.name}</td>
        <td class="num">${l.quantity}</td>
        <td class="num">${formatPrice(l.unitPrice)}</td>
        <td class="num">${formatPrice(l.unitPrice * l.quantity)}</td>
      </tr>`
  ).
  join('');

  return open(
    `${header}
    <h1>Facture ${order.ref}</h1>
    <p class="muted">Émise le ${formatDate(order.createdAt)} — Paiement : ${order.paymentMethod}</p>
    <div class="grid">
      <div>
        <h2>Adresse de livraison</h2>
        ${order.shippingAddress.line1}<br/>${order.shippingAddress.postalCode} ${order.shippingAddress.city}<br/>${order.shippingAddress.country}
      </div>
      <div>
        <h2>Adresse de facturation</h2>
        ${order.billingAddress.line1}<br/>${order.billingAddress.postalCode} ${order.billingAddress.city}<br/>${order.billingAddress.country}
      </div>
    </div>
    <table>
      <thead><tr><th>Désignation</th><th class="num">Qté</th><th class="num">P.U. HT</th><th class="num">Total HT</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="totals">
      <div><span>Sous-total HT</span><span>${formatPrice(order.subtotal)}</span></div>
      ${order.discount > 0 ? `<div><span>Remise ${order.couponCode ?? ''}</span><span>−${formatPrice(order.discount)}</span></div>` : ''}
      <div><span>Livraison</span><span>${order.shipping === 0 ? 'Offerte' : formatPrice(order.shipping)}</span></div>
      <div><span>TVA 20 %</span><span>${formatPrice(order.tax)}</span></div>
      <div class="grand"><span>Total TTC</span><span>${formatPrice(order.total)}</span></div>
    </div>
    <footer>
      Règlement à réception. Pénalités de retard : taux BCE majoré de 10 points. Indemnité forfaitaire de recouvrement : 40 €.<br/>
      Document généré le ${formatDateTime(new Date().toISOString())}.
    </footer>`,
    `Facture ${order.ref}`
  );
}

export function downloadQuote(quote: Quote): boolean {
  return open(
    `${header}
    <h1>Demande de devis ${quote.ref}</h1>
    <p class="muted">Déposée le ${formatDate(quote.createdAt)} — Statut : ${quote.status}</p>
    <div class="grid">
      <div>
        <h2>Demandeur</h2>
        ${quote.contact.name}<br/>${quote.contact.company ?? ''}<br/>${quote.contact.email}<br/>${quote.contact.phone}
      </div>
      <div>
        <h2>Lieu d’intervention</h2>
        ${quote.address}
      </div>
    </div>
    <table>
      <thead><tr><th>Élément</th><th>Détail</th></tr></thead>
      <tbody>
        <tr><td>Prestation</td><td>${quote.serviceName}</td></tr>
        <tr><td>Niveau d’urgence</td><td>${quote.urgency}</td></tr>
        <tr><td>Budget indiqué</td><td>${quote.budget}</td></tr>
        <tr><td>Pièces jointes</td><td>${quote.attachments.length > 0 ? quote.attachments.join(', ') : 'Aucune'}</td></tr>
        ${quote.amount ? `<tr><td>Montant proposé</td><td>${formatPrice(quote.amount)} HT</td></tr>` : ''}
      </tbody>
    </table>
    <h1 style="margin-top:32px">Description du besoin</h1>
    <p style="font-size:13px;line-height:1.8;white-space:pre-wrap">${quote.description}</p>
    <footer>
      Ce document récapitule votre demande. Il ne constitue pas une offre commerciale : le devis chiffré
      vous sera adressé après qualification, sous 48 heures ouvrées.<br/>
      Document généré le ${formatDateTime(new Date().toISOString())}.
    </footer>`,
    `Devis ${quote.ref}`
  );
}