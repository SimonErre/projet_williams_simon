import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Pollution } from '../models/pollution.model';
import { User } from '../models/user.model';
import { INITIAL_POLLUTIONS } from '../mock/mock-pollutions';
import { environment } from '../../environments/environment';

const POLLUTIONS_KEY = 'mock_pollutions';
const USERS_KEY = 'mock_users';

const INITIAL_USERS: User[] = [
  { id: 1, login: 'admin', nom: 'Admin', prenom: 'Super', email: 'admin@cnam.fr' },
  { id: 2, login: 'simon', nom: 'Erre', prenom: 'Simon', email: 'simon.erre@cnam.fr' },
  { id: 3, login: 'alice', nom: 'Dupont', prenom: 'Alice', email: 'alice.dupont@cnam.fr' },
];

function getStoredPollutions(): Pollution[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    const data = localStorage.getItem(POLLUTIONS_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        // En cas d'erreur de parsing, on réinitialise
      }
    }
    localStorage.setItem(POLLUTIONS_KEY, JSON.stringify(INITIAL_POLLUTIONS));
  }
  return [...INITIAL_POLLUTIONS];
}

function saveStoredPollutions(pollutions: Pollution[]): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(POLLUTIONS_KEY, JSON.stringify(pollutions));
  }
}

function getStoredUsers(): User[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    const data = localStorage.getItem(USERS_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        // En cas d'erreur de parsing
      }
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
  }
  return [...INITIAL_USERS];
}

function saveStoredUsers(users: User[]): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  // Si le mock est désactivé dans l'environnement, on transmet la requête au réseau réel
  if (!environment.mockBackend) {
    return next(req);
  }

  const { url, method, body } = req;

  // Intercepte les requêtes ciblant l'API des utilisateurs
  if (url.includes('/users') || url.endsWith('/signup')) {
    const users = getStoredUsers();
    const idMatch = url.match(/\/users\/(\d+)(?:\/)?(?:\?.*)?$/);
    const id = idMatch ? parseInt(idMatch[1], 10) : null;

    // POST /users/login (authentification fictive)
    if (url.includes('/login') && method === 'POST') {
      const loginPayload = body as any;
      const found = users.find((u) => u.login === loginPayload?.login);
      if (found) {
        return of(
          new HttpResponse({
            status: 200,
            body: {
              message: 'Connexion réussie !',
              user: found,
              token: `mock-token-${found.id}-${Date.now()}`,
            },
          }),
        ).pipe(delay(100));
      }
      return throwError(
        () => new HttpResponse({ status: 401, statusText: 'Identifiants invalides' }),
      );
    }

    // GET /users (liste)
    if (method === 'GET' && !id) {
      return of(new HttpResponse({ status: 200, body: users })).pipe(delay(100));
    }

    // GET /users/:id (détail)
    if (method === 'GET' && id) {
      const found = users.find((u) => u.id === id);
      if (found) {
        return of(new HttpResponse({ status: 200, body: found })).pipe(delay(100));
      }
      return throwError(
        () => new HttpResponse({ status: 404, statusText: 'Utilisateur non trouvé' }),
      );
    }

    // POST /users ou POST /signup (création)
    if (method === 'POST') {
      const payload = body as any;
      const maxId = users.reduce((max, u) => (u.id > max ? u.id : max), 0);
      const newUser: User = {
        id: maxId + 1,
        login: payload.login,
        nom: payload.nom,
        prenom: payload.prenom,
        email: payload.email,
      };
      const updatedList = [...users, newUser];
      saveStoredUsers(updatedList);
      return of(new HttpResponse({ status: 201, body: newUser })).pipe(delay(150));
    }

    // DELETE /users/:id (suppression)
    if (method === 'DELETE' && id) {
      const filtered = users.filter((u) => u.id !== id);
      saveStoredUsers(filtered);
      return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(100));
    }
  }

  // Intercepte les requêtes ciblant l'API des pollutions
  if (url.includes('/pollutions')) {
    const pollutions = getStoredPollutions();
    const idMatch = url.match(/\/pollutions\/(\d+)(?:\/)?(?:\?.*)?$/);
    const id = idMatch ? parseInt(idMatch[1], 10) : null;

    // GET /pollutions (liste)
    if (method === 'GET' && !id) {
      return of(new HttpResponse({ status: 200, body: pollutions })).pipe(delay(100));
    }

    // GET /pollutions/:id (détail)
    if (method === 'GET' && id) {
      const found = pollutions.find((p) => p.id === id);
      if (found) {
        return of(new HttpResponse({ status: 200, body: found })).pipe(delay(100));
      }
      return throwError(
        () => new HttpResponse({ status: 404, statusText: 'Pollution non trouvée' }),
      );
    }

    // POST /pollutions (création)
    if (method === 'POST') {
      const maxId = pollutions.reduce((max, p) => (p.id > max ? p.id : max), 0);
      const newPollution: Pollution = {
        ...(body as any),
        id: maxId + 1,
      };
      const updatedList = [newPollution, ...pollutions];
      saveStoredPollutions(updatedList);
      return of(new HttpResponse({ status: 201, body: newPollution })).pipe(delay(150));
    }

    // PUT /pollutions/:id (modification)
    if (method === 'PUT' && id) {
      const index = pollutions.findIndex((p) => p.id === id);
      if (index !== -1) {
        const updatedPollution: Pollution = {
          ...pollutions[index],
          ...(body as any),
          id: id,
        };
        pollutions[index] = updatedPollution;
        saveStoredPollutions(pollutions);
        return of(new HttpResponse({ status: 200, body: updatedPollution })).pipe(delay(150));
      }
      return throwError(
        () => new HttpResponse({ status: 404, statusText: 'Pollution non trouvée' }),
      );
    }

    // DELETE /pollutions/:id (suppression)
    if (method === 'DELETE' && id) {
      const filtered = pollutions.filter((p) => p.id !== id);
      saveStoredPollutions(filtered);
      return of(new HttpResponse({ status: 200, body: null })).pipe(delay(100));
    }
  }

  return next(req);
};
