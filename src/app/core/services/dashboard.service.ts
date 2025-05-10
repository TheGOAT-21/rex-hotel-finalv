// src/app/core/services/dashboard.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  DashboardStats, 
  OccupancyData, 
  RevenueData,
  RecentBooking 
} from '../interfaces/dashboard.interface';
import { BookingStatus } from '../interfaces/booking.interface';
import { SpaceType } from '../interfaces/space.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private stats = new BehaviorSubject<DashboardStats>({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    revenue: 0,
    recentBookings: 0,
    occupancyRate: 0
  });

  private mockData = {
    recentBookings: [] as RecentBooking[],
    occupancyData: [] as OccupancyData[],
    revenueData: [] as RevenueData[]
  };

  constructor() {
    this.initializeMockData();
  }

  /**
   * Obtenir les statistiques générales du dashboard
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.stats.asObservable().pipe(delay(1000));
  }

  /**
   * Obtenir les réservations récentes
   */
  getRecentBookings(limit: number = 5): Observable<RecentBooking[]> {
    return of(this.mockData.recentBookings.slice(0, limit))
      .pipe(delay(1000));
  }

  /**
   * Obtenir les données d'occupation
   */
  getOccupancyData(
    period: 'day' | 'week' | 'month' = 'week',
    startDate?: Date,
    endDate?: Date
  ): Observable<OccupancyData[]> {
    let filteredData = [...this.mockData.occupancyData];

    if (startDate && endDate) {
      filteredData = filteredData.filter(data => 
        data.date >= startDate && data.date <= endDate
      );
    }

    return of(filteredData).pipe(delay(1000));
  }

  /**
   * Obtenir les données de revenus
   */
  getRevenueData(
    period: 'day' | 'week' | 'month' | 'year' = 'month'
  ): Observable<RevenueData[]> {
    return of(this.mockData.revenueData
      .filter(data => data.period === period))
      .pipe(delay(1000));
  }

  /**
   * Obtenir la répartition des réservations par type d'espace
   */
  getBookingsBySpaceType(): Observable<{ type: SpaceType; count: number }[]> {
    return of([
      { type: SpaceType.ROOM, count: 45 },
      { type: SpaceType.RESTAURANT, count: 15 },
      { type: SpaceType.BAR, count: 10 },
      { type: SpaceType.EVENT_SPACE, count: 5 }
    ]).pipe(delay(1000));
  }

  /**
   * Obtenir la répartition des statuts de réservation
   */
  getBookingStatusDistribution(): Observable<{ status: BookingStatus; count: number }[]> {
    return of([
      { status: BookingStatus.CONFIRMED, count: 30 },
      { status: BookingStatus.PENDING, count: 15 },
      { status: BookingStatus.CHECKED_IN, count: 20 },
      { status: BookingStatus.CHECKED_OUT, count: 25 },
      { status: BookingStatus.CANCELLED, count: 10 }
    ]).pipe(delay(1000));
  }

  /**
   * Obtenir les statistiques de performance
   */
  getPerformanceMetrics(): Observable<{
    avgOccupancyRate: number;
    avgBookingValue: number;
    cancelationRate: number;
    repeatCustomerRate: number;
  }> {
    return of({
      avgOccupancyRate: 75.5,
      avgBookingValue: 280.0,
      cancelationRate: 8.5,
      repeatCustomerRate: 35.0
    }).pipe(delay(1000));
  }

  /**
   * Rafraîchir les statistiques du dashboard
   */
  refreshStats(): void {
    // Simuler une mise à jour des stats
    const newStats: DashboardStats = {
      totalBookings: Math.floor(Math.random() * 100) + 200,
      confirmedBookings: Math.floor(Math.random() * 50) + 100,
      pendingBookings: Math.floor(Math.random() * 30) + 20,
      revenue: Math.floor(Math.random() * 50000) + 100000,
      recentBookings: Math.floor(Math.random() * 10) + 5,
      occupancyRate: Math.floor(Math.random() * 30) + 70
    };
    this.stats.next(newStats);
  }

  /**
   * Initialiser les données mockées
   */
  private initializeMockData(): void {
    // Réservations récentes
    this.mockData.recentBookings = [
      {
        id: '1',
        guestName: 'Jean Dupont',
        spaceType: 'Chambre Deluxe',
        spaceName: 'Chambre 101',
        checkIn: new Date('2025-05-15'),
        checkOut: new Date('2025-05-18'),
        status: BookingStatus.CONFIRMED,
        totalPrice: 450
      },
      {
        id: '2',
        guestName: 'Marie Koné',
        spaceType: 'Suite',
        spaceName: 'Suite Royale',
        checkIn: new Date('2025-05-20'),
        checkOut: new Date('2025-05-25'),
        status: BookingStatus.PENDING,
        totalPrice: 1200
      }
      // Ajouter d'autres réservations mockées...
    ];

    // Données d'occupation
    const today = new Date();
    this.mockData.occupancyData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return {
        date,
        occupancyRate: Math.floor(Math.random() * 30) + 70,
        totalRooms: 84,
        occupiedRooms: Math.floor(Math.random() * 20) + 60
      };
    });

    // Données de revenus
    this.mockData.revenueData = [
      // Données journalières
      ...Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        return {
          period: 'day',
          date,
          amount: Math.floor(Math.random() * 5000) + 3000,
          bookingsCount: Math.floor(Math.random() * 10) + 5
        };
      }),
      // Données hebdomadaires
      ...Array.from({ length: 12 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (i * 7));
        return {
          period: 'week',
          date,
          amount: Math.floor(Math.random() * 30000) + 20000,
          bookingsCount: Math.floor(Math.random() * 50) + 30
        };
      }),
      // Données mensuelles
      ...Array.from({ length: 12 }, (_, i) => {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        return {
          period: 'month',
          date,
          amount: Math.floor(Math.random() * 150000) + 100000,
          bookingsCount: Math.floor(Math.random() * 200) + 150
        };
      })
    ];

    // Initialiser les stats
    this.refreshStats();
  }

  /**
   * Obtenir les statistiques par période
   */
  getStatsByPeriod(
    startDate: Date,
    endDate: Date
  ): Observable<{
    totalBookings: number;
    revenue: number;
    occupancyRate: number;
    averageStay: number;
  }> {
    // Simuler des calculs de statistiques pour la période
    return of({
      totalBookings: Math.floor(Math.random() * 100) + 50,
      revenue: Math.floor(Math.random() * 50000) + 25000,
      occupancyRate: Math.floor(Math.random() * 30) + 70,
      averageStay: Math.floor(Math.random() * 2) + 2
    }).pipe(delay(1000));
  }
}