// input-field.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
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
      
      <input 
        [type]="type"
        [id]="id"
        [placeholder]="placeholder"
        [required]="required"
        [disabled]="disabled"
        [value]="value"
        (input)="onInput($event)"
        [ngClass]="[
          'w-full px-4 py-3 bg-dark-200 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all',
          error ? 'border-error' : 'border-dark-300',
          disabled ? 'bg-dark-100 cursor-not-allowed' : ''
        ]"
      />
      
      <div *ngIf="error" class="mt-1 text-sm text-error">
        {{ error }}
      </div>
      
      <div *ngIf="hint && !error" class="mt-1 text-sm text-text opacity-70">
        {{ hint }}
      </div>
    </div>
  `
})
export class InputFieldComponent {
  @Input() id = '';
  @Input() label = '';
  @Input() value = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' = 'text';
  @Input() required = false;
  @Input() disabled = false;
  @Input() error = '';
  @Input() hint = '';
  @Output() valueChange = new EventEmitter<string>();
  
  onInput(event: any) {
    this.value = event.target.value;
    this.valueChange.emit(this.value);
  }
}