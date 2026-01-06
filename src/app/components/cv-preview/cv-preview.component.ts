import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvStoreService } from '../../services/cv-store.service';
import { CvTemplateClassicComponent } from '../templates/cv-template-classic/cv-template-classic.component';
import { CvTemplateTwoColumnComponent } from '../templates/cv-template-twocolumn/cv-template-twocolumn.component';

@Component({
  selector: 'app-cv-preview',
  standalone: true,
  imports: [CommonModule, CvTemplateClassicComponent, CvTemplateTwoColumnComponent],
  templateUrl: './cv-preview.component.html',
})
export class CvPreviewComponent {
  public store = inject(CvStoreService);
}


