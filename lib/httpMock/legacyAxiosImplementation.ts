/**
 * Legacy Axios Mock Implementation
 * Simulates axios without actual network requests
 */

import { AxiosResponse, MockHttpClient, MockHttpClientConfig } from './mockTypes.js';
import { createAxiosStyleResponse } from './mockUtilities.js';
import qerrors from '../qerrorsFallback.js';

export class LegacyAxiosMock implements MockHttpClient {
  private defaultResponse: any;
  private defaultStatus: number;
  private simulateErrors: boolean;
  protected responses: Map<string, { data: any; status: number; reject: boolean }>;

  constructor(config: MockHttpClientConfig = {}) {
    try {
      // Validate configuration parameters for safety and predictability
      if (config.defaultStatus && (config.defaultStatus < 100 || config.defaultStatus > 599)) {
        throw new Error('Invalid default status code');
      }
      
      // Initialize instance state with defaults
      this.defaultResponse = config.defaultResponse || {};
      this.defaultStatus = config.defaultStatus || 200;
      this.simulateErrors = config.simulateErrors || false;
      this.responses = new Map(); // Use Map for O(1) URL lookup performance
      
      // Convert presetData to Map entries for efficient lookup
      // This allows per-URL response configuration while maintaining fast access
      if (config.presetData) {
        if (typeof config.presetData !== 'object') {
          throw new Error('presetData must be an object');
        }
        
        Object.entries(config.presetData).forEach(([url, response]) => {
          // Validate each preset URL to ensure consistency
          if (!url || typeof url !== 'string') {
            throw new Error('Invalid URL in presetData');
          }
          if (!response || typeof response !== 'object') {
            throw new Error('Invalid response in presetData');
          }
          if (response.status && (response.status < 100 || response.status > 599)) {
            throw new Error('Invalid status code in presetData');
          }
          
          // Store normalized response format for consistent handling
          this.responses.set(url, {
            data: response.data,
            status: response.status || 200,
            reject: response.reject || false
          });
        });
      }
      
      // Add default preset if none provided to ensure some response is always available
      // This prevents undefined behavior when no specific URL is configured
      if (this.responses.size === 0) {
        this.responses.set('http://a', { data: { mock: true }, status: 200, reject: false });
      }
    } catch (error) {
      qerrors(error as Error, 'legacyAxiosMock.constructor: initialization failed', {
        configKeys: Object.keys(config),
        hasPresetData: !!config.presetData,
        presetDataSize: config.presetData ? Object.keys(config.presetData).length : 0,
        errorType: (error as Error).constructor?.name || 'unknown',
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
      
      console.log(`LegacyAxiosMock.get: ${url}`);
      if (this.simulateErrors && Math.random() < 0.1) {
        const simulatedError = new Error('Simulated network error');
        qerrors(simulatedError, 'legacyAxiosMock.get: simulated network error', {
          url,
          processingTime: Date.now() - startTime
        });
        throw simulatedError;
      }
      const response = createAxiosStyleResponse(this.defaultResponse, this.defaultStatus);
      console.log(`LegacyAxiosMock.get returning: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      if (error instanceof Error && error.message === 'Simulated network error') {
        throw error; // Re-throw simulated errors without additional processing
      }
      
      qerrors(error as Error, 'legacyAxiosMock.get: mock request failed', {
        url,
        configKeys: _config ? Object.keys(_config) : [],
        processingTime: Date.now() - startTime,
        simulateErrors: this.simulateErrors,
        errorType: (error as Error).constructor?.name || 'unknown',
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
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