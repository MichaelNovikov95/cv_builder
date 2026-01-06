import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'profile-step.component.html',
})
export class ProfileStepComponent {
  @Input() form!: FormGroup;
}


