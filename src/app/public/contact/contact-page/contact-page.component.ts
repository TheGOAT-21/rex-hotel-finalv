import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { LocationMapComponent } from '../location-map/location-map.component';
import { SectionTitleComponent } from '../../../shared/components/content/section-title/section-title.component';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, ContactFormComponent, LocationMapComponent, SectionTitleComponent],
  template: `
    <div class="container mx-auto px-4 py-12">
      <app-section-title 
        title="Contactez-nous" 
        subtitle="Nous sommes à votre disposition pour toute information ou demande."
        [centered]="true"
      ></app-section-title>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div>
          <app-contact-form></app-contact-form>
        </div>
        <div>
          <app-location-map 
            [showInfoOverlay]="true"
            [showDirectionsButton]="true"
          ></app-location-map>
        </div>
      </div>
    </div>
  `
})
export class ContactPageComponent {
  // Logique du composant
}