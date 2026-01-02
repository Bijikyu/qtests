/**
 * Security Integration Example
 * 
 * Example demonstrating how to integrate qtests security framework
 * into an Express.js application. Shows middleware usage,
 * validation, monitoring, and security policies.
 */

import express, { type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';

// Extend Request interface for file uploads
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}
import { 
  securityMonitor, 
  SecurityEventType, 
  SecuritySeverity 
} from '../lib/security/SecurityMonitor.js';
import { 
  validateModuleId, 
  validateJSON, 
  validatePath
} from '../lib/security/SecurityValidator.js';
import { 
  securityPolicyManager,
  getSecurityHeaders,
  getCORSConfig 
} from '../lib/security/SecurityPolicyManager.js';
import { 
  SecurityUtils,
  generateSecureToken,
  createRateLimiter,
  createSecurityAudit
} from '../lib/security/SecurityUtils.js';
import {
  SecurityMiddleware,
  createSecurityMiddleware,
  auditMiddleware,
  apiKeyMiddleware,
  ipFilterMiddleware,
  corsMiddleware
} from '../lib/security/SecurityMiddleware.js';

/**
 * Example secure Express application
 */
function createSecureApp() {
  const app = express();
  
  // 1. Apply basic security middleware
  app.use(createSecurityMiddleware({
    enableRateLimit: true,
    enableInputValidation: true,
    enableSecurityHeaders: true,
    enableRequestLogging: true,
    rateLimitOptions: {
      windowMs: 60000, // 1 minute
      maxRequests: 100,
      keyGenerator: (req) => req.ip || 'unknown'
    },
    securityHeaders: {
      'Content-Security-Policy': "default-src 'self'"
    }
  }));

  // 2. Apply audit middleware for monitoring
  app.use(auditMiddleware());

  // 3. API key protection for secure endpoints
  app.use('/api', apiKeyMiddleware({
    headerName: 'X-API-Key',
    validator: (apiKey) => apiKey.startsWith('qtests_') && apiKey.length >= 20
  }));

  // 4. IP filtering for admin endpoints
  app.use('/admin', ipFilterMiddleware({
    allowedIPs: ['127.0.0.1', '::1'], // Localhost only
    message: 'Admin access restricted to localhost'
  }));

  // 5. CORS configuration for API
  app.use('/api', corsMiddleware({
    origin: ['https://trusted-domain.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));

  // 6. Custom rate limiting for sensitive operations
  const uploadRateLimiter = createRateLimiter({
    windowMs: 300000, // 5 minutes
    maxRequests: 10,
    backoffMs: 5000,
    maxBackoffMs: 60000
  });

  return { app, uploadRateLimiter };
}

/**
 * Example secure routes
 */
function setupSecureRoutes(app: express.Application, uploadRateLimiter: any) {
  // Public endpoint with basic validation
  app.get('/api/public', (req: Request, res: Response) => {
    const queryValidation = validateJSON(req.query.data as string || '{}');
    
    if (!queryValidation.valid) {
      const errorResponse = SecurityUtils.createSecureErrorResponse(
        'Invalid query parameters',
        'VALIDATION_ERROR'
      );
      return res.status(400).json(errorResponse);
    }

    res.json({
      message: 'Public endpoint success',
      data: queryValidation.sanitized || {},
      timestamp: new Date().toISOString()
    });
  });

  // Secure API endpoint with API key validation
  app.post('/api/secure', async (req: Request, res: Response) => {
    // API key is already validated by middleware
    const apiKey = (req as any).apiKey;
    
    // Validate request body
    const bodyValidation = validateJSON(JSON.stringify(req.body));
    if (!bodyValidation.valid) {
      securityMonitor.logEvent({
        type: SecurityEventType.INJECTION_ATTACK,
        severity: SecuritySeverity.MEDIUM,
        source: 'secure_api_endpoint',
        details: { apiKey: apiKey.substring(0, 8) + '...', errors: bodyValidation.errors },
        blocked: true,
        remediation: 'Invalid JSON structure detected'
      });

      const errorResponse = SecurityUtils.createSecureErrorResponse(
        'Invalid request body',
        'VALIDATION_ERROR'
      );
      return res.status(400).json(errorResponse);
    }

    // Process secure request
    const result = {
      message: 'Secure operation completed',
      processed: bodyValidation.sanitized,
      requestId: generateSecureToken(16),
      timestamp: new Date().toISOString()
    };

    res.json(result);
  });

  // File upload with enhanced security
  app.post('/api/upload', uploadRateLimiter.checkLimit.bind(uploadRateLimiter), async (req: Request, res: Response) => {
    try {
      // Validate file path
      const pathValidation = validatePath(req.body.targetPath || '/uploads');
      if (!pathValidation.valid) {
      securityMonitor.logEvent({
        type: SecurityEventType.PATH_TRAVERSAL,
        severity: SecuritySeverity.HIGH,
        source: 'file_upload_endpoint',
        details: { path: req.body.targetPath, errors: pathValidation.errors },
        blocked: true,
        remediation: 'Path traversal attempt in upload'
      });

      const errorResponse = SecurityUtils.createSecureErrorResponse(
          'Invalid file path',
          'PATH_VALIDATION_ERROR'
        );
        return res.status(400).json(errorResponse);
      }

      // Simulate file processing
      const fileData = {
        filename: (req as any).file?.originalname || 'unknown',
        path: pathValidation.sanitized,
        size: (req as any).file?.size || 0,
        hash: SecurityUtils.generateSecureHash(JSON.stringify(req.body))
      };

      res.json({
        message: 'File uploaded successfully',
        file: fileData,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      securityMonitor.logEvent({
        type: SecurityEventType.ANOMALOUS_PATTERN,
        severity: SecuritySeverity.MEDIUM,
        source: 'file_upload_endpoint',
        details: { error: String(error), path: req.body.targetPath },
        blocked: false,
        remediation: 'File upload processing failed'
      });

      const errorResponse = SecurityUtils.createSecureErrorResponse(
        'File upload failed',
        'UPLOAD_ERROR'
      );
      res.status(500).json(errorResponse);
    }
  });
  });

  // Admin endpoint with IP filtering
  app.get('/admin/users', (req: Request, res: Response) => {
    // IP is already validated by middleware
    const adminIp = req.ip;
    
    // Validate query parameters
    const queryValidation = validateModuleId(req.query.role as string || 'user');
    if (!queryValidation.valid) {
      const errorResponse = SecurityUtils.createSecureErrorResponse(
        'Invalid role parameter',
        'VALIDATION_ERROR'
      );
      return res.status(400).json(errorResponse);
    }

    const result = {
      message: 'Admin data accessed',
      role: queryValidation.sanitized,
      accessedBy: adminIp,
      timestamp: new Date().toISOString(),
      data: [
        { id: 1, name: 'Admin User', role: 'admin' },
        { id: 2, name: 'Regular User', role: 'user' }
      ]
    };

    res.json(result);
  });
}

/**
 * Security monitoring and reporting endpoints
 */
function setupSecurityEndpoints(app: express.Application) {
  // Security metrics endpoint
  app.get('/security/metrics', (req: Request, res: Response) => {
    const metrics = securityMonitor.getSecurityMetrics();
    const headers = getSecurityHeaders();
    
    // Apply security headers to response
    Object.entries(headers).forEach(([key, value]) => {
      if (value) {
        res.setHeader(key, value);
      }
    });

    res.json({
      timestamp: new Date().toISOString(),
      security: metrics,
      status: 'operational'
    });
  });

  // Security audit endpoint
  app.get('/security/audit', (req: Request, res: Response) => {
    const audit = createSecurityAudit({
      type: 'security_audit',
      severity: 'low',
      source: 'security_audit_endpoint',
      details: { endpoint: '/security/audit', ip: req.ip },
      blocked: false,
      remediation: 'Periodic security audit'
    });
    
    res.json({
      timestamp: audit.timestamp,
      audit: audit.event
    });
  });

  // Security test endpoint
  app.get('/security/test', async (req: Request, res: Response) => {
    const { runFullSecurityTest, generateSecurityTestReport } = await import('../lib/security/SecurityTestingFramework.js');
    
    const testResults = runFullSecurityTest();
    const report = generateSecurityTestReport(testResults);
    
    res.json({
      timestamp: new Date().toISOString(),
      testResults: {
        summary: {
          total: testResults.length,
          passed: testResults.filter(r => r.passed).length,
          failed: testResults.filter(r => !r.passed).length
        },
        details: testResults
      },
      report
    });
  });
}

/**
 * Error handling with security
 */
function setupErrorHandling(app: express.Application) {
  // Global security error handler
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    // Log security errors
    securityMonitor.logEvent({
      type: SecurityEventType.ANOMALOUS_PATTERN,
      severity: SecuritySeverity.HIGH,
      source: 'global_error_handler',
      details: { 
        error: error.message, 
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip 
      },
      blocked: false,
      remediation: 'Application error occurred'
    });

    // Send secure error response
    const errorResponse = SecurityUtils.createSecureErrorResponse(
      process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
      'INTERNAL_ERROR'
    );

    res.status(500).json(errorResponse);
  });

  // Handle 404 with security logging
  app.use((req: Request, res: Response) => {
    securityMonitor.logEvent({
      type: SecurityEventType.UNAUTHORIZED_ACCESS,
      severity: SecuritySeverity.LOW,
      source: '404_handler',
      details: { 
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      },
      blocked: false,
      remediation: '404 - Resource not found'
    });

    const errorResponse = SecurityUtils.createSecureErrorResponse(
      'Resource not found',
      'NOT_FOUND'
    );

    res.status(404).json(errorResponse);
  });
}

/**
 * Example application startup
 */
async function startSecureApplication() {
  const { app, uploadRateLimiter } = createSecureApp();
  
  // Setup routes
  setupSecureRoutes(app, uploadRateLimiter);
  
  // Setup security endpoints
  setupSecurityEndpoints(app);
  
  // Setup error handling
  setupErrorHandling(app);
  
  const port = process.env.PORT || 3000;
  
  // Log security audit on startup
  const audit = createSecurityAudit({
    type: 'startup_audit',
    severity: 'low',
    source: 'application_startup',
    details: { port, timestamp: new Date().toISOString() },
    blocked: false,
    remediation: 'Application startup security audit'
  });
  console.log('Security Audit on Startup:');
  console.log(JSON.stringify(audit, null, 2));
  
  app.listen(port, () => {
    console.log(`🔒 Secure application started on port ${port}`);
    console.log('Security features enabled:');
    console.log('  ✅ Input validation');
    console.log('  ✅ Rate limiting');
    console.log('  ✅ Security headers');
    console.log('  ✅ Request logging');
    console.log('  ✅ API key validation');
    console.log('  ✅ IP filtering');
    console.log('  ✅ CORS protection');
    console.log('  ✅ Security monitoring');
  });
}

// Export for testing or programmatic use
export {
  createSecureApp,
  setupSecureRoutes,
  setupSecurityEndpoints,
  setupErrorHandling,
  startSecureApplication
};

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startSecureApplication().catch(error => {
    console.error('Failed to start secure application:', error);
    process.exit(1);
  });
}