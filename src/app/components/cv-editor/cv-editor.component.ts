import {Component, OnInit, OnDestroy, computed, effect, inject, untracked} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { CvStoreService } from '../../services/cv-store.service';
import { CvFormService } from '../../services/cv-form.service';
import { ProfileStepComponent } from '../steps/profile-step/profile-step.component';
import { ExperienceStepComponent } from '../steps/experience-step/experience-step.component';
import { EducationStepComponent } from '../steps/education-step/education-step.component';
import { SkillsStepComponent } from '../steps/skills-step/skills-step.component';
import { ProjectsStepComponent } from '../steps/projects-step/projects-step.component';
import { CertificationsStepComponent } from '../steps/certifications-step/certifications-step.component';
import { LanguagesStepComponent } from '../steps/languages-step/languages-step.component';
import { AdditionalStepComponent } from '../steps/additional-step/additional-step.component';
import { CvPreviewComponent } from '../cv-preview/cv-preview.component';
import { SectionToggleComponent } from '../section-toggle/section-toggle.component';
import {CvUiState} from '../../models/cv.model';

type StepKey = keyof CvUiState['showSections'];

interface Step {
  id: number;
  name: string;
  key: StepKey;
}

const STEPS: Step[] = [
  { id: 0, name: 'Profile', key: 'profile' },
  { id: 1, name: 'Experience', key: 'experience' },
  { id: 2, name: 'Education', key: 'education' },
  { id: 3, name: 'Skills', key: 'skills' },
  { id: 4, name: 'Projects', key: 'projects' },
  { id: 5, name: 'Certifications', key: 'certifications' },
  { id: 6, name: 'Languages', key: 'languages' },
  { id: 7, name: 'Additional', key: 'additional' },
];

@Component({
  selector: 'app-cv-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProfileStepComponent,
    ExperienceStepComponent,
    EducationStepComponent,
    SkillsStepComponent,
    ProjectsStepComponent,
    CertificationsStepComponent,
    LanguagesStepComponent,
    AdditionalStepComponent,
    CvPreviewComponent,
    SectionToggleComponent,
  ],
  templateUrl: './cv-editor.component.html',
})
export class CvEditorComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  public store = inject(CvStoreService);
  private formService = inject(CvFormService);

  steps: Step[] = STEPS;
  activeStep = 0;
  cvForm!: FormGroup;
  private formSubscription?: Subscription;
  readonly hasPreviewData = computed(() => {
    const cv = this.store.cv();

    const hasProfileData = [
      cv.profile.name,
      cv.profile.title,
      cv.profile.photoUrl,
      cv.profile.email,
      cv.profile.phone,
      cv.profile.location,
      cv.profile.website,
      cv.profile.linkedin,
      cv.profile.github,
      cv.profile.summary,
    ].some(value => this.hasText(value));

    const hasSectionItems =
      cv.experience.length > 0 ||
      cv.education.length > 0 ||
      cv.skills.length > 0 ||
      cv.projects.length > 0 ||
      cv.certifications.length > 0 ||
      cv.languages.length > 0;

    const hasAdditionalData =
      (cv.additional.interests?.length ?? 0) > 0 ||
      (cv.additional.volunteering?.length ?? 0) > 0 ||
      (cv.additional.awards?.length ?? 0) > 0;

    return hasProfileData || hasSectionItems || hasAdditionalData;
  });

  get profileForm(): FormGroup {
    return this.cvForm.get('profile') as FormGroup;
  }

  get experienceForm(): FormArray {
    return this.cvForm.get('experience') as FormArray;
  }

  get educationForm(): FormArray {
    return this.cvForm.get('education') as FormArray;
  }

  get skillsForm(): FormArray {
    return this.cvForm.get('skills') as FormArray;
  }

  get projectsForm(): FormArray {
    return this.cvForm.get('projects') as FormArray;
  }

  get certificationsForm(): FormArray {
    return this.cvForm.get('certifications') as FormArray;
  }

  get languagesForm(): FormArray {
    return this.cvForm.get('languages') as FormArray;
  }

  get additionalForm(): FormGroup {
    return this.cvForm.get('additional') as FormGroup;
  }

  private readonly syncActiveStep = effect(() => {
    this.activeStep = this.store.ui().activeStep;
  });

  private readonly syncExternalCvReplacements = effect(() => {
    this.store.cvReplacementVersion();

    if (!this.cvForm) {
      return;
    }

    untracked(() => this.rebuildFormFromStore());
  });

  ngOnInit(): void {
    this.rebuildFormFromStore();
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

  buildForm(): void {
    const cv = this.store.cv();
    this.cvForm = this.fb.group({
      profile: this.formService.createProfileForm(cv.profile),
      experience: this.formService.createExperienceForm(cv.experience),
      education: this.formService.createEducationForm(cv.education),
      skills: this.formService.createSkillsForm(cv.skills),
      projects: this.formService.createProjectsForm(cv.projects),
      certifications: this.formService.createCertificationsForm(cv.certifications),
      languages: this.formService.createLanguagesForm(cv.languages),
      additional: this.formService.createAdditionalForm(cv.additional),
    });
  }

  subscribeToFormChanges(): void {
    this.formSubscription?.unsubscribe();
    this.formSubscription = this.cvForm.valueChanges
      .pipe(debounceTime(150))
      .subscribe(() => {
        if (this.cvForm.valid) {
          this.updateStore();
        }
      });
  }

  updateStore(): void {
    const profile = this.formService.profileFormToModel(this.profileForm);
    const experience = this.formService.experienceFormToModel(this.experienceForm);
    const education = this.formService.educationFormToModel(this.educationForm);
    const skills = this.formService.skillsFormToModel(this.skillsForm);
    const projects = this.formService.projectsFormToModel(this.projectsForm);
    const certifications = this.formService.certificationsFormToModel(this.certificationsForm);
    const languages = this.formService.languagesFormToModel(this.languagesForm);
    const additional = this.formService.additionalFormToModel(this.additionalForm);

    this.store.patchCv({
      profile,
      experience,
      education,
      skills,
      projects,
      certifications,
      languages,
      additional,
    });
  }

  goToStep(step: number): void {
    this.store.setActiveStep(step);
  }

  private rebuildFormFromStore(): void {
    this.buildForm();
    this.subscribeToFormChanges();
  }

  private hasText(value?: string): boolean {
    return Boolean(value?.trim());
  }
}
