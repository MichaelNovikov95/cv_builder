import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvStoreService } from '../../services/cv-store.service';
import { CvTemplateClassicComponent } from '../templates/cv-template-classic/cv-template-classic.component';
import { CvTemplateTwoColumnComponent } from '../templates/cv-template-twocolumn/cv-template-twocolumn.component';

@Component({
  selector: 'app-cv-preview',
  standalone: true,
  imports: [CommonModule, CvTemplateClassicComponent, CvTemplateTwoColumnComponent],
  template: `
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-[900px] mx-auto">
      <app-cv-template-classic
        *ngIf="store.template() === 'classic'"
      ></app-cv-template-classic>
      <app-cv-template-twocolumn
        *ngIf="store.template() === 'twocol'"
      ></app-cv-template-twocolumn>
    </div>
  `,
})
export class CvPreviewComponent {
  constructor(public store: CvStoreService) {}
}


