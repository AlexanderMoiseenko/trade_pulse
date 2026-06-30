/**
 * Centralized logging utility for TradePulse.
 *
 * Why factory pattern (createLogger):
 * 1. DRY — production log silencing and prefix injection are configured in a single place.
 * 2. ESLint — eslint-disable-next-line is confined to this file only, keeping the rest of the codebase clean.
 * 3. Extensibility — error logs can easily be hooked into crash reporting tools (e.g., Sentry) in the future.
 */

const isDev = __DEV__;

export const createLogger = (context: string) => {
  const prefix = `[${context}]`;

  return {
    log: (...args: unknown[]) => {
      if (isDev) {
        // eslint-disable-next-line no-console
        console.log(prefix, ...args);
      }
    },
    warn: (...args: unknown[]) => {
      if (isDev) {
        console.warn(prefix, ...args);
      }
    },
    error: (...args: unknown[]) => {
      if (isDev) {
        console.error(prefix, ...args);
      }

      // In production, dispatch critical exceptions to monitoring systems (e.g. Sentry)
      if (!isDev) {
        // Sentry.captureException(args[0]);
      }
    },
  };
};
