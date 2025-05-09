// header.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-background shadow-md py-4 sticky top-0 z-40">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex justify-between items-center">
          <!-- Logo -->
          <a routerLink="/" class="text-primary font-title text-2xl">
            REX HOTEL
          </a>
          
          <!-- Navigation: Desktop -->
          <nav class="hidden md:flex items-center space-x-8">
            <a *ngFor="let item of navItems" 
              [routerLink]="item.path" 
              routerLinkActive="text-primary border-b-2 border-primary" 
              [routerLinkActiveOptions]="{exact: item.exact ?? false}"
              class="font-body font-semibold text-text hover:text-primary transition-colors py-2">
              {{ item.label }}
            </a>
            
            <a *ngIf="showBookNow" 
              [routerLink]="bookingPath" 
              class="bg-primary text-background px-4 py-2 rounded font-bold uppercase hover:bg-primary-hover transition-colors">
              Réserver
            </a>
          </nav>
          
          <!-- Mobile Menu Button -->
          <button 
            (click)="toggleMobileMenu()"
            class="md:hidden text-text hover:text-primary">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        
        <!-- Mobile Menu -->
        <div *ngIf="isMobileMenuOpen" class="md:hidden mt-4 py-4 border-t border-dark-300">
          <nav class="flex flex-col space-y-4">
            <a *ngFor="let item of navItems" 
              [routerLink]="item.path" 
              routerLinkActive="text-primary" 
              [routerLinkActiveOptions]="{exact: item.exact ?? false}"
              class="font-body font-semibold text-text hover:text-primary transition-colors py-2"
              (click)="isMobileMenuOpen = false">
              {{ item.label }}
            </a>
            
            <a *ngIf="showBookNow" 
              [routerLink]="bookingPath" 
              class="bg-primary text-background px-4 py-2 rounded font-bold uppercase hover:bg-primary-hover transition-colors text-center"
              (click)="isMobileMenuOpen = false">
              Réserver
            </a>
          </nav>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Input() navItems: { path: string; label: string; exact?: boolean }[] = [
    { path: '/', label: 'Accueil', exact: true },
    { path: '/spaces', label: 'Espaces' },
    { path: '/contact', label: 'Contact' }
  ];
  @Input() showBookNow = true;
  @Input() bookingPath = '/booking';
  
  isMobileMenuOpen = false;
  
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}