import { inject, Injectable } from '@angular/core';
import {
  CanActivateFn,
  CanMatchFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route,
  UrlSegment,
  UrlTree,
  CanActivate,
  CanMatch,
} from '@angular/router';
import { Auth } from '../services/auth';

/**
 * Guard fonctionnel canActivate pour sécuriser les routes (TP 05 / Séance 5).
 * Vérifie si l'utilisateur est connecté via AuthService.
 * S'il n'est pas connecté, il est redirigé proprement vers la page /login
 * avec l'URL demandée transmise en paramètre de requête (returnUrl).
 */
export const authGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean | UrlTree => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirection propre vers /login avec conservation de l'URL cible
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

/**
 * Guard fonctionnel canMatch (Séance 5 - Slide 11) :
 * Évalue la pertinence d'une route entière avant d'en charger le code ou le chunk différé.
 */
export const canMatchAuthGuard: CanMatchFn = (
  _route: Route,
  segments: UrlSegment[],
): boolean | UrlTree => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  const targetPath = '/' + segments.map((s) => s.path).join('/');
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: targetPath },
  });
};

/**
 * Classe AuthGuard pour rétro-compatibilité éventuelle avec les déclarations par classe
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanMatch {
  private authService = inject(Auth);
  private router = inject(Router);

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  canMatch(_route: Route, segments: UrlSegment[]): boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    const targetPath = '/' + segments.map((s) => s.path).join('/');
    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl: targetPath },
    });
  }
}
