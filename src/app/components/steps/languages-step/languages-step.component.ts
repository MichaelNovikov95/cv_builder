import {Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CvFormService } from '../../../services/cv-form.service';

@Component({
  standalone: true,
  selector: 'app-languages-step',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './language-step.component.html',
})
export class LanguagesStepComponent {
  public formService = inject(CvFormService);
  @Input() formArray!: FormArray;

  get languagesArray(): FormArray {
    return this.formArray;
  }

  addLanguage(): void {
    const itemForm = this.formService.createLanguageItemForm();
    this.languagesArray.push(itemForm);
  }

  removeLanguage(index: number): void {
    this.languagesArray.removeAt(index);
  }
}


