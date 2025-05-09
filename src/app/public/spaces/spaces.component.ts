// src/app/public/spaces/spaces.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpaceCardComponent } from './space-card/space-card.component';
import { SpaceFilterComponent } from './space-filter/space-filter.component';
import { SectionTitleComponent } from '../../shared/components/content/section-title/section-title.component';
import { PaginationComponent } from '../../shared/components/ui/pagination/pagination.component';
import { LoaderComponent } from '../../shared/components/ui/loader/loader.component';

interface Space {
  id: string;
  name: string;
  type: string;
  description: string;
  imageUrl: string;
  price: number | string;
  priceUnit: string;
  available: boolean;
  features: { name: string; icon?: string }[];
  badge?: string;
}

interface SpaceFilter {
  type?: string;
  capacity?: number;
  minPrice?: number;
  maxPrice?: number;
  features?: string[];
  availableOnly?: boolean;
}

@Component({
  selector: 'app-spaces',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SpaceCardComponent,
    SpaceFilterComponent,
    SectionTitleComponent,
    PaginationComponent,
    LoaderComponent
  ],
  template: `
    <div class="bg-background min-h-screen">
      <!-- Hero Banner -->
      <div class="relative h-64 md:h-80">
        <img src="assets/images/spaces-hero.jpg" alt="Nos espaces" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-linear-to-t from-background to-transparent"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <h1 class="text-3xl md:text-5xl font-title font-bold text-primary">Nos Espaces</h1>
        </div>
      </div>
      
      <div class="container mx-auto px-4 py-12">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar Filter (Desktop) -->
          <div class="hidden lg:block lg:w-1/4">
            <app-space-filter
              [typeOptions]="typeOptions"
              [featureOptions]="featureOptions"
              [capacityOptions]="capacityOptions"
              [minPriceOption]="50"
              [maxPriceOption]="1000"
              currencySymbol="€"
              [showPriceFilter]="true"
              [showCapacityFilter]="true"
              [showAvailabilityFilter]="true"
              [filter]="activeFilter"
              (filterChange)="onFilterChange($event)"
            ></app-space-filter>
          </div>
          
          <!-- Main Content -->
          <div class="lg:w-3/4">
            <!-- Mobile Filter Toggle -->
            <div class="lg:hidden mb-6">
              <button 
                (click)="toggleMobileFilter()"
                class="w-full bg-background-alt p-4 rounded-lg shadow flex justify-between items-center"
              >
                <span class="text-text font-semibold">Filtres</span>
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path *ngIf="!showMobileFilter" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  <path *ngIf="showMobileFilter" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
              </button>
              
              <!-- Mobile Filter Panel -->
              <div *ngIf="showMobileFilter" class="mt-4">
                <app-space-filter
                  [typeOptions]="typeOptions"
                  [featureOptions]="featureOptions"
                  [capacityOptions]="capacityOptions"
                  [minPriceOption]="50"
                  [maxPriceOption]="1000"
                  currencySymbol="€"
                  [showPriceFilter]="true"
                  [showCapacityFilter]="true"
                  [showAvailabilityFilter]="true"
                  [filter]="activeFilter"
                  (filterChange)="onFilterChange($event)"
                ></app-space-filter>
              </div>
            </div>
            
            <!-- Results Count -->
            <div class="flex justify-between items-center mb-6">
              <p class="text-text">
                <span class="font-semibold">{{ filteredSpaces.length }}</span> espaces trouvés
              </p>
              
              <!-- Sort Options -->
              <div class="flex items-center">
                <span class="text-text mr-2">Trier par:</span>
                <select 
                  (change)="onSortChange($event)"
                  class="bg-dark-200 border border-dark-300 rounded p-2 text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="name-asc">Nom (A-Z)</option>
                  <option value="name-desc">Nom (Z-A)</option>
                  <option value="price-asc">Prix (croissant)</option>
                  <option value="price-desc">Prix (décroissant)</option>
                </select>
              </div>
            </div>
            
            <!-- Spaces Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <app-space-card
                *ngFor="let space of paginatedSpaces"
                [id]="space.id"
                [name]="space.name"
                [type]="space.type"
                [description]="space.description"
                [imageUrl]="space.imageUrl"
                [price]="space.price"
                [priceUnit]="space.priceUnit"
                buttonText="Voir détails"
                [available]="space.available"
                [badge]="space.badge || ''"
                [features]="space.features"
                [detailPath]="'/spaces/' + space.id"
                (cardClick)="onSpaceCardClick(space.id)"
                (buttonClick)="onSpaceButtonClick($event)"
              ></app-space-card>
            </div>
            
            <!-- Empty State -->
            <div *ngIf="filteredSpaces.length === 0" class="py-12 text-center">
              <div class="text-primary opacity-30 mb-4">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-text mb-2">Aucun espace trouvé</h3>
              <p class="text-text opacity-70 mb-6">Aucun espace ne correspond à vos critères de recherche.</p>
              <button 
                (click)="resetFilters()"
                class="bg-primary text-background font-bold uppercase px-4 py-2 rounded hover:bg-primary-hover transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
            
            <!-- Pagination -->
            <div *ngIf="filteredSpaces.length > 0" class="mt-12">
              <app-pagination
                [currentPage]="currentPage"
                [totalPages]="totalPages"
                (pageChange)="onPageChange($event)"
              ></app-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SpacesComponent implements OnInit {
  // Spaces data that would typically come from a service
  spaces: Space[] = [
    {
      id: 'chambre-classique',
      name: 'Chambre Classique',
      type: 'Chambre',
      description: 'Une chambre élégante avec lit double et toutes les commodités essentielles pour un séjour confortable.',
      imageUrl: 'assets/images/rooms/classic-room.jpg',
      price: 150,
      priceUnit: '€ / nuit',
      available: true,
      features: [
        { name: 'Wifi gratuit', icon: 'wifi' },
        { name: 'Climatisation', icon: 'air-conditioner' },
        { name: 'TV écran plat', icon: 'tv' }
      ]
    },
    {
      id: 'chambre-superieure',
      name: 'Chambre Supérieure',
      type: 'Chambre',
      description: 'Une chambre spacieuse avec lit king-size et vue sur les jardins luxuriants de l\'hôtel.',
      imageUrl: 'assets/images/rooms/superior-room.jpg',
      price: 220,
      priceUnit: '€ / nuit',
      available: true,
      features: [
        { name: 'Vue jardin', icon: 'garden' },
        { name: 'Minibar', icon: 'fridge' },
        { name: 'Coffre-fort', icon: 'safe' }
      ]
    },
    {
      id: 'suite-deluxe',
      name: 'Suite Deluxe',
      type: 'Suite',
      description: 'Une suite avec balcon privé offrant une vue imprenable sur la ville et un espace salon séparé.',
      imageUrl: 'assets/images/rooms/deluxe-suite.jpg',
      price: 280,
      priceUnit: '€ / nuit',
      available: true,
      features: [
        { name: 'Balcon privé', icon: 'balcony' },
        { name: 'Salon séparé', icon: 'sofa' },
        { name: 'Douche à effet pluie', icon: 'shower' }
      ]
    },
    {
      id: 'chambre-familiale',
      name: 'Chambre Familiale',
      type: 'Chambre',
      description: 'Chambre spacieuse avec un lit king-size et deux lits simples, parfaite pour les familles.',
      imageUrl: 'assets/images/rooms/family-room.jpg',
      price: 320,
      priceUnit: '€ / nuit',
      available: true,
      features: [
        { name: 'Espace famille', icon: 'family' },
        { name: 'Vue jardin', icon: 'garden' },
        { name: 'Réfrigérateur', icon: 'fridge' }
      ]
    },
    {
      id: 'penthouse',
      name: 'Penthouse',
      type: 'Suite Executive',
      description: 'Notre suite exclusive au dernier étage avec terrasse privée et service de majordome.',
      imageUrl: 'assets/images/rooms/penthouse.jpg',
      price: 750,
      priceUnit: '€ / nuit',
      available: true,
      badge: 'EXCLUSIF',
      features: [
        { name: 'Terrasse privée', icon: 'terrace' },
        { name: 'Service majordome', icon: 'butler' },
        { name: 'Jacuzzi privé', icon: 'jacuzzi' }
      ]
    },
    {
      id: 'restaurant-principal',
      name: 'Le Royal - Restaurant Principal',
      type: 'Restaurant',
      description: 'Restaurant gastronomique proposant une cuisine internationale raffinée avec des influences ivoiriennes.',
      imageUrl: 'assets/images/dining/restaurant-main.jpg',
      price: '',
      priceUnit: '',
      available: true,
      features: [
        { name: 'Cuisine internationale', icon: 'global' },
        { name: 'Vue jardin', icon: 'garden' },
        { name: 'Bar à vins', icon: 'wine' }
      ]
    },
    {
      id: 'terrasse-jardin',
      name: 'Terrasse Le Jardin',
      type: 'Restaurant',
      description: 'Terrasse ombragée située au rez-de-chaussée, offrant une ambiance décontractée pour les repas au bord de la piscine.',
      imageUrl: 'assets/images/dining/terrace-rdc.jpg',
      price: '',
      priceUnit: '',
      available: true,
      features: [
        { name: 'Vue piscine', icon: 'pool' },
        { name: 'Cuisine légère', icon: 'salad' },
        { name: 'Bar à cocktails', icon: 'cocktail' }
      ]
    },
    {
      id: 'salle-conference',
      name: 'Salle de Conférence',
      type: 'Événementiel',
      description: 'Grande salle polyvalente pour les séminaires, conférences et événements professionnels.',
      imageUrl: 'assets/images/event-spaces/conference.jpg',
      price: 1500,
      priceUnit: '€ / jour',
      available: true,
      features: [
        { name: 'Capacité 200 personnes', icon: 'people' },
        { name: 'Équipement audiovisuel', icon: 'projector' },
        { name: 'Service traiteur', icon: 'catering' }
      ]
    },
    {
      id: 'salle-mariage',
      name: 'Salle de Mariage',
      type: 'Événementiel',
      description: 'Élégante salle de réception spécialement conçue pour les mariages et célébrations.',
      imageUrl: 'assets/images/event-spaces/wedding.jpg',
      price: 2000,
      priceUnit: '€ / jour',
      available: false,
      features: [
        { name: 'Piste de danse', icon: 'dance-floor' },
        { name: 'Éclairage d\'ambiance', icon: 'ambient-light' },
        { name: 'Espace DJ', icon: 'dj-booth' }
      ]
    }
  ];

  // Filter options
  typeOptions = [
    { id: '', label: 'Tous les types' },
    { id: 'Chambre', label: 'Chambres' },
    { id: 'Suite', label: 'Suites' },
    { id: 'Restaurant', label: 'Restaurants & Bars' },
    { id: 'Événementiel', label: 'Salles événementielles' }
  ];
  
  featureOptions = [
    { id: 'wifi', label: 'Wifi gratuit' },
    { id: 'vue', label: 'Vue panoramique' },
    { id: 'balcon', label: 'Balcon/Terrasse' },
    { id: 'climatisation', label: 'Climatisation' },
    { id: 'minibar', label: 'Minibar' }
  ];
  
  capacityOptions = [
    { id: '0', label: 'Tous' },
    { id: '2', label: '1-2 personnes' },
    { id: '4', label: '3-4 personnes' },
    { id: '6', label: '5+ personnes' }
  ];

  // State
  activeFilter: SpaceFilter = {
    availableOnly: true,
    features: []
  };
  filteredSpaces: Space[] = [];
  showMobileFilter = false;
  currentPage = 1;
  itemsPerPage = 6;
  sortOption = 'name-asc';

  ngOnInit(): void {
    this.applyFilters();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSpaces.length / this.itemsPerPage);
  }

  get paginatedSpaces(): Space[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredSpaces.slice(startIndex, startIndex + this.itemsPerPage);
  }

  toggleMobileFilter(): void {
    this.showMobileFilter = !this.showMobileFilter;
  }

  onFilterChange(filter: SpaceFilter): void {
    this.activeFilter = filter;
    this.applyFilters();
    this.currentPage = 1; // Reset to first page
    this.showMobileFilter = false; // Close mobile filter
  }

  onSortChange(event: Event): void {
    this.sortOption = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    window.scrollTo(0, 0); // Scroll to top for better UX
  }

  onSpaceCardClick(id: string): void {
    // This would be handled by the router in a real implementation
    console.log(`Navigate to space details: ${id}`);
  }

  onSpaceButtonClick(event: { id: string; event: MouseEvent }): void {
    // Stop propagation already handled in the component
    console.log(`Button clicked for space: ${event.id}`);
  }

  resetFilters(): void {
    this.activeFilter = {
      availableOnly: true,
      features: []
    };
    this.applyFilters();
  }

  private applyFilters(): void {
    // First, filter the spaces
    let result = [...this.spaces];
    
    if (this.activeFilter.availableOnly) {
      result = result.filter(space => space.available);
    }
    
    if (this.activeFilter.type) {
      result = result.filter(space => space.type === this.activeFilter.type);
    }
    
    if (this.activeFilter.features && this.activeFilter.features.length > 0) {
      result = result.filter(space => {
        return this.activeFilter.features!.every(featureId => {
          return space.features.some(f => f.name.toLowerCase().includes(featureId) || f.icon === featureId);
        });
      });
    }
    
    if (this.activeFilter.minPrice !== undefined) {
      result = result.filter(space => {
        if (typeof space.price === 'number') {
          return space.price >= (this.activeFilter.minPrice || 0);
        }
        return true; // Keep items without price
      });
    }
    
    if (this.activeFilter.maxPrice !== undefined) {
      result = result.filter(space => {
        if (typeof space.price === 'number') {
          return space.price <= (this.activeFilter.maxPrice || Infinity);
        }
        return true; // Keep items without price
      });
    }
    
    // Then sort the filtered results
    result = this.sortSpaces(result, this.sortOption);
    
    this.filteredSpaces = result;
  }

  private sortSpaces(spaces: Space[], sortOption: string): Space[] {
    switch (sortOption) {
      case 'name-asc':
        return [...spaces].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...spaces].sort((a, b) => b.name.localeCompare(a.name));
      case 'price-asc':
        return [...spaces].sort((a, b) => {
          if (typeof a.price === 'number' && typeof b.price === 'number') {
            return a.price - b.price;
          } else if (typeof a.price === 'number') {
            return -1; // Place items with price before those without
          } else if (typeof b.price === 'number') {
            return 1; // Place items with price before those without
          }
          return 0;
        });
      case 'price-desc':
        return [...spaces].sort((a, b) => {
          if (typeof a.price === 'number' && typeof b.price === 'number') {
            return b.price - a.price;
          } else if (typeof a.price === 'number') {
            return -1; // Place items with price before those without
          } else if (typeof b.price === 'number') {
            return 1; // Place items with price before those without
          }
          return 0;
        });
      default:
        return spaces;
    }
  }
}