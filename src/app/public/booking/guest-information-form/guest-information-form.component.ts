// src/app/public/booking/guest-information-form/guest-information-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SectionTitleComponent } from '../../../shared/components/content/section-title/section-title.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { InputFieldComponent } from '../../../shared/components/forms/input-field/input-field.component';
import { SelectDropdownComponent } from '../../../shared/components/forms/select-dropdown/select-dropdown.component';
import { CheckboxComponent } from '../../../shared/components/forms/checkbox/checkbox.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';

interface BookingQueryParams {
  checkIn: string;
  checkOut: string;
  spaceType: string;
  spaceId: string;
  spaceName: string;
  adults: number;
  children: number;
  price: number;
  nights: number;
  promo?: string;
}

@Component({
  selector: 'app-guest-information-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SectionTitleComponent,
    CardComponent,
    InputFieldComponent,
    SelectDropdownComponent,
    CheckboxComponent,
    ButtonComponent,
    AlertComponent
  ],
  template: `
    <div class="min-h-screen bg-background py-12">
      <div class="container mx-auto px-4">
        <app-section-title
          title="Informations de réservation"
          subtitle="Veuillez compléter vos informations personnelles pour finaliser votre réservation"
          [centered]="true"
        ></app-section-title>
        
        <div class="max-w-5xl mx-auto mt-8">
          <!-- Error Alert for Missing Params -->
          <app-alert 
            *ngIf="missingQueryParams"
            type="error"
            title="Informations manquantes"
            [dismissible]="false"
          >
            Des informations essentielles sont manquantes pour votre réservation. 
            Veuillez retourner à la <a routerLink="/booking" class="underline">page de recherche</a>.
          </app-alert>
          
          <!-- Booking Summary -->
          <app-card [hasHeader]="true" *ngIf="!missingQueryParams">
            <div card-header class="flex items-center">
              <div class="h-8 w-8 bg-primary bg-opacity-10 text-primary rounded-full flex items-center justify-center mr-3">
                <span class="font-bold">2</span>
              </div>
              <h3 class="text-xl font-title font-bold">Résumé de la réservation</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 class="font-semibold text-text mb-2">Détails du séjour</h4>
                <ul class="space-y-1 text-text">
                  <li><span class="opacity-70">Arrivée:</span> {{ formatDisplayDate(bookingParams.checkIn) }}</li>
                  <li><span class="opacity-70">Départ:</span> {{ formatDisplayDate(bookingParams.checkOut) }}</li>
                  <li><span class="opacity-70">Durée:</span> {{ bookingParams.nights }} nuit{{ bookingParams.nights > 1 ? 's' : '' }}</li>
                  <li>
                    <span class="opacity-70">Voyageurs:</span> 
                    {{ bookingParams.adults }} adulte{{ bookingParams.adults > 1 ? 's' : '' }}
                    <span *ngIf="bookingParams.children > 0">, 
                      {{ bookingParams.children }} enfant{{ bookingParams.children > 1 ? 's' : '' }}
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 class="font-semibold text-text mb-2">Espace sélectionné</h4>
                <p class="text-primary font-bold mb-1">{{ bookingParams.spaceName }}</p>
                <p class="text-text">
                  <span class="font-semibold">{{ bookingParams.price }}€</span> x {{ bookingParams.nights }} nuits
                </p>
                <p class="text-text font-bold mt-1">
                  Total: {{ bookingParams.price * bookingParams.nights }}€
                </p>
              </div>
            </div>
            
            <div class="border-t border-dark-300 my-6"></div>
            
            <!-- Guest Information Form -->
            <form [formGroup]="guestForm" (ngSubmit)="onSubmit()">
              <h4 class="font-semibold text-text mb-4">Vos informations</h4>
              
              <!-- Personal Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <app-input-field
                  id="firstName"
                  label="Prénom"
                  [required]="true"
                  [value]="guestForm.get('firstName')?.value"
                  (valueChange)="updateForm('firstName', $event)"
                  [error]="getErrorMessage('firstName')"
                ></app-input-field>
                
                <app-input-field
                  id="lastName"
                  label="Nom"
                  [required]="true"
                  [value]="guestForm.get('lastName')?.value"
                  (valueChange)="updateForm('lastName', $event)"
                  [error]="getErrorMessage('lastName')"
                ></app-input-field>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <app-input-field
                  id="email"
                  label="Email"
                  type="email"
                  [required]="true"
                  [value]="guestForm.get('email')?.value"
                  (valueChange)="updateForm('email', $event)"
                  [error]="getErrorMessage('email')"
                ></app-input-field>
                
                <app-input-field
                  id="phone"
                  label="Téléphone"
                  type="tel"
                  [required]="true"
                  [value]="guestForm.get('phone')?.value"
                  (valueChange)="updateForm('phone', $event)"
                  [error]="getErrorMessage('phone')"
                ></app-input-field>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <app-select-dropdown
                  id="country"
                  label="Pays"
                  [required]="true"
                  [options]="countryOptions"
                  [value]="guestForm.get('country')?.value"
                  (valueChange)="updateForm('country', $event)"
                  [error]="getErrorMessage('country')"
                ></app-select-dropdown>
                
                <app-input-field
                  id="city"
                  label="Ville"
                  [value]="guestForm.get('city')?.value"
                  (valueChange)="updateForm('city', $event)"
                ></app-input-field>
                
                <app-input-field
                  id="postalCode"
                  label="Code postal"
                  [value]="guestForm.get('postalCode')?.value"
                  (valueChange)="updateForm('postalCode', $event)"
                ></app-input-field>
              </div>
              
              <app-input-field
                id="address"
                label="Adresse"
                [value]="guestForm.get('address')?.value"
                (valueChange)="updateForm('address', $event)"
              ></app-input-field>
              
              <!-- Special Requests -->
              <div class="mt-6">
                <label class="block mb-2 font-body font-semibold text-text">
                  Demandes spéciales (optionnel)
                </label>
                <textarea
                  formControlName="specialRequests"
                  rows="3"
                  class="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Si vous avez des demandes particulières, n'hésitez pas à nous en faire part ici."
                ></textarea>
              </div>
              
              <!-- Estimated Arrival Time -->
              <div class="mt-6">
                <app-select-dropdown
                  id="arrivalTime"
                  label="Heure d'arrivée estimée"
                  [options]="arrivalTimeOptions"
                  [value]="guestForm.get('arrivalTime')?.value"
                  (valueChange)="updateForm('arrivalTime', $event)"
                ></app-select-dropdown>
                <p class="text-text opacity-70 text-sm mt-1">
                  L'enregistrement est possible à partir de 14h00. Si vous arrivez après 22h00, 
                  veuillez nous en informer à l'avance.
                </p>
              </div>
              
              <!-- Terms and Conditions -->
              <div class="mt-6">
                <app-checkbox
                  id="termsAccepted"
                  label="J'accepte les conditions générales de vente et la politique de confidentialité"
                  [checked]="guestForm.get('termsAccepted')?.value"
                  (checkedChange)="updateForm('termsAccepted', $event)"
                ></app-checkbox>
                <p *ngIf="getErrorMessage('termsAccepted')" class="mt-1 text-sm text-error">
                  {{ getErrorMessage('termsAccepted') }}
                </p>
              </div>
              
              <!-- Payment Method -->
              <div class="mt-8">
                <h4 class="font-semibold text-text mb-4">Méthode de paiement</h4>
                
                <div class="bg-background-alt border border-dark-300 rounded-lg p-4 mb-4">
                  <div class="flex items-center mb-4">
                    <input 
                      type="radio" 
                      id="creditCard" 
                      formControlName="paymentMethod"
                      value="creditCard"
                      class="appearance-none h-5 w-5 border border-dark-300 rounded-full bg-dark-200 checked:bg-primary checked:border-primary checked:focus:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition-colors cursor-pointer relative before:content-[''] before:absolute before:w-2 before:h-2 before:rounded-full before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-background before:scale-0 checked:before:scale-100 before:transition-transform"
                    />
                    <label for="creditCard" class="ml-2 text-text cursor-pointer flex items-center">
                      Carte de crédit
                      <span class="flex ml-3">
                        <img src="assets/images/payment/visa.svg" alt="Visa" class="h-8 mr-2">
                        <img src="assets/images/payment/mastercard.svg" alt="Mastercard" class="h-8 mr-2">
                        <img src="assets/images/payment/amex.svg" alt="American Express" class="h-8">
                      </span>
                    </label>
                  </div>
                  
                  <div *ngIf="guestForm.get('paymentMethod')?.value === 'creditCard'">
                    <p class="text-text mb-4">
                      Le paiement sera effectué directement à l'hôtel. Vos informations de carte 
                      serviront uniquement à garantir votre réservation.
                    </p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <app-input-field
                        id="cardholderName"
                        label="Nom du titulaire"
                        [required]="isPaymentMethodSelected('creditCard')"
                        [value]="guestForm.get('cardholderName')?.value"
                        (valueChange)="updateForm('cardholderName', $event)"
                        [error]="getErrorMessage('cardholderName')"
                      ></app-input-field>
                      
                      <app-input-field
                        id="cardNumber"
                        label="Numéro de carte"
                        [required]="isPaymentMethodSelected('creditCard')"
                        [value]="guestForm.get('cardNumber')?.value"
                        (valueChange)="updateForm('cardNumber', $event)"
                        [error]="getErrorMessage('cardNumber')"
                      ></app-input-field>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <app-input-field
                        id="expiryDate"
                        label="Date d'expiration (MM/AA)"
                        [required]="isPaymentMethodSelected('creditCard')"
                        [value]="guestForm.get('expiryDate')?.value"
                        (valueChange)="updateForm('expiryDate', $event)"
                        [error]="getErrorMessage('expiryDate')"
                      ></app-input-field>
                      
                      <app-input-field
                        id="cvv"
                        label="CVV"
                        [required]="isPaymentMethodSelected('creditCard')"
                        [value]="guestForm.get('cvv')?.value"
                        (valueChange)="updateForm('cvv', $event)"
                        [error]="getErrorMessage('cvv')"
                      ></app-input-field>
                    </div>
                  </div>
                </div>
                
                <div class="bg-background-alt border border-dark-300 rounded-lg p-4">
                  <div class="flex items-center">
                    <input 
                      type="radio" 
                      id="payAtHotel" 
                      formControlName="paymentMethod"
                      value="payAtHotel"
                      class="appearance-none h-5 w-5 border border-dark-300 rounded-full bg-dark-200 checked:bg-primary checked:border-primary checked:focus:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition-colors cursor-pointer relative before:content-[''] before:absolute before:w-2 before:h-2 before:rounded-full before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-background before:scale-0 checked:before:scale-100 before:transition-transform"
                    />
                    <label for="payAtHotel" class="ml-2 text-text cursor-pointer">
                      Paiement à l'hôtel
                    </label>
                  </div>
                  
                  <div *ngIf="guestForm.get('paymentMethod')?.value === 'payAtHotel'" class="mt-4">
                    <p class="text-text">
                      Vous paierez directement à l'hôtel lors de votre arrivée. Veuillez noter que l'hôtel 
                      pourrait vous demander une carte de crédit pour garantir votre réservation.
                    </p>
                  </div>
                </div>
                
                <p *ngIf="getErrorMessage('paymentMethod')" class="mt-1 text-sm text-error">
                  {{ getErrorMessage('paymentMethod') }}
                </p>
              </div>
              
              <!-- Submit Button -->
              <div class="mt-8 flex justify-between items-center">
                <button 
                  type="button"
                  (click)="goBack()"
                  class="text-primary hover:text-primary-hover font-semibold flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Retour
                </button>
                
                <app-button
                  type="submit"
                  [disabled]="isSubmitting"
                >
                  <div class="flex items-center justify-center">
                    <span *ngIf="!isSubmitting">Confirmer la réservation</span>
                    <div *ngIf="isSubmitting" class="flex items-center">
                      <div class="animate-spin h-5 w-5 border-2 border-background border-t-transparent rounded-full mr-2"></div>
                      Traitement en cours...
                    </div>
                  </div>
                </app-button>
              </div>
            </form>
          </app-card>
        </div>
      </div>
    </div>
  `
})
export class GuestInformationFormComponent implements OnInit {
  bookingParams: BookingQueryParams = {
    checkIn: '',
    checkOut: '',
    spaceType: '',
    spaceId: '',
    spaceName: '',
    adults: 1,
    children: 0,
    price: 0,
    nights: 0
  };
  
  countryOptions = [
    { value: '', label: 'Sélectionnez un pays' },
    { value: 'FR', label: 'France' },
    { value: 'CI', label: 'Côte d\'Ivoire' },
    { value: 'BE', label: 'Belgique' },
    { value: 'CH', label: 'Suisse' },
    { value: 'CA', label: 'Canada' },
    { value: 'SN', label: 'Sénégal' },
    { value: 'GB', label: 'Royaume-Uni' },
    { value: 'US', label: 'États-Unis' },
    { value: 'DE', label: 'Allemagne' },
    { value: 'IT', label: 'Italie' },
    { value: 'ES', label: 'Espagne' }
  ];
  
  arrivalTimeOptions = [
    { value: '', label: 'Sélectionnez une heure d\'arrivée' },
    { value: '14:00-16:00', label: '14:00 - 16:00' },
    { value: '16:00-18:00', label: '16:00 - 18:00' },
    { value: '18:00-20:00', label: '18:00 - 20:00' },
    { value: '20:00-22:00', label: '20:00 - 22:00' },
    { value: 'after-22:00', label: 'Après 22:00' }
  ];
  
  guestForm: FormGroup;
  isSubmitting = false;
  missingQueryParams = false;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialize form
    this.guestForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      country: ['', Validators.required],
      city: [''],
      postalCode: [''],
      address: [''],
      specialRequests: [''],
      arrivalTime: [''],
      termsAccepted: [false, Validators.requiredTrue],
      paymentMethod: ['creditCard', Validators.required],
      cardholderName: [''],
      cardNumber: [''],
      expiryDate: [''],
      cvv: ['']
    });
    
    // Set conditional validators
    this.onPaymentMethodChange();
  }
  
  ngOnInit(): void {
    // Get query parameters from the URL
    this.route.queryParams.subscribe(params => {
      // Check if all required parameters are present
      if (!params['checkIn'] || !params['checkOut'] || !params['spaceId'] || !params['price']) {
        this.missingQueryParams = true;
        return;
      }
      
      this.bookingParams = {
        checkIn: params['checkIn'],
        checkOut: params['checkOut'],
        spaceType: params['spaceType'],
        spaceId: params['spaceId'],
        spaceName: params['spaceName'],
        adults: Number(params['adults']) || 1,
        children: Number(params['children']) || 0,
        price: Number(params['price']) || 0,
        nights: Number(params['nights']) || 1,
        promo: params['promo']
      };
      
      // Set up form validation
      this.setupFormValidation();
    });
  }
  
  setupFormValidation(): void {
    // Add a value change listener to the payment method
    this.guestForm.get('paymentMethod')?.valueChanges.subscribe(
      () => this.onPaymentMethodChange()
    );
  }
  
  onPaymentMethodChange(): void {
    const paymentMethod = this.guestForm.get('paymentMethod')?.value;
    const cardholderName = this.guestForm.get('cardholderName');
    const cardNumber = this.guestForm.get('cardNumber');
    const expiryDate = this.guestForm.get('expiryDate');
    const cvv = this.guestForm.get('cvv');
    
    if (paymentMethod === 'creditCard') {
      cardholderName?.setValidators([Validators.required]);
      cardNumber?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
      expiryDate?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
      cvv?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
    } else {
      cardholderName?.clearValidators();
      cardNumber?.clearValidators();
      expiryDate?.clearValidators();
      cvv?.clearValidators();
    }
    
    cardholderName?.updateValueAndValidity();
    cardNumber?.updateValueAndValidity();
    expiryDate?.updateValueAndValidity();
    cvv?.updateValueAndValidity();
  }
  
  isPaymentMethodSelected(method: string): boolean {
    return this.guestForm.get('paymentMethod')?.value === method;
  }
  
  updateForm(controlName: string, value: any): void {
    this.guestForm.patchValue({ [controlName]: value });
    this.guestForm.get(controlName)?.markAsTouched();
  }
  
  getErrorMessage(controlName: string): string {
    const control = this.guestForm.get(controlName);
    
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
      if (controlName === 'cardNumber') {
        return 'Le numéro de carte doit contenir 16 chiffres';
      }
      if (controlName === 'expiryDate') {
        return 'Format invalide (MM/AA)';
      }
      if (controlName === 'cvv') {
        return 'Le CVV doit contenir 3 ou 4 chiffres';
      }
    }
    
    if (control.errors['requiredTrue']) {
      return 'Vous devez accepter les conditions';
    }
    
    return 'Valeur invalide';
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
    // Navigate back to the space selection page with the same parameters
    this.router.navigate(['/booking/selection'], {
      queryParams: {
        checkIn: this.bookingParams.checkIn,
        checkOut: this.bookingParams.checkOut,
        spaceType: this.bookingParams.spaceType,
        adults: this.bookingParams.adults,
        children: this.bookingParams.children,
        promo: this.bookingParams.promo
      }
    });
  }
  
  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    Object.keys(this.guestForm.controls).forEach(key => {
      const control = this.guestForm.get(key);
      control?.markAsTouched();
    });
    
    if (this.guestForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    
    // In a real application, you would send the data to a backend service
    // For this demo, we'll simulate a successful submission
    setTimeout(() => {
      this.isSubmitting = false;
      
      // Generate a confirmation code (in a real app, this would come from the backend)
      const confirmationCode = 'REX' + Math.floor(10000 + Math.random() * 90000);
      
      // Navigate to the confirmation page
      this.router.navigate(['/booking/confirmation', confirmationCode], {
        queryParams: {
          checkIn: this.bookingParams.checkIn,
          checkOut: this.bookingParams.checkOut,
          spaceId: this.bookingParams.spaceId,
          spaceName: this.bookingParams.spaceName,
          nights: this.bookingParams.nights,
          price: this.bookingParams.price,
          totalPrice: this.bookingParams.price * this.bookingParams.nights,
          firstName: this.guestForm.get('firstName')?.value,
          lastName: this.guestForm.get('lastName')?.value,
          email: this.guestForm.get('email')?.value
        }
      });
    }, 2000);
  }
}