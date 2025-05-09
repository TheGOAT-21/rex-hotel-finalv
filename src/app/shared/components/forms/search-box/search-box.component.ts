// search-box.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <input
        type="text"
        [placeholder]="placeholder"
        [value]="value"
        (input)="onInput($event)"
        class="w-full pl-10 pr-4 py-2 bg-dark-200 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-text"
      />
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <button 
        *ngIf="value && clearable" 
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-text hover:text-primary transition-colors"
        (click)="clear()">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `
})
export class SearchBoxComponent {
  @Input() placeholder = 'Rechercher...';
  @Input() value = '';
  @Input() clearable = true;
  @Output() search = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();
  
  onInput(event: any): void {
    this.value = event.target.value;
    this.valueChange.emit(this.value);
  }
  
  clear(): void {
    this.value = '';
    this.valueChange.emit(this.value);
    this.search.emit(this.value);
  }
  
  doSearch(): void {
    this.search.emit(this.value);
  }
}