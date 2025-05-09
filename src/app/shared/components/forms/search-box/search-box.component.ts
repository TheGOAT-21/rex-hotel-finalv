// search-box.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-box" [ngClass]="{'w-full': fullWidth}">
      <div class="relative">
        <!-- Search Input -->
        <input
          type="text"
          [id]="id"
          [placeholder]="placeholder"
          [(ngModel)]="searchTerm"
          (input)="onInput()"
          (keyup.enter)="onSearch()"
          [disabled]="disabled"
          [ngClass]="[
            'w-full pl-10 pr-4 py-2 bg-dark-200 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all',
            error ? 'border-error' : 'border-dark-300',
            disabled ? 'bg-dark-100 cursor-not-allowed' : '',
            size === 'sm' ? 'py-1 text-sm' : '',
            size === 'lg' ? 'py-3 text-lg' : ''
          ]"
        />
        
        <!-- Search Icon -->
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        
        <!-- Clear Button -->
        <button 
          *ngIf="searchTerm && clearable && !disabled" 
          type="button"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-text hover:text-primary transition-colors"
          (click)="clearSearch()"
          aria-label="Clear search"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <!-- Loading Indicator -->
        <div *ngIf="loading" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <div class="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
      
      <!-- Error Message -->
      <div *ngIf="error" class="mt-1 text-sm text-error">
        {{ error }}
      </div>
      
      <!-- Suggestion Dropdown -->
      <div 
        *ngIf="showSuggestions && suggestions.length > 0 && isFocused"
        class="absolute z-10 mt-1 w-full bg-dark-200 border border-dark-300 rounded-md shadow-lg max-h-60 overflow-auto"
      >
        <ul>
          <li 
            *ngFor="let suggestion of suggestions; let i = index"
            class="px-4 py-2 text-text hover:bg-dark-300 cursor-pointer"
            [ngClass]="{'bg-dark-300': selectedIndex === i}"
            (click)="selectSuggestion(suggestion)"
            (mouseenter)="selectedIndex = i"
          >
            {{ suggestion }}
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .search-box {
      position: relative;
    }
  `]
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  @Input() id = '';
  @Input() placeholder = 'Rechercher...';
  @Input() fullWidth = true;
  @Input() clearable = true;
  @Input() disabled = false;
  @Input() error = '';
  @Input() loading = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  
  // Debounce-related properties
  @Input() debounceTime = 300; // ms
  @Input() searchOnChange = false;
  
  // Suggestions feature
  @Input() suggestions: string[] = [];
  @Input() showSuggestions = false;
  
  // Input/Output for search term
  @Input() searchTerm = '';
  @Output() searchChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();
  @Output() suggestionSelected = new EventEmitter<string>();
  
  private searchTermChanged = new Subject<string>();
  private subscription: Subscription | null = null;
  
  // For suggestions dropdown
  isFocused = false;
  selectedIndex = -1;
  
  ngOnInit() {
    // Set up debounce for search term changes
    this.subscription = this.searchTermChanged.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchChange.emit(term);
      if (this.searchOnChange) {
        this.search.emit(term);
      }
    });
  }
  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  onInput() {
    this.searchTermChanged.next(this.searchTerm);
  }
  
  onSearch() {
    this.search.emit(this.searchTerm);
  }
  
  clearSearch() {
    this.searchTerm = '';
    this.searchTermChanged.next('');
    this.search.emit('');
    this.clear.emit();
  }
  
  onFocus() {
    this.isFocused = true;
  }
  
  onBlur() {
    // Delay hiding suggestions to allow click events to register
    setTimeout(() => {
      this.isFocused = false;
    }, 200);
  }
  
  selectSuggestion(suggestion: string) {
    this.searchTerm = suggestion;
    this.suggestionSelected.emit(suggestion);
    this.isFocused = false;
    this.onSearch();
  }
  
  // Keyboard navigation for suggestions
  onKeyDown(event: KeyboardEvent) {
    if (!this.showSuggestions || !this.suggestions.length) return;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        break;
      case 'Enter':
        if (this.selectedIndex >= 0) {
          this.selectSuggestion(this.suggestions[this.selectedIndex]);
        }
        break;
      case 'Escape':
        this.isFocused = false;
        break;
    }
  }
}