import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pollution } from '../models/pollution.model';

@Injectable({
  providedIn: 'root',
})
export class PollutionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pollutions`;

  /**
   * Récupère la liste de toutes les pollutions enregistrées
   */
  getPollutions(): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(this.apiUrl);
  }

  /**
   * Récupère les détails d'une pollution spécifique par son identifiant
   */
  getPollutionById(id: number): Observable<Pollution> {
    return this.http.get<Pollution>(`${this.apiUrl}/${id}`);
  }

  /**
   * Ajoute une nouvelle pollution
   */
  addPollution(pollution: Omit<Pollution, 'id'> | Pollution): Observable<Pollution> {
    return this.http.post<Pollution>(this.apiUrl, pollution);
  }

  /**
   * Modifie une pollution existante
   */
  updatePollution(id: number, pollution: Partial<Pollution>): Observable<Pollution> {
    return this.http.put<Pollution>(`${this.apiUrl}/${id}`, pollution);
  }

  /**
   * Supprime une pollution par son identifiant
   */
  deletePollution(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
