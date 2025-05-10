// src/app/public/booking/space-selection/space-selection.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SectionTitleComponent } from '../../../shared/components/content/section-title/section-title.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { LoaderComponent } from '../../../shared/components/ui/loader/loader.component';
import { SpaceService } from '../../../core/services/space.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RoomSpace, Space, SpaceType } from '../../../core/interfaces/space.interface';
import { Subject, takeUntil } from 'rxjs';

interface BookingParams {
  checkIn: string;
  checkOut: string;
  spaceType: string;
  adults: number;
  children: number;
  promo?: string;
}

interface AvailableSpace extends Space {
  availableRooms: number;
  isRefundable: boolean;
  includedServices: string[];
  selected?: boolean;
  originalPrice?: number; // For discounted prices
}

@Component({
  selector: 'app-space-selection',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SectionTitleComponent,
    CardComponent,
    ButtonComponent,
    LoaderComponent
  ],
  template: `
    <div class="min-h-screen bg-background py-12">
      <div class="container mx-auto px-4">
        <app-section-title
          title="Sélectionnez votre espace"
          subtitle="Choisissez parmi nos espaces disponibles pour les dates sélectionnées"
          [centered]="true"
        ></app-section-title>
        
        <!-- Booking Summary -->
        <div class="max-w-5xl mx-auto mt-8">
          <div class="bg-background-alt rounded-lg p-6 shadow-lg mb-8">
            <div class="flex flex-wrap items-center justify-between">
              <div class="mb-4 md:mb-0">
                <h3 class="text-xl font-title font-bold text-primary mb-1">Résumé de votre recherche</h3>
                <div class="text-text">
                  <span class="mr-6">
                    <span class="font-semibold">Dates:</span> {{ formatDisplayDate(bookingParams.checkIn) }} - {{ formatDisplayDate(bookingParams.checkOut) }}
                    ({{ calculateNights() }} nuits)
                  </span>
                  <span class="mr-6">
                    <span class="font-semibold">Personnes:</span> 
                    {{ bookingParams.adults }} adulte{{ bookingParams.adults > 1 ? 's' : '' }}
                    <span *ngIf="bookingParams.children > 0">
                      , {{ bookingParams.children }} enfant{{ bookingParams.children > 1 ? 's' : '' }}
                    </span>
                  </span>
                </div>
              </div>
              
              <button
                (click)="modifySearch()"
                class="text-primary hover:text-primary-hover font-semibold flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Modifier la recherche
              </button>
            </div>
          </div>
          
          <!-- Loading State -->
          <div *ngIf="isLoading" class="flex justify-center py-12">
            <app-loader [text]="'Chargement des espaces disponibles...'"></app-loader>
          </div>
          
          <!-- Available Spaces -->
          <div *ngIf="!isLoading">
            <div *ngFor="let space of availableSpaces" class="mb-6 bg-background-alt rounded-lg overflow-hidden shadow-lg">
              <div class="flex flex-col md:flex-row">
                <!-- Space Image -->
                <div class="md:w-1/3">
                  <div class="h-60 md:h-full">
                    <img [src]="getSpaceImageUrl(space)" [alt]="space.name" class="w-full h-full object-cover">
                  </div>
                </div>
                
                <!-- Space Details -->
                <div class="md:w-2/3 p-6">
                  <div class="flex flex-col h-full">
                    <div class="mb-4">
                      <div class="flex justify-between items-start">
                        <div>
                          <h3 class="text-xl font-title font-bold text-primary mb-1">{{ space.name }}</h3>
                          <p class="text-text opacity-80 text-sm mb-3">{{ space.description }}</p>
                        </div>
                        <div class="flex flex-col items-end">
                          <div *ngIf="space.originalPrice" class="text-text line-through text-sm">{{ space.originalPrice }}{{ space.currency }}</div>
                          <div class="text-primary font-bold text-xl">{{ space.price }}{{ space.currency }}</div>
                          <div class="text-text text-sm">par nuit</div>
                        </div>
                      </div>
                      
                      <!-- Features & Amenities -->
                      <div class="grid grid-cols-2 gap-2 mb-4">
                        <div *ngIf="isRoomSpace(space)" class="flex items-center text-text text-sm">
                          <svg class="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {{ space.size }} m²
                        </div>
                        <div *ngIf="isRoomSpace(space)" class="flex items-center text-text text-sm">
                          <svg class="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {{ space.bedType }}
                        </div>
                        <div class="flex items-center text-text text-sm">
                          <svg class="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Capacité: {{ space.capacity }} pers.
                        </div>
                        <div class="flex items-center text-text text-sm">
                          <svg class="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {{ space.isRefundable ? 'Annulation gratuite' : 'Non remboursable' }}
                        </div>
                      </div>
                      
                      <!-- Services inclus -->
                      <div class="mb-4">
                        <p class="text-text font-semibold text-sm mb-1">Services inclus :</p>
                        <div class="flex flex-wrap gap-2">
                          <span *ngFor="let service of space.includedServices" 
                                class="inline-flex items-center text-xs px-2 py-1 rounded-full bg-primary bg-opacity-10 text-primary">
                            {{ service }}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Bottom with availability & CTA -->
                    <div class="mt-auto flex flex-col sm:flex-row justify-between items-center">
                      <div class="text-text text-sm mb-4 sm:mb-0">
                        <span *ngIf="space.availableRooms > 5" class="text-success">
                          {{ space.availableRooms }} chambres disponibles
                        </span>
                        <span *ngIf="space.availableRooms <= 5 && space.availableRooms > 1" class="text-primary font-semibold">
                          Plus que {{ space.availableRooms }} chambres disponibles !
                        </span>
                        <span *ngIf="space.availableRooms === 1" class="text-error font-semibold">
                          Dernière chambre disponible !
                        </span>
                      </div>
                      
                      <div>
                        <button 
                          (click)="selectSpace(space)"
                          class="bg-primary text-background font-bold uppercase px-6 py-2 rounded hover:bg-primary-hover transition-colors"
                          [ngClass]="{'bg-success': space.selected}"
                        >
                          {{ space.selected ? 'Sélectionné' : 'Sélectionner' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- No Results -->
            <div *ngIf="availableSpaces.length === 0" class="py-12 text-center">
              <div class="text-primary opacity-30 mb-4">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-text mb-2">Aucun espace disponible</h3>
              <p class="text-text opacity-70 mb-6">Désolé, aucun espace n'est disponible pour les dates sélectionnées.</p>
              <button 
                (click)="modifySearch()"
                class="bg-primary text-background font-bold uppercase px-6 py-3 rounded hover:bg-primary-hover transition-colors"
              >
                Modifier la recherche
              </button>
            </div>
          </div>
          
          <!-- Continue Button -->
          <div *ngIf="!isLoading && hasSelection" class="mt-8 flex justify-center">
            <button 
              (click)="continueToGuestInfo()"
              class="bg-primary text-background font-bold uppercase px-8 py-3 rounded hover:bg-primary-hover transition-colors"
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SpaceSelectionComponent implements OnInit, OnDestroy {
  bookingParams: BookingParams = {
    checkIn: '',
    checkOut: '',
    spaceType: '',
    adults: 1,
    children: 0
  };
  
  isLoading = true;
  availableSpaces: AvailableSpace[] = [];
  private destroy$ = new Subject<void>();
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private spaceService: SpaceService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    // Get query parameters from the URL
    this.route.queryParams.subscribe(params => {
      this.bookingParams = {
        checkIn: params['checkIn'] || '',
        checkOut: params['checkOut'] || '',
        spaceType: params['spaceType'] || '',
        adults: Number(params['adults']) || 1,
        children: Number(params['children']) || 0,
        promo: params['promo']
      };
      
      // Validate parameters
      if (!this.bookingParams.checkIn || !this.bookingParams.checkOut || !this.bookingParams.spaceType) {
        this.notificationService.showError('Informations de recherche incomplètes');
        this.router.navigate(['/booking']);
        return;
      }
      
      // Load available spaces
      this.loadAvailableSpaces();
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  get hasSelection(): boolean {
    return this.availableSpaces.some(space => space.selected);
  }
  
  loadAvailableSpaces(): void {
    this.isLoading = true;
    
    // Map the space type string from URL param to actual SpaceType enum
    let spaceTypeEnum: SpaceType | undefined;
    switch (this.bookingParams.spaceType) {
      case 'room':
        spaceTypeEnum = SpaceType.ROOM;
        break;
      case 'suite':
        spaceTypeEnum = SpaceType.ROOM; // Suite is also a room type
        break;
      case 'penthouse':
        spaceTypeEnum = SpaceType.ROOM; // Penthouse is also a room type
        break;
      case 'event_space':
        spaceTypeEnum = SpaceType.EVENT_SPACE;
        break;
      case 'restaurant':
        spaceTypeEnum = SpaceType.RESTAURANT;
        break;
      case 'bar':
        spaceTypeEnum = SpaceType.BAR;
        break;
    }
    
    // Get spaces by type
    if (spaceTypeEnum) {
      this.spaceService.getSpacesByType(spaceTypeEnum)
        .pipe(takeUntil(this.destroy$))
        .subscribe(spaces => {
          // Filter for available spaces
          const filteredSpaces = spaces.filter(space => space.available);
          
          // Convert spaces to available spaces with additional properties
          this.availableSpaces = filteredSpaces.map(space => this.convertToAvailableSpace(space));
          
          // Apply promo code if applicable
          this.applyPromoCodeIfNeeded();
          
          this.isLoading = false;
        });
    } else {
      // Fallback to search all spaces if type is not recognized
      this.spaceService.getAllSpaces()
        .pipe(takeUntil(this.destroy$))
        .subscribe(spaces => {
          // Filter for available spaces
          const filteredSpaces = spaces.filter(space => space.available);
          
          // Convert spaces to available spaces with additional properties
          this.availableSpaces = filteredSpaces.map(space => this.convertToAvailableSpace(space));
          
          // Apply promo code if applicable
          this.applyPromoCodeIfNeeded();
          
          this.isLoading = false;
        });
    }
  }
  
  private convertToAvailableSpace(space: Space): AvailableSpace {
    // Convert Space to AvailableSpace with additional properties
    return {
      ...space,
      availableRooms: Math.floor(Math.random() * 10) + 1, // Simulated availability
      isRefundable: true, // Default value
      includedServices: this.getIncludedServices(space),
    };
  }
  
  private getIncludedServices(space: Space): string[] {
    // Generate included services based on space type
    const baseServices = ['Wifi gratuit'];
    
    if (space.type === SpaceType.ROOM) {
      return [...baseServices, 'Petit-déjeuner inclus', 'Accès piscine'];
    } else if (space.type === SpaceType.EVENT_SPACE) {
      return [...baseServices, 'Équipement audiovisuel', 'Service traiteur', 'Support technique'];
    } else {
      return baseServices;
    }
  }
  
  private applyPromoCodeIfNeeded(): void {
    // Apply promo code if provided
    if (this.bookingParams.promo) {
      const promoCode = this.bookingParams.promo.toUpperCase();
      
      switch(promoCode) {
        case 'WELCOME10':
          // Apply 10% discount
          this.availableSpaces.forEach(space => {
            if (space.price) {
              space.originalPrice = space.price;
              space.price = Math.round(space.price * 0.9);
            }
          });
          this.notificationService.showSuccess(`Promotion WELCOME10 appliquée: 10% de réduction`);
          break;
        case 'SUMMER25':
          // Apply 25% discount
          this.availableSpaces.forEach(space => {
            if (space.price) {
              space.originalPrice = space.price;
              space.price = Math.round(space.price * 0.75);
            }
          });
          this.notificationService.showSuccess(`Promotion SUMMER25 appliquée: 25% de réduction`);
          break;
        default:
          this.notificationService.showError(`Code promo "${promoCode}" non reconnu`);
      }
    }
  }
  
  getSpaceImageUrl(space: Space): string {
    // Get primary image URL
    if (space.images && space.images.length > 0) {
      const primaryImage = space.images.find(img => img.isPrimary);
      return primaryImage ? primaryImage.url : space.images[0].url;
    }
    
    // Fallback image
    return `assets/images/rooms/default.jpg`;
  }
  
  isRoomSpace(space: Space): space is RoomSpace {
    return space.type === SpaceType.ROOM;
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
  
  calculateNights(): number {
    if (!this.bookingParams.checkIn || !this.bookingParams.checkOut) {
      return 0;
    }
    
    const checkIn = new Date(this.bookingParams.checkIn);
    const checkOut = new Date(this.bookingParams.checkOut);
    
    // Calculate the difference in milliseconds
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    
    // Convert to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }
  
  modifySearch(): void {
    this.router.navigate(['/booking'], {
      queryParams: this.bookingParams
    });
  }
  
  selectSpace(space: AvailableSpace): void {
    // Check availability in real-time using service
    const checkIn = new Date(this.bookingParams.checkIn);
    const checkOut = new Date(this.bookingParams.checkOut);
    
    this.spaceService.checkAvailability(space.id, checkIn, checkOut)
      .pipe(takeUntil(this.destroy$))
      .subscribe(available => {
        if (available) {
          // Deselect all spaces first
          this.availableSpaces.forEach(s => s.selected = false);
          
          // Select the clicked space
          space.selected = true;
          
          this.notificationService.showSuccess(`${space.name} sélectionné`);
        } else {
          this.notificationService.showError(`Désolé, ${space.name} n'est plus disponible pour les dates sélectionnées`);
          
          // Refresh availabilities
          this.loadAvailableSpaces();
        }
      });
  }
  
  continueToGuestInfo(): void {
    const selectedSpace = this.availableSpaces.find(space => space.selected);
    
    if (!selectedSpace) {
      this.notificationService.showError('Veuillez sélectionner un espace');
      return;
    }
    
    // Navigate to the guest information page with query parameters
    this.router.navigate(['/booking/guest-info'], {
      queryParams: {
        ...this.bookingParams,
        spaceId: selectedSpace.id,
        spaceName: selectedSpace.name,
        price: selectedSpace.price,
        nights: this.calculateNights()
      }
    });
  }
}