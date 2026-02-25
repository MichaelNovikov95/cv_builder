import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-profile-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'profile-step.component.html',
})
export class ProfileStepComponent {
  public i18n = inject(I18nService);
  @Input() form!: FormGroup;
  photoUploadError: string | null = null;

  hasUploadedPhoto(): boolean {
    return Boolean(this.form.get('photoUrl')?.value);
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const masked = this.formatPhone(input.value);
    input.value = masked;
    this.form.get('phone')?.setValue(masked, { emitEvent: true });
  }

  async onPhotoSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (this.hasUploadedPhoto()) {
      this.photoUploadError = this.i18n.t('form.profile.photoErrorRemoveBeforeUpload');
      input.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.photoUploadError = this.i18n.t('form.profile.photoErrorChooseImage');
      input.value = '';
      return;
    }

    const maxSizeBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      this.photoUploadError = this.i18n.t('form.profile.photoErrorTooLarge');
      input.value = '';
      return;
    }

    try {
      const dataUrl = await this.readFileAsDataUrl(file);
      this.photoUploadError = null;
      this.form.get('photoUrl')?.setValue(dataUrl);
      this.form.get('photoUrl')?.markAsDirty();
      this.form.get('photoUrl')?.markAsTouched();
    } catch {
      this.photoUploadError = this.i18n.t('form.profile.photoErrorReadFailed');
      input.value = '';
    }
  }

  clearPhoto(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    this.photoUploadError = null;
    this.form.get('photoUrl')?.setValue('');
    this.form.get('photoUrl')?.markAsDirty();
    this.form.get('photoUrl')?.markAsTouched();
  }

  private formatPhone(rawValue: string): string {
    const digits = rawValue.replace(/\D/g, '');
    if (!digits) {
      return '';
    }

    let localDigitsSource = digits;

    if (localDigitsSource.startsWith('380')) {
      localDigitsSource = localDigitsSource.slice(3);
    } else if (localDigitsSource.startsWith('80')) {
      localDigitsSource = localDigitsSource.slice(2);
    }

    if (localDigitsSource.startsWith('0')) {
      localDigitsSource = localDigitsSource.slice(1);
    }

    const localDigits = localDigitsSource.slice(0, 9);
    if (!localDigits) {
      return '+380';
    }

    const operator = localDigits.slice(0, 2);
    const first = localDigits.slice(2, 5);
    const second = localDigits.slice(5, 7);
    const third = localDigits.slice(7, 9);

    let formatted = '';

    if (operator) {
      formatted = `(${operator}`;
    }

    if (operator.length === 2) {
      formatted += ')';
    }

    if (first) {
      formatted += `${operator.length === 2 ? ' ' : ''}${first}`;
    }

    if (second) {
      formatted += `-${second}`;
    }

    if (third) {
      formatted += `-${third}`;
    }

    return `+380 ${formatted}`;
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(reader.error);

      reader.readAsDataURL(file);
    });
  }
}
