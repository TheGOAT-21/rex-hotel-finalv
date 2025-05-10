// src/app/core/services/space.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { SPACES } from '../../../mocks/spaces.mock';
import { Space, SpaceType, RoomSpace, DiningSpace, EventSpace } from '../interfaces/space.interface';
import { Booking, BookingStatus, PaymentStatus } from '../interfaces/booking.interface';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {
  private spaces: Space[] = SPACES;
  private bookings: Booking[] = [];
  
  // BehaviorSubject pour maintenir l'état des espaces et des réservations
  private spacesSubject = new BehaviorSubject<Space[]>(this.spaces);
  private bookingsSubject = new BehaviorSubject<Booking[]>(this.bookings);

  constructor() {
    // Charger les réservations mockées initiales
    this.initializeMockBookings();
  }

  // Obtenir tous les espaces
  getAllSpaces(): Observable<Space[]> {
    return this.spacesSubject.asObservable();
  }

  // Obtenir un espace par ID
  getSpaceById(id: string): Observable<Space | undefined> {
    return this.spacesSubject.pipe(
      map(spaces => spaces.find(space => space.id === id))
    );
  }

  // Obtenir les espaces par type
  getSpacesByType(type: SpaceType): Observable<Space[]> {
    return this.spacesSubject.pipe(
      map(spaces => spaces.filter(space => space.type === type))
    );
  }

  // Vérifier la disponibilité d'un espace
  checkAvailability(
    spaceId: string,
    checkIn: Date,
    checkOut: Date
  ): Observable<boolean> {
    // Simuler un délai de vérification
    return of(true).pipe(
      delay(1000),
      map(() => {
        const existingBookings = this.bookings.filter(
          booking => 
            booking.spaceId === spaceId &&
            booking.status !== BookingStatus.CANCELLED &&
            ((new Date(booking.checkIn) <= checkOut && new Date(booking.checkOut) >= checkIn))
        );
        return existingBookings.length === 0;
      })
    );
  }

  // Créer une nouvelle réservation
  createBooking(bookingData: Partial<Booking>): Observable<Booking> {
    // Générer un ID unique et un code de confirmation
    const confirmationCode = 'REX' + Math.floor(10000 + Math.random() * 90000);
    
    const newBooking: Booking = {
      id: uuidv4(),
      ...bookingData,
      status: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      createdAt: new Date(),
      confirmationCode
    } as Booking;

    // Ajouter la réservation à la liste
    this.bookings = [...this.bookings, newBooking];
    this.bookingsSubject.next(this.bookings);

    // Simuler un délai de traitement
    return of(newBooking).pipe(delay(1500));
  }

  // Obtenir une réservation par code de confirmation
  getBookingByConfirmationCode(code: string): Observable<Booking | undefined> {
    return this.bookingsSubject.pipe(
      map(bookings => bookings.find(booking => booking.confirmationCode === code))
    );
  }

  // Obtenir les réservations d'un client par email
  getBookingsByEmail(email: string): Observable<Booking[]> {
    return this.bookingsSubject.pipe(
      map(bookings => bookings.filter(booking => booking.guestInfo.email === email))
    );
  }

  // Mettre à jour le statut d'une réservation (pour l'admin)
  updateBookingStatus(
    bookingId: string, 
    status: BookingStatus
  ): Observable<Booking | undefined> {
    const bookingIndex = this.bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) return of(undefined);

    const updatedBooking = {
      ...this.bookings[bookingIndex],
      status
    };

    this.bookings = [
      ...this.bookings.slice(0, bookingIndex),
      updatedBooking,
      ...this.bookings.slice(bookingIndex + 1)
    ];

    this.bookingsSubject.next(this.bookings);
    return of(updatedBooking).pipe(delay(1000));
  }

  // Rechercher des espaces avec filtres
  searchSpaces(filters: {
    type?: SpaceType;
    minPrice?: number;
    maxPrice?: number;
    capacity?: number;
    available?: boolean;
  }): Observable<Space[]> {
    return this.spacesSubject.pipe(
      map(spaces => spaces.filter(space => {
        let matches = true;
        
        if (filters.type) {
          matches = matches && space.type === filters.type;
        }
        
        if (filters.minPrice !== undefined) {
          matches = matches && (space.price || 0) >= filters.minPrice;
        }
        
        if (filters.maxPrice !== undefined) {
          matches = matches && (space.price || 0) <= filters.maxPrice;
        }
        
        if (filters.capacity !== undefined) {
          matches = matches && (space.capacity || 0) >= filters.capacity;
        }
        
        if (filters.available !== undefined) {
          matches = matches && space.available === filters.available;
        }
        
        return matches;
      }))
    );
  }

  // Obtenir les réservations à venir
  getUpcomingBookings(): Observable<Booking[]> {
    const today = new Date();
    return this.bookingsSubject.pipe(
      map(bookings => 
        bookings.filter(booking => 
          new Date(booking.checkIn) >= today &&
          booking.status !== BookingStatus.CANCELLED
        )
      )
    );
  }

  // Initialiser des réservations mockées
  private initializeMockBookings() {
    // Ajouter quelques réservations de test
    this.bookings = [
      {
        id: uuidv4(),
        guestInfo: {
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@example.com',
          phone: '+33612345678'
        },
        spaceId: 'chambre-classique',
        spaceType: SpaceType.ROOM,
        checkIn: new Date('2025-05-15'),
        checkOut: new Date('2025-05-18'),
        guests: {
          adults: 2,
          children: 0
        },
        totalPrice: 450,
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PENDING,
        createdAt: new Date('2025-04-01'),
        confirmationCode: 'REX12345'
      },
      // Ajouter d'autres réservations mockées si nécessaire
    ];
    
    this.bookingsSubject.next(this.bookings);
  }
}