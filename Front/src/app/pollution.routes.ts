import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { pendingChangesGuard } from './guards/pending-changes.guard';

/**
 * Routes du domaine fonctionnel "Pollutions" chargées en différé (Lazy Loading - Séance 5)
 */
export const POLLUTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pollution-list/pollution-list').then((m) => m.PollutionList),
  },
  {
    path: 'new',
    canActivate: [authGuard],
    canDeactivate: [pendingChangesGuard],
    loadComponent: () => import('./pollution-form/pollution-form').then((m) => m.PollutionForm),
  },
  {
    path: 'edit/:id',
    canActivate: [authGuard],
    canDeactivate: [pendingChangesGuard],
    loadComponent: () => import('./pollution-form/pollution-form').then((m) => m.PollutionForm),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pollution-detail/pollution-detail').then((m) => m.PollutionDetail),
  },
];
