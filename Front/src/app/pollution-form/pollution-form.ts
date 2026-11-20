import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PollutionRecap } from '../pollution-recap/pollution-recap';
import { PollutionService } from '../services/pollution.service';
import { Pollution } from '../models/pollution.model';
import { PollutionLevelPipe } from '../pipes/pollution-level.pipe';
import { HighlightPollutionDirective } from '../directives/highlight-pollution.directive';
import { CanComponentDeactivate } from '../guards/pending-changes.guard';

@Component({
  selector: 'app-pollution-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    PollutionRecap,
    PollutionLevelPipe,
    HighlightPollutionDirective,
  ],
  templateUrl: './pollution-form.html',
  styleUrl: './pollution-form.css',
})
export class PollutionForm implements OnInit, CanComponentDeactivate {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private pollutionService = inject(PollutionService);
  private cdr = inject(ChangeDetectorRef);

  pollutionForm: FormGroup;
  isSubmitted = signal<boolean>(false);
  pollutionData = signal<Pollution | null>(null);

  isEditMode = signal<boolean>(false);
  editId: number | null = null;
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  pollutionTypes = ['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'];

  constructor() {
    this.pollutionForm = this.fb.group({
      titre: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      lieu: ['', Validators.required],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      valeur: [null, [Validators.min(0)]], // Indice de dangerosité (Exercice 04)
      photo: [''], // Optionnel
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.editId = parseInt(idParam, 10);
      this.isLoading.set(true);

      this.pollutionService.getPollutionById(this.editId).subscribe({
        next: (pollution) => {
          this.pollutionForm.patchValue({
            titre: pollution.titre,
            type: pollution.type,
            description: pollution.description,
            date: pollution.date,
            lieu: pollution.lieu,
            latitude: pollution.latitude,
            longitude: pollution.longitude,
            valeur: pollution.valeur ?? null,
            photo: pollution.photo || '',
          });
          this.isLoading.set(false);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Erreur lors de la récupération de la pollution à modifier', err);
          this.isLoading.set(false);
          this.cdr.markForCheck();
        },
      });
    }
  }

  onSubmit(): void {
    if (this.pollutionForm.invalid || this.isSubmitting()) {
      this.pollutionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.pollutionForm.value;

    if (this.isEditMode() && this.editId) {
      // Mode modification (Update - PUT)
      this.pollutionService.updatePollution(this.editId, formValue).subscribe({
        next: (updated) => {
          this.pollutionData.set(updated);
          this.isSubmitted.set(true);
          this.isSubmitting.set(false);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour', err);
          alert('Une erreur est survenue lors de la mise à jour.');
          this.isSubmitting.set(false);
          this.cdr.markForCheck();
        },
      });
    } else {
      // Mode création (Create - POST)
      this.pollutionService.addPollution(formValue).subscribe({
        next: (created) => {
          this.pollutionData.set(created);
          this.isSubmitted.set(true);
          this.isSubmitting.set(false);
        },
        error: (err) => {
          console.error('Erreur lors de la création', err);
          alert("Une erreur est survenue lors de l'enregistrement.");
          this.isSubmitting.set(false);
          this.cdr.markForCheck();
        },
      });
    }
  }

  /**
   * Sécurisation canDeactivate (Séance 5 - Slide 11) :
   * Avertit l'utilisateur avant de quitter la page si le formulaire est modifié et non soumis.
   */
  canDeactivate(): boolean {
    if (this.pollutionForm.dirty && !this.isSubmitted()) {
      return confirm(
        'Attention : vous avez des modifications non enregistrées sur ce signalement. Voulez-vous vraiment quitter ?',
      );
    }
    return true;
  }
}
