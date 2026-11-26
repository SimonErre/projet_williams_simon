import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private authService = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  login = signal<string>('');
  password = signal<string>('');
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  redirectMessage = signal<string | null>(null);

  private returnUrl = '/pollutions';

  ngOnInit(): void {
    const returnUrlParam = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrlParam) {
      this.returnUrl = returnUrlParam;
      this.redirectMessage.set(
        'Cette page est sécurisée par un Guard. Veuillez vous connecter pour continuer.',
      );
    }
  }

  onSubmit(): void {
    const loginVal = this.login().trim();
    const passVal = this.password().trim();

    if (!loginVal) {
      this.errorMessage.set('Veuillez saisir votre identifiant.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login({ login: loginVal, password: passVal }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Erreur de connexion', err);
        const msg =
          err?.error?.message || err?.statusText || 'Identifiants incorrects. Veuillez réessayer.';
        this.errorMessage.set(msg);
      },
    });
  }

  /**
   * Remplissage rapide pour les tests (comptes démo créés lors du TP 04)
   */
  fillDemoAccount(userLogin: string): void {
    this.login.set(userLogin);
    this.password.set('password123');
    this.errorMessage.set(null);
  }
}
