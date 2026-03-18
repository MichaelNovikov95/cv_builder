export interface Profile {
  name: string;
  title: string;
  photoUrl?: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  role_description?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location?: string;
  stack?: string[];
  achievements: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface SkillsGroup {
  name: string;
  items: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  stack: string[];
  links?: {
    live?: string;
    github?: string;
    demo?: string;
  };
  highlights: string[];
}

export interface CertificationItem {
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface LanguageItem {
  language: string;
  level: string;
}

export interface AdditionalInfo {
  interests?: string[];
  volunteering?: Array<{
    organization: string;
    role: string;
    period: string;
    description?: string;
  }>;
  awards?: Array<{
    title: string;
    issuer: string;
    date: string;
    description?: string;
  }>;
}

export interface CvModel {
  schemaVersion: string;
  profile: Profile;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillsGroup[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  additional: AdditionalInfo;
}

export interface CvUiState {
  activeStep: number;
  showSections: {
    profile: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    projects: boolean;
    certifications: boolean;
    languages: boolean;
    additional: boolean;
  };
  error?: string;
}

export type CvTemplate = 'classic' | 'twocol';
