export function normalizeSafeExternalUrl(value?: string | null): string | null {
  const raw = String(value ?? '').trim();
  if (!raw) {
    return null;
  }

  const hasScheme = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(raw);
  const candidate = hasScheme ? raw : `https://${raw}`;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }

    return parsed.href;
  } catch {
    return null;
  }
}
