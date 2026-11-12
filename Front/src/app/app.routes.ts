import { Routes } from '@angular/router';
import { authGuard, canMatchAuthGuard } from './guards/auth.guard';
import { pendingChangesGuard } from './guards/pending-changes.guard';

/**
 * Configuration des routes principales de l'application (TP 05 / Séance 5)
 * - Découpage fonctionnel et Lazy loading (loadChildren & loadComponent)
 * - Sécurisation par Route Guards (canActivate, canMatch, canDeactivate)
 * - Redirection propre des utilisateurs non authentifiés
 */
export const routes: Routes = [
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },

  // Module différé des pollutions (Lazy Loading via loadChildren)
  {
    path: 'pollutions',
    loadChildren: () => import('./pollution.routes').then((m) => m.POLLUTION_ROUTES),
  },

  // Alias /pollution protégé par authGuard et pendingChangesGuard
  {
    path: 'pollution',
    canActivate: [authGuard],
    canDeactivate: [pendingChangesGuard],
    loadComponent: () => import('./pollution-form/pollution-form').then((m) => m.PollutionForm),
  },

  // Gestion des utilisateurs (Route protégée avec canMatch et canActivate)
  {
    path: 'users',
    canMatch: [canMatchAuthGuard],
    canActivate: [authGuard],
    loadComponent: () => import('./user-list/user-list').then((m) => m.UserList),
  },
  {
    path: 'users/new',
    loadComponent: () => import('./signup/signup').then((m) => m.Signup),
  },

  // Authentification et Inscription (Chargement différé)
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup').then((m) => m.Signup),
  },

  // Route Wildcard
  { path: '**', redirectTo: 'pollutions' },
];
