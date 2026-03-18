import { Injectable, signal, computed, effect } from '@angular/core';
import {
  CvModel,
  CvTemplate,
  CvUiState,
  Profile,
  ExperienceItem,
  EducationItem,
  SkillsGroup,
  ProjectItem,
  CertificationItem,
  LanguageItem,
  AdditionalInfo,
} from '../models/cv.model';

const STORAGE_KEY = 'cvbuilder_data';
const SCHEMA_VERSION = '1.0.0';

const initialCv: CvModel = {
  schemaVersion: SCHEMA_VERSION,
  profile: {
    name: '',
    title: '',
    email: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  additional: {},
};

const initialUiState: CvUiState = {
  activeStep: 0,
  showSections: {
    profile: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    languages: true,
    additional: true,
  },
};

@Injectable({
  providedIn: 'root',
})
export class CvStoreService {
  readonly cv = signal<CvModel>(initialCv);
  readonly template = signal<CvTemplate>('classic');
  readonly ui = signal<CvUiState>(initialUiState);
  readonly cvReplacementVersion = signal(0);

  readonly sortedExperience = computed(() => {
    return [...this.cv().experience].reverse(); // Most recent first
  });

  readonly sortedEducation = computed(() => {
    return [...this.cv().education].reverse(); // Most recent first
  });

  readonly sortedProjects = computed(() => {
    return [...this.cv().projects].reverse();
  });

  readonly sortedCertifications = computed(() => {
    return [...this.cv().certifications].reverse();
  });

  private readonly demoExperienceStacks: Record<string, string[]> = {
    'Tech Corp Inc.|Senior Full Stack Developer': [
      'React',
      'Redux',
      'NestJS',
      'Node.js',
      'Sequelize',
      'TypeScript',
      'HTML5',
      'CSS3',
      'Nginx',
      'JavaScript',
      'AWS',
    ],
    'StartupXYZ|Full Stack Developer': [
      'Angular',
      'Node.js',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'PostgreSQL',
      'Docker',
      'AWS',
    ],
  };

  constructor() {
    this.load();

    effect(() => {
      const cvData = this.cv();
      const templateData = this.template();
      const uiData = this.ui();

      const timeoutId = setTimeout(() => {
        this.save();
      }, 500);

      return () => clearTimeout(timeoutId);
    });
  }

  private attachDemoExperienceStacks(experience: ExperienceItem[]): ExperienceItem[] {
    return experience.map(item => {
      const key = `${item.company}|${item.role}`;
      return {
        ...item,
        stack: item.stack?.length ? item.stack : (this.demoExperienceStacks[key] ?? []),
      };
    });
  }

  private normalizeCv(cv: CvModel): CvModel {
    return {
      ...cv,
      experience: this.attachDemoExperienceStacks(cv.experience ?? []),
    };
  }

  load(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);

        if (data.schemaVersion === SCHEMA_VERSION) {
          this.cv.set(this.normalizeCv(data.cv || initialCv));
          this.template.set(data.template || 'classic');
          if (data.ui) {
            this.ui.set({ ...initialUiState, ...data.ui });
          }
          this.bumpCvReplacementVersion();
        } else {
          console.warn('Schema version mismatch, using defaults');
        }
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      this.ui.update(ui => ({ ...ui, error: 'Failed to load saved data' }));
    }
  }

  save(): void {
    try {
      const data = {
        schemaVersion: SCHEMA_VERSION,
        cv: this.cv(),
        template: this.template(),
        ui: this.ui(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      this.ui.update(ui => ({ ...ui, error: 'Failed to save data' }));
    }
  }

  patchCv(partial: Partial<CvModel>): void {
    this.cv.update(current => ({ ...current, ...partial }));
  }

  resetToEmpty(): void {
    this.cv.set({
      ...initialCv,
      profile: { ...initialCv.profile },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      additional: {},
    });
    this.setActiveStep(0);
    this.bumpCvReplacementVersion();
  }

  setTemplate(template: CvTemplate): void {
    this.template.set(template);
  }

  toggleSection(key: keyof CvUiState['showSections']): void {
    this.ui.update(ui => ({
      ...ui,
      showSections: {
        ...ui.showSections,
        [key]: !ui.showSections[key],
      },
    }));
  }

  setActiveStep(step: number): void {
    this.ui.update(ui => ({ ...ui, activeStep: step }));
  }

  clearError(): void {
    this.ui.update(ui => ({ ...ui, error: undefined }));
  }

  exportJson(): string {
    return JSON.stringify(this.cv(), null, 2);
  }

  importJson(jsonString: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);

      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid JSON format' };
      }

      if (!parsed.profile || !parsed.profile.name || !parsed.profile.email) {
        return { success: false, error: 'Missing required fields: profile.name and profile.email' };
      }

      const imported: CvModel = {
        ...initialCv,
        ...parsed,
        profile: { ...initialCv.profile, ...parsed.profile },
        experience: parsed.experience || [],
        education: parsed.education || [],
        skills: parsed.skills || [],
        projects: parsed.projects || [],
        certifications: parsed.certifications || [],
        languages: parsed.languages || [],
        additional: parsed.additional || {},
        schemaVersion: SCHEMA_VERSION,
      };

      this.cv.set(this.normalizeCv(imported));
      this.bumpCvReplacementVersion();
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Invalid JSON' };
    }
  }

  resetToDemo(): void {
    const demoCv: CvModel = {
      schemaVersion: SCHEMA_VERSION,
      profile: {
        name: 'John Doe',
        title: 'Senior Full Stack Developer',
        photoUrl: 'https://placebear.com/400/300',
        email: 'john.doe@example.com',
        phone: '+380 (67) 123-45-67',
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev',
        linkedin: 'linkedin.com/in/johndoe',
        github: 'github.com/johndoe',
        summary: 'Experienced full-stack developer with 8+ years of expertise in building scalable web applications. Passionate about clean code, modern frameworks, and user-centered design.',
      },
      experience: [
        {
          company: 'Tech Corp Inc.',
          role: 'Senior Full Stack Developer',
          startDate: '2020-01-15',
          endDate: undefined,
          current: true,
          location: 'San Francisco, CA',
          achievements: [
            'Led a team of 5 developers to build a microservices architecture serving 1M+ users',
            'Reduced API response time by 60% through optimization and caching strategies',
            'Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes',
            'Mentored junior developers and established coding standards and best practices',
          ],
          role_description: "As a Senior Full Stack Developer, I was responsible for designing, " +
            "developing, and maintaining scalable web applications using a microservices architecture. " +
            "I collaborated closely with product managers, designers, and backend teams to deliver " +
            "high-quality features for a platform serving over one million users. My role included " +
            "leading technical decisions, optimizing system performance, implementing CI/CD pipelines, " +
            "and ensuring code quality through best practices and mentoring junior developers."
        },
        {
          company: 'StartupXYZ',
          role: 'Full Stack Developer',
          startDate: '2017-06-01',
          endDate: '2019-12-31',
          current: false,
          location: 'Remote',
          achievements: [
            'Built the MVP from scratch using Angular and Node.js, acquired 10K+ users in first year',
            'Designed and implemented RESTful APIs handling 100K+ requests per day',
            'Collaborated with designers to create responsive, accessible UI components',
          ],
          role_description: "As a Full Stack Developer at a fast-growing startup, I built the MVP from " +
            "the ground up using Angular and Node.js. I was involved in all stages of development, from " +
            "API design and backend implementation to creating responsive, accessible user interfaces. " +
            "I worked closely with designers and stakeholders to rapidly deliver features, scale the " +
            "platform to tens of thousands of users, and support high-traffic production workloads."
        },
        {
          company: 'Tech Corp Inc.',
          role: 'Senior Full Stack Developer',
          startDate: '2020-01-15',
          endDate: undefined,
          current: true,
          location: 'San Francisco, CA',
          achievements: [
            'Led a team of 5 developers to build a microservices architecture serving 1M+ users',
            'Reduced API response time by 60% through optimization and caching strategies',
            'Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes',
            'Mentored junior developers and established coding standards and best practices',
          ],
          role_description: "As a Senior Full Stack Developer, I was responsible for designing, " +
            "developing, and maintaining scalable web applications using a microservices architecture. " +
            "I collaborated closely with product managers, designers, and backend teams to deliver " +
            "high-quality features for a platform serving over one million users. My role included " +
            "leading technical decisions, optimizing system performance, implementing CI/CD pipelines, " +
            "and ensuring code quality through best practices and mentoring junior developers."
        },
        {
          company: 'StartupXYZ',
          role: 'Full Stack Developer',
          startDate: '2017-06-01',
          endDate: '2019-12-31',
          current: false,
          location: 'Remote',
          achievements: [
            'Built the MVP from scratch using Angular and Node.js, acquired 10K+ users in first year',
            'Designed and implemented RESTful APIs handling 100K+ requests per day',
            'Collaborated with designers to create responsive, accessible UI components',
          ],
          role_description: "As a Full Stack Developer at a fast-growing startup, I built the MVP from " +
            "the ground up using Angular and Node.js. I was involved in all stages of development, from " +
            "API design and backend implementation to creating responsive, accessible user interfaces. " +
            "I worked closely with designers and stakeholders to rapidly deliver features, scale the " +
            "platform to tens of thousands of users, and support high-traffic production workloads."
        },
        {
          company: 'Tech Corp Inc.',
          role: 'Senior Full Stack Developer',
          startDate: '2020-01-15',
          endDate: undefined,
          current: true,
          location: 'San Francisco, CA',
          achievements: [
            'Led a team of 5 developers to build a microservices architecture serving 1M+ users',
            'Reduced API response time by 60% through optimization and caching strategies',
            'Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes',
            'Mentored junior developers and established coding standards and best practices',
          ],
          role_description: "As a Senior Full Stack Developer, I was responsible for designing, " +
            "developing, and maintaining scalable web applications using a microservices architecture. " +
            "I collaborated closely with product managers, designers, and backend teams to deliver " +
            "high-quality features for a platform serving over one million users. My role included " +
            "leading technical decisions, optimizing system performance, implementing CI/CD pipelines, " +
            "and ensuring code quality through best practices and mentoring junior developers."
        },
        {
          company: 'StartupXYZ',
          role: 'Full Stack Developer',
          startDate: '2017-06-01',
          endDate: '2019-12-31',
          current: false,
          location: 'Remote',
          achievements: [
            'Built the MVP from scratch using Angular and Node.js, acquired 10K+ users in first year',
            'Designed and implemented RESTful APIs handling 100K+ requests per day',
            'Collaborated with designers to create responsive, accessible UI components',
          ],
          role_description: "As a Full Stack Developer at a fast-growing startup, I built the MVP from " +
            "the ground up using Angular and Node.js. I was involved in all stages of development, from " +
            "API design and backend implementation to creating responsive, accessible user interfaces. " +
            "I worked closely with designers and stakeholders to rapidly deliver features, scale the " +
            "platform to tens of thousands of users, and support high-traffic production workloads."
        },
        {
          company: 'Tech Corp Inc.',
          role: 'Senior Full Stack Developer',
          startDate: '2020-01-15',
          endDate: undefined,
          current: true,
          location: 'San Francisco, CA',
          achievements: [
            'Led a team of 5 developers to build a microservices architecture serving 1M+ users',
            'Reduced API response time by 60% through optimization and caching strategies',
            'Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes',
            'Mentored junior developers and established coding standards and best practices',
          ],
          role_description: "As a Senior Full Stack Developer, I was responsible for designing, " +
            "developing, and maintaining scalable web applications using a microservices architecture. " +
            "I collaborated closely with product managers, designers, and backend teams to deliver " +
            "high-quality features for a platform serving over one million users. My role included " +
            "leading technical decisions, optimizing system performance, implementing CI/CD pipelines, " +
            "and ensuring code quality through best practices and mentoring junior developers."
        },
        {
          company: 'StartupXYZ',
          role: 'Full Stack Developer',
          startDate: '2017-06-01',
          endDate: '2019-12-31',
          current: false,
          location: 'Remote',
          achievements: [
            'Built the MVP from scratch using Angular and Node.js, acquired 10K+ users in first year',
            'Designed and implemented RESTful APIs handling 100K+ requests per day',
            'Collaborated with designers to create responsive, accessible UI components',
          ],
          role_description: "As a Full Stack Developer at a fast-growing startup, I built the MVP from " +
            "the ground up using Angular and Node.js. I was involved in all stages of development, from " +
            "API design and backend implementation to creating responsive, accessible user interfaces. " +
            "I worked closely with designers and stakeholders to rapidly deliver features, scale the " +
            "platform to tens of thousands of users, and support high-traffic production workloads."
        },
      ],
      education: [
        {
          school: 'University of Technology',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2013-09-01',
          endDate: '2017-05-31',
          notes: 'Graduated Magna Cum Laude, GPA: 3.8/4.0',
        },
      ],
      skills: [
        {
          name: 'Frontend',
          items: ['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
        },
        {
          name: 'Backend',
          items: ['Node.js', 'Express', 'NestJS', 'Python', 'Django', 'PostgreSQL', 'MongoDB'],
        },
        {
          name: 'Tools',
          items: ['Git', 'Docker', 'AWS', 'Jenkins', 'Jest', 'Cypress'],
        },
      ],
      projects: [
        {
          name: 'E-Commerce Platform',
          description: 'Full-stack e-commerce solution with payment integration',
          stack: ['Angular', 'Node.js', 'PostgreSQL', 'Stripe API'],
          links: {
            live: 'https://example.com',
            github: 'github.com/johndoe/ecommerce',
          },
          highlights: [
            'Handles 10K+ concurrent users with 99.9% uptime',
            'Integrated payment processing with Stripe',
            'Real-time inventory management system',
          ],
        },
        {
          name: 'Task Management App',
          description: 'Collaborative task management tool with real-time updates',
          stack: ['React', 'Socket.io', 'MongoDB'],
          links: {
            github: 'github.com/johndoe/taskapp',
          },
          highlights: [
            'Real-time collaboration using WebSockets',
            'Drag-and-drop interface with intuitive UX',
          ],
        },
      ],
      certifications: [
        {
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          date: '2021-03-15',
          expiryDate: '2024-03-15',
          credentialId: 'AWS-123456',
          url: 'https://aws.amazon.com/certification',
        },
      ],
      languages: [
        { language: 'English', level: 'Native' },
        { language: 'Spanish', level: 'Fluent' },
      ],
      additional: {
        interests: ['Open Source', 'Photography', 'Hiking', 'Reading'],
        volunteering: [
          {
            organization: 'Code for Good',
            role: 'Volunteer Developer',
            period: '2018 - Present',
            description: 'Building web applications for non-profit organizations',
          },
        ],
        awards: [
          {
            title: 'Employee of the Year',
            issuer: 'Tech Corp Inc.',
            date: '2022-12-01',
            description: 'Recognized for outstanding contributions and leadership',
          },
        ],
      },
    };

    demoCv.experience = this.attachDemoExperienceStacks(demoCv.experience);

    this.cv.set(demoCv);
    this.template.set('classic');
    this.ui.set(initialUiState);
    this.bumpCvReplacementVersion();
  }

  reset(): void {
    this.cv.set(initialCv);
    this.template.set('classic');
    this.ui.set(initialUiState);
    this.bumpCvReplacementVersion();
  }

  private bumpCvReplacementVersion(): void {
    this.cvReplacementVersion.update(version => version + 1);
  }
}
