import { TestBed } from '@angular/core/testing';
import { CvStoreService } from './cv-store.service';
import {
  CvModel,
  CvTemplate,
  CvUiState,
} from '../models/cv.model';

describe('CvStoreService', () => {
  let service: CvStoreService;
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};

    spyOn(window.localStorage, 'getItem').and.callFake((key: string) =>
      Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null
    );
    spyOn(window.localStorage, 'setItem').and.callFake((key: string, value: string) => {
      storage[key] = value;
    });

    TestBed.configureTestingModule({
      providers: [CvStoreService],
    });

    service = TestBed.inject(CvStoreService);
  });

  it('should be created with default state', () => {
    expect(service).toBeTruthy();

    const cv = service.cv();
    const ui = service.ui();
    const template = service.template();

    expect(cv.profile.name).toBe('');
    expect(cv.experience.length).toBe(0);
    expect(ui.activeStep).toBe(0);
    expect(template).toBe('classic');
  });

  it('should compute sorted experience, education and projects in reverse order', () => {
    const base = service.cv();
    service.cv.set({
      ...base,
      experience: [
        { company: 'A', role: 'R', startDate: '2020', endDate: '2021', current: false, location: '', achievements: [] },
        { company: 'B', role: 'R', startDate: '2022', endDate: '', current: true, location: '', achievements: [] },
      ],
      education: [
        { school: 'Old', degree: 'D', field: '', startDate: '2010', endDate: '2014', notes: '' },
        { school: 'New', degree: 'D', field: '', startDate: '2015', endDate: '2019', notes: '' },
      ],
      projects: [
        {
          name: 'First',
          description: '',
          stack: [],
          links: {},
          highlights: [],
        },
        {
          name: 'Second',
          description: '',
          stack: [],
          links: {},
          highlights: [],
        },
      ],
      certifications: [
        {
          name: 'C1',
          issuer: 'I1',
          date: '2023-01-01',
          expiryDate: '',
          credentialId: '',
          url: '',
        },
        {
          name: 'C2',
          issuer: 'I2',
          date: '2024-01-01',
          expiryDate: '',
          credentialId: '',
          url: '',
        },
      ],
    });

    const sortedExp = service.sortedExperience();
    const sortedEdu = service.sortedEducation();
    const sortedProj = service.sortedProjects();
    const sortedCerts = service.sortedCertifications();

    expect(sortedExp.map(e => e.company)).toEqual(['B', 'A']);
    expect(sortedEdu.map(e => e.school)).toEqual(['New', 'Old']);
    expect(sortedProj.map(p => p.name)).toEqual(['Second', 'First']);
    expect(sortedCerts.map(c => c.name)).toEqual(['C2', 'C1']);
  });

  it('should patch CV model', () => {
    const before = service.cv();
    service.patchCv({
      profile: {
        ...before.profile,
        name: 'John',
      },
    });

    const after = service.cv();
    expect(after.profile.name).toBe('John');
    expect(after.experience).toEqual(before.experience);
  });

  it('should set template', () => {
    service.setTemplate('minimal' as CvTemplate);
    expect(service.template()).toBe('minimal' as CvTemplate);
  });

  it('should toggle UI section visibility', () => {
    const initial = service.ui();
    expect(initial.showSections.experience).toBeTrue();

    service.toggleSection('experience');
    expect(service.ui().showSections.experience).toBeFalse();

    service.toggleSection('experience');
    expect(service.ui().showSections.experience).toBeTrue();
  });

  it('should set active step and clear error', () => {
    service.setActiveStep(2);
    expect(service.ui().activeStep).toBe(2);

    service.ui.update(ui => ({ ...ui, error: 'Some error' }));
    expect(service.ui().error).toBe('Some error');

    service.clearError();
    expect(service.ui().error).toBeUndefined();
  });

  it('should export JSON from current CV', () => {
    service.patchCv({
      profile: {
        ...service.cv().profile,
        name: 'Jane Doe',
        email: 'jane@example.com',
      },
    });

    const json = service.exportJson();
    const parsed = JSON.parse(json);

    expect(parsed.profile.name).toBe('Jane Doe');
    expect(parsed.profile.email).toBe('jane@example.com');
  });

  it('should import JSON and validate required profile fields', () => {
    const validJson = JSON.stringify({
      profile: {
        name: 'John Doe',
        email: 'john@example.com',
      },
      experience: [
        {
          company: 'Company',
          role: 'Dev',
          startDate: '2020-01-01',
          endDate: '',
          current: true,
          location: '',
          achievements: [],
        },
      ],
    });

    const resultValid = service.importJson(validJson);
    expect(resultValid.success).toBeTrue();
    expect(service.cv().profile.name).toBe('John Doe');
    expect(service.cv().profile.email).toBe('john@example.com');
    expect(service.cv().experience.length).toBe(1);

    const invalidJsonMissingProfile = JSON.stringify({
      profile: {},
    });
    const resultInvalid1 = service.importJson(invalidJsonMissingProfile);
    expect(resultInvalid1.success).toBeFalse();
    expect(resultInvalid1.error).toContain('Missing required fields');

    const malformedJson = '{ not valid json }';
    const resultInvalid2 = service.importJson(malformedJson);
    expect(resultInvalid2.success).toBeFalse();
    expect(resultInvalid2.error).toBeDefined();
  });

  it('should reset to demo data', () => {
    service.patchCv({
      profile: {
        ...service.cv().profile,
        name: 'Temp',
      },
    });
    service.setTemplate('minimal' as CvTemplate);

    service.resetToDemo();

    const cv = service.cv();
    const ui = service.ui();
    const template = service.template();

    expect(cv.profile.name).toBe('John Doe');
    expect(cv.experience.length).toBeGreaterThan(0);
    expect(template).toBe('classic');
    expect(ui.activeStep).toBe(0);
  });

  it('should reset to initial empty state', () => {
    service.reset();

    const cv = service.cv();
    const ui = service.ui();
    const template = service.template();

    expect(cv.profile.name).toBe('');
    expect(cv.experience.length).toBe(0);
    expect(template).toBe('classic');
    expect(ui.activeStep).toBe(0);
  });

  it('should save to localStorage', () => {
    service.patchCv({
      profile: {
        ...service.cv().profile,
        name: 'Stored User',
        email: 'stored@example.com',
      },
    });

    service.save();

    const keys = Object.keys(storage);
    expect(keys.length).toBe(1);

    const raw = storage[keys[0]];
    const parsed = JSON.parse(raw);

    expect(parsed.schemaVersion).toBeDefined();
    expect(parsed.cv.profile.name).toBe('Stored User');
    expect(parsed.template).toBe(service.template());
    expect(parsed.ui.activeStep).toBe(service.ui().activeStep);
  });

  it('should load from localStorage when schema matches', () => {
    const fakeData = {
      schemaVersion: '1.0.0',
      cv: {
        schemaVersion: '1.0.0',
        profile: {
          name: 'Loaded User',
          title: '',
          email: 'loaded@example.com',
          summary: '',
        },
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        additional: {},
      } as CvModel,
      template: 'minimal' as CvTemplate,
      ui: {
        activeStep: 3,
        showSections: {
          profile: true,
          experience: false,
          education: true,
          skills: true,
          projects: true,
          certifications: true,
          languages: true,
          additional: true,
        },
      } as CvUiState,
    };

    storage['cvbuilder_data'] = JSON.stringify(fakeData);

    service.load();

    expect(service.cv().profile.name).toBe('Loaded User');
    expect(service.cv().profile.email).toBe('loaded@example.com');
    expect(service.template()).toBe('minimal' as CvTemplate);
    expect(service.ui().activeStep).toBe(3);
    expect(service.ui().showSections.experience).toBeFalse();
  });

  it('should ignore stored data when schema version mismatches', () => {
    const fakeData = {
      schemaVersion: '0.0.1',
      cv: {
        schemaVersion: '0.0.1',
        profile: {
          name: 'Old User',
          title: '',
          email: 'old@example.com',
          summary: '',
        },
      },
      template: 'minimal',
    };

    storage['cvbuilder_data'] = JSON.stringify(fakeData);

    const cv = service.cv();
    expect(cv.profile.name).toBe('');
  });
});
