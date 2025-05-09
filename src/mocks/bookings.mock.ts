import { Booking, BookingStatus, PaymentStatus, GuestInfo } from '../app/core/interfaces/booking.interface';
import { SpaceType } from '../app/core/interfaces/space.interface';
import { v4 as uuidv4 } from 'uuid';

// Quelques exemples de GuestInfo pour réutilisation
const guestInfos: GuestInfo[] = [
  {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33612345678',
    country: 'France',
    address: '15 Rue de Paris',
    postalCode: '75001',
    city: 'Paris'
  },
  {
    firstName: 'Marie',
    lastName: 'Koné',
    email: 'marie.kone@example.com',
    phone: '+22507123456',
    country: 'Côte d\'Ivoire',
    address: 'Boulevard de la République',
    postalCode: '01 BP 1234',
    city: 'Abidjan'
  },
  {
    firstName: 'Robert',
    lastName: 'Smith',
    email: 'robert.smith@example.com',
    phone: '+44789123456',
    country: 'United Kingdom',
    address: '10 Oxford Street',
    postalCode: 'W1D 1BS',
    city: 'London'
  },
  {
    firstName: 'Aminata',
    lastName: 'Diallo',
    email: 'aminata.diallo@example.com',
    phone: '+22170123456',
    country: 'Sénégal',
    address: 'Avenue Cheikh Anta Diop',
    postalCode: 'BP 5005',
    city: 'Dakar'
  },
  {
    firstName: 'Mohammed',
    lastName: 'Ouattara',
    email: 'mohammed.ouattara@example.com',
    phone: '+22507890123',
    country: 'Côte d\'Ivoire',
    address: 'Avenue Houphouët-Boigny',
    postalCode: '01 BP 5678',
    city: 'Yamoussoukro'
  }
];

// Génération de dates récentes et futures
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const weekAfterNext = new Date(nextWeek);
weekAfterNext.setDate(weekAfterNext.getDate() + 7);

const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);
const twoWeeksAgo = new Date(lastWeek);
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);

// Exemples de réservations
export const BOOKINGS: Booking[] = [
  // Réservations passées
  {
    id: uuidv4(),
    guestInfo: guestInfos[0],
    spaceId: 'room-type-a-id', // Vous devrez remplacer par les vrais IDs de vos espaces
    spaceType: SpaceType.ROOM,
    checkIn: twoWeeksAgo,
    checkOut: lastWeek,
    guests: {
      adults: 2,
      children: 0
    },
    totalPrice: 750,
    status: BookingStatus.CHECKED_OUT,
    paymentStatus: PaymentStatus.PAID,
    createdAt: new Date(twoWeeksAgo.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 jours avant check-in
    confirmationCode: 'REXA1234'
  },
  {
    id: uuidv4(),
    guestInfo: guestInfos[1],
    spaceId: 'room-type-b-id',
    spaceType: SpaceType.ROOM,
    checkIn: twoWeeksAgo,
    checkOut: lastWeek,
    guests: {
      adults: 2,
      children: 1
    },
    totalPrice: 1100,
    status: BookingStatus.CHECKED_OUT,
    paymentStatus: PaymentStatus.PAID,
    specialRequests: 'Lit bébé requis',
    createdAt: new Date(twoWeeksAgo.getTime() - 14 * 24 * 60 * 60 * 1000), // 2 semaines avant check-in
    confirmationCode: 'REXB5678'
  },
  
  // Réservations actuelles
  {
    id: uuidv4(),
    guestInfo: guestInfos[2],
    spaceId: 'room-type-c-id',
    spaceType: SpaceType.ROOM,
    checkIn: lastWeek,
    checkOut: tomorrow,
    guests: {
      adults: 2,
      children: 0
    },
    totalPrice: 1960,
    status: BookingStatus.CHECKED_IN,
    paymentStatus: PaymentStatus.PAID,
    specialRequests: 'Chambre avec vue si possible',
    createdAt: new Date(lastWeek.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 jours avant check-in
    confirmationCode: 'REXC9012'
  },
  {
    id: uuidv4(),
    guestInfo: guestInfos[3],
    spaceId: 'room-type-p-id',
    spaceType: SpaceType.ROOM,
    checkIn: today,
    checkOut: nextWeek,
    guests: {
      adults: 2,
      children: 0
    },
    totalPrice: 5250,
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PAID,
    specialRequests: 'Bouteille de champagne pour anniversaire',
    createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), // 1 mois avant check-in
    confirmationCode: 'REXP3456'
  },
  
  // Réservations futures
  {
    id: uuidv4(),
    guestInfo: guestInfos[4],
    spaceId: 'room-type-d-id',
    spaceType: SpaceType.ROOM,
    checkIn: nextWeek,
    checkOut: weekAfterNext,
    guests: {
      adults: 2,
      children: 2
    },
    totalPrice: 2240,
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PAID,
    specialRequests: 'Chambres communicantes souhaitées',
    createdAt: new Date(nextWeek.getTime() - 21 * 24 * 60 * 60 * 1000), // 3 semaines avant check-in
    confirmationCode: 'REXD7890'
  },
  
  // Réservations d'espaces événementiels
  {
    id: uuidv4(),
    guestInfo: {
      firstName: 'Société',
      lastName: 'ABC',
      email: 'contact@abc.com',
      phone: '+22507654321',
      country: 'Côte d\'Ivoire',
      address: 'Zone Industrielle',
      postalCode: '01 BP 9876',
      city: 'Abidjan'
    },
    spaceId: 'conference-room-id',
    spaceType: SpaceType.EVENT_SPACE,
    checkIn: nextWeek, // Utiliser la date du jour pour un événement d'une journée
    checkOut: nextWeek, // Même date pour un événement d'une journée
    guests: {
      adults: 150,
      children: 0
    },
    totalPrice: 1500,
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PAID,
    specialRequests: 'Configuration en théâtre, projecteur et micro requis',
    createdAt: new Date(nextWeek.getTime() - 60 * 24 * 60 * 60 * 1000), // 2 mois avant l'événement
    confirmationCode: 'REXE1234'
  },
  {
    id: uuidv4(),
    guestInfo: {
      firstName: 'Mariage',
      lastName: 'Konaté-Bamba',
      email: 'konate.bamba@example.com',
      phone: '+22508901234',
      country: 'Côte d\'Ivoire',
      address: 'Cocody',
      postalCode: '01 BP 1357',
      city: 'Abidjan'
    },
    spaceId: 'wedding-hall-id',
    spaceType: SpaceType.EVENT_SPACE,
    checkIn: weekAfterNext,
    checkOut: weekAfterNext,
    guests: {
      adults: 120,
      children: 30
    },
    totalPrice: 2000,
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PAID,
    specialRequests: 'Décoration florale, DJ et menu spécial',
    createdAt: new Date(weekAfterNext.getTime() - 90 * 24 * 60 * 60 * 1000), // 3 mois avant l'événement
    confirmationCode: 'REXW5678'
  },
  
  // Réservation en attente
  {
    id: uuidv4(),
    guestInfo: {
      firstName: 'Ibrahim',
      lastName: 'Coulibaly',
      email: 'ibrahim.coulibaly@example.com',
      phone: '+22509876543',
      country: 'Côte d\'Ivoire'
    },
    spaceId: 'room-type-b-id',
    spaceType: SpaceType.ROOM,
    checkIn: nextWeek,
    checkOut: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 jours après l'arrivée
    guests: {
      adults: 1,
      children: 0
    },
    totalPrice: 660,
    status: BookingStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    createdAt: new Date(), // Aujourd'hui
    confirmationCode: 'REXP9012'
  }
];