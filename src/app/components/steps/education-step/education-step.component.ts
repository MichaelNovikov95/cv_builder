import {Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
}


