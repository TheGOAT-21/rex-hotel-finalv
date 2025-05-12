// src/app/public/spaces/space-card/space-card.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SpaceService } from '../../../core/services/space.service';
import { BookingService } from '../../../core/services/booking.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Space, SpaceType } from '../../../core/interfaces/space.interface';

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
      <!-- Debug Info (hide in production) -->
      <div *ngIf="showDebug" class="bg-yellow-100 p-2 text-xs">
        <div>ID: {{ id }}</div>
        <div>Name: {{ name }}</div>
        <div>Type: {{ type }}</div>
        <div>Image: {{ imageUrl }}</div>
      </div>
    
      <!-- Image Container -->
      <div class="relative h-48 md:h-56 overflow-hidden">
        <!-- Fallback placeholder during image load -->
        <div *ngIf="!imageLoaded" class="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div class="animate-pulse text-gray-400">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
        
        <img 
          [src]="safeImageUrl" 
          [alt]="imageAlt || name" 
          class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          (load)="onImageLoad()"
          (error)="onImageError()"
        >
        
        <!-- Badge -->
        <div *ngIf="badge" class="absolute top-3 left-3 bg-primary text-background px-2 py-1 text-xs font-bold uppercase rounded">
          {{ badge }}
        </div>
        
        <!-- Promo Badge -->
        <div *ngIf="isOnPromotion" class="absolute top-3 right-3 bg-error text-background px-2 py-1 text-xs font-bold uppercase rounded">
          {{ promoPercentage }}% OFF
        </div>
        
        <!-- Unavailable Overlay -->
        <div *ngIf="!available" class="absolute inset-0 bg-background bg-opacity-60 flex items-center justify-center">
          <span class="bg-error text-white px-3 py-1 rounded-full text-sm font-semibold">
            Non Disponible
          </span>
        </div>

        <!-- Favorite Button -->
        <button 
          *ngIf="showFavoriteButton && available"
          (click)="toggleFavorite($event)"
          class="absolute top-3 right-3 bg-background bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full text-text hover:text-primary transition-colors"
          [ngClass]="{'text-primary': isFavorite}"
          aria-label="Ajouter aux favoris"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              [attr.fill]="isFavorite ? 'currentColor' : 'none'"
              [attr.stroke]="isFavorite ? 'none' : 'currentColor'"
              stroke-width="2"
            ></path>
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-4">
        <!-- Type Tag -->
        <div *ngIf="type" class="text-primary text-xs font-bold uppercase mb-1">{{ type }}</div>
        
        <!-- Title -->
        <h3 class="text-lg font-title font-bold text-text mb-2">{{ name }}</h3>
        
        <!-- Brief Description -->
        <p class="text-text opacity-80 text-sm mb-3 line-clamp-2">{{ description }}</p>
        
        <!-- Availability Tag (if show availability) -->
        <div *ngIf="showAvailability" class="mb-3">
          <span *ngIf="available" class="inline-flex items-center text-xs px-2 py-1 rounded-full bg-success bg-opacity-10 text-success">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Disponible
          </span>
          <span *ngIf="!available" class="inline-flex items-center text-xs px-2 py-1 rounded-full bg-error bg-opacity-10 text-error">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Non disponible
          </span>
        </div>
        
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
        
        <!-- Price and Button -->
        <div class="flex items-end justify-between mt-auto">
          <div *ngIf="price">
            <span *ngIf="isOnPromotion" class="text-text opacity-60 line-through text-sm">{{ originalPrice }}</span>
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
export class SpaceCardComponent implements OnInit, OnChanges {
  @Input() id = '';
  @Input() name = '';
  @Input() type = '';
  @Input() description = '';
  @Input() imageUrl = '';
  @Input() imageAlt = '';
  @Input() price: string | number = '';
  @Input() originalPrice: string | number = '';
  @Input() priceUnit = '';
  @Input() buttonText = 'Voir';
  @Input() available = true;
  @Input() badge = '';
  @Input() features: { name: string; icon?: string }[] = [];
  @Input() maxFeatures = 3;
  @Input() detailPath = '';
  @Input() showAvailability = true;
  @Input() showFavoriteButton = true;
  @Input() showDebug = true; // Afficher les infos de débogage
  
  @Output() cardClick = new EventEmitter<string>();
  @Output() buttonClick = new EventEmitter<{ id: string; event: MouseEvent }>();
  @Output() favoriteToggle = new EventEmitter<{ id: string; isFavorite: boolean }>();

  isFavorite = false;
  isOnPromotion = false;
  promoPercentage = 0;
  spaceDetails?: Space;
  imageLoaded = false;
  
  // Url sécurisée pour l'image
  get safeImageUrl(): string {
    // Si l'URL est vide ou undefined, utiliser l'image par défaut
    if (!this.imageUrl) {
      return 'assets/images/placeholder.jpg';
    }
    
    // Si l'URL commence par 'assets/', la considérer comme valide
    if (this.imageUrl.startsWith('assets/')) {
      return this.imageUrl;
    }
    
    // Si l'URL est relative (pas http/https), ajouter le préfixe 'assets/'
    if (!this.imageUrl.startsWith('http')) {
      return `assets/${this.imageUrl}`;
    }
    
    // Sinon, utiliser l'URL telle quelle
    return this.imageUrl;
  }
  
  constructor(
    private spaceService: SpaceService,
    private bookingService: BookingService,
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Vérifier si l'espace est en favoris
    this.checkIfFavorite();
    
    // Vérifier si l'espace est en promotion
    this.checkPromotion();
    
    // Récupérer les détails complets de l'espace si nécessaire
    if (this.id && (
      !this.name || 
      !this.description || 
      !this.imageUrl || 
      !this.features || 
      this.features.length === 0)) {
      this.loadSpaceDetails();
    }
    
    // Log pour débogage
    console.log(`SpaceCard Init - ID: ${this.id}, Name: ${this.name}, Image: ${this.imageUrl}`);
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // Réinitialiser l'état de chargement de l'image si l'URL change
    if (changes['imageUrl']) {
      this.imageLoaded = false;
    }
  }
  
  onImageLoad(): void {
    this.imageLoaded = true;
    console.log(`Image chargée: ${this.safeImageUrl}`);
  }
  
  onImageError(): void {
    console.error(`Erreur de chargement d'image: ${this.safeImageUrl}`);
    // Remplacer par l'image par défaut
    this.imageUrl = 'assets/images/placeholder.jpg';
    // Réessayer avec la nouvelle URL
    this.imageLoaded = false;
  }
  
  onCardClick(): void {
    if (this.available) {
      // Emit the event for any parent components that need to know
      this.cardClick.emit(this.id);
      
      // Save to view history
      this.saveToViewHistory();
      
      // Navigate to detail view
      if (this.detailPath) {
        this.router.navigate([this.detailPath]);
      } else if (this.id) {
        this.router.navigate(['/spaces', this.id]);
      }
    }
  }
  
  onButtonClick(event: MouseEvent): void {
    event.stopPropagation(); // Prevent card click
    this.buttonClick.emit({ id: this.id, event });
  }
  
  toggleFavorite(event: MouseEvent): void {
    event.stopPropagation(); // Prevent card click
    
    this.isFavorite = !this.isFavorite;
    
    // Mettre à jour les favoris dans le localStorage
    const favorites = this.localStorageService.get<string[]>('favorite_spaces', []) || [];
    
    if (this.isFavorite) {
      // Ajouter aux favoris s'il n'y est pas déjà
      if (!favorites.includes(this.id)) {
        favorites.push(this.id);
        this.notificationService.showSuccess(`${this.name} ajouté aux favoris`);
      }
    } else {
      // Retirer des favoris
      const index = favorites.indexOf(this.id);
      if (index !== -1) {
        favorites.splice(index, 1);
        this.notificationService.showInfo(`${this.name} retiré des favoris`);
      }
    }
    
    // Sauvegarder les favoris mis à jour
    this.localStorageService.set('favorite_spaces', favorites);
    
    // Émettre l'événement
    this.favoriteToggle.emit({ id: this.id, isFavorite: this.isFavorite });
  }
  
  private checkIfFavorite(): void {
    if (!this.id) return;
    
    const favorites = this.localStorageService.get<string[]>('favorite_spaces', []) || [];
    this.isFavorite = favorites.includes(this.id);
  }
  
  private checkPromotion(): void {
    // Vérifier si le prix original est défini et différent du prix actuel
    if (this.originalPrice && this.price && this.originalPrice !== this.price) {
      this.isOnPromotion = true;
      
      // Calculer le pourcentage de réduction
      const originalPrice = typeof this.originalPrice === 'string' ? 
        parseFloat(this.originalPrice) : this.originalPrice;
      
      const currentPrice = typeof this.price === 'string' ? 
        parseFloat(this.price as string) : this.price;
      
      if (originalPrice > 0 && currentPrice > 0) {
        this.promoPercentage = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
      }
    }
  }
  
  private loadSpaceDetails(): void {
    if (!this.id) return;
    
    this.spaceService.getSpaceById(this.id).subscribe(
      space => {
        if (space) {
          this.spaceDetails = space;
          
          // Mettre à jour les propriétés manquantes si nécessaire
          if (!this.name && space.name) this.name = space.name;
          if (!this.type && space.type) this.type = this.formatSpaceType(space.type);
          if (!this.description && space.description) this.description = space.description;
          if (!this.price && space.price) this.price = space.price;
          if (!this.priceUnit && space.currency) this.priceUnit = `${space.currency} / nuit`;
          if (this.available !== space.available) this.available = space.available;
          
          // Mise à jour des features si nécessaires
          if (!this.features || this.features.length === 0) {
            if (space.features && Array.isArray(space.features)) {
              this.features = space.features.filter(f => f && f.name);
            }
          }
          
          // Mise à jour de l'image principale si elle n'est pas définie
          if (!this.imageUrl && space.images && space.images.length > 0) {
            const primaryImage = space.images.find(img => img.isPrimary);
            this.imageUrl = primaryImage ? primaryImage.url : space.images[0].url;
            this.imageAlt = primaryImage ? primaryImage.alt : space.name;
          }
        }
      },
      error => {
        console.error('Erreur lors du chargement des détails de l\'espace:', error);
      }
    );
  }
  
  private saveToViewHistory(): void {
    if (!this.id) return;
    
    const viewHistory = this.localStorageService.get<{id: string, timestamp: number}[]>('view_history', []) || [];
    
    // Retirer l'élément s'il existe déjà
    const existingIndex = viewHistory.findIndex(item => item.id === this.id);
    if (existingIndex !== -1) {
      viewHistory.splice(existingIndex, 1);
    }
    
    // Ajouter l'élément au début de l'historique
    viewHistory.unshift({
      id: this.id,
      timestamp: Date.now()
    });
    
    // Limiter la taille de l'historique à 20 éléments
    if (viewHistory.length > 20) {
      viewHistory.pop();
    }
    
    // Sauvegarder l'historique mis à jour
    this.localStorageService.set('view_history', viewHistory);
  }
  
  private formatSpaceType(type: SpaceType): string {
    switch(type) {
      case SpaceType.ROOM:
        return 'Chambre';
      case SpaceType.RESTAURANT:
        return 'Restaurant';
      case SpaceType.BAR:
        return 'Bar';
      case SpaceType.EVENT_SPACE:
        return 'Événementiel';
      default:
        return type;
    }
  }
}