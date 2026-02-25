import {Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CvFormService } from '../../../services/cv-form.service';
import { I18nService } from '../../../services/i18n.service';

@Component({
  standalone: true,
  selector: 'app-languages-step',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './language-step.component.html',
})
export class LanguagesStepComponent {
  public formService = inject(CvFormService);
  public i18n = inject(I18nService);
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

  showControlError(control: AbstractControl | null, errorCode?: string): boolean {
    if (!control) {
      return false;
    }

    const interacted = control.touched || control.dirty;
    return interacted && (errorCode ? control.hasError(errorCode) : control.invalid);
  }
}
