// hero.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section 
      class="relative hero-section"
      [ngClass]="{'h-screen': fullHeight, 'h-96 md:h-140': !fullHeight}"
    >
      <!-- Background Image or Video -->
      <div class="absolute inset-0 z-0">
        <ng-container *ngIf="videoUrl; else imageBackground">
          <video 
            autoplay 
            muted 
            loop 
            playsinline 
            class="w-full h-full object-cover"
          >
            <source [src]="videoUrl" type="video/mp4">
            <!-- Fallback background image if video fails to load -->
            <img [src]="imageUrl" [alt]="title" class="w-full h-full object-cover">
          </video>
        </ng-container>
        
        <ng-template #imageBackground>
          <img [src]="imageUrl" [alt]="title" class="w-full h-full object-cover">
        </ng-template>
        
        <!-- Dark Overlay pour meilleure lisibilité -->
        <div class="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background/90"></div>
      </div>
      
      <!-- Hero Content -->
      <div class="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
        <div class="animate-fadeIn">
          <div *ngIf="tagline" class="text-primary font-semibold text-xl mb-4 drop-shadow-lg">{{ tagline }}</div>
          
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-title font-bold text-primary mb-6 drop-shadow-lg">{{ title }}</h1>
          
          <p *ngIf="subtitle" class="text-white text-lg md:text-2xl max-w-3xl mx-auto mb-10 drop-shadow-lg font-light">{{ subtitle }}</p>
          
          <!-- CTA Buttons -->
          <div *ngIf="primaryButtonText || secondaryButtonText" class="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              *ngIf="primaryButtonText" 
              [routerLink]="primaryButtonLink || '/'" 
              class="bg-primary text-background font-bold uppercase px-8 py-4 rounded hover:bg-primary-hover transition-colors text-lg shadow-lg"
            >
              {{ primaryButtonText }}
            </a>
            
            <a 
              *ngIf="secondaryButtonText" 
              [routerLink]="secondaryButtonLink || '/'" 
              class="bg-background/20 backdrop-blur-sm text-white border-2 border-white font-bold uppercase px-8 py-4 rounded hover:bg-white/30 transition-colors text-lg shadow-lg"
            >
              {{ secondaryButtonText }}
            </a>
          </div>
          
          <!-- Optional Content Slot -->
          <div class="mt-10">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
      
      <!-- Scroll Indicator (only if fullHeight) -->
      <div *ngIf="fullHeight && showScrollIndicator" class="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
        <button 
          (click)="scrollDown()" 
          class="text-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-2 transition-colors bg-background/20 backdrop-blur-sm"
          aria-label="Scroll down"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </button>
      </div>
    </section>
  `,
  styles: [`
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fadeIn {
      animation: fadeIn 1s ease-out;
    }
  `]
})
export class HeroComponent {
  @Input() title = 'REX HOTEL';
  @Input() subtitle = '';
  @Input() tagline = 'ÉLÉGANCE & CONFORT';
  @Input() imageUrl = '';
  @Input() videoUrl = '';
  @Input() primaryButtonText = '';
  @Input() primaryButtonLink = '';
  @Input() secondaryButtonText = '';
  @Input() secondaryButtonLink = '';
  @Input() fullHeight = true;
  @Input() showScrollIndicator = true;
  
  scrollDown() {
    // Smooth scroll to the next section
    const heroHeight = document.querySelector('.hero-section')?.clientHeight || 0;
    window.scrollTo({
      top: heroHeight,
      behavior: 'smooth'
    });
  }
}