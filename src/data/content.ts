/** Contenus éditoriaux : actualités, témoignages, réalisations, FAQ, partenaires, entreprise. */

export const company = {
  name: 'OHMEGA',
  legalName: 'OHMEGA Solutions SAS',
  claim: 'Électronique, sécurité et informatique — installées comme il faut.',
  since: 2009,
  address: '18 rue des Ateliers, 69007 Lyon',
  phone: '+33 4 28 91 44 10',
  email: 'contact@ohmega-solutions.fr',
  siret: '512 884 902 00034',
  vat: 'FR91512884902',
  hours: [
  { day: 'Lundi — Vendredi', value: '08:00 — 19:00' },
  { day: 'Samedi', value: '09:00 — 13:00' },
  { day: 'Dimanche', value: 'Astreinte contrat Critique' }]

};

export const stats = [
{ value: 1840, suffix: '', label: 'Interventions réalisées', detail: 'Depuis 2009' },
{ value: 96, suffix: '%', label: 'Chantiers livrés dans les délais', detail: 'Moyenne 2025-2026' },
{ value: 2, suffix: ' h', label: 'Délai moyen de prise en charge', detail: 'Support ouvré' },
{ value: 320, suffix: '', label: 'Clients sous contrat', detail: 'PME, collectivités, particuliers' }];


export type Realisation = {
  slug: string;
  title: string;
  client: string;
  sector: string;
  year: number;
  image: string;
  summary: string;
  metrics: {label: string;value: string;}[];
};

export const realisations: Realisation[] = [
{
  slug: 'siege-logistique-vitrolles',
  title: 'Vidéoprotection et contrôle d’accès d’une plateforme logistique',
  client: 'Groupe Transval',
  sector: 'Logistique',
  year: 2026,
  image: "/bb948ee0-b416-47c2-a4a3-5413a88bb3f2.jpg",
  summary:
  '42 points caméra, 11 portes sous contrôle d’accès et supervision unifiée sur 14 000 m², déployés par phases sans arrêt d’exploitation.',
  metrics: [
  { label: 'Points caméra', value: '42' },
  { label: 'Durée du chantier', value: '6 semaines' },
  { label: 'Arrêt d’exploitation', value: '0 heure' }]

},
{
  slug: 'refonte-reseau-clinique',
  title: 'Refonte complète du réseau d’une clinique',
  client: 'Clinique Sainte-Foy',
  sector: 'Santé',
  year: 2025,
  image: "/9343b94c-2bb9-4fff-b90b-48b8edb41f95.jpg",
  summary:
  'Câblage catégorie 6A, segmentation par VLAN métiers, Wi-Fi 6 sur 5 niveaux et sauvegarde répliquée sur site distant.',
  metrics: [
  { label: 'Prises certifiées', value: '380' },
  { label: 'Bornes Wi-Fi', value: '46' },
  { label: 'Disponibilité mesurée', value: '99,98 %' }]

},
{
  slug: 'equipement-cabinet-avocats',
  title: 'Équipement et infogérance d’un cabinet d’avocats',
  client: 'Cabinet Delmas & Associés',
  sector: 'Services juridiques',
  year: 2025,
  image: "/d3dd891f-9fd1-4284-9086-9db71731d1e7.jpg",
  summary:
  '28 postes préparés et chiffrés, impression sécurisée par code, sauvegarde immuable et contrat de maintenance Pro.',
  metrics: [
  { label: 'Postes déployés', value: '28' },
  { label: 'Migration', value: '1 week-end' },
  { label: 'Tickets / mois', value: '4 en moyenne' }]

},
{
  slug: 'domotique-residence',
  title: 'Automatismes et alarme d’une résidence privée',
  client: 'Résidence Les Terrasses',
  sector: 'Habitat',
  year: 2024,
  image: "/df51d3cd-f622-403d-a9db-407b925f5a68.jpg",
  summary:
  'Contrôle d’accès résidents, interphonie IP, éclairage automatisé des parties communes et alarme intrusion des locaux techniques.',
  metrics: [
  { label: 'Logements', value: '64' },
  { label: 'Portails automatisés', value: '3' },
  { label: 'Économie éclairage', value: '−38 %' }]

}];


export type Testimonial = {
  author: string;
  role: string;
  company: string;
  quote: string;
  service: string;
};

export const testimonials: Testimonial[] = [
{
  author: 'Nadia Fabre',
  role: 'Directrice d’exploitation',
  company: 'Groupe Transval',
  quote:
  'Le chantier a été mené par phases, de nuit, sans jamais interrompre nos flux. Le dossier de recette est le plus complet que nous ayons reçu.',
  service: 'Systèmes de sécurité'
},
{
  author: 'Dr. Pierre Vasseur',
  role: 'Directeur général',
  company: 'Clinique Sainte-Foy',
  quote:
  'Nous avions un réseau vieillissant et critique. La migration a été planifiée service par service, avec un plan de retour arrière à chaque étape.',
  service: 'Installation informatique'
},
{
  author: 'Claire Delmas',
  role: 'Associée',
  company: 'Cabinet Delmas & Associés',
  quote:
  'Un interlocuteur unique, des délais tenus et une facturation lisible. Notre parc est enfin documenté et sauvegardé correctement.',
  service: 'Maintenance'
},
{
  author: 'Marc Ollivier',
  role: 'Particulier',
  company: 'Lyon 3e',
  quote:
  'Dépannage à domicile le lendemain de mon appel, données récupérées et explications claires. Rien à redire.',
  service: 'Assistance technique'
}];


export const partners = [
'Neteon', 'Vigilis', 'Arkos', 'Corevolt', 'Printeria', 'Structo', 'Axelia', 'Voltis'];


export type Post = {
  slug: string;
  title: string;
  category: 'Sécurité' | 'Informatique' | 'Conseils' | 'Entreprise';
  excerpt: string;
  date: string;
  readingTime: number;
  author: string;
  image: string;
  body: string[];
};

export const posts: Post[] = [
{
  slug: 'choisir-videoprotection-2026',
  title: 'Choisir sa vidéoprotection en 2026 : les 6 questions à se poser',
  category: 'Sécurité',
  excerpt:
  'Résolution, rétention, analyse embarquée, conformité RGPD : les critères qui comptent réellement avant de signer un devis de vidéoprotection.',
  date: '2026-07-14',
  readingTime: 7,
  author: 'Nadia Fabre',
  image: "/bb948ee0-b416-47c2-a4a3-5413a88bb3f2.jpg",
  body: [
  'La tentation est grande de comparer les offres de vidéoprotection à la seule résolution des caméras. C’est pourtant rarement le facteur limitant : un capteur 4K mal positionné produit une image inexploitable, là où une caméra 4 MP bien orientée identifie sans ambiguïté.',
  'Commencez par définir l’objectif de chaque point de vue : dissuader, détecter, reconnaître ou identifier. Ces quatre niveaux imposent des densités de pixels très différentes sur la zone d’intérêt, et donc des optiques et des distances de pose distinctes.',
  'Vient ensuite la rétention. Trente jours sont un maximum usuel en France pour la plupart des finalités : au-delà, la justification devient difficile. Le calcul du stockage doit intégrer le flux réel en H.265+, pas le débit maximal théorique.',
  'L’analyse embarquée réduit fortement le bruit d’exploitation : franchissement de ligne, intrusion de zone et filtrage humain/véhicule évitent des centaines d’alertes inutiles par semaine. Exigez une démonstration sur votre site, pas une vidéo de catalogue.',
  'Enfin, la conformité : information des personnes, masquage des zones privées, registre des traitements, gestion des demandes d’accès. Un installateur sérieux vous remet ces éléments avec la recette, sans que vous ayez à les demander.']

},
{
  slug: 'sauvegarde-3-2-1-pme',
  title: 'La règle 3-2-1 appliquée concrètement dans une PME',
  category: 'Informatique',
  excerpt:
  'Trois copies, deux supports, une hors site : comment mettre en œuvre une sauvegarde réellement restaurable, et surtout comment la tester.',
  date: '2026-06-28',
  readingTime: 6,
  author: 'Étienne Roux',
  image: "/9343b94c-2bb9-4fff-b90b-48b8edb41f95.jpg",
  body: [
  'Une sauvegarde qui n’a jamais été restaurée n’est pas une sauvegarde : c’est une hypothèse. La règle 3-2-1 structure le dispositif, mais c’est le test de restauration qui le valide.',
  'Trois copies : la production, une sauvegarde locale rapide pour les restaurations du quotidien, une copie distante pour les sinistres majeurs. Deux supports différents limitent les défaillances corrélées.',
  'La copie hors site doit être immuable. Les instantanés verrouillés empêchent un rançongiciel de chiffrer vos sauvegardes avec vos données, scénario devenu la norme plutôt que l’exception.',
  'Planifiez un test de restauration trimestriel documenté : temps de restauration constaté, intégrité des données, procédure suivie. C’est ce document, et non le rapport vert de votre logiciel, qui prouve votre résilience.']

},
{
  slug: 'reseau-wifi-bureaux',
  title: 'Wi-Fi en bureaux : pourquoi ajouter des bornes aggrave souvent la situation',
  category: 'Conseils',
  excerpt:
  'Trop de bornes, mal réglées, dégradent la qualité perçue. Explication du phénomène et méthode de dimensionnement.',
  date: '2026-06-05',
  readingTime: 5,
  author: 'Étienne Roux',
  image: "/df51d3cd-f622-403d-a9db-407b925f5a68.jpg",
  body: [
  'Le réflexe le plus courant face à un Wi-Fi capricieux consiste à ajouter des bornes. Dans la majorité des cas, cela dégrade la performance : les canaux se recouvrent, les clients hésitent entre plusieurs signaux forts et l’itinérance devient erratique.',
  'Un dimensionnement correct commence par une mesure : niveau de signal, rapport signal/bruit, saturation des canaux et cartographie des matériaux. On ajuste ensuite la puissance d’émission à la baisse, on désactive les débits les plus lents et on active l’itinérance rapide.',
  'Pour les salles de visioconférence, la priorisation applicative et une bande 5 GHz dédiée changent radicalement le confort d’usage, sans matériel supplémentaire.']

},
{
  slug: 'contrats-maintenance-comprendre-sla',
  title: 'Comprendre un SLA de maintenance sans se faire piéger',
  category: 'Entreprise',
  excerpt:
  'Délai de prise en charge, délai de résolution, plages couvertes, pénalités : le vocabulaire à maîtriser avant de signer.',
  date: '2026-05-16',
  readingTime: 6,
  author: 'Claire Bonnet',
  image: "/e48d728e-ee45-46db-86a8-13634b27029a.jpg",
  body: [
  'La confusion la plus fréquente porte sur la différence entre prise en charge et résolution. Un engagement « 4 heures » ne signifie presque jamais que la panne sera réparée en 4 heures.',
  'Vérifiez les plages horaires couvertes, la définition des niveaux de criticité, l’existence d’un matériel de remplacement et les modalités de sortie du contrat.',
  'Demandez enfin les indicateurs réellement mesurés et publiés : un prestataire qui vous transmet spontanément son taux de respect des délais a peu de choses à cacher.']

}];


export const faq = [
{
  category: 'Devis & tarifs',
  items: [
  {
    question: 'Le devis est-il gratuit ?',
    answer:
    'Oui, le devis est gratuit et sans engagement. Seule une étude technique approfondie sur site peut être facturée, montant annoncé à l’avance et déduit du chantier si les travaux sont confirmés.'
  },
  {
    question: 'Dans quel délai recevons-nous le devis ?',
    answer:
    'Sous 48 heures ouvrées pour une demande standard, sous 5 jours ouvrés pour un projet nécessitant une visite technique.'
  }]

},
{
  category: 'Interventions',
  items: [
  {
    question: 'Quelle est votre zone d’intervention ?',
    answer:
    'Lyon et la région Auvergne-Rhône-Alpes dans un rayon de 60 km sans frais. Au-delà, un forfait de déplacement transparent est indiqué au devis.'
  },
  {
    question: 'Intervenez-vous en urgence ?',
    answer:
    'Oui. Les demandes marquées comme urgentes sont traitées en priorité, et les clients sous contrat Critique bénéficient d’une astreinte 24/7.'
  }]

},
{
  category: 'Boutique & livraison',
  items: [
  {
    question: 'Quels sont les délais de livraison ?',
    answer:
    'Les produits en stock sont expédiés sous 24 à 48 heures ouvrées. La livraison est offerte à partir de 500 € HT de commande.'
  },
  {
    question: 'Puis-je faire installer le matériel acheté ?',
    answer:
    'Oui. Chaque fiche produit permet de demander un devis d’installation associé, ou vous pouvez réserver directement un créneau d’intervention.'
  }]

},
{
  category: 'Garanties & retours',
  items: [
  {
    question: 'Quelle est la durée de garantie ?',
    answer:
    'De 2 à 5 ans selon les références, indiquée sur chaque fiche produit. Les garanties constructeur sont complétées par notre atelier local.'
  },
  {
    question: 'Comment retourner un produit ?',
    answer:
    'Vous disposez de 14 jours pour un retour depuis votre espace client, rubrique Commandes. L’étiquette de retour est générée automatiquement.'
  }]

}];


export const processSteps = [
{
  step: '01',
  title: 'Prise de contact',
  text: 'Vous décrivez votre besoin en ligne ou par téléphone. Un technicien qualifie la demande sous 2 heures ouvrées.'
},
{
  step: '02',
  title: 'Étude et devis',
  text: 'Relevé sur site si nécessaire, puis devis détaillé ligne par ligne, sans poste flou ni « divers ».'
},
{
  step: '03',
  title: 'Planification',
  text: 'Créneaux d’intervention choisis avec vous, phasage adapté à votre activité, référent unique désigné.'
},
{
  step: '04',
  title: 'Réalisation et recette',
  text: 'Installation, paramétrage, tests contradictoires et remise du dossier des ouvrages exécutés.'
},
{
  step: '05',
  title: 'Suivi',
  text: 'Maintenance, assistance et historique complet accessible dans votre espace client.'
}];