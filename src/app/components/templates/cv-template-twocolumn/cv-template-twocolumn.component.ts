import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvStoreService } from '../../../services/cv-store.service';
import { I18nService } from '../../../services/i18n.service';
import { formatDateRange as formatDateRangeUtil } from '../../../utils/date.util';

@Component({
  selector: 'app-cv-template-twocolumn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'cv-template-twocolumn.component.html',
  styleUrls: ['cv-template-twocolumn.component.css'],
})
export class CvTemplateTwoColumnComponent {
  public store = inject(CvStoreService);
  public i18n = inject(I18nService);

  cv = this.store.cv;
  sortedExperience = this.store.sortedExperience;

  allSkills(): string[] {
    const seen = new Set<string>();

    return this.sortedExperience()
      .flatMap(exp => exp.stack ?? [])
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
