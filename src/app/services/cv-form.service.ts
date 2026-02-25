import { Injectable } from '@angular/core';
import {
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import {
  CvModel,
  Profile,
  ExperienceItem,
  EducationItem,
  SkillsGroup,
  ProjectItem,
  CertificationItem,
  LanguageItem,
  AdditionalInfo,
} from '../models/cv.model';

@Injectable({
  providedIn: 'root',
})
export class CvFormService {
  createProfileForm(profile: Profile): FormGroup {
    return new FormGroup({
      name: new FormControl(profile.name || '', [Validators.required]),
      title: new FormControl(profile.title || '', [Validators.required]),
      photoUrl: new FormControl(profile.photoUrl || ''),
      email: new FormControl(profile.email || '', [Validators.required, Validators.email]),
      phone: new FormControl(profile.phone || ''),
      location: new FormControl(profile.location || ''),
      website: new FormControl(profile.website || ''),
      linkedin: new FormControl(profile.linkedin || ''),
      github: new FormControl(profile.github || ''),
      summary: new FormControl(profile.summary || '', [Validators.required]),
    });
  }

  createExperienceForm(experience: ExperienceItem[]): FormArray {
    return new FormArray(
      experience.map(item => this.createExperienceItemForm(item))
    );
  }

  createExperienceItemForm(item?: ExperienceItem): FormGroup {
    return new FormGroup({
      company: new FormControl(item?.company || '', [Validators.required]),
      role: new FormControl(item?.role || '', [Validators.required]),
      startDate: new FormControl(item?.startDate || '', [Validators.required]),
      endDate: new FormControl(item?.endDate || ''),
      current: new FormControl(item?.current || false),
      location: new FormControl(item?.location || ''),
      stack: new FormArray(
        (item?.stack || ['']).map(tech => new FormControl(tech || ''))
      ),
      achievements: new FormArray(
        (item?.achievements || ['']).map(ach => new FormControl(ach || ''))
      ),
    });
  }

  createEducationForm(education: EducationItem[]): FormArray {
    return new FormArray(
      education.map(item => this.createEducationItemForm(item))
    );
  }

  createEducationItemForm(item?: EducationItem): FormGroup {
    return new FormGroup({
      school: new FormControl(item?.school || '', [Validators.required]),
      degree: new FormControl(item?.degree || '', [Validators.required]),
      field: new FormControl(item?.field || ''),
      startDate: new FormControl(item?.startDate || '', [Validators.required]),
      endDate: new FormControl(item?.endDate || ''),
      notes: new FormControl(item?.notes || ''),
    });
  }

  createSkillsForm(skills: SkillsGroup[]): FormArray {
    return new FormArray(
      skills.map(group => this.createSkillsGroupForm(group))
    );
  }

  createSkillsGroupForm(group?: SkillsGroup): FormGroup {
    return new FormGroup({
      name: new FormControl(group?.name || '', [Validators.required]),
      items: new FormArray(
        (group?.items || ['']).map(item => new FormControl(item || ''))
      ),
    });
  }

  createProjectsForm(projects: ProjectItem[]): FormArray {
    return new FormArray(
      projects.map(item => this.createProjectItemForm(item))
    );
  }

  createProjectItemForm(item?: ProjectItem): FormGroup {
    return new FormGroup({
      name: new FormControl(item?.name || '', [Validators.required]),
      description: new FormControl(item?.description || '', [Validators.required]),
      stack: new FormArray(
        (item?.stack || ['']).map(tag => new FormControl(tag || ''))
      ),
      links: new FormGroup({
        live: new FormControl(item?.links?.live || ''),
        github: new FormControl(item?.links?.github || ''),
        demo: new FormControl(item?.links?.demo || ''),
      }),
      highlights: new FormArray(
        (item?.highlights || ['']).map(hl => new FormControl(hl || ''))
      ),
    });
  }

  createCertificationsForm(certifications: CertificationItem[]): FormArray {
    return new FormArray(
      certifications.map(item => this.createCertificationItemForm(item))
    );
  }

  createCertificationItemForm(item?: CertificationItem): FormGroup {
    return new FormGroup({
      name: new FormControl(item?.name || '', [Validators.required]),
      issuer: new FormControl(item?.issuer || '', [Validators.required]),
      date: new FormControl(item?.date || '', [Validators.required]),
      expiryDate: new FormControl(item?.expiryDate || ''),
      credentialId: new FormControl(item?.credentialId || ''),
      url: new FormControl(item?.url || ''),
    });
  }

  createLanguagesForm(languages: LanguageItem[]): FormArray {
    return new FormArray(
      languages.map(item => this.createLanguageItemForm(item))
    );
  }

  createLanguageItemForm(item?: LanguageItem): FormGroup {
    return new FormGroup({
      language: new FormControl(item?.language || '', [Validators.required]),
      level: new FormControl(item?.level || '', [Validators.required]),
    });
  }

  createAdditionalForm(additional: AdditionalInfo): FormGroup {
    return new FormGroup({
      interests: new FormArray(
        (additional?.interests || ['']).map(interest => new FormControl(interest || ''))
      ),
      volunteering: new FormArray(
        (additional?.volunteering || []).map(vol => this.createVolunteeringItemForm(vol))
      ),
      awards: new FormArray(
        (additional?.awards || []).map(award => this.createAwardItemForm(award))
      ),
    });
  }

  createVolunteeringItemForm(item?: NonNullable<AdditionalInfo['volunteering']>[number]): FormGroup {
    return new FormGroup({
      organization: new FormControl(item?.organization || '', [Validators.required]),
      role: new FormControl(item?.role || '', [Validators.required]),
      period: new FormControl(item?.period || '', [Validators.required]),
      description: new FormControl(item?.description || ''),
    });
  }

  createAwardItemForm(item?: NonNullable<AdditionalInfo['awards']>[number]): FormGroup {
    return new FormGroup({
      title: new FormControl(item?.title || '', [Validators.required]),
      issuer: new FormControl(item?.issuer || '', [Validators.required]),
      date: new FormControl(item?.date || '', [Validators.required]),
      description: new FormControl(item?.description || ''),
    });
  }

  // Helper methods for FormArrays
  addItem(formArray: FormArray, itemForm: FormGroup): void {
    formArray.push(itemForm);
  }

  removeItem(formArray: FormArray, index: number): void {
    formArray.removeAt(index);
  }

  moveUp(formArray: FormArray, index: number): void {
    if (index > 0) {
      const item = formArray.at(index);
      formArray.removeAt(index);
      formArray.insert(index - 1, item);
    }
  }

  moveDown(formArray: FormArray, index: number): void {
    if (index < formArray.length - 1) {
      const item = formArray.at(index);
      formArray.removeAt(index);
      formArray.insert(index + 1, item);
    }
  }

  addBullet(formArray: FormArray): void {
    formArray.push(new FormControl(''));
  }

  removeBullet(formArray: FormArray, index: number): void {
    formArray.removeAt(index);
  }

  // Convert form values to model
  profileFormToModel(form: FormGroup): Profile {
    return form.value as Profile;
  }

  experienceFormToModel(formArray: FormArray): ExperienceItem[] {
    return formArray.value.map((item: any) => ({
      ...item,
      stack: (item.stack || []).filter((s: string) => s.trim() !== ''),
      achievements: item.achievements.filter((a: string) => a.trim() !== ''),
    })) as ExperienceItem[];
  }

  educationFormToModel(formArray: FormArray): EducationItem[] {
    return formArray.value as EducationItem[];
  }

  skillsFormToModel(formArray: FormArray): SkillsGroup[] {
    return formArray.value.map((group: any) => ({
      ...group,
      items: group.items.filter((i: string) => i.trim() !== ''),
    })) as SkillsGroup[];
  }

  projectsFormToModel(formArray: FormArray): ProjectItem[] {
    return formArray.value.map((item: any) => ({
      ...item,
      stack: item.stack.filter((s: string) => s.trim() !== ''),
      highlights: item.highlights.filter((h: string) => h.trim() !== ''),
    })) as ProjectItem[];
  }

  certificationsFormToModel(formArray: FormArray): CertificationItem[] {
    return formArray.value as CertificationItem[];
  }

  languagesFormToModel(formArray: FormArray): LanguageItem[] {
    return formArray.value as LanguageItem[];
  }

  additionalFormToModel(form: FormGroup): AdditionalInfo {
    const value = form.value;
    return {
      interests: value.interests.filter((i: string) => i.trim() !== ''),
      volunteering: value.volunteering,
      awards: value.awards,
    };
  }
}
