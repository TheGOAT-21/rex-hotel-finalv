// checkbox.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center mb-2">
      <input 
        type="checkbox" 
        [id]="id" 
        [checked]="checked"
        [disabled]="disabled"
        (change)="onChange($event)"
        class="appearance-none h-5 w-5 border border-dark-300 rounded bg-dark-200 checked:bg-primary checked:border-primary checked:focus:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition-colors cursor-pointer"
      />
      <label [for]="id" class="ml-2 text-text cursor-pointer">
        {{ label }}
      </label>
    </div>
  `
})
export class CheckboxComponent {
  @Input() id = '';
  @Input() label = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();
  
  onChange(event: any): void {
    this.checked = event.target.checked;
    this.checkedChange.emit(this.checked);
  }
}