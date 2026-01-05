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
  startDate: string; // ISO date string
  endDate?: string; // ISO date string, undefined if current
  current: boolean;
  location?: string;
  achievements: string[]; // bullet points
}

export interface EducationItem {
  school: string;
  degree: string;
  field?: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  notes?: string;
}

export interface SkillsGroup {
  name: string; // e.g., "Frontend", "Backend", "Tools", "Languages"
  items: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  stack: string[]; // tags
  links?: {
    live?: string;
    github?: string;
    demo?: string;
  };
  highlights: string[]; // bullet points
}

export interface CertificationItem {
  name: string;
  issuer: string;
  date: string; // ISO date string
  expiryDate?: string; // ISO date string
  credentialId?: string;
  url?: string;
}

export interface LanguageItem {
  language: string;
  level: string; // e.g., "Native", "Fluent", "Intermediate", "Basic"
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
  compact: boolean;
  error?: string;
}

export type CvTemplate = 'classic' | 'twocol';


