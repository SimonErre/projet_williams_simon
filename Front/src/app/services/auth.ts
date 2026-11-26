import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, AuthResponse, UserSignUp } from '../models/user.model';

export type { UserSignUp };

const AUTH_USER_KEY = 'ecopollution_user';
const AUTH_TOKEN_KEY = 'ecopollution_token';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  readonly apiUrl = environment.apiUrl;

  /**
   * Signal réactif de l'utilisateur actuellement connecté
   */
  readonly currentUser = signal<User | null>(this.getStoredUser());

  /**
   * Signal dérivé (computed) indiquant si l'utilisateur est authentifié
   */
  readonly isAuthenticated = computed<boolean>(() => !!this.currentUser());

  /**
   * Authentifie un utilisateur auprès de l'API REST
   */
  login(credentials: { login: string; password?: string }): Observable<AuthResponse> {
    const loginUrl = `${this.apiUrl}/users/login`;
    return this.http.post<AuthResponse>(loginUrl, credentials).pipe(
      tap((response) => {
        if (response && response.user) {
          this.saveSession(response.user, response.token);
        }
      }),
    );
  }

  /**
   * Déconnecte l'utilisateur et nettoie le stockage local
   */
  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
    this.currentUser.set(null);
  }

  /**
   * Récupère le token d'authentification stocké
   */
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    }
    return null;
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  signUp(userData: Partial<UserSignUp>): Observable<any> {
    const url =
      this.apiUrl.endsWith('/users') || this.apiUrl.endsWith('/signup')
        ? this.apiUrl
        : `${this.apiUrl}/signup`;
    return this.http.post<any>(url, userData);
  }

  register(userData: Partial<UserSignUp>): Observable<any> {
    return this.signUp(userData);
  }

  /**
   * Récupère l'utilisateur stocké dans le localStorage
   */
  private getStoredUser(): User | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem(AUTH_USER_KEY);
      if (data) {
        try {
          return JSON.parse(data) as User;
        } catch {
          localStorage.removeItem(AUTH_USER_KEY);
        }
      }
    }
    return null;
  }

  /**
   * Enregistre la session dans le stockage local
   */
  private saveSession(user: User, token?: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      }
    }
    this.currentUser.set(user);
  }
}

export { Auth as AuthService };
