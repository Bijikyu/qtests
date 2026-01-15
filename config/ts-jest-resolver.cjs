const path = require('path');

/**
 * Custom resolver that tries a TypeScript fallback when a .js module is missing.
 * Resolving only happens for files authored inside the project root so we don't
 * accidentally map third-party modules from node_modules.
 */
module.exports = function tsFallbackResolver(request, options) {
  try {
    return options.defaultResolver(request, options);
  } catch (error) {
    if (typeof request !== 'string' || !request.endsWith('.js')) {
      throw error;
    }

    const rootDir = options.rootDir ? path.resolve(options.rootDir) : process.cwd();
    const basedir = options.basedir ? path.resolve(options.basedir) : rootDir;
    const isInsideProject =
      basedir.startsWith(rootDir) &&
      !basedir.split(path.sep).includes('node_modules');

    if (!isInsideProject) {
      throw error;
    }

    const tsRequest = `${request.slice(0, -3)}.ts`; // swap the extension to TypeScript
    return options.defaultResolver(tsRequest, options);
  }
};
