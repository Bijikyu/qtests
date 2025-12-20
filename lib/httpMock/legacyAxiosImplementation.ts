/**
 * Legacy Axios Mock Implementation
 * Simulates axios without actual network requests
 */

import { AxiosResponse, MockHttpClient, MockHttpClientConfig } from './mockTypes.js';
import { createAxiosStyleResponse } from './mockUtilities.js';

export class LegacyAxiosMock implements MockHttpClient {
  private defaultResponse: any;
  private defaultStatus: number;
  private simulateErrors: boolean;
  protected responses: Map<string, { data: any; status: number; reject: boolean }>;

  constructor(config: MockHttpClientConfig = {}) {
    this.defaultResponse = config.defaultResponse || {};
    this.defaultStatus = config.defaultStatus || 200;
    this.simulateErrors = config.simulateErrors || false;
    this.responses = new Map();
    
    // Convert presetData to Map entries
    if (config.presetData) {
      Object.entries(config.presetData).forEach(([url, response]) => {
        this.responses.set(url, {
          data: response.data,
          status: response.status,
          reject: response.reject || false
        });
      });
    }
    
    // Add default preset if none provided
    if (this.responses.size === 0) {
      this.responses.set('http://a', { data: { mock: true }, status: 200, reject: false });
    }
  }

  async get(url: string, _config: any = {}): Promise<AxiosResponse> {
    console.log(`LegacyAxiosMock.get: ${url}`);
    if (this.simulateErrors && Math.random() < 0.1) {
      throw new Error('Simulated network error');
    }
    const response = createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
    console.log(`LegacyAxiosMock.get returning: ${JSON.stringify(response)}`);
    return response;
  }

  async post(url: string, _data: any = {}, _config: any = {}): Promise<AxiosResponse> {
    console.log(`LegacyAxiosMock.post: ${url}`);
    if (this.simulateErrors && Math.random() < 0.1) {
      throw new Error('Simulated network error');
    }
    const response = createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
    console.log(`LegacyAxiosMock.post returning: ${JSON.stringify(response)}`);
    return response;
  }

  async put(url: string, _data: any = {}, _config: any = {}): Promise<AxiosResponse> {
    console.log(`LegacyAxiosMock.put: ${url}`);
    if (this.simulateErrors && Math.random() < 0.1) {
      throw new Error('Simulated network error');
    }
    const response = createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
    console.log(`LegacyAxiosMock.put returning: ${JSON.stringify(response)}`);
    return response;
  }

  async delete(url: string, _config: any = {}): Promise<AxiosResponse> {
    console.log(`LegacyAxiosMock.delete: ${url}`);
    if (this.simulateErrors && Math.random() < 0.1) {
      throw new Error('Simulated network error');
    }
    const response = createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
    console.log(`LegacyAxiosMock.delete returning: ${JSON.stringify(response)}`);
    return response;
  }

  async patch(url: string, _data: any = {}, _config: any = {}): Promise<AxiosResponse> {
    console.log(`LegacyAxiosMock.patch: ${url}`);
    if (this.simulateErrors && Math.random() < 0.1) {
      throw new Error('Simulated network error');
    }
    const response = createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
    console.log(`LegacyAxiosMock.patch returning: ${JSON.stringify(response)}`);
    return response;
  }

  async request(config: any = {}): Promise<AxiosResponse> {
    console.log(`LegacyAxiosMock.request: ${JSON.stringify(config)}`);
    if (this.simulateErrors && Math.random() < 0.1) {
      throw new Error('Simulated network error');
    }
    const response = createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
    console.log(`LegacyAxiosMock.request returning: ${JSON.stringify(response)}`);
    return response;
  }
}