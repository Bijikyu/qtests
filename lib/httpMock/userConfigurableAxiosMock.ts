/**
 * User-Configurable Axios Mock Implementation
 * Allows setting custom responses per URL
 */

import { AxiosResponse, UserMockAxios } from './mockTypes.js';
import { createAxiosStyleResponse } from './mockUtilities.js';
import { LegacyAxiosMock } from './legacyAxiosImplementation.js';
import qerrors from '../qerrorsFallback.js';

export class UserConfigurableAxiosMock extends LegacyAxiosMock implements UserMockAxios {
  __set(url: string, data: any, status: number = 200, reject: boolean = false): void {
    try {
      // Validate inputs
      if (!url || typeof url !== 'string') {
        throw new Error('Invalid URL provided');
      }
      if (status < 100 || status > 599) {
        throw new Error('Invalid HTTP status code');
      }
      
      this.responses.set(url, { data, status, reject });
    } catch (error) {
      qerrors(error as Error, 'userConfigurableAxiosMock.__set: failed to set mock response', {
        url,
        status,
        reject,
        dataType: typeof data,
        errorType: error.constructor?.name || 'unknown',
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async get(url: string, _config: any = {}): Promise<AxiosResponse> {
    const startTime = Date.now();
    try {
      // Validate URL
      if (!url || typeof url !== 'string') {
        throw new Error('Invalid URL provided');
      }
      
      console.log(`UserConfigurableAxiosMock.get: ${url}`);
      const mock = this.responses.get(url);
      
      if (mock) {
        const response = createAxiosStyleResponse(mock.data, mock.status);
        if (mock.reject) {
          return Promise.reject({ response });
        }
        return response;
      }

      // Return error for unknown URLs
      const error = { response: { status: 500, data: 'error' } };
      return Promise.reject(error);
    } catch (error) {
      qerrors(error as Error, 'userConfigurableAxiosMock.get: mock request failed', {
        url,
        configKeys: _config ? Object.keys(_config) : [],
        processingTime: Date.now() - startTime,
        errorType: error.constructor?.name || 'unknown',
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}