// src/app/public/spaces/space-detail/space-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, of, switchMap, catchError, map } from 'rxjs';

// Services
import { SpaceService } from '../../../core/services/space.service';
import { BookingService } from '../../../core/services/booking.service';
import { NotificationService, NotificationType } from '../../../core/services/notification.service';

// Interfaces
import { Space, SpaceType, RoomSpace, DiningSpace, EventSpace, TimeRange, OpeningHours } from '../../../core/interfaces/space.interface';

// Components
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { SpaceGalleryComponent } from '../space-gallery/space-gallery.component';
import { LoaderComponent } from '../../../shared/components/ui/loader/loader.component';
import { AmenityComponent } from '../../../shared/components/content/amenity/amenity.component';
import { DatePickerComponent, DateRange } from '../../../shared/components/forms/date-picker/date-picker.component';
import { InputFieldComponent } from '../../../shared/components/forms/input-field/input-field.component';
import { SelectDropdownComponent } from '../../../shared/components/forms/select-dropdown/select-dropdown.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { DividerComponent } from '../../../shared/components/content/divider/divider.component';
import { TabsComponent } from '../../../shared/components/ui/tabs/tabs.component';

@Component({
  selector: 'app-space-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardComponent,
    ButtonComponent,
    SpaceGalleryComponent,
    LoaderComponent,
    AmenityComponent,
    DatePickerComponent,
    InputFieldComponent,
    SelectDropdownComponent,
    AlertComponent,
    DividerComponent,
    TabsComponent
  ],
  template: `
    <div class="min-h-screen bg-background py-8">
      <div class="container mx-auto px-4">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex justify-center py-12">
          <app-loader [text]="'Chargement des informations...'"></app-loader>
        </div>
        
        <!-- Error State -->
        <div *ngIf="error" class="max-w-4xl mx-auto">
          <app-alert
            type="error"
            title="Erreur"
            [dismissible]="false"
          >
            {{ error }}
          </app-alert>
          
          <div class="mt-6 text-center">
            <a routerLink="/spaces" class="text-primary hover:underline">Retour à la liste des espaces</a>
          </div>
        </div>
        
        <!-- Content when loaded -->
        <div *ngIf="space && !isLoading" class="space-detail">
          <!-- Space Name and Type -->
          <div class="text-center mb-8">
            <div *ngIf="space.type" class="text-primary text-sm font-bold uppercase mb-2">{{ getSpaceTypeName(space.type) }}</div>
            <h1 class="text-3xl md:text-4xl font-title font-bold text-primary">{{ space.name }}</h1>
          </div>
          
          <!-- Main Content -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column: Gallery and Description -->
            <div class="lg:col-span-2">
              <!-- Gallery -->
              <app-space-gallery
                [images]="space.images"
                [enableFullscreen]="true"
              ></app-space-gallery>
              
              <!-- Description -->
              <div class="mt-8">
                <h2 class="text-xl font-title font-bold text-primary mb-4">Description</h2>
                <p class="text-text">{{ space.description }}</p>
              </div>
              
              <!-- Features and Amenities -->
              <div class="mt-8">
                <h2 class="text-xl font-title font-bold text-primary mb-4">
                  {{ isRoomSpace(space) ? 'Équipements et services' : 'Caractéristiques' }}
                </h2>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  <!-- General Features -->
                  <ng-container *ngFor="let feature of space.features">
                    <app-amenity
                      [name]="feature.name"
                      [icon]="feature.icon || ''"
                    ></app-amenity>
                  </ng-container>
                  
                  <!-- Room-specific Amenities -->
                  <ng-container *ngIf="isRoomSpace(space)">
                    <app-amenity *ngFor="let amenity of space.amenities"
                      [name]="amenity"
                    ></app-amenity>
                    
                    <!-- Standard Room Features -->
                    <app-amenity name="Surface: {{ space.size }} m²"></app-amenity>
                    <app-amenity [name]="space.bedType" icon="bed"></app-amenity>
                    <app-amenity *ngIf="space.view" [name]="'Vue: ' + space.view" icon="view"></app-amenity>
                  </ng-container>
                </div>
              </div>
              
              <!-- Specific Content Based on Space Type -->
              <div class="mt-8">
                <!-- Dining Space Specific -->
                <ng-container *ngIf="isDiningSpace(space)">
                  <app-divider [label]="'Menu'" [position]="'left'" [primary]="true"></app-divider>
                  
                  <app-tabs>
                    <div *ngIf="space.menuItems && space.menuItems.length > 0">
                      <!-- Group menu items by category -->
                      <ng-container *ngFor="let category of getMenuCategories(space)">
                        <h3 class="text-lg font-title font-bold text-primary mt-6 mb-4">{{ category }}</h3>
                        <div class="space-y-4">
                          <div *ngFor="let item of getMenuItemsByCategory(space, category)" class="flex justify-between items-start">
                            <div>
                              <p class="font-semibold text-text">{{ item.name }}</p>
                              <p *ngIf="item.description" class="text-text opacity-80 text-sm">{{ item.description }}</p>
                            </div>
                            <div class="text-primary font-bold ml-4">{{ item.price }}FCFA</div>
                          </div>
                        </div>
                      </ng-container>
                    </div>
                    
                    <div *ngIf="!space.menuItems || space.menuItems.length === 0" class="py-4 text-text opacity-70">
                      Menu non disponible actuellement.
                    </div>
                  </app-tabs>
                  
                  <!-- Opening Hours -->
                  <div class="mt-8">
                    <h2 class="text-xl font-title font-bold text-primary mb-4">Horaires d'ouverture</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div *ngFor="let day of getOpeningHoursDays(space)" class="flex justify-between">
                        <span class="text-text font-semibold">{{ getFormattedDay(day) }}</span>
                        <span *ngIf="getOpeningHours(space, day)" class="text-text">
                          {{ getOpeningHours(space, day)?.open }} - {{ getOpeningHours(space, day)?.close }}
                        </span>
                        <span *ngIf="!getOpeningHours(space, day)" class="text-text opacity-70">Fermé</span>
                      </div>
                    </div>
                  </div>
                </ng-container>
                
                <!-- Event Space Specific -->
                <ng-container *ngIf="isEventSpace(space)">
                  <app-divider [label]="'Configurations'" [position]="'left'" [primary]="true"></app-divider>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    <div *ngFor="let layout of space.layouts" class="bg-background-alt p-4 rounded-lg">
                      <h3 class="font-bold text-text mb-2">{{ layout.name }}</h3>
                      <p class="text-text">Capacité: {{ layout.capacity }} personnes</p>
                      <p *ngIf="layout.description" class="text-text opacity-80 text-sm mt-1">{{ layout.description }}</p>
                    </div>
                  </div>
                </ng-container>
              </div>
            </div>
            
            <!-- Right Column: Booking and Details Card -->
            <div class="lg:col-span-1">
              <div class="sticky top-24">
                <app-card>
                  <!-- Price and Availability -->
                  <div *ngIf="space.price" class="mb-6">
                    <div class="flex items-baseline">
                      <span class="text-primary text-3xl font-bold">{{ space.price }}FCFA</span>
                      <span *ngIf="space.priceUnit || getDefaultPriceUnit(space.type)" class="text-text ml-2">
                        {{ space.priceUnit || getDefaultPriceUnit(space.type) }}
                      </span>
                    </div>
                    
                    <div *ngIf="space.available" class="mt-2 text-success flex items-center">
                      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Disponible
                    </div>
                    
                    <div *ngIf="!space.available" class="mt-2 text-error flex items-center">
                      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      Non disponible
                    </div>
                  </div>
                  
                  <!-- Quick Details -->
                  <div class="mb-6">
                    <h3 class="text-lg font-title font-bold text-primary mb-3">Détails</h3>
                    
                    <div class="grid grid-cols-2 gap-2">
                      <!-- Room Space Details -->
                      <ng-container *ngIf="isRoomSpace(space)">
                        <div class="text-text">
                          <span class="font-semibold">Type:</span> {{ getSpaceTypeName(space.type) }}
                        </div>
                        <div class="text-text">
                          <span class="font-semibold">Taille:</span> {{ space.size }} m²
                        </div>
                        <div class="text-text">
                          <span class="font-semibold">Capacité:</span> {{ space.capacity }} pers.
                        </div>
                        <div class="text-text">
                          <span class="font-semibold">Lit:</span> {{ space.bedType }}
                        </div>
                      </ng-container>
                      
                      <!-- Event Space Details -->
                      <ng-container *ngIf="isEventSpace(space)">
                        <div class="text-text">
                          <span class="font-semibold">Type:</span> {{ getSpaceTypeName(space.type) }}
                        </div>
                        <div class="text-text">
                          <span class="font-semibold">Taille:</span> {{ space.size }} m²
                        </div>
                        <div class="text-text">
                          <span class="font-semibold">Capacité max:</span> {{ getMaxCapacity(space) }} pers.
                        </div>
                        <div class="text-text">
                          <span class="font-semibold">Configurations:</span> {{ space.layouts!.length || 0 }}
                        </div>
                      </ng-container>
                      
                      <!-- Dining Space Details -->
                      <ng-container *ngIf="isDiningSpace(space)">
                        <div class="text-text">
                          <span class="font-semibold">Type:</span> {{ getSpaceTypeName(space.type) }}
                        </div>
                        <div class="text-text">
                          <span class="font-semibold">Capacité:</span> {{ space.capacity }} pers.
                        </div>
                        <div class="text-text">
                          <span class="font-semibold">Cuisine:</span> {{ space.cuisine || 'Non spécifiée' }}
                        </div>
                        <div class="text-text">
                          <span class="font-semibold">Menu:</span> {{ space.menuItems!.length || 0 }} plats
                        </div>
                      </ng-container>
                    </div>
                  </div>
                  
                  <!-- Booking Form (for rooms and event spaces) -->
                  <div *ngIf="(isRoomSpace(space) || isEventSpace(space)) && space.available">
                    <app-divider [label]="'Réservation'" [position]="'center'" [primary]="true"></app-divider>
                    
                    <div class="mt-4">
                      <!-- Date Selection -->
                      <div class="mb-4">
                        <label class="block mb-2 font-body font-semibold text-text">
                          Dates de séjour <span class="text-error">*</span>
                        </label>
                        <app-date-picker
                          id="booking-dates"
                          [range]="true"
                          [required]="true"
                          [selectedDateRange]="dateRange"
                          (dateRangeChange)="onDateRangeChange($event)"
                          [error]="bookingError"
                        ></app-date-picker>
                      </div>
                      
                      <!-- Number of People -->
                      <div class="grid grid-cols-2 gap-4 mb-4">
                        <app-input-field
                          id="adults"
                          label="Adultes"
                          type="number"
                          [required]="true"
                          [value]="adults.toString()"
                          (valueChange)="updateAdults($event)"
                        ></app-input-field>
                        
                        <app-input-field
                          id="children"
                          label="Enfants"
                          type="number"
                          [value]="children.toString()"
                          (valueChange)="updateChildren($event)"
                        ></app-input-field>
                      </div>
                      
                      <!-- Booking Button -->
                      <app-button
                        [disabled]="!canBook()"
                        [fullWidth]="true"
                        (onClick)="proceedToBooking()"
                      >
                        <div class="flex items-center justify-center">
                          <span *ngIf="!isCheckingAvailability">Réserver maintenant</span>
                          <div *ngIf="isCheckingAvailability" class="flex items-center">
                            <div class="animate-spin h-5 w-5 border-2 border-background border-t-transparent rounded-full mr-2"></div>
                            Vérification...
                          </div>
                        </div>
                      </app-button>
                    </div>
                  </div>
                  
                  <!-- Contact for More Info (for non-bookable spaces) -->
                  <div *ngIf="!isRoomSpace(space) && !isEventSpace(space)">
                    <app-divider [label]="'Contact'" [position]="'center'" [primary]="true"></app-divider>
                    
                    <div class="text-text text-center mt-4 mb-6">
                      Pour plus d'informations sur cet espace, n'hésitez pas à nous contacter
                    </div>
                    
                    <a routerLink="/contact" class="block bg-primary text-background font-bold uppercase px-4 py-3 rounded text-center hover:bg-primary-hover transition-colors">
                      Nous contacter
                    </a>
                  </div>
                  
                  <!-- Additional Info -->
                  <div class="mt-6 text-text opacity-80 text-sm">
                    <p *ngIf="isRoomSpace(space)">
                      * Les tarifs affichés sont par nuit. La taxe de séjour n'est pas incluse.
                    </p>
                    <p *ngIf="isEventSpace(space)">
                      * Les tarifs affichés sont forfaitaires. Des services supplémentaires peuvent être ajoutés.
                    </p>
                  </div>
                </app-card>
              </div>
            </div>
          </div>
          
          <!-- Related Spaces -->
          <div class="mt-12" *ngIf="relatedSpaces && relatedSpaces.length > 0">
            <h2 class="text-2xl font-title font-bold text-primary mb-6">Espaces similaires</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- We would include space cards here -->
              <div *ngFor="let relatedSpace of relatedSpaces" class="bg-background-alt rounded-lg overflow-hidden shadow-lg">
                <div class="h-48">
                  <img [src]="getMainImageUrl(relatedSpace)" [alt]="relatedSpace.name" class="w-full h-full object-cover">
                </div>
                <div class="p-4">
                  <h3 class="text-lg font-title font-bold text-primary mb-2">{{ relatedSpace.name }}</h3>
                  <p class="text-text opacity-80 text-sm mb-3 line-clamp-2">{{ relatedSpace.description }}</p>
                  <div class="flex justify-between items-center">
                    <div *ngIf="relatedSpace.price" class="text-primary font-bold">{{ relatedSpace.price }}FCFA</div>
                    <a [routerLink]="['/spaces', relatedSpace.id]" class="text-primary hover:underline">Voir détails</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SpaceDetailComponent implements OnInit {
  // State
  isLoading = true;
  error = '';
  space: Space | null = null;
  relatedSpaces: Space[] = [];
  
  // Booking state
  dateRange: DateRange = { startDate: null, endDate: null };
  adults = 2;
  children = 0;
  isCheckingAvailability = false;
  bookingError = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spaceService: SpaceService,
    private bookingService: BookingService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit() {
    // Get space ID from route parameters
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          throw new Error('Space ID is required');
        }
        
        return this.spaceService.getSpaceById(id);
      }),
      catchError(error => {
        this.error = error.message || 'Failed to load space details';
        return of(null);
      })
    ).subscribe(space => {
      this.isLoading = false;
      
      if (space) {
        this.space = space;
        this.loadRelatedSpaces();
      }
    });
  }
  
  loadRelatedSpaces() {
    if (!this.space) return;
    
    this.spaceService.getSpacesByType(this.space.type).pipe(
      map(spaces => spaces.filter(s => s.id !== this.space?.id).slice(0, 3))
    ).subscribe(relatedSpaces => {
      this.relatedSpaces = relatedSpaces;
    });
  }
  
  // Type checking helpers
  isRoomSpace(space: Space): space is RoomSpace {
    return space.type === SpaceType.ROOM;
  }
  
  isDiningSpace(space: Space): space is DiningSpace {
    return space.type === SpaceType.RESTAURANT || space.type === SpaceType.BAR;
  }
  
  isEventSpace(space: Space): space is EventSpace {
    return space.type === SpaceType.EVENT_SPACE;
  }
  
  // UI helpers
  getSpaceTypeName(type: SpaceType): string {
    switch (type) {
      case SpaceType.ROOM:
        return 'Chambre';
      case SpaceType.RESTAURANT:
        return 'Restaurant';
      case SpaceType.BAR:
        return 'Bar';
      case SpaceType.EVENT_SPACE:
        return 'Espace événementiel';
      default:
        return 'Espace';
    }
  }
  
  getDefaultPriceUnit(type: SpaceType): string {
    switch (type) {
      case SpaceType.ROOM:
        return 'par nuit';
      case SpaceType.EVENT_SPACE:
        return 'par jour';
      default:
        return '';
    }
  }
  
  getMainImageUrl(space: Space): string {
    if (space.images && space.images.length > 0) {
      const primaryImage = space.images.find(img => img.isPrimary);
      return primaryImage ? primaryImage.url : space.images[0].url;
    }
    return 'assets/images/placeholder.jpg';
  }
  
  getMaxCapacity(space: EventSpace): number {
    if (!space.layouts || space.layouts.length === 0) {
      return space.capacity || 0;
    }
    
    return Math.max(...space.layouts.map(layout => layout.capacity));
  }
  
  // For DiningSpace
  getMenuCategories(space: DiningSpace): string[] {
    if (!space.menuItems || space.menuItems.length === 0) {
      return [];
    }
    
    const categories = space.menuItems
      .map(item => item.category || 'Autres')
      .filter((value, index, self) => self.indexOf(value) === index);
    
    // Sort categories in a logical order
    const order = ['Entrée', 'Plat', 'Fromage', 'Dessert', 'Boisson', 'Autres'];
    return categories.sort((a, b) => {
      const indexA = order.indexOf(a) !== -1 ? order.indexOf(a) : order.length;
      const indexB = order.indexOf(b) !== -1 ? order.indexOf(b) : order.length;
      return indexA - indexB;
    });
  }
  
  getMenuItemsByCategory(space: DiningSpace, category: string): any[] {
    return space.menuItems.filter(item => 
      (item.category || 'Autres') === category && item.available
    );
  }
  
  getOpeningHoursDays(space: DiningSpace): string[] {
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  }
  
  getFormattedDay(day: string): string {
    const days: { [key: string]: string } = {
      'monday': 'Lundi',
      'tuesday': 'Mardi',
      'wednesday': 'Mercredi',
      'thursday': 'Jeudi',
      'friday': 'Vendredi',
      'saturday': 'Samedi',
      'sunday': 'Dimanche'
    };
    
    return days[day] || day;
  }
  
  getOpeningHours(space: DiningSpace, day: string): TimeRange | undefined {
    return space.openingHours[day as keyof OpeningHours];
  }
  
  // Booking related functions
  onDateRangeChange(range: DateRange): void {
    this.dateRange = range;
    this.bookingError = '';
  }
  
  updateAdults(value: string): void {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      this.adults = num;
    }
  }
  
  updateChildren(value: string): void {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      this.children = num;
    }
  }
  
  canBook(): boolean {
    return (
      !!this.space &&
      this.space.available &&
      !!this.dateRange.startDate &&
      !!this.dateRange.endDate &&
      this.adults > 0 &&
      !this.isCheckingAvailability
    );
  }
  
  proceedToBooking(): void {
    if (!this.canBook() || !this.space) {
      return;
    }
    
    this.isCheckingAvailability = true;
    this.bookingError = '';
    
    // Check availability with service
    if (this.dateRange.startDate && this.dateRange.endDate) {
      this.bookingService.checkBookingConflicts(
        this.space.id,
        this.dateRange.startDate,
        this.dateRange.endDate
      ).subscribe(hasConflict => {
        this.isCheckingAvailability = false;
        
        if (hasConflict) {
          this.bookingError = 'Cet espace n\'est pas disponible aux dates sélectionnées';
          this.notificationService.showError(
            'Cet espace n\'est pas disponible aux dates sélectionnées',
            'Indisponibilité'
          );
        } else {
          // Navigate to booking form
          this.router.navigate(['/booking/guest-info'], {
            queryParams: {
              checkIn: this.formatDate(this.dateRange.startDate),
              checkOut: this.formatDate(this.dateRange.endDate),
              spaceId: this.space?.id,
              spaceName: this.space?.name,
              spaceType: this.space?.type,
              adults: this.adults,
              children: this.children,
              price: this.space?.price,
              nights: this.calculateNights()
            }
          });
        }
      });
    }
  }
  
  calculateNights(): number {
    if (!this.dateRange.startDate || !this.dateRange.endDate) {
      return 0;
    }
    
    const start = this.dateRange.startDate;
    const end = this.dateRange.endDate;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }
  
  private formatDate(date: Date | null): string {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
}