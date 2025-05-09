// section-title.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-8 text-center">
      <h2 class="text-3xl md:text-4xl font-title font-bold text-primary mb-2">{{ title }}</h2>
      <div *ngIf="subtitle" class="text-text opacity-80 max-w-2xl mx-auto">{{ subtitle }}</div>
      <div *ngIf="!centered" class="w-20 h-1 bg-primary mt-4 rounded"></div>
      <div *ngIf="centered" class="w-20 h-1 bg-primary mt-4 mx-auto rounded"></div>
    </div>
  `
})
export class SectionTitleComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() centered = true;
}