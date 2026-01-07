/**
 * Shared Configuration Framework
 * 
 * Provides common configuration patterns and utilities to reduce
 * duplication across configuration-related modules.
 */

// Configuration interface
export interface Configuration {
  [key: string]: any;
}

// Configuration validation schema
export interface ConfigSchema {
  required?: string[];
  type?: 'object' | 'string' | 'number' | 'boolean';
  default?: any;
  validate?: (value: any) => boolean | string;
  transform?: (value: any) => any;
  env?: string;
}

// Configuration merge options
export interface MergeOptions {
  deep?: boolean;
  overwrite?: boolean;
  arrays?: 'replace' | 'merge';
}

/**
 * Configuration Manager Class
 */
export class ConfigurationManager {
  private static config: Configuration = {};
  private static schema: Record<string, ConfigSchema> = {};
  private static watchers: Map<string, ((value: any, oldValue: any) => void)> = new Map();

  /**
   * Set configuration schema
   */
  static setSchema(schema: Record<string, ConfigSchema>): void {
    this.schema = { ...this.schema, ...schema };
  }

  /**
   * Get configuration value
   */
  static get(key: string, defaultValue?: any): any {
    const value = this.config[key];
    return value !== undefined ? value : defaultValue;
  }

  /**
   * Set configuration value
   */
  static set(key: string, value: any): void {
    const oldValue = this.config[key];
    this.config[key] = value;

    // Notify watchers
    const watcher = this.watchers.get(key);
    if (watcher) {
      watcher(value, oldValue);
    }

    // Validate against schema
    const schema = this.schema[key];
    if (schema && schema.validate) {
      const validation = schema.validate(value);
      if (validation !== true) {
        console.warn(`⚠️ Config validation failed for ${key}: ${validation}`);
      }
    }
  }

  /**
   * Load configuration from environment variables
   */
  static loadFromEnv(prefix: string = ''): void {
    Object.entries(process.env).forEach(([key, value]) => {
      if (prefix && !key.startsWith(prefix)) {
        return;
      }

      const configKey = prefix ? key.substring(prefix.length) : key;
      
      // Find schema for this key
      const schema = this.schema[configKey];
      if (!schema) {
        return;
      }

      // Transform value based on schema
      let transformedValue: any = value;
      if (schema.type === 'number') {
        transformedValue = Number(value);
      } else if (schema.type === 'boolean') {
        transformedValue = value === 'true' || value === '1';
      }

      // Set configuration
      this.set(configKey, transformedValue);
    });
  }

  /**
   * Load configuration from file
   */
  static async loadFromFile(filePath: string): Promise<void> {
    try {
      const fs = await import('fs-extra');
      const content = await fs.readFile(filePath, 'utf8');
      const fileConfig = JSON.parse(content);
      
      this.merge(fileConfig, { deep: true });
    } catch (error) {
      console.error(`❌ Failed to load config from ${filePath}:`, error);
    }
  }

  /**
   * Save configuration to file
   */
  static async saveToFile(filePath: string): Promise<void> {
    try {
      const fs = await import('fs-extra');
      await fs.writeFile(filePath, JSON.stringify(this.config, null, 2), 'utf8');
    } catch (error) {
      console.error(`❌ Failed to save config to ${filePath}:`, error);
    }
  }

  /**
   * Merge configuration objects
   */
  static merge(newConfig: Configuration, options: MergeOptions = {}): void {
    const { deep = false, overwrite = true } = options;

    if (deep) {
      this.config = this.deepMerge(this.config, newConfig, overwrite);
    } else {
      this.config = { ...this.config, ...newConfig };
    }
  }

  /**
   * Watch for configuration changes
   */
  static watch(key: string, callback: (value: any, oldValue: any) => void): void {
    this.watchers.set(key, callback);
  }

  /**
   * Stop watching configuration changes
   */
  static unwatch(key: string): void {
    this.watchers.delete(key);
  }

  /**
   * Validate entire configuration
   */
  static validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [key, schema] of Object.entries(this.schema)) {
      const value = this.config[key];
      
      // Check required fields
      if (schema.required && schema.required.includes(key)) {
        if (value === undefined || value === null) {
          errors.push(`Required field '${key}' is missing`);
        }
      }

      // Custom validation
      if (schema.validate && value !== undefined) {
        const result = schema.validate(value);
        if (result !== true) {
          errors.push(`Validation failed for '${key}': ${result}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get all configuration
   */
  static getAll(): Configuration {
    return { ...this.config };
  }

  /**
   * Reset configuration
   */
  static reset(): void {
    this.config = {};
    this.watchers.clear();
  }

  /**
   * Deep merge utility
   */
  private static deepMerge(target: Configuration, source: Configuration, overwrite: boolean): Configuration {
    const result = { ...target };

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (overwrite || result[key] === undefined) {
          result[key] = source[key];
        } else if (typeof source[key] === 'object' && typeof result[key] === 'object') {
          result[key] = this.deepMerge(result[key], source[key], overwrite);
        }
      }
    }

    return result;
  }
}

// Common configuration schemas
export const commonSchemas = {
  server: {
    port: { type: 'number', default: 3000 },
    host: { type: 'string', default: 'localhost' },
    timeout: { type: 'number', default: 30000 }
  },
  
  database: {
    host: { type: 'string', env: 'DB_HOST' },
    port: { type: 'number', env: 'DB_PORT' },
    name: { type: 'string', env: 'DB_NAME' },
    ssl: { type: 'boolean', default: false, env: 'DB_SSL' }
  },
  
  logging: {
    level: { type: 'string', default: 'info', validate: (val) => ['debug', 'info', 'warn', 'error'].includes(val) },
    file: { type: 'string' },
    maxFiles: { type: 'number', default: 10 }
  },
  
  testing: {
    timeout: { type: 'number', default: 5000 },
    retries: { type: 'number', default: 0 },
    parallel: { type: 'boolean', default: false }
  }
};

// Utility functions
export const configUtils = {
  // Quick setup with common schemas
  setupWithCommonSchemas: () => {
    ConfigurationManager.setSchema(commonSchemas);
  },

  // Load from multiple sources
  loadFromMultipleSources: async (sources: { env?: string; file?: string }[]) => {
    if (sources.some(s => s.env)) {
      ConfigurationManager.loadFromEnv();
    }
    
    for (const source of sources) {
      if (source.file) {
        await ConfigurationManager.loadFromFile(source.file);
      }
    }
  },

  // Get configuration by category
  getCategory: (category: keyof typeof commonSchemas) => {
    const schema = commonSchemas[category];
    const result: Configuration = {};
    
    for (const key in schema) {
      result[key] = ConfigurationManager.get(key, schema[key].default);
    }
    
    return result;
  },

  // Set category defaults
  setCategoryDefaults: (category: keyof typeof commonSchemas) => {
    const schema = commonSchemas[category];
    for (const key in schema) {
      if (schema[key].default !== undefined) {
        ConfigurationManager.set(key, schema[key].default);
      }
    }
  }
};