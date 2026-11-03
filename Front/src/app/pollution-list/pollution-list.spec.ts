import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { PollutionList } from './pollution-list';
import { PollutionService } from '../services/pollution.service';
import { Pollution } from '../models/pollution.model';

describe('PollutionList', () => {
  let component: PollutionList;
  let fixture: ComponentFixture<PollutionList>;
  let mockPollutionService: Partial<PollutionService>;

  const dummyList: Pollution[] = [
    {
      id: 1,
      titre: 'Bouteilles plastiques',
      type: 'Plastique',
      description: 'Déchets sur la rive',
      date: '2026-10-15',
      lieu: 'Strasbourg',
      latitude: 48.5,
      longitude: 7.7,
    },
    {
      id: 2,
      titre: 'Déversement huileux',
      type: 'Eau',
      description: 'Nappe suspecte',
      date: '2026-10-20',
      lieu: 'Illkirch',
      latitude: 48.4,
      longitude: 7.6,
    },
  ];

  beforeEach(async () => {
    mockPollutionService = {
      getPollutions: () => of(dummyList),
      deletePollution: (id: number) => of(void 0),
    };

    await TestBed.configureTestingModule({
      imports: [PollutionList],
      providers: [provideRouter([]), { provide: PollutionService, useValue: mockPollutionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PollutionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load pollutions on init', () => {
    expect(component).toBeTruthy();
    expect(component.pollutions().length).toBe(2);
    expect(component.filteredPollutions().length).toBe(2);
  });

  it('should filter pollutions by search query', () => {
    component.searchQuery.set('plastiques');
    expect(component.filteredPollutions().length).toBe(1);
    expect(component.filteredPollutions()[0].titre).toBe('Bouteilles plastiques');
  });

  it('should filter pollutions by type', () => {
    component.selectedType.set('Eau');
    expect(component.filteredPollutions().length).toBe(1);
    expect(component.filteredPollutions()[0].type).toBe('Eau');
  });
});
