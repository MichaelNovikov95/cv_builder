import { Injectable, computed, effect, signal } from '@angular/core';

export type AppLocale = 'en' | 'uk';

const I18N_STORAGE_KEY = 'cvbuilder_locale';

const EN_MESSAGES = {
  'theme.lightMode': 'Light mode',
  'theme.darkMode': 'Dark mode',
  'locale.switchToEnglish': 'English',
  'locale.switchToUkrainian': 'Українська',
  'date.present': 'Present',
  'common.remove': 'Remove',
  'common.clearAll': 'Clear all',
  'common.selectTechnology': 'Select technology',
  'common.urlPlaceholder': 'https://...',

  'toolbar.title': 'CV Builder',
  'toolbar.loadDemo': 'Load Demo',
  'toolbar.clearData': 'Clear Data',
  'toolbar.exportJson': 'Export JSON',
  'toolbar.importJson': 'Import JSON',
  'toolbar.printPdf': 'Print / PDF',
  'toolbar.dismiss': 'Dismiss',
  'toolbar.confirmLoadDemo': 'This will replace your current CV with demo data. Continue?',
  'toolbar.confirmClearData': 'This will remove current CV data from the page. Continue?',

  'preview.toolbarTitle': 'CV Preview',
  'preview.backToEditor': 'Back to Editor',
  'preview.printSavePdf': 'Print / Save as PDF',

  'editor.title': 'Edit Your CV',
  'editor.livePreview': 'Live Preview',
  'editor.step.profile': 'Profile',
  'editor.step.experience': 'Experience',
  'editor.step.technologies': 'Technologies',
  'editor.step.projects': 'Projects',
  'editor.step.languages': 'Languages',
  'editor.validation.formErrors':
    'Form has validation errors. Fix highlighted fields (including date ranges) before the preview/export updates.',
  'editor.validation.invalidFields':
    'Some fields are invalid. Check the highlighted inputs and date ranges.',

  'form.profile.sectionTitle': 'Profile Information',
  'form.profile.nameLabel': 'Full Name',
  'form.profile.nameRequired': 'Name is required',
  'form.profile.titleLabel': 'Professional Title',
  'form.profile.titlePlaceholder': 'e.g., Senior Software Engineer',
  'form.profile.titleRequired': 'Title is required',
  'form.profile.emailLabel': 'Email',
  'form.profile.emailRequired': 'Valid email is required',
  'form.profile.phoneLabel': 'Phone',
  'form.profile.phoneFormatHint': 'Format: +380 (67) 123-45-67',
  'form.profile.phoneFormatError': 'Use the phone format: +380 (67) 123-45-67',
  'form.profile.locationLabel': 'Location',
  'form.profile.locationPlaceholder': 'e.g., San Francisco, CA',
  'form.profile.photoLabel': 'Photo Upload',
  'form.profile.photoHint': 'PNG/JPG/WebP, up to 2 MB',
  'form.profile.photoMustRemoveHint': 'Remove the current photo to upload another one.',
  'form.profile.photoUploaded': 'Photo uploaded',
  'form.profile.photoPreviewAlt': 'Photo preview',
  'form.profile.photoErrorRemoveBeforeUpload': 'Remove the current photo before uploading another one.',
  'form.profile.photoErrorChooseImage': 'Please choose an image file.',
  'form.profile.photoErrorTooLarge': 'Photo is too large. Please upload an image up to 2 MB.',
  'form.profile.photoErrorReadFailed': 'Unable to read the selected image.',
  'form.profile.websiteLabel': 'Website',
  'form.profile.websitePlaceholder': 'https://...',
  'form.profile.linkedinLabel': 'LinkedIn',
  'form.profile.linkedinPlaceholder': 'linkedin.com/in/username',
  'form.profile.githubLabel': 'GitHub',
  'form.profile.githubPlaceholder': 'github.com/username',
  'form.profile.summaryLabel': 'Professional Summary',
  'form.profile.summaryPlaceholder': 'Write a brief summary of your professional background...',
  'form.profile.summaryRequired': 'Summary is required',

  'form.experience.sectionTitle': 'Work Experience',
  'form.experience.addButton': '+ Add Experience',
  'form.experience.empty': 'No experience entries yet. Click "Add Experience" to get started.',
  'form.experience.itemPrefix': 'Experience #',
  'form.experience.companyLabel': 'Company',
  'form.experience.companyRequired': 'Company is required',
  'form.experience.roleLabel': 'Role',
  'form.experience.roleRequired': 'Role is required',
  'form.experience.descriptionLabel': 'Role Description',
  'form.experience.descriptionPlaceholder': 'Describe your responsibilities and impact...',
  'form.experience.startDateLabel': 'Start Date',
  'form.experience.startDateRequired': 'Start date is required',
  'form.experience.endDateLabel': 'End Date',
  'form.experience.locationLabel': 'Location',
  'form.experience.currentPosition': 'Current Position',
  'form.experience.dateOrderError': 'Start date cannot be later than end date.',
  'form.experience.techStackLabel': 'Technology Stack',
  'form.experience.presetPlaceholder': 'Choose preset stack',
  'form.experience.applyPreset': 'Apply preset',
  'form.experience.selectTechnologies': 'Select technologies',
  'form.experience.searchTechnologyPlaceholder': 'Search technology...',
  'form.experience.noTechnologyFound': 'No technologies found',
  'form.experience.addTechnology': '+ Add Technology',
  'form.experience.achievementsLabel': 'Achievements',
  'form.experience.achievementPlaceholder': 'Enter achievement...',
  'form.experience.addAchievement': '+ Add Achievement',

  'form.projects.sectionTitle': 'Projects',
  'form.projects.addButton': '+ Add Project',
  'form.projects.empty': 'No projects yet. Click "Add Project" to get started.',
  'form.projects.itemPrefix': 'Project #',
  'form.projects.nameLabel': 'Project Name',
  'form.projects.nameRequired': 'Project name is required',
  'form.projects.descriptionLabel': 'Description',
  'form.projects.descriptionRequired': 'Description is required',
  'form.projects.techStackLabel': 'Tech Stack',
  'form.projects.addTechnology': '+ Add Technology',
  'form.projects.linksLabel': 'Links',
  'form.projects.liveUrlLabel': 'Live URL',
  'form.projects.githubLabel': 'GitHub',
  'form.projects.demoLabel': 'Demo',
  'form.projects.highlightsLabel': 'Highlights',
  'form.projects.highlightPlaceholder': 'Enter highlight...',
  'form.projects.addHighlight': '+ Add Highlight',

  'form.languages.sectionTitle': 'Languages',
  'form.languages.addButton': '+ Add Language',
  'form.languages.empty': 'No languages yet. Click "Add Language" to get started.',
  'form.languages.languageLabel': 'Language',
  'form.languages.languagePlaceholder': 'e.g., English',
  'form.languages.languageRequired': 'Language is required',
  'form.languages.levelLabel': 'Level',
  'form.languages.levelRequired': 'Level is required',
  'form.languages.levelSelect': 'Select level',
  'form.languages.level.native': 'Native',
  'form.languages.level.fluent': 'Fluent',
  'form.languages.level.advanced': 'Advanced',
  'form.languages.level.intermediate': 'Intermediate',
  'form.languages.level.basic': 'Basic',

  'form.technologies.sectionTitle': 'Technologies',
  'form.technologies.presetPlaceholder': 'Choose preset stack',
  'form.technologies.applyPreset': 'Apply preset',
  'form.technologies.selectTechnologies': 'Select technologies',
  'form.technologies.searchPlaceholder': 'Search technology...',
  'form.technologies.noTechnologyFound': 'No technologies found',

  'cv.classic.workExperience': 'Work experience:',
  'cv.classic.languages': 'Languages:',
  'cv.classic.tools': 'Tools/Technologies',

  'cv.twocol.contact': 'Contact',
  'cv.twocol.summary': 'Summary',
  'cv.twocol.experience': 'Experience',
  'cv.twocol.skills': 'Technologies',
  'cv.twocol.languages': 'Languages',
  'cv.twocol.stack': 'Tech stack',
  'cv.twocol.linkedin': 'LinkedIn',
  'cv.twocol.github': 'GitHub',
} as const;

type I18nKey = keyof typeof EN_MESSAGES;

const UK_MESSAGES: Record<I18nKey, string> = {
  'theme.lightMode': 'Світла тема',
  'theme.darkMode': 'Темна тема',
  'locale.switchToEnglish': 'English',
  'locale.switchToUkrainian': 'Українська',
  'date.present': 'Дотепер',
  'common.remove': 'Видалити',
  'common.clearAll': 'Очистити все',
  'common.selectTechnology': 'Оберіть технологію',
  'common.urlPlaceholder': 'https://...',

  'toolbar.title': 'Конструктор CV',
  'toolbar.loadDemo': 'Завантажити демо',
  'toolbar.clearData': 'Очистити дані',
  'toolbar.exportJson': 'Експорт JSON',
  'toolbar.importJson': 'Імпорт JSON',
  'toolbar.printPdf': 'Друк / PDF',
  'toolbar.dismiss': 'Закрити',
  'toolbar.confirmLoadDemo': 'Це замінить поточне CV демонстраційними даними. Продовжити?',
  'toolbar.confirmClearData': 'Це видалить поточні дані CV зі сторінки. Продовжити?',

  'preview.toolbarTitle': 'Перегляд CV',
  'preview.backToEditor': 'Назад до редактора',
  'preview.printSavePdf': 'Друк / Зберегти як PDF',

  'editor.title': 'Редагування CV',
  'editor.livePreview': 'Попередній перегляд',
  'editor.step.profile': 'Профіль',
  'editor.step.experience': 'Досвід',
  'editor.step.technologies': 'Технології',
  'editor.step.projects': 'Проєкти',
  'editor.step.languages': 'Мови',
  'editor.validation.formErrors':
    'Форма містить помилки. Виправте підсвічені поля (включно з діапазонами дат), перш ніж оновиться попередній перегляд/експорт.',
  'editor.validation.invalidFields':
    'Деякі поля заповнені некоректно. Перевірте підсвічені поля та діапазони дат.',

  'form.profile.sectionTitle': 'Інформація профілю',
  'form.profile.nameLabel': 'Повне імʼя',
  'form.profile.nameRequired': 'Імʼя є обовʼязковим',
  'form.profile.titleLabel': 'Професійна посада',
  'form.profile.titlePlaceholder': 'напр., Senior Software Engineer',
  'form.profile.titleRequired': 'Посада є обовʼязковою',
  'form.profile.emailLabel': 'Email',
  'form.profile.emailRequired': 'Потрібен коректний email',
  'form.profile.phoneLabel': 'Телефон',
  'form.profile.phoneFormatHint': 'Формат: +380 (67) 123-45-67',
  'form.profile.phoneFormatError': 'Використовуйте формат: +380 (67) 123-45-67',
  'form.profile.locationLabel': 'Локація',
  'form.profile.locationPlaceholder': 'напр., Київ, Україна',
  'form.profile.photoLabel': 'Завантаження фото',
  'form.profile.photoHint': 'PNG/JPG/WebP, до 2 МБ',
  'form.profile.photoMustRemoveHint': 'Видаліть поточне фото, щоб завантажити інше.',
  'form.profile.photoUploaded': 'Фото завантажено',
  'form.profile.photoPreviewAlt': 'Попередній перегляд фото',
  'form.profile.photoErrorRemoveBeforeUpload': 'Спочатку видаліть поточне фото, щоб завантажити інше.',
  'form.profile.photoErrorChooseImage': 'Будь ласка, оберіть файл зображення.',
  'form.profile.photoErrorTooLarge': 'Фото завелике. Завантажте зображення до 2 МБ.',
  'form.profile.photoErrorReadFailed': 'Не вдалося прочитати вибране зображення.',
  'form.profile.websiteLabel': 'Вебсайт',
  'form.profile.websitePlaceholder': 'https://...',
  'form.profile.linkedinLabel': 'LinkedIn',
  'form.profile.linkedinPlaceholder': 'linkedin.com/in/username',
  'form.profile.githubLabel': 'GitHub',
  'form.profile.githubPlaceholder': 'github.com/username',
  'form.profile.summaryLabel': 'Професійне резюме',
  'form.profile.summaryPlaceholder': 'Коротко опишіть свій професійний досвід...',
  'form.profile.summaryRequired': 'Резюме є обовʼязковим',

  'form.experience.sectionTitle': 'Досвід роботи',
  'form.experience.addButton': '+ Додати досвід',
  'form.experience.empty': 'Ще немає записів про досвід. Натисніть "Додати досвід", щоб почати.',
  'form.experience.itemPrefix': 'Досвід #',
  'form.experience.companyLabel': 'Компанія',
  'form.experience.companyRequired': 'Компанія є обовʼязковою',
  'form.experience.roleLabel': 'Посада',
  'form.experience.roleRequired': 'Посада є обовʼязковою',
  'form.experience.descriptionLabel': 'Опис ролі',
  'form.experience.descriptionPlaceholder': 'Опишіть відповідальність та результати...',
  'form.experience.startDateLabel': 'Дата початку',
  'form.experience.startDateRequired': 'Дата початку є обовʼязковою',
  'form.experience.endDateLabel': 'Дата завершення',
  'form.experience.locationLabel': 'Локація',
  'form.experience.currentPosition': 'Поточна посада',
  'form.experience.dateOrderError': 'Дата початку не може бути пізніше дати завершення.',
  'form.experience.techStackLabel': 'Технологічний стек',
  'form.experience.presetPlaceholder': 'Оберіть готовий стек',
  'form.experience.applyPreset': 'Застосувати',
  'form.experience.selectTechnologies': 'Оберіть технології',
  'form.experience.searchTechnologyPlaceholder': 'Пошук технології...',
  'form.experience.noTechnologyFound': 'Технологій не знайдено',
  'form.experience.addTechnology': '+ Додати технологію',
  'form.experience.achievementsLabel': 'Досягнення',
  'form.experience.achievementPlaceholder': 'Введіть досягнення...',
  'form.experience.addAchievement': '+ Додати досягнення',

  'form.projects.sectionTitle': 'Проєкти',
  'form.projects.addButton': '+ Додати проєкт',
  'form.projects.empty': 'Ще немає проєктів. Натисніть "Додати проєкт", щоб почати.',
  'form.projects.itemPrefix': 'Проєкт #',
  'form.projects.nameLabel': 'Назва проєкту',
  'form.projects.nameRequired': 'Назва проєкту є обовʼязковою',
  'form.projects.descriptionLabel': 'Опис',
  'form.projects.descriptionRequired': 'Опис є обовʼязковим',
  'form.projects.techStackLabel': 'Технічний стек',
  'form.projects.addTechnology': '+ Додати технологію',
  'form.projects.linksLabel': 'Посилання',
  'form.projects.liveUrlLabel': 'Live URL',
  'form.projects.githubLabel': 'GitHub',
  'form.projects.demoLabel': 'Демо',
  'form.projects.highlightsLabel': 'Ключові пункти',
  'form.projects.highlightPlaceholder': 'Введіть пункт...',
  'form.projects.addHighlight': '+ Додати пункт',

  'form.languages.sectionTitle': 'Мови',
  'form.languages.addButton': '+ Додати мову',
  'form.languages.empty': 'Ще немає мов. Натисніть "Додати мову", щоб почати.',
  'form.languages.languageLabel': 'Мова',
  'form.languages.languagePlaceholder': 'напр., Українська',
  'form.languages.languageRequired': 'Мова є обовʼязковою',
  'form.languages.levelLabel': 'Рівень',
  'form.languages.levelRequired': 'Рівень є обовʼязковим',
  'form.languages.levelSelect': 'Оберіть рівень',
  'form.languages.level.native': 'Рідна',
  'form.languages.level.fluent': 'Вільно',
  'form.languages.level.advanced': 'Просунутий',
  'form.languages.level.intermediate': 'Середній',
  'form.languages.level.basic': 'Базовий',

  'form.technologies.sectionTitle': 'Технології',
  'form.technologies.presetPlaceholder': 'Оберіть готовий стек',
  'form.technologies.applyPreset': 'Застосувати',
  'form.technologies.selectTechnologies': 'Оберіть технології',
  'form.technologies.searchPlaceholder': 'Пошук технології...',
  'form.technologies.noTechnologyFound': 'Технологій не знайдено',

  'cv.classic.workExperience': 'Досвід роботи:',
  'cv.classic.languages': 'Мови:',
  'cv.classic.tools': 'Інструменти/Технології',

  'cv.twocol.contact': 'Контакти',
  'cv.twocol.summary': 'Резюме',
  'cv.twocol.experience': 'Досвід',
  'cv.twocol.skills': 'Технології',
  'cv.twocol.languages': 'Мови',
  'cv.twocol.stack': 'Техстек',
  'cv.twocol.linkedin': 'LinkedIn',
  'cv.twocol.github': 'GitHub',
};

const MESSAGES: Record<AppLocale, Record<I18nKey, string>> = {
  en: EN_MESSAGES,
  uk: UK_MESSAGES,
};

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  readonly locale = signal<AppLocale>('en');
  readonly isUkrainian = computed(() => this.locale() === 'uk');

  constructor() {
    if (typeof window !== 'undefined') {
      const savedLocale = window.localStorage.getItem(I18N_STORAGE_KEY);
      if (savedLocale === 'en' || savedLocale === 'uk') {
        this.locale.set(savedLocale);
      }
    }

    effect(() => {
      if (typeof window === 'undefined') {
        return;
      }

      window.localStorage.setItem(I18N_STORAGE_KEY, this.locale());
    });
  }

  toggleLocale(): void {
    this.locale.update(locale => (locale === 'en' ? 'uk' : 'en'));
  }

  t(key: I18nKey): string {
    return MESSAGES[this.locale()][key];
  }

  localeToggleButtonLabel(): string {
    return this.locale() === 'en'
      ? this.t('locale.switchToEnglish')
      : this.t('locale.switchToUkrainian');
  }
}
