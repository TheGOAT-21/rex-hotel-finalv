// loader.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center" [class]="fullScreen ? 'fixed inset-0 bg-background bg-opacity-75 z-50' : ''">
      <div class="animate-spin rounded-full border-t-4 border-primary border-opacity-75 border-r-4 border-r-transparent h-12 w-12"></div>
      <span *ngIf="text" class="ml-3 text-text">{{ text }}</span>
    </div>
  `
})
export class LoaderComponent {
  @Input() text = '';
  @Input() fullScreen = false;
}