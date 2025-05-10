// space-filter.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
      
      <!-- Capacity Filter -->
      <div class="mb-6" *ngIf="showCapacityFilter">
        <h4 class="text-text font-semibold mb-2">Capacité</h4>
        <div class="space-y-2">
          <div 
            *ngFor="let option of capacityOptions" 
            class="flex items-center"
          >
            <input 
              type="radio" 
              [id]="'capacity-' + option.id" 
              name="capacity"
              [value]="option.id"
              [checked]="filter.capacity === +option.id"
              (change)="updateCapacityFilter(+option.id)"
              class="appearance-none h-4 w-4 border border-dark-300 rounded-full bg-dark-200 checked:bg-primary checked:border-primary checked:focus:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition-colors cursor-pointer relative before:content-[''] before:absolute before:w-1.5 before:h-1.5 before:rounded-full before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-background before:scale-0 checked:before:scale-100 before:transition-transform"
            />
            <label [for]="'capacity-' + option.id" class="ml-2 text-text text-sm cursor-pointer">
              {{ option.label }}
              <span *ngIf="option.count !== undefined" class="text-text opacity-60 ml-1">({{ option.count }})</span>
            </label>
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
export class SpaceFilterComponent {
  @Input() typeOptions: FilterOption[] = [];
  @Input() featureOptions: FilterOption[] = [];
  @Input() capacityOptions: FilterOption[] = [];
  @Input() minPriceOption = 0;
  @Input() maxPriceOption = 1000;
  @Input() currencySymbol = 'FCFA';
  @Input() showPriceFilter = true;
  @Input() showCapacityFilter = true;
  @Input() showAvailabilityFilter = true;
  
  @Input() filter: SpaceFilter = {
    availableOnly: true,
    features: []
  };
  
  @Output() filterChange = new EventEmitter<SpaceFilter>();
  
  get showResetButton(): boolean {
    return !!(this.filter.type || 
              this.filter.minPrice || 
              this.filter.maxPrice || 
              (this.filter.features && this.filter.features.length) || 
              this.filter.capacity);
  }
  
  updateTypeFilter(typeId: string) {
    this.filter = {
      ...this.filter,
      type: typeId
    };
    this.emitChange();
  }
  
  updateMinPrice(event: Event) {
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
  
  updateMaxPrice(event: Event) {
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
  
  updateCapacityFilter(capacity: number) {
    this.filter = {
      ...this.filter,
      capacity
    };
    this.emitChange();
  }
  
  isFeatureSelected(featureId: string): boolean {
    return this.filter.features?.includes(featureId) || false;
  }
  
  toggleFeature(featureId: string) {
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
  
  toggleAvailableOnly() {
    this.filter = {
      ...this.filter,
      availableOnly: !this.filter.availableOnly
    };
    this.emitChange();
  }
  
  resetFilters() {
    this.filter = {
      availableOnly: true,
      features: []
    };
    this.emitChange();
  }
  
  applyFilters() {
    this.emitChange();
  }
  
  private emitChange() {
    this.filterChange.emit(this.filter);
  }
}