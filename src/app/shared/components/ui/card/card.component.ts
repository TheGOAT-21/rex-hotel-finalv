// card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-background-alt rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl">
      <div *ngIf="hasHeader" class="p-4 border-b border-primary border-opacity-20">
        <ng-content select="[card-header]"></ng-content>
      </div>
      <div class="p-6">
        <ng-content></ng-content>
      </div>
      <div *ngIf="hasFooter" class="p-4 border-t border-primary border-opacity-20">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `
})
export class CardComponent {
  @Input() hasHeader = false;
  @Input() hasFooter = false;
}