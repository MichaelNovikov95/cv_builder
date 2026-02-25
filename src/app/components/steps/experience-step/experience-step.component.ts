import {Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CvFormService } from '../../../services/cv-form.service';
import { TechStackIconService } from '../../../services/tech-stack-icon.service';
import { ReorderButtonsComponent } from '../../reorder-buttons/reorder-buttons.component';

@Component({
  selector: 'app-experience-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReorderButtonsComponent],
  templateUrl: 'experience-step.component.html',
})
export class ExperienceStepComponent {
  public formService = inject(CvFormService);
  public techStackIconService = inject(TechStackIconService);
  @Input() formArray!: FormArray;

  get experienceArray(): FormArray {
    return this.formArray;
  }

  getAchievements(exp: FormGroup): FormArray {
    return exp.get('achievements') as FormArray;
  }

  getStack(exp: FormGroup): FormArray {
    return exp.get('stack') as FormArray;
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

  addStackItem(exp: FormGroup): void {
    const stack = exp.get('stack') as FormArray;
    this.formService.addBullet(stack);
  }

  removeStackItem(exp: FormGroup, index: number): void {
    const stack = exp.get('stack') as FormArray;
    this.formService.removeBullet(stack, index);
  }

  getStackSuggestion(control: AbstractControl): string | null {
    const value = String(control.value ?? '');
    return this.techStackIconService.suggestTechName(value);
  }

  acceptStackSuggestion(event: Event, control: AbstractControl): void {
    const suggestion = this.getStackSuggestion(control);
    if (!suggestion) {
      return;
    }

    event.preventDefault();
    control.setValue(suggestion);
    control.markAsDirty();
    control.markAsTouched();
  }

  onCurrentChange(exp: FormGroup): void {
    if (exp.get('current')?.value) {
      exp.get('endDate')?.setValue('');
    }
  }
}
