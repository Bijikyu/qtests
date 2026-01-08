import { parentPort, workerData } from 'worker_threads';
import { createRequire } from 'module';

type WorkerInput = {
  configPath: string;
  projectRoot: string;
  testFiles: string[];
};

type WorkerResult = {
  passedFiles: number;
  failedFiles: number;
  results: Array<{
    file: string;
    success: boolean;
    durationMs: number;
    failureMessage: string;
  }>;
};

async function runWorker(): Promise<void> {
  const { configPath, projectRoot, testFiles } = workerData as WorkerInput;
  const require = createRequire(import.meta.url);
  const jestModule = require('jest');
  const runCLI = jestModule?.runCLI;
  if (typeof runCLI !== 'function') {
    throw new Error('Jest runCLI API unavailable');
  }

  let passedFiles = 0;
  let failedFiles = 0;
  const results: WorkerResult['results'] = [];

  const originalCwd = process.cwd();
  try {
    try { process.chdir(projectRoot); } catch {}

    for (const testFile of testFiles) {
      const argv: any = {
        config: configPath,
        passWithNoTests: true,
        cache: true,
        coverage: false,
        runTestsByPath: true,
        runInBand: true,
        silent: true,
        _: [testFile],
        $0: 'jest'
      };

      const { results: runResults } = await runCLI(argv, [projectRoot]);
      const tr = (runResults?.testResults || [])[0];
      const success = tr ? (tr.numFailingTests || 0) === 0 && !tr.failureMessage : runResults?.success !== false;
      const durationMs = tr?.perfStats?.end && tr?.perfStats?.start ? tr.perfStats.end - tr.perfStats.start : 0;
      const failureMessage = tr?.failureMessage ? String(tr.failureMessage) : '';

      if (success) passedFiles += 1;
      else failedFiles += 1;

      results.push({
        file: testFile,
        success,
        durationMs,
        failureMessage
      });
    }
  } finally {
    try { process.chdir(originalCwd); } catch {}
  }

  const payload: WorkerResult = { passedFiles, failedFiles, results };
  parentPort?.postMessage(payload);
}

runWorker().catch((error) => {
  parentPort?.postMessage({
    error: {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }
  });
});
