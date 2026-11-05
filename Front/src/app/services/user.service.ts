import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, UserSignUp, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  readonly apiUrl = `${environment.apiUrl}/users`;

  /**
   * Récupère la liste de tous les utilisateurs enregistrés
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Récupère les détails d'un utilisateur par son ID
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée un nouvel utilisateur (POST /api/users)
   */
  createUser(userData: Partial<UserSignUp>): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  /**
   * Supprime un utilisateur par son ID (DELETE /api/users/:id)
   */
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Authentification fictive (POST /api/users/login)
   */
  login(credentials: { login: string; password?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }
}
