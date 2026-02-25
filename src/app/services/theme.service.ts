import { Injectable, computed, effect, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'previewThemeMode';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly mode = signal<ThemeMode>('dark');
  readonly isDark = computed(() => this.mode() === 'dark');

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (savedMode === 'dark' || savedMode === 'light') {
        this.mode.set(savedMode);
      }
    }

    effect(() => {
      const mode = this.mode();
      const dark = mode === 'dark';

      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('theme-dark', dark);
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(THEME_STORAGE_KEY, mode);
      }
    });
  }

  toggle(): void {
    this.mode.update(mode => (mode === 'dark' ? 'light' : 'dark'));
  }
}
