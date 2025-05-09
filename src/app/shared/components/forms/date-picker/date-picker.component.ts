// date-picker.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-6">
      <label *ngIf="label" 
        [for]="id" 
        class="block mb-2 font-body font-semibold text-text">
        {{ label }}
        <span *ngIf="required" class="text-error">*</span>
      </label>
      
      <div class="relative">
        <input 
          type="date" 
          [id]="id"
          [min]="minDate"
          [max]="maxDate"
          [required]="required"
          [disabled]="disabled"
          [value]="value"
          (input)="onDateChange($event)"
          [ngClass]="[
            'w-full px-4 py-3 bg-dark-200 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all',
            error ? 'border-error' : 'border-dark-300',
            disabled ? 'bg-dark-100 cursor-not-allowed' : ''
          ]"
        />
        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      
      <div *ngIf="error" class="mt-1 text-sm text-error">
        {{ error }}
      </div>
    </div>
  `
})
export class DatePickerComponent {
  @Input() id = '';
  @Input() label = '';
  @Input() value = '';
  @Input() minDate = '';
  @Input() maxDate = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() error = '';
  @Output() dateChange = new EventEmitter<string>();
  
  onDateChange(event: any): void {
    this.value = event.target.value;
    this.dateChange.emit(this.value);
  }
}