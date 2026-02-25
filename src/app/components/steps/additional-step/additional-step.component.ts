import {Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CvFormService } from '../../../services/cv-form.service';

@Component({
  selector: 'app-additional-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'additional-step.component.html',
})
export class AdditionalStepComponent {
  public formService = inject(CvFormService);
  @Input() form!: FormGroup;

  get interestsArray(): FormArray {
    return this.form.get('interests') as FormArray;
  }

  get volunteeringArray(): FormArray {
    return this.form.get('volunteering') as FormArray;
  }

  get awardsArray(): FormArray {
    return this.form.get('awards') as FormArray;
  }

  addInterest(): void {
    this.interestsArray.push(new FormControl(''));
  }

  removeInterest(index: number): void {
    this.interestsArray.removeAt(index);
  }

  addVolunteering(): void {
    const volForm = this.formService.createVolunteeringItemForm();
    this.volunteeringArray.push(volForm);
  }

  removeVolunteering(index: number): void {
    this.volunteeringArray.removeAt(index);
  }

  addAward(): void {
    const awardForm = this.formService.createAwardItemForm();
    this.awardsArray.push(awardForm);
  }

  removeAward(index: number): void {
    this.awardsArray.removeAt(index);
  }

  showControlError(control: AbstractControl | null, errorCode?: string): boolean {
    if (!control) {
      return false;
    }

    const interacted = control.touched || control.dirty;
    return interacted && (errorCode ? control.hasError(errorCode) : control.invalid);
  }
}

