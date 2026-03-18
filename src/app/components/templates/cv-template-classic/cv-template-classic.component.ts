import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvStoreService } from '../../../services/cv-store.service';
import { TechStackIconService } from '../../../services/tech-stack-icon.service';
import { I18nService } from '../../../services/i18n.service';
import { formatDateRange as formatDateRangeUtil } from '../../../utils/date.util';

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
  public i18n = inject(I18nService);

  cv = this.store.cv;
  sortedExperience = this.store.sortedExperience;

  allSkills(): string[] {
    const seen = new Set<string>();

    return this.cv()
      .skills
      .flatMap(group => group.items ?? [])
      .map(skill => skill.trim())
      .filter(Boolean)
      .filter(skill => {
        const key = skill.toLowerCase();
        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      });
  }

  formatDateRange = (start: string, end?: string, current?: boolean): string =>
    formatDateRangeUtil(start, end, current, this.i18n.locale(), this.i18n.t('date.present'));
}
