import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { provideRouter } from '@angular/router';
import { authGuard, canMatchAuthGuard, AuthGuard } from './auth.guard';
import { Auth } from '../services/auth';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AuthGuards (TP 05)', () => {
  let authService: Auth;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });

    authService = TestBed.inject(Auth);
    router = TestBed.inject(Router);
    authService.logout();
  });

  describe('authGuard (CanActivate)', () => {
    it("devrait autoriser l'accès si l'utilisateur est connecté", () => {
      authService.currentUser.set({
        id: 1,
        login: 'admin',
        nom: 'Admin',
        prenom: 'Super',
        email: 'admin@cnam.fr',
      });

      const mockRoute = {} as ActivatedRouteSnapshot;
      const mockState = { url: '/pollution' } as RouterStateSnapshot;

      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('devrait bloquer et rediriger vers /login avec returnUrl si non connecté', () => {
      authService.currentUser.set(null);

      const mockRoute = {} as ActivatedRouteSnapshot;
      const mockState = { url: '/pollution' } as RouterStateSnapshot;

      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
      expect(result instanceof UrlTree).toBe(true);

      const urlTree = result as UrlTree;
      expect(router.serializeUrl(urlTree)).toBe('/login?returnUrl=%2Fpollution');
    });
  });

  describe('canMatchAuthGuard (CanMatch)', () => {
    it('devrait valider la correspondance de route si connecté', () => {
      authService.currentUser.set({
        id: 2,
        login: 'simon',
        nom: 'Erre',
        prenom: 'Simon',
        email: 'simon@cnam.fr',
      });

      const result = TestBed.runInInjectionContext(() =>
        canMatchAuthGuard({} as any, [{ path: 'users' }] as any, {} as any),
      );
      expect(result).toBe(true);
    });

    it('devrait rediriger vers /login si non connecté', () => {
      authService.currentUser.set(null);

      const result = TestBed.runInInjectionContext(() =>
        canMatchAuthGuard({} as any, [{ path: 'users' }] as any, {} as any),
      );
      expect(result instanceof UrlTree).toBe(true);
      expect(router.serializeUrl(result as UrlTree)).toBe('/login?returnUrl=%2Fusers');
    });
  });

  describe('AuthGuard (Classe)', () => {
    it('devrait fonctionner de manière identique via la méthode canActivate', () => {
      const guard = TestBed.inject(AuthGuard);
      const mockRoute = {} as ActivatedRouteSnapshot;
      const mockState = { url: '/users' } as RouterStateSnapshot;

      authService.currentUser.set(null);
      const redirectTree = guard.canActivate(mockRoute, mockState);
      expect(redirectTree instanceof UrlTree).toBe(true);

      authService.currentUser.set({
        id: 1,
        login: 'admin',
        nom: 'Admin',
        prenom: 'Super',
        email: 'admin@cnam.fr',
      });
      expect(guard.canActivate(mockRoute, mockState)).toBe(true);
    });
  });
});
