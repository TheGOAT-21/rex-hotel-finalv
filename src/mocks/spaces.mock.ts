import { SpaceType, Space, RoomSpace, DiningSpace, EventSpace, Image, Feature, OpeningHours, Layout } from '../app/core/interfaces/space.interface';

// Images communes
const commonRoomImages: Image[] = [
  { id: 'img-common-room-1', url: 'assets/images/rooms/superior1.png', alt: 'Vue de la chambre', isPrimary: true },
  { id: 'img-common-room-2', url: 'assets/images/rooms/superior2.png', alt: 'Salle de bain' },
  { id: 'img-common-room-3', url: 'assets/images/rooms/superior3.png', alt: 'Détails de la chambre' }
];

const commonEventSpaceImages: Image[] = [
  { id: 'img-event-1', url: 'assets/images/event-spaces/common/hall-1.jpg', alt: 'Vue de la salle', isPrimary: true },
  { id: 'img-event-2', url: 'assets/images/event-spaces/common/setup-1.jpg', alt: 'Configuration de la salle' },
  { id: 'img-event-3', url: 'assets/images/event-spaces/common/detail-1.jpg', alt: 'Détails de la salle' }
];

const restaurantImages: Image[] = [
  { id: 'img-resto-1', url: 'assets/images/restaurants/restaurant.png', alt: 'Restaurant principal', isPrimary: true },
  { id: 'img-resto-2', url: 'assets/images/restaurants/restaurant2.png', alt: 'Tables du restaurant' },
  { id: 'img-resto-3', url: 'assets/images/restaurants/restaurant3.png', alt: 'Bar du restaurant' },
  { id: 'img-resto-4', url: 'assets/images/restaurants/restaurant4.png', alt: 'Plats du restaurant' }
];

// Features communes
const roomFeatures: Feature[] = [
  { name: 'Climatisation', icon: 'air-conditioner' },
  { name: 'Wifi gratuit', icon: 'wifi' },
  { name: 'TV écran plat', icon: 'tv' },
  { name: 'Minibar', icon: 'fridge' },
  { name: 'Coffre-fort', icon: 'safe' }
];

const eventSpaceFeatures: Feature[] = [
  { name: 'Climatisation', icon: 'air-conditioner' },
  { name: 'Wifi gratuit', icon: 'wifi' },
  { name: 'Équipement audiovisuel', icon: 'projector' },
  { name: 'Service traiteur', icon: 'catering' }
];

// Heures d'ouverture standard
const standardOpeningHours: OpeningHours = {
  monday: { open: '07:00', close: '23:00' },
  tuesday: { open: '07:00', close: '23:00' },
  wednesday: { open: '07:00', close: '23:00' },
  thursday: { open: '07:00', close: '23:00' },
  friday: { open: '07:00', close: '23:00' },
  saturday: { open: '07:00', close: '23:00' },
  sunday: { open: '07:00', close: '23:00' }
};

// Configurations de salle standard
const standardLayouts: Layout[] = [
  { name: 'Théâtre', capacity: 100, description: 'Disposition en rangées face à l\'estrade' },
  { name: 'Classe', capacity: 60, description: 'Disposition en rangées avec tables' },
  { name: 'U-Shape', capacity: 40, description: 'Disposition en forme de U' },
  { name: 'Banquet', capacity: 80, description: 'Disposition avec tables rondes' },
  { name: 'Cocktail', capacity: 120, description: 'Disposition debout avec buffets' }
];

// CHAMBRES
export const roomTypeA: RoomSpace = {
  id: 'chambre-classique',
  name: 'Chambre Type A - Classique',
  type: SpaceType.ROOM,
  description: 'Chambre classique avec lit double, offrant confort et élégance pour votre séjour à Yamoussoukro.',
  images: [
    ...commonRoomImages,
    { id: 'img-chambre-a', url: 'assets/images/rooms/classic-room.png', alt: 'Vue spécifique chambre type A' }
  ],
  features: [
    ...roomFeatures,
    { name: 'Vue sur jardin', icon: 'garden' }
  ],
  capacity: 2,
  price: 150,
  currency: 'XOF',
  available: true,
  bedType: 'Lit double',
  size: 25,
  view: 'Jardin',
  amenities: ['Sèche-cheveux', 'Produits de toilette', 'Serviettes', 'Peignoirs']
};

export const roomTypeB: RoomSpace = {
  id: 'chambre-superieure',
  name: 'Chambre Type B - Supérieure',
  type: SpaceType.ROOM,
  description: 'Chambre supérieure spacieuse avec lit king-size, offrant une expérience premium avec vue sur la piscine.',
  images: [
    ...commonRoomImages,
    { id: 'img-chambre-b', url: 'assets/images/rooms/chamb1.png', alt: 'Vue spécifique chambre type B' }
  ],
  features: [
    ...roomFeatures,
    { name: 'Vue sur piscine', icon: 'pool' },
    { name: 'Espace salon', icon: 'sofa' }
  ],
  capacity: 2,
  price: 220,
  currency: 'EUR',
  available: true,
  bedType: 'Lit king-size',
  size: 35,
  view: 'Piscine',
  amenities: ['Sèche-cheveux', 'Produits de toilette premium', 'Serviettes', 'Peignoirs', 'Pantoufles', 'Machine à café']
};

export const roomTypeC: RoomSpace = {
  id: 'suite-deluxe',
  name: 'Chambre Type C - Deluxe',
  type: SpaceType.ROOM,
  description: 'Chambre deluxe avec lit king-size et balcon privé, offrant une vue imprenable sur la ville de Yamoussoukro.',
  images: [
    ...commonRoomImages,
    { id: 'img-chambre-c', url: 'assets/images/rooms/deluxe1.png', alt: 'Balcon chambre type C' }
  ],
  features: [
    ...roomFeatures,
    { name: 'Balcon privé', icon: 'balcony' },
    { name: 'Vue sur ville', icon: 'city' },
    { name: 'Douche à effet pluie', icon: 'shower' }
  ],
  capacity: 2,
  price: 280,
  currency: 'EUR',
  available: true,
  bedType: 'Lit king-size',
  size: 40,
  view: 'Ville',
  amenities: ['Sèche-cheveux', 'Produits de toilette premium', 'Serviettes', 'Peignoirs', 'Pantoufles', 'Machine à café Nespresso', 'Station d\'accueil iPod']
};

export const roomTypeD: RoomSpace = {
  id: 'chambre-familiale',
  name: 'Chambre Type D - Familiale',
  type: SpaceType.ROOM,
  description: 'Chambre familiale spacieuse avec un lit king-size et deux lits simples, parfaite pour les familles.',
  images: [
    ...commonRoomImages,
    { id: 'img-chambre-d', url: 'assets/images/rooms/superior1.png', alt: 'Espace famille chambre type D' }
  ],
  features: [
    ...roomFeatures,
    { name: 'Espace famille', icon: 'family' },
    { name: 'Vue sur jardin', icon: 'garden' }
  ],
  capacity: 4,
  price: 320,
  currency: 'EUR',
  available: true,
  bedType: '1 Lit king-size + 2 lits simples',
  size: 55,
  view: 'Jardin',
  amenities: ['Sèche-cheveux', 'Produits de toilette', 'Serviettes', 'Peignoirs', 'Jeux pour enfants', 'Réfrigérateur']
};

export const roomTypeP: RoomSpace = {
  id: 'penthouse',
  name: 'Chambre Type P - Penthouse',
  type: SpaceType.ROOM,
  description: 'Suite Penthouse luxueuse avec terrasse privée, offrant une vue panoramique sur Yamoussoukro et un service exclusif.',
  images: [
    { id: 'img-penthouse-1', url: 'assets/images/rooms/penthouse1.png', alt: 'Vue principale penthouse', isPrimary: true },
    { id: 'img-penthouse-2', url: 'assets/images/rooms/penthouse2.png', alt: 'Chambre penthouse' },
    { id: 'img-penthouse-3', url: 'assets/images/rooms/penthouse3.png', alt: 'Salon penthouse' },
    { id: 'img-penthouse-4', url: 'assets/images/rooms/penthouse4.png', alt: 'Terrasse penthouse' },
    { id: 'img-penthouse-5', url: 'assets/images/rooms/penthouse5.png', alt: 'Salle de bain penthouse' }
  ],
  features: [
    ...roomFeatures,
    { name: 'Terrasse privée', icon: 'terrace' },
    { name: 'Salon séparé', icon: 'living-room' },
    { name: 'Vue panoramique', icon: 'panorama' },
    { name: 'Service majordome', icon: 'butler' },
    { name: 'Jacuzzi privé', icon: 'jacuzzi' }
  ],
  capacity: 2,
  price: 750,
  currency: 'EUR',
  available: true,
  bedType: 'Lit king-size',
  size: 120,
  view: 'Panoramique',
  amenities: ['Sèche-cheveux', 'Produits de toilette de luxe', 'Serviettes', 'Peignoirs', 'Pantoufles', 'Machine à café', 'Bar privé', 'Système audio Bose', 'Smart TV']
};

// RESTAURANTS & TERRASSES
export const mainRestaurant: DiningSpace = {
  id: 'restaurant-principal',
  name: 'Le Royal - Restaurant Principal',
  type: SpaceType.RESTAURANT,
  description: 'Restaurant gastronomique proposant une cuisine internationale raffinée avec des influences ivoiriennes.',
  images: restaurantImages,
  features: [
    { name: 'Cuisine internationale', icon: 'global' },
    { name: 'Chef renommé', icon: 'chef' },
    { name: 'Vue sur jardin', icon: 'garden' },
    { name: 'Climatisation', icon: 'air-conditioner' },
    { name: 'Bar à vins', icon: 'wine' }
  ],
  capacity: 150,
  available: true,
  cuisine: 'Internationale & Ivoirienne',
  menuItems: [
    { name: 'Carpaccio de poisson du jour', description: 'Finement tranché avec huile d\'olive et citron', price: 18, category: 'Entrée', available: true },
    { name: 'Salade REX', description: 'Légumes frais, crevettes grillées et vinaigrette maison', price: 15, category: 'Entrée', available: true },
    { name: 'Filet de bœuf', description: 'Accompagné de légumes de saison et sauce au poivre', price: 32, category: 'Plat', available: true },
    { name: 'Poulet Kedjenou', description: 'Spécialité ivoirienne mijotée aux épices', price: 26, category: 'Plat', available: true },
    { name: 'Pavé de poisson', description: 'Selon arrivage, avec riz parfumé et sauce créole', price: 28, category: 'Plat', available: true },
    { name: 'Assortiment de desserts', description: 'Sélection de pâtisseries et fruits frais', price: 14, category: 'Dessert', available: true }
  ],
  openingHours: {
    monday: { open: '07:00', close: '22:30' },
    tuesday: { open: '07:00', close: '22:30' },
    wednesday: { open: '07:00', close: '22:30' },
    thursday: { open: '07:00', close: '22:30' },
    friday: { open: '07:00', close: '23:00' },
    saturday: { open: '07:00', close: '23:00' },
    sunday: { open: '07:00', close: '22:00' }
  }
};

export const terraceRDC: DiningSpace = {
  id: 'terrasse-jardin',
  name: 'Terrasse Le Jardin - RDC',
  type: SpaceType.RESTAURANT,
  description: 'Terrasse ombragée située au rez-de-chaussée, offrant une ambiance décontractée pour les déjeuners et dîners au bord de la piscine.',
  images: [
    { id: 'img-terrasse-rdc-1', url: 'assets/images/restaurants/restaurant.png', alt: 'Terrasse principale RDC', isPrimary: true },
    { id: 'img-terrasse-rdc-2', url: 'assets/images/restaurants/restaurant3.png', alt: 'Vue piscine depuis terrasse RDC' },
    { id: 'img-terrasse-rdc-3', url: 'assets/images/restaurants/restaurant2.png', alt: 'Terrasse RDC en soirée' }
  ],
  features: [
    { name: 'Vue sur piscine', icon: 'pool' },
    { name: 'Cuisine légère', icon: 'salad' },
    { name: 'Bar à cocktails', icon: 'cocktail' },
    { name: 'Espace ombragé', icon: 'umbrella' }
  ],
  capacity: 60,
  available: true,
  cuisine: 'Méditerranéenne & Snacks',
  menuItems: [
    { name: 'Salade César', description: 'Salade romaine, poulet grillé, parmesan, croûtons', price: 14, category: 'Entrée', available: true },
    { name: 'Tapas mixtes', description: 'Assortiment de tapas à partager', price: 22, category: 'Entrée', available: true },
    { name: 'Club sandwich', description: 'Poulet, bacon, œuf, tomate, salade', price: 18, category: 'Plat', available: true },
    { name: 'Burger REX', description: 'Bœuf, fromage, bacon, oignons caramélisés', price: 22, category: 'Plat', available: true },
    { name: 'Coupe glacée', description: 'Trois boules au choix avec coulis et chantilly', price: 10, category: 'Dessert', available: true }
  ],
  openingHours: {
    monday: { open: '11:00', close: '22:00' },
    tuesday: { open: '11:00', close: '22:00' },
    wednesday: { open: '11:00', close: '22:00' },
    thursday: { open: '11:00', close: '22:00' },
    friday: { open: '11:00', close: '23:00' },
    saturday: { open: '11:00', close: '23:00' },
    sunday: { open: '11:00', close: '22:00' }
  }
};

export const terraceFirstFloor: DiningSpace = {
  id: 'terrasse-panorama',
  name: 'Terrasse Panorama - 1er étage',
  type: SpaceType.RESTAURANT,
  description: 'Terrasse exclusive au premier étage offrant une vue imprenable sur la ville, parfaite pour les dîners romantiques et les soirées.',
  images: [
    { id: 'img-terrasse-1st-1', url: 'assets/images/dining/terrace-1st-main.jpg', alt: 'Terrasse principale 1er étage', isPrimary: true },
    { id: 'img-terrasse-1st-2', url: 'assets/images/dining/terrace-1st-night.jpg', alt: 'Terrasse 1er étage en soirée' },
    { id: 'img-terrasse-1st-3', url: 'assets/images/dining/terrace-1st-view.jpg', alt: 'Vue depuis terrasse 1er étage' }
  ],
  features: [
    { name: 'Vue panoramique', icon: 'panorama' },
    { name: 'Cuisine gastronomique', icon: 'gourmet' },
    { name: 'Bar à champagne', icon: 'champagne' },
    { name: 'Musique live', icon: 'live-music' }
  ],
  capacity: 40,
  available: true,
  cuisine: 'Fusion & Internationale',
  menuItems: [
    { name: 'Foie gras maison', description: 'Accompagné de chutney de fruits exotiques', price: 26, category: 'Entrée', available: true },
    { name: 'Tartare de thon', description: 'Au citron vert et avocat', price: 22, category: 'Entrée', available: true },
    { name: 'Filet mignon', description: 'Sauce aux morilles et purée truffée', price: 42, category: 'Plat', available: true },
    { name: 'Saint-Jacques poêlées', description: 'Risotto crémeux aux asperges', price: 38, category: 'Plat', available: true },
    { name: 'Assiette de fromages affinés', description: 'Sélection de fromages locaux et internationaux', price: 18, category: 'Fromage', available: true },
    { name: 'Fondant au chocolat', description: 'Cœur coulant et glace vanille', price: 14, category: 'Dessert', available: true }
  ],
  openingHours: {
    monday: { open: '18:00', close: '00:00' },
    tuesday: { open: '18:00', close: '00:00' },
    wednesday: { open: '18:00', close: '00:00' },
    thursday: { open: '18:00', close: '00:00' },
    friday: { open: '18:00', close: '01:00' },
    saturday: { open: '18:00', close: '01:00' },
    sunday: { open: '18:00', close: '00:00' }
  }
};

// SALLES DE RÉUNION & ÉVÉNEMENTS
export const meetingRoom1: EventSpace = {
  id: 'salle-reunion-1',
  name: 'Salle de réunion 1 - Executive',
  type: SpaceType.EVENT_SPACE,
  description: 'Salle de réunion élégante et fonctionnelle, parfaite pour les réunions d\'affaires et petits séminaires.',
  images: [
    { id: 'img-meeting-1-1', url: 'assets/images/events/conference.png', alt: 'Salle de réunion 1', isPrimary: true },
    { id: 'img-meeting-1-2', url: 'assets/images/events/conference1.png', alt: 'Configuration salle de réunion 1' }
  ],
  features: [
    ...eventSpaceFeatures,
    { name: 'Écran de projection', icon: 'screen' },
    { name: 'Système de vidéoconférence', icon: 'video-conference' }
  ],
  capacity: 20,
  price: 500,
  currency: 'EUR',
  available: true,
  size: 40,
  pricePerDay: 500,
  layouts: [
    { name: 'Boardroom', capacity: 20, description: 'Configuration table de conseil' },
    { name: 'U-Shape', capacity: 15, description: 'Configuration en U' },
    { name: 'Théâtre', capacity: 30, description: 'Configuration en rangées' }
  ]
};

export const meetingRoom2: EventSpace = {
  id: 'salle-reunion-2',
  name: 'Salle de réunion 2 - Business',
  type: SpaceType.EVENT_SPACE,
  description: 'Salle de réunion moderne avec équipement audiovisuel de pointe, idéale pour les présentations et réunions professionnelles.',
  images: [
    { id: 'img-meeting-2-1', url: 'assets/images/event-spaces/meeting-2/meeting-2-main.jpg', alt: 'Salle de réunion 2', isPrimary: true },
    { id: 'img-meeting-2-2', url: 'assets/images/event-spaces/meeting-2/meeting-2-setup.jpg', alt: 'Configuration salle de réunion 2' }
  ],
  features: [
    ...eventSpaceFeatures,
    { name: 'Système audio haut de gamme', icon: 'audio' },
    { name: 'Écrans multiples', icon: 'multiple-screens' }
  ],
  capacity: 30,
  price: 650,
  currency: 'EUR',
  available: true,
  size: 60,
  pricePerDay: 650,
  layouts: [
    { name: 'Boardroom', capacity: 24, description: 'Configuration table de conseil' },
    { name: 'U-Shape', capacity: 20, description: 'Configuration en U' },
    { name: 'Théâtre', capacity: 40, description: 'Configuration en rangées' },
    { name: 'Classe', capacity: 30, description: 'Configuration en classe' }
  ]
};

export const conferenceRoom: EventSpace = {
  id: 'salle-conference',
  name: 'Salle de conférence',
  type: SpaceType.EVENT_SPACE,
  description: 'Grande salle de conférence polyvalente pour les séminaires, conférences et événements professionnels de grande envergure.',
  images: [
    { id: 'img-conference-1', url: 'assets/images/event-spaces/conference/conference-main.jpg', alt: 'Salle de conférence', isPrimary: true },
    { id: 'img-conference-2', url: 'assets/images/event-spaces/conference/conference-setup.jpg', alt: 'Configuration salle de conférence' },
    { id: 'img-conference-3', url: 'assets/images/event-spaces/conference/conference-event.jpg', alt: 'Événement dans la salle de conférence' }
  ],
  features: [
    ...eventSpaceFeatures,
    { name: 'Système de sonorisation professionnel', icon: 'sound-system' },
    { name: 'Cabines de traduction', icon: 'translation' },
    { name: 'Estrade modulable', icon: 'stage' }
  ],
  capacity: 200,
  price: 1500,
  currency: 'EUR',
  available: true,
  size: 300,
  pricePerDay: 1500,
  layouts: [
    { name: 'Théâtre', capacity: 200, description: 'Configuration en rangées' },
    { name: 'Classe', capacity: 120, description: 'Configuration en classe' },
    { name: 'U-Shape', capacity: 60, description: 'Configuration en U' },
    { name: 'Banquet', capacity: 150, description: 'Configuration en tables rondes' },
    { name: 'Cocktail', capacity: 250, description: 'Configuration debout' }
  ]
};

export const weddingHall: EventSpace = {
  id: 'salle-mariage',
  name: 'Salle de mariage',
  type: SpaceType.EVENT_SPACE,
  description: 'Élégante salle de réception spécialement conçue pour les mariages et célébrations, avec espace de danse et configuration modulable.',
  images: [
    { id: 'img-wedding-1', url: 'assets/images/event-spaces/wedding/wedding-main.jpg', alt: 'Salle de mariage', isPrimary: true },
    { id: 'img-wedding-2', url: 'assets/images/event-spaces/wedding/wedding-setup.jpg', alt: 'Configuration salle de mariage' },
    { id: 'img-wedding-3', url: 'assets/images/event-spaces/wedding/wedding-event.jpg', alt: 'Mariage dans la salle' }
  ],
  features: [
    ...eventSpaceFeatures,
    { name: 'Piste de danse', icon: 'dance-floor' },
    { name: 'Éclairage d\'ambiance', icon: 'ambient-light' },
    { name: 'Espace pour DJ/orchestre', icon: 'dj-booth' }
  ],
  capacity: 150,
  price: 2000,
  currency: 'EUR',
  available: true,
  size: 250,
  pricePerDay: 2000,
  layouts: [
    { name: 'Banquet', capacity: 150, description: 'Configuration en tables rondes' },
    { name: 'Cocktail', capacity: 200, description: 'Configuration debout' },
    { name: 'Cérémonie', capacity: 180, description: 'Configuration pour cérémonie' }
  ]
};

// AUTRES ESPACES
export const exteriorSpace: Space = {
  id: 'jardins-exterieurs',
  name: 'Extérieur & Jardins',
  type: SpaceType.EVENT_SPACE,
  description: 'Magnifiques jardins aménagés offrant un cadre verdoyant et paisible, parfaits pour les événements en plein air et les moments de détente.',
  images: [
    { id: 'img-exterior-1', url: 'assets/images/exterior/gardens-main.jpg', alt: 'Jardins', isPrimary: true },
    { id: 'img-exterior-2', url: 'assets/images/exterior/pool-area.jpg', alt: 'Espace piscine' },
    { id: 'img-exterior-3', url: 'assets/images/exterior/lounge-area.jpg', alt: 'Espace détente extérieur' }
  ],
  features: [
    { name: 'Jardins paysagers', icon: 'garden' },
    { name: 'Éclairage d\'ambiance', icon: 'ambient-light' },
    { name: 'Mobilier extérieur', icon: 'outdoor-furniture' },
    { name: 'Zones ombragées', icon: 'shade' }
  ],
  capacity: 300,
  price: 1500,
  currency: 'EUR',
  available: true
};

export const parkingRDC: Space = {
  id: 'parking-rdc',
  name: 'Parking RDC',
  type: SpaceType.EVENT_SPACE,
  description: 'Parking sécurisé au rez-de-chaussée avec accès direct à la réception de l\'hôtel.',
  images: [
    { id: 'img-parking-1', url: 'assets/images/facilities/parking-rdc.jpg', alt: 'Parking RDC', isPrimary: true }
  ],
  features: [
    { name: 'Sécurisé 24/7', icon: 'security' },
    { name: 'Accès direct à l\'hôtel', icon: 'access' },
    { name: '40 places', icon: 'parking' }
  ],
  capacity: 40,
  available: true
};

export const swimmingPool: Space = {
  id: 'piscine',
  name: 'Piscine',
  type: SpaceType.EVENT_SPACE,
  description: 'Magnifique piscine extérieure avec terrasse ensoleillée, transats confortables et service de bar au bord de l\'eau.',
  images: [
    { id: 'img-pool-1', url: 'assets/images/facilities/pool-main.jpg', alt: 'Piscine principale', isPrimary: true },
    { id: 'img-pool-2', url: 'assets/images/facilities/pool-loungers.jpg', alt: 'Transats piscine' },
    { id: 'img-pool-3', url: 'assets/images/facilities/pool-bar.jpg', alt: 'Bar de la piscine' }
  ],
  features: [
    { name: 'Piscine chauffée', icon: 'heated-pool' },
    { name: 'Transats confortables', icon: 'sunbed' },
    { name: 'Bar au bord de l\'eau', icon: 'pool-bar' },
    { name: 'Service serviettes', icon: 'towel' }
  ],
  capacity: 50,
  available: true
};

export const firstFloorHall: Space = {
  id: 'hall-premier-etage',
  name: 'Hall 1er Étage',
  type: SpaceType.EVENT_SPACE,
  description: 'Élégant hall au premier étage pouvant accueillir des expositions, cocktails et événements de networking.',
  images: [
    { id: 'img-hall-1', url: 'assets/images/event-spaces/hall/hall-main.jpg', alt: 'Hall 1er étage', isPrimary: true },
    { id: 'img-hall-2', url: 'assets/images/event-spaces/hall/hall-event.jpg', alt: 'Événement dans le hall' }
  ],
  features: [
    { name: 'Espace ouvert', icon: 'open-space' },
    { name: 'Vue panoramique', icon: 'panorama' },
    { name: 'Éclairage ajustable', icon: 'lighting' }
  ],
  capacity: 100,
  price: 800,
  currency: 'EUR',
  available: true
};

export const kidsArea: Space = {
  id: 'espace-enfants',
  name: 'Espace Enfant',
  type: SpaceType.EVENT_SPACE,
  description: 'Espace dédié aux enfants avec activités ludiques et éducatives, sous la supervision de personnel qualifié.',
  images: [
    { id: 'img-kids-1', url: 'assets/images//kids-play.png', alt: 'Espace enfant principal', isPrimary: true },
    { id: 'img-kids-2', url: 'assets/images//kids-play2.png', alt: 'Activités enfants' }
  ],
  features: [
    { name: 'Jeux éducatifs', icon: 'educational-games' },
    { name: 'Personnel qualifié', icon: 'staff' },
    { name: 'Espace sécurisé', icon: 'safety' },
    { name: 'Activités variées', icon: 'activities' }
  ],
  capacity: 20,
  available: true
};

// Collection de tous les espaces
export const SPACES: Space[] = [
  roomTypeA,
  roomTypeB,
  roomTypeC,
  roomTypeD,
  roomTypeP,
  mainRestaurant,
  terraceRDC,
  terraceFirstFloor,
  meetingRoom1,
  meetingRoom2,
  conferenceRoom,
  weddingHall,
  exteriorSpace,
  parkingRDC,
  swimmingPool,
  firstFloorHall,
  kidsArea
];