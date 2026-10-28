import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PollutionService } from './pollution.service';
import { Pollution } from '../models/pollution.model';
import { environment } from '../../environments/environment';

describe('PollutionService', () => {
  let service: PollutionService;
  let httpTesting: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/pollutions`;

  const dummyPollutions: Pollution[] = [
    {
      id: 1,
      titre: 'Pollution 1',
      type: 'Plastique',
      description: 'Desc 1',
      date: '2026-10-15',
      lieu: 'Strasbourg',
      latitude: 48.5,
      longitude: 7.7,
    },
    {
      id: 2,
      titre: 'Pollution 2',
      type: 'Eau',
      description: 'Desc 2',
      date: '2026-10-16',
      lieu: 'Illkirch',
      latitude: 48.4,
      longitude: 7.6,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PollutionService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PollutionService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all pollutions (GET)', () => {
    service.getPollutions().subscribe((pollutions) => {
      expect(pollutions.length).toBe(2);
      expect(pollutions).toEqual(dummyPollutions);
    });

    const req = httpTesting.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPollutions);
  });

  it('should get pollution by id (GET)', () => {
    service.getPollutionById(1).subscribe((pollution) => {
      expect(pollution).toEqual(dummyPollutions[0]);
    });

    const req = httpTesting.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPollutions[0]);
  });

  it('should add a pollution (POST)', () => {
    const newPollution: Omit<Pollution, 'id'> = {
      titre: 'Nouvelle pollution',
      type: 'Air',
      description: 'Fumée',
      date: '2026-10-22',
      lieu: 'Schiltigheim',
      latitude: 48.6,
      longitude: 7.8,
    };

    const createdPollution: Pollution = { ...newPollution, id: 3 };

    service.addPollution(newPollution).subscribe((pollution) => {
      expect(pollution).toEqual(createdPollution);
    });

    const req = httpTesting.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPollution);
    req.flush(createdPollution);
  });

  it('should update a pollution (PUT)', () => {
    const changes: Partial<Pollution> = { titre: 'Titre modifié' };
    const updatedPollution: Pollution = { ...dummyPollutions[0], ...changes };

    service.updatePollution(1, changes).subscribe((pollution) => {
      expect(pollution.titre).toBe('Titre modifié');
    });

    const req = httpTesting.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedPollution);
  });

  it('should delete a pollution (DELETE)', () => {
    service.deletePollution(1).subscribe();

    const req = httpTesting.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
