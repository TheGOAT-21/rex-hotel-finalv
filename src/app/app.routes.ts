// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { adminAuthGuard } from './core/guards/admin-auth.guard';

export const routes: Routes = [
  // Routes publiques
  {
    path: '',
    loadChildren: () => import('./public/public.routes')
      .then(m => m.PUBLIC_ROUTES)
  },
  
  // Routes administratives (protégées par guard)
  {
    path: 'admin',
    canActivate: [adminAuthGuard],
    loadChildren: () => import('./admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  },
  
  // Route page non trouvée
  {
    path: '**',
    redirectTo: ''
  }
];