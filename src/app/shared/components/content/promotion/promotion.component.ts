// promotion.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="promotion-container" [ngClass]="{'bg-background': !backgroundImage, 'rounded-lg overflow-hidden': !fullWidth}">
      <!-- Background Image (if provided) -->
      <div 
        *ngIf="backgroundImage" 
        class="relative"
        [ngClass]="{'rounded-lg overflow-hidden': !fullWidth}"
      >
        <img 
          [src]="backgroundImage" 
          [alt]="title" 
          class="w-full object-cover"
          [ngClass]="[
            imageHeight === 'small' ? 'h-48 md:h-64' : '',
            imageHeight === 'medium' ? 'h-64 md:h-96' : '',
            imageHeight === 'large' ? 'h-96 md:h-screen' : ''
          ]"
        >
        
        <div 
          class="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-70"
          [ngClass]="{'bg-gradient-to-r': align === 'left', 'bg-gradient-to-l': align === 'right'}"
        ></div>
        
        <!-- Content -->
        <div 
          class="absolute inset-0 flex items-center"
          [ngClass]="[
            align === 'left' ? 'justify-start' : '',
            align === 'center' ? 'justify-center' : '',
            align === 'right' ? 'justify-end' : ''
          ]"
        >
          <div 
            class="px-6 py-8 text-text max-w-xl"
            [ngClass]="[
              align === 'left' ? 'ml-0 md:ml-12' : '',
              align === 'center' ? 'text-center' : '',
              align === 'right' ? 'mr-0 md:mr-12' : ''
            ]"
          >
            <div *ngIf="tagline" class="text-primary font-semibold mb-2">{{ tagline }}</div>
            <h2 class="text-2xl md:text-3xl lg:text-4xl font-title font-bold text-primary mb-4">{{ title }}</h2>
            <p class="mb-6">{{ description }}</p>
            <a 
              *ngIf="buttonText"
              [routerLink]="buttonLink || '/'" 
              class="inline-block bg-primary text-background font-bold uppercase px-4 py-2 rounded hover:bg-primary-hover transition-colors"
            >
              {{ buttonText }}
            </a>
          </div>
        </div>
      </div>
      
      <!-- Content without Background Image -->
      <div *ngIf="!backgroundImage" class="px-6 py-8 text-text" [ngClass]="{'text-center': align === 'center'}">
        <div *ngIf="tagline" class="text-primary font-semibold mb-2">{{ tagline }}</div>
        <h2 class="text-2xl md:text-3xl font-title font-bold text-primary mb-4">{{ title }}</h2>
        <p class="mb-6">{{ description }}</p>
        <a 
          *ngIf="buttonText"
          [routerLink]="buttonLink || '/'" 
          class="inline-block bg-primary text-background font-bold uppercase px-4 py-2 rounded hover:bg-primary-hover transition-colors"
        >
          {{ buttonText }}
        </a>
      </div>
    </div>
  `
})
export class PromotionComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() tagline = '';
  @Input() buttonText = '';
  @Input() buttonLink = '';
  @Input() backgroundImage = '';
  @Input() align: 'left' | 'center' | 'right' = 'left';
  @Input() fullWidth = false;
  @Input() imageHeight: 'small' | 'medium' | 'large' = 'medium';
}