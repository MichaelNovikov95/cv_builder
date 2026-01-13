import {TestBed} from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CvFormService } from './cv-form.service';
import {
  Profile,
  ExperienceItem,
  SkillsGroup,
  ProjectItem,
  AdditionalInfo, EducationItem, CertificationItem, LanguageItem,
} from '../models/cv.model';

describe('CvFormService', () => {
  let service: CvFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CvFormService],
    });
    service = TestBed.inject(CvFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a profile form with correct structure', () => {
    const profile: Profile = {
      name: 'test_name',
      title: 'test_title',
      email: 'test@test.com',
      photoUrl: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: 'test_summary',
    };
    const form = service.createProfileForm(profile);
    expect(form).toBeInstanceOf(FormGroup);

    expect(form.get('name')).toBeInstanceOf(FormControl);
    expect(form.get('title')).toBeInstanceOf(FormControl);
    expect(form.get('email')).toBeInstanceOf(FormControl);
    expect(form.get('photoUrl')).toBeInstanceOf(FormControl);
    expect(form.get('phone')).toBeInstanceOf(FormControl);
    expect(form.get('location')).toBeInstanceOf(FormControl);
    expect(form.get('website')).toBeInstanceOf(FormControl);
    expect(form.get('linkedin')).toBeInstanceOf(FormControl);
    expect(form.get('github')).toBeInstanceOf(FormControl);
    expect(form.get('summary')).toBeInstanceOf(FormControl);

    expect(form.value).toEqual(profile);
  });

  it('should apply validators on profile form controls', () => {
    const profile: Profile = {
      name: '',
      title: '',
      email: '',
      photoUrl: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: '',
    };
    const form = service.createProfileForm(profile);
    const nameControl = form.get('name') as FormControl;
    const titleControl = form.get('title') as FormControl;
    const emailControl = form.get('email') as FormControl;
    const photoUrlControl = form.get('photoUrl') as FormControl;
    const phoneControl = form.get('phone') as FormControl;
    const locationControl = form.get('location') as FormControl;
    const websiteControl = form.get('website') as FormControl;
    const linkedinControl = form.get('linkedin') as FormControl;
    const githubControl = form.get('github') as FormControl;
    const summaryControl = form.get('summary') as FormControl;

    expect(nameControl.valid).toBeFalse();
    expect(titleControl.valid).toBeFalse();
    expect(photoUrlControl.valid).toBeTrue();
    expect(emailControl.valid).toBeFalse();
    expect(phoneControl.valid).toBeTrue();
    expect(locationControl.valid).toBeTrue();
    expect(websiteControl.valid).toBeTrue();
    expect(linkedinControl.valid).toBeTrue();
    expect(githubControl.valid).toBeTrue();
    expect(summaryControl.valid).toBeFalse();

    expect(form.valid).toBeFalse();

    nameControl.setValue('test_name');
    titleControl.setValue('test_title');
    emailControl.setValue('test_not_valid_email');
    summaryControl.setValue('test_summary');

    expect(nameControl.valid).toBeTrue();
    expect(titleControl.valid).toBeTrue();
    expect(emailControl.valid).toBeFalse();
    expect(summaryControl.valid).toBeTrue();

    expect(form.valid).toBeFalse();

    emailControl.setValue('test@gmail.com');
    expect(emailControl.valid).toBeTrue();

    expect(form.valid).toBeTrue();
  })

  it('should create an experience form', () => {
    const experience: ExperienceItem[] = [
      {
        company: 'test_company',
        role: 'test_role',
        startDate: Date.now().toString(),
        endDate: Date.now().toString(),
        current: false,
        location: '',
        achievements: ['test_achievement1', 'test_achievement2'],
      },
      {
        company: 'test_company2',
        role: 'test_role2',
        startDate: Date.now().toString(),
        endDate: '',
        current: true,
        location: '',
        achievements: ['test_achievement3', 'test_achievement4'],
      }
    ];
    const form = service.createExperienceForm(experience);
    expect(form).toBeInstanceOf(FormArray);

    const firstItemGroup = form.at(0) as FormGroup;
    const achievementsArray = firstItemGroup.get('achievements') as FormArray;

    expect(firstItemGroup.get('company')).toBeInstanceOf(FormControl);
    expect(firstItemGroup.get('role')).toBeInstanceOf(FormControl);
    expect(firstItemGroup.get('startDate')).toBeInstanceOf(FormControl);
    expect(firstItemGroup.get('endDate')).toBeInstanceOf(FormControl);
    expect(firstItemGroup.get('current')).toBeInstanceOf(FormControl);
    expect(firstItemGroup.get('location')).toBeInstanceOf(FormControl);
    expect(firstItemGroup.get('achievements')).toBeInstanceOf(FormArray);

    achievementsArray.controls.forEach((control, index) => {
      expect(control).toBeInstanceOf(FormControl);
      expect(control.value).toEqual(experience[0].achievements[index]);
    });

    expect(form.value).toEqual(experience);
  });

  it('should apply validators on experience form controls', () => {
    const experience: ExperienceItem[] = [
      {
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        current: false,
        location: '',
        achievements: [],
      },
      {
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        current: true,
        location: '',
        achievements: [],
      }
    ];

    const form = service.createExperienceForm(experience);
    const firstItemGroup = form.at(0) as FormGroup;
    const secondItemGroup = form.at(1) as FormGroup;

    const companyControlFirstGroup = firstItemGroup.get('company') as FormControl;
    const roleControlFirstGroup = firstItemGroup.get('role') as FormControl;
    const startDateControlFirstGroup = firstItemGroup.get('startDate') as FormControl;
    const endDateControlFirstGroup = firstItemGroup.get('endDate') as FormControl;
    const currentControlFirstGroup = firstItemGroup.get('current') as FormControl;
    const locationControlFirstGroup = firstItemGroup.get('location') as FormControl;
    const achievementsArrayFirstGroup = firstItemGroup.get('achievements') as FormArray;

    const companyControlSecondGroup = secondItemGroup.get('company') as FormControl;
    const roleControlSecondGroup = secondItemGroup.get('role') as FormControl;
    const startDateControlSecondGroup = secondItemGroup.get('startDate') as FormControl;
    const endDateControlSecondGroup = secondItemGroup.get('endDate') as FormControl;
    const currentControlSecondGroup = secondItemGroup.get('current') as FormControl;
    const locationControlSecondGroup = secondItemGroup.get('location') as FormControl;
    const achievementsArraySecondGroup = secondItemGroup.get('achievements') as FormArray;

    expect(companyControlFirstGroup.valid).toBeFalse();
    expect(roleControlFirstGroup.valid).toBeFalse();
    expect(startDateControlFirstGroup.valid).toBeFalse();
    expect(endDateControlFirstGroup.valid).toBeTrue();
    expect(currentControlFirstGroup.valid).toBeTrue();
    expect(locationControlFirstGroup.valid).toBeTrue();
    achievementsArrayFirstGroup.controls.forEach((control, index) => {
      expect(control.valid).toBeTrue();
    });

    expect(companyControlSecondGroup.valid).toBeFalse();
    expect(roleControlSecondGroup.valid).toBeFalse();
    expect(startDateControlSecondGroup.valid).toBeFalse();
    expect(endDateControlSecondGroup.valid).toBeTrue();
    expect(currentControlSecondGroup.valid).toBeTrue();
    expect(locationControlSecondGroup.valid).toBeTrue();
    achievementsArraySecondGroup.controls.forEach((control, index) => {
      expect(control.valid).toBeTrue();
    });

    expect(form.valid).toBeFalse();

    companyControlFirstGroup.setValue('test_company');
    roleControlFirstGroup.setValue('test_role');
    startDateControlFirstGroup.setValue(Date.now().toString());

    expect(companyControlFirstGroup.valid).toBeTrue();
    expect(roleControlFirstGroup.valid).toBeTrue();
    expect(startDateControlFirstGroup.valid).toBeTrue();

    expect(form.valid).toBeFalse();

    companyControlSecondGroup.setValue('test_company2');
    roleControlSecondGroup.setValue('test_role2');
    startDateControlSecondGroup.setValue(Date.now().toString());

    expect(form.valid).toBeTrue();
  })

  it('should create an education form', () => {
    const education: EducationItem[] = [
      {
        school: 'test_school',
        degree: 'test_degree',
        field: '',
        startDate: Date.now().toString(),
        endDate: Date.now().toString(),
        notes: 'test_notes',
      },
    ];
    const form = service.createEducationForm(education);
    expect(form).toBeInstanceOf(FormArray);
    expect(form.value).toEqual(education);
  });

  it('should apply validators on education form controls', () => {
    const education: EducationItem[] = [
      {
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        notes: '',
      },
    ];
    const form = service.createEducationForm(education);
    const firstGroup = form.at(0) as FormGroup;

    const schoolControl = firstGroup.get('school') as FormControl;
    const degreeControl = firstGroup.get('degree') as FormControl;
    const fieldControl = firstGroup.get('field') as FormControl;
    const startDateControl = firstGroup.get('startDate') as FormControl;
    const endDateControl = firstGroup.get('endDate') as FormControl;
    const notesControl = firstGroup.get('notes') as FormControl;

    expect(schoolControl.valid).toBeFalse();
    expect(degreeControl.valid).toBeFalse();
    expect(fieldControl.valid).toBeTrue();
    expect(startDateControl.valid).toBeFalse();
    expect(endDateControl.valid).toBeTrue();
    expect(notesControl.valid).toBeTrue();

    expect(form.valid).toBeFalse();

    schoolControl.setValue('test_school');
    degreeControl.setValue('test_degree');
    startDateControl.setValue(Date.now().toString());

    expect(form.valid).toBeTrue();
  });

  it('should create a skills form', () => {
    const skills: SkillsGroup[] = [
      {
        name: 'test_skill_group',
        items: ['test_skill1', 'test_skill2'],
      },
    ];
    const form = service.createSkillsForm(skills);
    expect(form).toBeInstanceOf(FormArray);

    expect(form.value).toEqual(skills);
  });

  it('should apply validators on skills form controls', () => {
    const skills: SkillsGroup[] = [
      {
        name: '',
        items: [],
      },
    ];
    const form = service.createSkillsForm(skills);
    const firstGroup = form.at(0) as FormGroup;

    const nameControl = firstGroup.get('name') as FormControl;
    const itemsArray = firstGroup.get('items') as FormArray;

    expect(nameControl.valid).toBeFalse();
    expect(itemsArray.valid).toBeTrue();

    expect(form.valid).toBeFalse();

    nameControl.setValue('test_skill_group');

    expect(nameControl.valid).toBeTrue();

    expect(form.valid).toBeTrue();
  });

  it('should create a project form', () => {
    const projects: ProjectItem[] = [
      {
        name: 'test_project',
        description: 'test_description',
        stack: ['test_stack1', 'test_stack2'],
        links: {
          live: 'test_live_link',
          github: 'test_github_link',
          demo: 'test_demo_link',
        },
        highlights: ['test_highlight1', 'test_highlight2'],
      },
    ];
    const form = service.createProjectsForm(projects);
    expect(form).toBeInstanceOf(FormArray);
    expect(form.value).toEqual(projects);
  });

  it('should apply validators on project form controls', () => {
    const projects: ProjectItem[] = [
      {
        name: '',
        description: '',
        stack: [],
        links: {
          live: '',
          github: '',
          demo: '',
        },
        highlights: [],
      },
    ];
    const form = service.createProjectsForm(projects);
    const firstGroup = form.at(0) as FormGroup;

    const nameControl = firstGroup.get('name') as FormControl;
    const descriptionControl = firstGroup.get('description') as FormControl;
    const stackArray = firstGroup.get('stack') as FormArray;
    const linksGroup = firstGroup.get('links') as FormGroup;
    const liveLinkControl = linksGroup.get('live') as FormControl;
    const githubLinkControl = linksGroup.get('github') as FormControl;
    const demoLinkControl = linksGroup.get('demo') as FormControl;
    const highlightsArray = firstGroup.get('highlights') as FormArray;

    expect(nameControl.valid).toBeFalse();
    expect(descriptionControl.valid).toBeFalse();
    expect(stackArray.valid).toBeTrue();
    expect(liveLinkControl.valid).toBeTrue();
    expect(githubLinkControl.valid).toBeTrue();
    expect(demoLinkControl.valid).toBeTrue();
    expect(highlightsArray.valid).toBeTrue();

    expect(form.valid).toBeFalse();

    nameControl.setValue('test_project');
    descriptionControl.setValue('test_description');

    expect(form.valid).toBeTrue();
  });

  it('should create certifications form', () => {
    const certifications: CertificationItem[] = [
      {
        name: 'test_certification',
        issuer: 'test_issuer',
        date: Date.now().toString(),
        expiryDate: Date.now().toString(),
        credentialId: 'test_credential_id',
        url: 'test_url',
      }
    ];
    const form = service.createCertificationsForm(certifications);
    expect(form).toBeInstanceOf(FormArray);
    expect(form.value).toEqual(certifications);
  });

  it('should apply validators on certifications form controls', () => {
    const certifications: CertificationItem[] = [
      {
        name: '',
        issuer: '',
        date: '',
        expiryDate: '',
        credentialId: '',
        url: '',
      }
    ];
    const form = service.createCertificationsForm(certifications);
    const firstGroup = form.at(0) as FormGroup;

    const nameControl = firstGroup.get('name') as FormControl;
    const issuerControl = firstGroup.get('issuer') as FormControl;
    const dateControl = firstGroup.get('date') as FormControl;
    const expiryDateControl = firstGroup.get('expiryDate') as FormControl;
    const credentialIdControl = firstGroup.get('credentialId') as FormControl;
    const urlControl = firstGroup.get('url') as FormControl;

    expect(nameControl.valid).toBeFalse();
    expect(issuerControl.valid).toBeFalse();
    expect(dateControl.valid).toBeFalse();
    expect(expiryDateControl.valid).toBeTrue();
    expect(credentialIdControl.valid).toBeTrue();
    expect(urlControl.valid).toBeTrue();

    expect(form.valid).toBeFalse();

    nameControl.setValue('test_certification');
    issuerControl.setValue('test_issuer');
    dateControl.setValue(Date.now().toString());

    expect(form.valid).toBeTrue();
  });

  it('should create language form', () => {
    const languages: LanguageItem[] = [{
      language: 'English',
      level: 'Native',
    }];
    const form = service.createLanguagesForm(languages);
    expect(form).toBeInstanceOf(FormArray);
    expect(form.value).toEqual(languages);
  });

  it('should apply validators on language form controls', () => {
    const languages: LanguageItem[] = [{
      language: '',
      level: '',
    }];
    const form = service.createLanguagesForm(languages);
    const firstGroup = form.at(0) as FormGroup;
    const languageControl = firstGroup.get('language') as FormControl;
    const levelControl = firstGroup.get('level') as FormControl;

    expect(languageControl.valid).toBeFalse();
    expect(levelControl.valid).toBeFalse();

    expect(form.valid).toBeFalse();

    languageControl.setValue('test_language');
    levelControl.setValue('test_level');

    expect(form.valid).toBeTrue();
  });

  it('should create additional form', () => {
    const additional: AdditionalInfo = {
        interests: ['test_1', 'test_2'],
        volunteering: [{
            organization: 'test',
            role: 'test',
            period: 'test',
            description: 'test'
          }],
        awards: [{
            title: 'test',
            issuer: 'test',
            date: Date.now().toString(),
            description: 'test'
          }]
      };
    const form = service.createAdditionalForm(additional);
    expect(form).toBeInstanceOf(FormGroup);

    expect(form.value).toEqual(additional);
  });

  it('should apply validators on additional form controls', () => {
    const additional: AdditionalInfo = {
      interests: [],
      volunteering: [],
      awards: []
    };
    const form = service.createAdditionalForm(additional);

    const interestArray = form.get('interests') as FormArray;

    const volunteeringArray = form.get('volunteering') as FormArray;

    const awardsArray = form.get('awards') as FormArray;

    expect(interestArray.valid).toBeTrue();
    expect(volunteeringArray.valid).toBeTrue();
    expect(awardsArray.valid).toBeTrue();

    expect(interestArray.length).toBe(0);
    expect(volunteeringArray.length).toBe(0);
    expect(awardsArray.length).toBe(0);

    service.addItem(
      volunteeringArray,
      service.createVolunteeringItemForm({
        organization: '',
        role: '',
        period: '',
        description: ''
      })
    );

    expect(volunteeringArray.length).toBe(1);

    const volunteeringItem = volunteeringArray.at(0) as FormGroup;

    const volunteeringOrg = volunteeringItem.get('organization') as FormControl;
    const volunteeringRole = volunteeringItem.get('role') as FormControl;
    const volunteeringPeriod = volunteeringItem.get('period') as FormControl;
    const volunteeringDescription = volunteeringItem.get('description') as FormControl;

    expect(volunteeringOrg.valid).toBeFalse();
    expect(volunteeringRole.valid).toBeFalse();
    expect(volunteeringPeriod.valid).toBeFalse();
    expect(volunteeringDescription.valid).toBeTrue();

    expect(volunteeringArray.valid).toBeFalse();

    volunteeringOrg.setValue('test_org');
    volunteeringRole.setValue('test_role');
    volunteeringPeriod.setValue('test_period');

    expect(volunteeringArray.valid).toBeTrue();

    service.addItem(
      awardsArray,
      service.createAwardItemForm({
        title: '',
        issuer: '',
        date: '',
        description: '',
      })
    );

    expect(awardsArray.length).toBe(1);

    const awardsItem = awardsArray.at(0) as FormGroup;

    const awardsTitle = awardsItem.get('title') as FormControl;
    const awardsIssuer = awardsItem.get('issuer') as FormControl;
    const awardsDate = awardsItem.get('date') as FormControl;
    const awardsDescription = awardsItem.get('description') as FormControl;

    expect(awardsTitle.valid).toBeFalse();
    expect(awardsIssuer.valid).toBeFalse();
    expect(awardsDate.valid).toBeFalse();
    expect(awardsDescription.valid).toBeTrue();

    expect(awardsArray.valid).toBeFalse();

    awardsTitle.setValue('test_title');
    awardsIssuer.setValue('test_issuer');
    awardsDate.setValue(Date.now().toString());

    expect(awardsArray.valid).toBeTrue();
  });

  it('should add item to array', () => {
    const array = new FormArray<FormGroup>([]);

    expect(array.length).toBe(0);

    const form = new FormGroup({});

    service.addItem(array, form);

    expect(array.length).toBe(1);
  });

  it('should remove item from array', () => {
    const array = new FormArray<FormGroup>([
      new FormGroup({})
    ]);
    expect(array.length).toBe(1);

    service.removeItem(array, 0);

    expect(array.length).toBe(0);
  });

  it('should move item up in array', () => {
    const array = new FormArray<FormGroup>([
      new FormGroup({
        id: new FormControl(1)
      }),
      new FormGroup({
        id: new FormControl(2)
      }),
      new FormGroup({
        id: new FormControl(3)
      })
    ]);

    service.moveUp(array, 1);

    expect(array.at(0).value).toEqual({ id: 2 });
    expect(array.at(1).value).toEqual({ id: 1 });
    expect(array.at(2).value).toEqual({ id: 3 });

  });

  it('should move item down in array', () => {
    const array = new FormArray<FormGroup>([
      new FormGroup({
        id: new FormControl(1)
      }),
      new FormGroup({
        id: new FormControl(2)
      }),
      new FormGroup({
        id: new FormControl(3)
      })
    ]);

    service.moveUp(array, 2);

    expect(array.at(0).value).toEqual({ id: 1 });
    expect(array.at(1).value).toEqual({ id: 3 });
    expect(array.at(2).value).toEqual({ id: 2 });
  });

  it('should add and remove bullet', () => {
    const array = new FormArray<FormGroup>([]);

    expect(array.length).toBe(0);

    service.addBullet(array);

    expect(array.length).toBe(1);

    service.removeBullet(array, 0);

    expect(array.length).toBe(0);
  });

  it('should convert form values to profile model', () => {
    const form = new FormGroup({
      name: new FormControl('test_name'),
      title: new FormControl('test_title'),
      email: new FormControl('test_email@gmail.com'),
      photoUrl: new FormControl(''),
      phone: new FormControl(''),
      location: new FormControl(''),
      website: new FormControl(''),
      linkedin: new FormControl(''),
      github: new FormControl('test_email'),
      summary: new FormControl('test_summary'),
    });

    const profileModel = service.profileFormToModel(form);

    expect(profileModel).toEqual({
      name: 'test_name',
      title: 'test_title',
      email: 'test_email@gmail.com',
      photoUrl: '',
      phone:'',
      location: '',
      website: '',
      linkedin: '',
      github: 'test_email',
      summary: 'test_summary',
    })
  });

  it('should convert experience form to model and filter empty achievements', () => {
    const formArray = new FormArray([
      new FormGroup({
        company: new FormControl('Company 1'),
        role: new FormControl('Role 1'),
        startDate: new FormControl('2020-01-01'),
        endDate: new FormControl('2021-01-01'),
        current: new FormControl(false),
        location: new FormControl('Location 1'),
        achievements: new FormArray([
          new FormControl('Achievement 1'),
          new FormControl(''),
          new FormControl(''),
          new FormControl('Achievement 2'),
        ]),
      }),
      new FormGroup({
        company: new FormControl('Company 2'),
        role: new FormControl('Role 2'),
        startDate: new FormControl('2022-01-01'),
        endDate: new FormControl(''),
        current: new FormControl(true),
        location: new FormControl('Location 2'),
        achievements: new FormArray([
          new FormControl(''),
          new FormControl(''),
        ]),
      }),
    ]);

    const result = service.experienceFormToModel(formArray);

    expect(result).toEqual([
      {
        company: 'Company 1',
        role: 'Role 1',
        startDate: '2020-01-01',
        endDate: '2021-01-01',
        current: false,
        location: 'Location 1',
        achievements: ['Achievement 1', 'Achievement 2'],
      },
      {
        company: 'Company 2',
        role: 'Role 2',
        startDate: '2022-01-01',
        endDate: '',
        current: true,
        location: 'Location 2',
        achievements: [],
      },
    ]);
  });

  it('should convert education form to model', () => {
    const formArray = new FormArray([
      new FormGroup({
        school: new FormControl('School 1'),
        degree: new FormControl('Degree 1'),
        field: new FormControl('Field 1'),
        startDate: new FormControl('2020-01-01'),
        endDate: new FormControl('2021-01-01'),
        notes: new FormControl('Notes 1'),
      }),
      new FormGroup({
        school: new FormControl('School 2'),
        degree: new FormControl('Degree 2'),
        field: new FormControl(''),
        startDate: new FormControl('2022-01-01'),
        endDate: new FormControl(''),
        notes: new FormControl(''),
      }),
    ]);

    const result = service.educationFormToModel(formArray);

    expect(result).toEqual([
      {
        school: 'School 1',
        degree: 'Degree 1',
        field: 'Field 1',
        startDate: '2020-01-01',
        endDate: '2021-01-01',
        notes: 'Notes 1',
      },
      {
        school: 'School 2',
        degree: 'Degree 2',
        field: '',
        startDate: '2022-01-01',
        endDate: '',
        notes: '',
      },
    ]);
  });

  it('should convert skills form to model and filter empty items', () => {
    const formArray = new FormArray([
      new FormGroup({
        name: new FormControl('Languages'),
        items: new FormArray([
          new FormControl('TypeScript'),
          new FormControl(''),
          new FormControl('  '),
          new FormControl('JavaScript'),
        ]),
      }),
      new FormGroup({
        name: new FormControl('Tools'),
        items: new FormArray([
          new FormControl('  '),
          new FormControl(''),
        ]),
      }),
    ]);

    const result = service.skillsFormToModel(formArray);

    expect(result).toEqual([
      {
        name: 'Languages',
        items: ['TypeScript', 'JavaScript'],
      },
      {
        name: 'Tools',
        items: [],
      },
    ]);
  });

  it('should convert projects form to model and filter empty stack and highlights', () => {
    const formArray = new FormArray([
      new FormGroup({
        name: new FormControl('Project 1'),
        description: new FormControl('Desc 1'),
        stack: new FormArray([
          new FormControl('Angular'),
          new FormControl(''),
          new FormControl('  '),
          new FormControl('Node.js'),
        ]),
        links: new FormGroup({
          live: new FormControl('live1'),
          github: new FormControl('github1'),
          demo: new FormControl('demo1'),
        }),
        highlights: new FormArray([
          new FormControl('Feature A'),
          new FormControl(''),
          new FormControl('  '),
          new FormControl('Feature B'),
        ]),
      }),
      new FormGroup({
        name: new FormControl('Project 2'),
        description: new FormControl('Desc 2'),
        stack: new FormArray([
          new FormControl(''),
          new FormControl('  '),
        ]),
        links: new FormGroup({
          live: new FormControl(''),
          github: new FormControl(''),
          demo: new FormControl(''),
        }),
        highlights: new FormArray([
          new FormControl(''),
          new FormControl('  '),
        ]),
      }),
    ]);

    const result = service.projectsFormToModel(formArray);

    expect(result).toEqual([
      {
        name: 'Project 1',
        description: 'Desc 1',
        stack: ['Angular', 'Node.js'],
        links: {
          live: 'live1',
          github: 'github1',
          demo: 'demo1',
        },
        highlights: ['Feature A', 'Feature B'],
      },
      {
        name: 'Project 2',
        description: 'Desc 2',
        stack: [],
        links: {
          live: '',
          github: '',
          demo: '',
        },
        highlights: [],
      },
    ]);
  });

  it('should convert certifications form to model', () => {
    const formArray = new FormArray([
      new FormGroup({
        name: new FormControl('Cert 1'),
        issuer: new FormControl('Issuer 1'),
        date: new FormControl('2023-01-01'),
        expiryDate: new FormControl('2025-01-01'),
        credentialId: new FormControl('ID-1'),
        url: new FormControl('http://example.com/1'),
      }),
      new FormGroup({
        name: new FormControl('Cert 2'),
        issuer: new FormControl('Issuer 2'),
        date: new FormControl('2024-01-01'),
        expiryDate: new FormControl(''),
        credentialId: new FormControl(''),
        url: new FormControl(''),
      }),
    ]);

    const result = service.certificationsFormToModel(formArray);

    expect(result).toEqual([
      {
        name: 'Cert 1',
        issuer: 'Issuer 1',
        date: '2023-01-01',
        expiryDate: '2025-01-01',
        credentialId: 'ID-1',
        url: 'http://example.com/1',
      },
      {
        name: 'Cert 2',
        issuer: 'Issuer 2',
        date: '2024-01-01',
        expiryDate: '',
        credentialId: '',
        url: '',
      },
    ]);
  });

  it('should convert languages form to model', () => {
    const formArray = new FormArray([
      new FormGroup({
        language: new FormControl('English'),
        level: new FormControl('Native'),
      }),
      new FormGroup({
        language: new FormControl('German'),
        level: new FormControl('B2'),
      }),
    ]);

    const result = service.languagesFormToModel(formArray);

    expect(result).toEqual([
      {
        language: 'English',
        level: 'Native',
      },
      {
        language: 'German',
        level: 'B2',
      },
    ]);
  });

  it('should convert additional form to model and filter empty interests', () => {
    const form = new FormGroup({
      interests: new FormArray([
        new FormControl('Coding'),
        new FormControl(''),
        new FormControl('  '),
        new FormControl('Music'),
      ]),
      volunteering: new FormArray([
        new FormGroup({
          organization: new FormControl('Org 1'),
          role: new FormControl('Role 1'),
          period: new FormControl('2020-2021'),
          description: new FormControl('Desc 1'),
        }),
      ]),
      awards: new FormArray([
        new FormGroup({
          title: new FormControl('Award 1'),
          issuer: new FormControl('Issuer 1'),
          date: new FormControl('2022-01-01'),
          description: new FormControl('Award desc'),
        }),
      ]),
    });

    const result = service.additionalFormToModel(form);

    expect(result).toEqual({
      interests: ['Coding', 'Music'],
      volunteering: [
        {
          organization: 'Org 1',
          role: 'Role 1',
          period: '2020-2021',
          description: 'Desc 1',
        },
      ],
      awards: [
        {
          title: 'Award 1',
          issuer: 'Issuer 1',
          date: '2022-01-01',
          description: 'Award desc',
        },
      ],
    });
  });
});
