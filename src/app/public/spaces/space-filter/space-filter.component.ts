// src/app/public/spaces/space-filter/space-filter.component.ts

import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpaceService } from '../../../core/services/space.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SpaceType } from '../../../core/interfaces/space.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface SpaceFilter {
  type?: string;
  capacity?: number;
  minPrice?: number;
  maxPrice?: number;
  features?: string[];
  availableOnly?: boolean;
}

@Component({
  selector: 'app-space-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-filter bg-background-alt rounded-lg p-4">
      <div class="mb-4">
        <h3 class="text-lg font-title font-bold text-primary mb-3">Filtrer</h3>
        
        <!-- Reset Button -->
        <button 
          *ngIf="showResetButton"
          (click)="resetFilters()"
          class="text-sm text-primary hover:underline mb-3 inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Réinitialiser les filtres
        </button>
      </div>
      
      <!-- Type Filter -->
      <div class="mb-6" *ngIf="typeOptions && typeOptions.length">
        <h4 class="text-text font-semibold mb-2">Type d'espace</h4>
        <div class="space-y-2">
          <div 
            *ngFor="let option of typeOptions" 
            class="flex items-center"
          >
            <input 
              type="radio" 
              [id]="'type-' + option.id" 
              name="spaceType"
              [value]="option.id"
              [checked]="filter.type === option.id"
              (change)="updateTypeFilter(option.id)"
              class="appearance-none h-4 w-4 border border-dark-300 rounded-full bg-dark-200 checked:bg-primary checked:border-primary checked:focus:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition-colors cursor-pointer relative before:content-[''] before:absolute before:w-1.5 before:h-1.5 before:rounded-full before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-background before:scale-0 checked:before:scale-100 before:transition-transform"
            />
            <label [for]="'type-' + option.id" class="ml-2 text-text text-sm cursor-pointer">
              {{ option.label }}
              <span *ngIf="option.count !== undefined" class="text-text opacity-60 ml-1">({{ option.count }})</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Price Range Filter -->
      <div class="mb-6" *ngIf="showPriceFilter">
        <h4 class="text-text font-semibold mb-2">Prix</h4>
        <div class="px-1">
          <div class="flex justify-between mb-1">
            <span class="text-text text-xs">{{ currencySymbol }}{{ minPriceOption }}</span>
            <span class="text-text text-xs">{{ currencySymbol }}{{ maxPriceOption }}</span>
          </div>
          <div class="flex space-x-3 items-center">
            <input
              type="range"
              [min]="minPriceOption"
              [max]="maxPriceOption"
              [value]="filter.minPrice || minPriceOption"
              (input)="updateMinPrice($event)"
              class="w-full appearance-none h-1 bg-dark-300 rounded-full accent-primary"
            />
          </div>
          <div class="flex space-x-3 items-center mt-2">
            <input
              type="range"
              [min]="minPriceOption"
              [max]="maxPriceOption"
              [value]="filter.maxPrice || maxPriceOption"
              (input)="updateMaxPrice($event)"
              class="w-full appearance-none h-1 bg-dark-300 rounded-full accent-primary"
            />
          </div>
          <div class="flex justify-between mt-3 text-sm">
            <div class="flex items-center">
              <span class="text-text mr-1">Min:</span>
              <span class="text-primary font-semibold">{{ currencySymbol }}{{ filter.minPrice || minPriceOption }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-text mr-1">Max:</span>
              <span class="text-primary font-semibold">{{ currencySymbol }}{{ filter.maxPrice || maxPriceOption }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Features Filter -->
      <div class="mb-6" *ngIf="featureOptions && featureOptions.length">
        <h4 class="text-text font-semibold mb-2">Caractéristiques</h4>
        <div class="space-y-2">
          <div 
            *ngFor="let option of featureOptions" 
            class="flex items-center"
          >
            <input 
              type="checkbox" 
              [id]="'feature-' + option.id" 
              [checked]="isFeatureSelected(option.id)"
              (change)="toggleFeature(option.id)"
              class="appearance-none h-4 w-4 border border-dark-300 rounded bg-dark-200 checked:bg-primary checked:border-primary checked:focus:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition-colors cursor-pointer"
            />
            <label [for]="'feature-' + option.id" class="ml-2 text-text text-sm cursor-pointer">
              {{ option.label }}
              <span *ngIf="option.count !== undefined" class="text-text opacity-60 ml-1">({{ option.count }})</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Available Only Toggle -->
      <div class="mb-4" *ngIf="showAvailabilityFilter">
        <div class="flex items-center">
          <input 
            type="checkbox" 
            id="available-only" 
            [checked]="filter.availableOnly"
            (change)="toggleAvailableOnly()"
            class="appearance-none h-4 w-4 border border-dark-300 rounded bg-dark-200 checked:bg-primary checked:border-primary checked:focus:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition-colors cursor-pointer"
          />
          <label for="available-only" class="ml-2 text-text text-sm cursor-pointer">
            Disponibles uniquement
          </label>
        </div>
      </div>
      
      <!-- Apply Button (Mobile) -->
      <div class="block md:hidden mt-6">
        <button 
          (click)="applyFilters()"
          class="w-full bg-primary text-background font-bold uppercase px-4 py-2 rounded hover:bg-primary-hover transition-colors"
        >
          Appliquer les filtres
        </button>
      </div>
    </div>
  `
})
export class SpaceFilterComponent implements OnInit, OnDestroy {
  @Input() showPriceFilter = true;
  @Input() showCapacityFilter = true;
  @Input() showAvailabilityFilter = true;
  @Input() currencySymbol = 'FCFA';
  @Input() typeOptions: FilterOption[] = [];
  @Input() capacityOptions: FilterOption[] = [];
  @Input() featureOptions: FilterOption[] = [];
  @Input() maxPriceOption = 1000;
  @Input() minPriceOption = 0;
  
  @Input() filter: SpaceFilter = {
    availableOnly: false, // Changé pour false par défaut
    features: []
  };
  
  @Output() filterChange = new EventEmitter<SpaceFilter>();
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private spaceService: SpaceService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    this.loadFilterOptions();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  get showResetButton(): boolean {
    return !!(this.filter.type || 
              this.filter.minPrice || 
              this.filter.maxPrice || 
              (this.filter.features && this.filter.features.length) ||
              this.filter.availableOnly);
  }
  
  private loadFilterOptions(): void {
    // Charger les options de type d'espace
    this.spaceService.getAllSpaces()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        spaces => {
          console.log('Options de filtre chargées - espaces:', spaces.length);
          // Compter les espaces par type
          const typeCounts = new Map<string, number>();
          spaces.forEach(space => {
            const count = typeCounts.get(space.type) || 0;
            typeCounts.set(space.type, count + 1);
          });
          
          // Créer les options de type
          this.typeOptions = [
            { id: '', label: 'Tous les types', count: spaces.length },
            { id: SpaceType.ROOM, label: 'Chambres', count: typeCounts.get(SpaceType.ROOM) || 0 },
            { id: SpaceType.RESTAURANT, label: 'Restaurants', count: typeCounts.get(SpaceType.RESTAURANT) || 0 },
            { id: SpaceType.BAR, label: 'Bars', count: typeCounts.get(SpaceType.BAR) || 0 },
            { id: SpaceType.EVENT_SPACE, label: 'Salles événementielles', count: typeCounts.get(SpaceType.EVENT_SPACE) || 0 }
          ];
          
          // Ajout d'une option pour les suites (sous-type de chambre)
          const suitesCount = spaces.filter(space => 
            space.type === SpaceType.ROOM && 
            space.name.toLowerCase().includes('suite')
          ).length;
          
          // Ajout explicite de l'option 'suite'
          const suiteOption = { id: 'suite', label: 'Suites', count: suitesCount };
          // Assurez-vous que cette option n'existe pas déjà avant de l'ajouter
          if (!this.typeOptions.some(opt => opt.id === 'suite')) {
            this.typeOptions.splice(2, 0, suiteOption); // Insérer après Chambres
          }
          
          // Trouver les min/max prix
          const prices = spaces
            .map(space => space.price)
            .filter(price => typeof price === 'number' && price > 0) as number[];
          
          if (prices.length > 0) {
            this.minPriceOption = Math.floor(Math.min(...prices));
            this.maxPriceOption = Math.ceil(Math.max(...prices));
            console.log(`Plage de prix: ${this.minPriceOption} - ${this.maxPriceOption}`);
          }
          
          // Créer les options de caractéristiques
          const features = new Map<string, number>();
          spaces.forEach(space => {
            if (space.features && Array.isArray(space.features)) {
              space.features.forEach(feature => {
                if (feature && feature.name) {
                  const count = features.get(feature.name) || 0;
                  features.set(feature.name, count + 1);
                }
              });
            }
          });
          
          // Mettre à jour les options de fonctionnalités uniquement si elles ont été définies
          if (features.size > 0 && (!this.featureOptions || this.featureOptions.length === 0)) {
            this.featureOptions = Array.from(features.entries()).map(([name, count]) => ({
              id: name.toLowerCase(),
              label: name,
              count
            }));
          }
        },
        error => {
          this.notificationService.showError(
            'Erreur lors du chargement des options de filtrage',
            'Erreur'
          );
          console.error('Erreur lors du chargement des espaces :', error);
        }
      );
  }
  
  updateTypeFilter(typeId: string): void {
    this.filter = {
      ...this.filter,
      type: typeId
    };
    this.emitChange();
  }
  
  updateMinPrice(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.filter = {
      ...this.filter,
      minPrice: value
    };
    
    // Ensure minPrice doesn't exceed maxPrice
    if (this.filter.maxPrice && value > this.filter.maxPrice) {
      this.filter.maxPrice = value;
    }
    
    this.emitChange();
  }
  
  updateMaxPrice(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.filter = {
      ...this.filter,
      maxPrice: value
    };
    
    // Ensure maxPrice isn't less than minPrice
    if (this.filter.minPrice && value < this.filter.minPrice) {
      this.filter.minPrice = value;
    }
    
    this.emitChange();
  }
  
  isFeatureSelected(featureId: string): boolean {
    if (!this.filter.features) {
      return false;
    }
    return this.filter.features.includes(featureId);
  }
  
  toggleFeature(featureId: string): void {
    const features = [...(this.filter.features || [])];
    
    if (this.isFeatureSelected(featureId)) {
      // Remove feature
      const index = features.indexOf(featureId);
      if (index !== -1) {
        features.splice(index, 1);
      }
    } else {
      // Add feature
      features.push(featureId);
    }
    
    this.filter = {
      ...this.filter,
      features
    };
    
    this.emitChange();
  }
  
  toggleAvailableOnly(): void {
    this.filter = {
      ...this.filter,
      availableOnly: !this.filter.availableOnly
    };
    this.emitChange();
  }
  
  resetFilters(): void {
    this.filter = {
      availableOnly: false, // Changé à false pour montrer tous les espaces
      features: []
    };
    this.emitChange();
    
    this.notificationService.showInfo('Les filtres ont été réinitialisés');
  }
  
  applyFilters(): void {
    this.emitChange();
  }
  
  private emitChange(): void {
    console.log('Filtres appliqués:', this.filter);
    this.filterChange.emit(this.filter);
  }
}