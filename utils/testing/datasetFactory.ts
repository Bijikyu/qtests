/**
 * Dataset Factory Functions
 * 
 * This module provides factory functions for creating
 * complete test datasets with related entities.
 */

import { logStart, logReturn } from '../../lib/logUtils.js';
import { EntityFactory } from './entityFactory.js';
import { User, ApiKey, LogEntry } from './dataTypes.js';

/**
 * Creates a complete test dataset with related entities
 */
export function createTestDataset(): { users: User[]; apiKeys: ApiKey[]; logs: LogEntry[] } {
  logStart('DatasetFactory.createTestDataset');
  
  // Create 3 test users
  const users = EntityFactory.createUsers(3);
  
  // Create API keys for each user
  const apiKeys = users.map(user => EntityFactory.createApiKey({ userId: user.id }));
  
  // Create log entries for each user
  const logs = users.flatMap(user => [
    EntityFactory.createLogEntry({ userId: user.id, level: 'info', message: `User ${user.username} logged in` }),
    EntityFactory.createLogEntry({ userId: user.id, level: 'debug', message: `User ${user.username} performed action` })
  ]);
  
  const dataset = { users, apiKeys, logs };
  logReturn('DatasetFactory.createTestDataset', dataset);
  return dataset;
}