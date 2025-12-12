import { createRequire } from 'module';

declare const global: any;

export const forceGC = (): void => {
  if (global.gc) {
    for (let i = 0; i < 3; i++) {
      global.gc();
    }
  }
};

export const clearGlobalRefs = (): void => {
  const refsToClear = [
    'testServer',
    'mongoConnection',
    '__MONGO_DB__',
    '__MONGOD__',
    'app',
    'server',
    'io',
    'redisClient'
  ];

  refsToClear.forEach(ref => {
    if (global[ref]) {
      try {
        if (typeof global[ref].close === 'function') {
          global[ref].close();
        }
        if (typeof global[ref].disconnect === 'function') {
          global[ref].disconnect();
        }
      } catch {}
      global[ref] = null;
    }
  });
};

export const clearModuleCache = (): number => {
  try {
    const require = createRequire(import.meta.url);
    const moduleKeys = Object.keys(require.cache);
    let cleared = 0;

    moduleKeys.forEach(key => {
      if (key.includes('.test.') ||
          key.includes('.spec.') ||
          key.includes('GeneratedTest') ||
          key.includes('/tests/') ||
          key.includes('testHelpers')) {
        delete require.cache[key];
        cleared++;
      }
    });

    return cleared;
  } catch {
    return 0;
  }
};

export const aggressiveCleanup = (): void => {
  try {
    clearGlobalRefs();
    const clearedModules = clearModuleCache();
    forceGC();
    console.log(`Memory cleanup: cleared ${clearedModules} modules`);
  } catch (error: any) {
    console.warn('Memory cleanup warning:', error.message);
  }
};

export default aggressiveCleanup;
