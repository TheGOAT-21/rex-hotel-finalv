import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from './contact-form/contact-form.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ContactFormComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Contactez-nous</h1>
      <app-contact-form></app-contact-form>
    </div>
  `
})
export class ContactComponent {} 