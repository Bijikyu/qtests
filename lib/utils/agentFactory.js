/**
 * HTTP Agent Factory Utilities
 * 
 * This module provides factory functions for creating HTTP/HTTPS agents
 * with consistent configuration to reduce duplicated agent setup code.
 */

import https from 'https';
import http from 'http';
import qerrors from 'qerrors';

// Default agent configuration
const DEFAULT_AGENT_CONFIG = {
    keepAlive: true,
    maxSockets: 50,
    maxFreeSockets: 10,
    timeout: 60000,
    keepAliveTimeout: 30000,
};

/**
 * Create HTTPS agent with specified configuration
 * @param {Object} options - Agent configuration options
 * @returns {https.Agent} Configured HTTPS agent
 */
export function createHTTPSAgent(options = {}) {
    const config = { ...DEFAULT_AGENT_CONFIG, ...options };
    return new https.Agent(config);
}

/**
 * Create HTTP agent with specified configuration
 * @param {Object} options - Agent configuration options
 * @returns {http.Agent} Configured HTTP agent
 */
export function createHTTPAgent(options = {}) {
    const config = { ...DEFAULT_AGENT_CONFIG, ...options };
    return new http.Agent(config);
}

/**
 * Create agent based on protocol (HTTP or HTTPS)
 * @param {string} protocol - Protocol ('http' or 'https')
 * @param {Object} options - Agent configuration options
 * @returns {http.Agent|https.Agent} Configured agent
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
 * @param {Object} options - Additional configuration options
 * @returns {Object} High-performance agent configuration
 */
export function createHighPerformanceConfig(options = {}) {
    return {
        ...DEFAULT_AGENT_CONFIG,
        maxSockets: 100,
        maxFreeSockets: 20,
        timeout: 120000,
        keepAliveTimeout: 60000,
        ...options,
    };
}

/**
 * Create low-resource agent configuration for lightweight applications
 * @param {Object} options - Additional configuration options
 * @returns {Object} Low-resource agent configuration
 */
export function createLowResourceConfig(options = {}) {
    return {
        ...DEFAULT_AGENT_CONFIG,
        maxSockets: 10,
        maxFreeSockets: 2,
        timeout: 30000,
        keepAliveTimeout: 15000,
        ...options,
    };
}