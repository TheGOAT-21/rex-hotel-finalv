// toast.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isVisible" 
         [ngClass]="[
           'fixed z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform flex items-center',
           position === 'top-right' ? 'top-4 right-4' : '',
           position === 'top-left' ? 'top-4 left-4' : '',
           position === 'bottom-right' ? 'bottom-4 right-4' : '',
           position === 'bottom-left' ? 'bottom-4 left-4' : '',
           position === 'top-center' ? 'top-4 left-1/2 -translate-x-1/2' : '',
           position === 'bottom-center' ? 'bottom-4 left-1/2 -translate-x-1/2' : '',
           type === 'success' ? 'bg-success text-white' : '',
           type === 'error' ? 'bg-error text-white' : '',
           type === 'info' ? 'bg-info text-white' : '',
           type === 'warning' ? 'bg-primary text-background' : ''
         ]">
      <div class="mr-3">
        <!-- Success Icon -->
        <svg *ngIf="type === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        
        <!-- Error Icon -->
        <svg *ngIf="type === 'error'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        
        <!-- Info Icon -->
        <svg *ngIf="type === 'info'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        
        <!-- Warning Icon -->
        <svg *ngIf="type === 'warning'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      </div>
      
      <div class="flex-1">{{ message }}</div>
      
      <button *ngIf="dismissible" 
              class="ml-3 text-white opacity-75 hover:opacity-100 transition-opacity"
              (click)="close()">
        &times;
      </button>
    </div>
  `
})
export class ToastComponent {
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
  @Input() message = '';
  @Input() duration = 3000; // ms
  @Input() dismissible = true;
  @Input() position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' = 'top-right';
  @Output() closed = new EventEmitter<void>();
  
  isVisible = true;
  private timeout: any;
  
  ngOnInit(): void {
    if (this.duration > 0) {
      this.timeout = setTimeout(() => {
        this.isVisible = false;
        this.closed.emit();
      }, this.duration);
    }
  }
  
  ngOnDestroy(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
  
  close(): void {
    this.isVisible = false;
    this.closed.emit();
  }
}