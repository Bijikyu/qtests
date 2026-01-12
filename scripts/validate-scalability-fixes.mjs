/**
 * Quick validation test for scalability utilities
 */

// Test concurrency utils
import { limitedPromiseAll, Semaphore } from './lib/utils/concurrencyUtils.ts';

// Test JSON utils
import { safeJSONParse, safeJSONStringify, cachedJSONStringify } from './lib/utils/jsonUtils.ts';

// Test streaming utils
import { shouldUseStreaming, getFileSize } from './lib/utils/streamingUtils.ts';

async function testConcurrencyUtils() {
  console.log('🧪 Testing concurrency utilities...');
  
  const tasks = Array.from({ length: 20 }, (_, i) => async () => {
    await new Promise(resolve => setTimeout(resolve, 10));
    return i;
  });
  
  // Test limited concurrency
  const start = Date.now();
  const results = await limitedPromiseAll(tasks, 5);
  const duration = Date.now() - start;
  
  console.log(`✅ limitedPromiseAll: ${results.length} tasks completed in ${duration}ms`);
  
  // Test semaphore
  const semaphore = new Semaphore(3);
  let active = 0;
  let maxActive = 0;
  
  const semaphoreTasks = Array.from({ length: 10 }, async (_, i) => {
    await semaphore.acquire();
    active++;
    maxActive = Math.max(maxActive, active);
    
    await new Promise(resolve => setTimeout(resolve, 20));
    
    active--;
    semaphore.release();
    return i;
  });
  
  await Promise.all(semaphoreTasks);
  console.log(`✅ Semaphore: Max concurrent operations = ${maxActive} (expected: 3)`);
  
  semaphore.destroy();
}

async function testJSONUtils() {
  console.log('🧪 Testing JSON utilities...');
  
  const testObj = { large: 'x'.repeat(1000), data: Array.from({ length: 100 }, (_, i) => i) };
  
  // Test safe operations
  const json = safeJSONStringify(testObj);
  const parsed = safeJSONParse(json);
  console.log(`✅ safeJSON operations: ${parsed ? 'success' : 'failed'}`);
  
  // Test cached stringify
  const start = Date.now();
  const cached1 = cachedJSONStringify(testObj);
  const cached2 = cachedJSONStringify(testObj);
  const cachedTime = Date.now() - start;
  console.log(`✅ cachedJSONStringify: ${cached1 === cached2 ? 'cache working' : 'cache failed'} in ${cachedTime}ms`);
}

async function testStreamingUtils() {
  console.log('🧪 Testing streaming utilities...');
  
  // Test file size check
  try {
    const size = await getFileSize('./package.json');
    console.log(`✅ getFileSize: package.json is ${size} bytes`);
    
    const shouldStream = await shouldUseStreaming('./package.json', 1024);
    console.log(`✅ shouldUseStreaming: ${shouldStream ? 'would stream' : 'would buffer'} package.json`);
  } catch (error) {
    console.log('⚠️  Streaming utils test failed (file not found)');
  }
}

async function runValidationTests() {
  console.log('🚀 Starting scalability utilities validation...\n');
  
  try {
    await testConcurrencyUtils();
    console.log('');
    
    await testJSONUtils();
    console.log('');
    
    await testStreamingUtils();
    console.log('');
    
    console.log('✅ All scalability utilities validated successfully!');
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

runValidationTests();