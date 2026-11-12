import { Pipe, PipeTransform } from '@angular/core';

export type PollutionStatus = 'Faible' | 'Modérée' | 'Élevée' | 'Dangereuse';

export interface PollutionLevelThreshold {
  min: number;
  max: number;
  status: PollutionStatus;
}

export const POLLUTION_THRESHOLDS: PollutionLevelThreshold[] = [
  { min: 0, max: 20, status: 'Faible' },
  { min: 21, max: 50, status: 'Modérée' },
  { min: 51, max: 100, status: 'Élevée' },
  { min: 101, max: Infinity, status: 'Dangereuse' },
];

/**
 * Pipe personnalisée PollutionLevelPipe (Exercice 04 / Séance 5)
 *
 * Transforme un indice de dangerosité numérique en statut textuel :
 * - 0 - 20   → Faible
 * - 21 - 50  → Modérée
 * - 51 - 100 → Élevée
 * - 101+     → Dangereuse
 *
 * Conforme aux bonnes pratiques du cours (fonction pure, paramétrage possible).
 */
@Pipe({
  name: 'pollutionLevel',
  standalone: true,
  pure: true,
})
export class PollutionLevelPipe implements PipeTransform {
  transform(
    value: number | string | null | undefined,
    format: 'label' | 'detailed' | 'short' = 'label',
  ): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    // Si la valeur est déjà un libellé textuel correspondant aux statuts
    if (typeof value === 'string') {
      const normalizedStr = value.trim().toLowerCase();
      if (normalizedStr === 'faible') return this.formatStatus('Faible', format, null);
      if (normalizedStr === 'modérée' || normalizedStr === 'moderee') {
        return this.formatStatus('Modérée', format, null);
      }
      if (normalizedStr === 'élevée' || normalizedStr === 'elevee') {
        return this.formatStatus('Élevée', format, null);
      }
      if (normalizedStr === 'dangereuse') return this.formatStatus('Dangereuse', format, null);
    }

    const num = typeof value === 'number' ? value : Number(value);

    if (isNaN(num)) {
      return '';
    }

    let status: PollutionStatus;

    if (num <= 20) {
      status = 'Faible';
    } else if (num <= 50) {
      status = 'Modérée';
    } else if (num <= 100) {
      status = 'Élevée';
    } else {
      status = 'Dangereuse';
    }

    return this.formatStatus(status, format, num);
  }

  private formatStatus(
    status: PollutionStatus,
    format: 'label' | 'detailed' | 'short',
    numericVal: number | null,
  ): string {
    switch (format) {
      case 'short':
        return status === 'Faible'
          ? 'F'
          : status === 'Modérée'
            ? 'M'
            : status === 'Élevée'
              ? 'E'
              : 'D';
      case 'detailed':
        if (numericVal !== null) {
          return `${status} (${numericVal})`;
        }
        return status;
      case 'label':
      default:
        return status;
    }
  }
}
