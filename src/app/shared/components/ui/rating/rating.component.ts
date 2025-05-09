// rating.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center">
      <div *ngFor="let star of starsArray; let i = index" 
           class="cursor-pointer text-xl"
           (click)="selectable ? onRateChange(i + 1) : null"
           (mouseenter)="selectable ? hoverRating = i + 1 : null"
           (mouseleave)="selectable ? hoverRating = 0 : null">
        <span [ngClass]="[
          'transition-colors',
          (hoverRating > 0 ? hoverRating > i : rating > i) ? 'text-primary' : 'text-text text-opacity-30'
        ]">★</span>
      </div>
      
      <span *ngIf="showValue" class="ml-2 text-text text-sm">{{ rating }}/{{ totalStars }}</span>
    </div>
  `
})
export class RatingComponent {
  @Input() rating = 0;
  @Input() totalStars = 5;
  @Input() selectable = false;
  @Input() showValue = false;
  @Output() ratingChange = new EventEmitter<number>();
  
  hoverRating = 0;
  
  get starsArray(): number[] {
    return Array(this.totalStars).fill(0);
  }
  
  onRateChange(newRating: number): void {
    if (this.selectable) {
      this.rating = newRating;
      this.ratingChange.emit(newRating);
    }
  }
}