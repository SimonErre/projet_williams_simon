import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Login } from './login';
import { Auth } from '../services/auth';

describe('Login Component (TP 05)', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockAuthService: any;
  let router: Router;

  beforeEach(async () => {
    mockAuthService = {
      login: () =>
        of({
          message: 'Connexion réussie !',
          user: { id: 1, login: 'admin', nom: 'Admin', prenom: 'Super', email: 'admin@cnam.fr' },
          token: 'mock-token',
        }),
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), { provide: Auth, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('devrait créer le composant de connexion', () => {
    expect(component).toBeTruthy();
  });

  it('devrait pré-remplir les champs avec fillDemoAccount', () => {
    component.fillDemoAccount('admin');
    expect(component.login()).toBe('admin');
    expect(component.password()).toBe('password123');
  });

  it("devrait appeler authService.login et rediriger lors d'une soumission réussie", () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    component.login.set('admin');
    component.password.set('password123');

    component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith('/pollutions');
    expect(component.isLoading()).toBe(false);
  });

  it("devrait afficher un message d'erreur si la connexion échoue", () => {
    mockAuthService.login = () =>
      throwError(() => ({
        error: { message: 'Identifiants invalides' },
      }));

    component.login.set('wronguser');
    component.password.set('wrongpass');
    component.onSubmit();

    expect(component.errorMessage()).toBe('Identifiants invalides');
    expect(component.isLoading()).toBe(false);
  });
});
