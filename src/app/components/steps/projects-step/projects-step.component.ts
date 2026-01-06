import {Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CvFormService } from '../../../services/cv-form.service';
import { ReorderButtonsComponent } from '../../reorder-buttons/reorder-buttons.component';

@Component({
  selector: 'app-projects-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReorderButtonsComponent],
  templateUrl: 'projects-step.component.html',
})
export class ProjectsStepComponent {
  public formService = inject(CvFormService);
  @Input() formArray!: FormArray;

  get projectsArray(): FormArray {
    return this.formArray;
  }

  getStack(project: FormGroup): FormArray {
    return project.get('stack') as FormArray;
  }

  getHighlights(project: FormGroup): FormArray {
    return project.get('highlights') as FormArray;
  }

  addProject(): void {
    const itemForm = this.formService.createProjectItemForm();
    this.projectsArray.push(itemForm);
  }

  removeProject(index: number): void {
    this.projectsArray.removeAt(index);
  }

  moveUp(index: number): void {
    this.formService.moveUp(this.projectsArray, index);
  }

  moveDown(index: number): void {
    this.formService.moveDown(this.projectsArray, index);
  }

  addStackItem(project: FormGroup): void {
    const stack = project.get('stack') as FormArray;
    this.formService.addBullet(stack);
  }

  removeStackItem(project: FormGroup, index: number): void {
    const stack = project.get('stack') as FormArray;
    this.formService.removeBullet(stack, index);
  }

  addHighlight(project: FormGroup): void {
    const highlights = project.get('highlights') as FormArray;
    this.formService.addBullet(highlights);
  }

  removeHighlight(project: FormGroup, index: number): void {
    const highlights = project.get('highlights') as FormArray;
    this.formService.removeBullet(highlights, index);
  }
}


