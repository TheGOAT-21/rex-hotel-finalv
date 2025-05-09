// src/app/public/public.routes.ts
import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact-page/contact-page.component').then(m => m.ContactPageComponent)
  },
  {
    path: 'spaces',
    loadComponent: () => import('./spaces/spaces.component').then(m => m.SpacesComponent)
  },
  {
    path: 'booking',
    children: [
      {
        path: '',
        loadComponent: () => import('./booking/availability-search/availability-search.component')
          .then(m => m.AvailabilitySearchComponent)
      },
      {
        path: 'selection',
        loadComponent: () => import('./booking/space-selection/space-selection.component')
          .then(m => m.SpaceSelectionComponent)
      },
      {
        path: 'guest-info',
        loadComponent: () => import('./booking/guest-information-form/guest-information-form.component')
          .then(m => m.GuestInformationFormComponent)
      },
      {
        path: 'summary',
        loadComponent: () => import('./booking/booking-summary/booking-summary.component')
          .then(m => m.BookingSummaryComponent)
      },
      {
        path: 'confirmation/:code',
        loadComponent: () => import('./booking/booking-confirmation/booking-confirmation.component')
          .then(m => m.BookingConfirmationComponent)
      },
      {
        path: 'lookup',
        loadComponent: () => import('./booking/booking-lookup/booking-lookup.component')
          .then(m => m.BookingLookupComponent)
      }
    ]
  }
];