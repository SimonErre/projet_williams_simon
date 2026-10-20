import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { Auth, UserSignUp } from '../services/auth';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink, JsonPipe],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private authService = inject(Auth);

  user: UserSignUp = {
    login: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    email: '',
  };

  isLoading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  result = signal<any>(null);

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.result.set(null);

    const { confirmPassword, ...payload } = this.user;

    this.authService.signUp(payload).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.successMessage.set('Inscription réussie !');
        if (response && typeof response === 'object') {
          const { password, ...safeData } = response;
          this.result.set(safeData);
        } else {
          this.result.set(response);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error?.error?.message ||
          error?.message ||
          "Une erreur est survenue lors de l'appel au service."
        );
      },
    });
  }

  reset() {
    this.user = {
      login: '',
      password: '',
      confirmPassword: '',
      nom: '',
      prenom: '',
      email: '',
    };
    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.result.set(null);
  }
}

