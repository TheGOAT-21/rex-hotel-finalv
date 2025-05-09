// modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-background bg-opacity-75 transition-opacity" (click)="onClose.emit()"></div>
      
      <div class="bg-background-alt rounded-lg overflow-hidden shadow-xl transform transition-all z-10 w-full max-w-lg mx-4">
        <div class="px-6 py-4 border-b border-primary border-opacity-20 flex justify-between items-center">
          <h3 class="font-title text-xl text-primary">{{ title }}</h3>
          <button class="text-text hover:text-primary" (click)="onClose.emit()">&times;</button>
        </div>
        
        <div class="p-6">
          <ng-content></ng-content>
        </div>
        
        <div *ngIf="hasFooter" class="px-6 py-4 border-t border-primary border-opacity-20 flex justify-end space-x-2">
          <ng-content select="[modal-footer]"></ng-content>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() hasFooter = true;
  @Output() onClose = new EventEmitter<void>();
}