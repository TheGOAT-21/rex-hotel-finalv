// select-dropdown.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-dropdown',
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
        <select 
          [id]="id"
          [required]="required"
          [disabled]="disabled"
          [value]="value"
          (change)="onChange($event)"
          [ngClass]="[
            'w-full px-4 py-3 bg-dark-200 border rounded appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all pr-10',
            error ? 'border-error' : 'border-dark-300',
            disabled ? 'bg-dark-100 cursor-not-allowed' : ''
          ]"
        >
          <option *ngIf="placeholder" value="" disabled selected>{{ placeholder }}</option>
          <option *ngFor="let option of options" [value]="option.value">
            {{ option.label }}
          </option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      
      <div *ngIf="error" class="mt-1 text-sm text-error">
        {{ error }}
      </div>
    </div>
  `
})
export class SelectDropdownComponent {
  @Input() id = '';
  @Input() label = '';
  @Input() value = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() error = '';
  @Input() options: {value: string, label: string}[] = [];
  @Output() valueChange = new EventEmitter<string>();
  
  onChange(event: any) {
    this.value = event.target.value;
    this.valueChange.emit(this.value);
  }
}