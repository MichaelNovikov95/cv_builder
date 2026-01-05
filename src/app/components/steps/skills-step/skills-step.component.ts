import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CvFormService } from '../../../services/cv-form.service';

@Component({
  selector: 'app-skills-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-semibold">Skills</h2>
        <button
          type="button"
          (click)="addGroup()"
          class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm"
        >
          + Add Skill Group
        </button>
      </div>

      <div *ngIf="skillsArray.length === 0" class="text-gray-500 text-center py-8">
        No skill groups yet. Click "Add Skill Group" to get started.
      </div>

      <div
        *ngFor="let group of skillsArray.controls; let i = index"
        class="border border-gray-200 rounded-lg p-4 space-y-4"
      >
        <div class="flex items-start justify-between">
          <h3 class="text-lg font-semibold">Skill Group #{{ i + 1 }}</h3>
          <button
            type="button"
            (click)="removeGroup(i)"
            class="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm"
          >
            Remove
          </button>
        </div>

        <div [formGroup]="$any(group)" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Group Name <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              formControlName="name"
              placeholder="e.g., Frontend, Backend, Tools"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Skills</label>
            <div formArrayName="items" class="space-y-2">
              <div
                *ngFor="let skill of getItems($any(group)).controls; let j = index"
                class="flex gap-2"
              >
                <input
                  type="text"
                  [formControl]="$any(skill)"
                  placeholder="Enter skill..."
                  class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  (click)="removeItem($any(group), j)"
                  class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  Remove
                </button>
              </div>
              <button
                type="button"
                (click)="addItem($any(group))"
                class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                + Add Skill
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SkillsStepComponent {
  @Input() formArray!: FormArray;

  constructor(private formService: CvFormService) {}

  get skillsArray(): FormArray {
    return this.formArray;
  }

  getItems(group: FormGroup): FormArray {
    return group.get('items') as FormArray;
  }

  addGroup(): void {
    const groupForm = this.formService.createSkillsGroupForm();
    this.skillsArray.push(groupForm);
  }

  removeGroup(index: number): void {
    this.skillsArray.removeAt(index);
  }

  addItem(group: FormGroup): void {
    const items = group.get('items') as FormArray;
    items.push(new FormControl(''));
  }

  removeItem(group: FormGroup, index: number): void {
    const items = group.get('items') as FormArray;
    this.formService.removeBullet(items, index);
  }
}


