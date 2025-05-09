// location-map.component.ts
import { Component, AfterViewInit, Input, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="location-map-container">
      <!-- Fallback Static Map Image -->
      <div *ngIf="useStaticMap" class="rounded-lg overflow-hidden">
        <img 
          [src]="staticMapUrl" 
          [alt]="'Carte de ' + hotelName" 
          class="w-full h-full object-cover"
        />
      </div>
      
      <!-- Interactive Map -->
      <div *ngIf="!useStaticMap" #mapContainer class="w-full h-96 rounded-lg overflow-hidden">
        <!-- Map will be rendered here by external library -->
      </div>
      
      <!-- Map Overlay with Hotel Info -->
      <div *ngIf="showInfoOverlay" class="bg-background-alt rounded-lg shadow-lg p-6 mt-4">
        <h3 class="text-xl font-bold text-primary mb-3">{{ hotelName }}</h3>
        
        <div class="space-y-2">
          <!-- Address -->
          <div class="flex items-start">
            <div class="text-primary mr-3 mt-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <div class="text-text">
              <p>{{ address }}</p>
              <p>{{ zipCode }} {{ city }}</p>
              <p>{{ country }}</p>
            </div>
          </div>
          
          <!-- Phone -->
          <div class="flex items-start">
            <div class="text-primary mr-3 mt-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
            <div class="text-text">
              <p>{{ phone }}</p>
            </div>
          </div>
          
          <!-- Email -->
          <div class="flex items-start">
            <div class="text-primary mr-3 mt-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="text-text">
              <p>{{ email }}</p>
            </div>
          </div>
          
          <!-- Directions Button -->
          <div *ngIf="showDirectionsButton" class="mt-4">
            <a 
              [href]="directionsUrl" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="inline-flex items-center bg-primary text-background px-4 py-2 rounded font-bold uppercase hover:bg-primary-hover transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
              Itinéraire
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LocationMapComponent implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  
  @Input() hotelName = 'REX Hotel';
  @Input() address = 'Boulevard Principal';
  @Input() zipCode = '';
  @Input() city = 'Yamoussoukro';
  @Input() country = 'Côte d\'Ivoire';
  @Input() phone = '+225 XX XX XX XX';
  @Input() email = 'info@rexhotel.com';
  
  @Input() latitude = 6.827583; // Default: Yamoussoukro
  @Input() longitude = -5.289231;
  @Input() zoom = 15;
  @Input() showInfoOverlay = true;
  @Input() showDirectionsButton = true;
  @Input() useStaticMap = true; // Use static image by default as we won't implement actual maps here
  
  get staticMapUrl(): string {
    // This would typically be a URL to a map service like Google Maps Static API
    // For demo purposes, we'll use a placeholder
    return `/api/placeholder/800/400?text=${this.hotelName}%20-%20${this.address},%20${this.city}`;
  }
  
  get directionsUrl(): string {
    // Google Maps directions URL
    return `https://www.google.com/maps/dir/?api=1&destination=${this.latitude},${this.longitude}&destination_place_id=${this.hotelName}`;
  }
  
  ngAfterViewInit(): void {
    if (!this.useStaticMap) {
      // In a real application, you would initialize a map library here
      // For example, using Leaflet, Google Maps, or OpenStreetMap
      this.initializeMap();
    }
  }
  
  private initializeMap(): void {
    // This is a placeholder for an actual map implementation
    // In a real application, you would use code like this:
    /*
    // Example with Leaflet.js
    const map = L.map(this.mapContainer.nativeElement).setView([this.latitude, this.longitude], this.zoom);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add marker for hotel location
    L.marker([this.latitude, this.longitude])
      .addTo(map)
      .bindPopup(this.hotelName)
      .openPopup();
    */
    
    // For this demo, we'll just add a text indicator in the container
    const container = this.mapContainer.nativeElement;
    
    // Set up container
    container.style.backgroundColor = '#1E1E1E';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.color = '#D4AF37';
    container.style.fontWeight = 'bold';
    container.style.fontSize = '16px';
    
    // Add text
    container.textContent = `🗺️ Carte interactive: ${this.hotelName} (${this.latitude}, ${this.longitude})`;
  }
}