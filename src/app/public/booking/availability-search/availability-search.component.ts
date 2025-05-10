// src/app/public/booking/availability-search/availability-search.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SectionTitleComponent } from '../../../shared/components/content/section-title/section-title.component';
import { DatePickerComponent, DateRange } from '../../../shared/components/forms/date-picker/date-picker.component';
import { SelectDropdownComponent } from '../../../shared/components/forms/select-dropdown/select-dropdown.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputFieldComponent } from '../../../shared/components/forms/input-field/input-field.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { SpaceCardComponent } from '../../spaces/space-card/space-card.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { AccordionComponent } from '../../../shared/components/ui/accordion/accordion.component';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { BookingService } from '../../../core/services/booking.service';
import { SpaceService } from '../../../core/services/space.service';
import { NotificationService, NotificationType } from '../../../core/services/notification.service';
import { Space, SpaceType } from '../../../core/interfaces/space.interface';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { delay } from 'rxjs/operators';

interface FeaturedSpace {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  priceUnit: string;
  type: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

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
    CardComponent,
    SpaceCardComponent,
    AlertComponent,
    AccordionComponent
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
          <!-- Alert Message -->
          <app-alert 
            *ngIf="alertMessage"
            [type]="alertType"
            [title]="alertTitle"
            [dismissible]="true"
            (onDismiss)="closeAlert()"
            class="mb-6"
          >
            {{ alertMessage }}
          </app-alert>

          <!-- Search Form Card -->
          <app-card [hasHeader]="true">
            <div card-header class="flex items-center">
              <div class="h-8 w-8 bg-primary bg-opacity-10 text-primary rounded-full flex items-center justify-center mr-3">
                <span class="font-bold">1</span>
              </div>
              <h3 class="text-xl font-title font-bold">Recherchez la disponibilité</h3>
            </div>
            
            <form [formGroup]="searchForm" (ngSubmit)="onSubmit()">
              <!-- Dates -->
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
                  [minDate]="getFormattedToday()"
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
          
          <!-- Previous Search History -->
          <div *ngIf="previousSearches.length > 0" class="mt-6">
            <div class="bg-background-alt rounded-lg p-4">
              <h4 class="text-lg font-semibold text-primary mb-3">Recherches récentes</h4>
              <div class="space-y-2">
                <div *ngFor="let search of previousSearches" class="bg-background rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p class="text-text">
                      <span class="font-semibold">{{ formatDisplayDate(search.checkIn) }}</span> - 
                      <span class="font-semibold">{{ formatDisplayDate(search.checkOut) }}</span>
                    </p>
                    <p class="text-text text-sm opacity-70">
                      {{ getSpaceTypeLabel(search.spaceType) }} • 
                      {{ search.adults }} adulte(s){{ search.children > 0 ? ', ' + search.children + ' enfant(s)' : '' }}
                    </p>
                  </div>
                  <button 
                    (click)="loadPreviousSearch(search)"
                    class="text-primary hover:text-primary-hover"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Featured Spaces -->
          <div class="mt-12">
            <h3 class="text-2xl font-title font-bold text-primary mb-6">Nos espaces populaires</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div *ngFor="let space of featuredSpaces" class="bg-background-alt rounded-lg overflow-hidden shadow-lg">
                <div class="relative h-48">
                  <img [src]="space.imageUrl" [alt]="space.name" class="w-full h-full object-cover">
                </div>
                <div class="p-4">
                  <div class="flex justify-between items-start mb-3">
                    <h4 class="text-lg font-title font-bold text-primary">{{ space.name }}</h4>
                    <span class="text-primary font-semibold">{{ space.price }} {{ space.priceUnit }}</span>
                  </div>
                  <p class="text-text opacity-80 text-sm mb-4 line-clamp-2">{{ space.description }}</p>
                  <div class="flex justify-between items-center">
                    <span class="text-text text-sm opacity-70">{{ space.type }}</span>
                    <a 
                      [routerLink]="['/spaces', space.id]"
                      class="inline-block text-primary font-semibold hover:underline"
                    >
                      Voir les détails
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- FAQs -->
          <div class="mt-12 bg-background-alt rounded-lg p-6">
            <h3 class="text-xl font-title font-bold text-primary mb-4">Questions fréquentes</h3>
            
            <div class="space-y-4">
              <div *ngFor="let faq of faqs; let i = index" class="border-b border-dark-300 pb-4 last:border-b-0 last:pb-0">
                <h4 
                  class="font-semibold text-text mb-2 cursor-pointer flex justify-between items-center"
                  (click)="toggleFaq(i)"
                >
                  {{ faq.question }}
                  <svg 
                    class="w-5 h-5 text-primary transition-transform duration-300" 
                    [ngClass]="{'transform rotate-180': faqOpenStates[i]}"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </h4>
                <p *ngIf="faqOpenStates[i]" class="text-text opacity-80 mt-2">{{ faq.answer }}</p>
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
export class AvailabilitySearchComponent implements OnInit {
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
  previousSearches: any[] = [];
  featuredSpaces: FeaturedSpace[] = [];
  
  // Alert properties
  alertMessage = '';
  alertType: 'success' | 'error' | 'info' | 'warning' = 'info';
  alertTitle = '';
  
  // FAQ management
  faqs: FaqItem[] = [
    {
      question: 'Quel est l\'horaire d\'arrivée et de départ ?',
      answer: 'L\'arrivée est possible à partir de 14h et le départ doit se faire avant 12h. Une arrivée anticipée ou un départ tardif peut être organisé selon disponibilité moyennant un supplément.'
    },
    {
      question: 'Y a-t-il des frais d\'annulation ?',
      answer: 'Les annulations effectuées jusqu\'à 48 heures avant la date d\'arrivée sont gratuites. Au-delà, le montant de la première nuit sera facturé. Pour les réservations non remboursables, aucun remboursement n\'est possible.'
    },
    {
      question: 'Le petit-déjeuner est-il inclus ?',
      answer: 'Le petit-déjeuner est inclus dans certaines offres et peut être ajouté en option pour les autres. Notre buffet petit-déjeuner est servi de 6h30 à 10h30 en semaine et jusqu\'à 11h le week-end.'
    },
    {
      question: 'Proposez-vous un service de navette depuis l\'aéroport ?',
      answer: 'Oui, nous proposons un service de navette depuis l\'aéroport sur réservation préalable. Veuillez nous contacter au moins 48 heures avant votre arrivée pour organiser ce service.'
    },
    {
      question: 'Y a-t-il un parking à l\'hôtel ?',
      answer: 'Oui, l\'hôtel dispose d\'un parking sécurisé 24h/24 pour les clients. Le service est gratuit pour les clients de l\'hôtel.'
    }
  ];
  faqOpenStates: boolean[] = [];
  
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private localStorageService: LocalStorageService,
    private bookingService: BookingService,
    private spaceService: SpaceService,
    private notificationService: NotificationService
  ) {
    // Initialize form with default values
    this.searchForm = this.fb.group({
      dates: [null, Validators.required],
      spaceType: ['', Validators.required],
      adults: [2, [Validators.required, Validators.min(1), Validators.max(10)]],
      children: [0, [Validators.min(0), Validators.max(6)]],
      promoCode: ['']
    });
    
    // Initialize FAQ states
    this.faqOpenStates = this.faqs.map(() => false);
  }
  
  ngOnInit(): void {
    // Load previous searches from local storage
    this.loadPreviousSearches();
    
    // Load featured spaces
    this.loadFeaturedSpaces();
    
    // Try to restore form state if available
    this.restoreFormState();
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
    
    // Save form state
    this.saveFormState();
    
    const checkIn = this.formatDate(this.dateRange.startDate);
    const checkOut = this.formatDate(this.dateRange.endDate);
    const spaceType = this.searchForm.get('spaceType')?.value;
    const adults = this.searchForm.get('adults')?.value;
    const children = this.searchForm.get('children')?.value;
    const promoCode = this.searchForm.get('promoCode')?.value;
    
    // Validate dates
    if (!this.validateDates(checkIn, checkOut)) {
      this.isSubmitting = false;
      return;
    }
    
    // Check space availability using the booking service
    this.checkAvailability(checkIn, checkOut, spaceType)
      .pipe(
        tap(available => {
          if (available) {
            // Save search to history
            this.saveSearchToHistory({
              checkIn,
              checkOut,
              spaceType,
              adults,
              children,
              promoCode
            });
            
            // Navigate to the space selection page with query parameters
            this.router.navigate(['/booking/selection'], {
              queryParams: {
                checkIn,
                checkOut,
                spaceType,
                adults,
                children,
                promo: promoCode || undefined
              }
            });
          } else {
            // Show no availability message
            this.showAlert(
              'Aucune disponibilité',
              'Désolé, il n\'y a pas d\'espace disponible pour les dates sélectionnées. Veuillez essayer d\'autres dates.',
              'warning'
            );
          }
        }),
        catchError(error => {
          // Handle error
          this.showAlert(
            'Erreur',
            'Une erreur est survenue lors de la vérification de disponibilité. Veuillez réessayer plus tard.',
            'error'
          );
          console.error('Error checking availability:', error);
          return of(false);
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe();
  }
  
  /**
   * Validates the selected dates
   */
  validateDates(checkIn: string, checkOut: string): boolean {
    if (!checkIn || !checkOut) {
      this.showAlert('Dates invalides', 'Veuillez sélectionner des dates valides.', 'error');
      return false;
    }
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkInDate < today) {
      this.showAlert('Date d\'arrivée invalide', 'La date d\'arrivée ne peut pas être dans le passé.', 'error');
      return false;
    }
    
    if (checkOutDate <= checkInDate) {
      this.showAlert('Dates invalides', 'La date de départ doit être postérieure à la date d\'arrivée.', 'error');
      return false;
    }
    
    return true;
  }
  
  /**
   * Check availability for the given dates and space type
   */
  checkAvailability(checkIn: string, checkOut: string, spaceType: string): Observable<boolean> {
    // For demo purposes, we're simulating a call to the booking service
    // In a real app, this would query the actual availability
    
    // Simulate a delay
    return of(true).pipe(
      delay(1500),
      map(() => {
        // Validate promo code if provided
        const promoCode = this.searchForm.get('promoCode')?.value;
        if (promoCode && !this.validatePromoCode(promoCode)) {
          // Show invalid promo code message but still let them proceed
          this.notificationService.showWarning(
            'Le code promo saisi n\'est pas valide ou a expiré.',
            'Code promo invalide'
          );
        }
        
        // Generate a random availability (mostly true for testing)
        return Math.random() > 0.1; // 90% chance of availability
      })
    );
  }
  
  /**
   * Validate promo code
   */
  validatePromoCode(code: string): boolean {
    // Valid promo codes for testing
    const validCodes = ['WELCOME10', 'SUMMER25', 'VIP2025'];
    return validCodes.includes(code.toUpperCase());
  }
  
  /**
   * Save the current search to the search history
   */
  saveSearchToHistory(search: any): void {
    // Get existing searches from local storage
    const searches = this.localStorageService.get<any[]>('recent_searches', []) || [];
    
    // Add new search at the beginning, limited to last 3
    const updatedSearches = [
      search,
      ...searches.filter(s => 
        s.checkIn !== search.checkIn || 
        s.checkOut !== search.checkOut || 
        s.spaceType !== search.spaceType
      )
    ].slice(0, 3);
    
    // Save updated searches
    this.localStorageService.set('recent_searches', updatedSearches);
    
    // Update component state
    this.previousSearches = updatedSearches;
  }
  
  /**
   * Load previous searches from local storage
   */
  loadPreviousSearches(): void {
    this.previousSearches = this.localStorageService.get<any[]>('recent_searches', []) || [];
  }
  
  /**
   * Load a previous search into the form
   */
  loadPreviousSearch(search: any): void {
    // Update date range
    const startDate = new Date(search.checkIn);
    const endDate = new Date(search.checkOut);
    this.dateRange = { startDate, endDate };
    
    // Update form values
    this.searchForm.patchValue({
      dates: { startDate, endDate },
      spaceType: search.spaceType,
      adults: search.adults,
      children: search.children,
      promoCode: search.promoCode || ''
    });
    
    // Notify user
    this.notificationService.showInfo('Recherche précédente chargée.', 'Information');
  }
  
  /**
   * Save the current form state for later restoration
   */
  saveFormState(): void {
    this.localStorageService.saveFormState('booking_search', {
      dates: this.dateRange,
      spaceType: this.searchForm.get('spaceType')?.value,
      adults: this.searchForm.get('adults')?.value,
      children: this.searchForm.get('children')?.value,
      promoCode: this.searchForm.get('promoCode')?.value
    });
  }
  
  /**
   * Restore form state from local storage if available
   */
  restoreFormState(): void {
    const savedState = this.localStorageService.getFormState('booking_search');
    if (savedState) {
      // Restore date range if valid
      if (savedState.dates && savedState.dates.startDate && savedState.dates.endDate) {
        const startDate = new Date(savedState.dates.startDate);
        const endDate = new Date(savedState.dates.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Only restore if start date is not in the past
        if (startDate >= today) {
          this.dateRange = { 
            startDate: startDate, 
            endDate: endDate 
          };
        }
      }
      
      // Restore other form values
      this.searchForm.patchValue({
        dates: this.dateRange,
        spaceType: savedState.spaceType || '',
        adults: savedState.adults || 2,
        children: savedState.children || 0,
        promoCode: savedState.promoCode || ''
      });
    }
  }
  
  /**
   * Load featured spaces from the space service
   */
  loadFeaturedSpaces(): void {
    // In a real app, this would use the space service to get featured spaces
    // Here we're creating mock data for demonstration
    this.featuredSpaces = [
      {
        id: 'chambre-classique',
        name: 'Chambre Classique',
        type: 'Chambre',
        description: 'Une chambre élégante avec lit double et toutes les commodités essentielles pour un séjour confortable.',
        imageUrl: 'assets/images/rooms/classic-room.png',
        price: 150,
        priceUnit: 'FCFA / nuit'
      },
      {
        id: 'suite-deluxe',
        name: 'Suite Deluxe',
        type: 'Suite',
        description: 'Une suite spacieuse avec balcon privé offrant une vue imprenable sur la ville et un espace salon séparé.',
        imageUrl: 'assets/images/rooms/deluxe1.png',
        price: 280,
        priceUnit: 'FCFA / nuit'
      },
      {
        id: 'penthouse',
        name: 'Penthouse',
        type: 'Suite Executive',
        description: 'Notre suite exclusive au dernier étage avec terrasse privée et service de majordome disponible 24h/24.',
        imageUrl: 'assets/images/rooms/penthouse1.png',
        price: 750,
        priceUnit: 'FCFA / nuit'
      },
      {
        id: 'salle-conference',
        name: 'Salle de Conférence',
        type: 'Événementiel',
        description: 'Grande salle polyvalente pour les séminaires, conférences et événements professionnels.',
        imageUrl: 'assets/images/events/conference.png',
        price: 1500,
        priceUnit: 'FCFA / jour'
      }
    ];
  }
  
  /**
   * Format a date for API/URL parameters
   */
  formatDate(date: Date | null): string {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  
  /**
   * Format a date for display to users
   */
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
  
  /**
   * Get the formatted today's date for date picker min date
   */
  getFormattedToday(): string {
    return this.formatDate(new Date());
  }
  
  /**
   * Get a user-friendly label for space type
   */
  getSpaceTypeLabel(type: string): string {
    const option = this.spaceTypeOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  }
  
  /**
   * Show an alert message
   */
  showAlert(title: string, message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertType = type;
  }
  
  /**
   * Close the alert message
   */
  closeAlert(): void {
    this.alertMessage = '';
  }
  
  /**
   * Toggle the open state of a FAQ item
   */
  toggleFaq(index: number): void {
    this.faqOpenStates[index] = !this.faqOpenStates[index];
  }
}