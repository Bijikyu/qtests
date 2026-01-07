/**
 * Shared Configuration Initialization
 * 
 * This module provides centralized dotenv initialization for all config files
 * to eliminate duplication across the configuration system.
 */

import { initializeDotenv } from '../dist/utils/helpers/envManager.js';

// Initialize dotenv once for all configuration modules
initializeDotenv();