// src/app/public/booking/space-selection/space-selection.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SectionTitleComponent } from '../../../shared/components/content/section-title/section-title.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { LoaderComponent } from '../../../shared/components/ui/loader/loader.component';

interface BookingParams {
  checkIn: string;
  checkOut: string;
  spaceType: string;
  adults: number;
  children: number;
  promo?: string;
}

interface AvailableSpace {
  id: string;
  name: string;
  type: string;
  description: string;
  imageUrl: string;
  price: number;
  priceUnit: string;
  originalPrice?: number; // For discounted prices
  features: { name: string; icon?: string }[];
  capacity: number;
  availableRooms: number;
  amenities: string[];
  bedType: string;
  size: number;
  view?: string;
  isRefundable: boolean;
  includedServices: string[];
  selected?: boolean; // For selection state
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
                    <img [src]="space.imageUrl" [alt]="space.name" class="w-full h-full object-cover">
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
                          <div *ngIf="space.originalPrice" class="text-text line-through text-sm">{{ space.originalPrice }}€</div>
                          <div class="text-primary font-bold text-xl">{{ space.price }}€</div>
                          <div class="text-text text-sm">{{ space.priceUnit }}</div>
                        </div>
                      </div>
                      
                      <!-- Features & Amenities -->
                      <div class="grid grid-cols-2 gap-2 mb-4">
                        <div class="flex items-center text-text text-sm">
                          <svg class="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {{ space.size }} m²
                        </div>
                        <div class="flex items-center text-text text-sm">
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
export class SpaceSelectionComponent implements OnInit {
  bookingParams: BookingParams = {
    checkIn: '',
    checkOut: '',
    spaceType: '',
    adults: 1,
    children: 0
  };
  
  isLoading = true;
  availableSpaces: AvailableSpace[] = [];
  
  constructor(private route: ActivatedRoute, private router: Router) {}
  
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
      
      // Validate parameters (in a real app, you'd do more validation)
      if (!this.bookingParams.checkIn || !this.bookingParams.checkOut || !this.bookingParams.spaceType) {
        this.router.navigate(['/booking']);
        return;
      }
      
      // Load available spaces
      this.loadAvailableSpaces();
    });
  }
  
  get hasSelection(): boolean {
    return this.availableSpaces.some(space => space.selected);
  }
  
  loadAvailableSpaces(): void {
    // In a real application, this would be a service call
    // For this demo, we'll simulate loading and return mock data
    this.isLoading = true;
    
    setTimeout(() => {
      // Mock data based on the space type
      if (this.bookingParams.spaceType === 'room') {
        this.availableSpaces = [
          {
            id: 'chambre-classique',
            name: 'Chambre Classique',
            type: 'Chambre',
            description: 'Une chambre élégante avec lit double et toutes les commodités essentielles pour un séjour confortable.',
            imageUrl: 'assets/images/rooms/classic-room.jpg',
            price: 150,
            priceUnit: 'par nuit',
            features: [
              { name: 'Wifi gratuit', icon: 'wifi' },
              { name: 'Climatisation', icon: 'air-conditioner' },
              { name: 'TV écran plat', icon: 'tv' }
            ],
            capacity: 2,
            availableRooms: 8,
            amenities: ['Sèche-cheveux', 'Produits de toilette', 'Serviettes', 'Peignoirs'],
            bedType: 'Lit double',
            size: 25,
            view: 'Jardin',
            isRefundable: true,
            includedServices: ['Wifi gratuit', 'Petit-déjeuner inclus', 'Accès piscine']
          },
          {
            id: 'chambre-superieure',
            name: 'Chambre Supérieure',
            type: 'Chambre',
            description: 'Une chambre spacieuse avec lit king-size et vue sur les jardins luxuriants de l\'hôtel.',
            imageUrl: 'assets/images/rooms/superior-room.jpg',
            price: 198,
            originalPrice: 220,
            priceUnit: 'par nuit',
            features: [
              { name: 'Vue jardin', icon: 'garden' },
              { name: 'Minibar', icon: 'fridge' },
              { name: 'Coffre-fort', icon: 'safe' }
            ],
            capacity: 2,
            availableRooms: 3,
            amenities: ['Sèche-cheveux', 'Produits de toilette premium', 'Serviettes', 'Peignoirs', 'Pantoufles', 'Machine à café'],
            bedType: 'Lit king-size',
            size: 35,
            view: 'Piscine',
            isRefundable: true,
            includedServices: ['Wifi gratuit', 'Petit-déjeuner inclus', 'Accès piscine', 'Accès fitness']
          }
        ];
      } else if (this.bookingParams.spaceType === 'suite') {
        this.availableSpaces = [
          {
            id: 'suite-deluxe',
            name: 'Suite Deluxe',
            type: 'Suite',
            description: 'Une suite avec balcon privé offrant une vue imprenable sur la ville et un espace salon séparé.',
            imageUrl: 'assets/images/rooms/deluxe-suite.jpg',
            price: 280,
            priceUnit: 'par nuit',
            features: [
              { name: 'Balcon privé', icon: 'balcony' },
              { name: 'Salon séparé', icon: 'sofa' },
              { name: 'Douche à effet pluie', icon: 'shower' }
            ],
            capacity: 2,
            availableRooms: 2,
            amenities: ['Sèche-cheveux', 'Produits de toilette premium', 'Serviettes', 'Peignoirs', 'Pantoufles', 'Machine à café Nespresso', 'Station d\'accueil iPod'],
            bedType: 'Lit king-size',
            size: 40,
            view: 'Ville',
            isRefundable: true,
            includedServices: ['Wifi gratuit', 'Petit-déjeuner inclus', 'Accès spa & piscine', 'Accès fitness', 'Service en chambre']
          }
        ];
      } else if (this.bookingParams.spaceType === 'penthouse') {
        this.availableSpaces = [
          {
            id: 'penthouse',
            name: 'Penthouse',
            type: 'Suite Executive',
            description: 'Notre suite exclusive au dernier étage avec terrasse privée et service de majordome.',
            imageUrl: 'assets/images/rooms/penthouse.jpg',
            price: 750,
            priceUnit: 'par nuit',
            features: [
              { name: 'Terrasse privée', icon: 'terrace' },
              { name: 'Service majordome', icon: 'butler' },
              { name: 'Jacuzzi privé', icon: 'jacuzzi' }
            ],
            capacity: 2,
            availableRooms: 1,
            amenities: ['Sèche-cheveux', 'Produits de toilette de luxe', 'Serviettes', 'Peignoirs', 'Pantoufles', 'Machine à café', 'Bar privé', 'Système audio Bose', 'Smart TV'],
            bedType: 'Lit king-size',
            size: 120,
            view: 'Panoramique',
            isRefundable: true,
            includedServices: ['Wifi gratuit', 'Petit-déjeuner inclus', 'Accès illimité au spa', 'Transfert aéroport', 'Service de majordome 24/7', 'Minibar gratuit']
          }
        ];
      } else if (this.bookingParams.spaceType === 'event_space') {
        this.availableSpaces = [
          {
            id: 'salle-conference',
            name: 'Salle de Conférence',
            type: 'Événementiel',
            description: 'Grande salle polyvalente pour les séminaires, conférences et événements professionnels.',
            imageUrl: 'assets/images/event-spaces/conference.jpg',
            price: 1500,
            priceUnit: 'par jour',
            features: [
              { name: 'Équipement audiovisuel', icon: 'projector' },
              { name: 'Service traiteur', icon: 'catering' },
              { name: 'Wifi haut débit', icon: 'wifi' }
            ],
            capacity: 200,
            availableRooms: 1,
            amenities: ['Projecteur', 'Écran', 'Système de sonorisation', 'Microphones', 'Tableau blanc', 'Connexion Internet haut débit'],
            bedType: 'N/A',
            size: 300,
            isRefundable: false,
            includedServices: ['Wifi haut débit', 'Équipement audiovisuel de base', 'Eau et café', 'Support technique']
          },
          {
            id: 'salle-mariage',
            name: 'Salle de Mariage',
            type: 'Événementiel',
            description: 'Élégante salle de réception spécialement conçue pour les mariages et célébrations.',
            imageUrl: 'assets/images/event-spaces/wedding.jpg',
            price: 2000,
            priceUnit: 'par jour',
            features: [
              { name: 'Piste de danse', icon: 'dance-floor' },
              { name: 'Éclairage d\'ambiance', icon: 'ambient-light' },
              { name: 'Espace DJ', icon: 'dj-booth' }
            ],
            capacity: 150,
            availableRooms: 1,
            amenities: ['Piste de danse', 'Éclairage d\'ambiance', 'Espace pour orchestre/DJ', 'Vestiaire', 'Salon privé pour les mariés'],
            bedType: 'N/A',
            size: 250,
            isRefundable: false,
            includedServices: ['Coordination de l\'événement', 'Décoration de base', 'Tables et chaises', 'Personnel d\'accueil']
          }
        ];
      } else {
        this.availableSpaces = [];
      }
      
      // Check if a promo code was applied and adjust prices
      if (this.bookingParams.promo && this.bookingParams.promo.toUpperCase() === 'WELCOME10') {
        this.availableSpaces.forEach(space => {
          // Apply 10% discount
          space.originalPrice = space.price;
          space.price = Math.round(space.price * 0.9);
        });
      }
      
      this.isLoading = false;
    }, 1500);
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
    // Deselect all spaces first
    this.availableSpaces.forEach(s => s.selected = false);
    
    // Select the clicked space
    space.selected = true;
  }
  
  continueToGuestInfo(): void {
    const selectedSpace = this.availableSpaces.find(space => space.selected);
    
    if (!selectedSpace) {
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