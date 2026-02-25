import {Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CvFormService } from '../../../services/cv-form.service';
import { ReorderButtonsComponent } from '../../reorder-buttons/reorder-buttons.component';

@Component({
  selector: 'app-education-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReorderButtonsComponent],
  templateUrl: './education-step.component.html',
})
export class EducationStepComponent {
  public formService = inject(CvFormService);
  @Input() formArray!: FormArray;

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

  showControlError(control: AbstractControl | null, errorCode?: string): boolean {
    if (!control) {
      return false;
    }

    const interacted = control.touched || control.dirty;
    return interacted && (errorCode ? control.hasError(errorCode) : control.invalid);
  }

  showDateOrderError(edu: AbstractControl): boolean {
    const group = edu as FormGroup;
    const startDate = group.get('startDate');
    const endDate = group.get('endDate');
    return Boolean(group.errors?.['dateOrder']) && Boolean(
      group.touched || group.dirty || startDate?.touched || endDate?.touched || startDate?.dirty || endDate?.dirty
    );
  }
}

