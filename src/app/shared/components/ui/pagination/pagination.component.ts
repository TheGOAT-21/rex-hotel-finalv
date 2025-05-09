// pagination.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center space-x-2 my-6">
      <button 
        (click)="onPrevious()"
        [disabled]="currentPage === 1"
        [ngClass]="[
          'px-3 py-1 rounded border transition-colors',
          currentPage === 1 ? 'border-dark-300 text-disabled cursor-not-allowed' : 'border-primary text-primary hover:bg-primary hover:bg-opacity-10'
        ]">
        Précédent
      </button>
      
      <div class="flex items-center space-x-1">
        <button *ngFor="let page of visiblePages" 
          (click)="onPageChange(page)"
          [ngClass]="[
            'w-8 h-8 flex items-center justify-center rounded transition-colors',
            page === currentPage ? 'bg-primary text-background' : 'text-text hover:bg-primary hover:bg-opacity-10'
          ]">
          {{ page }}
        </button>
      </div>
      
      <button 
        (click)="onNext()"
        [disabled]="currentPage === totalPages"
        [ngClass]="[
          'px-3 py-1 rounded border transition-colors',
          currentPage === totalPages ? 'border-dark-300 text-disabled cursor-not-allowed' : 'border-primary text-primary hover:bg-primary hover:bg-opacity-10'
        ]">
        Suivant
      </button>
    </div>
  `
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();
  
  get visiblePages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
      
      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }
  
  onPageChange(page: number): void {
    if (page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
  
  onPrevious(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }
  
  onNext(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}