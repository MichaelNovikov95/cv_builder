import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'edit',
    loadComponent: () =>
      import('./components/cv-editor/cv-editor.component').then(
        (m) => m.CvEditorComponent
      ),
  },
  {
    path: 'preview',
    loadComponent: () =>
      import('./components/preview-page/preview-page.component').then(
        (m) => m.PreviewPageComponent
      ),
  },
  {
    path: '',
    redirectTo: '/edit',
    pathMatch: 'full',
  },
];
