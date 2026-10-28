import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PollutionService } from '../services/pollution.service';
import { Pollution } from '../models/pollution.model';

@Component({
  selector: 'app-pollution-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pollution-detail.html',
  styleUrl: './pollution-detail.css',
})
export class PollutionDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pollutionService = inject(PollutionService);

  pollution = signal<Pollution | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = parseInt(idParam, 10);
      this.loadPollution(id);
    } else {
      this.errorMessage.set('Identifiant de pollution manquant.');
      this.isLoading.set(false);
    }
  }

  loadPollution(id: number): void {
    this.isLoading.set(true);
    this.pollutionService.getPollutionById(id).subscribe({
      next: (data) => {
        this.pollution.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la pollution', err);
        this.errorMessage.set('Impossible de charger les détails de cette pollution.');
        this.isLoading.set(false);
      },
    });
  }

  deleteCurrentPollution(): void {
    const item = this.pollution();
    if (!item) return;

    if (confirm(`Êtes-vous sûr de vouloir supprimer la pollution "${item.titre}" ?`)) {
      this.pollutionService.deletePollution(item.id).subscribe({
        next: () => {
          this.router.navigate(['/pollutions']);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          alert('Une erreur est survenue lors de la suppression.');
        },
      });
    }
  }
}
