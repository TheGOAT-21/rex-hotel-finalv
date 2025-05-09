// testimonial.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from '../../ui/rating/rating.component';

@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [CommonModule, RatingComponent],
  template: `
    <div class="p-6 bg-background-alt rounded-lg shadow-md border border-dark-300">
      <div class="flex items-center mb-4">
        <div *ngIf="avatarUrl" class="h-12 w-12 rounded-full overflow-hidden mr-4">
          <img [src]="avatarUrl" alt="Photo de {{ name }}" class="h-full w-full object-cover">
        </div>
        <div *ngIf="!avatarUrl" class="h-12 w-12 rounded-full bg-primary text-background flex items-center justify-center mr-4 font-semibold">
          {{ nameInitials }}
        </div>
        <div>
          <h4 class="text-text font-semibold">{{ name }}</h4>
          <app-rating [rating]="rating" [totalStars]="5" [showValue]="false"></app-rating>
        </div>
      </div>
      
      <div class="text-text opacity-90 italic mb-2">
        "{{ quote }}"
      </div>
      
      <div *ngIf="date" class="text-text opacity-60 text-sm">
        {{ date | date:'dd/MM/yyyy' }}
      </div>
    </div>
  `
})
export class TestimonialComponent {
  @Input() name = '';
  @Input() quote = '';
  @Input() rating = 5;
  @Input() avatarUrl = '';
  @Input() date: Date | null = null;
  
  get nameInitials(): string {
    return this.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}