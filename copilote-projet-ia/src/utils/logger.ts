const isDev = import.meta.env.DEV;

/** Journalisation active uniquement en développement ; no-op en production. */
export const logger = {
  warn(message: string, context?: unknown): void {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.warn(`[copilote] ${message}`, context ?? '');
    }
  },
  error(message: string, error: unknown): void {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.error(`[copilote] ${message}`, error);
    }
  },
};
