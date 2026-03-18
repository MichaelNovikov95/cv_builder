import {Component, OnInit, OnDestroy, effect, inject, untracked} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
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
import { SkillsStepComponent } from '../steps/skills-step/skills-step.component';
import { LanguagesStepComponent } from '../steps/languages-step/languages-step.component';
import { CvPreviewComponent } from '../cv-preview/cv-preview.component';
import { I18nService } from '../../services/i18n.service';
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
  { id: 2, name: 'Technologies', key: 'skills' },
  { id: 3, name: 'Languages', key: 'languages' },
];

@Component({
  selector: 'app-cv-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProfileStepComponent,
    ExperienceStepComponent,
    SkillsStepComponent,
    LanguagesStepComponent,
    CvPreviewComponent,
  ],
  templateUrl: './cv-editor.component.html',
})
export class CvEditorComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  public store = inject(CvStoreService);
  public i18n = inject(I18nService);
  private formService = inject(CvFormService);

  steps: Step[] = STEPS;
  activeStep = 0;
  cvForm!: FormGroup;
  validationNotice: string | null = null;
  private readonly visibleStepIds = new Set(STEPS.map(step => step.id));
  private formSubscription?: Subscription;

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

  canShowLivePreview(): boolean {
    return Boolean(this.cvForm) && this.profileForm.valid;
  }

  stepLabel(key: StepKey): string {
    switch (key) {
      case 'profile':
        return this.i18n.t('editor.step.profile');
      case 'experience':
        return this.i18n.t('editor.step.experience');
      case 'skills':
        return this.i18n.t('editor.step.technologies');
      case 'languages':
        return this.i18n.t('editor.step.languages');
      default:
        return key;
    }
  }

  private readonly syncActiveStep = effect(() => {
    const requestedStep = this.store.ui().activeStep;
    if (this.visibleStepIds.has(requestedStep)) {
      this.activeStep = requestedStep;
      return;
    }

    const fallbackStep = this.steps[0]?.id ?? 0;
    this.activeStep = fallbackStep;

    if (requestedStep !== fallbackStep) {
      queueMicrotask(() => this.store.setActiveStep(fallbackStep));
    }
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

    this.cvForm.get('education')?.disable({ emitEvent: false });
    this.cvForm.get('projects')?.disable({ emitEvent: false });
    this.cvForm.get('certifications')?.disable({ emitEvent: false });
    this.cvForm.get('additional')?.disable({ emitEvent: false });
  }

  subscribeToFormChanges(): void {
    this.formSubscription?.unsubscribe();
    this.formSubscription = this.cvForm.valueChanges
      .pipe(debounceTime(150))
      .subscribe(() => {
        if (this.profileForm.valid) {
          this.updateStore();
        }

        if (this.cvForm.dirty) {
          this.validationNotice = this.i18n.t('editor.validation.formErrors');
          return;
        }

        this.validationNotice = null;
      });
  }

  updateStore(): void {
    const profile = this.formService.profileFormToModel(this.profileForm);
    const experience = this.formService.experienceFormToModel(this.experienceForm);
    const education = this.formService.educationFormToModel(this.educationForm);
    const skills = this.formService.skillsFormToModel(this.skillsForm);
    const projects = this.store.cv().projects;
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
    if (this.cvForm?.invalid) {
      this.getStepControl(this.activeStep)?.markAllAsTouched();
      this.validationNotice = this.i18n.t('editor.validation.invalidFields');
    }

    this.store.setActiveStep(step);
  }

  private rebuildFormFromStore(): void {
    this.buildForm();
    this.validationNotice = null;
    this.subscribeToFormChanges();
  }

  private getStepControl(step: number): AbstractControl | null {
    switch (step) {
      case 0:
        return this.profileForm;
      case 1:
        return this.experienceForm;
      case 2:
        return this.skillsForm;
      case 3:
        return this.languagesForm;
      default:
        return null;
    }
  }

}
