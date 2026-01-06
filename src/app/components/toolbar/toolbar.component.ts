import {Component, inject, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CvStoreService } from '../../services/cv-store.service';
import { JsonImportModalComponent } from '../json-import-modal/json-import-modal.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, RouterModule, JsonImportModalComponent],
  templateUrl: 'toolbar.component.html',
})
export class ToolbarComponent {
  @ViewChild('importModal') importModal!: JsonImportModalComponent;

  private store = inject(CvStoreService);
  private router = inject(Router);

  onTemplateChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.store.setTemplate(target.value as 'classic' | 'twocol');
  }

  loadDemo(): void {
    if (confirm('This will replace your current CV with demo data. Continue?')) {
      this.store.resetToDemo();
    }
  }

  exportJson(): void {
    const json = this.store.exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  openImportModal(): void {
    this.importModal.open();
  }

  handleImport(jsonString: string): void {
    const result = this.store.importJson(jsonString);
    if (result.success) {
      this.importModal.close();
    } else {
      this.importModal.setError(result.error || 'Import failed');
    }
  }

  goToPreview(): void {
    this.router.navigate(['/preview']);
  }
}


