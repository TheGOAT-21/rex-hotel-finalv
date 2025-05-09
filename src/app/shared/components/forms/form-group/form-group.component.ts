// form-group.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-6">
      <label *ngIf="label" 
        [for]="labelFor" 
        class="block mb-2 font-body font-semibold text-text">
        {{ label }}
        <span *ngIf="required" class="text-error">*</span>
      </label>

      <div [ngClass]="{'grid grid-cols-1 md:grid-cols-2 gap-4': horizontal}">
        <ng-content></ng-content>
      </div>

      <div *ngIf="hint && !error" class="mt-1 text-sm text-text opacity-70">
        {{ hint }}
      </div>
      
      <div *ngIf="error" class="mt-1 text-sm text-error">
        {{ error }}
      </div>
    </div>
  `
})
export class FormGroupComponent {
  @Input() label = '';
  @Input() labelFor = '';
  @Input() required = false;
  @Input() hint = '';
  @Input() error = '';
  @Input() horizontal = false;
}