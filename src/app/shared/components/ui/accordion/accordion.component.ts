// accordion.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AccordionItem {
  title: string;
  content: string;
  isOpen?: boolean;
}

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2">
      <div *ngFor="let item of items; let i = index" class="border border-dark-300 rounded-lg overflow-hidden">
        <button 
          (click)="toggleItem(i)"
          class="w-full px-4 py-3 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary"
          [ngClass]="{'bg-background-alt': !item.isOpen, 'bg-background': item.isOpen}"
        >
          <span class="font-semibold text-text">{{ item.title }}</span>
          <svg 
            class="w-5 h-5 text-primary transition-transform duration-300" 
            [ngClass]="{'transform rotate-180': item.isOpen}"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <div 
          *ngIf="item.isOpen" 
          class="px-4 py-3 bg-background border-t border-dark-300"
          [@accordionAnimation]
        >
          <div class="text-text" [innerHTML]="item.content"></div>
        </div>
      </div>
    </div>
  `
})
export class AccordionComponent {
  @Input() items: AccordionItem[] = [];
  
  toggleItem(index: number): void {
    this.items[index].isOpen = !this.items[index].isOpen;
  }
}