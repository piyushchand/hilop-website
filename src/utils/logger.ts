// src/utils/logger.ts

type LogLevel = 'info' | 'success' | 'warn' | 'error';

interface LogOptions {
  prefix?: string;
  timestamp?: boolean;
}

class Logger {
  private static instance: Logger;
  private readonly prefix: string;
  private readonly showTimestamp: boolean;

  private constructor(options: LogOptions = {}) {
    this.prefix = options.prefix || 'Hilop';
    this.showTimestamp = options.timestamp ?? true;
  }

  public static getInstance(options?: LogOptions): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(options);
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = this.showTimestamp ? `[${new Date().toISOString()}]` : '';
    const prefix = `[${this.prefix}]`;
    const dataString = data ? ` ${JSON.stringify(data)}` : '';
    return `${timestamp}${prefix} [${level.toUpperCase()}] ${message}${dataString}`;
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const formattedMessage = this.formatMessage(level, message, data ? '' : message);
    
    switch (level) {
      case 'success':
        console.log(`%c${formattedMessage}`, 'color: #22c55e; font-weight: bold');
        if (data) console.log(data);
        break;
      case 'info':
        console.log(`%c${formattedMessage}`, 'color: #3b82f6; font-weight: bold');
        if (data) console.log(data);
        break;
      case 'warn':
        console.warn(`%c${formattedMessage}`, 'color: #f59e0b; font-weight: bold');
        if (data) console.warn(data);
        break;
      case 'error':
        console.error(`%c${formattedMessage}`, 'color: #ef4444; font-weight: bold');
        if (data) console.error(data);
        break;
    }
  }

  public success(message: string, data?: unknown) {
    this.log('success', message, data);
  }

  public info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  public warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  public error(message: string, data?: unknown) {
    this.log('error', message, data);
  }
}

// Export a singleton instance
export const logger = Logger.getInstance({
  prefix: 'Hilop',
  timestamp: true
}); 