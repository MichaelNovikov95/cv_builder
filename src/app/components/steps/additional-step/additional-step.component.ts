import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CvFormService } from '../../../services/cv-form.service';

@Component({
  selector: 'app-additional-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6" [formGroup]="form">
      <h2 class="text-2xl font-semibold mb-4">Additional Information</h2>

      <!-- Interests -->
      <div class="border border-gray-200 rounded-lg p-4 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Interests</h3>
        </div>
        <div formArrayName="interests" class="space-y-2">
          <div
            *ngFor="let interest of interestsArray.controls; let i = index"
            class="flex gap-2"
          >
            <input
              type="text"
              [formControl]="$any(interest)"
              placeholder="Enter interest..."
              class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              (click)="removeInterest(i)"
              class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              Remove
            </button>
          </div>
          <button
            type="button"
            (click)="addInterest()"
            class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            + Add Interest
          </button>
        </div>
      </div>

      <!-- Volunteering -->
      <div class="border border-gray-200 rounded-lg p-4 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Volunteering</h3>
          <button
            type="button"
            (click)="addVolunteering()"
            class="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm"
          >
            + Add Volunteering
          </button>
        </div>
        <div formArrayName="volunteering" class="space-y-4">
          <div
            *ngFor="let vol of volunteeringArray.controls; let i = index"
            class="border border-gray-100 rounded p-4 space-y-4"
          >
            <div class="flex items-start justify-between">
              <h4 class="font-medium">Volunteering #{{ i + 1 }}</h4>
              <button
                type="button"
                (click)="removeVolunteering(i)"
                class="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm"
              >
                Remove
              </button>
            </div>
            <div [formGroup]="$any(vol)" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Organization <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="organization"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Role <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="role"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Period <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="period"
                  placeholder="e.g., 2020 - Present"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  formControlName="description"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Awards -->
      <div class="border border-gray-200 rounded-lg p-4 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Awards</h3>
          <button
            type="button"
            (click)="addAward()"
            class="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm"
          >
            + Add Award
          </button>
        </div>
        <div formArrayName="awards" class="space-y-4">
          <div
            *ngFor="let award of awardsArray.controls; let i = index"
            class="border border-gray-100 rounded p-4 space-y-4"
          >
            <div class="flex items-start justify-between">
              <h4 class="font-medium">Award #{{ i + 1 }}</h4>
              <button
                type="button"
                (click)="removeAward(i)"
                class="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm"
              >
                Remove
              </button>
            </div>
            <div [formGroup]="$any(award)" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Title <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="title"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Issuer <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="issuer"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Date <span class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  formControlName="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  formControlName="description"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdditionalStepComponent {
  @Input() form!: FormGroup;

  constructor(private formService: CvFormService) {}

  get interestsArray(): FormArray {
    return this.form.get('interests') as FormArray;
  }

  get volunteeringArray(): FormArray {
    return this.form.get('volunteering') as FormArray;
  }

  get awardsArray(): FormArray {
    return this.form.get('awards') as FormArray;
  }

  addInterest(): void {
    this.interestsArray.push(new FormControl(''));
  }

  removeInterest(index: number): void {
    this.interestsArray.removeAt(index);
  }

  addVolunteering(): void {
    const volForm = this.formService.createVolunteeringItemForm();
    this.volunteeringArray.push(volForm);
  }

  removeVolunteering(index: number): void {
    this.volunteeringArray.removeAt(index);
  }

  addAward(): void {
    const awardForm = this.formService.createAwardItemForm();
    this.awardsArray.push(awardForm);
  }

  removeAward(index: number): void {
    this.awardsArray.removeAt(index);
  }
}


