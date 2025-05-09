// image-with-overlay.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-with-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative group rounded-lg overflow-hidden">
      <img 
        [src]="imageUrl" 
        [alt]="imageAlt" 
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      <div class="absolute inset-0 bg-linear-to-t from-background to-transparent opacity-70"></div>
      
      <div class="absolute bottom-0 left-0 p-6">
        <h3 *ngIf="title" class="text-xl md:text-2xl font-bold text-primary mb-2">{{ title }}</h3>
        <p *ngIf="description" class="text-text">{{ description }}</p>
        <button *ngIf="buttonText" 
                (click)="onButtonClick.emit()"
                class="mt-4 bg-primary text-background px-4 py-2 rounded font-bold uppercase hover:bg-primary-hover transition-colors">
          {{ buttonText }}
        </button>
      </div>
    </div>
  `
})
export class ImageWithOverlayComponent {
  @Input() imageUrl = '';
  @Input() imageAlt = '';
  @Input() title = '';
  @Input() description = '';
  @Input() buttonText = '';
  @Output() onButtonClick = new EventEmitter<void>();
}