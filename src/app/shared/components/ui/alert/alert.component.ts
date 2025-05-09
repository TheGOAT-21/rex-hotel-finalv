// alert.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="[
      'p-4 rounded-md mb-4 flex items-start',
      type === 'success' ? 'bg-success bg-opacity-10 text-success border-l-4 border-success' : '',
      type === 'error' ? 'bg-error bg-opacity-10 text-error border-l-4 border-error' : '',
      type === 'info' ? 'bg-info bg-opacity-10 text-info border-l-4 border-info' : '',
      type === 'warning' ? 'bg-primary bg-opacity-10 text-primary border-l-4 border-primary' : ''
    ]">
      <div class="flex-1">
        <div *ngIf="title" class="font-bold mb-1">{{ title }}</div>
        <div><ng-content></ng-content></div>
      </div>
      <button *ngIf="dismissible" 
        class="ml-auto text-text opacity-50 hover:opacity-100"
        (click)="onDismiss.emit()">
        &times;
      </button>
    </div>
  `
})
export class AlertComponent {
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
  @Input() title?: string;
  @Input() dismissible = false;
  @Output() onDismiss = new EventEmitter<void>();
}