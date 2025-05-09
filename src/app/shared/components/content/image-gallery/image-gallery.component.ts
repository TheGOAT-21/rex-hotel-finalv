// image-gallery.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-8">
      <div *ngIf="mainImage" class="mb-4 rounded-lg overflow-hidden">
        <img [src]="mainImage.url" [alt]="mainImage.alt" class="w-full h-64 md:h-96 object-cover transition-transform hover:scale-105 duration-500">
      </div>
      
      <div class="grid grid-cols-3 md:grid-cols-4 gap-4">
        <div *ngFor="let image of thumbnails" 
            (click)="selectImage(image)"
            class="cursor-pointer rounded-lg overflow-hidden h-24 md:h-32 relative group">
          <img [src]="image.url" [alt]="image.alt" class="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500">
          <div [ngClass]="[
            'absolute inset-0 transition-opacity',
            selectedImageId === image.id ? 'border-2 border-primary' : 'opacity-0 group-hover:opacity-30 bg-primary'
          ]"></div>
        </div>
      </div>
    </div>
  `
})
export class ImageGalleryComponent {
  @Input() images: {id: string, url: string, alt: string}[] = [];
  
  selectedImageId: string | null = null;
  
  get mainImage() {
    if (this.selectedImageId) {
      return this.images.find(img => img.id === this.selectedImageId);
    }
    return this.images[0];
  }
  
  get thumbnails() {
    return this.images.slice(0, 8); // Limit to first 8 images for thumbnails
  }
  
  ngOnInit() {
    if (this.images.length > 0) {
      this.selectedImageId = this.images[0].id;
    }
  }
  
  selectImage(image: {id: string, url: string, alt: string}) {
    this.selectedImageId = image.id;
  }
}