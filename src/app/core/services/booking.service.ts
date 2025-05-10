// src/app/core/services/booking.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { 
  Booking, 
  BookingStatus, 
  PaymentStatus,
  GuestInfo 
} from '../interfaces/booking.interface';
import { SpaceType } from '../interfaces/space.interface';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookings: Booking[] = [];
  private bookingsSubject = new BehaviorSubject<Booking[]>(this.bookings);

  private bookingStats = new BehaviorSubject<{
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  }>({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0
  });

  constructor() {
    this.initializeMockBookings();
    this.updateBookingStats();
  }

  // Créer une nouvelle réservation
  createBooking(bookingData: {
    guestInfo: GuestInfo;
    spaceId: string;
    spaceType: SpaceType;
    checkIn: Date;
    checkOut: Date;
    guests: { adults: number; children: number };
    totalPrice: number;
    specialRequests?: string;
  }): Observable<Booking> {
    const newBooking: Booking = {
      id: uuidv4(),
      ...bookingData,
      status: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      createdAt: new Date(),
      confirmationCode: this.generateConfirmationCode()
    };

    this.bookings = [...this.bookings, newBooking];
    this.bookingsSubject.next(this.bookings);
    this.updateBookingStats();

    return of(newBooking).pipe(delay(1500));
  }

  getBookingById(id: string): Observable<Booking | undefined> {
    return this.bookingsSubject.pipe(
      map(bookings => bookings.find(booking => booking.id === id))
    );
  }

  getBookingByConfirmationCode(code: string): Observable<Booking | undefined> {
    return this.bookingsSubject.pipe(
      map(bookings => bookings.find(booking => booking.confirmationCode === code)),
      delay(1000)
    );
  }

  searchBookingsByEmail(email: string): Observable<Booking[]> {
    return this.bookingsSubject.pipe(
      map(bookings => 
        bookings.filter(booking => 
          booking.guestInfo.email.toLowerCase() === email.toLowerCase()
        )
      ),
      delay(1000)
    );
  }

  getAllBookings(): Observable<Booking[]> {
    return this.bookingsSubject.asObservable();
  }

  getFilteredBookings(filters: {
    status?: BookingStatus;
    startDate?: Date;
    endDate?: Date;
    spaceType?: SpaceType;
  }): Observable<Booking[]> {
    return this.bookingsSubject.pipe(
      map(bookings => bookings.filter(booking => {
        let matches = true;
        
        if (filters.status) {
          matches = matches && booking.status === filters.status;
        }
        
        if (filters.startDate) {
          matches = matches && new Date(booking.checkIn) >= filters.startDate;
        }
        
        if (filters.endDate) {
          matches = matches && new Date(booking.checkOut) <= filters.endDate;
        }
        
        if (filters.spaceType) {
          matches = matches && booking.spaceType === filters.spaceType;
        }
        
        return matches;
      }))
    );
  }

  updateBookingStatus(bookingId: string, status: BookingStatus): Observable<Booking | undefined> {
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
    this.updateBookingStats();

    return of(updatedBooking).pipe(delay(1000));
  }

  cancelBooking(bookingId: string): Observable<Booking | undefined> {
    return this.updateBookingStatus(bookingId, BookingStatus.CANCELLED);
  }

  getBookingStats(): Observable<{
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  }> {
    return this.bookingStats.asObservable();
  }

  getTodayBookings(): Observable<Booking[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.bookingsSubject.pipe(
      map(bookings => 
        bookings.filter(booking => 
          new Date(booking.checkIn) >= today && 
          new Date(booking.checkIn) < tomorrow
        )
      )
    );
  }

  getUpcomingBookings(): Observable<Booking[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.bookingsSubject.pipe(
      map(bookings => 
        bookings.filter(booking => 
          new Date(booking.checkIn) >= today &&
          booking.status !== BookingStatus.CANCELLED
        )
      )
    );
  }

  checkBookingConflicts(spaceId: string, checkIn: Date, checkOut: Date): Observable<boolean> {
    return this.bookingsSubject.pipe(
      map(bookings => 
        bookings.some(booking => 
          booking.spaceId === spaceId &&
          booking.status !== BookingStatus.CANCELLED &&
          new Date(booking.checkIn) < checkOut &&
          new Date(booking.checkOut) > checkIn
        )
      ),
      delay(1000)
    );
  }

  private generateConfirmationCode(): string {
    return 'REX' + Math.floor(10000 + Math.random() * 90000);
  }

  private updateBookingStats(): void {
    const stats = {
      total: this.bookings.length,
      pending: this.bookings.filter(b => b.status === BookingStatus.PENDING).length,
      confirmed: this.bookings.filter(b => b.status === BookingStatus.CONFIRMED).length,
      cancelled: this.bookings.filter(b => b.status === BookingStatus.CANCELLED).length
    };
    this.bookingStats.next(stats);
  }

  private initializeMockBookings(): void {
    const mockBookings: Booking[] = [
      {
        id: uuidv4(),
        guestInfo: {
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@example.com',
          phone: '+33612345678',
          country: 'France'
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
      {
        id: uuidv4(),
        guestInfo: {
          firstName: 'Marie',
          lastName: 'Koné',
          email: 'marie.kone@example.com',
          phone: '+22507123456',
          country: 'Côte d\'Ivoire'
        },
        spaceId: 'suite-deluxe',
        spaceType: SpaceType.ROOM,
        checkIn: new Date('2025-06-01'),
        checkOut: new Date('2025-06-05'),
        guests: {
          adults: 2,
          children: 1
        },
        totalPrice: 1120,
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        createdAt: new Date(),
        confirmationCode: 'REX12346',
        specialRequests: 'Lit bébé nécessaire'
      }
    ];

    this.bookings = mockBookings;
    this.bookingsSubject.next(this.bookings);
  }
}