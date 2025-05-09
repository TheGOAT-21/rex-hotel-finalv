// src/app/public/booking/booking-summary/booking-summary.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SectionTitleComponent } from '../../../shared/components/content/section-title/section-title.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { DividerComponent } from '../../../shared/components/content/divider/divider.component';

interface BookingSummaryParams {
  checkIn: string;
  checkOut: string;
  spaceName: string;
  price: number;
  totalPrice: number;
  nights: number;
  firstName: string;
  lastName: string;
  email: string;
  paymentMethod?: string;
  // Additional booking details
  adults?: number;
  children?: number;
  specialRequests?: string;
  confirmationCode?: string;
}

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SectionTitleComponent,
    CardComponent,
    ButtonComponent,
    AlertComponent,
    DividerComponent
  ],
  template: `
    <div class="min-h-screen bg-background py-12">
      <div class="container mx-auto px-4">
        <app-section-title
          title="Résumé de votre réservation"
          subtitle="Vérifiez les détails de votre réservation avant de confirmer"
          [centered]="true"
        ></app-section-title>
        
        <div class="max-w-3xl mx-auto mt-8">
          <!-- Error Alert for Missing Params -->
          <app-alert 
            *ngIf="missingParams"
            type="error"
            title="Informations manquantes"
            [dismissible]="false"
          >
            Des informations essentielles sont manquantes. 
            Veuillez retourner à la <a routerLink="/booking" class="underline">page de recherche</a>.
          </app-alert>
          
          <!-- Booking Summary Card -->
          <app-card *ngIf="!missingParams" [hasHeader]="true">
            <div card-header class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="h-8 w-8 bg-primary bg-opacity-10 text-primary rounded-full flex items-center justify-center mr-3">
                  <span class="font-bold">3</span>
                </div>
                <h3 class="text-xl font-title font-bold">Vérification finale</h3>
              </div>
              
              <div class="text-success font-semibold flex items-center" *ngIf="bookingParams.confirmationCode">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Réservation #{{ bookingParams.confirmationCode }}
              </div>
            </div>
            
            <!-- Booking Details -->
            <div class="mb-6">
              <h4 class="font-semibold text-text mb-4">Détails de la réservation</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Date & Time Info -->
                <div class="bg-background-alt p-4 rounded-lg">
                  <p class="text-text mb-2">
                    <span class="font-semibold">Arrivée:</span>
                    <span class="float-right">{{ formatDisplayDate(bookingParams.checkIn) }}</span>
                  </p>
                  <p class="text-text mb-2">
                    <span class="font-semibold">Départ:</span>
                    <span class="float-right">{{ formatDisplayDate(bookingParams.checkOut) }}</span>
                  </p>
                  <p class="text-text">
                    <span class="font-semibold">Durée du séjour:</span>
                    <span class="float-right">{{ bookingParams.nights }} nuit{{ bookingParams.nights > 1 ? 's' : '' }}</span>
                  </p>
                </div>
                
                <!-- Room Info -->
                <div class="bg-background-alt p-4 rounded-lg">
                  <p class="text-text mb-2">
                    <span class="font-semibold">Espace:</span>
                    <span class="float-right">{{ bookingParams.spaceName }}</span>
                  </p>
                  <p class="text-text mb-2" *ngIf="bookingParams.adults !== undefined">
                    <span class="font-semibold">Adultes:</span>
                    <span class="float-right">{{ bookingParams.adults }}</span>
                  </p>
                  <p class="text-text" *ngIf="bookingParams.children !== undefined">
                    <span class="font-semibold">Enfants:</span>
                    <span class="float-right">{{ bookingParams.children || 0 }}</span>
                  </p>
                </div>
              </div>
              
              <!-- Special Requests -->
              <div *ngIf="bookingParams.specialRequests" class="mt-4 bg-background-alt p-4 rounded-lg">
                <p class="font-semibold text-text mb-2">Demandes spéciales:</p>
                <p class="text-text italic">{{ bookingParams.specialRequests }}</p>
              </div>
            </div>
            
            <!-- Guest Information -->
            <div class="mb-6">
              <h4 class="font-semibold text-text mb-4">Informations du client</h4>
              
              <div class="bg-background-alt p-4 rounded-lg">
                <p class="text-text mb-2">
                  <span class="font-semibold">Nom:</span>
                  <span class="float-right">{{ bookingParams.firstName }} {{ bookingParams.lastName }}</span>
                </p>
                <p class="text-text">
                  <span class="font-semibold">Email:</span>
                  <span class="float-right">{{ bookingParams.email }}</span>
                </p>
              </div>
            </div>
            
            <!-- Payment Details -->
            <div class="mb-6">
              <h4 class="font-semibold text-text mb-4">Détails du paiement</h4>
              
              <div class="bg-background-alt p-4 rounded-lg">
                <p class="text-text mb-2">
                  <span class="font-semibold">Méthode de paiement:</span>
                  <span class="float-right">
                    {{ bookingParams.paymentMethod === 'creditCard' ? 'Carte de crédit' : 'Paiement à l\'hôtel' }}
                  </span>
                </p>
                <p class="text-text mb-2">
                  <span class="font-semibold">Prix par nuit:</span>
                  <span class="float-right">{{ bookingParams.price }}€</span>
                </p>
                <app-divider></app-divider>
                <p class="text-text font-bold">
                  <span>Total:</span>
                  <span class="float-right">{{ bookingParams.totalPrice }}€</span>
                </p>
              </div>
              
              <p class="text-text opacity-70 text-sm mt-2">
                * Prix incluant toutes les taxes et frais de service.
              </p>
            </div>
            
            <!-- Policy Information -->
            <div class="mb-6">
              <h4 class="font-semibold text-text mb-4">Politique d'annulation</h4>
              
              <div class="bg-background-alt p-4 rounded-lg">
                <p class="text-text">
                  Annulation gratuite jusqu'à 48 heures avant la date d'arrivée. 
                  En cas d'annulation tardive ou de non-présentation, le montant de la première nuit sera facturé.
                </p>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex flex-col md:flex-row justify-between gap-4">
              <button 
                *ngIf="!bookingParams.confirmationCode"
                (click)="goBack()"
                class="text-primary border border-primary hover:bg-primary hover:bg-opacity-10 transition-colors px-6 py-2 rounded text-center font-semibold"
              >
                Modifier les informations
              </button>
              
              <button 
                *ngIf="!bookingParams.confirmationCode"
                (click)="confirmBooking()"
                class="bg-primary text-background hover:bg-primary-hover transition-colors px-6 py-2 rounded text-center font-bold grow md:grow-0"
                [disabled]="isSubmitting"
              >
                <div class="flex items-center justify-center">
                  <span *ngIf="!isSubmitting">Confirmer la réservation</span>
                  <div *ngIf="isSubmitting" class="flex items-center">
                    <div class="animate-spin h-5 w-5 border-2 border-background border-t-transparent rounded-full mr-2"></div>
                    Traitement...
                  </div>
                </div>
              </button>
              
              <!-- Download/Print buttons when confirmed -->
              <div *ngIf="bookingParams.confirmationCode" class="flex flex-col md:flex-row gap-4 w-full">
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
                  (click)="downloadConfirmation()"
                  class="text-primary border border-primary hover:bg-primary hover:bg-opacity-10 transition-colors px-6 py-2 rounded text-center font-semibold flex items-center justify-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Télécharger PDF
                </button>
                
                <a
                  routerLink="/"
                  class="bg-primary text-background hover:bg-primary-hover transition-colors px-6 py-2 rounded text-center font-bold grow md:grow-0 flex items-center justify-center"
                >
                  Retour à l'accueil
                </a>
              </div>
            </div>
          </app-card>
        </div>
      </div>
    </div>
  `
})
export class BookingSummaryComponent implements OnInit {
  bookingParams: BookingSummaryParams = {
    checkIn: '',
    checkOut: '',
    spaceName: '',
    price: 0,
    totalPrice: 0,
    nights: 0,
    firstName: '',
    lastName: '',
    email: ''
  };
  
  missingParams = false;
  isSubmitting = false;
  
  constructor(private route: ActivatedRoute, private router: Router) {}
  
  ngOnInit(): void {
    // Get query parameters from the URL
    this.route.queryParams.subscribe(params => {
      // Check for required parameters
      if (!params['checkIn'] || !params['checkOut'] || !params['spaceName'] || 
          !params['price'] || !params['firstName'] || !params['lastName']) {
        this.missingParams = true;
        return;
      }
      
      // Populate booking parameters
      this.bookingParams = {
        checkIn: params['checkIn'],
        checkOut: params['checkOut'],
        spaceName: params['spaceName'],
        price: Number(params['price']) || 0,
        totalPrice: Number(params['totalPrice']) || 0,
        nights: Number(params['nights']) || 1,
        firstName: params['firstName'],
        lastName: params['lastName'],
        email: params['email'],
        paymentMethod: params['paymentMethod'],
        adults: Number(params['adults']) || undefined,
        children: Number(params['children']) || undefined,
        specialRequests: params['specialRequests'],
        confirmationCode: params['confirmationCode']
      };
    });
  }
  
  formatDisplayDate(dateStr: string): string {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    // Format: "22 mai 2025"
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  
  goBack(): void {
    // Navigate back to the guest information form
    this.router.navigate(['/booking/guest-info'], {
      queryParams: {
        checkIn: this.bookingParams.checkIn,
        checkOut: this.bookingParams.checkOut,
        spaceName: this.bookingParams.spaceName,
        spaceId: this.route.snapshot.queryParams['spaceId'],
        price: this.bookingParams.price,
        nights: this.bookingParams.nights,
        adults: this.bookingParams.adults,
        children: this.bookingParams.children,
        specialRequests: this.bookingParams.specialRequests
      }
    });
  }
  
  confirmBooking(): void {
    this.isSubmitting = true;
    
    // In a real application, you would submit the booking to a backend service
    // For this demo, we'll simulate a successful submission with a delay
    setTimeout(() => {
      // Generate a confirmation code
      const confirmationCode = 'REX' + Math.floor(10000 + Math.random() * 90000);
      
      // Navigate to the confirmation page
      this.router.navigate(['/booking/confirmation', confirmationCode], {
        queryParams: {
          ...this.route.snapshot.queryParams,
          confirmationCode: confirmationCode
        }
      });
    }, 2000);
  }
  
  printConfirmation(): void {
    window.print();
  }
  
  downloadConfirmation(): void {
    // In a real application, this would generate a PDF
    // For this demo, we'll just show an alert
    alert('Cette fonctionnalité n\'est pas disponible dans cette démo.');
  }
}