import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvStoreService } from '../../../services/cv-store.service';
import { TechStackIconService } from '../../../services/tech-stack-icon.service';
import { formatDateRange } from '../../../utils/date.util';

@Component({
  selector: 'app-cv-template-classic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'cv-template-classic.component.html',
  styleUrls: ['cv-template-classic.component.css'],
})
export class CvTemplateClassicComponent {
  public store = inject(CvStoreService);
  public techStackIcons = inject(TechStackIconService);

  cv = this.store.cv;
  sortedExperience = this.store.sortedExperience;

  allSkills(): string[] {
    return this.cv().skills.flatMap(group => group.items);
  }

  formatDateRange = formatDateRange;
}
