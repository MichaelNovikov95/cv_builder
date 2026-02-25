import {Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CvFormService } from '../../../services/cv-form.service';

@Component({
  selector: 'app-certifications-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'certification-step.component.html',
})
export class CertificationsStepComponent {
  public formService = inject(CvFormService);
  @Input() formArray!: FormArray;

  get certificationsArray(): FormArray {
    return this.formArray;
  }

  addCertification(): void {
    const itemForm = this.formService.createCertificationItemForm();
    this.certificationsArray.push(itemForm);
  }

  removeCertification(index: number): void {
    this.certificationsArray.removeAt(index);
  }

  showControlError(control: AbstractControl | null, errorCode?: string): boolean {
    if (!control) {
      return false;
    }

    const interacted = control.touched || control.dirty;
    return interacted && (errorCode ? control.hasError(errorCode) : control.invalid);
  }

  showDateOrderError(cert: AbstractControl): boolean {
    const group = cert as FormGroup;
    const date = group.get('date');
    const expiryDate = group.get('expiryDate');
    return Boolean(group.errors?.['dateOrder']) && Boolean(
      group.touched || group.dirty || date?.touched || expiryDate?.touched || date?.dirty || expiryDate?.dirty
    );
  }
}

