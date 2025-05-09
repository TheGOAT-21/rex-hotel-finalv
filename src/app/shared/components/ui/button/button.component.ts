// button.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  standalone: true,
  template: `
    <button 
      [type]="type"
      [disabled]="disabled"
      [ngClass]="[
        'font-body font-bold uppercase px-4 py-2 rounded transition-all duration-300',
        variant === 'primary' ? 'bg-primary text-background hover:bg-primary-hover active:bg-primary-active disabled:bg-disabled disabled:text-gray-400' : '',
        variant === 'secondary' ? 'bg-transparent text-primary border-2 border-primary hover:bg-opacity-10 hover:bg-primary active:bg-opacity-20 disabled:border-disabled disabled:text-disabled' : '',
        variant === 'text' ? 'bg-transparent text-text hover:bg-text hover:bg-opacity-10 active:bg-opacity-15 disabled:text-disabled' : '',
        fullWidth ? 'w-full' : ''
      ]"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'text' = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Output() onClick = new EventEmitter<MouseEvent>();
}