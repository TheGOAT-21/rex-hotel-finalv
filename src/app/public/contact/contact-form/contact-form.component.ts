// contact-form.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputFieldComponent } from '../../../shared/components/forms/input-field/input-field.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { SelectDropdownComponent } from '../../../shared/components/forms/select-dropdown/select-dropdown.component';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputFieldComponent, ButtonComponent, SelectDropdownComponent],
  template: `
    <div class="bg-background-alt rounded-lg p-6 shadow-lg">
      <h2 *ngIf="title" class="text-2xl font-title font-bold text-primary mb-6">{{ title }}</h2>
      
      <form #contactForm="ngForm" (ngSubmit)="onSubmit(contactForm)" novalidate>
        <!-- Name Field -->
        <app-input-field
          id="contact-name"
          label="Nom"
          [required]="true"
          [(value)]="formData.name"
          [error]="formErrors['name']"
        ></app-input-field>
        
        <!-- Email Field -->
        <app-input-field
          id="contact-email"
          label="Email"
          type="email"
          [required]="true"
          [(value)]="formData.email"
          [error]="formErrors['email']"
        ></app-input-field>
        
        <!-- Phone Field -->
        <app-input-field
          id="contact-phone"
          label="Téléphone"
          type="tel"
          [value]="formData.phone || ''"
          (valueChange)="formData.phone = $event"
        ></app-input-field>
        
        <!-- Subject Field -->
        <app-select-dropdown
          id="contact-subject"
          label="Sujet"
          [required]="true"
          [options]="subjectOptions"
          [(value)]="formData.subject"
          [error]="formErrors['subject']"
        ></app-select-dropdown>
        
        <!-- Message Field -->
        <div class="mb-6">
          <label for="contact-message" class="block mb-2 font-body font-semibold text-text">
            Message <span class="text-error">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows="5"
            [(ngModel)]="formData.message"
            required
            class="w-full px-4 py-3 bg-dark-200 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            [ngClass]="{'border-error': formErrors['message'], 'border-dark-300': !formErrors['message']}"
          ></textarea>
          <div *ngIf="formErrors['message']" class="mt-1 text-sm text-error">
            {{ formErrors['message'] }}
          </div>
        </div>
        
        <!-- GDPR Consent -->
        <div class="mb-6">
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="gdpr-consent" 
              name="gdprConsent"
              [(ngModel)]="gdprConsent"
              required
              class="appearance-none h-5 w-5 border border-dark-300 rounded bg-dark-200 checked:bg-primary checked:border-primary checked:focus:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition-colors cursor-pointer"
            />
            <label for="gdpr-consent" class="ml-2 text-text text-sm cursor-pointer">
              J'accepte que mes informations soient utilisées pour me recontacter concernant ma demande.
            </label>
          </div>
          <div *ngIf="formErrors['gdprConsent']" class="mt-1 text-sm text-error">
            {{ formErrors['gdprConsent'] }}
          </div>
        </div>
        
        <!-- Submit Button -->
        <div class="flex justify-end">
          <app-button 
            type="submit" 
            [disabled]="isSubmitting || (!contactForm.valid || !gdprConsent)"
            [fullWidth]="true"
          >
            <div class="flex items-center justify-center">
              <span *ngIf="!isSubmitting">Envoyer</span>
              <div *ngIf="isSubmitting" class="flex items-center">
                <div class="animate-spin h-5 w-5 border-2 border-background border-t-transparent rounded-full mr-2"></div>
                Envoi en cours...
              </div>
            </div>
          </app-button>
        </div>
        
        <!-- Success / Error Messages -->
        <div *ngIf="submitSuccess" class="mt-4 bg-success bg-opacity-10 text-success p-4 rounded">
          Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
        </div>
        
        <div *ngIf="submitError" class="mt-4 bg-error bg-opacity-10 text-error p-4 rounded">
          Une erreur est survenue lors de l'envoi du message. Veuillez réessayer ultérieurement.
        </div>
      </form>
    </div>
  `
})
export class ContactFormComponent {
  @Input() title = 'Contactez-nous';
  @Input() subjectOptions = [
    { value: '', label: 'Sélectionnez un sujet' },
    { value: 'reservation', label: 'Réservation' },
    { value: 'information', label: 'Demande d\'information' },
    { value: 'feedback', label: 'Commentaires' },
    { value: 'complaint', label: 'Réclamation' },
    { value: 'partnership', label: 'Partenariat' },
    { value: 'other', label: 'Autre' }
  ];
  
  @Output() formSubmit = new EventEmitter<ContactFormData>();
  
  formData: ContactFormData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };
  
  formErrors: { [key: string]: string } = {};
  gdprConsent = false;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  
  onSubmit(form: NgForm) {
    // Reset error states
    this.formErrors = {};
    this.submitSuccess = false;
    this.submitError = false;
    
    // Form validation
    if (!form.valid || !this.gdprConsent) {
      this.validateForm();
      return;
    }
    
    // Show submitting state
    this.isSubmitting = true;
    
    // Emit form data
    this.formSubmit.emit(this.formData);
    
    // Simulate API call (replace with actual API call)
    setTimeout(() => {
      this.isSubmitting = false;
      
      // Successful submission
      this.submitSuccess = true;
      
      // Reset form
      this.resetForm(form);
    }, 1500);
  }
  
  private validateForm() {
    if (!this.formData.name) {
      this.formErrors['name'] = 'Veuillez entrer votre nom';
    }
    
    if (!this.formData.email) {
      this.formErrors['email'] = 'Veuillez entrer votre email';
    } else if (!this.isValidEmail(this.formData.email)) {
      this.formErrors['email'] = 'Veuillez entrer un email valide';
    }
    
    if (!this.formData.subject) {
      this.formErrors['subject'] = 'Veuillez sélectionner un sujet';
    }
    
    if (!this.formData.message) {
      this.formErrors['message'] = 'Veuillez entrer votre message';
    }
    if (!this.gdprConsent) {
      this.formErrors['gdprConsent'] = 'Vous devez accepter les conditions';
    }
  }
  
  private isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
  
  private resetForm(form: NgForm) {
    form.resetForm();
    this.formData = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
    this.gdprConsent = false;
  }
}