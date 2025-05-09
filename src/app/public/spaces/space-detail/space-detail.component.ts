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
    AlertComponent
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
  
  constructor(private fb: FormBuilder, private router: Router) {
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
    // Mark all fields as touched to show validation errors
    Object.keys(this.lookupForm.controls).forEach(key => {
      const control = this.lookupForm.get(key);
      control?.markAsTouched();
    });
    
    if (this.lookupForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    // In a real application, this would be a service call
    // For this demo, we'll simulate success for REX12345
    setTimeout(() => {
      this.isSubmitting = false;
      
      const method = this.lookupForm.get('lookupMethod')?.value;
      
      if (method === 'confirmationCode') {
        const code = this.lookupForm.get('confirmationCode')?.value;
        
        if (code === 'REX12345') {
          // Navigate to confirmation page with mock data
          this.router.navigate(['/booking/confirmation', code], {
            queryParams: {
              checkIn: '2025-05-15',
              checkOut: '2025-05-18',
              spaceName: 'Chambre Deluxe',
              price: 280,
              totalPrice: 840,
              nights: 3,
              firstName: 'Jean',
              lastName: 'Dupont',
              email: 'jean.dupont@example.com'
            }
          });
        } else {
          this.errorMessage = 'Aucune réservation trouvée avec ce code de confirmation.';
        }
      } else {
        const email = this.lookupForm.get('email')?.value;
        const lastName = this.lookupForm.get('lastName')?.value;
        
        if (email === 'jean.dupont@example.com' && lastName === 'Dupont') {
          // Navigate to confirmation page with mock data
          this.router.navigate(['/booking/confirmation', 'REX12345'], {
            queryParams: {
              checkIn: '2025-05-15',
              checkOut: '2025-05-18',
              spaceName: 'Chambre Deluxe',
              price: 280,
              totalPrice: 840,
              nights: 3,
              firstName: 'Jean',
              lastName: 'Dupont',
              email: 'jean.dupont@example.com'
            }
          });
        } else {
          this.errorMessage = 'Aucune réservation trouvée avec ces informations.';
        }
      }
    }, 1500);
  }
}