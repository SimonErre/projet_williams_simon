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
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(Auth);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
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

    const expectedUrl = service.apiUrl.endsWith('/users') || service.apiUrl.endsWith('/signup')
      ? service.apiUrl
      : `${service.apiUrl}/signup`;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockResponse);
  });
});

