// space-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-space-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div 
      class="bg-background-alt rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl cursor-pointer"
      [ngClass]="{'opacity-60': !available}"
      (click)="onCardClick()"
    >
      <!-- Image Container -->
      <div class="relative h-48 md:h-56 overflow-hidden">
        <img 
          [src]="imageUrl" 
          [alt]="imageAlt || name" 
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        >
        
        <!-- Badge -->
        <div *ngIf="badge" class="absolute top-3 left-3 bg-primary text-background px-2 py-1 text-xs font-bold uppercase rounded">
          {{ badge }}
        </div>
        
        <!-- Unavailable Overlay -->
        <div *ngIf="!available" class="absolute inset-0 bg-background bg-opacity-60 flex items-center justify-center">
          <span class="bg-error text-text px-3 py-1 rounded-full text-sm font-semibold">
            Non Disponible
          </span>
        </div>
      </div>
      
      <!-- Content -->
      <div class="p-4">
        <!-- Type Tag -->
        <div *ngIf="type" class="text-primary text-xs font-bold uppercase mb-1">{{ type }}</div>
        
        <!-- Title -->
        <h3 class="text-lg font-title font-bold text-text mb-2">{{ name }}</h3>
        
        <!-- Brief Description -->
        <p class="text-text opacity-80 text-sm mb-3 line-clamp-2">{{ description }}</p>
        
        <!-- Features -->
        <div *ngIf="features && features.length" class="flex flex-wrap gap-2 mb-3">
          <span 
            *ngFor="let feature of features.slice(0, maxFeatures)" 
            class="inline-flex items-center text-xs px-2 py-1 rounded-full bg-dark-200 text-text"
          >
            <span *ngIf="feature.icon" class="mr-1">
              <i [class]="feature.icon"></i>
            </span>
            {{ feature.name }}
          </span>
        </div>
        
        <!-- Price -->
        <div class="flex items-end justify-between mt-auto">
          <div *ngIf="price">
            <span class="text-primary font-bold text-lg">{{ price }}</span>
            <span *ngIf="priceUnit" class="text-text text-sm ml-1">{{ priceUnit }}</span>
          </div>
          
          <!-- CTA Button -->
          <button 
            *ngIf="buttonText && available"
            class="bg-primary text-background px-3 py-1 rounded text-sm font-bold uppercase hover:bg-primary-hover transition-colors"
            (click)="onButtonClick($event)"
          >
            {{ buttonText }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class SpaceCardComponent {
  @Input() id = '';
  @Input() name = '';
  @Input() type = '';
  @Input() description = '';
  @Input() imageUrl = '';
  @Input() imageAlt = '';
  @Input() price: string | number = '';
  @Input() priceUnit = '';
  @Input() buttonText = 'Voir';
  @Input() available = true;
  @Input() badge = '';
  @Input() features: { name: string; icon?: string }[] = [];
  @Input() maxFeatures = 3;
  @Input() detailPath = '';
  
  @Output() cardClick = new EventEmitter<string>();
  @Output() buttonClick = new EventEmitter<{ id: string; event: MouseEvent }>();
  
  onCardClick() {
    if (this.available) {
      this.cardClick.emit(this.id);
    }
  }
  
  onButtonClick(event: MouseEvent) {
    event.stopPropagation(); // Prevent card click
    this.buttonClick.emit({ id: this.id, event });
  }
}