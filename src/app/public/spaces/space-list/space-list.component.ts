// src/app/public/spaces/space-list/space-list.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpaceCardComponent } from '../space-card/space-card.component';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { SectionTitleComponent } from '../../../shared/components/content/section-title/section-title.component';
import { SpaceType } from '../../../core/interfaces/space.interface';

interface Space {
  id: string;
  name: string;
  type: string;
  description: string;
  images: any[];
  features: any[];
  price?: number;
  priceUnit?: string;
  available: boolean;
  badge?: string;
}

@Component({
  selector: 'app-space-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SpaceCardComponent,
    PaginationComponent,
    SectionTitleComponent
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Section Title -->
      <app-section-title
        [title]="title"
        [subtitle]="subtitle"
        [centered]="true"
      ></app-section-title>
      
      <!-- Filter Tabs -->
      <div class="flex flex-wrap gap-2 mb-8 justify-center" *ngIf="showFilters">
        <button 
          *ngFor="let filter of typeFilters" 
          (click)="filterByType(filter.type)"
          class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          [ngClass]="filter.type === activeFilter ? 
            'bg-primary text-background' : 
            'bg-background-alt hover:bg-primary hover:bg-opacity-10 text-text'"
        >
          {{ filter.label }}
        </button>
      </div>
      
      <!-- Empty State -->
      <div *ngIf="filteredSpaces.length === 0" class="py-12 text-center">
        <div class="text-primary opacity-30 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-text mb-2">Aucun espace trouvé</h3>
        <p class="text-text opacity-70 mb-6">Aucun espace ne correspond à vos critères.</p>
      </div>
      
      <!-- Spaces Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <app-space-card
          *ngFor="let space of paginatedSpaces"
          [id]="space.id"
          [name]="space.name"
          [type]="space.type"
          [description]="space.description"
          [imageUrl]="getMainImageUrl(space)"
          [price]="space.price || 0"
          [priceUnit]="space.priceUnit || ''"
          [buttonText]="'Voir détails'"
          [available]="space.available"
          [badge]="space.badge || ''"
          [features]="space.features.slice(0, 3)"
          [detailPath]="'/spaces/' + space.id"
          (cardClick)="onSpaceCardClick(space.id)"
          (buttonClick)="onSpaceButtonClick($event)"
        ></app-space-card>
      </div>
      
      <!-- Pagination -->
      <div *ngIf="filteredSpaces.length > itemsPerPage" class="mt-12">
        <app-pagination
          [currentPage]="currentPage"
          [totalPages]="totalPages"
          (pageChange)="onPageChange($event)"
        ></app-pagination>
      </div>
    </div>
  `
})
export class SpaceListComponent implements OnInit {
  @Input() spaces: Space[] = [];
  @Input() title: string = 'Nos Espaces';
  @Input() subtitle: string = 'Découvrez nos chambres, suites et espaces événementiels';
  @Input() showFilters: boolean = true;
  @Input() itemsPerPage: number = 6;
  
  typeFilters = [
    { type: '', label: 'Tous' },
    { type: 'Chambre', label: 'Chambres' },
    { type: 'Suite', label: 'Suites' },
    { type: 'Restaurant', label: 'Restaurants' },
    { type: 'Événementiel', label: 'Événementiel' }
  ];
  
  activeFilter: string = '';
  currentPage: number = 1;
  filteredSpaces: Space[] = [];
  
  ngOnInit(): void {
    // Initialize with mock data if no spaces are provided
    if (this.spaces.length === 0) {
      this.spaces = this.getMockSpaces();
    }
    this.filterSpaces();
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredSpaces.length / this.itemsPerPage);
  }
  
  get paginatedSpaces(): Space[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredSpaces.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  filterByType(type: string): void {
    this.activeFilter = type;
    this.currentPage = 1;
    this.filterSpaces();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  onSpaceCardClick(id: string): void {
    // Handle navigation if needed (already handled by routerLink)
    console.log(`Space clicked: ${id}`);
  }
  
  onSpaceButtonClick(event: { id: string; event: MouseEvent }): void {
    // Handle button click if needed
    console.log(`Button clicked for space: ${event.id}`);
  }
  
  getMainImageUrl(space: Space): string {
    if (space.images && space.images.length > 0) {
      const primaryImage = space.images.find(img => img.isPrimary);
      return primaryImage ? primaryImage.url : space.images[0].url;
    }
    // Fallback image
    return `assets/images/rooms/${space.type.toLowerCase()}-default.jpg`;
  }
  
  private filterSpaces(): void {
    if (!this.activeFilter) {
      this.filteredSpaces = [...this.spaces];
      return;
    }
    
    this.filteredSpaces = this.spaces.filter(space => 
      space.type === this.activeFilter
    );
  }
  
  private getMockSpaces(): Space[] {
    // Mock data for development
    return [
      {
        id: 'chambre-classique',
        name: 'Chambre Classique',
        type: 'Chambre',
        description: 'Une chambre élégante avec lit double et toutes les commodités essentielles pour un séjour confortable.',
        images: [{ url: 'assets/images/rooms/classic-room.jpg', isPrimary: true }],
        price: 150,
        priceUnit: '€ / nuit',
        available: true,
        features: [
          { name: 'Wifi gratuit', icon: 'wifi' },
          { name: 'Climatisation', icon: 'air-conditioner' },
          { name: 'TV écran plat', icon: 'tv' }
        ]
      },
      {
        id: 'suite-deluxe',
        name: 'Suite Deluxe',
        type: 'Suite',
        description: 'Une suite avec balcon privé offrant une vue imprenable sur la ville et un espace salon séparé.',
        images: [{ url: 'assets/images/rooms/deluxe-suite.jpg', isPrimary: true }],
        price: 280,
        priceUnit: '€ / nuit',
        available: true,
        features: [
          { name: 'Balcon privé', icon: 'balcony' },
          { name: 'Salon séparé', icon: 'sofa' },
          { name: 'Douche à effet pluie', icon: 'shower' }
        ]
      },
      {
        id: 'penthouse',
        name: 'Penthouse',
        type: 'Suite',
        description: 'Notre suite exclusive au dernier étage avec terrasse privée et service de majordome.',
        images: [{ url: 'assets/images/rooms/penthouse.jpg', isPrimary: true }],
        price: 750,
        priceUnit: '€ / nuit',
        available: true,
        badge: 'EXCLUSIF',
        features: [
          { name: 'Terrasse privée', icon: 'terrace' },
          { name: 'Service majordome', icon: 'butler' },
          { name: 'Jacuzzi privé', icon: 'jacuzzi' }
        ]
      }
    ];
  }
}