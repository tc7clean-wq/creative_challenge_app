// Production-safe logging utility
const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },
  error: (...args: unknown[]) => {
    if (isDevelopment) {
      console.error(...args)
    }
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  }
}
