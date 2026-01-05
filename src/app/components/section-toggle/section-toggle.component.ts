import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        [checked]="checked"
        (change)="toggle.emit()"
        class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <span class="text-sm text-gray-700">{{ label }}</span>
    </label>
  `,
})
export class SectionToggleComponent {
  @Input() checked = true;
  @Input() label = '';
  @Output() toggle = new EventEmitter<void>();
}


