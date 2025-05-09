// admin-sidebar.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="bg-background-alt h-screen w-64 fixed top-0 left-0 shadow-lg transition-all duration-300" 
           [ngClass]="{'w-64': !collapsed, 'w-20': collapsed}">
      <div class="p-4 border-b border-dark-300 flex items-center justify-between">
        <div class="text-primary font-title text-xl" [ngClass]="{'hidden': collapsed}">REX ADMIN</div>
        <button class="text-text hover:text-primary" (click)="toggleCollapse()">
          <svg *ngIf="!collapsed" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
          </svg>
          <svg *ngIf="collapsed" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
      
      <nav class="p-4">
        <div *ngFor="let section of menuItems" class="mb-6">
          <h5 *ngIf="!collapsed" class="text-text opacity-50 uppercase text-xs font-bold mb-2 tracking-wider">{{ section.label }}</h5>
          
          <div class="space-y-1">
            <a *ngFor="let item of section.items"
               [routerLink]="item.path"
               routerLinkActive="bg-primary bg-opacity-10 text-primary"
               class="flex items-center py-2 px-3 rounded hover:bg-dark-300 text-text hover:text-primary transition-colors">
              <span class="mr-3">
                <svg *ngIf="item.icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path [attr.d]="item.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                </svg>
              </span>
              <span [ngClass]="{'hidden': collapsed}">{{ item.label }}</span>
            </a>
          </div>
        </div>
      </nav>
    </aside>
  `
})
export class AdminSidebarComponent {
  @Input() collapsed = false;
  
  menuItems = [
    {
      label: 'Dashboard',
      items: [
        { path: '/admin/dashboard', label: 'Vue d\'ensemble', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' }
      ]
    },
    {
      label: 'Gestion',
      items: [
        { path: '/admin/spaces', label: 'Espaces', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { path: '/admin/bookings', label: 'Réservations', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { path: '/admin/users', label: 'Utilisateurs', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
      ]
    },
    {
      label: 'Rapports',
      items: [
        { path: '/admin/reports/bookings', label: 'Réservations', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { path: '/admin/reports/occupancy', label: 'Occupation', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { path: '/admin/reports/revenue', label: 'Revenus', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
      ]
    },
    {
      label: 'Paramètres',
      items: [
        { path: '/admin/settings/general', label: 'Général', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
        { path: '/admin/settings/notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
        { path: '/admin/settings/pricing', label: 'Tarification', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
      ]
    }
  ];
  
  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }
}