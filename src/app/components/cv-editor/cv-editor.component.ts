import { Component, OnInit, OnDestroy, effect } from '@angular/core';
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
  template: `
    <div class="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
      <!-- Editor Panel -->
      <div class="flex-1 lg:w-1/2 overflow-y-auto bg-gray-50 p-6">
        <div class="max-w-3xl mx-auto">
          <!-- Stepper -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold">Edit Your CV</h2>
              <div class="flex items-center gap-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    [checked]="store.ui().compact"
                    (change)="store.setCompact(!store.ui().compact)"
                    class="w-4 h-4"
                  />
                  <span class="text-sm text-gray-700">Compact Spacing</span>
                </label>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 mb-4">
              <button
                *ngFor="let step of steps"
                type="button"
                (click)="goToStep(step.id)"
                [class.bg-blue-600]="activeStep === step.id"
                [class.text-white]="activeStep === step.id"
                [class.bg-gray-200]="activeStep !== step.id"
                [class.text-gray-700]="activeStep !== step.id"
                class="px-4 py-2 rounded text-sm font-medium hover:opacity-90"
              >
                {{ step.name }}
              </button>
            </div>
          </div>

          <!-- Section Toggles -->
          <div class="mb-4 p-4 bg-white rounded border border-gray-200">
            <h3 class="text-sm font-semibold mb-2">Show/Hide Sections</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <app-section-toggle
                *ngFor="let step of steps"
                [checked]="store.ui().showSections[step.key]"
                [label]="step.name"
                (toggle)="store.toggleSection(step.key)"
              ></app-section-toggle>
            </div>
          </div>

          <!-- Form Steps -->
          <div class="bg-white rounded-lg shadow p-6">
            <form [formGroup]="cvForm">
              <div [hidden]="activeStep !== 0">
                <app-profile-step [form]="profileForm"></app-profile-step>
              </div>
              <div [hidden]="activeStep !== 1">
                <app-experience-step [formArray]="experienceForm"></app-experience-step>
              </div>
              <div [hidden]="activeStep !== 2">
                <app-education-step [formArray]="educationForm"></app-education-step>
              </div>
              <div [hidden]="activeStep !== 3">
                <app-skills-step [formArray]="skillsForm"></app-skills-step>
              </div>
              <div [hidden]="activeStep !== 4">
                <app-projects-step [formArray]="projectsForm"></app-projects-step>
              </div>
              <div [hidden]="activeStep !== 5">
                <app-certifications-step [formArray]="certificationsForm"></app-certifications-step>
              </div>
              <div [hidden]="activeStep !== 6">
                <app-languages-step [formArray]="languagesForm"></app-languages-step>
              </div>
              <div [hidden]="activeStep !== 7">
                <app-additional-step [form]="additionalForm"></app-additional-step>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Preview Panel -->
      <div class="flex-1 lg:w-1/2 overflow-y-auto bg-gray-100 p-6 border-t lg:border-t-0 lg:border-l border-gray-300">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-xl font-semibold mb-4">Live Preview</h2>
          <app-cv-preview></app-cv-preview>
        </div>
      </div>
    </div>
  `,
})
export class CvEditorComponent implements OnInit, OnDestroy {
  steps: Step[] = STEPS;
  activeStep = 0;
  cvForm!: FormGroup;
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

  constructor(
    private fb: FormBuilder,
    public store: CvStoreService,
    private formService: CvFormService
  ) {
    // Sync active step from store
    effect(() => {
      this.activeStep = this.store.ui().activeStep;
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.subscribeToFormChanges();
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
}


