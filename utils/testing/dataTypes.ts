/**
 * Data Types for Test Factory
 * 
 * This module defines interfaces for test data entities
 * used across the testing framework.
 */

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  userId: string;
  isActive: boolean;
  permissions: string[];
  createdAt: Date;
  expiresAt: Date;
  [key: string]: any;
}

export interface LogEntry {
  id: string;
  level: string;
  message: string;
  timestamp: Date;
  userId?: string;
  source: string;
  [key: string]: any;
}