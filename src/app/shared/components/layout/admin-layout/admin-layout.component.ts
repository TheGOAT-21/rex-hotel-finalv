// admin-layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminSidebarComponent],
  template: `
    <div class="min-h-screen bg-background text-text flex">
      <app-admin-sidebar [collapsed]="sidebarCollapsed"></app-admin-sidebar>
      
      <div class="flex-1 min-w-0 transition-all duration-300" 
           [ngClass]="sidebarCollapsed ? 'ml-20' : 'ml-64'">
        <header class="bg-background-alt shadow-md h-16 flex items-center px-4 sticky top-0 z-40">
          <button class="p-1 mr-4 text-text hover:text-primary transition-colors" (click)="toggleSidebar()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path *ngIf="!sidebarCollapsed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path *ngIf="sidebarCollapsed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
            </svg>
          </button>
          
          <h1 class="text-xl font-semibold">{{ pageTitle }}</h1>
          
          <div class="ml-auto">
            <div class="flex items-center">
              <div class="mr-4 text-text">
                Admin
              </div>
              <div class="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-background font-bold">
                A
              </div>
            </div>
          </div>
        </header>
        
        <main class="p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
  sidebarCollapsed = false;
  pageTitle = 'Dashboard'; // This would be dynamically updated based on the current route
  
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}