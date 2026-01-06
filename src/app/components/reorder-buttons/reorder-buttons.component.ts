import {Component, Input, Output, EventEmitter, signal} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reorder-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'reorder-buttons.component.html',
})
export class ReorderButtonsComponent {
  @Input() canMoveUp = false;
  @Input() canMoveDown = false;
  @Output() moveUp = new EventEmitter<void>();
  @Output() moveDown = new EventEmitter<void>();
}


