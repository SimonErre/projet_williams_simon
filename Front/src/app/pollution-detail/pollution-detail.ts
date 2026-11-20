import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PollutionService } from '../services/pollution.service';
import { Pollution } from '../models/pollution.model';
import { PollutionLevelPipe } from '../pipes/pollution-level.pipe';
import { HighlightPollutionDirective } from '../directives/highlight-pollution.directive';

@Component({
  selector: 'app-pollution-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, PollutionLevelPipe, HighlightPollutionDirective],
  templateUrl: './pollution-detail.html',
  styleUrl: './pollution-detail.css',
})
export class PollutionDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pollutionService = inject(PollutionService);
  private destroyRef = inject(DestroyRef);

  pollution = signal<Pollution | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    if (this.route.paramMap) {
      this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((paramMap) => {
        this.handleIdParam(paramMap.get('id'));
      });
    } else {
      this.handleIdParam(this.route.snapshot?.paramMap?.get('id'));
    }
  }

  private handleIdParam(idParam: string | null | undefined): void {
    if (idParam) {
      const id = parseInt(idParam, 10);
      if (!isNaN(id)) {
        this.errorMessage.set(null);
        this.loadPollution(id);
        return;
      }
    }
    this.errorMessage.set('Identifiant de pollution manquant.');
    this.isLoading.set(false);
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
