import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';
import { PollutionStatus } from '../pipes/pollution-level.pipe';

export const POLLUTION_COLORS: Record<PollutionStatus, string> = {
  Faible: 'lightgreen',
  Modérée: 'yellow',
  Élevée: 'orange',
  Dangereuse: 'red',
};

export const PASTEL_POLLUTION_COLORS: Record<PollutionStatus, string> = {
  Faible: '#d4edda',
  Modérée: '#fff3cd',
  Élevée: '#ffe5d0',
  Dangereuse: '#f8d7da',
};

/**
 * Directive d'attribut HighlightPollutionDirective (Exercice 04 / Séance 5)
 *
 * Modifie le style de fond (backgroundColor) en fonction du niveau de pollution :
 * - Vert clair si pollution Faible
 * - Jaune si pollution Modérée
 * - Orange si pollution Élevée
 * - Rouge si pollution Dangereuse
 *
 * Conforme aux principes de la Séance 5 :
 * - Manipulation propre et sécurisée du DOM via Renderer2 et ElementRef
 * - Écoute des interactions utilisateur via HostListener (survol)
 * - Supporte aussi bien les valeurs textuelles ("Faible", "Modérée", ...)
 *   que les indices numériques (15, 45, 80, 120, ...)
 */
@Directive({
  selector: '[appHighlightPollution], [highlightPollution]',
  standalone: true,
})
export class HighlightPollutionDirective implements OnInit {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  private _rawValue: string | number | null | undefined;

  /**
   * Entrée principale de la directive via [appHighlightPollution]
   */
  @Input('appHighlightPollution')
  set appHighlightPollution(val: string | number | null | undefined) {
    this._rawValue = val;
    this.updateStyle();
  }

  get appHighlightPollution(): string | number | null | undefined {
    return this._rawValue;
  }

  /**
   * Entrée alternative via [highlightPollution]
   */
  @Input('highlightPollution')
  set highlightPollution(val: string | number | null | undefined) {
    this._rawValue = val;
    this.updateStyle();
  }

  /**
   * Entrées secondaires pour compatibilité maximale
   */
  @Input()
  set level(val: string | number | null | undefined) {
    this._rawValue = val;
    this.updateStyle();
  }

  @Input()
  set pollutionLevel(val: string | number | null | undefined) {
    this._rawValue = val;
    this.updateStyle();
  }

  @Input()
  set pollutionValue(val: string | number | null | undefined) {
    this._rawValue = val;
    this.updateStyle();
  }

  /**
   * Dictionnaire optionnel de couleurs personnalisées
   */
  @Input()
  set customColors(colors: Partial<Record<PollutionStatus, string>> | undefined) {
    this._customColors = colors;
    this.updateStyle();
  }
  get customColors(): Partial<Record<PollutionStatus, string>> | undefined {
    return this._customColors;
  }
  private _customColors?: Partial<Record<PollutionStatus, string>>;

  /**
   * Option pour utiliser une palette pastel douce
   */
  @Input()
  set usePastel(pastel: boolean) {
    this._usePastel = pastel;
    this.updateStyle();
  }
  get usePastel(): boolean {
    return this._usePastel;
  }
  private _usePastel: boolean = false;

  /**
   * Liaison d'hôte pour la couleur de fond
   */
  @HostBinding('style.backgroundColor')
  currentBackgroundColor: string = '';

  /**
   * Statut actuellement calculé ('Faible' | 'Modérée' | 'Élevée' | 'Dangereuse' | null)
   */
  currentStatus: PollutionStatus | null = null;

  ngOnInit(): void {
    // Style de transition fluide pour les animations et survol
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.25s ease');
    this.updateStyle();
  }

  /**
   * Analyse la valeur d'entrée et applique la couleur de fond correspondante
   */
  updateStyle(): void {
    this.currentStatus = this.resolvePollutionStatus(this._rawValue);

    if (this.currentStatus) {
      const color = this.getColorForStatus(this.currentStatus);
      this.currentBackgroundColor = color;
      this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
      this.renderer.setAttribute(
        this.el.nativeElement,
        'data-pollution-level',
        this.currentStatus.toLowerCase(),
      );
    } else {
      this.currentBackgroundColor = '';
      this.renderer.removeStyle(this.el.nativeElement, 'backgroundColor');
      this.renderer.removeAttribute(this.el.nativeElement, 'data-pollution-level');
    }
  }

  /**
   * Résout le statut de pollution à partir d'un nombre ou d'une chaîne
   */
  resolvePollutionStatus(val: unknown): PollutionStatus | null {
    if (val === null || val === undefined || val === '') {
      return null;
    }

    // Si c'est déjà un nombre
    if (typeof val === 'number') {
      return this.getStatusFromNumeric(val);
    }

    // Si c'est une chaîne, vérifions si elle représente un nombre ou un libellé textuel
    if (typeof val === 'string') {
      const str = val.trim();
      const parsedNum = Number(str);
      if (!isNaN(parsedNum) && str !== '') {
        return this.getStatusFromNumeric(parsedNum);
      }

      // Vérification textuelle tolérante aux minuscules et accents
      const lower = str.toLowerCase();
      if (lower.includes('faible')) return 'Faible';
      if (lower.includes('modér') || lower.includes('moder')) return 'Modérée';
      if (lower.includes('élev') || lower.includes('elev')) return 'Élevée';
      if (lower.includes('danger')) return 'Dangereuse';
    }

    return null;
  }

  /**
   * Retourne le statut selon l'indice numérique selon les consignes :
   * 0-20 → Faible
   * 21-50 → Modérée
   * 51-100 → Élevée
   * 101+ → Dangereuse
   */
  private getStatusFromNumeric(num: number): PollutionStatus {
    if (num <= 20) {
      return 'Faible';
    } else if (num <= 50) {
      return 'Modérée';
    } else if (num <= 100) {
      return 'Élevée';
    } else {
      return 'Dangereuse';
    }
  }

  /**
   * Retourne la couleur selon le statut
   */
  private getColorForStatus(status: PollutionStatus): string {
    if (this._customColors && this._customColors[status]) {
      return this._customColors[status]!;
    }
    const colorPalette = this._usePastel ? PASTEL_POLLUTION_COLORS : POLLUTION_COLORS;
    return colorPalette[status];
  }

  /**
   * Écoute de l'événement de survol (Séance 5 - Interactions utilisateur)
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.currentStatus) {
      this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 4px 12px rgba(0, 0, 0, 0.15)');
      this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1.02)');
    }
  }

  /**
   * Réinitialisation de l'état au départ du curseur
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');
    this.renderer.removeStyle(this.el.nativeElement, 'transform');
  }
}
