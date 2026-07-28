/** Catalogue produits de la boutique : catégories, produits, avis. */

const IMG = {
  network: "/9343b94c-2bb9-4fff-b90b-48b8edb41f95.jpg",
  security: "/bb948ee0-b416-47c2-a4a3-5413a88bb3f2.jpg",
  office: "/d3dd891f-9fd1-4284-9086-9db71731d1e7.jpg",
  workshop: "/e48d728e-ee45-46db-86a8-13634b27029a.jpg",
  rack: "/df51d3cd-f622-403d-a9db-407b925f5a68.jpg"
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  children: {slug: string;name: string;}[];
};

export type Review = {
  author: string;
  rating: number;
  date: string;
  comment: string;
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  stock: number;
  rating: number;
  images: string[];
  shortDescription: string;
  description: string;
  specs: {label: string;value: string;}[];
  reviews: Review[];
  tags: ('nouveau' | 'promo' | 'best-seller')[];
  warranty: string;
  reference: string;
};

export const categories: Category[] = [
{
  slug: 'reseau',
  name: 'Réseau & infrastructure',
  description: 'Switches, bornes Wi-Fi, baies et connectique pour un réseau professionnel fiable.',
  children: [
  { slug: 'switches', name: 'Switches' },
  { slug: 'wifi', name: 'Wi-Fi' },
  { slug: 'baies', name: 'Baies & racks' }]

},
{
  slug: 'securite',
  name: 'Sécurité & vidéoprotection',
  description: 'Caméras IP, enregistreurs et contrôle d’accès conformes aux exigences professionnelles.',
  children: [
  { slug: 'cameras', name: 'Caméras' },
  { slug: 'enregistreurs', name: 'Enregistreurs' },
  { slug: 'acces', name: 'Contrôle d’accès' }]

},
{
  slug: 'informatique',
  name: 'Informatique',
  description: 'Postes de travail, écrans, stockage et accessoires sélectionnés pour la durabilité.',
  children: [
  { slug: 'portables', name: 'Ordinateurs portables' },
  { slug: 'ecrans', name: 'Écrans' },
  { slug: 'stockage', name: 'Stockage' },
  { slug: 'accessoires', name: 'Accessoires' }]

},
{
  slug: 'bureau',
  name: 'Matériel de bureau',
  description: 'Impression, destruction de documents et énergie pour les espaces de travail.',
  children: [
  { slug: 'impression', name: 'Impression' },
  { slug: 'energie', name: 'Énergie' }]

}];


export const products: Product[] = [
{
  slug: 'switch-poe-24',
  name: 'Switch managé PoE+ 24 ports',
  brand: 'Neteon',
  category: 'reseau',
  subcategory: 'switches',
  price: 749,
  oldPrice: 869,
  stock: 12,
  rating: 4.8,
  images: [IMG.network, IMG.rack, IMG.workshop],
  shortDescription: 'Switch L2+ 24 ports Gigabit PoE+ 370 W, 2 SFP+, administration web et CLI.',
  description:
  'Cœur de réseau compact conçu pour les déploiements PME : 24 ports Gigabit PoE+ avec budget de 370 W, deux liaisons SFP+ 10 G pour l’agrégation, et une pile logicielle complète (VLAN 802.1Q, LACP, RSTP, QoS, IGMP snooping). Le refroidissement semi-passif limite le bruit en local technique partagé.',
  specs: [
  { label: 'Ports', value: '24 × RJ45 Gigabit PoE+' },
  { label: 'Uplink', value: '2 × SFP+ 10 Gb/s' },
  { label: 'Budget PoE', value: '370 W' },
  { label: 'Capacité de commutation', value: '128 Gb/s' },
  { label: 'Administration', value: 'Web, CLI, SNMP v3' },
  { label: 'Format', value: 'Rack 1U' }],

  reviews: [
  {
    author: 'Karim B.',
    rating: 5,
    date: '2026-05-12',
    comment: 'Configuration VLAN limpide, budget PoE largement suffisant pour 18 caméras et 4 bornes.'
  },
  {
    author: 'Sophie L.',
    rating: 4,
    date: '2026-04-02',
    comment: 'Très silencieux. L’interface web gagnerait à être un peu plus rapide.'
  }],

  tags: ['best-seller', 'promo'],
  warranty: 'Garantie 5 ans retour atelier',
  reference: 'NTE-SW24P'
},
{
  slug: 'borne-wifi-6',
  name: 'Borne Wi-Fi 6 plafonnier',
  brand: 'Neteon',
  category: 'reseau',
  subcategory: 'wifi',
  price: 289,
  stock: 34,
  rating: 4.6,
  images: [IMG.network, IMG.rack],
  shortDescription: 'Point d’accès Wi-Fi 6 bi-bande 3 Gb/s, PoE+, jusqu’à 200 clients simultanés.',
  description:
  'Point d’accès professionnel pour bureaux et espaces recevant du public. MU-MIMO 4×4, OFDMA, itinérance rapide 802.11r/k/v et portail captif intégré. Alimentation PoE+ pour un seul câble par point.',
  specs: [
  { label: 'Norme', value: 'Wi-Fi 6 (802.11ax)' },
  { label: 'Débit théorique', value: '2 976 Mb/s' },
  { label: 'Clients simultanés', value: '200' },
  { label: 'Alimentation', value: 'PoE+ 802.3at' },
  { label: 'SSID', value: '16 avec VLAN par SSID' }],

  reviews: [
  {
    author: 'Étienne R.',
    rating: 5,
    date: '2026-06-01',
    comment: 'Couverture excellente sur 400 m², itinérance sans coupure en visioconférence.'
  }],

  tags: ['best-seller'],
  warranty: 'Garantie 3 ans',
  reference: 'NTE-AP6C'
},
{
  slug: 'rack-mural-12u',
  name: 'Baie murale 12U vitrée',
  brand: 'Structo',
  category: 'reseau',
  subcategory: 'baies',
  price: 219,
  stock: 8,
  rating: 4.4,
  images: [IMG.rack, IMG.network],
  shortDescription: 'Coffret 12U profondeur 600 mm, porte vitrée verrouillable, ventilation intégrée.',
  description:
  'Baie murale robuste pour local technique : structure acier 1,2 mm, passages de câbles haut et bas, deux ventilateurs et rails réglables en profondeur. Charge admissible 60 kg.',
  specs: [
  { label: 'Hauteur utile', value: '12U' },
  { label: 'Profondeur', value: '600 mm' },
  { label: 'Charge maximale', value: '60 kg' },
  { label: 'Ventilation', value: '2 ventilateurs 92 mm' },
  { label: 'Sécurité', value: 'Porte vitrée à clé' }],

  reviews: [
  { author: 'Marc D.', rating: 4, date: '2026-03-18', comment: 'Montage rapide, finition sérieuse.' }],

  tags: [],
  warranty: 'Garantie 2 ans',
  reference: 'STR-B12U'
},
{
  slug: 'camera-ip-4k',
  name: 'Caméra IP dôme 4K IR 30 m',
  brand: 'Vigilis',
  category: 'securite',
  subcategory: 'cameras',
  price: 329,
  oldPrice: 379,
  stock: 46,
  rating: 4.9,
  images: [IMG.security, IMG.rack],
  shortDescription: 'Dôme antivandale 8 MP, WDR 130 dB, IR 30 m, détection intelligente embarquée.',
  description:
  'Caméra de vidéoprotection 4K pour intérieur et extérieur (IP67, IK10). Analyse embarquée : franchissement de ligne, intrusion de zone, comptage. Masquage de zones privées pour la conformité RGPD et flux H.265+ pour réduire le stockage.',
  specs: [
  { label: 'Capteur', value: '1/2.8" 8 MP' },
  { label: 'Optique', value: '2,8 mm — 106°' },
  { label: 'Infrarouge', value: '30 m' },
  { label: 'Compression', value: 'H.265+ / H.264' },
  { label: 'Indice de protection', value: 'IP67 / IK10' },
  { label: 'Alimentation', value: 'PoE 802.3af' }],

  reviews: [
  {
    author: 'Nadia F.',
    rating: 5,
    date: '2026-06-20',
    comment: 'Image nette de nuit, détection de zone très fiable, aucune fausse alerte en 3 mois.'
  },
  { author: 'Laurent P.', rating: 5, date: '2026-05-04', comment: 'Installation simple, fixation solide.' }],

  tags: ['best-seller', 'promo'],
  warranty: 'Garantie 3 ans',
  reference: 'VGL-D4K30'
},
{
  slug: 'nvr-8-canaux',
  name: 'Enregistreur NVR 8 canaux PoE',
  brand: 'Vigilis',
  category: 'securite',
  subcategory: 'enregistreurs',
  price: 549,
  stock: 15,
  rating: 4.7,
  images: [IMG.security, IMG.workshop],
  shortDescription: 'NVR 8 voies PoE intégré, 2 baies disques, rétention paramétrable, accès mobile.',
  description:
  'Enregistreur réseau avec 8 ports PoE intégrés : les caméras sont alimentées et raccordées directement. Deux emplacements 3,5" (jusqu’à 2 × 12 To), gestion de la rétention par flux et export horodaté au format standard pour les réquisitions.',
  specs: [
  { label: 'Canaux', value: '8 (PoE intégré)' },
  { label: 'Stockage', value: '2 × 12 To maximum' },
  { label: 'Résolution', value: 'Jusqu’à 4K par voie' },
  { label: 'Débit entrant', value: '80 Mb/s' },
  { label: 'Export', value: 'MP4 horodaté, journal d’accès' }],

  reviews: [
  { author: 'Julien T.', rating: 5, date: '2026-04-27', comment: 'Rétention 30 jours respectée, export très clair.' }],

  tags: ['nouveau'],
  warranty: 'Garantie 3 ans',
  reference: 'VGL-NVR8P'
},
{
  slug: 'lecteur-badge-mifare',
  name: 'Lecteur de badge MIFARE + clavier',
  brand: 'Vigilis',
  category: 'securite',
  subcategory: 'acces',
  price: 189,
  stock: 27,
  rating: 4.3,
  images: [IMG.security],
  shortDescription: 'Lecteur mural chiffré MIFARE DESFire EV2, clavier rétroéclairé, IP66.',
  description:
  'Lecteur de contrôle d’accès pour porte intérieure ou extérieure. Communication chiffrée OSDP, double authentification badge + code, boîtier IP66 résistant aux UV.',
  specs: [
  { label: 'Technologie', value: 'MIFARE DESFire EV2' },
  { label: 'Protocole', value: 'OSDP v2 chiffré' },
  { label: 'Clavier', value: '12 touches rétroéclairées' },
  { label: 'Protection', value: 'IP66' }],

  reviews: [
  { author: 'Céline M.', rating: 4, date: '2026-02-11', comment: 'Lecture rapide, montage propre.' }],

  tags: [],
  warranty: 'Garantie 2 ans',
  reference: 'VGL-RDEV2'
},
{
  slug: 'laptop-pro-14',
  name: 'Ordinateur portable Pro 14"',
  brand: 'Arkos',
  category: 'informatique',
  subcategory: 'portables',
  price: 1289,
  oldPrice: 1449,
  stock: 9,
  rating: 4.7,
  images: [IMG.office, IMG.workshop],
  shortDescription: 'Châssis aluminium, 14" 2,8K, 32 Go, SSD 1 To, autonomie 14 h, clavier AZERTY rétroéclairé.',
  description:
  'Poste de travail mobile pour usage intensif : dalle 2,8K 120 Hz calibrée, 32 Go de mémoire, SSD NVMe 1 To chiffré, lecteur d’empreinte et puce de sécurité. Réparabilité facilitée : batterie, SSD et mémoire accessibles.',
  specs: [
  { label: 'Écran', value: '14" 2 880 × 1 800, 120 Hz' },
  { label: 'Mémoire', value: '32 Go LPDDR5' },
  { label: 'Stockage', value: 'SSD NVMe 1 To' },
  { label: 'Autonomie', value: 'Jusqu’à 14 h' },
  { label: 'Connectique', value: '2 × USB-C 4, HDMI 2.1, RJ45' },
  { label: 'Poids', value: '1,32 kg' }],

  reviews: [
  { author: 'Amine K.', rating: 5, date: '2026-06-08', comment: 'Silencieux, très rapide, écran superbe.' },
  { author: 'Hélène V.', rating: 4, date: '2026-05-19', comment: 'Excellent portable, chargeur un peu volumineux.' }],

  tags: ['best-seller', 'promo'],
  warranty: 'Garantie 3 ans sur site',
  reference: 'ARK-P14-32'
},
{
  slug: 'ecran-27-qhd',
  name: 'Écran 27" QHD ergonomique',
  brand: 'Arkos',
  category: 'informatique',
  subcategory: 'ecrans',
  price: 349,
  stock: 22,
  rating: 4.5,
  images: [IMG.office],
  shortDescription: 'IPS 27" 2560 × 1440, 100 Hz, USB-C 90 W, pied réglable en hauteur et pivot.',
  description:
  'Écran professionnel avec dock USB-C intégré : un seul câble pour l’image, le réseau, les périphériques et la charge du portable. Traitement antireflet et mode faible lumière bleue certifié.',
  specs: [
  { label: 'Dalle', value: 'IPS 27" 2 560 × 1 440' },
  { label: 'Fréquence', value: '100 Hz' },
  { label: 'Dock', value: 'USB-C 90 W, RJ45, 3 × USB-A' },
  { label: 'Ergonomie', value: 'Hauteur, inclinaison, pivot' },
  { label: 'Couverture', value: '99 % sRGB' }],

  reviews: [
  { author: 'Paul G.', rating: 5, date: '2026-03-30', comment: 'Le dock intégré a simplifié tous nos bureaux partagés.' }],

  tags: ['best-seller'],
  warranty: 'Garantie 3 ans échange',
  reference: 'ARK-M27Q'
},
{
  slug: 'ssd-nvme-2to',
  name: 'SSD NVMe 2 To Gen4',
  brand: 'Corevolt',
  category: 'informatique',
  subcategory: 'stockage',
  price: 179,
  stock: 58,
  rating: 4.8,
  images: [IMG.workshop],
  shortDescription: 'SSD M.2 PCIe Gen4, 7 000 Mo/s en lecture, endurance 1 200 To écrits.',
  description:
  'Stockage haute performance pour postes de travail et serveurs légers. Chiffrement matériel AES 256 bits, dissipateur graphène et endurance élevée pour les usages professionnels.',
  specs: [
  { label: 'Format', value: 'M.2 2280 PCIe Gen4 ×4' },
  { label: 'Lecture', value: '7 000 Mo/s' },
  { label: 'Écriture', value: '6 100 Mo/s' },
  { label: 'Endurance', value: '1 200 TBW' },
  { label: 'Chiffrement', value: 'AES 256 bits' }],

  reviews: [
  { author: 'Sofia N.', rating: 5, date: '2026-06-14', comment: 'Migration de 12 postes, aucun souci, températures maîtrisées.' }],

  tags: ['nouveau'],
  warranty: 'Garantie 5 ans',
  reference: 'CVT-N2T4'
},
{
  slug: 'station-accueil-usbc',
  name: 'Station d’accueil USB-C 13 ports',
  brand: 'Corevolt',
  category: 'informatique',
  subcategory: 'accessoires',
  price: 199,
  stock: 41,
  rating: 4.4,
  images: [IMG.office, IMG.workshop],
  shortDescription: 'Dock 13 ports, double écran 4K 60 Hz, charge 100 W, RJ45 2,5 Gb/s.',
  description:
  'Station d’accueil pour bureau partagé : double affichage 4K, réseau 2,5 Gb/s, lecteur de cartes et alimentation 100 W. Boîtier aluminium avec dissipation passive.',
  specs: [
  { label: 'Affichage', value: '2 × 4K 60 Hz (HDMI + DP)' },
  { label: 'Réseau', value: 'RJ45 2,5 Gb/s' },
  { label: 'Charge', value: 'USB-C Power Delivery 100 W' },
  { label: 'Ports', value: '13 au total' }],

  reviews: [
  { author: 'Yann C.', rating: 4, date: '2026-01-22', comment: 'Stable, bonne dissipation, aucun débranchement intempestif.' }],

  tags: [],
  warranty: 'Garantie 2 ans',
  reference: 'CVT-D13C'
},
{
  slug: 'imprimante-multifonction',
  name: 'Multifonction laser A4 recto-verso',
  brand: 'Printeria',
  category: 'bureau',
  subcategory: 'impression',
  price: 429,
  stock: 6,
  rating: 4.2,
  images: [IMG.office],
  shortDescription: '36 ppm, recto-verso automatique, chargeur 50 pages, scan réseau sécurisé.',
  description:
  'Multifonction laser monochrome pour équipes de 5 à 25 personnes : impression sécurisée par code, scan vers dossier réseau ou courriel, et coût à la page maîtrisé avec les toners haute capacité.',
  specs: [
  { label: 'Vitesse', value: '36 pages/min' },
  { label: 'Recto-verso', value: 'Automatique impression et scan' },
  { label: 'Chargeur', value: '50 feuilles' },
  { label: 'Réseau', value: 'Ethernet, Wi-Fi, AirPrint' },
  { label: 'Sécurité', value: 'Impression par code PIN' }],

  reviews: [
  { author: 'Isabelle D.', rating: 4, date: '2026-04-15', comment: 'Fiable et rapide. Le scan vers dossier réseau fonctionne parfaitement.' }],

  tags: [],
  warranty: 'Garantie 2 ans sur site',
  reference: 'PRT-L36D'
},
{
  slug: 'onduleur-1500va',
  name: 'Onduleur en ligne 1500 VA rack',
  brand: 'Corevolt',
  category: 'bureau',
  subcategory: 'energie',
  price: 599,
  oldPrice: 679,
  stock: 11,
  rating: 4.6,
  images: [IMG.rack, IMG.workshop],
  shortDescription: 'Onduleur online double conversion 1500 VA / 1350 W, format rack 2U, carte réseau.',
  description:
  'Protection électrique pour baie technique : double conversion permanente, sinusoïde pure, bypass automatique et carte de supervision réseau pour l’arrêt propre des serveurs.',
  specs: [
  { label: 'Puissance', value: '1 500 VA / 1 350 W' },
  { label: 'Topologie', value: 'Online double conversion' },
  { label: 'Format', value: 'Rack 2U' },
  { label: 'Autonomie', value: '12 min à pleine charge' },
  { label: 'Supervision', value: 'Carte réseau SNMP incluse' }],

  reviews: [
  { author: 'Bruno A.', rating: 5, date: '2026-05-29', comment: 'Aucune coupure ressentie sur 4 microcoupures ce printemps.' }],

  tags: ['promo'],
  warranty: 'Garantie 3 ans (batteries 2 ans)',
  reference: 'CVT-U15R'
},
{
  slug: 'nas-4-baies',
  name: 'NAS 4 baies professionnel',
  brand: 'Corevolt',
  category: 'informatique',
  subcategory: 'stockage',
  price: 899,
  stock: 7,
  rating: 4.9,
  images: [IMG.rack, IMG.network],
  shortDescription: 'NAS 4 baies, 2 × 2,5 GbE, RAID, sauvegarde 3-2-1 et instantanés anti-rançongiciel.',
  description:
  'Serveur de stockage pour sauvegarde et partage de fichiers : instantanés immuables, réplication vers site distant, chiffrement des volumes et gestion fine des droits par groupe.',
  specs: [
  { label: 'Baies', value: '4 × 3,5" (jusqu’à 88 To)' },
  { label: 'Réseau', value: '2 × 2,5 Gb/s avec agrégation' },
  { label: 'Mémoire', value: '8 Go ECC extensible' },
  { label: 'Protection', value: 'Instantanés immuables, RAID 1/5/6' }],

  reviews: [
  { author: 'Farid Z.', rating: 5, date: '2026-06-25', comment: 'Sauvegarde 3-2-1 en place en une journée, restauration testée avec succès.' }],

  tags: ['nouveau', 'best-seller'],
  warranty: 'Garantie 3 ans',
  reference: 'CVT-NAS4'
}];


export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function averageRating(product: Product): number {
  if (product.reviews.length === 0) return product.rating;
  return product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
}