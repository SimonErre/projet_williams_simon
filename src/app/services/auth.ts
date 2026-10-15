import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserSignUp {
  login: string;
  password?: string;
  confirmPassword?: string;
  nom: string;
  prenom: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  readonly apiUrl = environment.apiUrl;

  signUp(userData: Partial<UserSignUp>): Observable<any> {
    const url = this.apiUrl.endsWith('/users') || this.apiUrl.endsWith('/signup')
      ? this.apiUrl
      : `${this.apiUrl}/signup`;
    return this.http.post<any>(url, userData);
  }

  register(userData: Partial<UserSignUp>): Observable<any> {
    return this.signUp(userData);
  }
}

export { Auth as AuthService };


