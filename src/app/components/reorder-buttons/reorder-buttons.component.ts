import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reorder-buttons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex gap-1">
      <button
        type="button"
        (click)="moveUp.emit()"
        [disabled]="!canMoveUp"
        class="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded"
        title="Move up"
      >
        ↑
      </button>
      <button
        type="button"
        (click)="moveDown.emit()"
        [disabled]="!canMoveDown"
        class="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded"
        title="Move down"
      >
        ↓
      </button>
    </div>
  `,
})
export class ReorderButtonsComponent {
  @Input() canMoveUp = false;
  @Input() canMoveDown = false;
  @Output() moveUp = new EventEmitter<void>();
  @Output() moveDown = new EventEmitter<void>();
}


