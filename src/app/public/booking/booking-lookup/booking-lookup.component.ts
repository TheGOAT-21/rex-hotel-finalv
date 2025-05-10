// src/app/public/booking/booking-lookup/booking-lookup.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SectionTitleComponent } from '../../../shared/components/content/section-title/section-title.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { InputFieldComponent } from '../../../shared/components/forms/input-field/input-field.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/interfaces/booking.interface';
import { LoaderComponent } from '../../../shared/components/ui/loader/loader.component';

@Component({
  selector: 'app-booking-lookup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SectionTitleComponent,
    CardComponent,
    InputFieldComponent,
    ButtonComponent,
    AlertComponent,
    LoaderComponent
  ],
  template: `
    <div class="min-h-screen bg-background py-12">
      <div class="container mx-auto px-4">
        <app-section-title
          title="Rechercher une réservation"
          subtitle="Consultez les détails de votre réservation existante"
          [centered]="true"
        ></app-section-title>
        
        <div class="max-w-xl mx-auto mt-8">
          <app-card [hasHeader]="false">
            <!-- Lookup Form -->
            <form [formGroup]="lookupForm" (ngSubmit)="onSubmit()">
              <div class="mb-6">
                <h3 class="text-xl font-title font-bold text-primary mb-4">Entrez vos informations</h3>
                <p class="text-text mb-6">Vous pouvez retrouver votre réservation en utilisant soit votre code de confirmation, soit votre adresse email et votre nom.</p>
                
                <div class="mb-6">
                  <div class="flex items-center mb-2">
                    <input 
                      type="radio" 
                      id="useConfirmationCode" 
                      formControlName="lookupMethod"
                      value="confirmationCode"
                      class="appearance-none h-5 w-5 border border-dark-300 rounded-full bg-dark-200 checked:bg-primary checked:border-primary checked:focus:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition-colors cursor-pointer relative before:content-[''] before:absolute before:w-2 before:h-2 before:rounded-full before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-background before:scale-0 checked:before:scale-100 before:transition-transform"
                    />
                    <label for="useConfirmationCode" class="ml-2 text-text cursor-pointer">
                      Code de confirmation
                    </label>
                  </div>
                  
                  <div class="flex items-center">
                    <input 
                      type="radio" 
                      id="useEmailName" 
                      formControlName="lookupMethod"
                      value="emailName"
                      class="appearance-none h-5 w-5 border border-dark-300 rounded-full bg-dark-200 checked:bg-primary checked:border-primary checked:focus:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition-colors cursor-pointer relative before:content-[''] before:absolute before:w-2 before:h-2 before:rounded-full before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-background before:scale-0 checked:before:scale-100 before:transition-transform"
                    />
                    <label for="useEmailName" class="ml-2 text-text cursor-pointer">
                      Email et nom
                    </label>
                  </div>
                </div>
                
                <!-- Confirmation Code Fields -->
                <div *ngIf="lookupForm.get('lookupMethod')?.value === 'confirmationCode'">
                  <app-input-field
                    id="confirmationCode"
                    label="Code de confirmation"
                    [required]="true"
                    [value]="lookupForm.get('confirmationCode')?.value"
                    (valueChange)="updateForm('confirmationCode', $event)"
                    [error]="getErrorMessage('confirmationCode')"
                    placeholder="Ex: REX12345"
                  ></app-input-field>
                </div>
                
                <!-- Email and Name Fields -->
                <div *ngIf="lookupForm.get('lookupMethod')?.value === 'emailName'">
                  <app-input-field
                    id="email"
                    label="Email"
                    type="email"
                    [required]="true"
                    [value]="lookupForm.get('email')?.value"
                    (valueChange)="updateForm('email', $event)"
                    [error]="getErrorMessage('email')"
                  ></app-input-field>
                  
                  <app-input-field
                    id="lastName"
                    label="Nom de famille"
                    [required]="true"
                    [value]="lookupForm.get('lastName')?.value"
                    (valueChange)="updateForm('lastName', $event)"
                    [error]="getErrorMessage('lastName')"
                  ></app-input-field>
                </div>
                
                <!-- Error Message -->
                <app-alert 
                  *ngIf="errorMessage"
                  type="error"
                  [dismissible]="true"
                  (onDismiss)="errorMessage = ''"
                >
                  {{ errorMessage }}
                </app-alert>
              </div>
              
              <!-- Submit Button -->
              <div class="flex justify-end">
                <app-button
                  type="submit"
                  [disabled]="lookupForm.invalid || isSubmitting"
                >
                  <div class="flex items-center justify-center">
                    <span *ngIf="!isSubmitting">Rechercher</span>
                    <div *ngIf="isSubmitting" class="flex items-center">
                      <div class="animate-spin h-5 w-5 border-2 border-background border-t-transparent rounded-full mr-2"></div>
                      Recherche...
                    </div>
                  </div>
                </app-button>
              </div>
            </form>
          </app-card>
          
          <!-- Found Booking Result -->
          <div *ngIf="foundBooking" class="mt-8">
            <app-card [hasHeader]="true">
              <div card-header class="flex justify-between items-center">
                <h3 class="text-lg font-title font-bold text-primary">Réservation trouvée</h3>
                <span class="px-3 py-1 rounded-full text-sm font-semibold"
                      [ngClass]="{
                        'bg-success bg-opacity-10 text-success': foundBooking.status === 'confirmed',
                        'bg-error bg-opacity-10 text-error': foundBooking.status === 'cancelled',
                        'bg-primary bg-opacity-10 text-primary': foundBooking.status === 'pending'
                      }">
                  {{ getStatusLabel(foundBooking.status) }}
                </span>
              </div>
              
              <div class="mb-4">
                <p class="mb-2"><span class="font-semibold">Code de confirmation:</span> {{ foundBooking.confirmationCode }}</p>
                <p class="mb-2"><span class="font-semibold">Client:</span> {{ foundBooking.guestInfo.firstName }} {{ foundBooking.guestInfo.lastName }}</p>
                <p class="mb-2"><span class="font-semibold">Espace:</span> {{ foundBooking.spaceType }}</p>
                <p class="mb-2"><span class="font-semibold">Arrivée:</span> {{ formatDate(foundBooking.checkIn) }}</p>
                <p><span class="font-semibold">Départ:</span> {{ formatDate(foundBooking.checkOut) }}</p>
              </div>
              
              <div class="flex justify-end">
                <app-button
                  (onClick)="viewBookingDetails(foundBooking.confirmationCode)"
                >
                  Voir les détails
                </app-button>
              </div>
            </app-card>
          </div>
          
          <!-- Need Help -->
          <div class="mt-8 text-center">
            <p class="text-text mb-2">Vous n'avez pas reçu votre confirmation ?</p>
            <p class="text-primary font-semibold">Contactez-nous au +225 XX XX XX XX</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BookingLookupComponent {
  lookupForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  foundBooking: Booking | null = null;
  
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private bookingService: BookingService
  ) {
    // Initialize form
    this.lookupForm = this.fb.group({
      lookupMethod: ['confirmationCode', Validators.required],
      confirmationCode: [''],
      email: [''],
      lastName: ['']
    });
    
    // Set validation based on lookup method
    this.setValidators();
    
    // Subscribe to lookupMethod changes
    this.lookupForm.get('lookupMethod')?.valueChanges.subscribe(() => {
      this.setValidators();
    });
  }
  
  setValidators() {
    const method = this.lookupForm.get('lookupMethod')?.value;
    const confirmationCode = this.lookupForm.get('confirmationCode');
    const email = this.lookupForm.get('email');
    const lastName = this.lookupForm.get('lastName');
    
    // Reset validators
    confirmationCode?.clearValidators();
    email?.clearValidators();
    lastName?.clearValidators();
    
    if (method === 'confirmationCode') {
      confirmationCode?.setValidators([Validators.required, Validators.pattern(/^REX\d{5}$/)]);
    } else if (method === 'emailName') {
      email?.setValidators([Validators.required, Validators.email]);
      lastName?.setValidators([Validators.required]);
    }
    
    // Update validity
    confirmationCode?.updateValueAndValidity();
    email?.updateValueAndValidity();
    lastName?.updateValueAndValidity();
  }
  
  updateForm(controlName: string, value: any): void {
    this.lookupForm.patchValue({ [controlName]: value });
    this.lookupForm.get(controlName)?.markAsTouched();
  }
  
  getErrorMessage(controlName: string): string {
    const control = this.lookupForm.get(controlName);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }
    
    if (control.errors['required']) {
      return 'Ce champ est requis';
    }
    
    if (control.errors['email']) {
      return 'Veuillez entrer une adresse email valide';
    }
    
    if (control.errors['pattern']) {
      if (controlName === 'confirmationCode') {
        return 'Format invalide. Ex: REX12345';
      }
    }
    
    return 'Valeur invalide';
  }
  
  onSubmit(): void {
    // Reset any previous results or errors
    this.foundBooking = null;
    this.errorMessage = '';
    
    // Mark all fields as touched to show validation errors
    Object.keys(this.lookupForm.controls).forEach(key => {
      const control = this.lookupForm.get(key);
      control?.markAsTouched();
    });
    
    if (this.lookupForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    
    const method = this.lookupForm.get('lookupMethod')?.value;
    
    if (method === 'confirmationCode') {
      const code = this.lookupForm.get('confirmationCode')?.value;
      this.searchByConfirmationCode(code);
    } else {
      const email = this.lookupForm.get('email')?.value;
      const lastName = this.lookupForm.get('lastName')?.value;
      this.searchByEmailAndName(email, lastName);
    }
  }
  
  private searchByConfirmationCode(code: string): void {
    this.bookingService.getBookingByConfirmationCode(code).subscribe({
      next: (booking) => {
        this.isSubmitting = false;
        if (booking) {
          this.foundBooking = booking;
        } else {
          this.errorMessage = 'Aucune réservation trouvée avec ce code de confirmation.';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Une erreur est survenue lors de la recherche. Veuillez réessayer.';
        console.error('Error searching booking:', err);
      }
    });
  }
  
  private searchByEmailAndName(email: string, lastName: string): void {
    this.bookingService.searchBookingsByEmail(email).subscribe({
      next: (bookings) => {
        this.isSubmitting = false;
        // Filter bookings by last name
        const matchingBookings = bookings.filter(
          b => b.guestInfo.lastName.toLowerCase() === lastName.toLowerCase()
        );
        
        if (matchingBookings.length > 0) {
          // Show the most recent booking
          this.foundBooking = matchingBookings.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
        } else {
          this.errorMessage = 'Aucune réservation trouvée avec ces informations.';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Une erreur est survenue lors de la recherche. Veuillez réessayer.';
        console.error('Error searching booking:', err);
      }
    });
  }
  
  viewBookingDetails(confirmationCode: string | undefined): void {
    if (!confirmationCode) return;
    
    // Navigate to booking confirmation page with the confirmation code
    this.router.navigate(['/booking/confirmation', confirmationCode]);
  }
  
  formatDate(date: Date | string): string {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  
  getStatusLabel(status: string): string {
    switch(status) {
      case 'confirmed': return 'Confirmée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      case 'checked-in': return 'Enregistrée';
      case 'checked-out': return 'Terminée';
      default: return status;
    }
  }
}