import { getEnvVar } from '../utils/helpers/envManager.js';

export const qtestsSilent = getEnvVar('QTESTS_SILENT', 'false');
export const qtestsInband = getEnvVar('QTESTS_INBAND', 'false');
export const qtestsFileWorkers = getEnvVar('QTESTS_FILE_WORKERS', 'false');
export const qtestsConcurrency = getEnvVar('QTESTS_CONCURRENCY', '4');
export const qtestsPattern = getEnvVar('QTESTS_PATTERN', '');
export const qtestsApiFallback = getEnvVar('QTESTS_API_FALLBACK', 'true');
export const qtestsSuppressDebug = getEnvVar('QTESTS_SUPPRESS_DEBUG', 'false');
export const qtestsNoDebugFile = getEnvVar('QTESTS_NO_DEBUG_FILE', 'false');
export const qtestsDebugFile = getEnvVar('QTESTS_DEBUG_FILE', 'DEBUG_TESTS.md');

