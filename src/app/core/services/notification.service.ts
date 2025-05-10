// src/app/core/services/notification.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  recipientId?: string; // ID de l'utilisateur destinataire (optionnel)
  link?: string; // Lien associé à la notification (optionnel)
  data?: any; // Données supplémentaires (optionnel)
}

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  BOOKING = 'booking',
  SYSTEM = 'system'
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private toastSubject = new Subject<Notification>();

  // Pour simuler un utilisateur connecté (à remplacer par AuthService)
  private currentUserId: string | null = null;

  constructor() {
    this.initializeMockNotifications();
  }

  // Obtenir toutes les notifications
  getNotifications(): Observable<Notification[]> {
    return this.notificationsSubject.pipe(
      map(notifications => 
        this.currentUserId 
          ? notifications.filter(n => !n.recipientId || n.recipientId === this.currentUserId)
          : notifications
      )
    );
  }

  // Obtenir les notifications non lues
  getUnreadNotifications(): Observable<Notification[]> {
    return this.notificationsSubject.pipe(
      map(notifications => 
        notifications.filter(n => 
          !n.read && 
          (!n.recipientId || n.recipientId === this.currentUserId)
        )
      )
    );
  }

  // Observer les toasts (notifications temporaires)
  getToastNotifications(): Observable<Notification> {
    return this.toastSubject.asObservable();
  }

  // Créer une nouvelle notification
  createNotification(
    title: string,
    message: string,
    type: NotificationType = NotificationType.INFO,
    options: {
      recipientId?: string;
      link?: string;
      data?: any;
      showToast?: boolean;
    } = {}
  ): Notification {
    const notification: Notification = {
      id: uuidv4(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
      recipientId: options.recipientId,
      link: options.link,
      data: options.data
    };

    this.notifications = [notification, ...this.notifications];
    this.notificationsSubject.next(this.notifications);

    // Émettre un toast si demandé
    if (options.showToast) {
      this.toastSubject.next(notification);
    }

    return notification;
  }

  // Marquer une notification comme lue
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notificationsSubject.next(this.notifications);
    }
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead(): void {
    this.notifications = this.notifications.map(notification => ({
      ...notification,
      read: true
    }));
    this.notificationsSubject.next(this.notifications);
  }

  // Supprimer une notification
  deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notificationsSubject.next(this.notifications);
  }

  // Créer une notification de réservation
  createBookingNotification(
    bookingId: string,
    title: string,
    message: string,
    recipientId?: string
  ): void {
    this.createNotification(title, message, NotificationType.BOOKING, {
      recipientId,
      link: `/admin/bookings/${bookingId}`,
      data: { bookingId },
      showToast: true
    });
  }

  // Créer une notification système
  createSystemNotification(
    title: string,
    message: string,
    showToast: boolean = true
  ): void {
    this.createNotification(title, message, NotificationType.SYSTEM, {
      showToast
    });
  }

  // Créer une notification de succès avec toast
  showSuccess(message: string, title: string = 'Succès'): void {
    this.createNotification(title, message, NotificationType.SUCCESS, {
      showToast: true
    });
  }

  // Créer une notification d'erreur avec toast
  showError(message: string, title: string = 'Erreur'): void {
    this.createNotification(title, message, NotificationType.ERROR, {
      showToast: true
    });
  }

  // Créer une notification d'avertissement avec toast
  showWarning(message: string, title: string = 'Attention'): void {
    this.createNotification(title, message, NotificationType.WARNING, {
      showToast: true
    });
  }

  // Créer une notification d'information avec toast
  showInfo(message: string, title: string = 'Information'): void {
    this.createNotification(title, message, NotificationType.INFO, {
      showToast: true
    });
  }

  // Nombre de notifications non lues
  getUnreadCount(): Observable<number> {
    return this.getUnreadNotifications().pipe(
      map(notifications => notifications.length)
    );
  }

  // Initialiser des notifications mockées
  private initializeMockNotifications(): void {
    const mockNotifications: Notification[] = [
      {
        id: uuidv4(),
        title: 'Nouvelle réservation',
        message: 'Une nouvelle réservation a été effectuée pour la Suite Deluxe',
        type: NotificationType.BOOKING,
        timestamp: new Date(),
        read: false,
        link: '/admin/bookings/123',
        data: { bookingId: '123' }
      },
      {
        id: uuidv4(),
        title: 'Maintenance système',
        message: 'Une maintenance est prévue ce soir à 22h',
        type: NotificationType.SYSTEM,
        timestamp: new Date(),
        read: true
      }
    ];

    this.notifications = mockNotifications;
    this.notificationsSubject.next(this.notifications);
  }

  // Pour le développement : simuler un changement d'utilisateur
  setCurrentUser(userId: string | null): void {
    this.currentUserId = userId;
    this.notificationsSubject.next(this.notifications);
  }
}