// src/app/public/home/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeroComponent } from '../hero/hero.component';
import { FeatureShowcaseComponent } from '../feature-showcase/feature-showcase.component';
import { ImageWithOverlayComponent } from '../../../shared/components/content/image-with-overlay/image-with-overlay.component';
import { TestimonialComponent } from '../../../shared/components/content/testimonial/testimonial.component';
import { SectionTitleComponent } from '../../../shared/components/content/section-title/section-title.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { SpaceCardComponent } from '../../spaces/space-card/space-card.component';
import { PromotionComponent } from '../../../shared/components/content/promotion/promotion.component';
import { LoaderComponent } from '../../../shared/components/ui/loader/loader.component';
import { SpaceService } from '../../../core/services/space.service';
import { BookingService } from '../../../core/services/booking.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Space, SpaceType, RoomSpace } from '../../../core/interfaces/space.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    FormsModule,
    HeroComponent,
    FeatureShowcaseComponent,
    ImageWithOverlayComponent,
    TestimonialComponent,
    SectionTitleComponent,
    CardComponent,
    ButtonComponent,
    SpaceCardComponent,
    PromotionComponent,
    LoaderComponent
  ],
  template: `
    <!-- Hero Section -->
    <app-hero
      title="REX HOTEL"
      subtitle="Découvrez le luxe et le confort dans le cœur de Yamoussoukro, où chaque séjour devient une expérience inoubliable."
      [imageUrl]="'assets/images/exterior/hotel-exterior.png'"
      [videoUrl]="''"
      primaryButtonText="Réserver maintenant"
      primaryButtonLink="/booking"
      secondaryButtonText="Explorer nos espaces"
      secondaryButtonLink="/spaces"
      [fullHeight]="true"
      [showScrollIndicator]="true"
    ></app-hero>
    
    <!-- Feature Showcase -->
    <section class="py-16 bg-background">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-title font-bold text-primary mb-3">Bienvenue au REX Hotel</h2>
          <p class="text-text max-w-3xl mx-auto">Notre établissement haut de gamme offre une expérience incomparable de luxe et de confort au cœur de Yamoussoukro, alliant élégance architecturale et service personnalisé exceptionnel.</p>
        </div>
        
        <div class="flex flex-wrap -mx-4">
          <div class="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
            <div class="text-center">
              <div class="bg-primary bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-primary text-2xl font-bold">84</span>
              </div>
              <h3 class="text-xl font-bold text-primary mb-2">Chambres luxueuses</h3>
              <p class="text-text opacity-80">Des espaces élégants et confortables avec toutes les commodités modernes.</p>
            </div>
          </div>
          
          <div class="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
            <div class="text-center">
              <div class="bg-primary bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-primary text-2xl font-bold">3</span>
              </div>
              <h3 class="text-xl font-bold text-primary mb-2">Restaurants gastronomiques</h3>
              <p class="text-text opacity-80">Une expérience culinaire exceptionnelle avec une cuisine locale et internationale.</p>
            </div>
          </div>
          
          <div class="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
            <div class="text-center">
              <div class="bg-primary bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-primary text-2xl font-bold">8</span>
              </div>
              <h3 class="text-xl font-bold text-primary mb-2">Salles événementielles</h3>
              <p class="text-text opacity-80">Des espaces modernes et flexibles pour vos réunions et célébrations.</p>
            </div>
          </div>
          
          <div class="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
            <div class="text-center">
              <div class="bg-primary bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-primary text-2xl font-bold">5</span>
              </div>
              <h3 class="text-xl font-bold text-primary mb-2">Bars & Lounges</h3>
              <p class="text-text opacity-80">Des espaces élégants pour vous détendre et savourer des boissons raffinées.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Featured Spaces -->
    <section class="py-16 bg-background-alt">
      <div class="container mx-auto px-4">
        <app-section-title 
          title="Nos Espaces" 
          subtitle="Découvrez nos chambres et suites luxueuses, conçues pour un confort optimal"
          [centered]="true"
        ></app-section-title>
        
        <div *ngIf="isLoading" class="flex justify-center py-8">
          <app-loader [text]="'Chargement des espaces...'"></app-loader>
        </div>
        
        <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <app-space-card
            *ngFor="let space of featuredSpaces"
            [id]="space.id"
            [name]="space.name"
            [type]="getSpaceTypeName(space.type)"
            [description]="space.description"
            [imageUrl]="getMainImageUrl(space)"
            [price]="space.price || 0"
            [priceUnit]="space.price ? 'FCFA / nuit' : ''"
            buttonText="Réserver"
            [available]="space.available"
            [badge]="getBadge(space)"
            [features]="formatFeatures(space.features)"
            [detailPath]="'/spaces/' + space.id"
            (cardClick)="onSpaceCardClick(space.id)"
            (buttonClick)="onReservationClick($event)"
          ></app-space-card>
        </div>
        
        <div *ngIf="!isLoading" class="text-center mt-12">
          <a routerLink="/spaces" class="inline-block bg-primary text-background font-bold uppercase px-8 py-3 rounded hover:bg-primary-hover transition-colors">
            Voir tous nos espaces
          </a>
        </div>
      </div>
    </section>
    
    <!-- Promotion Section -->
    <app-promotion
      title="Offre Spéciale Weekend"
      description="Profitez de notre offre spéciale weekend avec 15% de réduction sur nos suites, petit-déjeuner inclus et accès privilégié à tous nos services premium."
      tagline="OFFRE LIMITÉE"
      buttonText="Réserver maintenant"
      buttonLink="/booking"
      backgroundImage="assets/images/rooms/conference.png"
      align="right"
      [fullWidth]="true"
      imageHeight="medium"
    ></app-promotion>
    
    <!-- Services Section -->
    <app-feature-showcase
      sectionTitle="Nos Services"
      sectionSubtitle="Découvrez nos prestations d'exception pour un séjour parfait"
      [features]="features"
      layout="grid"
    ></app-feature-showcase>
    
    <!-- Testimonials -->
    <section class="py-16 bg-background-alt">
      <div class="container mx-auto px-4">
        <app-section-title 
          title="Témoignages" 
          subtitle="Ce que nos clients disent de leur expérience au REX Hotel"
          [centered]="true"
        ></app-section-title>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <app-testimonial
            name="Jean Dupont"
            quote="Un service exceptionnel et une chambre magnifique. Le restaurant gastronomique est une véritable expérience culinaire à ne pas manquer."
            [rating]="5"
            [date]="convertStringToDate('2024-10-15')"
          ></app-testimonial>
          
          <app-testimonial
            name="Marie Koné"
            quote="Le REX Hotel allie parfaitement luxe et confort. Le personnel est attentionné et les installations sont impeccables. J'y retournerai sans hésiter."
            [rating]="4"
            [date]="convertStringToDate('2024-09-22')"
          ></app-testimonial>
          
          <app-testimonial
            name="Robert Smith"
            quote="Un havre de paix au cœur de Yamoussoukro. Les chambres sont spacieuses et le service est irréprochable. Une expérience 5 étoiles."
            [rating]="5"
            [date]="convertStringToDate('2024-10-05')"
          ></app-testimonial>
        </div>
      </div>
    </section>
    
    <!-- Newsletter -->
    <section class="py-16 bg-background">
      <div class="container mx-auto px-4 max-w-2xl">
        <div class="text-center mb-8">
          <h2 class="text-2xl md:text-3xl font-title font-bold text-primary mb-3">Restez informé</h2>
          <p class="text-text">Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives et actualités</p>
        </div>
        
        <form class="flex flex-col md:flex-row gap-4" (submit)="$event.preventDefault(); subscribeNewsletter()">
          <input 
            type="email" 
            placeholder="Votre adresse email" 
            [(ngModel)]="newsletterEmail"
            name="newsletterEmail"
            class="flex-1 px-4 py-3 bg-dark-200 border border-dark-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            required
          />
          <button 
            type="submit" 
            class="bg-primary text-background font-bold uppercase px-6 py-3 rounded hover:bg-primary-hover transition-colors"
            [disabled]="isNewsletterSubmitting"
          >
            <span *ngIf="!isNewsletterSubmitting">S'inscrire</span>
            <span *ngIf="isNewsletterSubmitting">Traitement...</span>
          </button>
        </form>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  features = [
    {
      title: 'WiFi Gratuit',
      description: "Connexion haut débit disponible dans tout l'établissement",
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
    },
    {
      title: 'Parkings Sécurisés',
      description: 'Espaces de stationnement extérieur et sous-sol surveillés',
      iconName: 'parking'
    },
    {
      title: 'Espace Enfants',
      description: 'Zone de loisirs dédiée aux enfants avec supervision',
      iconName: 'children'
    }
  ];

  featuredSpaces: Space[] = [];
  isLoading = true;
  
  // Newsletter form
  newsletterEmail = '';
  isNewsletterSubmitting = false;
  
  // User preferences
  hasShownWelcomeNotification = false;

  constructor(
    private spaceService: SpaceService,
    private bookingService: BookingService,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedSpaces();
    this.checkAndShowWelcomeNotification();
  }

  loadFeaturedSpaces(): void {
    this.isLoading = true;
    
    // Get a filtered selection of featured spaces
    this.spaceService.searchSpaces({
      available: true
    }).subscribe(
      spaces => {
        // Organize spaces by type and select featured ones
        const roomSpaces = spaces.filter(space => space.type === SpaceType.ROOM);
        const suiteSpaces = spaces.filter(space => 
          space.type === SpaceType.ROOM && 
          (space.name.toLowerCase().includes('suite') || space.name.toLowerCase().includes('penthouse'))
        );
        const eventSpaces = spaces.filter(space => space.type === SpaceType.EVENT_SPACE);
        
        // Ensure we have a mix of different types
        this.featuredSpaces = [];
        
        // Add a classic room
        const classicRoom = roomSpaces.find(s => s.name.toLowerCase().includes('classique'));
        if (classicRoom) this.featuredSpaces.push(classicRoom);
        
        // Add a suite
        const deluxeSuite = suiteSpaces.find(s => s.name.toLowerCase().includes('deluxe'));
        if (deluxeSuite) this.featuredSpaces.push(deluxeSuite);
        
        // Add a penthouse or premium room
        const penthouse = suiteSpaces.find(s => s.name.toLowerCase().includes('penthouse'));
        if (penthouse) this.featuredSpaces.push(penthouse);
        
        // If we don't have 3 spaces yet, add more from other categories
        if (this.featuredSpaces.length < 3) {
          const remaining = 3 - this.featuredSpaces.length;
          
          // Use other available rooms
          const otherRooms = roomSpaces.filter(r => 
            !this.featuredSpaces.some(fs => fs.id === r.id)
          ).slice(0, remaining);
          
          this.featuredSpaces.push(...otherRooms);
        }
        
        this.isLoading = false;
      },
      error => {
        console.error('Error loading featured spaces', error);
        this.isLoading = false;
        this.notificationService.showError(
          'Impossible de charger les espaces. Veuillez réessayer plus tard.',
          'Erreur'
        );
      }
    );
  }
  
  getMainImageUrl(space: Space): string {
    if (space.images && space.images.length > 0) {
      const primaryImage = space.images.find(img => img.isPrimary);
      return primaryImage ? primaryImage.url : space.images[0].url;
    }
    return 'assets/images/rooms/placeholder.jpg';
  }
  
  getSpaceTypeName(type: SpaceType): string {
    switch(type) {
      case SpaceType.ROOM: return 'Chambre';
      case SpaceType.RESTAURANT: return 'Restaurant';
      case SpaceType.BAR: return 'Bar';
      case SpaceType.EVENT_SPACE: return 'Espace événementiel';
      default: return 'Espace';
    }
  }
  
  getBadge(space: Space): string {
    if (space.name.toLowerCase().includes('penthouse')) {
      return 'EXCLUSIF';
    }
    
    if (space.price && space.price > 500) {
      return 'PREMIUM';
    }
    
    return '';
  }
  
  formatFeatures(features: any[]): { name: string, icon?: string }[] {
    return features.slice(0, 3).map(feature => ({
      name: feature.name,
      icon: feature.icon
    }));
  }
  
  onSpaceCardClick(spaceId: string): void {
    // Track click for analytics (could be implemented later)
    console.log(`Space clicked: ${spaceId}`);
  }
  
  onReservationClick(event: { id: string; event: MouseEvent }): void {
    event.event.preventDefault();
    event.event.stopPropagation();
    
    // Navigate to booking page with pre-selected space
    window.location.href = `/booking?spaceType=${encodeURIComponent(this.getSpaceTypeForId(event.id))}`;
  }
  
  getSpaceTypeForId(spaceId: string): string {
    const space = this.featuredSpaces.find(s => s.id === spaceId);
    if (!space) return 'room';
    
    if (space.name.toLowerCase().includes('suite')) return 'suite';
    if (space.name.toLowerCase().includes('penthouse')) return 'penthouse';
    if (space.type === SpaceType.EVENT_SPACE) return 'event_space';
    
    return 'room';
  }
  
  subscribeNewsletter(): void {
    if (!this.newsletterEmail || this.isNewsletterSubmitting) return;
    
    this.isNewsletterSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isNewsletterSubmitting = false;
      this.newsletterEmail = '';
      
      // Show success notification
      this.notificationService.showSuccess(
        'Vous êtes maintenant inscrit à notre newsletter!', 
        'Inscription réussie'
      );
      
      // Store subscription in local storage
      this.localStorageService.set('newsletter_subscribed', true);
    }, 1500);
  }
  
  checkAndShowWelcomeNotification(): void {
    // Check if user has already seen the welcome notification
    const hasShown = this.localStorageService.get('welcome_notification_shown', false);
    
    if (!hasShown) {
      // Show welcome notification after a short delay
      setTimeout(() => {
        this.notificationService.showInfo(
          'Bienvenue au REX Hotel! Découvrez nos offres spéciales actuelles.',
          'Bienvenue'
        );
        
        // Remember that we've shown the notification
        this.localStorageService.set('welcome_notification_shown', true);
      }, 2000);
    }
  }

  // Helper function to convert string to Date
  convertStringToDate(dateString: string): Date {
    return new Date(dateString);
  }
}