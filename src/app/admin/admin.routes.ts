// src/app/admin/admin.routes.ts
import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/admin-dashboard/admin-dashboard.component')
      .then(m => m.AdminDashboardComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/admin-login/admin-login.component')
      .then(m => m.AdminLoginComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth/forgot-password/forgot-password.component')
      .then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'spaces',
    children: [
      {
        path: '',
        loadComponent: () => import('./space-management/spaces-list/spaces-list.component')
          .then(m => m.SpacesListComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./space-management/space-create/space-create.component')
          .then(m => m.SpaceCreateComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./space-management/space-details/space-details.component')
          .then(m => m.SpaceDetailsComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./space-management/space-edit/space-edit.component')
          .then(m => m.SpaceEditComponent)
      }
    ]
  },
  {
    path: 'bookings',
    children: [
      {
        path: '',
        loadComponent: () => import('./booking-management/booking-list/booking-list.component')
          .then(m => m.BookingListComponent)
      },
      {
        path: 'search',
        loadComponent: () => import('./booking-management/booking-search/booking-search.component')
          .then(m => m.BookingSearchComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./booking-management/booking-details/booking-details.component')
          .then(m => m.BookingDetailsComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./booking-management/booking-edit/booking-edit.component')
          .then(m => m.BookingEditComponent)
      }
    ]
  },
  {
    path: 'reports',
    children: [
      {
        path: 'bookings',
        loadComponent: () => import('./reports-analytics/booking-reports/booking-reports.component')
          .then(m => m.BookingReportsComponent)
      },
      {
        path: 'occupancy',
        loadComponent: () => import('./reports-analytics/occupancy-reports/occupancy-reports.component')
          .then(m => m.OccupancyReportsComponent)
      },
      {
        path: 'revenue',
        loadComponent: () => import('./reports-analytics/revenue-reports/revenue-reports.component')
          .then(m => m.RevenueReportsComponent)
      }
    ]
  },
  {
    path: 'settings',
    children: [
      {
        path: 'general',
        loadComponent: () => import('./settings/general-settings/general-settings.component')
          .then(m => m.GeneralSettingsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./settings/notification-settings/notification-settings.component')
          .then(m => m.NotificationSettingsComponent)
      },
      {
        path: 'pricing',
        loadComponent: () => import('./settings/pricing-settings/pricing-settings.component')
          .then(m => m.PricingSettingsComponent)
      }
    ]
  },
  {
    path: 'users',
    children: [
      {
        path: '',
        loadComponent: () => import('./user-management/admin-users-list/admin-users-list.component')
          .then(m => m.AdminUsersListComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./user-management/admin-user-create/admin-user-create.component')
          .then(m => m.AdminUserCreateComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./user-management/admin-user-details/admin-user-details.component')
          .then(m => m.AdminUserDetailsComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./user-management/admin-user-edit/admin-user-edit.component')
          .then(m => m.AdminUserEditComponent)
      }
    ]
  }
];