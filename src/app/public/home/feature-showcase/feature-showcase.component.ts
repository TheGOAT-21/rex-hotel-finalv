// feature-showcase.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureComponent } from '../../../shared/components/content/feature/feature.component';
import { SectionTitleComponent } from '../../../shared/components/content/section-title/section-title.component';

export interface FeatureItem {
  title: string;
  description: string;
  iconName: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-feature-showcase',
  standalone: true,
  imports: [CommonModule, FeatureComponent, SectionTitleComponent],
  template: `
    <section class="py-12 md:py-16 bg-background">
      <div class="container mx-auto px-4">
        <!-- Section Title -->
        <app-section-title 
          [title]="sectionTitle" 
          [subtitle]="sectionSubtitle"
          [centered]="true"
        ></app-section-title>
        
        <!-- Feature Grid -->
        <div 
          class="grid gap-6 mt-8"
          [ngClass]="[
            layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : '',
            layout === 'list' ? 'grid-cols-1' : '',
            layout === 'alternate' ? 'grid-cols-1' : ''
          ]"
        >
          <!-- Grid Layout -->
          <ng-container *ngIf="layout === 'grid'">
            <div *ngFor="let feature of features" class="feature-item">
              <app-feature 
                [title]="feature.title" 
                [description]="feature.description" 
                [iconName]="feature.iconName"
              ></app-feature>
            </div>
          </ng-container>
          
          <!-- List Layout -->
          <ng-container *ngIf="layout === 'list'">
            <div *ngFor="let feature of features" class="flex items-center mb-8">
              <div class="mr-6">
                <div class="text-primary bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center">
                  <!-- Icon for the feature -->
                  <svg *ngIf="feature.iconName === 'wifi'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                  <svg *ngIf="feature.iconName === 'restaurant'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <svg *ngIf="feature.iconName === 'pool'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  <svg *ngIf="feature.iconName === 'security'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <svg *ngIf="!['wifi', 'restaurant', 'pool', 'security'].includes(feature.iconName)" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-2 text-text">{{ feature.title }}</h3>
                <p class="text-text opacity-80">{{ feature.description }}</p>
              </div>
            </div>
          </ng-container>
          
          <!-- Alternate Layout -->
          <ng-container *ngIf="layout === 'alternate'">
            <div *ngFor="let feature of features; let i = index" 
                 class="flex flex-col md:flex-row items-center mb-12"
                 [ngClass]="{'md:flex-row-reverse': i % 2 !== 0}"
            >
              <!-- Feature Image (if available) -->
              <div *ngIf="feature.imageUrl" class="md:w-1/2 mb-6 md:mb-0">
                <img [src]="feature.imageUrl" [alt]="feature.title" class="rounded-lg shadow-lg">
              </div>
              
              <!-- Feature Text -->
              <div class="md:w-1/2 md:px-8">
                <div class="text-primary bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <!-- Same icons as in list layout -->
                  <svg *ngIf="feature.iconName === 'wifi'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                  <svg *ngIf="feature.iconName === 'restaurant'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <svg *ngIf="feature.iconName === 'pool'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  <svg *ngIf="feature.iconName === 'security'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <svg *ngIf="!['wifi', 'restaurant', 'pool', 'security'].includes(feature.iconName)" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 class="text-2xl font-bold mb-3 text-text">{{ feature.title }}</h3>
                <p class="text-text opacity-80 text-lg">{{ feature.description }}</p>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </section>
  `
})
export class FeatureShowcaseComponent {
  @Input() sectionTitle = 'Nos Services';
  @Input() sectionSubtitle = 'Découvrez nos prestations d\'exception pour un séjour parfait';
  @Input() features: FeatureItem[] = [
    {
      title: 'WiFi Gratuit',
      description: 'Connexion haut débit disponible dans tout l\'établissement',
      iconName: 'wifi'
    },
    {
      title: 'Restaurants Gastronomiques',
      description: 'Trois restaurants proposant une cuisine internationale et locale',
      iconName: 'restaurant'
    },
    {
      title: 'Piscine',
      description: 'Grande piscine extérieure avec espace détente',
      iconName: 'pool'
    },
    {
      title: 'Sécurité 24/7',
      description: 'Service de sécurité présent jour et nuit pour votre tranquillité',
      iconName: 'security'
    }
  ];
  @Input() layout: 'grid' | 'list' | 'alternate' = 'grid';
}