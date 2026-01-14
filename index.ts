/** qtests - Main Entry Point */
import{setup}from'./lib/setup.js';import stubs from'./lib/stubs.js';
import{testEnv,offlineMode,testHelpers}from'./lib/envUtils.js';
import{initializePolyfills,resetPolyfills,getWindow,matchMedia,clipboard,polyfillOrchestrator}from'./lib/polyfills/index.js';
import{safeReadFile,safeReadFileBuffer}from'./lib/fileSystem/fileReading.js';import{safeWriteFile,ensureDir}from'./lib/fileSystem/fileWriting.js';

import{stubMethod as enhancedStubMethod,spyOnMethod as sinonSpy}from'./utils/stubMethod.js';
import{mockConsole}from'./utils/mockConsole.js';
import{createMockApp}from'./utils/httpTest.js';
import{runTestSuite,runTestSuites,createAssertions}from'./utils/runTestSuite.js';
import{waitForCondition}from'./lib/waitForCondition.js';
import{createAsyncErrorWrapper}from'./lib/errorHandling/index.js';

export const stubMethod=(obj:any,methodName:string,replacement:(...args:any[])=>any)=>enhancedStubMethod({obj,methodName,stubFn:replacement}).restore;
export const spyOnMethod=(obj:any,methodName:string)=>sinonSpy(obj,methodName);

export{setup,stubs,testEnv,offlineMode,testHelpers,initializePolyfills,resetPolyfills,getWindow,matchMedia,clipboard,polyfillOrchestrator,safeReadFile,safeReadFileBuffer,safeWriteFile,ensureDir};
export{mockConsole,createMockApp,runTestSuite,runTestSuites,createAssertions,waitForCondition,createAsyncErrorWrapper};

export{nodeEnv,testMode,debugMode,runtimeNodeVersion,runtimePlatform,runtimeArch,devHotReload,devSourceMaps,devVerboseLogging,experimentalFeatures,experimentalParallelExecution,experimentalAdvancedMocking,legacyMode,legacyWarnings}from'./config/localVars.js';
export{defaultTestTimeout,defaultRetryAttempts,defaultRetryDelay,maxConcurrentTests,testMemoryThreshold,jestTestTimeout,jestVerbose,jestCoverage,jestCache,jestPassWithNoTests,integrationTestTimeout,integrationTestRetryAttempts,integrationTestRetryDelay,integrationTestCleanupDelay,performanceTestDuration,performanceTestSamples,performanceTestThreshold}from'./config/localVars.js';
export{defaultMockStatusCode,defaultMockResponse,defaultMockHeaders,axiosStubTimeout,consoleMockLevels,consoleCaptureAll,stubModules,stubModulePaths}from'./config/localVars.js';
export const version='2.5.0';
export const description='Comprehensive Node.js testing framework with method stubbing, console mocking, environment management, and automatic stub resolution';
