import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PollutionService } from '../services/pollution.service';
import { Pollution } from '../models/pollution.model';

@Component({
  selector: 'app-pollution-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './pollution-list.html',
  styleUrl: './pollution-list.css',
})
export class PollutionList implements OnInit {
  private pollutionService = inject(PollutionService);

  // Signaux réactifs pour l'état des données et des filtres
  pollutions = signal<Pollution[]>([]);
  searchQuery = signal<string>('');
  selectedType = signal<string>('');
  sortBy = signal<'recent' | 'ancien'>('recent');
  isLoading = signal<boolean>(true);
  notification = signal<string | null>(null);

  pollutionTypes = ['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'];

  // Signal dérivé (computed) pour le filtrage multi-critères
  filteredPollutions = computed(() => {
    let list = this.pollutions();
    const query = this.searchQuery().trim().toLowerCase();
    const type = this.selectedType();
    const sort = this.sortBy();

    // Filtre par recherche textuelle (titre, lieu ou description)
    if (query) {
      list = list.filter(
        (p) =>
          p.titre.toLowerCase().includes(query) ||
          p.lieu.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      );
    }

    // Filtre par type
    if (type) {
      list = list.filter((p) => p.type === type);
    }

    // Tri par date
    return [...list].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sort === 'recent' ? dateB - dateA : dateA - dateB;
    });
  });

  ngOnInit(): void {
    this.loadPollutions();
  }

  loadPollutions(): void {
    this.isLoading.set(true);
    this.pollutionService.getPollutions().subscribe({
      next: (data) => {
        this.pollutions.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des pollutions', err);
        this.isLoading.set(false);
      },
    });
  }

  deletePollution(id: number, titre: string): void {
    if (confirm(`Confirmez-vous la suppression de la pollution "${titre}" ?`)) {
      this.pollutionService.deletePollution(id).subscribe({
        next: () => {
          this.pollutions.update((list) => list.filter((p) => p.id !== id));
          this.showNotification(`La pollution "${titre}" a été supprimée.`);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          alert('Une erreur est survenue lors de la suppression.');
        },
      });
    }
  }

  showNotification(msg: string): void {
    this.notification.set(msg);
    setTimeout(() => {
      this.notification.set(null);
    }, 3500);
  }
}
