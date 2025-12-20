/**
 * User-Configurable Axios Mock Implementation
 * Allows setting custom responses per URL
 */

import { AxiosResponse, UserMockAxios } from './mockTypes.js';
import { createAxiosStyleResponse } from './mockUtilities.js';
import { LegacyAxiosMock } from './legacyAxiosImplementation.js';

export class UserConfigurableAxiosMock extends LegacyAxiosMock implements UserMockAxios {
  __set(url: string, data: any, status: number = 200, reject: boolean = false): void {
    this.responses.set(url, { data, status, reject });
  }

  async get(url: string, _config: any = {}): Promise<AxiosResponse> {
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
  }
}