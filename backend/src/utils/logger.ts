/**
 * Simple environment-aware logger.
 * - In development: logs everything to console with timestamps.
 * - In production: only logs warnings and errors (no debug/info noise),
 *   and errors are formatted for easier log aggregation.
 */

const isDev = process.env.NODE_ENV !== 'production'

const timestamp = () => new Date().toISOString()

export const logger = {
  info: (...args: unknown[]) => {
    if (isDev) {
      console.log(`[INFO] ${timestamp()} —`, ...args)
    }
  },

  debug: (...args: unknown[]) => {
    if (isDev) {
      console.log(`[DEBUG] ${timestamp()} —`, ...args)
    }
  },

  warn: (...args: unknown[]) => {
    console.warn(`[WARN] ${timestamp()} —`, ...args)
  },

  error: (...args: unknown[]) => {
    // Errors are always logged, even in production,
    // but without verbose stack traces unless in dev.
    if (isDev) {
      console.error(`[ERROR] ${timestamp()} —`, ...args)
    } else {
      const message = args
        .map((a) => (a instanceof Error ? a.message : String(a)))
        .join(' ')
      console.error(`[ERROR] ${timestamp()} — ${message}`)
    }
  },
}

export default logger