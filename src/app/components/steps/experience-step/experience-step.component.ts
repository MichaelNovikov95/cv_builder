import {Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CvFormService } from '../../../services/cv-form.service';
import { TechStackIconService, TechStackPreset } from '../../../services/tech-stack-icon.service';
import { I18nService } from '../../../services/i18n.service';
import { ReorderButtonsComponent } from '../../reorder-buttons/reorder-buttons.component';

@Component({
  selector: 'app-experience-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReorderButtonsComponent],
  templateUrl: 'experience-step.component.html',
})
export class ExperienceStepComponent {
  public formService = inject(CvFormService);
  public techStackIconService = inject(TechStackIconService);
  public i18n = inject(I18nService);
  readonly techOptions = this.techStackIconService.getTechOptions();
  readonly stackPresets = this.techStackIconService.getTechStackPresets();
  @Input() formArray!: FormArray;
  private readonly stackFilters = new WeakMap<FormGroup, string>();
  private openedStackPicker: FormGroup | null = null;
  private readonly draggedStackIndex = new WeakMap<FormGroup, number | null>();
  private readonly stackDropTargetIndex = new WeakMap<FormGroup, number | null>();

  get experienceArray(): FormArray {
    return this.formArray;
  }

  getAchievements(exp: FormGroup): FormArray {
    return exp.get('achievements') as FormArray;
  }

  getStack(exp: FormGroup): FormArray {
    return exp.get('stack') as FormArray;
  }

  addExperience(): void {
    const itemForm = this.formService.createExperienceItemForm();
    this.experienceArray.push(itemForm);
  }

  removeExperience(index: number): void {
    this.experienceArray.removeAt(index);
  }

  moveUp(index: number): void {
    this.formService.moveUp(this.experienceArray, index);
  }

  moveDown(index: number): void {
    this.formService.moveDown(this.experienceArray, index);
  }

  addBullet(exp: FormGroup): void {
    const achievements = exp.get('achievements') as FormArray;
    this.formService.addBullet(achievements);
  }

  removeBullet(exp: FormGroup, index: number): void {
    const achievements = exp.get('achievements') as FormArray;
    this.formService.removeBullet(achievements, index);
  }

  removeStackItem(exp: FormGroup, index: number): void {
    const stack = exp.get('stack') as FormArray;
    this.formService.removeBullet(stack, index);
  }

  clearStack(exp: FormGroup): void {
    const stack = this.getStack(exp);
    while (stack.length > 0) {
      stack.removeAt(stack.length - 1);
    }

    this.clearStackDragState(exp);
  }

  onStackDragStart(exp: FormGroup, index: number, event: DragEvent): void {
    this.draggedStackIndex.set(exp, index);
    this.stackDropTargetIndex.set(exp, null);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(index));
    }
  }

  onStackDragOver(exp: FormGroup, index: number, event: DragEvent): void {
    event.preventDefault();
    if (this.draggedStackIndex.get(exp) === index) {
      this.stackDropTargetIndex.set(exp, null);
      return;
    }

    this.stackDropTargetIndex.set(exp, index);
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onStackDrop(exp: FormGroup, index: number, event: DragEvent): void {
    event.preventDefault();
    const fromIndex = this.draggedStackIndex.get(exp);
    if (fromIndex === null || fromIndex === undefined) {
      return;
    }

    this.reorderArrayItem(this.getStack(exp), fromIndex, index);
    this.clearStackDragState(exp);
  }

  onStackDragEnd(exp: FormGroup): void {
    this.clearStackDragState(exp);
  }

  isStackDragging(exp: FormGroup, index: number): boolean {
    return this.draggedStackIndex.get(exp) === index;
  }

  isStackDropTarget(exp: FormGroup, index: number): boolean {
    return this.stackDropTargetIndex.get(exp) === index;
  }

  selectedStack(exp: FormGroup): string[] {
    return this.getStack(exp).controls
      .map(control => String(control.value ?? '').trim())
      .filter(Boolean);
  }

  isStackSelected(exp: FormGroup, option: string): boolean {
    const normalizedOption = option.toLowerCase();
    return this.selectedStack(exp).some(item => item.toLowerCase() === normalizedOption);
  }

  toggleStackSelection(exp: FormGroup, option: string, checked: boolean): void {
    const stack = this.getStack(exp);
    const existingIndex = stack.controls.findIndex(
      control => String(control.value ?? '').trim().toLowerCase() === option.toLowerCase()
    );

    if (checked && existingIndex === -1) {
      stack.push(new FormControl(option));
      return;
    }

    if (!checked && existingIndex !== -1) {
      stack.removeAt(existingIndex);
    }
  }

  setStackFilter(exp: FormGroup, query: string): void {
    this.stackFilters.set(exp, query);
  }

  stackFilter(exp: FormGroup): string {
    return this.stackFilters.get(exp) ?? '';
  }

  filteredTechOptions(exp: FormGroup): string[] {
    const query = this.stackFilter(exp).trim().toLowerCase();
    if (!query) {
      return this.techOptions;
    }

    return this.techOptions.filter(option => option.toLowerCase().includes(query));
  }

  toggleStackPicker(exp: FormGroup): void {
    this.openedStackPicker = this.openedStackPicker === exp ? null : exp;
  }

  isStackPickerOpen(exp: FormGroup): boolean {
    return this.openedStackPicker === exp;
  }

  applyStackPreset(exp: FormGroup, presetId: string): void {
    const preset = this.stackPresets.find(item => item.id === presetId);
    if (!preset) {
      return;
    }

    this.replaceStack(exp, preset.technologies);
  }

  presetLabel(preset: TechStackPreset): string {
    return preset.label;
  }

  onCurrentChange(exp: FormGroup): void {
    if (exp.get('current')?.value) {
      exp.get('endDate')?.setValue('');
    }
  }

  showControlError(control: AbstractControl | null, errorCode?: string): boolean {
    if (!control) {
      return false;
    }

    const interacted = control.touched || control.dirty;
    return interacted && (errorCode ? control.hasError(errorCode) : control.invalid);
  }

  showDateOrderError(exp: AbstractControl): boolean {
    const group = exp as FormGroup;
    const startDate = group.get('startDate');
    const endDate = group.get('endDate');
    return Boolean(group.errors?.['dateOrder']) && Boolean(
      group.touched || group.dirty || startDate?.touched || endDate?.touched || startDate?.dirty || endDate?.dirty
    );
  }

  private replaceStack(exp: FormGroup, technologies: string[]): void {
    const stack = this.getStack(exp);
    const normalized = this.uniqueItems(technologies);

    while (stack.length > 0) {
      stack.removeAt(0);
    }

    normalized.forEach(tech => stack.push(new FormControl(tech)));
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

  private clearStackDragState(exp: FormGroup): void {
    this.draggedStackIndex.set(exp, null);
    this.stackDropTargetIndex.set(exp, null);
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
