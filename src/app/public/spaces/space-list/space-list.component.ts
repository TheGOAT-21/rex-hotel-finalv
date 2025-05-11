// src/app/public/spaces/space-list/space-list.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpaceCardComponent } from '../space-card/space-card.component';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { SectionTitleComponent } from '../../../shared/components/content/section-title/section-title.component';
import { SpaceType, Space, Image } from '../../../core/interfaces/space.interface';
import { SpaceService } from '../../../core/services/space.service';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { SpaceFilterComponent, SpaceFilter } from '../space-filter/space-filter.component';
import { LoaderComponent } from '../../../shared/components/ui/loader/loader.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-space-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SpaceCardComponent,
    PaginationComponent,
    SectionTitleComponent,
    SpaceFilterComponent,
    LoaderComponent
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Section Title -->
      <app-section-title
        [title]="title"
        [subtitle]="subtitle"
        [centered]="true"
      ></app-section-title>
      
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters (Desktop) -->
        <div class="hidden lg:block lg:w-1/4" *ngIf="showFilters">
          <app-space-filter
            [typeOptions]="typeFilterOptions"
            [featureOptions]="featureOptions"
            [filter]="activeFilter"
            (filterChange)="onFilterChange($event)"
          ></app-space-filter>
        </div>
        
        <div class="lg:w-3/4">
          <!-- Mobile Filter Toggle -->
          <div class="lg:hidden mb-6" *ngIf="showFilters">
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
                [typeOptions]="typeFilterOptions"
                [featureOptions]="featureOptions"
                [filter]="activeFilter"
                (filterChange)="onFilterChange($event)"
              ></app-space-filter>
            </div>
          </div>

          <!-- Results Count and Sort Options -->
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
          
          <!-- Loading State -->
          <div *ngIf="isLoading" class="flex justify-center py-12">
            <app-loader [text]="'Chargement des espaces...'"></app-loader>
          </div>
          
          <!-- Empty State -->
          <div *ngIf="!isLoading && filteredSpaces.length === 0" class="py-12 text-center">
            <div class="text-primary opacity-30 mb-4">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-text mb-2">Aucun espace trouvé</h3>
            <p class="text-text opacity-70 mb-6">Aucun espace ne correspond à vos critères.</p>
            <button 
              (click)="resetFilters()"
              class="bg-primary text-background font-bold uppercase px-4 py-2 rounded hover:bg-primary-hover transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
          
          <!-- Spaces Grid -->
          <div *ngIf="!isLoading && filteredSpaces.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <app-space-card
              *ngFor="let space of paginatedSpaces"
              [id]="space.id"
              [name]="space.name"
              [type]="space.type"
              [description]="space.description"
              [imageUrl]="getMainImageUrl(space)"
              [price]="space.price || 0"
              [priceUnit]="space.currency ? space.currency + ' / nuit' : ''"
              [buttonText]="'Voir détails'"
              [available]="space.available"
              [badge]="getBadgeForSpace(space)"
              [features]="getFeaturesList(space)"
              [detailPath]="'/spaces/' + space.id"
              (cardClick)="onSpaceCardClick(space.id)"
              (buttonClick)="onSpaceButtonClick($event)"
            ></app-space-card>
          </div>
          
          <!-- Pagination -->
          <div *ngIf="!isLoading && filteredSpaces.length > itemsPerPage" class="mt-12">
            <app-pagination
              [currentPage]="currentPage"
              [totalPages]="totalPages"
              (pageChange)="onPageChange($event)"
            ></app-pagination>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SpaceListComponent implements OnInit {
  @Input() title: string = 'Nos Espaces';
  @Input() subtitle: string = 'Découvrez nos chambres, suites et espaces événementiels';
  @Input() showFilters: boolean = true;
  @Input() itemsPerPage: number = 6;
  
  spaces: Space[] = [];
  filteredSpaces: Space[] = [];
  isLoading: boolean = true;
  showMobileFilter: boolean = false;
  currentPage: number = 1;
  sortOption: string = 'name-asc';
  
  activeFilter: SpaceFilter = {
    availableOnly: true,
    features: []
  };
  
  typeFilterOptions = [
    { id: '', label: 'Tous', count: 0 },
    { id: SpaceType.ROOM, label: 'Chambres', count: 0 },
    { id: SpaceType.ROOM + '_SUITE', label: 'Suites', count: 0 },
    { id: SpaceType.RESTAURANT, label: 'Restaurants', count: 0 },
    { id: SpaceType.EVENT_SPACE, label: 'Événementiel', count: 0 }
  ];
  
  featureOptions = [
    { id: 'wifi', label: 'Wifi gratuit' },
    { id: 'air-conditioner', label: 'Climatisation' },
    { id: 'balcony', label: 'Balcon/Terrasse' },
    { id: 'pool', label: 'Vue piscine' },
    { id: 'garden', label: 'Vue jardin' }
  ];
  
  constructor(
    private spaceService: SpaceService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    this.loadSpaces();
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredSpaces.length / this.itemsPerPage);
  }
  
  get paginatedSpaces(): Space[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredSpaces.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  loadSpaces(): void {
    this.isLoading = true;
    
    this.spaceService.getAllSpaces()
      .pipe(
        map(spaces => {
          if (spaces.length === 0) {
            this.notificationService.showWarning('Aucun espace disponible');
          }
          this.updateTypeFilterCounts(spaces);
          return spaces;
        }),
        catchError(error => {
          console.error('Error loading spaces:', error);
          this.notificationService.showError('Erreur lors du chargement des espaces');
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(spaces => {
        this.spaces = spaces;
        this.applyFilters();
      });
  }
  
  updateTypeFilterCounts(spaces: Space[]): void {
    // Mise à jour du compteur "Tous"
    this.typeFilterOptions[0].count = spaces.length;
    
    // Mise à jour des compteurs par type
    for (let i = 1; i < this.typeFilterOptions.length; i++) {
      const option = this.typeFilterOptions[i];
      if (option.id === SpaceType.ROOM + '_SUITE') {
        // Comptage spécial pour les suites
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
  
  onFilterChange(filter: SpaceFilter): void {
    this.activeFilter = filter;
    this.currentPage = 1;
    this.applyFilters();
    this.showMobileFilter = false;
  }
  
  onSortChange(event: Event): void {
    this.sortOption = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  toggleMobileFilter(): void {
    this.showMobileFilter = !this.showMobileFilter;
  }
  
  resetFilters(): void {
    this.activeFilter = {
      availableOnly: true,
      features: []
    };
    this.applyFilters();
    this.notificationService.showInfo('Filtres réinitialisés');
  }
  
  onSpaceCardClick(id: string): void {
    // Navigation handled by router link in template
  }
  
  onSpaceButtonClick(event: { id: string; event: MouseEvent }): void {
    event.event.stopPropagation();
  }
  
  getMainImageUrl(space: Space): string {
    if (space.images && space.images.length > 0) {
      const primaryImage = space.images.find(img => img.isPrimary);
      return primaryImage ? primaryImage.url : space.images[0].url;
    }
    return `/assets/images/spaces/default-${space.type.toLowerCase()}.jpg`;
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
  
  getFeaturesList(space: Space): { name: string; icon?: string }[] {
    return space.features
      .filter(feature => feature.name && feature.name.trim().length > 0)
      .slice(0, 3);
  }
  
  private applyFilters(): void {
    // Filtrage initial
    let result = [...this.spaces];
    
    // Filtre de disponibilité
    if (this.activeFilter.availableOnly) {
      result = result.filter(space => space.available);
    }
    
    // Filtre par type
    if (this.activeFilter.type) {
      if (this.activeFilter.type === SpaceType.ROOM + '_SUITE') {
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
        return this.activeFilter.features!.every(featureId => {
          return space.features.some(f => 
            f.name.toLowerCase().includes(featureId.toLowerCase()) || 
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
    
    // Tri
    this.filteredSpaces = this.sortSpaces(result, this.sortOption);
  }
  
  private sortSpaces(spaces: Space[], sortOption: string): Space[] {
    const sortableSpaces = [...spaces];
    
    switch (sortOption) {
      case 'name-asc':
        return sortableSpaces.sort((a, b) => a.name.localeCompare(b.name));
        
      case 'name-desc':
        return sortableSpaces.sort((a, b) => b.name.localeCompare(a.name));
        
      case 'price-asc':
        return sortableSpaces.sort((a, b) => (a.price || 0) - (b.price || 0));
        
      case 'price-desc':
        return sortableSpaces.sort((a, b) => (b.price || 0) - (a.price || 0));
        
      default:
        return sortableSpaces;
    }
  }
}