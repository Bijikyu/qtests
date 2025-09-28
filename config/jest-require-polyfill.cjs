// Ensure a global `require` exists for ESM test files that use CommonJS require().
// Executed by Jest via `setupFiles` BEFORE test files are evaluated.
try {
  if (typeof global.require === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createRequire } = require('module');
    let req;
    try {
      // Prefer resolving relative to project root
      req = createRequire(process.cwd() + '/package.json');
    } catch {
      req = createRequire(__filename);
    }
    Object.defineProperty(global, 'require', {
      value: req,
      writable: false,
      configurable: true,
      enumerable: false,
    });
  }
} catch {}

