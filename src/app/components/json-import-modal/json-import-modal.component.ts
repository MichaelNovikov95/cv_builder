import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-json-import-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './json-import-modal.component.html',
})
export class JsonImportModalComponent {
  @Output() import = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<void>();

  isOpen = signal(false);
  jsonInput = '';
  error = signal<string | undefined>(undefined);

  open(): void {
    this.isOpen.set(true);
    this.jsonInput = '';
    this.error.set(undefined);
  }

  close(): void {
    this.isOpen.set(false);
    this.jsonInput = '';
    this.error.set(undefined);
    this.closeModal.emit();
  }

  handleImport(): void {
    if (!this.jsonInput.trim()) {
      this.error.set('Please paste JSON data');
      return;
    }

    this.import.emit(this.jsonInput);
  }

  setError(message: string): void {
    this.error.set(message);
  }
}


