// radio-button.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-radio-button',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center mb-2">
      <input 
        type="radio" 
        [id]="id"
        [name]="name"
        [value]="value"
        [checked]="checked"
        [disabled]="disabled"
        (change)="onChange($event)"
        class="appearance-none h-5 w-5 border border-dark-300 rounded-full bg-dark-200 checked:bg-primary checked:border-primary checked:focus:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition-colors cursor-pointer relative before:content-[''] before:absolute before:w-2 before:h-2 before:rounded-full before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-background before:scale-0 checked:before:scale-100 before:transition-transform"
      />
      <label [for]="id" class="ml-2 text-text cursor-pointer">
        {{ label }}
      </label>
    </div>
  `
})
export class RadioButtonComponent {
  @Input() id = '';
  @Input() name = '';
  @Input() value: any;
  @Input() label = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<any>();
  
  onChange(event: any): void {
    this.checked = event.target.checked;
    if (this.checked) {
      this.valueChange.emit(this.value);
    }
  }
}