import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { Auth, UserSignUp } from '../services/auth';

@Component({
  imports: [FormsModule, RouterLink, JsonPipe],
  selector: 'app-form',
  styleUrl: './form.css',
  templateUrl: './form.html',
})
export class Form {
  titre = 'Composant form';

  private authService = inject(Auth);
  private router = inject(Router);

  user: UserSignUp = {
    login: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    email: '',
  };

  isLoading = false;
  successMessage = '';
  errorMessage = '';
  responseResult: any = null;

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.responseResult = null;

    const { confirmPassword, ...payload } = this.user;

    this.authService.signUp(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Inscription réussie !';
        this.responseResult = response;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error?.error?.message ||
          error?.message ||
          "Une erreur est survenue lors de l'inscription.";
        this.responseResult = error?.error || {
          status: error?.status,
          statusText: error?.statusText,
          message: error?.message,
        };
      },
    });
  }

  resetForm() {
    this.successMessage = '';
    this.errorMessage = '';
    this.responseResult = null;
    this.user = {
      login: '',
      password: '',
      confirmPassword: '',
      nom: '',
      prenom: '',
      email: '',
    };
  }

  goToHome() {
    this.router.navigate(['/home'], {
      queryParams: { prenom: this.user.prenom, nom: this.user.nom },
    });
  }
}

