import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User, UserSignUp } from '../models/user.model';
import { environment } from '../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpTesting: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/users`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(UserService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the list of users (GET /api/users)', () => {
    const mockUsers: User[] = [
      { id: 1, login: 'admin', nom: 'Admin', prenom: 'Super', email: 'admin@cnam.fr' },
      { id: 2, login: 'simon', nom: 'Erre', prenom: 'Simon', email: 'simon.erre@cnam.fr' },
    ];

    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
      expect(users.length).toBe(2);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should fetch a single user by ID (GET /api/users/:id)', () => {
    const mockUser: User = {
      id: 1,
      login: 'admin',
      nom: 'Admin',
      prenom: 'Super',
      email: 'admin@cnam.fr',
    };

    service.getUserById(1).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should create a new user (POST /api/users)', () => {
    const newUser: Partial<UserSignUp> = {
      login: 'alice',
      password: 'password123',
      nom: 'Dupont',
      prenom: 'Alice',
      email: 'alice.dupont@cnam.fr',
    };

    const createdUser: User = {
      id: 3,
      login: 'alice',
      nom: 'Dupont',
      prenom: 'Alice',
      email: 'alice.dupont@cnam.fr',
    };

    service.createUser(newUser).subscribe((res) => {
      expect(res).toEqual(createdUser);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(createdUser);
  });

  it('should delete a user by ID (DELETE /api/users/:id)', () => {
    service.deleteUser(2).subscribe((res) => {
      expect(res).toEqual({ success: true });
    });

    const req = httpTesting.expectOne(`${baseUrl}/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  it('should authenticate user (POST /api/users/login)', () => {
    const credentials = { login: 'admin', password: 'password123' };
    const mockAuthResponse = {
      message: 'Connexion réussie !',
      user: { id: 1, login: 'admin', nom: 'Admin', prenom: 'Super', email: 'admin@cnam.fr' },
      token: 'mock-jwt-token-1',
    };

    service.login(credentials).subscribe((res) => {
      expect(res.user.login).toBe('admin');
      expect(res.token).toBeDefined();
    });

    const req = httpTesting.expectOne(`${baseUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockAuthResponse);
  });
});
