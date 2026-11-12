import { PollutionLevelPipe } from './pollution-level.pipe';

describe('PollutionLevelPipe', () => {
  let pipe: PollutionLevelPipe;

  beforeEach(() => {
    pipe = new PollutionLevelPipe();
  });

  it('devrait instancier la pipe correctement', () => {
    expect(pipe).toBeTruthy();
  });

  describe("Conformité aux seuils de l'Exercice 04", () => {
    it('devrait retourner "Faible" pour des valeurs entre 0 et 20', () => {
      expect(pipe.transform(0)).toBe('Faible');
      expect(pipe.transform(10)).toBe('Faible');
      expect(pipe.transform(20)).toBe('Faible');
    });

    it('devrait retourner "Modérée" pour des valeurs entre 21 et 50', () => {
      expect(pipe.transform(21)).toBe('Modérée');
      expect(pipe.transform(35)).toBe('Modérée');
      expect(pipe.transform(50)).toBe('Modérée');
    });

    it('devrait retourner "Élevée" pour des valeurs entre 51 et 100', () => {
      expect(pipe.transform(51)).toBe('Élevée');
      expect(pipe.transform(75)).toBe('Élevée');
      expect(pipe.transform(100)).toBe('Élevée');
    });

    it('devrait retourner "Dangereuse" pour des valeurs supérieures à 100 (101+)', () => {
      expect(pipe.transform(101)).toBe('Dangereuse');
      expect(pipe.transform(150)).toBe('Dangereuse');
      expect(pipe.transform(999)).toBe('Dangereuse');
    });
  });

  describe('Gestion des chaînes de caractères et cas limites', () => {
    it('devrait convertir une chaîne numérique en statut approprié', () => {
      expect(pipe.transform('15')).toBe('Faible');
      expect(pipe.transform('35')).toBe('Modérée');
      expect(pipe.transform('80')).toBe('Élevée');
      expect(pipe.transform('120')).toBe('Dangereuse');
    });

    it('devrait renvoyer une chaîne vide pour null, undefined ou vide', () => {
      expect(pipe.transform(null)).toBe('');
      expect(pipe.transform(undefined)).toBe('');
      expect(pipe.transform('')).toBe('');
      expect(pipe.transform('non-numeric-value')).toBe('');
    });

    it('devrait supporter les libellés textuels existants', () => {
      expect(pipe.transform('Faible')).toBe('Faible');
      expect(pipe.transform('modérée')).toBe('Modérée');
      expect(pipe.transform('Élevée')).toBe('Élevée');
      expect(pipe.transform('dangereuse')).toBe('Dangereuse');
    });
  });

  describe('Paramétrage optionnel de la pipe (Séance 5)', () => {
    it('devrait formater au format court avec l\'option "short"', () => {
      expect(pipe.transform(15, 'short')).toBe('F');
      expect(pipe.transform(35, 'short')).toBe('M');
      expect(pipe.transform(80, 'short')).toBe('E');
      expect(pipe.transform(150, 'short')).toBe('D');
    });

    it('devrait formater avec valeur numérique avec l\'option "detailed"', () => {
      expect(pipe.transform(15, 'detailed')).toBe('Faible (15)');
      expect(pipe.transform(35, 'detailed')).toBe('Modérée (35)');
      expect(pipe.transform(80, 'detailed')).toBe('Élevée (80)');
      expect(pipe.transform(150, 'detailed')).toBe('Dangereuse (150)');
    });
  });
});
