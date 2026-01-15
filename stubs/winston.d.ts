/**
 * Winston Logging Library Stub for Testing - Complete API Compliance
 *
 * This module provides a complete, API-compliant replacement for the winston
 * logging library. When tests require('winston') after @bijikyu/qtests/setup, they
 * get this stub instead of real winston, preventing log output during test
 * execution while maintaining full winston API compatibility.
 */
interface LogEntry {
    level: string;
    message: string;
    [key: string]: any;
}
interface LoggerOptions {
    level?: string;
    levels?: Record<string, number>;
    format?: any;
    transports?: any[];
    exitOnError?: boolean;
    silent?: boolean;
    defaultMeta?: any;
    handleExceptions?: boolean;
    handleRejections?: boolean;
}
interface LoggerStub {
    error(message: string, ...meta: any[]): void;
    warn(message: string, ...meta: any[]): void;
    info(message: string, ...meta: any[]): void;
    http(message: string, ...meta: any[]): void;
    verbose(message: string, ...meta: any[]): void;
    debug(message: string, ...meta: any[]): void;
    silly(message: string, ...meta: any[]): void;
    log(level: string, message: string, ...meta: any[]): void;
    profile(id?: string, meta?: any): LoggerStub;
    startTimer(): TimerStub;
    child(defaultMeta: any): LoggerStub;
    add(transport: any): LoggerStub;
    remove(transport: any): LoggerStub;
    clear(): LoggerStub;
    close(): void;
    query(options?: any, callback?: (err: Error, results: any) => void): any;
    stream(options?: any): any;
}
interface TimerStub {
    done(message?: string, meta?: any): void;
}
interface TransportStub {
    name: string;
    level?: string;
    silent?: boolean;
    handleExceptions?: boolean;
    log?(info: LogEntry, callback?: (error?: Error) => void): void;
    close?(): void;
}
type TransportConstructor = new (options?: any) => TransportStub;
interface FormatStub {
    transform(info: LogEntry, options?: any): LogEntry;
}
interface WinstonStub {
    createLogger(options?: LoggerOptions): LoggerStub;
    format: {
        colorize(options?: any): FormatStub;
        combine(...formats: FormatStub[]): FormatStub;
        label(options?: any): FormatStub;
        timestamp(options?: any): FormatStub;
        printf(templateFunction: (info: LogEntry) => string): FormatStub;
        json(options?: any): FormatStub;
        simple(): FormatStub;
        splat(): FormatStub;
        padLevels(): FormatStub;
        metadata(fillEmpty?: any): FormatStub;
    };
    transports: {
        Console: TransportConstructor;
        File: TransportConstructor;
        Http: TransportConstructor;
        Stream: TransportConstructor;
    };
    addColors(colors: Record<string, string>): void;
    level: string;
    loggers: {
        add(id: string, options?: LoggerOptions): LoggerStub;
        get(id: string): LoggerStub;
        close(id?: string): void;
        has(id: string): boolean;
    };
    exceptions: {
        handle(exceptions: any[]): any;
        unhandle(): void;
        getHandlers(): any[];
        logger?: LoggerStub;
    };
    rejectionHandler?: {
        handle(rejections: any[]): any;
        unhandle(): void;
        getHandlers(): any[];
        logger?: LoggerStub;
    };
}
declare const defaultLevels: {
    error: number;
    warn: number;
    info: number;
    http: number;
    verbose: number;
    debug: number;
    silly: number;
};
declare const defaultColors: {
    error: string;
    warn: string;
    info: string;
    http: string;
    verbose: string;
    debug: string;
    silly: string;
};
declare class MockTimer implements TimerStub {
    private startTime;
    private message?;
    private meta?;
    constructor(message?: string, meta?: any);
    done(message?: string, meta?: any): void;
}
declare class MockConsoleTransport implements TransportStub {
    private options;
    name: string;
    level?: string;
    silent: boolean;
    handleExceptions: boolean;
    constructor(options?: any);
    log(info: LogEntry): void;
    close(): void;
}
declare class MockFileTransport implements TransportStub {
    private options;
    name: string;
    level?: string;
    silent: boolean;
    handleExceptions: boolean;
    constructor(options?: any);
    log(info: LogEntry): void;
    close(): void;
}
declare class MockLogger implements LoggerStub {
    private options;
    private transports;
    private defaultMeta;
    constructor(options?: LoggerOptions);
    error(message: string, ...meta: any[]): void;
    warn(message: string, ...meta: any[]): void;
    info(message: string, ...meta: any[]): void;
    http(message: string, ...meta: any[]): void;
    verbose(message: string, ...meta: any[]): void;
    debug(message: string, ...meta: any[]): void;
    silly(message: string, ...meta: any[]): void;
    log(level: string, message: string, ...meta: any[]): void;
    profile(id?: string, meta?: any): LoggerStub;
    startTimer(): TimerStub;
    child(defaultMeta: any): LoggerStub;
    add(transport: TransportStub): LoggerStub;
    remove(transport: TransportStub): LoggerStub;
    clear(): LoggerStub;
    close(): void;
    query(options?: any, callback?: (err: Error, results: any) => void): any;
    stream(options?: any): any;
}
declare const winstonStub: WinstonStub;
export default winstonStub;
export { MockLogger, MockConsoleTransport, MockFileTransport, MockTimer, defaultLevels, defaultColors };
export type { LoggerStub, TransportStub, FormatStub, LogEntry, LoggerOptions, TimerStub };
