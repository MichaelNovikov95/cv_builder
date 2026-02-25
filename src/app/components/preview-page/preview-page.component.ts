import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CvStoreService } from '../../services/cv-store.service';
import { ThemeService } from '../../services/theme.service';
import { I18nService } from '../../services/i18n.service';
import { CvTemplateClassicComponent } from '../templates/cv-template-classic/cv-template-classic.component';
import { CvTemplateTwoColumnComponent } from '../templates/cv-template-twocolumn/cv-template-twocolumn.component';

@Component({
  selector: 'app-preview-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CvTemplateClassicComponent,
    CvTemplateTwoColumnComponent,
  ],
  templateUrl: './preview-page.component.html',
})
export class PreviewPageComponent {
  public store = inject(CvStoreService);
  public theme = inject(ThemeService);
  public i18n = inject(I18nService);

  print(): void {
    window.print();
  }

  goBack(): void {
    window.history.back();
  }

  toggleTheme(): void {
    this.theme.toggle();
  }

  toggleLocale(): void {
    this.i18n.toggleLocale();
  }
}
