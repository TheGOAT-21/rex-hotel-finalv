// carousel.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CarouselItem {
  imageUrl: string;
  imageAlt: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative overflow-hidden rounded-lg">
      <!-- Main Carousel Container -->
      <div class="relative h-96 md:h-112">
        <!-- Carousel Items -->
        <div 
          *ngFor="let item of items; let i = index" 
          class="absolute inset-0 transition-all duration-700 ease-in-out transform"
          [ngClass]="{
            'opacity-100 translate-x-0': i === currentIndex,
            'opacity-0 translate-x-full': i > currentIndex,
            'opacity-0 -translate-x-full': i < currentIndex
          }"
        >
          <!-- Image -->
          <img 
            [src]="item.imageUrl" 
            [alt]="item.imageAlt" 
            class="w-full h-full object-cover"
          >
          
          <!-- Overlay -->
          <div class="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-70"></div>
          
          <!-- Content -->
          <div class="absolute bottom-0 left-0 right-0 p-6 text-text">
            <h3 *ngIf="item.title" class="text-2xl md:text-3xl font-title font-bold text-primary mb-2">{{ item.title }}</h3>
            <p *ngIf="item.subtitle" class="text-lg mb-4">{{ item.subtitle }}</p>
            <a 
              *ngIf="item.buttonText" 
              [href]="item.buttonLink || '/'"
              class="inline-block bg-primary text-background font-bold uppercase px-4 py-2 rounded hover:bg-primary-hover transition-colors"
            >
              {{ item.buttonText }}
            </a>
          </div>
        </div>
      </div>
      
      <!-- Navigation Arrows -->
      <button 
        *ngIf="showControls && items.length > 1"
        (click)="prev()" 
        class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background bg-opacity-50 text-primary hover:bg-opacity-75 rounded-full p-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Previous slide"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <button 
        *ngIf="showControls && items.length > 1"
        (click)="next()" 
        class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background bg-opacity-50 text-primary hover:bg-opacity-75 rounded-full p-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Next slide"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      
      <!-- Indicators -->
      <div 
        *ngIf="showIndicators && items.length > 1"
        class="absolute bottom-4 left-0 right-0 flex justify-center gap-2"
      >
        <button 
          *ngFor="let _ of items; let i = index" 
          (click)="goToSlide(i)"
          class="w-3 h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          [ngClass]="i === currentIndex ? 'bg-primary' : 'bg-text bg-opacity-30 hover:bg-opacity-50'"
          [attr.aria-label]="'Go to slide ' + (i + 1)"
        ></button>
      </div>
    </div>
  `
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() items: CarouselItem[] = [];
  @Input() showControls = true;
  @Input() showIndicators = true;
  @Input() autoPlay = true;
  @Input() interval = 5000; // milliseconds
  
  currentIndex = 0;
  private autoPlayInterval: any;
  
  ngOnInit(): void {
    if (this.autoPlay && this.items.length > 1) {
      this.startAutoPlay();
    }
  }
  
  ngOnDestroy(): void {
    this.stopAutoPlay();
  }
  
  prev(): void {
    this.currentIndex = this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1;
    this.resetAutoPlay();
  }
  
  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.resetAutoPlay();
  }
  
  goToSlide(index: number): void {
    this.currentIndex = index;
    this.resetAutoPlay();
  }
  
  private startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, this.interval);
  }
  
  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }
  
  private resetAutoPlay(): void {
    if (this.autoPlay) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }
}