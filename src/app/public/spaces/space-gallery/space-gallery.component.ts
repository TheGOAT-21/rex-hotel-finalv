// src/app/public/spaces/space-gallery/space-gallery.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
  caption?: string;
}

@Component({
  selector: 'app-space-gallery',
  standalone: true,
  imports: [CommonModule],
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
export class SpaceGalleryComponent implements OnInit {
  @Input() images: GalleryImage[] = [];
  @Input() enableFullscreen: boolean = true;
  
  selectedImage: GalleryImage | null = null;
  isFullscreen: boolean = false;
  
  ngOnInit() {
    if (this.images.length === 0) {
      // Add mock images for development
      this.images = this.getMockImages();
    }
    
    // Find primary image or use the first one
    const primaryImage = this.images.find(img => img.isPrimary);
    this.selectedImage = primaryImage || (this.images.length > 0 ? this.images[0] : null);
  }
  
  selectImage(id: string) {
    const image = this.images.find(img => img.id === id);
    if (image) {
      this.selectedImage = image;
    }
  }
  
  nextImage() {
    if (!this.selectedImage || this.images.length <= 1) return;
    
    const currentIndex = this.images.findIndex(img => img.id === this.selectedImage?.id);
    const nextIndex = (currentIndex + 1) % this.images.length;
    this.selectedImage = this.images[nextIndex];
  }
  
  previousImage() {
    if (!this.selectedImage || this.images.length <= 1) return;
    
    const currentIndex = this.images.findIndex(img => img.id === this.selectedImage?.id);
    const prevIndex = (currentIndex - 1 + this.images.length) % this.images.length;
    this.selectedImage = this.images[prevIndex];
  }
  
  openFullscreen() {
    this.isFullscreen = true;
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }
  
  closeFullscreen() {
    this.isFullscreen = false;
    // Restore scrolling
    document.body.style.overflow = '';
  }
  
  private getMockImages(): GalleryImage[] {
    // Mock data for development
    return [
      {
        id: '1',
        url: 'assets/images/rooms/deluxe-suite.jpg',
        alt: 'Vue principale de la Suite Deluxe',
        isPrimary: true,
        caption: 'Notre Suite Deluxe avec balcon privé et vue panoramique'
      },
      {
        id: '2',
        url: 'assets/images/rooms/bathroom.jpg',
        alt: 'Salle de bain de la Suite Deluxe',
        caption: 'Salle de bain en marbre avec douche à effet pluie'
      },
      {
        id: '3',
        url: 'assets/images/rooms/balcony.jpg',
        alt: 'Balcon de la Suite Deluxe',
        caption: 'Balcon privé avec vue sur la ville'
      },
      {
        id: '4',
        url: 'assets/images/rooms/living-area.jpg',
        alt: 'Espace salon de la Suite Deluxe',
        caption: 'Espace salon confortable et élégant'
      },
      {
        id: '5',
        url: 'assets/images/rooms/bedroom.jpg',
        alt: 'Chambre de la Suite Deluxe',
        caption: 'Chambre avec lit king-size et draps de luxe'
      }
    ];
  }
}