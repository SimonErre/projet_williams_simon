import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Interface pour les composants gérant la confirmation avant de quitter la page
 */
export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean> | Promise<boolean>;
}

/**
 * Guard fonctionnel canDeactivate (TP 05 / Séance 5 - Slide 11) :
 * Vérifie si l'utilisateur peut quitter la page en prévenant la perte
 * de données non enregistrées dans les formulaires.
 */
export const pendingChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate,
): boolean | Observable<boolean> | Promise<boolean> => {
  if (component && typeof component.canDeactivate === 'function') {
    return component.canDeactivate();
  }
  return true;
};
