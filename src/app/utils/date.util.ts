export type DateLocale = 'en' | 'uk';

const DATE_MONTHS: Record<DateLocale, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  uk: ['січ', 'лют', 'бер', 'квіт', 'трав', 'черв', 'лип', 'серп', 'вер', 'жовт', 'лист', 'груд'],
};

/**
 * Formats an ISO date string to "MMM YYYY" format
 * @param dateStr ISO date string (YYYY-MM-DD or full ISO)
 * @returns Formatted string like "Jan 2024" or empty string if invalid
 */
export function formatDate(dateStr: string | undefined | null, locale: DateLocale = 'en'): string {
  if (!dateStr) return '';

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';

    const months = DATE_MONTHS[locale] ?? DATE_MONTHS.en;
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch {
    return '';
  }
}

/**
 * Formats a date range
 * @param start ISO date string
 * @param end ISO date string or undefined
 * @param current boolean indicating if this is a current position
 * @returns Formatted string like "Jan 2024 - Present" or "Jan 2024 - Dec 2024"
 */
export function formatDateRange(
  start: string,
  end?: string,
  current?: boolean,
  locale: DateLocale = 'en',
  presentLabel?: string
): string {
  const startFormatted = formatDate(start, locale);
  if (!startFormatted) return '';

  const resolvedPresentLabel = presentLabel ?? (locale === 'uk' ? 'Дотепер' : 'Present');

  if (current || !end) {
    return `${startFormatted} - ${resolvedPresentLabel}`;
  }

  const endFormatted = formatDate(end, locale);
  return endFormatted ? `${startFormatted} - ${endFormatted}` : startFormatted;
}
