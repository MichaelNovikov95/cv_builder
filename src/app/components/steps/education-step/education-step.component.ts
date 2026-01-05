import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CvFormService } from '../../../services/cv-form.service';
import { ReorderButtonsComponent } from '../../reorder-buttons/reorder-buttons.component';

@Component({
  selector: 'app-education-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReorderButtonsComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-semibold">Education</h2>
        <button
          type="button"
          (click)="addEducation()"
          class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm"
        >
          + Add Education
        </button>
      </div>

      <div *ngIf="educationArray.length === 0" class="text-gray-500 text-center py-8">
        No education entries yet. Click "Add Education" to get started.
      </div>

      <div
        *ngFor="let edu of educationArray.controls; let i = index"
        class="border border-gray-200 rounded-lg p-4 space-y-4"
      >
        <div class="flex items-start justify-between">
          <h3 class="text-lg font-semibold">Education #{{ i + 1 }}</h3>
          <div class="flex items-center gap-2">
            <app-reorder-buttons
              [canMoveUp]="i > 0"
              [canMoveDown]="i < educationArray.length - 1"
              (moveUp)="moveUp(i)"
              (moveDown)="moveDown(i)"
            ></app-reorder-buttons>
            <button
              type="button"
              (click)="removeEducation(i)"
              class="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm"
            >
              Remove
            </button>
          </div>
        </div>

        <div [formGroup]="$any(edu)" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                School/University <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="school"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Degree <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="degree"
                placeholder="e.g., Bachelor of Science"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
              <input
                type="text"
                formControlName="field"
                placeholder="e.g., Computer Science"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                formControlName="startDate"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                formControlName="endDate"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                formControlName="notes"
                rows="2"
                placeholder="e.g., GPA, honors, relevant coursework..."
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class EducationStepComponent {
  @Input() formArray!: FormArray;

  constructor(private formService: CvFormService) {}

  get educationArray(): FormArray {
    return this.formArray;
  }

  addEducation(): void {
    const itemForm = this.formService.createEducationItemForm();
    this.educationArray.push(itemForm);
  }

  removeEducation(index: number): void {
    this.educationArray.removeAt(index);
  }

  moveUp(index: number): void {
    this.formService.moveUp(this.educationArray, index);
  }

  moveDown(index: number): void {
    this.formService.moveDown(this.educationArray, index);
  }
}


