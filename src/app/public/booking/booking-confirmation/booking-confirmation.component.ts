// src/app/public/booking/booking-confirmation/booking-confirmation.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';

// Services
import { BookingService } from '../../../core/services/booking.service';
import { NotificationService } from '../../../core/services/notification.service';

// Models
import { Booking } from '../../../core/interfaces/booking.interface';

// Components
import { SectionTitleComponent } from '../../../shared/components/content/section-title/section-title.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { DividerComponent } from '../../../shared/components/content/divider/divider.component';
import { LoaderComponent } from '../../../shared/components/ui/loader/loader.component';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SectionTitleComponent,
    CardComponent,
    ButtonComponent,
    AlertComponent,
    DividerComponent,
    LoaderComponent
  ],
  template: `
    <div class="min-h-screen bg-background py-12">
      <div class="container mx-auto px-4">
        <app-section-title
          title="Confirmation de réservation"
          [subtitle]="isLoading ? 'Chargement des détails de votre réservation...' : (bookingNotFound ? 'Réservation introuvable' : 'Votre réservation a été confirmée avec succès')"
          [centered]="true"
        ></app-section-title>
        
        <div class="max-w-3xl mx-auto mt-8">
          <!-- Loading State -->
          <div *ngIf="isLoading" class="flex justify-center py-12">
            <app-loader [text]="'Chargement des détails de votre réservation...'"></app-loader>
          </div>

          <!-- Error Alert for Missing Code -->
          <app-alert 
            *ngIf="!isLoading && !confirmationCode"
            type="error"
            title="Code de confirmation manquant"
            [dismissible]="false"
          >
            Aucun code de confirmation n'a été fourni.
            Veuillez retourner à la <a routerLink="/booking" class="underline">page de recherche</a>.
          </app-alert>
          
          <!-- Error Alert for Booking Not Found -->
          <app-alert 
            *ngIf="!isLoading && confirmationCode && bookingNotFound"
            type="error"
            title="Réservation introuvable"
            [dismissible]="false"
          >
            Aucune réservation n'a été trouvée avec le code de confirmation <span class="font-semibold">{{ confirmationCode }}</span>.
            Veuillez vérifier le code et réessayer ou contacter l'hôtel.
            <div class="mt-4 text-center">
              <a 
                routerLink="/booking/lookup" 
                class="inline-block bg-primary text-background px-4 py-2 rounded font-semibold hover:bg-primary-hover transition-colors"
              >
                Rechercher votre réservation
              </a>
            </div>
          </app-alert>

          <!-- Success message -->
          <app-alert 
            *ngIf="!isLoading && booking"
            type="success"
            [dismissible]="false"
          >
            <p class="text-lg font-semibold">Votre réservation est confirmée!</p>
            <p>Un email de confirmation a été envoyé à {{ booking?.guestInfo?.email || 'votre adresse email' }}</p>
          </app-alert>

          <!-- Booking Confirmation Details -->
          <app-card *ngIf="!isLoading && booking" [hasHeader]="true" class="mt-6">
            <div card-header class="flex items-center justify-between">
              <div class="flex items-center">
                <svg class="w-8 h-8 text-success mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 class="text-xl font-title font-bold">Confirmation #{{ booking?.confirmationCode }}</h3>
              </div>
              
              <div>
                <span class="text-success px-3 py-1 bg-success bg-opacity-10 rounded-full text-sm font-semibold">
                  {{ getStatusText(booking?.status) }}
                </span>
              </div>
            </div>
            
            <!-- Guest Information -->
            <div class="mb-6">
              <h4 class="font-semibold text-text mb-3">Informations du client</h4>
              <div class="bg-background-alt p-4 rounded-lg">
                <p class="mb-2"><span class="font-semibold">Nom:</span> {{ booking?.guestInfo?.firstName || '' }} {{ booking?.guestInfo?.lastName || '' }}</p>
                <p><span class="font-semibold">Email:</span> {{ booking?.guestInfo?.email || '' }}</p>
                <p *ngIf="booking?.guestInfo?.phone"><span class="font-semibold">Téléphone:</span> {{ booking?.guestInfo?.phone }}</p>
              </div>
            </div>
            
            <!-- Booking Details -->
            <div class="mb-6">
              <h4 class="font-semibold text-text mb-3">Détails de la réservation</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-background-alt p-4 rounded-lg">
                  <p class="mb-2"><span class="font-semibold">Arrivée:</span> {{ formatDisplayDate(booking?.checkIn) }}</p>
                  <p class="mb-2"><span class="font-semibold">Départ:</span> {{ formatDisplayDate(booking?.checkOut) }}</p>
                  <p><span class="font-semibold">Durée du séjour:</span> {{ calculateNights(booking?.checkIn, booking?.checkOut) }} nuit{{ calculateNights(booking?.checkIn, booking?.checkOut) > 1 ? 's' : '' }}</p>
                </div>
                
                <div class="bg-background-alt p-4 rounded-lg">
                  <p class="mb-2"><span class="font-semibold">Type d'espace:</span> {{ getSpaceTypeText(booking?.spaceType) }}</p>
                  <p class="mb-2"><span class="font-semibold">Voyageurs:</span> {{ booking?.guests?.adults || 0 }} adulte{{ (booking?.guests?.adults || 0) > 1 ? 's' : '' }}
                  <span *ngIf="(booking?.guests?.children || 0) > 0">, {{ booking?.guests?.children || 0 }} enfant{{ (booking?.guests?.children || 0) > 1 ? 's' : '' }}</span></p>
                  <p><span class="font-semibold">Prix total:</span> {{ booking?.totalPrice || 0 }}FCFA</p>
                </div>
              </div>

              <!-- Special Requests -->
              <div *ngIf="booking?.specialRequests" class="mt-4 bg-background-alt p-4 rounded-lg">
                <p class="font-semibold text-text mb-2">Demandes spéciales:</p>
                <p class="text-text italic">{{ booking?.specialRequests }}</p>
              </div>
            </div>
            
            <!-- Payment Information -->
            <div class="mb-6">
              <h4 class="font-semibold text-text mb-3">Informations de paiement</h4>
              <div class="bg-background-alt p-4 rounded-lg">
                <p class="mb-2"><span class="font-semibold">Statut du paiement:</span> {{ getPaymentStatusText(booking?.paymentStatus) }}</p>
                <p><span class="font-semibold">Méthode de paiement:</span> À régler à l'hôtel</p>
              </div>
            </div>
            
            <!-- Hotel Information -->
            <div class="mb-6">
              <h4 class="font-semibold text-text mb-3">Informations de l'hôtel</h4>
              <div class="bg-background-alt p-4 rounded-lg">
                <p class="mb-2"><span class="font-semibold">Nom:</span> REX Hotel</p>
                <p class="mb-2"><span class="font-semibold">Adresse:</span> Boulevard Principal, Yamoussoukro, Côte d'Ivoire</p>
                <p class="mb-2"><span class="font-semibold">Téléphone:</span> +225 XX XX XX XX</p>
                <p><span class="font-semibold">Email:</span> info&#64;rexhotel.com</p>
              </div>
            </div>
            
            <!-- Important Information -->
            <div class="mb-6">
              <h4 class="font-semibold text-text mb-3">Informations importantes</h4>
              <div class="bg-background-alt p-4 rounded-lg">
                <p class="mb-2"><span class="font-semibold">Enregistrement:</span> à partir de 14h00</p>
                <p class="mb-2"><span class="font-semibold">Départ:</span> jusqu'à 12h00</p>
                <p class="mb-4"><span class="font-semibold">Politique d'annulation:</span> Annulation gratuite jusqu'à 48 heures avant la date d'arrivée. En cas d'annulation tardive ou de non-présentation, le montant de la première nuit sera facturé.</p>
                <p>Veuillez présenter une pièce d'identité valide et une carte de crédit à l'arrivée.</p>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex flex-col md:flex-row justify-between gap-4">
              <button 
                (click)="printConfirmation()"
                class="text-primary border border-primary hover:bg-primary hover:bg-opacity-10 transition-colors px-6 py-2 rounded text-center font-semibold flex items-center justify-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm0 0h6"></path>
                </svg>
                Imprimer
              </button>
              
              <button 
                (click)="sendEmailConfirmation()"
                [disabled]="isEmailSending"
                class="text-primary border border-primary hover:bg-primary hover:bg-opacity-10 transition-colors px-6 py-2 rounded text-center font-semibold flex items-center justify-center"
              >
                <svg *ngIf="!isEmailSending" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <div *ngIf="isEmailSending" class="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                {{ isEmailSending ? 'Envoi en cours...' : 'Renvoyer par email' }}
              </button>
              
              <a 
                routerLink="/"
                class="bg-primary text-background hover:bg-primary-hover transition-colors px-6 py-2 rounded text-center font-bold flex items-center justify-center"
              >
                Retour à l'accueil
              </a>
            </div>
          </app-card>
        </div>
      </div>
    </div>
  `
})
export class BookingConfirmationComponent implements OnInit {
  confirmationCode: string | null = null;
  booking: Booking | null = null;
  isLoading = true;
  bookingNotFound = false;
  isEmailSending = false;
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private bookingService: BookingService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    this.isLoading = true;
    
    // Get confirmation code from route params
    this.route.paramMap.pipe(
      tap(params => {
        this.confirmationCode = params.get('code');
      }),
      switchMap(params => {
        const code = params.get('code');
        
        if (!code) {
          return of(null);
        }
        
        return this.bookingService.getBookingByConfirmationCode(code).pipe(
          catchError(error => {
            console.error('Error fetching booking:', error);
            return of(null);
          })
        );
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(booking => {
      if (booking) {
        this.booking = booking;
      } else if (this.confirmationCode) {
        this.bookingNotFound = true;
      }
    });
  }
  
  formatDisplayDate(dateObj: Date | undefined | string): string {
    if (!dateObj) return '';
    
    const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
    
    // Format: "22 mai 2025"
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  
  calculateNights(checkIn: Date | string | undefined, checkOut: Date | string | undefined): number {
    if (!checkIn || !checkOut) return 0;
    
    const startDate = checkIn instanceof Date ? checkIn : new Date(checkIn);
    const endDate = checkOut instanceof Date ? checkOut : new Date(checkOut);
    
    // Calculate the difference in milliseconds
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    
    // Convert to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }
  
  getStatusText(status: string | undefined): string {
    if (!status) return 'Inconnu';
    
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'checked-in':
        return 'Enregistré';
      case 'checked-out':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'Inconnu';
    }
  }
  
  getPaymentStatusText(status: string | undefined): string {
    if (!status) return 'Inconnu';
    
    switch (status) {
      case 'pending':
        return 'En attente de paiement';
      case 'paid':
        return 'Payé';
      case 'refunded':
        return 'Remboursé';
      default:
        return 'Inconnu';
    }
  }
  
  getSpaceTypeText(type: string | undefined): string {
    if (!type) return 'Inconnu';
    
    switch (type) {
      case 'room':
        return 'Chambre';
      case 'restaurant':
        return 'Restaurant';
      case 'bar':
        return 'Bar';
      case 'event_space':
        return 'Salle d\'événement';
      default:
        return type;
    }
  }
  
  printConfirmation(): void {
    window.print();
  }
  
  sendEmailConfirmation(): void {
    if (!this.booking || this.isEmailSending) return;
    
    this.isEmailSending = true;
    
    // Simulate sending email (in a real application, this would call an API)
    setTimeout(() => {
      this.isEmailSending = false;
      
      // Use notification service to show success message
      this.notificationService.showSuccess(
        `Un email de confirmation a été envoyé à ${this.booking?.guestInfo?.email || 'votre adresse email'}`,
        'Email envoyé'
      );
    }, 2000);
  }
}