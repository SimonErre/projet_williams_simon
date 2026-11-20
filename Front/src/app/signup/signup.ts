import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { UserService } from '../services/user.service';
import { UserSignUp } from '../models/user.model';
import { CanComponentDeactivate } from '../guards/pending-changes.guard';

@Component({
  selector: 'app-signup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink, JsonPipe],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup implements CanComponentDeactivate {
  private userService = inject(UserService);

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

    this.userService.createUser(payload).subscribe({
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
            "Une erreur est survenue lors de l'appel au service.",
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

  /**
   * Sécurisation canDeactivate (Séance 5) :
   * Prévient la perte des données saisies en cas de navigation avant validation.
   */
  canDeactivate(): boolean {
    const hasUnsavedInput = Boolean(
      this.user.login || this.user.nom || this.user.prenom || this.user.email || this.user.password,
    );
    if (hasUnsavedInput && !this.successMessage()) {
      return confirm(
        "Attention : vous avez des données non enregistrées dans le formulaire d'inscription. Voulez-vous vraiment quitter ?",
      );
    }
    return true;
  }
}
