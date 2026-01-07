/** qtests - Main Entry Point */
import{setup}from'./lib/setup.js';import stubs from'./lib/stubs.js';
import{testEnv,offlineMode,testHelpers}from'./lib/envUtils.js';
import{initializePolyfills,resetPolyfills,getWindow,matchMedia,clipboard,polyfillOrchestrator}from'./lib/polyfills/index.js';
import{safeReadFile,safeReadFileBuffer}from'./lib/fileSystem/fileReading.js';import{safeWriteFile,ensureDir}from'./lib/fileSystem/fileWriting.js';

export const stubMethod=()=>{throw new Error('stubMethod not available - import from utils/stubMethod');};
export const mockConsole=()=>{throw new Error('mockConsole not available - import from utils/mockConsole');};
export const createMockApp=()=>{throw new Error('createMockApp not available - import from utils/httpTest');};
export const runTestSuite=()=>{throw new Error('runTestSuite not available - import from utils/runTestSuite');};
export const runTestSuites=()=>{throw new Error('runTestSuites not available - import from utils/runTestSuite');};
export const createAssertions=()=>{throw new Error('createAssertions not available - import from utils/runTestSuite');};

export{setup,stubs,testEnv,offlineMode,testHelpers,initializePolyfills,resetPolyfills,getWindow,matchMedia,clipboard,polyfillOrchestrator,safeReadFile,safeReadFileBuffer,safeWriteFile,ensureDir};

export{nodeEnv,testMode,debugMode,runtimeNodeVersion,runtimePlatform,runtimeArch,devHotReload,devSourceMaps,devVerboseLogging,experimentalFeatures,experimentalParallelExecution,experimentalAdvancedMocking,legacyMode,legacyWarnings}from'./config/localVars.js';
export{defaultTestTimeout,defaultRetryAttempts,defaultRetryDelay,maxConcurrentTests,testMemoryThreshold,jestTestTimeout,jestVerbose,jestCoverage,jestCache,jestPassWithNoTests,integrationTestTimeout,integrationTestRetryAttempts,integrationTestRetryDelay,integrationTestCleanupDelay,performanceTestDuration,performanceTestSamples,performanceTestThreshold}from'./config/localVars.js';
export{defaultMockStatusCode,defaultMockResponse,defaultMockHeaders,axiosStubTimeout,consoleMockLevels,consoleCaptureAll,stubModules,stubModulePaths}from'./config/localVars.js';
export const version='2.0.0';
export const description='Comprehensive Node.js testing framework with method stubbing, console mocking, environment management, and automatic stub resolution';