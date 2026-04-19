/**
 * Integration tests for lib/utils/agentFactory.ts
 *
 * Covers:
 *  - createHTTPSAgent: default config, custom options, returns https.Agent
 *  - createHTTPAgent:  default config, custom options, returns http.Agent
 *  - createAgent:      protocol dispatch, case-insensitivity, error on unknown protocol
 *  - createHighPerformanceConfig: doubled socket limits and extended timeouts
 *  - createLowResourceConfig:     reduced socket limits and shorter timeouts
 */

import https from 'https';
import http from 'http';
import {
  createHTTPSAgent,
  createHTTPAgent,
  createAgent,
  createHighPerformanceConfig,
  createLowResourceConfig,
} from '../../lib/utils/agentFactory.js';

describe('agentFactory', () => {

  // ─── createHTTPSAgent ──────────────────────────────────────────────────────

  describe('createHTTPSAgent', () => {
    test('returns an https.Agent instance', () => {
      const agent = createHTTPSAgent();
      expect(agent).toBeInstanceOf(https.Agent);
    });

    test('applies keepAlive=true by default', () => {
      const agent = createHTTPSAgent();
      expect(agent.keepAlive).toBe(true);
    });

    test('applies default maxSockets=50', () => {
      const agent = createHTTPSAgent();
      expect(agent.maxSockets).toBe(50);
    });

    test('applies default maxFreeSockets=10', () => {
      const agent = createHTTPSAgent();
      expect(agent.maxFreeSockets).toBe(10);
    });

    test('custom maxSockets overrides the default', () => {
      const agent = createHTTPSAgent({ maxSockets: 10 });
      expect(agent.maxSockets).toBe(10);
    });

    test('custom maxFreeSockets overrides the default', () => {
      const agent = createHTTPSAgent({ maxFreeSockets: 3 });
      expect(agent.maxFreeSockets).toBe(3);
    });

    test('other defaults are preserved when only one option is overridden', () => {
      const agent = createHTTPSAgent({ maxSockets: 5 });
      expect(agent.keepAlive).toBe(true);    // default preserved
      expect(agent.maxFreeSockets).toBe(10); // default preserved
    });
  });

  // ─── createHTTPAgent ───────────────────────────────────────────────────────

  describe('createHTTPAgent', () => {
    test('returns an http.Agent instance', () => {
      const agent = createHTTPAgent();
      expect(agent).toBeInstanceOf(http.Agent);
    });

    test('applies keepAlive=true by default', () => {
      const agent = createHTTPAgent();
      expect(agent.keepAlive).toBe(true);
    });

    test('applies default maxSockets=50', () => {
      const agent = createHTTPAgent();
      expect(agent.maxSockets).toBe(50);
    });

    test('custom maxSockets overrides the default', () => {
      const agent = createHTTPAgent({ maxSockets: 5 });
      expect(agent.maxSockets).toBe(5);
    });

    test('custom maxFreeSockets overrides the default', () => {
      const agent = createHTTPAgent({ maxFreeSockets: 1 });
      expect(agent.maxFreeSockets).toBe(1);
    });
  });

  // ─── createAgent ───────────────────────────────────────────────────────────

  describe('createAgent', () => {
    test('returns an https.Agent for "https" protocol', () => {
      expect(createAgent('https')).toBeInstanceOf(https.Agent);
    });

    test('returns an http.Agent for "http" protocol', () => {
      expect(createAgent('http')).toBeInstanceOf(http.Agent);
    });

    test('protocol matching is case-insensitive — HTTPS', () => {
      expect(createAgent('HTTPS')).toBeInstanceOf(https.Agent);
    });

    test('protocol matching is case-insensitive — HTTP', () => {
      expect(createAgent('HTTP')).toBeInstanceOf(http.Agent);
    });

    test('protocol matching is case-insensitive — mixed case', () => {
      expect(createAgent('Https')).toBeInstanceOf(https.Agent);
    });

    test('throws Error for an unsupported protocol', () => {
      expect(() => createAgent('ftp')).toThrow('Unsupported protocol: ftp');
    });

    test('error message includes the rejected protocol name', () => {
      expect(() => createAgent('ws')).toThrow(/ws/);
    });

    test('passes options through to the created https.Agent', () => {
      const agent = createAgent('https', { maxSockets: 7 });
      expect(agent.maxSockets).toBe(7);
    });

    test('passes options through to the created http.Agent', () => {
      const agent = createAgent('http', { maxSockets: 3 });
      expect(agent.maxSockets).toBe(3);
    });
  });

  // ─── createHighPerformanceConfig ───────────────────────────────────────────

  describe('createHighPerformanceConfig', () => {
    test('returns a plain object (not an Agent)', () => {
      const config = createHighPerformanceConfig();
      expect(config).not.toBeInstanceOf(http.Agent);
      expect(typeof config).toBe('object');
    });

    test('doubles the default maxSockets to 100', () => {
      expect(createHighPerformanceConfig().maxSockets).toBe(100);
    });

    test('doubles the default maxFreeSockets to 20', () => {
      expect(createHighPerformanceConfig().maxFreeSockets).toBe(20);
    });

    test('extends timeout to 120000ms (2 minutes)', () => {
      expect(createHighPerformanceConfig().timeout).toBe(120000);
    });

    test('extends keepAliveTimeout to 60000ms (1 minute)', () => {
      expect(createHighPerformanceConfig().keepAliveTimeout).toBe(60000);
    });

    test('preserves keepAlive=true from defaults', () => {
      expect(createHighPerformanceConfig().keepAlive).toBe(true);
    });

    test('caller-supplied options override the high-performance values', () => {
      const config = createHighPerformanceConfig({ maxSockets: 200 });
      expect(config.maxSockets).toBe(200);
      expect(config.maxFreeSockets).toBe(20); // unchanged
    });
  });

  // ─── createLowResourceConfig ───────────────────────────────────────────────

  describe('createLowResourceConfig', () => {
    test('returns a plain object (not an Agent)', () => {
      const config = createLowResourceConfig();
      expect(typeof config).toBe('object');
    });

    test('reduces maxSockets to 10', () => {
      expect(createLowResourceConfig().maxSockets).toBe(10);
    });

    test('reduces maxFreeSockets to 2', () => {
      expect(createLowResourceConfig().maxFreeSockets).toBe(2);
    });

    test('shortens timeout to 30000ms (30 seconds)', () => {
      expect(createLowResourceConfig().timeout).toBe(30000);
    });

    test('shortens keepAliveTimeout to 15000ms (15 seconds)', () => {
      expect(createLowResourceConfig().keepAliveTimeout).toBe(15000);
    });

    test('caller-supplied options override the low-resource values', () => {
      const config = createLowResourceConfig({ maxSockets: 1 });
      expect(config.maxSockets).toBe(1);
      expect(config.keepAliveTimeout).toBe(15000); // unchanged
    });
  });

});
