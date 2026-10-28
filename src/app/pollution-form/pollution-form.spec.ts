import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { PollutionForm } from './pollution-form';
import { PollutionService } from '../services/pollution.service';
import { Pollution } from '../models/pollution.model';

describe('PollutionForm', () => {
  let component: PollutionForm;
  let fixture: ComponentFixture<PollutionForm>;
  let mockPollutionService: Partial<PollutionService>;

  beforeEach(async () => {
    mockPollutionService = {
      addPollution: (data) => of({ ...(data as Pollution), id: 99 }),
      getPollutionById: (id) => of({} as Pollution),
    };

    await TestBed.configureTestingModule({
      imports: [PollutionForm],
      providers: [
        provideRouter([]),
        { provide: PollutionService, useValue: mockPollutionService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PollutionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create form with invalid initial state', () => {
    expect(component).toBeTruthy();
    expect(component.pollutionForm.valid).toBe(false);
  });

  it('should validate correctly when all required fields are filled', () => {
    component.pollutionForm.setValue({
      titre: 'Dépôt sauvage',
      type: 'Dépôt sauvage',
      description: 'Gravats au sol',
      date: '2026-10-22',
      lieu: 'Strasbourg',
      latitude: 48.5,
      longitude: 7.7,
      photo: '',
    });

    expect(component.pollutionForm.valid).toBe(true);
  });

  it('should reject invalid coordinates', () => {
    component.pollutionForm.patchValue({
      latitude: 100, // Invalid: max 90
      longitude: 200, // Invalid: max 180
    });

    expect(component.pollutionForm.get('latitude')?.valid).toBe(false);
    expect(component.pollutionForm.get('longitude')?.valid).toBe(false);
  });

  it('should submit successfully and set isSubmitted to true', () => {
    component.pollutionForm.setValue({
      titre: 'Dépôt sauvage',
      type: 'Dépôt sauvage',
      description: 'Gravats au sol',
      date: '2026-10-22',
      lieu: 'Strasbourg',
      latitude: 48.5,
      longitude: 7.7,
      photo: '',
    });

    component.onSubmit();
    expect(component.isSubmitted()).toBe(true);
    expect(component.pollutionData()?.id).toBe(99);
  });
});
