import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Pollution } from '../models/pollution.model';
import { INITIAL_POLLUTIONS } from '../mock/mock-pollutions';
import { environment } from '../../environments/environment';

const STORAGE_KEY = 'mock_pollutions';

function getStoredPollutions(): Pollution[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        // En cas d'erreur de parsing, on réinitialise
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POLLUTIONS));
  }
  return [...INITIAL_POLLUTIONS];
}

function saveStoredPollutions(pollutions: Pollution[]): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pollutions));
  }
}

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  // Si le mock est désactivé dans l'environnement, on transmet la requête au réseau réel
  if (!environment.mockBackend) {
    return next(req);
  }

  const { url, method, body } = req;

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
