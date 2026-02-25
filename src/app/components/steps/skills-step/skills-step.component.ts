import {Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CvFormService } from '../../../services/cv-form.service';
import { TechStackIconService } from '../../../services/tech-stack-icon.service';

@Component({
  selector: 'app-skills-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'skills-step.component.html',
})
export class SkillsStepComponent {
  public formService = inject(CvFormService);
  public techStackIconService = inject(TechStackIconService);
  readonly skillOptions = [
    ...this.techStackIconService.getTechOptions(),
    'Communication',
    'Leadership',
    'Problem Solving',
    'Mentoring',
    'Agile',
    'Scrum',
    'System Design',
    'CI/CD',
  ];
  @Input() formArray!: FormArray;

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

  showControlError(control: AbstractControl | null, errorCode?: string): boolean {
    if (!control) {
      return false;
    }

    const interacted = control.touched || control.dirty;
    return interacted && (errorCode ? control.hasError(errorCode) : control.invalid);
  }
}

