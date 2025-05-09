// divider.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-divider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center my-6">
      <div *ngIf="label && position === 'left'" class="mr-4 text-text text-sm font-medium whitespace-nowrap">{{ label }}</div>
      
      <div class="grow border-t border-dark-300" [ngClass]="{'border-primary': primary}"></div>
      
      <div *ngIf="label && position === 'center'" class="mx-4 text-text text-sm font-medium whitespace-nowrap">{{ label }}</div>
      
      <div *ngIf="position === 'center'" class="grow border-t border-dark-300" [ngClass]="{'border-primary': primary}"></div>
      
      <div *ngIf="label && position === 'right'" class="ml-4 text-text text-sm font-medium whitespace-nowrap">{{ label }}</div>
    </div>
  `
})
export class DividerComponent {
  @Input() label = '';
  @Input() position: 'left' | 'center' | 'right' = 'center';
  @Input() primary = false;
}