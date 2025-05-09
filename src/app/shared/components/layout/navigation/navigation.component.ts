// navigation.component.ts
import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MobileMenuComponent } from '../mobile-menu/mobile-menu.component';

export interface NavItem {
  path: string;
  label: string;
  exact?: boolean;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, MobileMenuComponent],
  template: `
    <header 
      class="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      [ngClass]="[
        scrolled || isMobileMenuOpen ? 'bg-background shadow-md' : 'bg-transparent',
        scrolled ? 'py-2' : 'py-4'
      ]"
    >
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex justify-between items-center">
          <!-- Logo -->
          <a routerLink="/" class="text-primary font-title text-2xl z-50">
            REX HOTEL
          </a>
          
          <!-- Navigation: Desktop -->
          <nav class="hidden md:flex items-center space-x-8">
            <a *ngFor="let item of navItems" 
              [routerLink]="item.path" 
              routerLinkActive="text-primary border-b-2 border-primary" 
              [routerLinkActiveOptions]="{exact: item.exact ?? false}"
              class="font-body font-semibold text-text hover:text-primary transition-colors py-2"
            >
              {{ item.label }}
            </a>
            
            <a *ngIf="showBookNow" 
              [routerLink]="bookingPath" 
              class="bg-primary text-background px-4 py-2 rounded font-bold uppercase hover:bg-primary-hover transition-colors"
            >
              Réserver
            </a>
          </nav>
          
          <!-- Mobile Menu Button -->
          <button 
            (click)="toggleMobileMenu()"
            class="md:hidden text-text hover:text-primary z-50"
            aria-label="Toggle mobile menu"
          >
            <svg *ngIf="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <svg *ngIf="isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
    
    <!-- Mobile Menu -->
    <app-mobile-menu 
      [isOpen]="isMobileMenuOpen" 
      [menuItems]="navItems"
      [showBookNow]="showBookNow"
      [bookingPath]="bookingPath"
      (menuClosed)="isMobileMenuOpen = false"
    ></app-mobile-menu>
    
    <!-- Spacer to prevent content from being hidden behind fixed header -->
    <div [ngClass]="{'h-16': scrolled, 'h-20': !scrolled}"></div>
  `
})
export class NavigationComponent {
  @Input() navItems: NavItem[] = [
    { path: '/', label: 'Accueil', exact: true },
    { path: '/spaces', label: 'Espaces' },
    { path: '/contact', label: 'Contact' }
  ];
  @Input() showBookNow = true;
  @Input() bookingPath = '/booking';
  @Input() transparentOnTop = true;
  
  scrolled = false;
  isMobileMenuOpen = false;
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.pageYOffset > 50;
  }
  
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    // Prevent scrolling when mobile menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}