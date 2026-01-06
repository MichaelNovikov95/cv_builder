import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-toggle.component.html',
})
export class SectionToggleComponent {
  @Input() checked = true;
  @Input() label = '';
  @Output() toggle = new EventEmitter<void>();
}


