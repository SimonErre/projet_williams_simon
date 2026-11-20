import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Auth, UserSignUp } from './auth';
import { environment } from '../../environments/environment';

describe('Auth', () => {
  let service: Auth;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Auth);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    service.logout();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to sign up user', () => {
    const mockUser: Partial<UserSignUp> = {
      login: 'testuser',
      password: 'password123',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
    };

    const mockResponse = { success: true, message: 'User registered' };

    service.signUp(mockUser).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const expectedUrl =
      service.apiUrl.endsWith('/users') || service.apiUrl.endsWith('/signup')
        ? service.apiUrl
        : `${service.apiUrl}/signup`;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockResponse);
  });

  it('should authenticate user on login(), update currentUser/isAuthenticated and store token', () => {
    const credentials = { login: 'simon', password: 'password123' };
    const mockAuthResponse = {
      message: 'Connexion réussie !',
      user: {
        id: 2,
        login: 'simon',
        nom: 'Erre',
        prenom: 'Simon',
        email: 'simon.erre@cnam.fr',
      },
      token: 'jwt-token-test-123',
    };

    service.login(credentials).subscribe((res) => {
      expect(res).toEqual(mockAuthResponse);
    });

    const req = httpTestingController.expectOne(`${service.apiUrl}/users/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockAuthResponse);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()).toEqual(mockAuthResponse.user);
    expect(service.getToken()).toBe('jwt-token-test-123');
  });

  it('should clear currentUser, isAuthenticated and token on logout()', () => {
    const mockAuthResponse = {
      message: 'Connexion réussie !',
      user: {
        id: 1,
        login: 'admin',
        nom: 'Admin',
        prenom: 'Super',
        email: 'admin@cnam.fr',
      },
      token: 'jwt-token-admin',
    };

    service.login({ login: 'admin', password: 'password123' }).subscribe();
    const req = httpTestingController.expectOne(`${service.apiUrl}/users/login`);
    req.flush(mockAuthResponse);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.getToken()).toBe('jwt-token-admin');

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(service.getToken()).toBeNull();
  });
});
