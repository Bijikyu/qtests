"use strict";
/**
 * Axios HTTP Client Stub for Testing - Complete API Compliance
 *
 * This module provides a complete, API-compliant replacement for the axios
 * HTTP client library. When tests require('axios') after @bijikyu/qtests/setup, they
 * get this stub instead of the real axios, preventing actual network requests
 * while maintaining full axios API compatibility.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAxiosErrorImplementation = exports.MockCancelToken = void 0;
exports.createAxiosInstance = createAxiosInstance;
// Default mock response structure
const createMockResponse = (config, data, status = 200) => {
    // Ensure data has proper type
    const responseData = data !== undefined ? data : {};
    return {
        data: responseData,
        status,
        statusText: getStatusText(status),
        headers: {
            'content-type': 'application/json',
            'content-length': '0',
            'connection': 'keep-alive'
        },
        config: { ...getDefaultConfig(), ...config },
        request: {} // Mock XMLHttpRequest object
    };
};
// Default axios configuration
const getDefaultConfig = () => ({
    url: '',
    method: 'get',
    baseURL: '',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
    timeout: 0,
    responseType: 'json',
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    maxBodyLength: -1,
    validateStatus: function (status) { return status >= 200 && status < 300; }
});
// Helper function to get status text
function getStatusText(status) {
    const statusTexts = {
        200: 'OK',
        201: 'Created',
        204: 'No Content',
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable'
    };
    return statusTexts[status] || 'Unknown Status';
}
// Mock interceptor manager
class MockInterceptorManagerImplementation {
    constructor() {
        this.interceptors = [];
    }
    use(onFulfilled, onRejected) {
        const interceptor = { fulfilled: onFulfilled, rejected: onRejected };
        this.interceptors.push(interceptor);
        return this.interceptors.length - 1;
    }
    eject(id) {
        this.interceptors.splice(id, 1);
    }
    clear() {
        this.interceptors = [];
    }
    getInterceptors() {
        return this.interceptors;
    }
}
// Mock CancelToken implementation
class MockCancelToken {
    constructor() {
        this._cancelled = false;
    }
    static source() {
        const token = new MockCancelToken();
        return {
            token,
            cancel: (reason) => {
                token._cancelled = true;
                token._reason = reason;
            }
        };
    }
    get cancelled() {
        return this._cancelled;
    }
    get reason() {
        return this._reason;
    }
    throwIfRequested() {
        if (this._cancelled) {
            throw new MockAxiosErrorImplementation('Request canceled', 'ECONNABORTED');
        }
    }
}
exports.MockCancelToken = MockCancelToken;
// Mock AxiosError implementation
class MockAxiosErrorImplementation extends Error {
    constructor(message, code, config, request, response) {
        super(message);
        this.isAxiosError = true;
        this.name = 'AxiosError';
        this.code = code;
        this.config = config;
        this.request = request;
        this.response = response;
    }
    toJSON() {
        return {
            message: this.message,
            name: this.name,
            code: this.code,
            config: this.config,
            request: this.request,
            response: this.response
        };
    }
}
exports.MockAxiosErrorImplementation = MockAxiosErrorImplementation;
// Main axios stub instance factory
function createAxiosInstance(defaultConfig = {}) {
    const interceptors = {
        request: new MockInterceptorManagerImplementation(),
        response: new MockInterceptorManagerImplementation()
    };
    const defaults = {
        headers: { ...getDefaultConfig().headers, ...defaultConfig.headers },
        timeout: defaultConfig.timeout || 0,
        xsrfCookieName: defaultConfig.xsrfCookieName || 'XSRF-TOKEN',
        xsrfHeaderName: defaultConfig.xsrfHeaderName || 'X-XSRF-TOKEN',
        maxContentLength: defaultConfig.maxContentLength || -1,
        maxBodyLength: defaultConfig.maxBodyLength || -1
    };
    // Core request function
    async function request(config) {
        // Merge with defaults
        const finalConfig = { ...getDefaultConfig(), ...defaults, ...defaultConfig, ...config };
        // Process request interceptors
        for (const interceptor of interceptors.request.getInterceptors()) {
            try {
                if (interceptor.fulfilled) {
                    const result = await interceptor.fulfilled(finalConfig);
                    Object.assign(finalConfig, result);
                }
            }
            catch (error) {
                if (interceptor.rejected) {
                    throw await interceptor.rejected(error);
                }
                throw error;
            }
        }
        // Create mock response
        let response = createMockResponse(finalConfig);
        // Process response interceptors
        for (const interceptor of interceptors.response.getInterceptors()) {
            try {
                if (interceptor.fulfilled) {
                    response = await interceptor.fulfilled(response);
                }
            }
            catch (error) {
                if (interceptor.rejected) {
                    throw await interceptor.rejected(error);
                }
                throw error;
            }
        }
        return response;
    }
    // HTTP method helpers
    const instance = {
        request,
        get: (url, config) => request({ ...config, method: 'get', url }),
        post: (url, data, config) => request({ ...config, method: 'post', url, data }),
        put: (url, data, config) => request({ ...config, method: 'put', url, data }),
        patch: (url, data, config) => request({ ...config, method: 'patch', url, data }),
        delete: (url, config) => request({ ...config, method: 'delete', url }),
        head: (url, config) => request({ ...config, method: 'head', url }),
        options: (url, config) => request({ ...config, method: 'options', url }),
        postForm: (url, data, config) => request({ ...config, method: 'post', url, data, headers: { ...config?.headers, 'Content-Type': 'multipart/form-data' } }),
        putForm: (url, data, config) => request({ ...config, method: 'put', url, data, headers: { ...config?.headers, 'Content-Type': 'multipart/form-data' } }),
        patchForm: (url, data, config) => request({ ...config, method: 'patch', url, data, headers: { ...config?.headers, 'Content-Type': 'multipart/form-data' } }),
        getUri: (config) => {
            const finalConfig = { ...getDefaultConfig(), ...config };
            return finalConfig.baseURL ? finalConfig.baseURL + (finalConfig.url || '') : (finalConfig.url || '');
        },
        interceptors,
        defaults
    };
    return instance;
}
// Default axios instance
const defaultAxios = createAxiosInstance();
// Axios factory function with all static methods
const axios = Object.assign(defaultAxios, {
    create: createAxiosInstance,
    all: (promises) => Promise.all(promises),
    spread: (callback) => (array) => callback(...array),
    isCancel: (value) => value && typeof value === 'object' && 'cancelled' in value,
    isAxiosError: (error) => error && error.isAxiosError === true,
    CancelToken: MockCancelToken,
    VERSION: '1.7.0' // Match current axios version
});
// Export axios stub using ES module syntax
exports.default = axios;
