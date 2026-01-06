import {Component, computed, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvStoreService } from '../../../services/cv-store.service';
import { formatDate, formatDateRange } from '../../../utils/date.util';

@Component({
  selector: 'app-cv-template-classic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'cv-template-classic.component.html',
  styleUrls: ['cv-template-classic.component.css'],
})
export class CvTemplateClassicComponent {
  public store = inject(CvStoreService);

  cv = this.store.cv;
  sortedExperience = this.store.sortedExperience;
  sortedEducation = this.store.sortedEducation;
  sortedProjects = this.store.sortedProjects;
  sortedCertifications = this.store.sortedCertifications;

  formatDate = formatDate;
  formatDateRange = formatDateRange;
}


