import {Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
}


