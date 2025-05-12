// src/app/public/spaces/spaces.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpaceCardComponent } from './space-card/space-card.component';
import { SpaceFilterComponent } from './space-filter/space-filter.component';
import { SectionTitleComponent } from '../../shared/components/content/section-title/section-title.component';
import { PaginationComponent } from '../../shared/components/ui/pagination/pagination.component';
import { LoaderComponent } from '../../shared/components/ui/loader/loader.component';

// Import du service et des interfaces
import { SpaceService } from '../../core/services/space.service';
import { Space, SpaceType, Image } from '../../core/interfaces/space.interface';
import { NotificationService } from '../../core/services/notification.service';
import { finalize, catchError, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

export interface SpaceFilter {
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
        <img src="assets/images/rooms/superior1.png" alt="Nos espaces" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
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
              currencySymbol="FCFA"
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
                  currencySymbol="FCFA"
                  [showPriceFilter]="true"
                  [showCapacityFilter]="true"
                  [showAvailabilityFilter]="true"
                  [filter]="activeFilter"
                  (filterChange)="onFilterChange($event)"
                ></app-space-filter>
              </div>
            </div>
            
            <!-- Loading state -->
            <div *ngIf="isLoading" class="py-12 flex justify-center">
              <app-loader text="Chargement des espaces..."></app-loader>
            </div>
            
            <!-- Results Count -->
            <div *ngIf="!isLoading" class="flex justify-between items-center mb-6">
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
            
            <!-- Debug Information -->
            <div class="bg-yellow-100 p-4 mb-6 rounded text-sm" *ngIf="debugMode">
              <div><strong>Debug Info:</strong></div>
              <div>Loading: {{ isLoading }}</div>
              <div>Filtered Spaces: {{ filteredSpaces.length }}</div>
              <div>Current Page: {{ currentPage }}</div>
              <div>Paginated Spaces: {{ paginatedSpaces.length }}</div>
              <div>Total Pages: {{ totalPages }}</div>
              <div>Items per Page: {{ itemsPerPage }}</div>
              <div *ngIf="paginatedSpaces.length > 0">First Space: {{ paginatedSpaces[0].name }}</div>
              <button (click)="forcePaginationRefresh()" class="bg-blue-500 text-white px-2 py-1 rounded mt-2">
                Force Refresh
              </button>
            </div>
            
            <!-- Spaces Grid -->
            <div *ngIf="!isLoading && filteredSpaces.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <app-space-card
                *ngFor="let space of paginatedSpaces; trackBy: trackBySpaceId"
                [id]="space.id"
                [name]="space.name"
                [type]="getSpaceTypeName(space.type)"
                [description]="space.description"
                [imageUrl]="getMainImageUrl(space)"
                [price]="space.price || 0"
                [priceUnit]="getPriceUnit(space)"
                buttonText="Voir détails"
                [available]="space.available"
                [badge]="getBadgeForSpace(space)"
                [features]="getFeaturesList(space)"
                [detailPath]="'/spaces/' + space.id"
                (cardClick)="onSpaceCardClick(space.id)"
                (buttonClick)="onSpaceButtonClick($event)"
              ></app-space-card>
            </div>
            
            <!-- Fallback Display (si les cartes ne s'affichent pas) -->
            <div *ngIf="!isLoading && filteredSpaces.length > 0 && paginatedSpaces.length === 0" class="bg-red-100 p-4 rounded mb-6">
              <p class="font-bold">Problème d'affichage détecté</p>
              <p>Des espaces sont disponibles mais ne s'affichent pas correctement.</p>
            </div>
            
            <!-- Basic Text Fallback -->
            <div *ngIf="!isLoading && filteredSpaces.length > 0 && showTextFallback" class="mb-6">
              <div class="mb-2 font-bold">Liste des espaces (affichage de secours):</div>
              <ul class="list-disc pl-5">
                <li *ngFor="let space of paginatedSpaces" class="mb-2">
                  <strong>{{ space.name }}</strong> ({{ getSpaceTypeName(space.type) }})
                  <br>
                  <span class="text-sm">{{ space.description }}</span>
                  <br>
                  <span *ngIf="space.price" class="text-primary font-bold">
                    {{ space.price }} {{ space.currency || 'FCFA' }}
                  </span>
                </li>
              </ul>
            </div>
            
            <!-- Empty State -->
            <div *ngIf="!isLoading && filteredSpaces.length === 0" class="py-12 text-center">
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
            
            <!-- Error State -->
            <div *ngIf="errorMessage" class="py-12 text-center">
              <div class="text-error mb-4">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-text mb-2">Erreur de chargement</h3>
              <p class="text-text opacity-70 mb-6">{{ errorMessage }}</p>
              <button 
                (click)="loadSpaces()"
                class="bg-primary text-background font-bold uppercase px-4 py-2 rounded hover:bg-primary-hover transition-colors"
              >
                Réessayer
              </button>
            </div>
            
            <!-- Pagination -->
            <div *ngIf="!isLoading && filteredSpaces.length > itemsPerPage" class="mt-12">
              <app-pagination
                [currentPage]="currentPage"
                [totalPages]="totalPages"
                (pageChange)="onPageChange($event)"
              ></app-pagination>
            </div>
            
            <!-- Debug Toggle Button -->
            <div class="fixed bottom-4 right-4 z-50">
              <button 
                (click)="toggleDebugMode()" 
                class="bg-gray-800 text-white p-2 rounded-full shadow-lg"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SpacesComponent implements OnInit, OnDestroy {
  // State
  spaces: Space[] = [];
  filteredSpaces: Space[] = [];
  isLoading = true;
  errorMessage = '';
  showMobileFilter = false;
  currentPage = 1;
  itemsPerPage = 6;
  sortOption = 'name-asc';
  debugMode = true; // Activer le mode débogage par défaut
  showTextFallback = true; // Activer l'affichage de secours en texte
  private destroy$ = new Subject<void>();
  private _paginatedSpaces: Space[] = [];

  // Filter options
  typeOptions = [
    { id: '', label: 'Tous les types', count: 0 },
    { id: SpaceType.ROOM, label: 'Chambres', count: 0 },
    { id: 'suite', label: 'Suites', count: 0 },
    { id: SpaceType.RESTAURANT, label: 'Restaurants', count: 0 },
    { id: SpaceType.EVENT_SPACE, label: 'Salles événementielles', count: 0 }
  ];
  
  featureOptions = [
    { id: 'wifi', label: 'Wifi gratuit' },
    { id: 'panorama', label: 'Vue panoramique' },
    { id: 'balcony', label: 'Balcon/Terrasse' },
    { id: 'air-conditioner', label: 'Climatisation' },
    { id: 'fridge', label: 'Minibar' }
  ];
  
  capacityOptions = [
    { id: '0', label: 'Tous' },
    { id: '2', label: '1-2 personnes' },
    { id: '4', label: '3-4 personnes' },
    { id: '6', label: '5+ personnes' }
  ];

  // Filtres initiaux - false pour afficher tous les espaces
  activeFilter: SpaceFilter = {
    availableOnly: false,
    features: []
  };

  constructor(
    private spaceService: SpaceService,
    private notificationService: NotificationService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSpaces();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Helper pour Angular change detection avec trackBy
  trackBySpaceId(index: number, space: Space): string {
    return space.id;
  }

  toggleDebugMode(): void {
    this.debugMode = !this.debugMode;
  }

  forcePaginationRefresh(): void {
    this.currentPage = 1;
    this._paginatedSpaces = [];
    this.updatePaginatedSpaces();
    this.changeDetector.detectChanges();
  }

// Dans la méthode loadSpaces(), modifiez la partie finalize pour s'assurer que isLoading passe à false

loadSpaces(): void {
  this.isLoading = true;
  this.errorMessage = '';
  
  this.spaceService.getAllSpaces()
    .pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        console.error('Error loading spaces:', error);
        this.errorMessage = 'Impossible de charger les espaces. Veuillez réessayer plus tard.';
        this.notificationService.showError('Erreur lors du chargement des espaces');
        return of([]);
      }),
      finalize(() => {
        // Force la mise à jour de l'état de chargement
        this.isLoading = false;
        // Force la détection de changements
        this.changeDetector.detectChanges();
        console.log('État de chargement mis à jour: isLoading =', this.isLoading);
      })
    )
    .subscribe(spaces => {
      console.log('Espaces chargés:', spaces);
      
      // Afficher un exemple d'espace pour débogage
      if (spaces.length > 0) {
        console.log('Premier espace:', JSON.stringify(spaces[0]));
      }
      
      this.spaces = spaces;
      this.updateTypeFilterCounts(spaces);
      this.applyFilters();
      
      // Explicitement mettre à jour isLoading encore une fois pour être sûr
      this.isLoading = false;
      
      // Force la détection de changements après le chargement
      setTimeout(() => {
        this.changeDetector.detectChanges();
      }, 100);
    });
}

  updateTypeFilterCounts(spaces: Space[]): void {
    // Mise à jour du compteur "Tous"
    this.typeOptions[0].count = spaces.length;
    
    // Mise à jour des compteurs par type
    for (let i = 1; i < this.typeOptions.length; i++) {
      const option = this.typeOptions[i];
      if (option.id === 'suite') {
        // Cas spécial pour les suites (sous-type de chambre)
        option.count = spaces.filter(space => 
          space.type === SpaceType.ROOM && 
          space.name.toLowerCase().includes('suite')
        ).length;
      } else {
        // Comptage normal pour les autres types
        option.count = spaces.filter(space => space.type === option.id).length;
      }
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSpaces.length / this.itemsPerPage);
  }

  get paginatedSpaces(): Space[] {
    // Si cached, retourner le cached
    if (this._paginatedSpaces.length > 0) {
      return this._paginatedSpaces;
    }
    
    this.updatePaginatedSpaces();
    return this._paginatedSpaces;
  }
  
  updatePaginatedSpaces(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    // Vérification des limites pour éviter les erreurs
    if (startIndex >= this.filteredSpaces.length) {
      this.currentPage = 1;
      this._paginatedSpaces = this.filteredSpaces.slice(0, this.itemsPerPage);
    } else {
      this._paginatedSpaces = this.filteredSpaces.slice(startIndex, endIndex);
    }
    
    console.log(`Pagination - page: ${this.currentPage}, totalItems: ${this.filteredSpaces.length}, showing: ${startIndex} to ${endIndex - 1}, spaces count: ${this._paginatedSpaces.length}`);
    
    // Log des infos sur le premier espace pour débogage
    if (this._paginatedSpaces.length > 0) {
      const firstSpace = this._paginatedSpaces[0];
      console.log(`Premier espace paginé: ${firstSpace.name}, image: ${this.getMainImageUrl(firstSpace)}`);
    }
  }

  toggleMobileFilter(): void {
    this.showMobileFilter = !this.showMobileFilter;
  }

  onFilterChange(filter: SpaceFilter): void {
    console.log('Nouveau filtre appliqué:', filter);
    this.activeFilter = filter;
    this.applyFilters();
    this.currentPage = 1; // Reset to first page
    this._paginatedSpaces = []; // Reset cache
    this.showMobileFilter = false; // Close mobile filter
  }

  onSortChange(event: Event): void {
    this.sortOption = (event.target as HTMLSelectElement).value;
    console.log('Nouveau tri appliqué:', this.sortOption);
    this.applyFilters();
    this._paginatedSpaces = []; // Reset cache
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this._paginatedSpaces = []; // Reset cache
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top for better UX
  }

  onSpaceCardClick(id: string): void {
    console.log(`Navigate to space details: ${id}`);
  }

  onSpaceButtonClick(event: { id: string; event: MouseEvent }): void {
    console.log(`Button clicked for space: ${event.id}`);
  }

  resetFilters(): void {
    this.activeFilter = {
      availableOnly: false,
      features: []
    };
    this.applyFilters();
    this._paginatedSpaces = []; // Reset cache
    this.notificationService.showInfo('Les filtres ont été réinitialisés');
  }

  // Helper methods
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

  getMainImageUrl(space: Space): string {
    try {
      if (space.images && space.images.length > 0) {
        const primaryImage = space.images.find(img => img.isPrimary);
        return primaryImage ? primaryImage.url : space.images[0].url;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'image:', error);
    }
    return 'assets/images/placeholder.jpg';
  }

  getPriceUnit(space: Space): string {
    if (!space.price) return '';
    
    const currency = space.currency || 'FCFA';
    
    switch (space.type) {
      case SpaceType.ROOM:
        return `${currency} / nuit`;
      case SpaceType.EVENT_SPACE:
        return `${currency} / jour`;
      default:
        return currency;
    }
  }

  getBadgeForSpace(space: Space): string {
    if (space.type === SpaceType.ROOM) {
      if (space.name.toLowerCase().includes('penthouse')) {
        return 'PENTHOUSE';
      }
      if (space.name.toLowerCase().includes('suite')) {
        return 'SUITE';
      }
      if ((space.price || 0) > 500) {
        return 'LUXE';
      }
    }
    return '';
  }

  // Corrigé pour éviter les erreurs undefined
  getFeaturesList(space: Space): { name: string; icon?: string }[] {
    // Vérifier si space.features existe et est un tableau
    if (!space.features || !Array.isArray(space.features)) {
      return [];
    }
    
    return space.features
      .filter(feature => feature && feature.name && feature.name.trim().length > 0)
      .slice(0, 3);
  }

  private applyFilters(): void {
    console.log('Application des filtres:', this.activeFilter);
    // Filtrage initial
    let result = [...this.spaces];
    
    // Filtre de disponibilité
    if (this.activeFilter.availableOnly) {
      result = result.filter(space => space.available);
    }
    
    // Filtre par type
    if (this.activeFilter.type) {
      if (this.activeFilter.type === 'suite') {
        // Cas spécial pour les suites
        result = result.filter(space => 
          space.type === SpaceType.ROOM && 
          space.name.toLowerCase().includes('suite')
        );
      } else {
        result = result.filter(space => space.type === this.activeFilter.type);
      }
    }
    
    // Filtre par caractéristiques
    if (this.activeFilter.features && this.activeFilter.features.length > 0) {
      result = result.filter(space => {
        // Vérifier si space.features existe
        if (!space.features || !Array.isArray(space.features)) {
          return false;
        }
        
        return this.activeFilter.features!.every(featureId => {
          return space.features.some(f => 
            (f.name && f.name.toLowerCase().includes(featureId.toLowerCase())) || 
            f.icon === featureId
          );
        });
      });
    }
    
    // Filtres de prix
    if (this.activeFilter.minPrice !== undefined) {
      result = result.filter(space => {
        return (space.price || 0) >= (this.activeFilter.minPrice || 0);
      });
    }
    
    if (this.activeFilter.maxPrice !== undefined) {
      result = result.filter(space => {
        return (space.price || 0) <= (this.activeFilter.maxPrice || Infinity);
      });
    }
    
    // Then sort the filtered results
    result = this.sortSpaces(result, this.sortOption);
    
    this.filteredSpaces = result;
    console.log('Espaces filtrés:', this.filteredSpaces.length);
    
    // Reset la pagination et le cache
    this._paginatedSpaces = [];
    
    // Reset à la page 1 si aucun espace ne correspond aux critères de la page actuelle
    if (this.filteredSpaces.length > 0 && this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    // Force la détection de changements après le filtrage
    setTimeout(() => {
      this.changeDetector.detectChanges();
    }, 100);
  }

  private sortSpaces(spaces: Space[], sortOption: string): Space[] {
    switch (sortOption) {
      case 'name-asc':
        return [...spaces].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...spaces].sort((a, b) => b.name.localeCompare(a.name));
      case 'price-asc':
        return [...spaces].sort((a, b) => {
          return (a.price || 0) - (b.price || 0);
        });
      case 'price-desc':
        return [...spaces].sort((a, b) => {
          return (b.price || 0) - (a.price || 0);
        });
      default:
        return spaces;
    }
  }
}