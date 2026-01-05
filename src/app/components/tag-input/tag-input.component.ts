import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tag-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-wrap gap-2 items-center">
      <div
        *ngFor="let tag of tags; let i = index"
        class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
      >
        <span>{{ tag }}</span>
        <button
          type="button"
          (click)="removeTag(i)"
          class="ml-1 text-blue-600 hover:text-blue-800"
        >
          ×
        </button>
      </div>
      <input
        type="text"
        [value]="inputValue"
        (input)="onInput($event)"
        (keydown.enter)="addTag($event)"
        (blur)="addTag($event)"
        placeholder="Add tag and press Enter"
        class="flex-1 min-w-[150px] px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  `,
})
export class TagInputComponent implements ControlValueAccessor {
  tags: string[] = [];
  inputValue = '';

  private onChange = (value: string[]) => {};
  private onTouched = () => {};

  writeValue(value: string[]): void {
    this.tags = value || [];
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.inputValue = target.value;
  }

  addTag(event: Event): void {
    event.preventDefault();
    const value = this.inputValue.trim();
    if (value && !this.tags.includes(value)) {
      this.tags = [...this.tags, value];
      this.onChange(this.tags);
      this.inputValue = '';
    }
  }

  removeTag(index: number): void {
    this.tags = this.tags.filter((_, i) => i !== index);
    this.onChange(this.tags);
  }
}


