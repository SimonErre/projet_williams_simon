import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule],
  selector: 'app-form',
  styleUrl: './form.css',
  templateUrl: './form.html',
})
export class Form {
  titre = 'Composant form';
  
  private router = inject(Router);

  user = {
    login: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    email: ''
  };

  onSubmit() {
    this.router.navigate(['/home'], { queryParams: { prenom: this.user.prenom, nom: this.user.nom } });
  }
}
