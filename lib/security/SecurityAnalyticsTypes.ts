/**
 * Security Analytics Types
 * 
 * Type definitions for security analytics components
 */

import { SecurityEventType, SecuritySeverity } from './SecurityMonitor.js';

export interface SecurityAnalyticsConfig {
  retentionDays?: number;
  anomalyThresholds?: {
    failedAuthThreshold?: number;
    unusualPatternScore?: number;
    geoAnomalyThreshold?: number;
    timeBasedAnomaly?: boolean;
  };
  threatIntelligence?: {
    enabled?: boolean;
    blocklistUpdateInterval?: number;
    reputationCheck?: boolean;
  };
  automatedResponse?: {
    enabled?: boolean;
    autoBlockDuration?: number;
    escalationTriggers?: SecurityEventType[];
  };
}

export interface ThreatIntelligence {
  maliciousIPs: Set<string>;
  suspiciousUserAgents: Set<string>;
  attackPatterns: Map<string, number>;
  geoAnomalies: Map<string, number>;
  reputation: Map<string, { score: number; lastSeen: number }>;
}

export interface BehavioralAnalysis {
  userPatterns: Map<string, {
    requestCount: number;
    failedAttempts: number;
    uniquePaths: Set<string>;
    timingPattern: number[];
    lastActivity: number;
    riskScore: number;
  }>;
  systemPatterns: {
    requestRate: number;
    errorRate: number;
    responseTime: number[];
    peakHours: number[];
  };
}

export interface SecurityIncident {
  id: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  timestamp: Date;
  source: string;
  target: string;
  details: Record<string, any>;
  status: 'active' | 'resolved' | 'investigating';
  automatedResponse?: {
    action: string;
    duration: number;
    success: boolean;
  };
}