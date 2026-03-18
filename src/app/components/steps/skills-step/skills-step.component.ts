import {Component, inject, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CvFormService } from '../../../services/cv-form.service';
import { TechStackIconService, TechStackPreset } from '../../../services/tech-stack-icon.service';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-skills-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'skills-step.component.html',
})
export class SkillsStepComponent implements OnInit {
  public formService = inject(CvFormService);
  public techStackIconService = inject(TechStackIconService);
  public i18n = inject(I18nService);
  readonly skillOptions = this.techStackIconService.getTechOptions();
  readonly stackPresets = this.techStackIconService.getTechStackPresets();
  @Input() formArray!: FormArray;
  filterQuery = '';
  isDropdownOpen = false;
  draggedTechnologyIndex: number | null = null;
  dropTargetTechnologyIndex: number | null = null;

  get skillsArray(): FormArray {
    return this.formArray;
  }

  ngOnInit(): void {
    this.normalizeTechnologyGroup();
  }

  get technologyItems(): FormArray {
    this.ensureTechnologyGroupExists();
    return (this.skillsArray.at(0) as FormGroup).get('items') as FormArray;
  }

  selectedTechnologies(): string[] {
    return this.technologyItems.controls
      .map(control => String(control.value ?? '').trim())
      .filter(Boolean);
  }

  isTechnologySelected(option: string): boolean {
    const normalizedOption = option.toLowerCase();
    return this.selectedTechnologies().some(item => item.toLowerCase() === normalizedOption);
  }

  toggleTechnologySelection(option: string, checked: boolean): void {
    const items = this.technologyItems;
    const existingIndex = items.controls.findIndex(
      control => String(control.value ?? '').trim().toLowerCase() === option.toLowerCase()
    );

    if (checked && existingIndex === -1) {
      items.push(new FormControl(option));
      return;
    }

    if (!checked && existingIndex !== -1) {
      items.removeAt(existingIndex);
    }
  }

  removeTechnology(index: number): void {
    this.formService.removeBullet(this.technologyItems, index);
  }

  clearTechnologies(): void {
    const items = this.technologyItems;
    while (items.length > 0) {
      items.removeAt(items.length - 1);
    }

    this.clearTechnologyDragState();
  }

  onTechnologyDragStart(index: number, event: DragEvent): void {
    this.draggedTechnologyIndex = index;
    this.dropTargetTechnologyIndex = null;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(index));
    }
  }

  onTechnologyDragOver(index: number, event: DragEvent): void {
    event.preventDefault();
    if (this.draggedTechnologyIndex === index) {
      this.dropTargetTechnologyIndex = null;
      return;
    }

    this.dropTargetTechnologyIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onTechnologyDrop(index: number, event: DragEvent): void {
    event.preventDefault();
    if (this.draggedTechnologyIndex === null) {
      return;
    }

    this.reorderArrayItem(this.technologyItems, this.draggedTechnologyIndex, index);
    this.clearTechnologyDragState();
  }

  onTechnologyDragEnd(): void {
    this.clearTechnologyDragState();
  }

  isTechnologyDragging(index: number): boolean {
    return this.draggedTechnologyIndex === index;
  }

  isTechnologyDropTarget(index: number): boolean {
    return this.dropTargetTechnologyIndex === index;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  filteredSkillOptions(): string[] {
    const query = this.filterQuery.trim().toLowerCase();
    if (!query) {
      return this.skillOptions;
    }

    return this.skillOptions.filter(option => option.toLowerCase().includes(query));
  }

  applyStackPreset(presetId: string): void {
    const preset = this.stackPresets.find(item => item.id === presetId);
    if (!preset) {
      return;
    }

    this.replaceTechnologies(preset.technologies);
  }

  presetLabel(preset: TechStackPreset): string {
    return preset.label;
  }

  private normalizeTechnologyGroup(): void {
    this.ensureTechnologyGroupExists();

    const mergedItems = this.uniqueItems(
      this.skillsArray.controls.flatMap(control => {
        const group = control as FormGroup;
        const items = group.get('items') as FormArray | null;
        if (!items) {
          return [];
        }

        return items.controls.map(item => String(item.value ?? ''));
      })
    );

    const firstGroup = this.skillsArray.at(0) as FormGroup;
    firstGroup.get('name')?.setValue('Technologies', { emitEvent: false });
    const items = firstGroup.get('items') as FormArray;
    while (items.length > 0) {
      items.removeAt(0, { emitEvent: false });
    }

    mergedItems.forEach(item => items.push(new FormControl(item), { emitEvent: false }));

    while (this.skillsArray.length > 1) {
      this.skillsArray.removeAt(this.skillsArray.length - 1, { emitEvent: false });
    }
  }

  private ensureTechnologyGroupExists(): void {
    if (this.skillsArray.length > 0) {
      return;
    }

    this.skillsArray.push(
      this.formService.createSkillsGroupForm({
        name: 'Technologies',
        items: [],
      })
    );
  }

  private replaceTechnologies(technologies: string[]): void {
    const normalized = this.uniqueItems(technologies);
    const items = this.technologyItems;

    while (items.length > 0) {
      items.removeAt(0);
    }

    normalized.forEach(tech => items.push(new FormControl(tech)));
  }

  private reorderArrayItem(array: FormArray, fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= array.length || toIndex >= array.length) {
      return;
    }

    const control = array.at(fromIndex);
    array.removeAt(fromIndex);
    const targetIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
    array.insert(targetIndex, control);
  }

  private clearTechnologyDragState(): void {
    this.draggedTechnologyIndex = null;
    this.dropTargetTechnologyIndex = null;
  }

  private uniqueItems(values: string[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    values.forEach(value => {
      const trimmed = value.trim();
      if (!trimmed) {
        return;
      }

      const key = trimmed.toLowerCase();
      if (seen.has(key)) {
        return;
      }

      seen.add(key);
      result.push(trimmed);
    });

    return result;
  }
}
