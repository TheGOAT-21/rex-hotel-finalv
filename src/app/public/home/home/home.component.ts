// src/app/public/home/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroComponent } from '../hero/hero.component';
import { FeatureShowcaseComponent } from '../feature-showcase/feature-showcase.component';
import { ImageWithOverlayComponent } from '../../../shared/components/content/image-with-overlay/image-with-overlay.component';
import { TestimonialComponent } from '../../../shared/components/content/testimonial/testimonial.component';
import { SectionTitleComponent } from '../../../shared/components/content/section-title/section-title.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { SpaceCardComponent } from '../../spaces/space-card/space-card.component';
import { PromotionComponent } from '../../../shared/components/content/promotion/promotion.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    HeroComponent,
    FeatureShowcaseComponent,
    ImageWithOverlayComponent,
    TestimonialComponent,
    SectionTitleComponent,
    CardComponent,
    ButtonComponent,
    SpaceCardComponent,
    PromotionComponent
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
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <!-- Chambre Classique -->
          <app-space-card
            id="chambre-classique"
            name="Chambre Classique"
            type="Chambre"
            description="Une chambre élégante avec lit double et toutes les commodités essentielles pour un séjour confortable."
            imageUrl="assets/images/rooms/classic-room.png"
            price="150"
            priceUnit="FCFA / nuit"
            buttonText="Réserver"
            [available]="true"
            [features]="[
              { name: 'Wifi gratuit', icon: 'wifi' },
              { name: 'Climatisation', icon: 'air-conditioner' },
              { name: 'TV écran plat', icon: 'tv' }
            ]"
            detailPath="/spaces/chambre-classique"
          ></app-space-card>
          
          <!-- Suite Deluxe -->
          <app-space-card
            id="suite-deluxe"
            name="Suite Deluxe"
            type="Suite"
            description="Une suite spacieuse avec vue panoramique, salon séparé et lit king-size pour un séjour de luxe."
            imageUrl="assets/images/rooms/deluxe1.png"
            price="280"
            priceUnit="FCFA / nuit"
            buttonText="Réserver"
            [available]="true"
            [features]="[
              { name: 'Balcon privé', icon: 'balcony' },
              { name: 'Minibar premium', icon: 'fridge' },
              { name: 'Salle de bain luxueuse', icon: 'shower' }
            ]"
            detailPath="/spaces/suite-deluxe"
          ></app-space-card>
          
          <!-- Penthouse -->
          <app-space-card
            id="penthouse"
            name="Penthouse"
            type="Suite Executive"
            description="Notre suite exclusive au dernier étage offrant une vue imprenable sur la ville et des services personnalisés."
            imageUrl="assets/images/rooms/penthouse1.png"
            price="750"
            priceUnit="FCFA / nuit"
            buttonText="Réserver"
            [available]="true"
            badge="EXCLUSIF"
            [features]="[
              { name: 'Terrasse privée', icon: 'terrace' },
              { name: 'Service majordome', icon: 'butler' },
              { name: 'Jacuzzi privé', icon: 'jacuzzi' }
            ]"
            detailPath="/spaces/penthouse"
          ></app-space-card>
        </div>
        
        <div class="text-center mt-12">
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
    
    <!-- Newsletter (Optional) -->
    <section class="py-16 bg-background">
      <div class="container mx-auto px-4 max-w-2xl">
        <div class="text-center mb-8">
          <h2 class="text-2xl md:text-3xl font-title font-bold text-primary mb-3">Restez informé</h2>
          <p class="text-text">Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives et actualités</p>
        </div>
        
        <form class="flex flex-col md:flex-row gap-4">
          <input 
            type="email" 
            placeholder="Votre adresse email" 
            class="flex-1 px-4 py-3 bg-dark-200 border border-dark-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            required
          />
          <button 
            type="submit" 
            class="bg-primary text-background font-bold uppercase px-6 py-3 rounded hover:bg-primary-hover transition-colors"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </section>
  `,
  styles: []
})
export class HomeComponent {
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

  // Helper function to convert string to Date
  convertStringToDate(dateString: string): Date {
    return new Date(dateString);
  }
}