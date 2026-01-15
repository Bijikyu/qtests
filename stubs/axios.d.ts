/**
 * Axios HTTP Client Stub for Testing - Complete API Compliance
 *
 * This module provides a complete, API-compliant replacement for the axios
 * HTTP client library. When tests require('axios') after @bijikyu/qtests/setup, they
 * get this stub instead of the real axios, preventing actual network requests
 * while maintaining full axios API compatibility.
 */
interface MockAxiosRequestConfig {
    url?: string;
    method?: string;
    baseURL?: string;
    headers?: Record<string, string>;
    params?: any;
    data?: any;
    timeout?: number;
    responseType?: string;
    auth?: {
        username: string;
        password: string;
    };
    maxContentLength?: number;
    maxBodyLength?: number;
    validateStatus?: (status: number) => boolean;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
}
interface MockAxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: MockAxiosRequestConfig;
    request?: any;
}
interface MockAxiosError extends Error {
    config?: MockAxiosRequestConfig;
    code?: string;
    request?: any;
    response?: MockAxiosResponse;
    isAxiosError: boolean;
}
interface MockInterceptorManager<T = any> {
    use(onFulfilled?: (value: T) => T | Promise<T>, onRejected?: (error: any) => any): number;
    eject(id: number): void;
    clear(): void;
}
interface MockInterceptors {
    request: MockInterceptorManager<MockAxiosRequestConfig>;
    response: MockInterceptorManager<MockAxiosResponse>;
}
interface MockDefaults {
    headers: Record<string, string>;
    timeout: number;
    xsrfCookieName: string;
    xsrfHeaderName: string;
    maxContentLength: number;
    maxBodyLength: number;
}
interface MockAxiosInstance {
    request<T = any>(config: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
    get<T = any>(url: string, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
    put<T = any>(url: string, data?: any, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
    patch<T = any>(url: string, data?: any, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
    delete<T = any>(url: string, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
    head<T = any>(url: string, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
    options<T = any>(url: string, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
    postForm<T = any>(url: string, data?: any, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
    putForm<T = any>(url: string, data?: any, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
    patchForm<T = any>(url: string, data?: any, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>>;
    getUri(config?: MockAxiosRequestConfig): string;
    interceptors: MockInterceptors;
    defaults: MockDefaults;
}
declare class MockCancelToken {
    static source(): {
        token: MockCancelToken;
        cancel: (reason?: any) => void;
    };
    private _cancelled;
    private _reason;
    get cancelled(): boolean;
    get reason(): any;
    throwIfRequested(): void;
}
declare class MockAxiosErrorImplementation extends Error implements MockAxiosError {
    config?: MockAxiosRequestConfig;
    code?: string;
    request?: any;
    response?: MockAxiosResponse;
    isAxiosError: boolean;
    constructor(message: string, code?: string, config?: MockAxiosRequestConfig, request?: any, response?: MockAxiosResponse);
    toJSON(): object;
}
declare function createAxiosInstance(defaultConfig?: MockAxiosRequestConfig): MockAxiosInstance;
declare const axios: MockAxiosInstance & {
    create: typeof createAxiosInstance;
    all: <T>(promises: Promise<T>[]) => Promise<Awaited<T>[]>;
    spread: <T, R>(callback: (...args: T[]) => R) => (array: T[]) => R;
    isCancel: (value: any) => value is MockCancelToken;
    isAxiosError: (error: any) => error is MockAxiosError;
    CancelToken: typeof MockCancelToken;
    VERSION: string;
};
export default axios;
export { MockCancelToken, MockAxiosErrorImplementation, createAxiosInstance };
export type { MockAxiosResponse, MockAxiosError, MockAxiosRequestConfig, MockAxiosInstance };
