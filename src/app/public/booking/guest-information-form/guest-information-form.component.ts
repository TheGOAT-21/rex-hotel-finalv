// src/app/public/booking/guest-information-form/guest-information-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SectionTitleComponent } from '../../../shared/components/content/section-title/section-title.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { InputFieldComponent } from '../../../shared/components/forms/input-field/input-field.component';
import { SelectDropdownComponent } from '../../../shared/components/forms/select-dropdown/select-dropdown.component';
import { CheckboxComponent } from '../../../shared/components/forms/checkbox/checkbox.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { BookingService } from '../../../core/services/booking.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BookingStatus, GuestInfo, PaymentStatus } from '../../../core/interfaces/booking.interface';
import { SpaceType } from '../../../core/interfaces/space.interface';

@Component({
  selector: 'app-guest-information-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SectionTitleComponent,
    CardComponent,
    InputFieldComponent,
    SelectDropdownComponent,
    CheckboxComponent,
    ButtonComponent,
    AlertComponent
  ],
  template: `
  <!-- Template reste le même que précédemment -->
  `
})
export class GuestInformationFormComponent implements OnInit {
  bookingQueryParams: any = {
    checkIn: '',
    checkOut: '',
    spaceId: '',
    spaceName: '',
    spaceType: '',
    adults: 1,
    children: 0,
    price: 0,
    nights: 0,
    promo: ''
  };
  
  missingQueryParams = false;
  isSubmitting = false;
  
  countryOptions = [
    { value: '', label: 'Sélectionnez un pays' },
    { value: 'FR', label: 'France' },
    { value: 'CI', label: 'Côte d\'Ivoire' },
    { value: 'BE', label: 'Belgique' },
    { value: 'CH', label: 'Suisse' },
    { value: 'CA', label: 'Canada' },
    { value: 'SN', label: 'Sénégal' },
    { value: 'GB', label: 'Royaume-Uni' },
    { value: 'US', label: 'États-Unis' }
  ];
  
  arrivalTimeOptions = [
    { value: '', label: 'Sélectionnez une heure d\'arrivée' },
    { value: '14:00-16:00', label: '14:00 - 16:00' },
    { value: '16:00-18:00', label: '16:00 - 18:00' },
    { value: '18:00-20:00', label: '18:00 - 20:00' },
    { value: '20:00-22:00', label: '20:00 - 22:00' },
    { value: 'after-22:00', label: 'Après 22:00' }
  ];
  
  guestForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private notificationService: NotificationService
  ) {
    this.initializeForm();
  }
  
  ngOnInit(): void {
    // Get query parameters from the URL
    this.route.queryParams.subscribe(params => {
      if (!params['checkIn'] || !params['checkOut'] || !params['spaceId'] || !params['price']) {
        this.missingQueryParams = true;
        return;
      }
      
      this.bookingQueryParams = {
        checkIn: params['checkIn'],
        checkOut: params['checkOut'],
        spaceId: params['spaceId'],
        spaceName: params['spaceName'],
        spaceType: params['spaceType'] || SpaceType.ROOM,
        adults: Number(params['adults']) || 1,
        children: Number(params['children']) || 0,
        price: Number(params['price']) || 0,
        nights: Number(params['nights']) || 1,
        promo: params['promo']
      };
    });
  }
  
  private initializeForm(): void {
    this.guestForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      country: ['', Validators.required],
      city: [''],
      postalCode: [''],
      address: [''],
      specialRequests: [''],
      arrivalTime: [''],
      termsAccepted: [false, Validators.requiredTrue],
      paymentMethod: ['creditCard', Validators.required],
      cardholderName: [''],
      cardNumber: [''],
      expiryDate: [''],
      cvv: ['']
    });
    
    // Add card validation when payment method is credit card
    this.guestForm.get('paymentMethod')?.valueChanges.subscribe(
      method => this.setCardValidation(method)
    );
  }
  
  private setCardValidation(paymentMethod: string): void {
    const cardControls = ['cardholderName', 'cardNumber', 'expiryDate', 'cvv'];
    
    if (paymentMethod === 'creditCard') {
      cardControls.forEach(control => {
        this.guestForm.get(control)?.setValidators([Validators.required]);
      });
      this.guestForm.get('cardNumber')?.addValidators([Validators.pattern(/^\d{16}$/)]);
      this.guestForm.get('expiryDate')?.addValidators([Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
      this.guestForm.get('cvv')?.addValidators([Validators.pattern(/^\d{3,4}$/)]);
    } else {
      cardControls.forEach(control => {
        this.guestForm.get(control)?.clearValidators();
      });
    }
    
    cardControls.forEach(control => {
      this.guestForm.get(control)?.updateValueAndValidity();
    });
  }
  
  onSubmit(): void {
    if (this.guestForm.invalid) {
      Object.keys(this.guestForm.controls).forEach(key => {
        const control = this.guestForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    this.isSubmitting = true;
    
    const guestInfo: GuestInfo = {
      firstName: this.guestForm.get('firstName')?.value,
      lastName: this.guestForm.get('lastName')?.value,
      email: this.guestForm.get('email')?.value,
      phone: this.guestForm.get('phone')?.value,
      country: this.guestForm.get('country')?.value,
      city: this.guestForm.get('city')?.value,
      postalCode: this.guestForm.get('postalCode')?.value,
      address: this.guestForm.get('address')?.value
    };
    
    this.bookingService.createBooking({
      guestInfo: guestInfo,
      spaceId: this.bookingQueryParams.spaceId,
      spaceType: this.bookingQueryParams.spaceType as SpaceType,
      checkIn: new Date(this.bookingQueryParams.checkIn),
      checkOut: new Date(this.bookingQueryParams.checkOut),
      guests: {
        adults: this.bookingQueryParams.adults,
        children: this.bookingQueryParams.children
      },
      totalPrice: this.bookingQueryParams.price * this.bookingQueryParams.nights,
      specialRequests: this.guestForm.get('specialRequests')?.value
    }).subscribe({
      next: (booking) => {
        this.notificationService.showSuccess('Votre réservation a été créée avec succès!');
        this.router.navigate(['/booking/confirmation', booking.confirmationCode], {
          queryParams: {
            checkIn: this.bookingQueryParams.checkIn,
            checkOut: this.bookingQueryParams.checkOut,
            spaceName: this.bookingQueryParams.spaceName,
            nights: this.bookingQueryParams.nights,
            price: this.bookingQueryParams.price,
            totalPrice: this.bookingQueryParams.price * this.bookingQueryParams.nights,
            firstName: guestInfo.firstName,
            lastName: guestInfo.lastName,
            email: guestInfo.email
          }
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        this.notificationService.showError('Une erreur est survenue lors de la création de votre réservation. Veuillez réessayer.');
        console.error('Booking creation error:', error);
      }
    });
  }
  
  updateForm(controlName: string, value: any): void {
    this.guestForm.patchValue({ [controlName]: value });
    this.guestForm.get(controlName)?.markAsTouched();
  }
  
  getErrorMessage(controlName: string): string {
    const control = this.guestForm.get(controlName);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }
    
    if (control.errors['required']) {
      return 'Ce champ est requis';
    }
    
    if (control.errors['email']) {
      return 'Veuillez entrer une adresse email valide';
    }
    
    if (control.errors['pattern']) {
      if (controlName === 'cardNumber') {
        return 'Le numéro de carte doit contenir 16 chiffres';
      }
      if (controlName === 'expiryDate') {
        return 'Format invalide (MM/AA)';
      }
      if (controlName === 'cvv') {
        return 'Le CVV doit contenir 3 ou 4 chiffres';
      }
    }
    
    if (control.errors['requiredTrue']) {
      return 'Vous devez accepter les conditions';
    }
    
    return 'Valeur invalide';
  }
  
  goBack(): void {
    this.router.navigate(['/booking/selection'], {
      queryParams: {
        checkIn: this.bookingQueryParams.checkIn,
        checkOut: this.bookingQueryParams.checkOut,
        spaceType: this.bookingQueryParams.spaceType,
        adults: this.bookingQueryParams.adults,
        children: this.bookingQueryParams.children,
        promo: this.bookingQueryParams.promo
      }
    });
  }
}