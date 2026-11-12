import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  private userService = inject(UserService);

  users = signal<User[]>([]);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(true);
  notification = signal<string | null>(null);

  filteredUsers = computed(() => {
    const list = this.users();
    const query = this.searchQuery().trim().toLowerCase();

    if (!query) {
      return list;
    }

    return list.filter(
      (u) =>
        u.login.toLowerCase().includes(query) ||
        u.nom.toLowerCase().includes(query) ||
        u.prenom.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query),
    );
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs', err);
        this.isLoading.set(false);
      },
    });
  }

  deleteUser(id: number, login: string): void {
    if (confirm(`Confirmez-vous la suppression de l'utilisateur "${login}" ?`)) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users.update((list) => list.filter((u) => u.id !== id));
          this.showNotification(`L'utilisateur "${login}" a été supprimé.`);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          alert("Une erreur est survenue lors de la suppression de l'utilisateur.");
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
