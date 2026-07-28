import React from 'react';
import { Seo } from '../components/Seo';
import { PageHeader } from '../components/ui/PageHeader';
import { company } from '../data/content';

type Kind = 'mentions' | 'confidentialite' | 'cgv';

type Block = {heading: string;paragraphs: string[];};

const content: Record<Kind, {title: string;intro: string;blocks: Block[];}> = {
  mentions: {
    title: 'Mentions légales',
    intro: 'Informations légales relatives à l’éditeur et à l’hébergement de ce site.',
    blocks: [
    {
      heading: 'Éditeur du site',
      paragraphs: [
      `${company.legalName}, société par actions simplifiée au capital de 60 000 €, immatriculée au registre du commerce et des sociétés de Lyon sous le numéro ${company.siret}.`,
      `Siège social : ${company.address}. Téléphone : ${company.phone}. Courriel : ${company.email}.`,
      `Numéro de TVA intracommunautaire : ${company.vat}.`]

    },
    {
      heading: 'Responsable de la publication',
      paragraphs: [
      'La direction générale de la société est responsable de la publication des contenus diffusés sur ce site.']

    },
    {
      heading: 'Hébergement',
      paragraphs: [
      'Le site est hébergé sur une infrastructure européenne conforme au RGPD. Les coordonnées complètes de l’hébergeur sont communiquées sur simple demande écrite adressée à l’éditeur.']

    },
    {
      heading: 'Propriété intellectuelle',
      paragraphs: [
      'L’ensemble des éléments du site (structure, textes, visuels, identité graphique, code) est protégé par le droit d’auteur. Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite préalable est interdite.',
      'Les marques et logos des fabricants cités demeurent la propriété de leurs titulaires respectifs.']

    },
    {
      heading: 'Responsabilité',
      paragraphs: [
      'Les informations techniques et les tarifs indicatifs publiés sur ce site sont fournis à titre informatif et ne constituent pas une offre contractuelle. Seul un devis nominatif signé engage les parties.']

    },
    {
      heading: 'Médiation de la consommation',
      paragraphs: [
      'Conformément à l’article L.612-1 du code de la consommation, le consommateur peut recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d’un litige. Les coordonnées du médiateur compétent sont communiquées sur demande.']

    }]

  },
  confidentialite: {
    title: 'Politique de confidentialité',
    intro: 'Traitement de vos données personnelles, finalités, durées de conservation et exercice de vos droits.',
    blocks: [
    {
      heading: 'Responsable du traitement',
      paragraphs: [
      `${company.legalName}, ${company.address}, est responsable des traitements réalisés via ce site. Toute demande relative aux données personnelles peut être adressée à ${company.email}.`]

    },
    {
      heading: 'Données collectées et finalités',
      paragraphs: [
      'Demande de devis : identité, coordonnées, adresse d’intervention, description du besoin et pièces jointes, aux fins d’établir un chiffrage et d’assurer le suivi commercial.',
      'Prise de rendez-vous : identité, coordonnées, adresse et créneau, aux fins de planification de l’intervention et d’envoi des rappels.',
      'Commande en ligne : identité, coordonnées, adresses de livraison et de facturation, historique de commande, aux fins d’exécution du contrat, de facturation et de garantie légale.',
      'Compte client : identifiants d’accès et historique d’activité, aux fins de fourniture de l’espace client.']

    },
    {
      heading: 'Bases légales',
      paragraphs: [
      'Exécution du contrat pour les commandes, devis et rendez-vous. Intérêt légitime pour l’amélioration du service et la sécurité. Obligation légale pour la conservation des pièces comptables. Consentement pour toute communication commerciale.']

    },
    {
      heading: 'Durées de conservation',
      paragraphs: [
      'Prospects sans suite : 3 ans à compter du dernier contact. Clients : durée de la relation contractuelle puis 5 ans. Pièces comptables : 10 ans conformément au code de commerce. Images de vidéoprotection installées chez nos clients : durée définie par le client, généralement 30 jours maximum.']

    },
    {
      heading: 'Destinataires et sous-traitants',
      paragraphs: [
      'Les données sont accessibles aux seuls personnels habilités. Des sous-traitants interviennent pour l’hébergement, l’envoi des courriels transactionnels, le paiement et la livraison. Chacun est lié par un accord de sous-traitance conforme à l’article 28 du RGPD. Aucune donnée n’est transférée hors de l’Union européenne sans garanties appropriées.']

    },
    {
      heading: 'Vos droits',
      paragraphs: [
      'Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité, ainsi que du droit de définir des directives relatives au sort de vos données après votre décès.',
      `Pour exercer ces droits, écrivez à ${company.email} en justifiant de votre identité. Une réponse vous sera adressée dans un délai d’un mois. Vous pouvez également introduire une réclamation auprès de la CNIL.`]

    },
    {
      heading: 'Cookies',
      paragraphs: [
      'Le site n’utilise que des cookies strictement nécessaires à son fonctionnement (session, panier, préférences). Aucun cookie publicitaire ni traceur tiers n’est déposé sans votre consentement explicite.']

    },
    {
      heading: 'Sécurité',
      paragraphs: [
      'Les accès sont protégés par authentification, les mots de passe sont stockés hachés, les échanges sont chiffrés en transit et les accès administratifs sont journalisés. Une revue périodique des habilitations est réalisée.']

    }]

  },
  cgv: {
    title: 'Conditions générales de vente',
    intro: 'Conditions applicables aux ventes de matériel et aux prestations de services réalisées par nos équipes.',
    blocks: [
    {
      heading: 'Article 1 — Objet et champ d’application',
      paragraphs: [
      'Les présentes conditions régissent les ventes de matériel et les prestations d’installation, de maintenance et d’assistance réalisées par l’éditeur, tant auprès de professionnels que de consommateurs. Toute commande implique leur acceptation sans réserve.']

    },
    {
      heading: 'Article 2 — Devis et commande',
      paragraphs: [
      'Les devis sont gratuits et valables 30 jours. La commande est ferme à réception du devis signé ou de la confirmation de commande en ligne. Toute modification demandée en cours d’exécution fait l’objet d’un avenant chiffré.']

    },
    {
      heading: 'Article 3 — Prix et paiement',
      paragraphs: [
      'Les prix sont indiqués hors taxes ; la TVA au taux en vigueur (20 %) est ajoutée lors de la facturation. Le paiement s’effectue par carte bancaire, virement ou tout autre moyen proposé lors de la commande.',
      'Pour les professionnels, tout retard de paiement entraîne de plein droit des pénalités au taux directeur de la BCE majoré de 10 points, ainsi qu’une indemnité forfaitaire de recouvrement de 40 €.']

    },
    {
      heading: 'Article 4 — Livraison',
      paragraphs: [
      'Les produits en stock sont expédiés sous 24 à 48 heures ouvrées. Les frais de port sont offerts à partir de 500 € HT de commande. Les délais annoncés sont indicatifs ; un retard ne peut donner lieu à annulation ni indemnité, sauf faute caractérisée.',
      'Le client vérifie l’état des colis à la réception et formule toute réserve auprès du transporteur.']

    },
    {
      heading: 'Article 5 — Droit de rétractation',
      paragraphs: [
      'Le consommateur dispose d’un délai de 14 jours à compter de la réception pour exercer son droit de rétractation, sans motif. Les produits doivent être retournés complets et dans leur emballage d’origine. Les frais de retour sont à la charge du client, sauf produit non conforme.',
      'Ce droit ne s’applique pas aux prestations de services pleinement exécutées avant la fin du délai avec l’accord exprès du client, ni aux biens personnalisés.']

    },
    {
      heading: 'Article 6 — Garanties',
      paragraphs: [
      'Tous les produits bénéficient de la garantie légale de conformité (2 ans) et de la garantie des vices cachés. Les garanties constructeur, indiquées sur chaque fiche produit, s’y ajoutent.',
      'Les prestations d’installation sont garanties un an sur la main-d’œuvre. Sont exclus les dommages résultant d’une modification par un tiers, d’un défaut d’alimentation électrique ou d’un usage non conforme.']

    },
    {
      heading: 'Article 7 — Exécution des prestations',
      paragraphs: [
      'Le client assure l’accès aux locaux, la mise à disposition de l’alimentation électrique et l’obtention des autorisations nécessaires. Tout report imputable au client moins de 24 heures avant l’intervention peut être facturé au tarif d’un déplacement.']

    },
    {
      heading: 'Article 8 — Responsabilité',
      paragraphs: [
      'La responsabilité de l’éditeur est limitée au montant de la prestation concernée et couverte par une assurance responsabilité civile professionnelle. Les dommages indirects, pertes d’exploitation ou pertes de données ne sont pas indemnisables, sauf faute lourde.']

    },
    {
      heading: 'Article 9 — Réserve de propriété',
      paragraphs: [
      'Les marchandises demeurent la propriété de l’éditeur jusqu’au paiement intégral du prix, le transfert des risques intervenant dès la livraison.']

    },
    {
      heading: 'Article 10 — Litiges',
      paragraphs: [
      'Les présentes conditions sont soumises au droit français. À défaut de résolution amiable, et après recours possible à la médiation de la consommation, le litige relève des tribunaux compétents de Lyon.']

    }]

  }
};

export function Legal({ kind }: {kind: Kind;}) {
  const doc = content[kind];

  return (
    <>
      <Seo title={doc.title} description={doc.intro} />
      <PageHeader eyebrow="Informations légales" title={doc.title} intro={doc.intro} crumbs={[{ label: doc.title }]} />

      <section className="bg-ink py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 xl:px-10">
          <ol className="mb-12 space-y-1.5 rounded-2xl border border-paper/10 bg-coal p-6">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-volt">Sommaire</p>
            {doc.blocks.map((b, i) =>
            <li key={b.heading}>
                <a
                href={`#section-${i}`}
                className="text-sm text-fog transition-colors hover:text-volt">
                
                  {b.heading}
                </a>
              </li>
            )}
          </ol>

          {doc.blocks.map((b, i) =>
          <section key={b.heading} id={`section-${i}`} className="scroll-mt-28 border-t border-paper/10 py-9 first:border-0 first:pt-0">
              <h2 className="font-display text-xl font-semibold tracking-tight text-paper lg:text-2xl">
                {b.heading}
              </h2>
              {b.paragraphs.map((p, j) =>
            <p key={j} className="mt-4 text-sm leading-[1.85] text-fog">
                  {p}
                </p>
            )}
            </section>
          )}

          <p className="mt-10 border-t border-paper/10 pt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
            Dernière mise à jour : juillet 2026
          </p>
        </div>
      </section>
    </>);

}