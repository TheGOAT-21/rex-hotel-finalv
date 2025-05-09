// date-picker.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="date-picker-container">
      <div class="mb-6">
        <label *ngIf="label" 
          [for]="id" 
          class="block mb-2 font-body font-semibold text-text">
          {{ label }}
          <span *ngIf="required" class="text-error">*</span>
        </label>
        
        <div [ngClass]="{'relative': !range, 'flex gap-2 items-center': range}">
          <!-- Single Date Input -->
          <div *ngIf="!range" class="relative">
            <input 
              type="date" 
              [id]="id"
              [min]="minDate"
              [max]="maxDate"
              [required]="required"
              [disabled]="disabled"
              [value]="formatDateForInput(selectedDate)"
              (change)="onSingleDateChange($event)"
              [ngClass]="[
                'w-full px-4 py-3 bg-dark-200 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all',
                error ? 'border-error' : 'border-dark-300',
                disabled ? 'bg-dark-100 cursor-not-allowed' : ''
              ]"
            />
            <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <!-- Date Range Inputs -->
          <ng-container *ngIf="range">
            <div class="relative flex-1">
              <input 
                type="date" 
                [id]="id + '-start'"
                [min]="minDate"
                [max]="selectedDateRange.endDate ? formatDateForInput(selectedDateRange.endDate) : maxDate"
                [required]="required"
                [disabled]="disabled"
                [value]="formatDateForInput(selectedDateRange.startDate)"
                (change)="onStartDateChange($event)"
                placeholder="Date d'arrivée"
                [ngClass]="[
                  'w-full px-4 py-3 bg-dark-200 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all',
                  error ? 'border-error' : 'border-dark-300',
                  disabled ? 'bg-dark-100 cursor-not-allowed' : ''
                ]"
              />
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-primary">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <div class="flex-none text-text opacity-70">à</div>
            
            <div class="relative flex-1">
              <input 
                type="date" 
                [id]="id + '-end'"
                [min]="selectedDateRange.startDate ? formatDateForInput(selectedDateRange.startDate) : minDate"
                [max]="maxDate"
                [required]="required"
                [disabled]="disabled || !selectedDateRange.startDate"
                [value]="formatDateForInput(selectedDateRange.endDate)"
                (change)="onEndDateChange($event)"
                placeholder="Date de départ"
                [ngClass]="[
                  'w-full px-4 py-3 bg-dark-200 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all',
                  error ? 'border-error' : 'border-dark-300',
                  disabled || !selectedDateRange.startDate ? 'bg-dark-100 cursor-not-allowed' : ''
                ]"
              />
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-primary">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </ng-container>
        </div>
        
        <div *ngIf="error" class="mt-1 text-sm text-error">
          {{ error }}
        </div>
        
        <div *ngIf="hint && !error" class="mt-1 text-sm text-text opacity-70">
          {{ hint }}
        </div>
      </div>
    </div>
  `
})
export class DatePickerComponent implements OnInit {
  @Input() id = '';
  @Input() label = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() range = false;
  @Input() minDate = '';
  @Input() maxDate = '';
  
  // Input/Output for single date
  @Input() selectedDate: Date | null = null;
  @Output() dateChange = new EventEmitter<Date>();
  
  // Input/Output for date range
  @Input() selectedDateRange: DateRange = { startDate: null, endDate: null };
  @Output() dateRangeChange = new EventEmitter<DateRange>();
  
  ngOnInit() {
    // Set default minDate to today if not provided
    if (!this.minDate) {
      const today = new Date();
      this.minDate = this.formatDateForInput(today);
    }
  }
  
  onSingleDateChange(event: any) {
    const dateValue = event.target.value;
    if (dateValue) {
      const date = new Date(dateValue);
      this.selectedDate = date;
      this.dateChange.emit(date);
    } else {
      this.selectedDate = null;
      this.dateChange.emit(null as any);
    }
  }
  
  onStartDateChange(event: any) {
    const dateValue = event.target.value;
    if (dateValue) {
      const date = new Date(dateValue);
      this.selectedDateRange = {
        ...this.selectedDateRange,
        startDate: date
      };
      
      // If end date is earlier than start date, reset it
      if (this.selectedDateRange.endDate && this.selectedDateRange.endDate < date) {
        this.selectedDateRange.endDate = null;
      }
      
      this.dateRangeChange.emit(this.selectedDateRange);
    } else {
      this.selectedDateRange = {
        startDate: null,
        endDate: null
      };
      this.dateRangeChange.emit(this.selectedDateRange);
    }
  }
  
  onEndDateChange(event: any) {
    const dateValue = event.target.value;
    if (dateValue) {
      const date = new Date(dateValue);
      this.selectedDateRange = {
        ...this.selectedDateRange,
        endDate: date
      };
      this.dateRangeChange.emit(this.selectedDateRange);
    } else {
      this.selectedDateRange = {
        ...this.selectedDateRange,
        endDate: null
      };
      this.dateRangeChange.emit(this.selectedDateRange);
    }
  }
  
  formatDateForInput(date: Date | null): string {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
}