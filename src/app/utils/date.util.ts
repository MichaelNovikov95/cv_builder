/**
 * Formats an ISO date string to "MMM YYYY" format
 * @param dateStr ISO date string (YYYY-MM-DD or full ISO)
 * @returns Formatted string like "Jan 2024" or empty string if invalid
 */
export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
export function formatDateRange(start: string, end?: string, current?: boolean): string {
  const startFormatted = formatDate(start);
  if (!startFormatted) return '';
  
  if (current || !end) {
    return `${startFormatted} - Present`;
  }
  
  const endFormatted = formatDate(end);
  return endFormatted ? `${startFormatted} - ${endFormatted}` : startFormatted;
}


