/**
 * HTTP Agent Factory Utilities
 *
 * This module provides factory functions for creating HTTP/HTTPS agents
 * with consistent configuration to reduce duplicated agent setup code.
 *
 * Why agent factories matter:
 * - Connection pooling: Reuses connections for better performance
 * - Resource management: Prevents socket exhaustion and memory leaks
 * - Consistency: Ensures all HTTP requests use the same configuration
 * - Tuning: Allows optimization for different workload patterns
 *
 * Performance considerations:
 * - Keep-alive connections reduce TCP handshake overhead
 * - Socket limits prevent resource exhaustion under load
 * - Timeouts ensure failed connections don't hang indefinitely
 * - Free socket caching enables rapid connection reuse
 */

import https from 'https';
import http from 'http';
import qerrors from '../qerrorsFallback.js';

/**
 * Agent configuration extending the standard Node.js AgentOptions.
 * keepAliveTimeout is a project-level field (passed through to Agent options
 * and used as a configuration marker); Node's socket-level idle timeout is
 * controlled via the Agent's keepAliveMsecs option which is inherited here
 * through https.AgentOptions.
 */
export type AgentConfig = https.AgentOptions & {
  keepAliveTimeout?: number;
};

/**
 * Default agent configuration optimized for general use
 *
 * Configuration rationale:
 * - keepAlive: true              — Enables connection reuse for better performance
 * - maxSockets: 50               — Up to 50 concurrent connections per host
 * - maxFreeSockets: 10           — Keeps 10 idle connections ready for reuse
 * - timeout: 60000ms             — 1 minute timeout for active connections
 * - keepAliveTimeout: 30000ms    — 30 seconds timeout for idle connections
 */
const DEFAULT_AGENT_CONFIG: AgentConfig = {
  keepAlive: true,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 60000,
  keepAliveTimeout: 30000,
};

/**
 * Create HTTPS agent with specified configuration.
 *
 * HTTPS agents handle encrypted connections and require special configuration
 * for TLS/SSL handling, certificate validation, and secure connection management.
 *
 * @param options - Agent configuration options (merged with defaults)
 * @returns Configured HTTPS agent
 */
export function createHTTPSAgent(options: AgentConfig = {}): https.Agent {
  const config: AgentConfig = { ...DEFAULT_AGENT_CONFIG, ...options };
  return new https.Agent(config);
}

/**
 * Create HTTP agent with specified configuration.
 *
 * HTTP agents handle unencrypted connections and are typically faster than
 * HTTPS agents due to the lack of encryption overhead. Suitable for internal
 * services, development environments, and non-sensitive data transmission.
 *
 * @param options - Agent configuration options (merged with defaults)
 * @returns Configured HTTP agent
 */
export function createHTTPAgent(options: AgentConfig = {}): http.Agent {
  const config: AgentConfig = { ...DEFAULT_AGENT_CONFIG, ...options };
  return new http.Agent(config);
}

/**
 * Create agent based on protocol ('http' or 'https').
 *
 * Abstracts protocol-specific agent creation, allowing callers to specify
 * the protocol as a string. Provides validation and error handling for
 * unsupported protocols.
 *
 * @param protocol - Protocol string ('http' or 'https')
 * @param options  - Agent configuration options
 * @returns Configured agent for the specified protocol
 * @throws {Error} When the protocol is not 'http' or 'https'
 */
export function createAgent(
  protocol: string,
  options: AgentConfig = {},
): http.Agent | https.Agent {
  const protocolLower = protocol.toLowerCase();

  if (protocolLower === 'https') {
    return createHTTPSAgent(options);
  } else if (protocolLower === 'http') {
    return createHTTPAgent(options);
  } else {
    const error = new Error(`Unsupported protocol: ${protocol}`);
    qerrors(error, 'agentFactory.createAgent: unsupported protocol', {
      protocol,
      supportedProtocols: ['http', 'https'],
    });
    throw error;
  }
}

/**
 * Create high-performance agent configuration for heavy workloads.
 *
 * Optimized for applications that handle high volumes of HTTP requests such
 * as API gateways, microservices, and web scrapers. Maximises connection
 * reuse and throughput at the cost of higher memory usage.
 *
 * @param options - Additional configuration options (merged on top)
 * @returns High-performance agent configuration object
 */
export function createHighPerformanceConfig(options: AgentConfig = {}): AgentConfig {
  return {
    ...DEFAULT_AGENT_CONFIG,
    maxSockets: 100,         // Double default for higher concurrency
    maxFreeSockets: 20,      // Double default for better caching
    timeout: 120000,         // 2 minutes for slow networks
    keepAliveTimeout: 60000, // 1 minute for persistent connections
    ...options,
  };
}

/**
 * Create low-resource agent configuration for lightweight applications.
 *
 * Optimized for applications with limited memory and CPU resources such as
 * serverless functions, IoT devices, and embedded systems. Minimises resource
 * usage while maintaining reasonable performance for light workloads.
 *
 * @param options - Additional configuration options (merged on top)
 * @returns Low-resource agent configuration object
 */
export function createLowResourceConfig(options: AgentConfig = {}): AgentConfig {
  return {
    ...DEFAULT_AGENT_CONFIG,
    maxSockets: 10,          // Reduced for memory efficiency
    maxFreeSockets: 2,       // Minimal caching
    timeout: 30000,          // 30 seconds for quick cleanup
    keepAliveTimeout: 15000, // 15 seconds for resource conservation
    ...options,
  };
}
