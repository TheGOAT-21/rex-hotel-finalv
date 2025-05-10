// src/app/public/home/feature-showcase/feature-showcase.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FeatureComponent } from '../../../shared/components/content/feature/feature.component';
import { SectionTitleComponent } from '../../../shared/components/content/section-title/section-title.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { SpaceService } from '../../../core/services/space.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { NotificationService } from '../../../core/services/notification.service';

export interface FeatureItem {
  title: string;
  description: string;
  iconName: string;
  imageUrl?: string;
  link?: string;
}

@Component({
  selector: 'app-feature-showcase',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FeatureComponent, 
    SectionTitleComponent,
    CardComponent,
    ButtonComponent
  ],
  template: `
    <section class="py-12 md:py-16 bg-background" [ngClass]="{'bg-background-alt': altBackground}">
      <div class="container mx-auto px-4">
        <!-- Section Title -->
        <app-section-title 
          [title]="sectionTitle" 
          [subtitle]="sectionSubtitle"
          [centered]="centered"
        ></app-section-title>
        
        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full border-t-4 border-primary border-opacity-75 border-r-4 border-r-transparent h-12 w-12"></div>
        </div>
        
        <!-- Error Message -->
        <div *ngIf="errorMessage" class="mb-8 p-4 bg-error bg-opacity-10 text-error rounded-lg">
          {{ errorMessage }}
        </div>
        
        <!-- Grid Layout -->
        <div *ngIf="layout === 'grid' && !isLoading" 
             class="grid gap-6 mt-8"
             [ngClass]="{'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': true}">
          <div *ngFor="let feature of displayedFeatures" class="feature-item">
            <app-feature 
              [title]="feature.title" 
              [description]="feature.description" 
              [iconName]="feature.iconName"
            ></app-feature>
          </div>
        </div>
        
        <!-- List Layout -->
        <div *ngIf="layout === 'list' && !isLoading" class="mt-8">
          <div *ngFor="let feature of displayedFeatures" class="flex flex-col md:flex-row items-start mb-8">
            <div class="md:mr-6 mb-4 md:mb-0">
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
              <a *ngIf="feature.link" [routerLink]="feature.link" class="text-primary hover:underline inline-block mt-2">En savoir plus</a>
            </div>
          </div>
        </div>
        
        <!-- Alternate Layout -->
        <div *ngIf="layout === 'alternate' && !isLoading" class="mt-8">
          <div *ngFor="let feature of displayedFeatures; let i = index" 
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
              <a *ngIf="feature.link" [routerLink]="feature.link" class="text-primary hover:underline inline-block mt-4">En savoir plus</a>
            </div>
          </div>
        </div>
        
        <!-- Card Layout -->
        <div *ngIf="layout === 'card' && !isLoading" class="mt-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <app-card *ngFor="let feature of displayedFeatures">
              <div class="p-6">
                <div class="text-primary bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <!-- Icons (same as above) -->
                  <svg *ngIf="feature.iconName === 'wifi'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                  <!-- Additional icons as above -->
                </div>
                
                <h3 class="text-xl font-bold mb-3 text-text">{{ feature.title }}</h3>
                <p class="text-text opacity-80">{{ feature.description }}</p>
                
                <div *ngIf="feature.link" class="mt-4">
                  <a [routerLink]="feature.link" class="text-primary hover:underline">En savoir plus</a>
                </div>
              </div>
            </app-card>
          </div>
        </div>
        
        <!-- Show More Button if maxFeatures is set -->
        <div *ngIf="maxFeatures && features.length > maxFeatures && !showAll" class="mt-8 text-center">
          <app-button (onClick)="toggleShowAll()">
            Voir tous les services
          </app-button>
        </div>
        
        <!-- Show Less Button if showing all -->
        <div *ngIf="maxFeatures && features.length > maxFeatures && showAll" class="mt-8 text-center">
          <app-button (onClick)="toggleShowAll()" variant="secondary">
            Voir moins
          </app-button>
        </div>
      </div>
    </section>
  `
})
export class FeatureShowcaseComponent implements OnInit {
  @Input() sectionTitle = 'Nos Services';
  @Input() sectionSubtitle = 'Découvrez nos prestations d\'exception pour un séjour parfait';
  @Input() layout: 'grid' | 'list' | 'alternate' | 'card' = 'grid';
  @Input() centered = true;
  @Input() altBackground = false;
  @Input() maxFeatures?: number;
  @Input() cacheKey?: string;
  @Input() loadFromData = false;

  // Optional input to provide features directly instead of loading from service
  @Input() features: FeatureItem[] = [];

  // Component state
  isLoading = false;
  errorMessage = '';
  showAll = false;
  
  // Computed features to display
  get displayedFeatures(): FeatureItem[] {
    if (!this.maxFeatures || this.showAll) {
      return this.features;
    }
    return this.features.slice(0, this.maxFeatures);
  }

  constructor(
    private spaceService: SpaceService,
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Initialize with default features if none provided
    if (this.features.length === 0) {
      if (this.loadFromData) {
        this.loadFeaturesFromService();
      } else {
        this.features = this.getDefaultFeatures();
      }
    }

    // Load cached features if cacheKey is provided
    if (this.cacheKey) {
      const cachedFeatures = this.localStorageService.get<FeatureItem[]>(this.cacheKey);
      if (cachedFeatures && cachedFeatures.length > 0) {
        this.features = cachedFeatures;
      }
    }
  }

  toggleShowAll(): void {
    this.showAll = !this.showAll;
    
    // Show notification when user expands or collapses features
    if (this.showAll) {
      this.notificationService.showInfo('Affichage de tous les services');
    }
  }

  loadFeaturesFromService(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Extract features from spaces - similar to how we might build them from actual hotel services
    this.spaceService.getAllSpaces().subscribe({
      next: (spaces) => {
        // Example: derive features from space types and available amenities
        const spaceFeatures: FeatureItem[] = [];
        
        // Check if there are restaurants
        const restaurants = spaces.filter(space => space.type === 'restaurant');
        if (restaurants.length > 0) {
          spaceFeatures.push({
            title: 'Restaurants Gastronomiques',
            description: `${restaurants.length} restaurants proposant une cuisine internationale et locale`,
            iconName: 'restaurant',
            link: '/spaces?type=restaurant'
          });
        }
        
        // Check for pools
        const hasPool = spaces.some(space => 
          space.name.toLowerCase().includes('piscine') || 
          (space.features && space.features.some(f => f.name.toLowerCase().includes('piscine')))
        );
        
        if (hasPool) {
          spaceFeatures.push({
            title: 'Piscine',
            description: 'Grande piscine extérieure avec espace détente',
            iconName: 'pool',
            imageUrl: '/assets/images/facilities/pool-main.jpg',
            link: '/spaces/swimmingPool'
          });
        }
        
        // Check for event spaces
        const eventSpaces = spaces.filter(space => space.type === 'event_space');
        if (eventSpaces.length > 0) {
          spaceFeatures.push({
            title: 'Espaces Événementiels',
            description: `${eventSpaces.length} salles modulables pour vos événements professionnels et privés`,
            iconName: 'event',
            link: '/spaces?type=event_space'
          });
        }
        
        // Add default features
        const defaultFeatures = this.getDefaultFeatures();
        this.features = [...spaceFeatures, ...defaultFeatures];
        
        // Cache the features if cacheKey is provided
        if (this.cacheKey) {
          this.localStorageService.set(this.cacheKey, this.features, 3600); // Cache for 1 hour
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading features:', error);
        this.errorMessage = 'Impossible de charger les services. Veuillez réessayer plus tard.';
        this.features = this.getDefaultFeatures(); // Fallback to defaults
        this.isLoading = false;
      }
    });
  }

  getDefaultFeatures(): FeatureItem[] {
    return [
      {
        title: 'WiFi Gratuit',
        description: "Connexion haut débit disponible dans tout l'établissement",
        iconName: 'wifi',
        link: '/services/wifi'
      },
      {
        title: 'Restaurants Gastronomiques',
        description: 'Trois restaurants proposant une cuisine internationale et locale',
        iconName: 'restaurant',
        imageUrl: '/assets/images/restaurants/restaurant.png',
        link: '/spaces?type=restaurant'
      },
      {
        title: 'Piscine',
        description: 'Grande piscine extérieure avec espace détente',
        iconName: 'pool',
        imageUrl: '/assets/images/facilities/pool-main.jpg',
        link: '/spaces/swimmingPool'
      },
      {
        title: 'Sécurité 24/7',
        description: 'Service de sécurité présent jour et nuit pour votre tranquillité',
        iconName: 'security'
      },
      {
        title: 'Parkings Sécurisés',
        description: 'Espaces de stationnement extérieur et sous-sol surveillés',
        iconName: 'parking',
        link: '/services/parking'
      },
      {
        title: 'Espace Enfants',
        description: 'Zone de loisirs dédiée aux enfants avec supervision',
        iconName: 'children',
        imageUrl: '/assets/images/kids-play.png',
        link: '/spaces/kidsArea'
      },
      {
        title: 'Service en Chambre',
        description: 'Service en chambre disponible 24/7 pour votre confort',
        iconName: 'room-service'
      },
      {
        title: 'Spa & Bien-être',
        description: 'Espace détente avec massages et soins du corps',
        iconName: 'spa',
        link: '/services/spa'
      }
    ];
  }
}