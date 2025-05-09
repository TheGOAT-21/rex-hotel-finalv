// src/app/public/booking/booking-confirmation/booking-confirmation.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SectionTitleComponent } from '../../../shared/components/content/section-title/section-title.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { DividerComponent } from '../../../shared/components/content/divider/divider.component';

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
    DividerComponent
  ],
  template: `
    <div class="min-h-screen bg-background py-12">
      <div class="container mx-auto px-4">
        <app-section-title
          title="Confirmation de réservation"
          subtitle="Votre réservation a été confirmée avec succès"
          [centered]="true"
        ></app-section-title>
        
        <div class="max-w-3xl mx-auto mt-8">
          <!-- Error Alert for Missing Params -->
          <app-alert 
            *ngIf="!confirmationCode"
            type="error"
            title="Informations manquantes"
            [dismissible]="false"
          >
            Code de confirmation invalide ou manquant.
            Veuillez retourner à la <a routerLink="/booking" class="underline">page de recherche</a>.
          </app-alert>
          
          <!-- Success message -->
          <app-alert 
            *ngIf="confirmationCode"
            type="success"
            [dismissible]="false"
          >
            <p class="text-lg font-semibold">Votre réservation est confirmée!</p>
            <p>Un email de confirmation a été envoyé à {{ bookingParams.email }}</p>
          </app-alert>

          <!-- Booking Confirmation Details -->
          <app-card *ngIf="confirmationCode" [hasHeader]="true" class="mt-6">
            <div card-header class="flex items-center justify-between">
              <div class="flex items-center">
                <svg class="w-8 h-8 text-success mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 class="text-xl font-title font-bold">Confirmation #{{ confirmationCode }}</h3>
              </div>
              
              <div>
                <span class="text-success px-3 py-1 bg-success bg-opacity-10 rounded-full text-sm font-semibold">
                  Confirmée
                </span>
              </div>
            </div>
            
            <!-- Guest Information -->
            <div class="mb-6">
              <h4 class="font-semibold text-text mb-3">Informations du client</h4>
              <div class="bg-background-alt p-4 rounded-lg">
                <p class="mb-2"><span class="font-semibold">Nom:</span> {{ bookingParams.firstName }} {{ bookingParams.lastName }}</p>
                <p><span class="font-semibold">Email:</span> {{ bookingParams.email }}</p>
              </div>
            </div>
            
            <!-- Booking Details -->
            <div class="mb-6">
              <h4 class="font-semibold text-text mb-3">Détails de la réservation</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-background-alt p-4 rounded-lg">
                  <p class="mb-2"><span class="font-semibold">Arrivée:</span> {{ formatDisplayDate(bookingParams.checkIn) }}</p>
                  <p class="mb-2"><span class="font-semibold">Départ:</span> {{ formatDisplayDate(bookingParams.checkOut) }}</p>
                  <p><span class="font-semibold">Durée du séjour:</span> {{ bookingParams.nights }} nuit{{ bookingParams.nights > 1 ? 's' : '' }}</p>
                </div>
                
                <div class="bg-background-alt p-4 rounded-lg">
                  <p class="mb-2"><span class="font-semibold">Espace:</span> {{ bookingParams.spaceName }}</p>
                  <p class="mb-2"><span class="font-semibold">Prix par nuit:</span> {{ bookingParams.price }}€</p>
                  <p><span class="font-semibold">Prix total:</span> {{ bookingParams.totalPrice }}€</p>
                </div>
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
                class="text-primary border border-primary hover:bg-primary hover:bg-opacity-10 transition-colors px-6 py-2 rounded text-center font-semibold flex items-center justify-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Renvoyer par email
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
  bookingParams: any = {
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
  
  constructor(private route: ActivatedRoute, private router: Router) {}
  
  ngOnInit(): void {
    // Get confirmation code from route params
    this.route.paramMap.subscribe(params => {
      this.confirmationCode = params.get('code');
      
      // Get booking details from query params
      this.route.queryParams.subscribe(queryParams => {
        if (queryParams['checkIn'] && queryParams['checkOut'] && queryParams['spaceName']) {
          this.bookingParams = {
            checkIn: queryParams['checkIn'],
            checkOut: queryParams['checkOut'],
            spaceName: queryParams['spaceName'],
            price: Number(queryParams['price']) || 0,
            totalPrice: Number(queryParams['totalPrice']) || 0,
            nights: Number(queryParams['nights']) || 1,
            firstName: queryParams['firstName'] || '',
            lastName: queryParams['lastName'] || '',
            email: queryParams['email'] || '',
          };
        }
      });
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
  
  printConfirmation(): void {
    window.print();
  }
  
  sendEmailConfirmation(): void {
    // In a real application, this would call a service to send the email
    alert(`Confirmation envoyée à ${this.bookingParams.email}`);
  }
}