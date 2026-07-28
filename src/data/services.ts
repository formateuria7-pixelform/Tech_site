/** Catalogue des prestations proposées par OHMEGA. */

export type ServiceFaq = {question: string;answer: string;};

export type Service = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  description: string[];
  image: string;
  gallery: string[];
  deliverables: string[];
  pricing: {label: string;from: number;unit: string;note: string;}[];
  faq: ServiceFaq[];
  relatedProducts: string[];
  duration: string;
  index: string;
};

export const services: Service[] = [
{
  slug: 'installation-electronique',
  name: 'Installation électronique',
  tagline: 'Courants faibles, précision industrielle',
  summary:
  'Conception et pose de systèmes électroniques : automatismes, sonorisation, contrôle d’accès, domotique et câblage courants faibles.',
  description: [
  'Nos équipes interviennent de l’étude de charge jusqu’à la mise en service : relevé sur site, schémas de principe, choix du matériel, pose, paramétrage et recette contradictoire.',
  'Chaque chantier est livré avec un dossier des ouvrages exécutés : plans de câblage, repérage des baies, configuration des équipements et procédure de reprise en cas d’incident.'],

  image: "/df51d3cd-f622-403d-a9db-407b925f5a68.jpg",
  gallery: ["/df51d3cd-f622-403d-a9db-407b925f5a68.jpg", "/9343b94c-2bb9-4fff-b90b-48b8edb41f95.jpg", "/e48d728e-ee45-46db-86a8-13634b27029a.jpg"],




  deliverables: [
  'Étude technique et schémas de principe',
  'Fourniture et pose des équipements',
  'Paramétrage et mise en service',
  'Dossier des ouvrages exécutés (DOE)',
  'Formation des utilisateurs'],

  pricing: [
  { label: 'Audit et étude technique', from: 390, unit: 'forfait', note: 'Déduit du chantier si travaux confirmés' },
  { label: 'Pose et câblage', from: 68, unit: 'heure / technicien', note: 'Matériel facturé séparément' },
  { label: 'Mise en service et recette', from: 540, unit: 'forfait site', note: 'Jusqu’à 20 équipements' }],

  faq: [
  {
    question: 'Intervenez-vous sur un bâtiment déjà occupé ?',
    answer:
    'Oui. Nous planifions les phases bruyantes hors horaires d’exploitation et travaillons par zones pour maintenir l’activité.'
  },
  {
    question: 'Fournissez-vous les certificats de conformité ?',
    answer:
    'Chaque installation est livrée avec le procès-verbal de recette, les fiches produits et les attestations de conformité applicables.'
  }],

  relatedProducts: ['switch-poe-24', 'rack-mural-12u', 'onduleur-1500va'],
  duration: '2 à 15 jours selon surface',
  index: '01'
},
{
  slug: 'systemes-de-securite',
  name: 'Systèmes de sécurité',
  tagline: 'Vidéoprotection, alarme, contrôle d’accès',
  summary:
  'Vidéosurveillance IP, alarme intrusion, contrôle d’accès et interphonie : une chaîne de sécurité cohérente, supervisée et conforme.',
  description: [
  'Nous concevons des dispositifs proportionnés au risque réel : étude des points de passage, calcul des champs de vision, dimensionnement du stockage et politique de rétention conforme au RGPD.',
  'La supervision est centralisée sur une interface unique, accessible depuis un poste de garde ou un mobile, avec journalisation complète des accès et des levées de doute.'],

  image: "/bb948ee0-b416-47c2-a4a3-5413a88bb3f2.jpg",
  gallery: ["/bb948ee0-b416-47c2-a4a3-5413a88bb3f2.jpg", "/df51d3cd-f622-403d-a9db-407b925f5a68.jpg", "/9343b94c-2bb9-4fff-b90b-48b8edb41f95.jpg"],




  deliverables: [
  'Analyse de risque et plan d’implantation',
  'Installation caméras, centrale et lecteurs',
  'Configuration NVR et rétention RGPD',
  'Application de supervision mobile',
  'Registre des traitements et affichage légal'],

  pricing: [
  { label: 'Étude de sûreté', from: 450, unit: 'forfait', note: 'Plan d’implantation inclus' },
  { label: 'Point caméra IP posé', from: 320, unit: 'unité', note: 'Caméra, câblage et paramétrage' },
  { label: 'Contrôle d’accès par porte', from: 690, unit: 'unité', note: 'Lecteur, ventouse, alimentation' }],

  faq: [
  {
    question: 'Comment gérez-vous la conformité RGPD ?',
    answer:
    'Durée de conservation paramétrée, zones privées masquées, registre des traitements fourni et procédure documentée pour les demandes d’accès aux images.'
  },
  {
    question: 'Proposez-vous la télésurveillance ?',
    answer:
    'Oui, via nos partenaires certifiés APSAD. Le raccordement au centre de télésurveillance est optionnel et sans engagement de matériel.'
  }],

  relatedProducts: ['camera-ip-4k', 'nvr-8-canaux', 'onduleur-1500va'],
  duration: '1 à 8 jours',
  index: '02'
},
{
  slug: 'installation-informatique',
  name: 'Installation informatique',
  tagline: 'Réseau, serveurs, postes de travail',
  summary:
  'Déploiement de réseaux structurés, serveurs, Wi-Fi professionnel, postes de travail et sauvegardes pour PME et collectivités.',
  description: [
  'Du câblage cuivre et fibre jusqu’au déploiement des postes, nous industrialisons chaque étape : plan d’adressage, VLAN, politique de sauvegarde 3-2-1 et documentation d’exploitation.',
  'Les migrations sont réalisées par lots avec plan de retour arrière, afin de garantir la continuité de service pendant les heures ouvrées.'],

  image: "/9343b94c-2bb9-4fff-b90b-48b8edb41f95.jpg",
  gallery: ["/9343b94c-2bb9-4fff-b90b-48b8edb41f95.jpg", "/df51d3cd-f622-403d-a9db-407b925f5a68.jpg", "/d3dd891f-9fd1-4284-9086-9db71731d1e7.jpg"],




  deliverables: [
  'Plan d’adressage et segmentation VLAN',
  'Câblage cuivre / fibre certifié',
  'Configuration serveurs et sauvegardes',
  'Déploiement des postes et comptes',
  'Documentation d’exploitation'],

  pricing: [
  { label: 'Prise réseau certifiée', from: 95, unit: 'unité', note: 'Câblage, connectique, test' },
  { label: 'Déploiement poste de travail', from: 140, unit: 'poste', note: 'Image système et migration profil' },
  { label: 'Infrastructure serveur', from: 1450, unit: 'projet', note: 'Selon nombre de services' }],

  faq: [
  {
    question: 'Reprenez-vous une installation existante ?',
    answer:
    'Oui. Nous démarrons par un audit de l’existant, puis proposons un plan de remédiation priorisé par criticité.'
  },
  {
    question: 'Le Wi-Fi est-il dimensionné avant la pose ?',
    answer:
    'Nous réalisons une étude de couverture prédictive puis une mesure sur site après installation, avec rapport de cartographie.'
  }],

  relatedProducts: ['switch-poe-24', 'borne-wifi-6', 'nas-4-baies'],
  duration: '3 à 20 jours',
  index: '03'
},
{
  slug: 'maintenance',
  name: 'Maintenance',
  tagline: 'Préventive, corrective, contractualisée',
  summary:
  'Contrats de maintenance avec engagement de délai, visites préventives planifiées et interventions correctives sur site ou à distance.',
  description: [
  'Trois niveaux de contrat (Essentiel, Pro, Critique) couvrent le parc informatique, la sécurité et les installations électroniques, avec engagement de prise en charge de 1 h à 8 h ouvrées.',
  'Chaque intervention alimente un historique consultable dans votre espace client : diagnostic, pièces remplacées, temps passé et recommandations.'],

  image: "/e48d728e-ee45-46db-86a8-13634b27029a.jpg",
  gallery: ["/e48d728e-ee45-46db-86a8-13634b27029a.jpg", "/d3dd891f-9fd1-4284-9086-9db71731d1e7.jpg", "/9343b94c-2bb9-4fff-b90b-48b8edb41f95.jpg"],




  deliverables: [
  'Inventaire et étiquetage du parc',
  'Visites préventives planifiées',
  'Interventions correctives sous SLA',
  'Rapport trimestriel de disponibilité',
  'Prêt de matériel de remplacement'],

  pricing: [
  { label: 'Contrat Essentiel', from: 89, unit: 'mois', note: 'Jusqu’à 10 équipements, SLA 8 h' },
  { label: 'Contrat Pro', from: 240, unit: 'mois', note: 'Jusqu’à 40 équipements, SLA 4 h' },
  { label: 'Contrat Critique', from: 590, unit: 'mois', note: 'SLA 1 h, astreinte étendue' }],

  faq: [
  {
    question: 'Le déplacement est-il compris ?',
    answer: 'Oui dans un rayon de 60 km. Au-delà, un forfait kilométrique transparent est appliqué et annoncé au devis.'
  },
  {
    question: 'Peut-on changer de niveau de contrat ?',
    answer: 'Le passage à un niveau supérieur est possible à tout moment, la révision à la baisse à chaque échéance annuelle.'
  }],

  relatedProducts: ['onduleur-1500va', 'nas-4-baies', 'station-accueil-usbc'],
  duration: 'Engagement 12 mois',
  index: '04'
},
{
  slug: 'assistance-technique',
  name: 'Assistance technique',
  tagline: 'Support humain, réponse mesurée',
  summary:
  'Hotline, télémaintenance et intervention sur site pour les entreprises comme pour les particuliers, avec suivi de ticket transparent.',
  description: [
  'Un interlocuteur unique prend en charge votre demande, du premier diagnostic jusqu’à la résolution, avec un historique de ticket consultable en continu.',
  'Pour les particuliers, nous proposons des interventions à domicile : dépannage, récupération de données, configuration réseau et accompagnement à l’usage.'],

  image: "/d3dd891f-9fd1-4284-9086-9db71731d1e7.jpg",
  gallery: ["/d3dd891f-9fd1-4284-9086-9db71731d1e7.jpg", "/e48d728e-ee45-46db-86a8-13634b27029a.jpg", "/bb948ee0-b416-47c2-a4a3-5413a88bb3f2.jpg"],




  deliverables: [
  'Hotline et prise en main à distance',
  'Diagnostic écrit sous 2 h ouvrées',
  'Intervention sur site ou à domicile',
  'Récupération de données',
  'Suivi de ticket en ligne'],

  pricing: [
  { label: 'Assistance à distance', from: 45, unit: '30 min', note: 'Sans abonnement' },
  { label: 'Intervention à domicile', from: 79, unit: 'heure', note: 'Déplacement inclus (60 km)' },
  { label: 'Forfait 10 h prépayées', from: 620, unit: 'forfait', note: 'Valable 12 mois' }],

  faq: [
  {
    question: 'Faut-il un abonnement ?',
    answer: 'Non. L’assistance est disponible à l’acte, au forfait prépayé ou incluse dans un contrat de maintenance.'
  },
  {
    question: 'Quels sont vos horaires ?',
    answer: 'Du lundi au vendredi de 8 h à 19 h, le samedi de 9 h à 13 h. Astreinte 24/7 avec le contrat Critique.'
  }],

  relatedProducts: ['station-accueil-usbc', 'ssd-nvme-2to', 'laptop-pro-14'],
  duration: 'Prise en charge sous 2 h',
  index: '05'
},
{
  slug: 'equipement-entreprise',
  name: 'Équipement des entreprises',
  tagline: 'Matériel informatique et bureautique',
  summary:
  'Fourniture, configuration et livraison de matériel informatique et de bureau, avec préparation des postes avant mise en service.',
  description: [
  'Nous sélectionnons des références professionnelles durables et disponibles, puis préparons les postes (image système, comptes, chiffrement) avant livraison.',
  'La reprise et le recyclage certifié de l’ancien matériel sont inclus, avec effacement de données attesté.'],

  image: "/d3dd891f-9fd1-4284-9086-9db71731d1e7.jpg",
  gallery: ["/d3dd891f-9fd1-4284-9086-9db71731d1e7.jpg", "/9343b94c-2bb9-4fff-b90b-48b8edb41f95.jpg", "/e48d728e-ee45-46db-86a8-13634b27029a.jpg"],




  deliverables: [
  'Sélection matérielle chiffrée',
  'Préparation et personnalisation des postes',
  'Livraison et installation sur site',
  'Reprise et recyclage certifié',
  'Garantie étendue optionnelle'],

  pricing: [
  { label: 'Préparation de poste', from: 60, unit: 'poste', note: 'Image, comptes, chiffrement' },
  { label: 'Livraison et installation', from: 120, unit: 'site', note: 'Créneau planifié' },
  { label: 'Location longue durée', from: 29, unit: 'mois / poste', note: 'Matériel et maintenance inclus' }],

  faq: [
  {
    question: 'Proposez-vous des tarifs dégressifs ?',
    answer: 'Oui, à partir de 5 postes. Le devis détaille la remise appliquée par ligne de commande.'
  },
  {
    question: 'Peut-on financer en location ?',
    answer: 'La location longue durée sur 24 ou 36 mois inclut le matériel, la maintenance et le remplacement.'
  }],

  relatedProducts: ['laptop-pro-14', 'ecran-27-qhd', 'imprimante-multifonction'],
  duration: 'Livraison 5 à 10 jours',
  index: '06'
}];


export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}