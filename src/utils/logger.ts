export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4
}

/**
 * Simple logger for debugging PrettiERB operations
 */
export class Logger {
    private static instance: Logger;
    private logLevel: LogLevel = LogLevel.NONE;
    private prefix: string = '[PrettiERB]';

    private constructor() {}

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    debug(message: string, ...args: any[]): void {
        if (this.logLevel <= LogLevel.DEBUG) {
            console.log(`${this.prefix} [DEBUG]`, message, ...args);
        }
    }

    info(message: string, ...args: any[]): void {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`${this.prefix} [INFO]`, message, ...args);
        }
    }

    warn(message: string, ...args: any[]): void {
        if (this.logLevel <= LogLevel.WARN) {
            console.warn(`${this.prefix} [WARN]`, message, ...args);
        }
    }

    error(message: string, ...args: any[]): void {
        if (this.logLevel <= LogLevel.ERROR) {
            console.error(`${this.prefix} [ERROR]`, message, ...args);
        }
    }
}

export const logger = Logger.getInstance();
