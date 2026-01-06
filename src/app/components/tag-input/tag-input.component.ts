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
  templateUrl: 'tag-input.component.html',
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


