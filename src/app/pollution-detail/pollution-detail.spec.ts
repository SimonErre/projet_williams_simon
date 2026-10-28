import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { PollutionDetail } from './pollution-detail';
import { PollutionService } from '../services/pollution.service';
import { Pollution } from '../models/pollution.model';

describe('PollutionDetail', () => {
  let component: PollutionDetail;
  let fixture: ComponentFixture<PollutionDetail>;

  const dummyPollution: Pollution = {
    id: 1,
    titre: 'Déchets plastiques',
    type: 'Plastique',
    description: 'Pollution observée',
    date: '2026-10-15',
    lieu: 'Strasbourg',
    latitude: 48.59,
    longitude: 7.77,
  };

  const mockPollutionService = {
    getPollutionById: (id: number) => of(dummyPollution),
    deletePollution: (id: number) => of(void 0),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionDetail],
      providers: [
        provideRouter([]),
        { provide: PollutionService, useValue: mockPollutionService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PollutionDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load pollution detail', () => {
    expect(component).toBeTruthy();
    expect(component.pollution()).toEqual(dummyPollution);
    expect(component.isLoading()).toBe(false);
  });
});
