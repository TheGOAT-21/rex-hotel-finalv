// tabs.component.ts
import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabDefinition {
  id: string;
  label: string;
  icon?: string;
  content: TemplateRef<any>;
  disabled?: boolean;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tabs-container">
      <!-- Tab Headers -->
      <div class="border-b border-dark-300 flex overflow-x-auto hide-scrollbar">
        <button 
          *ngFor="let tab of tabs; let i = index" 
          (click)="selectTab(tab.id)"
          [disabled]="tab.disabled"
          class="px-4 py-3 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary whitespace-nowrap transition-colors"
          [ngClass]="[
            tab.id === activeTabId 
              ? 'text-primary border-b-2 border-primary -mb-px font-semibold' 
              : 'text-text hover:text-primary',
            tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          ]"
        >
          <!-- Tab Icon (if provided) -->
          <span *ngIf="tab.icon" class="mr-2">
            <i [class]="tab.icon"></i>
          </span>
          
          <!-- Tab Label -->
          {{ tab.label }}
        </button>
      </div>
      
      <!-- Tab Content -->
      <div class="py-4">
        <ng-container *ngFor="let tab of tabs">
          <div *ngIf="tab.id === activeTabId" class="tab-content">
            <ng-container *ngTemplateOutlet="tab.content"></ng-container>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class TabsComponent implements AfterContentInit {
  @Input() tabs: TabDefinition[] = [];
  @Input() set activeTab(tabId: string) {
    if (tabId && this.tabs.some(tab => tab.id === tabId && !tab.disabled)) {
      this.activeTabId = tabId;
    }
  }
  @Output() tabChange = new EventEmitter<string>();
  
  activeTabId = '';
  
  ngAfterContentInit(): void {
    // Set the first non-disabled tab as active if no active tab provided
    if (!this.activeTabId && this.tabs.length > 0) {
      const firstEnabledTab = this.tabs.find(tab => !tab.disabled);
      if (firstEnabledTab) {
        this.activeTabId = firstEnabledTab.id;
      }
    }
  }
  
  selectTab(tabId: string): void {
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab && !tab.disabled && this.activeTabId !== tabId) {
      this.activeTabId = tabId;
      this.tabChange.emit(tabId);
    }
  }
}