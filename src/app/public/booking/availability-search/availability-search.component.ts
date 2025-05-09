// src/app/public/booking/availability-search/availability-search.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SectionTitleComponent } from '../../../shared/components/content/section-title/section-title.component';
import { DatePickerComponent, DateRange } from '../../../shared/components/forms/date-picker/date-picker.component';
import { SelectDropdownComponent } from '../../../shared/components/forms/select-dropdown/select-dropdown.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputFieldComponent } from '../../../shared/components/forms/input-field/input-field.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-availability-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SectionTitleComponent,
    DatePickerComponent,
    SelectDropdownComponent,
    ButtonComponent,
    InputFieldComponent,
    CardComponent
  ],
  template: `
    <div class="min-h-screen bg-background py-12">
      <div class="container mx-auto px-4">
        <app-section-title
          title="Réservation"
          subtitle="Vérifiez la disponibilité de nos espaces et réservez votre séjour"
          [centered]="true"
        ></app-section-title>
        
        <div class="max-w-3xl mx-auto mt-8">
          <app-card [hasHeader]="true">
            <div card-header class="flex items-center">
              <div class="h-8 w-8 bg-primary bg-opacity-10 text-primary rounded-full flex items-center justify-center mr-3">
                <span class="font-bold">1</span>
              </div>
              <h3 class="text-xl font-title font-bold">Recherchez la disponibilité</h3>
            </div>
            
            <form [formGroup]="searchForm" (ngSubmit)="onSubmit()">
              <!-- Dates de séjour -->
              <div class="mb-6">
                <label class="block mb-2 font-body font-semibold text-text">
                  Dates de séjour <span class="text-error">*</span>
                </label>
                <app-date-picker
                  id="booking-dates"
                  [range]="true"
                  [required]="true"
                  [selectedDateRange]="dateRange"
                  (dateRangeChange)="onDateRangeChange($event)"
                  [error]="getErrorMessage('dates')"
                ></app-date-picker>
              </div>
              
              <!-- Type d'espace -->
              <div class="mb-6">
                <label class="block mb-2 font-body font-semibold text-text">
                  Type d'espace <span class="text-error">*</span>
                </label>
                <app-select-dropdown
                  id="space-type"
                  [required]="true"
                  [options]="spaceTypeOptions"
                  [value]="searchForm.get('spaceType')?.value"
                  (valueChange)="onSpaceTypeChange($event)"
                  [error]="getErrorMessage('spaceType')"
                ></app-select-dropdown>
              </div>
              
              <!-- Nombre de personnes -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <app-input-field
                  id="adults"
                  label="Adultes"
                  type="number"
                  [required]="true"
                  [value]="searchForm.get('adults')?.value"
                  (valueChange)="updateForm('adults', $event)"
                  [error]="getErrorMessage('adults')"
                ></app-input-field>
                
                <app-input-field
                  id="children"
                  label="Enfants"
                  type="number"
                  [value]="searchForm.get('children')?.value"
                  (valueChange)="updateForm('children', $event)"
                  [error]="getErrorMessage('children')"
                ></app-input-field>
              </div>
              
              <!-- Code promo (optionnel) -->
              <app-input-field
                id="promoCode"
                label="Code promo (optionnel)"
                [value]="searchForm.get('promoCode')?.value"
                (valueChange)="updateForm('promoCode', $event)"
                hint="Si vous avez un code promo, entrez-le ici"
              ></app-input-field>
              
              <!-- Submit Button -->
              <div class="mt-8 flex justify-end">
                <app-button
                  type="submit"
                  [disabled]="searchForm.invalid || isSubmitting"
                  [fullWidth]="true"
                >
                  <div class="flex items-center justify-center">
                    <span *ngIf="!isSubmitting">Rechercher la disponibilité</span>
                    <div *ngIf="isSubmitting" class="flex items-center">
                      <div class="animate-spin h-5 w-5 border-2 border-background border-t-transparent rounded-full mr-2"></div>
                      Recherche en cours...
                    </div>
                  </div>
                </app-button>
              </div>
            </form>
          </app-card>
          
          <!-- Featured Spaces (Optional) -->
          <div class="mt-12">
            <h3 class="text-2xl font-title font-bold text-primary mb-6">Nos espaces populaires</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Featured Space 1 -->
              <div class="bg-background-alt rounded-lg overflow-hidden shadow-lg">
                <div class="relative h-48">
                  <img src="assets/images/rooms/classic-room.jpg" alt="Chambre Classique" class="w-full h-full object-cover">
                </div>
                <div class="p-4">
                  <h4 class="text-lg font-title font-bold text-primary mb-2">Chambre Classique</h4>
                  <p class="text-text opacity-80 text-sm mb-4">À partir de 150€ / nuit</p>
                  <a 
                    routerLink="/spaces/chambre-classique"
                    class="inline-block text-primary font-semibold hover:underline"
                  >
                    Voir les détails
                  </a>
                </div>
              </div>
              
              <!-- Featured Space 2 -->
              <div class="bg-background-alt rounded-lg overflow-hidden shadow-lg">
                <div class="relative h-48">
                  <img src="assets/images/rooms/deluxe-suite.jpg" alt="Suite Deluxe" class="w-full h-full object-cover">
                </div>
                <div class="p-4">
                  <h4 class="text-lg font-title font-bold text-primary mb-2">Suite Deluxe</h4>
                  <p class="text-text opacity-80 text-sm mb-4">À partir de 280€ / nuit</p>
                  <a 
                    routerLink="/spaces/suite-deluxe"
                    class="inline-block text-primary font-semibold hover:underline"
                  >
                    Voir les détails
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <!-- FAQs -->
          <div class="mt-12 bg-background-alt rounded-lg p-6">
            <h3 class="text-xl font-title font-bold text-primary mb-4">Questions fréquentes</h3>
            
            <div class="space-y-4">
              <div>
                <h4 class="font-semibold text-text mb-2">Quel est l'horaire d'arrivée et de départ ?</h4>
                <p class="text-text opacity-80">L'arrivée est possible à partir de 14h et le départ doit se faire avant 12h.</p>
              </div>
              
              <div>
                <h4 class="font-semibold text-text mb-2">Y a-t-il des frais d'annulation ?</h4>
                <p class="text-text opacity-80">Les annulations effectuées jusqu'à 48 heures avant la date d'arrivée sont gratuites. Au-delà, le montant de la première nuit sera facturé.</p>
              </div>
              
              <div>
                <h4 class="font-semibold text-text mb-2">Le petit-déjeuner est-il inclus ?</h4>
                <p class="text-text opacity-80">Le petit-déjeuner est inclus dans certaines offres et peut être ajouté en option pour les autres.</p>
              </div>
            </div>
          </div>
          
          <!-- Need Help -->
          <div class="mt-8 text-center">
            <p class="text-text mb-2">Besoin d'aide pour votre réservation ?</p>
            <p class="text-primary font-semibold">Appelez-nous au +225 XX XX XX XX</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AvailabilitySearchComponent {
  spaceTypeOptions = [
    { value: '', label: 'Sélectionnez un type d\'espace' },
    { value: 'room', label: 'Chambre' },
    { value: 'suite', label: 'Suite' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'event_space', label: 'Salle d\'événement' }
  ];
  
  searchForm: FormGroup;
  dateRange: DateRange = { startDate: null, endDate: null };
  isSubmitting = false;
  
  constructor(private fb: FormBuilder, private router: Router) {
    // Initialize form with default values
    this.searchForm = this.fb.group({
      dates: [null, Validators.required],
      spaceType: ['', Validators.required],
      adults: [2, [Validators.required, Validators.min(1), Validators.max(10)]],
      children: [0, [Validators.min(0), Validators.max(6)]],
      promoCode: ['']
    });
  }
  
  onDateRangeChange(range: DateRange): void {
    this.dateRange = range;
    
    // Update the form with the new date range
    if (range.startDate && range.endDate) {
      this.searchForm.patchValue({
        dates: {
          startDate: range.startDate,
          endDate: range.endDate
        }
      });
      this.searchForm.get('dates')?.setErrors(null);
    } else {
      this.searchForm.get('dates')?.setErrors({ required: true });
    }
  }
  
  onSpaceTypeChange(type: string): void {
    this.searchForm.patchValue({ spaceType: type });
  }
  
  updateForm(controlName: string, value: any): void {
    this.searchForm.patchValue({ [controlName]: value });
  }
  
  getErrorMessage(controlName: string): string {
    const control = this.searchForm.get(controlName);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }
    
    if (control.errors['required']) {
      return 'Ce champ est requis';
    }
    
    if (control.errors['min']) {
      return `La valeur minimale est ${control.errors['min'].min}`;
    }
    
    if (control.errors['max']) {
      return `La valeur maximale est ${control.errors['max'].max}`;
    }
    
    return 'Valeur invalide';
  }
  
  onSubmit(): void {
    // Mark all controls as touched to show validation errors
    Object.keys(this.searchForm.controls).forEach(key => {
      const control = this.searchForm.get(key);
      control?.markAsTouched();
    });
    
    if (this.searchForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    
    // In a real application, we would call a service to check availability
    // For this demo, we'll simulate a delay then navigate to the selection page
    setTimeout(() => {
      this.isSubmitting = false;
      
      // Navigate to the space selection page with query parameters
      this.router.navigate(['/booking/selection'], {
        queryParams: {
          checkIn: this.formatDate(this.dateRange.startDate),
          checkOut: this.formatDate(this.dateRange.endDate),
          spaceType: this.searchForm.get('spaceType')?.value,
          adults: this.searchForm.get('adults')?.value,
          children: this.searchForm.get('children')?.value,
          promo: this.searchForm.get('promoCode')?.value || undefined
        }
      });
    }, 1500);
  }
  
  private formatDate(date: Date | null): string {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
}