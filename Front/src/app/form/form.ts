import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserSignUp } from '../services/auth';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-form',
  styleUrl: './form.css',
  templateUrl: './form.html',
})
export class Form {
  titre = 'Composant form';

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
    this.router.navigate(['/home'], {
      queryParams: { prenom: this.user.prenom, nom: this.user.nom },
    });
  }
}

