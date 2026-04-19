/**
 * Tests for lib/utils/agentFactory.ts
 *
 * Covers createHTTPSAgent, createHTTPAgent, createAgent (protocol dispatch,
 * case-insensitivity, error on unknown protocol), createHighPerformanceConfig,
 * and createLowResourceConfig.
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

describe('createHTTPSAgent', () => {
  test('returns an https.Agent instance', () => {
    expect(createHTTPSAgent()).toBeInstanceOf(https.Agent);
  });

  test('applies keepAlive=true by default', () => {
    expect(createHTTPSAgent().keepAlive).toBe(true);
  });

  test('applies default maxSockets=50', () => {
    expect(createHTTPSAgent().maxSockets).toBe(50);
  });

  test('applies default maxFreeSockets=10', () => {
    expect(createHTTPSAgent().maxFreeSockets).toBe(10);
  });

  test('custom maxSockets overrides the default', () => {
    expect(createHTTPSAgent({ maxSockets: 10 }).maxSockets).toBe(10);
  });

  test('custom maxFreeSockets overrides the default', () => {
    expect(createHTTPSAgent({ maxFreeSockets: 3 }).maxFreeSockets).toBe(3);
  });

  test('non-overridden defaults are preserved when one option is changed', () => {
    const agent = createHTTPSAgent({ maxSockets: 5 });
    expect(agent.keepAlive).toBe(true);
    expect(agent.maxFreeSockets).toBe(10);
  });
});

describe('createHTTPAgent', () => {
  test('returns an http.Agent instance', () => {
    expect(createHTTPAgent()).toBeInstanceOf(http.Agent);
  });

  test('applies keepAlive=true by default', () => {
    expect(createHTTPAgent().keepAlive).toBe(true);
  });

  test('applies default maxSockets=50', () => {
    expect(createHTTPAgent().maxSockets).toBe(50);
  });

  test('custom maxSockets overrides the default', () => {
    expect(createHTTPAgent({ maxSockets: 5 }).maxSockets).toBe(5);
  });

  test('custom maxFreeSockets overrides the default', () => {
    expect(createHTTPAgent({ maxFreeSockets: 1 }).maxFreeSockets).toBe(1);
  });
});

describe('createAgent', () => {
  test('returns https.Agent for "https"', () => {
    expect(createAgent('https')).toBeInstanceOf(https.Agent);
  });

  test('returns http.Agent for "http"', () => {
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

  test('error message contains the rejected protocol name', () => {
    expect(() => createAgent('ws')).toThrow(/ws/);
  });

  test('passes options through to the https.Agent', () => {
    expect(createAgent('https', { maxSockets: 7 }).maxSockets).toBe(7);
  });

  test('passes options through to the http.Agent', () => {
    expect(createAgent('http', { maxSockets: 3 }).maxSockets).toBe(3);
  });
});

describe('createHighPerformanceConfig', () => {
  test('returns a plain object, not an Agent', () => {
    const cfg = createHighPerformanceConfig();
    expect(cfg).not.toBeInstanceOf(http.Agent);
    expect(typeof cfg).toBe('object');
  });

  test('doubles maxSockets to 100', () => {
    expect(createHighPerformanceConfig().maxSockets).toBe(100);
  });

  test('doubles maxFreeSockets to 20', () => {
    expect(createHighPerformanceConfig().maxFreeSockets).toBe(20);
  });

  test('extends timeout to 120000ms', () => {
    expect(createHighPerformanceConfig().timeout).toBe(120000);
  });

  test('extends keepAliveTimeout to 60000ms', () => {
    expect(createHighPerformanceConfig().keepAliveTimeout).toBe(60000);
  });

  test('preserves keepAlive=true from the base defaults', () => {
    expect(createHighPerformanceConfig().keepAlive).toBe(true);
  });

  test('caller options override the high-performance values', () => {
    const cfg = createHighPerformanceConfig({ maxSockets: 200 });
    expect(cfg.maxSockets).toBe(200);
    expect(cfg.maxFreeSockets).toBe(20);
  });
});

describe('createLowResourceConfig', () => {
  test('returns a plain object, not an Agent', () => {
    expect(typeof createLowResourceConfig()).toBe('object');
  });

  test('reduces maxSockets to 10', () => {
    expect(createLowResourceConfig().maxSockets).toBe(10);
  });

  test('reduces maxFreeSockets to 2', () => {
    expect(createLowResourceConfig().maxFreeSockets).toBe(2);
  });

  test('shortens timeout to 30000ms', () => {
    expect(createLowResourceConfig().timeout).toBe(30000);
  });

  test('shortens keepAliveTimeout to 15000ms', () => {
    expect(createLowResourceConfig().keepAliveTimeout).toBe(15000);
  });

  test('caller options override the low-resource values', () => {
    const cfg = createLowResourceConfig({ maxSockets: 1 });
    expect(cfg.maxSockets).toBe(1);
    expect(cfg.keepAliveTimeout).toBe(15000);
  });
});
