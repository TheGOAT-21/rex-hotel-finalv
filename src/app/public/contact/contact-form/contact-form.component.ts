// src/app/public/contact/contact-form/contact-form.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { InputFieldComponent } from '../../../shared/components/forms/input-field/input-field.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { SelectDropdownComponent } from '../../../shared/components/forms/select-dropdown/select-dropdown.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { NotificationService } from '../../../core/services/notification.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  gdprConsent: boolean;
}

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputFieldComponent,
    ButtonComponent,
    SelectDropdownComponent,
    AlertComponent,
    CardComponent
  ],
  template: `
    <app-card>
      <h2 class="text-2xl font-title font-bold text-primary mb-6">{{ title }}</h2>
      
      <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
        <!-- Name Field -->
        <app-input-field
          id="contact-name"
          label="Nom"
          [required]="true"
          [value]="contactForm.get('name')?.value"
          (valueChange)="updateForm('name', $event)"
          [error]="getErrorMessage('name')"
        ></app-input-field>
        
        <!-- Email Field -->
        <app-input-field
          id="contact-email"
          label="Email"
          type="email"
          [required]="true"
          [value]="contactForm.get('email')?.value"
          (valueChange)="updateForm('email', $event)"
          [error]="getErrorMessage('email')"
        ></app-input-field>
        
        <!-- Phone Field -->
        <app-input-field
          id="contact-phone"
          label="Téléphone"
          type="tel"
          [value]="contactForm.get('phone')?.value"
          (valueChange)="updateForm('phone', $event)"
          [error]="getErrorMessage('phone')"
        ></app-input-field>
        
        <!-- Subject Field -->
        <app-select-dropdown
          id="contact-subject"
          label="Sujet"
          [required]="true"
          [options]="subjectOptions"
          [value]="contactForm.get('subject')?.value"
          (valueChange)="updateForm('subject', $event)"
          [error]="getErrorMessage('subject')"
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
            formControlName="message"
            required
            (input)="onMessageInput($event)"
            class="w-full px-4 py-3 bg-dark-200 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            [ngClass]="{'border-error': getErrorMessage('message'), 'border-dark-300': !getErrorMessage('message')}"
          ></textarea>
          <div *ngIf="getErrorMessage('message')" class="mt-1 text-sm text-error">
            {{ getErrorMessage('message') }}
          </div>
          
          <!-- Character Count -->
          <div class="mt-1 text-sm text-text opacity-70 flex justify-between">
            <span>{{ remainingChars }} caractères restants</span>
            <span *ngIf="isAutoSaved" class="text-success">Brouillon sauvegardé</span>
          </div>
        </div>
        
        <!-- GDPR Consent -->
        <div class="mb-6">
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="gdpr-consent" 
              formControlName="gdprConsent"
              class="appearance-none h-5 w-5 border border-dark-300 rounded bg-dark-200 checked:bg-primary checked:border-primary checked:focus:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition-colors cursor-pointer"
            />
            <label for="gdpr-consent" class="ml-2 text-text text-sm cursor-pointer">
              J'accepte que mes informations soient utilisées pour me recontacter concernant ma demande.
            </label>
          </div>
          <div *ngIf="getErrorMessage('gdprConsent')" class="mt-1 text-sm text-error">
            {{ getErrorMessage('gdprConsent') }}
          </div>
        </div>
        
        <!-- Submit Button -->
        <div class="flex justify-end">
          <button 
            type="submit" 
            class="bg-primary text-background font-bold uppercase px-6 py-3 rounded hover:bg-primary-hover transition-colors disabled:bg-disabled disabled:cursor-not-allowed"
            [disabled]="contactForm.invalid || isSubmitting"
          >
            <div class="flex items-center justify-center">
              <span *ngIf="!isSubmitting">Envoyer</span>
              <div *ngIf="isSubmitting" class="flex items-center">
                <div class="animate-spin h-5 w-5 border-2 border-background border-t-transparent rounded-full mr-2"></div>
                Envoi en cours...
              </div>
            </div>
          </button>
        </div>
      </form>
      
      <!-- Draft Actions -->
      <div *ngIf="hasDraft" class="mt-4 flex justify-between items-center border-t border-dark-300 pt-4">
        <span class="text-text text-sm">Un brouillon est disponible</span>
        <div class="space-x-4">
          <button 
            (click)="clearDraft()"
            class="text-error hover:underline text-sm"
          >
            Supprimer le brouillon
          </button>
          <button 
            (click)="loadDraft()"
            class="text-primary hover:underline text-sm"
          >
            Charger le brouillon
          </button>
        </div>
      </div>
    </app-card>
  `
})
export class ContactFormComponent implements OnInit, OnDestroy {
  title = 'Contactez-nous';
  contactForm: FormGroup;
  isSubmitting = false;
  isAutoSaved = false;
  hasDraft = false;
  maxLength = 1000;
  remainingChars = this.maxLength;
  private autoSaveSubscription?: Subscription;
  private readonly STORAGE_KEY = 'contact_form_draft';
  
  subjectOptions = [
    { value: '', label: 'Sélectionnez un sujet' },
    { value: 'reservation', label: 'Réservation' },
    { value: 'information', label: 'Demande d\'information' },
    { value: 'feedback', label: 'Commentaires' },
    { value: 'complaint', label: 'Réclamation' },
    { value: 'partnership', label: 'Partenariat' },
    { value: 'other', label: 'Autre' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private storageService: LocalStorageService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.maxLength(this.maxLength)]],
      gdprConsent: [false, Validators.requiredTrue]
    });
  }
  
  ngOnInit(): void {
    // Vérifier s'il existe un brouillon
    const draft = this.storageService.get<ContactFormData>(this.STORAGE_KEY);
    this.hasDraft = !!draft;
    
    // Configurer l'auto-sauvegarde
    this.autoSaveSubscription = this.contactForm.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(() => {
      if (this.contactForm.dirty && !this.contactForm.pristine) {
        this.saveDraft();
      }
    });
  }
  
  ngOnDestroy(): void {
    if (this.autoSaveSubscription) {
      this.autoSaveSubscription.unsubscribe();
    }
  }
  
  updateForm(controlName: string, value: any): void {
    this.contactForm.patchValue({ [controlName]: value });
    this.contactForm.get(controlName)?.markAsTouched();
  }
  
  onMessageInput(event: any): void {
    const value = event.target.value;
    this.remainingChars = this.maxLength - value.length;
  }
  
  getErrorMessage(controlName: string): string {
    const control = this.contactForm.get(controlName);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }
    
    if (control.errors['required']) {
      return 'Ce champ est requis';
    }
    
    if (control.errors['email']) {
      return 'Veuillez entrer une adresse email valide';
    }
    
    if (control.errors['maxlength']) {
      return `Maximum ${this.maxLength} caractères`;
    }
    
    if (control.errors['requiredTrue']) {
      return 'Vous devez accepter les conditions';
    }
    
    return 'Valeur invalide';
  }
  
  saveDraft(): void {
    const formValue = this.contactForm.value;
    this.storageService.set(this.STORAGE_KEY, formValue);
    this.isAutoSaved = true;
    this.hasDraft = true;
    
    // Reset le status après 3 secondes
    setTimeout(() => {
      this.isAutoSaved = false;
    }, 3000);
  }
  
  loadDraft(): void {
    const draft = this.storageService.get<ContactFormData>(this.STORAGE_KEY);
    if (draft) {
      this.contactForm.patchValue(draft);
      this.remainingChars = this.maxLength - (draft.message?.length || 0);
      this.notificationService.showInfo('Brouillon chargé avec succès');
    }
  }
  
  clearDraft(): void {
    this.storageService.remove(this.STORAGE_KEY);
    this.hasDraft = false;
    this.contactForm.reset();
    this.notificationService.showInfo('Brouillon supprimé');
  }
  
  onSubmit(): void {
    if (this.contactForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    
    // Simuler un appel API
    setTimeout(() => {
      this.isSubmitting = false;
      
      // Supprimer le brouillon en cas de succès
      this.storageService.remove(this.STORAGE_KEY);
      this.hasDraft = false;
      
      // Réinitialiser le formulaire
      this.contactForm.reset();
      
      // Afficher une notification de succès
      this.notificationService.showSuccess(
        'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
        'Message envoyé'
      );
    }, 1500);
  }
}