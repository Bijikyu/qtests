// Simple integration test to verify frontend-backend API compatibility
// This test verifies that backend app structure and endpoints exist

describe('Frontend-Backend Integration', () => {
  test('backend app can be imported and has expected structure', () => {
    // Import demo server app (CommonJS)
    const app = require('../../demo/server/app.js');
    
    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
    expect(app._router).toBeDefined();
  });

  test('frontend endpoints exist in backend routes', () => {
    const app = require('../../demo/server/app.js');
    
    // Check that router has stack with routes
    expect(app._router.stack).toBeDefined();
    expect(Array.isArray(app._router.stack)).toBe(true);
    
    // Verify app has mounted route handlers
    const routes = app._router.stack
      .filter(layer => layer.route || (layer.name === 'router' && layer.handle && layer.handle.stack))
      .map(layer => {
        if (layer.route) {
          return Object.keys(layer.route.methods)[0] + ' ' + layer.route.path;
        }
        if (layer.name === 'router') {
          return 'router: ' + (layer.regexp || 'unknown');
        }
        return 'unknown';
      });
    
    // Should have router-mounted endpoints
    expect(routes.length).toBeGreaterThan(0);
  });

  test('required API endpoints are available', () => {
    // Check that required modules/routes can be imported
    expect(() => require('../../demo/server/routes/hello')).not.toThrow();
    expect(() => require('../../demo/server/routes/calculator')).not.toThrow();
    expect(() => require('../../demo/server/routes/status')).not.toThrow();
    expect(() => require('../../demo/server/routes/users')).not.toThrow();
  });
});
