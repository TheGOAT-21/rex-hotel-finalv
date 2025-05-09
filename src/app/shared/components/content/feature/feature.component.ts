// feature.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 transition-all duration-300 border border-dark-300 rounded-lg bg-background-alt hover:shadow-lg hover:border-primary">
      <div *ngIf="iconName" class="text-primary mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary bg-opacity-10">
        <!-- Sample icons (replace with your icon system) -->
        <svg *ngIf="iconName === 'wifi'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
        <svg *ngIf="iconName === 'restaurant'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <svg *ngIf="iconName === 'pool'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <!-- Default icon if none matches -->
        <svg *ngIf="!['wifi', 'restaurant', 'pool'].includes(iconName)" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h3 class="text-xl font-bold mb-2 text-text">{{ title }}</h3>
      <p class="text-text opacity-80">{{ description }}</p>
    </div>
  `
})
export class FeatureComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() iconName = '';
}