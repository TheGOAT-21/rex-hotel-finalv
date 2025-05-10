// src/app/public/spaces/space-gallery/space-gallery.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

// Services
import { SpaceService } from '../../../core/services/space.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';

// Interfaces
import { Image } from '../../../core/interfaces/space.interface';

@Component({
  selector: 'app-space-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-gallery">
      <!-- Main Image Display -->
      <div 
        *ngIf="selectedImage"
        class="relative mb-4 rounded-lg overflow-hidden bg-background-alt"
      >
        <img 
          [src]="selectedImage.url" 
          [alt]="selectedImage.alt" 
          class="w-full h-64 md:h-96 object-cover transition-transform duration-500"
          [ngClass]="{'hover:scale-105': !isFullscreen}"
          (click)="enableFullscreen && openFullscreen()"
        >
        
        <!-- Navigation Arrows (only if more than 1 image) -->
        <div *ngIf="images.length > 1" class="absolute inset-0 flex items-center justify-between px-4">
          <button 
            (click)="previousImage()"
            class="bg-background bg-opacity-50 hover:bg-opacity-70 text-primary rounded-full p-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Image précédente"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button 
            (click)="nextImage()"
            class="bg-background bg-opacity-50 hover:bg-opacity-70 text-primary rounded-full p-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Image suivante"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
        
        <!-- Caption (if available) -->
        <div 
          *ngIf="selectedImage.caption"
          class="absolute bottom-0 left-0 right-0 p-3 bg-background bg-opacity-70 text-text text-sm"
        >
          {{ selectedImage.caption }}
        </div>
        
        <!-- Fullscreen Button -->
        <button 
          *ngIf="enableFullscreen && !isFullscreen"
          (click)="openFullscreen()"
          class="absolute top-2 right-2 bg-background bg-opacity-50 hover:bg-opacity-70 text-primary rounded-full p-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Vue plein écran"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path>
          </svg>
        </button>
        
        <!-- Add to Favorites Button -->
        <button 
          *ngIf="!isFullscreen && spaceId"
          (click)="toggleFavorite()"
          class="absolute top-2 left-2 bg-background bg-opacity-50 hover:bg-opacity-70 text-primary rounded-full p-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Ajouter aux favoris"
        >
          <svg class="w-5 h-5" fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>
      
      <!-- Loading Indicator -->
      <div *ngIf="isLoading" class="flex justify-center items-center h-64 md:h-96 bg-background-alt rounded-lg">
        <div class="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
      
      <!-- Thumbnails Grid -->
      <div class="grid grid-cols-4 sm:grid-cols-5 gap-2">
        <div 
          *ngFor="let image of images" 
          (click)="selectImage(image.id)"
          class="cursor-pointer rounded-lg overflow-hidden aspect-square relative group"
          [ngClass]="{'ring-2 ring-primary': selectedImage?.id === image.id}"
        >
          <img 
            [src]="image.url" 
            [alt]="image.alt" 
            class="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
          >
          <div 
            class="absolute inset-0 bg-primary bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"
          ></div>
        </div>
      </div>
      
      <!-- Full Screen Modal -->
      <div 
        *ngIf="isFullscreen"
        class="fixed inset-0 z-50 bg-background bg-opacity-95 flex flex-col"
      >
        <div class="flex justify-end p-4">
          <button 
            (click)="closeFullscreen()"
            class="text-text hover:text-primary transition-colors"
            aria-label="Fermer le plein écran"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="flex-1 flex items-center justify-center p-4">
          <div class="relative max-h-full max-w-full">
            <img 
              *ngIf="selectedImage"
              [src]="selectedImage.url" 
              [alt]="selectedImage.alt" 
              class="max-h-full max-w-full object-contain rounded-lg"
            >
          </div>
        </div>
        
        <div class="p-4 flex justify-between items-center">
          <button 
            (click)="previousImage()"
            class="text-text hover:text-primary transition-colors"
            aria-label="Image précédente"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <div *ngIf="selectedImage?.caption" class="text-text text-sm text-center px-4">
            {{ selectedImage?.caption }}
          </div>
          
          <button 
            (click)="nextImage()"
            class="text-text hover:text-primary transition-colors"
            aria-label="Image suivante"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class SpaceGalleryComponent implements OnInit, OnDestroy {
  @Input() images: Image[] = [];
  @Input() enableFullscreen = true;
  @Input() spaceId?: string;
  @Input() autoLoad = true;
  
  selectedImage: Image | null = null;
  isFullscreen = false;
  isLoading = false;
  isFavorite = false;
  
  private subscription?: Subscription;
  private readonly FAVORITES_KEY = 'user_favorites';
  
  constructor(
    private spaceService: SpaceService,
    private notificationService: NotificationService,
    private storageService: LocalStorageService,
    private router: Router
  ) {}
  
  ngOnInit() {
    // Vérifier si l'espace est dans les favoris
    this.checkFavoriteStatus();
    
    // Si aucune image n'est fournie et que l'autoLoad est activé, charger les images
    if (this.images.length === 0 && this.spaceId && this.autoLoad) {
      this.loadSpaceImages();
    } else if (this.images.length > 0) {
      // Initialiser avec l'image primaire ou la première image
      this.initializeSelectedImage();
    }
    
    // Sauvegarder la dernière galerie visitée dans le localStorage
    if (this.spaceId) {
      this.storageService.set('last_viewed_space', this.spaceId);
    }
  }
  
  ngOnDestroy() {
    // Nettoyer les abonnements
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  loadSpaceImages() {
    if (!this.spaceId) return;
    
    this.isLoading = true;
    
    this.subscription = this.spaceService.getSpaceById(this.spaceId).subscribe(
      space => {
        if (space) {
          this.images = space.images || [];
          this.initializeSelectedImage();
        }
        this.isLoading = false;
      },
      error => {
        console.error('Erreur lors du chargement des images:', error);
        this.notificationService.showError('Impossible de charger les images. Veuillez réessayer plus tard.');
        this.isLoading = false;
      }
    );
  }
  
  initializeSelectedImage() {
    if (this.images.length === 0) return;
    
    // Trouver l'image primaire ou utiliser la première image
    const primaryImage = this.images.find(img => img.isPrimary);
    this.selectedImage = primaryImage || this.images[0];
    
    // Sauvegarder l'état de la galerie
    this.saveGalleryState();
  }
  
  selectImage(id: string) {
    const image = this.images.find(img => img.id === id);
    if (image) {
      this.selectedImage = image;
      this.saveGalleryState();
      
      if (this.enableFullscreen && !this.isFullscreen) {
        this.openFullscreen();
      }
    }
  }
  
  nextImage() {
    if (!this.selectedImage || this.images.length <= 1) return;
    
    const currentIndex = this.images.findIndex(img => img.id === this.selectedImage?.id);
    const nextIndex = (currentIndex + 1) % this.images.length;
    this.selectedImage = this.images[nextIndex];
    this.saveGalleryState();
  }
  
  previousImage() {
    if (!this.selectedImage || this.images.length <= 1) return;
    
    const currentIndex = this.images.findIndex(img => img.id === this.selectedImage?.id);
    const prevIndex = (currentIndex - 1 + this.images.length) % this.images.length;
    this.selectedImage = this.images[prevIndex];
    this.saveGalleryState();
  }
  
  openFullscreen() {
    this.isFullscreen = true;
    // Empêcher le défilement lorsque le mode plein écran est actif
    document.body.style.overflow = 'hidden';
  }
  
  closeFullscreen() {
    this.isFullscreen = false;
    // Restaurer le défilement
    document.body.style.overflow = '';
  }
  
  toggleFavorite() {
    if (!this.spaceId) return;
    
    const favorites = this.getFavorites();
    
    if (this.isFavorite) {
      // Retirer des favoris
      const index = favorites.indexOf(this.spaceId);
      if (index !== -1) {
        favorites.splice(index, 1);
        this.storageService.set(this.FAVORITES_KEY, favorites);
        this.isFavorite = false;
        this.notificationService.showInfo('Retiré des favoris');
      }
    } else {
      // Ajouter aux favoris
      if (!favorites.includes(this.spaceId)) {
        favorites.push(this.spaceId);
        this.storageService.set(this.FAVORITES_KEY, favorites);
        this.isFavorite = true;
        this.notificationService.showSuccess('Ajouté aux favoris');
      }
    }
  }
  
  shareImage() {
    if (!this.selectedImage) return;
    
    // Créer une URL de partage
    const shareUrl = `${window.location.origin}/spaces/${this.spaceId}?image=${this.selectedImage.id}`;
    
    // Essayer d'utiliser l'API de partage Web si disponible
    if (navigator.share) {
      navigator.share({
        title: this.selectedImage.alt || 'REX Hotel',
        text: this.selectedImage.caption || 'Découvrez REX Hotel',
        url: shareUrl
      }).catch(error => {
        console.error('Erreur lors du partage:', error);
        this.notificationService.showError('Impossible de partager l\'image');
      });
    } else {
      // Fallback: copier le lien dans le presse-papier
      navigator.clipboard.writeText(shareUrl).then(() => {
        this.notificationService.showSuccess('Lien copié dans le presse-papier');
      }).catch(error => {
        console.error('Erreur lors de la copie du lien:', error);
        this.notificationService.showError('Impossible de copier le lien');
      });
    }
  }
  
  // Méthodes privées
  
  private checkFavoriteStatus() {
    if (!this.spaceId) return;
    
    const favorites = this.getFavorites();
    this.isFavorite = favorites.includes(this.spaceId);
  }
  
  private getFavorites(): string[] {
    return this.storageService.get<string[]>(this.FAVORITES_KEY, []) ?? [];
  }
  
  private saveGalleryState() {
    if (!this.spaceId || !this.selectedImage) return;
    
    // Sauvegarder l'état actuel de la galerie pour restauration ultérieure
    this.storageService.set(`gallery_state_${this.spaceId}`, {
      selectedImageId: this.selectedImage.id,
      timestamp: Date.now()
    }, 3600); // expire après 1 heure
  }
}