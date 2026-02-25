import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvStoreService } from '../../../services/cv-store.service';
import { formatDate, formatDateRange } from '../../../utils/date.util';

@Component({
  selector: 'app-cv-template-twocolumn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'cv-template-twocolumn.component.html',
  styleUrls: ['cv-template-twocolumn.component.css'],
})
export class CvTemplateTwoColumnComponent {
  public store = inject(CvStoreService);

  cv = this.store.cv;
  sortedExperience = this.store.sortedExperience;
  sortedEducation = this.store.sortedEducation;
  sortedCertifications = this.store.sortedCertifications;

  formatDate = formatDate;
  formatDateRange = formatDateRange;
}
