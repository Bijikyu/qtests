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
import qerrors from 'qerrors';

/**
 * Default agent configuration optimized for general use
 * 
 * Configuration rationale:
 * - keepAlive: true - Enables connection reuse for better performance
 * - maxSockets: 50 - Allows up to 50 concurrent connections per host
 * - maxFreeSockets: 10 - Keeps 10 idle connections ready for reuse
 * - timeout: 60000ms - 1 minute timeout for active connections
 * - keepAliveTimeout: 30000ms - 30 seconds timeout for idle connections
 * 
 * These values provide a good balance between performance and resource usage
 * for most web applications and API clients.
 */
const DEFAULT_AGENT_CONFIG = {
    keepAlive: true,
    maxSockets: 50,
    maxFreeSockets: 10,
    timeout: 60000,
    keepAliveTimeout: 30000,
};

/**
 * Create HTTPS agent with specified configuration
 * 
 * HTTPS agents handle encrypted connections and require special
 * configuration for TLS/SSL handling, certificate validation, and
 * secure connection management.
 * 
 * @param {Object} options - Agent configuration options
 * @param {boolean} [options.keepAlive=true] - Enable connection reuse
 * @param {number} [options.maxSockets=50] - Maximum concurrent connections
 * @param {number} [options.maxFreeSockets=10] - Maximum idle connections
 * @param {number} [options.timeout=60000] - Connection timeout in ms
 * @param {number} [options.keepAliveTimeout=30000] - Idle timeout in ms
 * @param {Object} [options.tls] - TLS configuration options
 * @returns {https.Agent} Configured HTTPS agent
 */
export function createHTTPSAgent(options = {}) {
    const config = { ...DEFAULT_AGENT_CONFIG, ...options };
    return new https.Agent(config);
}

/**
 * Create HTTP agent with specified configuration
 * 
 * HTTP agents handle unencrypted connections and are typically
 * faster than HTTPS agents due to the lack of encryption overhead.
 * They're suitable for internal services, development environments,
 * and non-sensitive data transmission.
 * 
 * @param {Object} options - Agent configuration options
 * @param {boolean} [options.keepAlive=true] - Enable connection reuse
 * @param {number} [options.maxSockets=50] - Maximum concurrent connections
 * @param {number} [options.maxFreeSockets=10] - Maximum idle connections
 * @param {number} [options.timeout=60000] - Connection timeout in ms
 * @param {number} [options.keepAliveTimeout=30000] - Idle timeout in ms
 * @returns {http.Agent} Configured HTTP agent
 */
export function createHTTPAgent(options = {}) {
    const config = { ...DEFAULT_AGENT_CONFIG, ...options };
    return new http.Agent(config);
}

/**
 * Create agent based on protocol (HTTP or HTTPS)
 * 
 * This factory function abstracts protocol-specific agent creation,
 * allowing callers to specify the protocol as a string. It provides
 * validation and error handling for unsupported protocols.
 * 
 * @param {string} protocol - Protocol ('http' or 'https')
 * @param {Object} options - Agent configuration options
 * @returns {http.Agent|https.Agent} Configured agent for the specified protocol
 * @throws {Error} When protocol is not supported
 */
export function createAgent(protocol, options = {}) {
    const protocolLower = protocol.toLowerCase();
    
    if (protocolLower === 'https') {
        return createHTTPSAgent(options);
    } else if (protocolLower === 'http') {
        return createHTTPAgent(options);
    } else {
        const error = new Error(`Unsupported protocol: ${protocol}`);
        qerrors(error, 'agentFactory.createAgent: unsupported protocol', {
            protocol,
            supportedProtocols: ['http', 'https']
        });
        throw error;
    }
}

/**
 * Create high-performance agent configuration for heavy workloads
 * 
 * This configuration is optimized for applications that handle
 * high volumes of HTTP requests, such as API gateways, microservices,
 * and web scrapers. It maximizes connection reuse and throughput
 * at the cost of higher memory usage.
 * 
 * Performance optimizations:
 * - Double the socket limit for higher concurrency
 * - Increased free socket cache for rapid connection reuse
 * - Longer timeouts to handle slow network conditions
 * - Extended keep-alive for persistent connections
 * 
 * Use cases:
 * - High-traffic API servers
 * - Batch processing systems
 * - Web scraping applications
 * - Load testing scenarios
 * 
 * @param {Object} options - Additional configuration options
 * @returns {Object} High-performance agent configuration
 */
export function createHighPerformanceConfig(options = {}) {
    return {
        ...DEFAULT_AGENT_CONFIG,
        maxSockets: 100,        // Double default for higher concurrency
        maxFreeSockets: 20,     // Double default for better caching
        timeout: 120000,        // 2 minutes for slow networks
        keepAliveTimeout: 60000, // 1 minute for persistent connections
        ...options,
    };
}

/**
 * Create low-resource agent configuration for lightweight applications
 * 
 * This configuration is optimized for applications with limited
 * memory and CPU resources, such as serverless functions, IoT devices,
 * and embedded systems. It minimizes resource usage while maintaining
 * reasonable performance for light workloads.
 * 
 * Resource optimizations:
 * - Reduced socket limit to conserve memory
 * - Minimal free socket cache
 * - Shorter timeouts to free resources quickly
 * - Conservative keep-alive duration
 * 
 * Use cases:
 * - Serverless functions (AWS Lambda, etc.)
 * - IoT devices and edge computing
 * - Mobile applications
 * - Development environments
 * - Resource-constrained containers
 * 
 * @param {Object} options - Additional configuration options
 * @returns {Object} Low-resource agent configuration
 */
export function createLowResourceConfig(options = {}) {
    return {
        ...DEFAULT_AGENT_CONFIG,
        maxSockets: 10,         // Reduced for memory efficiency
        maxFreeSockets: 2,      // Minimal caching
        timeout: 30000,         // 30 seconds for quick cleanup
        keepAliveTimeout: 15000, // 15 seconds for resource conservation
        ...options,
    };
}