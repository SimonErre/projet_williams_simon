import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HighlightPollutionDirective } from './highlight-pollution.directive';

@Component({
  standalone: true,
  imports: [HighlightPollutionDirective],
  template: `
    <div id="test-faible-num" [appHighlightPollution]="15">Faible Num</div>
    <div id="test-moderee-num" [appHighlightPollution]="35">Modérée Num</div>
    <div id="test-elevee-num" [appHighlightPollution]="75">Élevée Num</div>
    <div id="test-dangereuse-num" [appHighlightPollution]="150">Dangereuse Num</div>

    <div id="test-faible-str" [appHighlightPollution]="'Faible'">Faible Str</div>
    <div id="test-moderee-str" [appHighlightPollution]="'Modérée'">Modérée Str</div>
    <div id="test-elevee-str" [appHighlightPollution]="'Élevée'">Élevée Str</div>
    <div id="test-dangereuse-str" [appHighlightPollution]="'Dangereuse'">Dangereuse Str</div>

    <div id="test-alt-selector" [highlightPollution]="25">Sélecteur alternatif</div>
    <div id="test-dynamic" [appHighlightPollution]="dynamicValue()">Dynamique</div>
    <div id="test-empty" [appHighlightPollution]="null">Vide</div>
  `,
})
class TestHostComponent {
  dynamicValue = signal<number | string | null>(10);
}

describe('HighlightPollutionDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, HighlightPollutionDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait appliquer le vert clair ("lightgreen") pour un indice Faible (0-20)', () => {
    const el = fixture.debugElement.query(By.css('#test-faible-num')).nativeElement;
    expect(el.style.backgroundColor).toBe('lightgreen');

    const elStr = fixture.debugElement.query(By.css('#test-faible-str')).nativeElement;
    expect(elStr.style.backgroundColor).toBe('lightgreen');
  });

  it('devrait appliquer le jaune ("yellow") pour un indice Modéré (21-50)', () => {
    const el = fixture.debugElement.query(By.css('#test-moderee-num')).nativeElement;
    expect(el.style.backgroundColor).toBe('yellow');

    const elStr = fixture.debugElement.query(By.css('#test-moderee-str')).nativeElement;
    expect(elStr.style.backgroundColor).toBe('yellow');
  });

  it('devrait appliquer l\'orange ("orange") pour un indice Élevé (51-100)', () => {
    const el = fixture.debugElement.query(By.css('#test-elevee-num')).nativeElement;
    expect(el.style.backgroundColor).toBe('orange');

    const elStr = fixture.debugElement.query(By.css('#test-elevee-str')).nativeElement;
    expect(elStr.style.backgroundColor).toBe('orange');
  });

  it('devrait appliquer le rouge ("red") pour un indice Dangereux (101+)', () => {
    const el = fixture.debugElement.query(By.css('#test-dangereuse-num')).nativeElement;
    expect(el.style.backgroundColor).toBe('red');

    const elStr = fixture.debugElement.query(By.css('#test-dangereuse-str')).nativeElement;
    expect(elStr.style.backgroundColor).toBe('red');
  });

  it('devrait fonctionner avec le sélecteur alternatif [highlightPollution]', () => {
    const el = fixture.debugElement.query(By.css('#test-alt-selector')).nativeElement;
    expect(el.style.backgroundColor).toBe('yellow');
  });

  it("devrait mettre à jour la couleur lorsque l'entrée dynamique change", () => {
    const de = fixture.debugElement.query(By.css('#test-dynamic'));
    expect(de.nativeElement.style.backgroundColor).toBe('lightgreen');

    // Changement vers Modérée (35)
    component.dynamicValue.set(35);
    fixture.detectChanges();
    expect(de.nativeElement.style.backgroundColor).toBe('yellow');

    // Changement vers Élevée (80)
    component.dynamicValue.set(80);
    fixture.detectChanges();
    expect(de.nativeElement.style.backgroundColor).toBe('orange');

    // Changement vers Dangereuse (120)
    component.dynamicValue.set(120);
    fixture.detectChanges();
    expect(de.nativeElement.style.backgroundColor).toBe('red');

    // Réinitialisation vers null
    component.dynamicValue.set(null);
    fixture.detectChanges();
    expect(de.nativeElement.style.backgroundColor).toBe('');
  });

  it('devrait réagir aux interactions de survol (mouseenter / mouseleave)', () => {
    const de = fixture.debugElement.query(By.css('#test-faible-num'));
    de.triggerEventHandler('mouseenter', {});
    fixture.detectChanges();
    expect(de.nativeElement.style.transform).toBe('scale(1.02)');

    de.triggerEventHandler('mouseleave', {});
    fixture.detectChanges();
    expect(de.nativeElement.style.transform).toBe('');
  });
});
