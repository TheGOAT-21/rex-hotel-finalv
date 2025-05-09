// tabs.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <div class="border-b border-dark-300">
        <div class="flex">
          <button *ngFor="let tab of tabs; let i = index"
                  (click)="activeTab = i"
                  [ngClass]="[
                    'px-4 py-2 font-medium text-sm transition-colors relative',
                    activeTab === i 
                      ? 'text-primary border-b-2 border-primary -mb-px' 
                      : 'text-text hover:text-primary'
                  ]">
            {{ tab.label }}
          </button>
        </div>
      </div>
      
      <div class="p-4">
        <ng-container *ngIf="tabs[activeTab]">
          <ng-container *ngTemplateOutlet="tabs[activeTab].content"></ng-container>
        </ng-container>
      </div>
    </div>
  `
})
export class TabsComponent {
  @Input() tabs: { label: string; content: any }[] = [];
  @Input() activeTab = 0;
}