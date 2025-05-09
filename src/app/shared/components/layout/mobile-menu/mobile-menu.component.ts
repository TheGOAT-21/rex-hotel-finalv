// mobile-menu.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface MobileMenuItem {
  path: string;
  label: string;
  icon?: string;
  exact?: boolean;
}

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Mobile Menu Backdrop -->
    <div 
      *ngIf="isOpen"
      class="fixed inset-0 bg-background bg-opacity-80 z-40 transition-opacity duration-300"
      (click)="close()"
    ></div>
    
    <!-- Mobile Menu Sidebar -->
    <div 
      class="fixed top-0 bottom-0 right-0 w-4/5 max-w-xs bg-background-alt z-50 shadow-lg transform transition-transform duration-300 ease-in-out"
      [ngClass]="isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- Menu Header -->
      <div class="flex items-center justify-between p-4 border-b border-dark-300">
        <div class="text-primary font-title text-xl">REX HOTEL</div>
        <button 
          class="text-text hover:text-primary transition-colors"
          (click)="close()"
          aria-label="Close menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Menu Items -->
      <nav class="py-4">
        <ul>
          <li *ngFor="let item of menuItems">
            <a 
              [routerLink]="item.path" 
              routerLinkActive="text-primary bg-dark-200" 
              [routerLinkActiveOptions]="{exact: item.exact ?? false}"
              class="flex items-center py-3 px-6 text-text hover:text-primary transition-colors"
              (click)="close()"
            >
              <!-- Item Icon (if provided) -->
              <span *ngIf="item.icon" class="mr-3">
                <i [class]="item.icon"></i>
              </span>
              
              <!-- Item Label -->
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>
      
      <!-- Book Now Button -->
      <div *ngIf="showBookNow" class="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-300">
        <a 
          [routerLink]="bookingPath" 
          class="block w-full bg-primary text-background text-center py-2 rounded font-bold uppercase hover:bg-primary-hover transition-colors"
          (click)="close()"
        >
          Réserver
        </a>
      </div>
    </div>
  `
})
export class MobileMenuComponent {
  @Input() isOpen = false;
  @Input() menuItems: MobileMenuItem[] = [
    { path: '/', label: 'Accueil', exact: true },
    { path: '/spaces', label: 'Espaces' },
    { path: '/contact', label: 'Contact' }
  ];
  @Input() showBookNow = true;
  @Input() bookingPath = '/booking';
  
  @Output() menuClosed = new EventEmitter<void>();
  
  close(): void {
    this.menuClosed.emit();
  }
}