import {Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CvFormService } from '../../../services/cv-form.service';
import { ReorderButtonsComponent } from '../../reorder-buttons/reorder-buttons.component';

@Component({
  selector: 'app-experience-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReorderButtonsComponent],
  templateUrl: 'experience-step.component.html',
})
export class ExperienceStepComponent {
  public formService = inject(CvFormService);
  @Input() formArray!: FormArray;

  get experienceArray(): FormArray {
    return this.formArray;
  }

  getAchievements(exp: FormGroup): FormArray {
    return exp.get('achievements') as FormArray;
  }

  addExperience(): void {
    const itemForm = this.formService.createExperienceItemForm();
    this.experienceArray.push(itemForm);
  }

  removeExperience(index: number): void {
    this.experienceArray.removeAt(index);
  }

  moveUp(index: number): void {
    this.formService.moveUp(this.experienceArray, index);
  }

  moveDown(index: number): void {
    this.formService.moveDown(this.experienceArray, index);
  }

  addBullet(exp: FormGroup): void {
    const achievements = exp.get('achievements') as FormArray;
    this.formService.addBullet(achievements);
  }

  removeBullet(exp: FormGroup, index: number): void {
    const achievements = exp.get('achievements') as FormArray;
    this.formService.removeBullet(achievements, index);
  }

  onCurrentChange(exp: FormGroup): void {
    if (exp.get('current')?.value) {
      exp.get('endDate')?.setValue('');
    }
  }
}


