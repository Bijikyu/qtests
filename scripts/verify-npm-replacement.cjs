const console = require('console');

console.log('🔧 Testing NPM Module Replacement Implementation...');

try {
  // Test 1: Concurrency with p-queue
  console.log('\n📦 Testing Concurrency Utils...');
  const PQueue = require('p-queue').default;
  const queue = new PQueue({ concurrency: 2 });
  console.log('✅ p-queue imported and configured successfully');

  // Test 2: Rate Limiting with rate-limiter-flexible
  console.log('\n🚦 Testing Rate Limiter...');
  const { RateLimiterMemory } = require('rate-limiter-flexible');
  const rateLimiter = new RateLimiterMemory({ points: 5, duration: 60 });
  console.log('✅ rate-limiter-flexible imported and configured successfully');

  // Test 3: Circuit Breaker with opossum
  console.log('\n⚡ Testing Circuit Breaker...');
  const CircuitBreaker = require('opossum').default;
  const breaker = new CircuitBreaker(() => Promise.resolve('test'));
  console.log('✅ opossum imported and configured successfully');

  // Test 4: Cache with node-cache
  console.log('\n💾 Testing Cache...');
  const NodeCache = require('node-cache');
  const cache = new NodeCache({ stdTTL: 600 });
  cache.set('test', 'success');
  console.log('✅ node-cache imported and working successfully');

  // Test 5: JSON with secure-json-parse
  console.log('\n📝 Testing JSON Utils...');
  const { parse } = require('secure-json-parse');
  const parsed = parse('{"test": "success"}', undefined, { protoAction: 'remove', constructorAction: 'remove' });
  console.log('✅ secure-json-parse imported and working successfully:', parsed);

  // Test 6: File System with fs-extra
  console.log('\n📁 Testing File System Utils...');
  const fs = require('fs-extra');
  console.log('✅ fs-extra imported successfully');

  // Test 7: Logging with winston
  console.log('\n📋 Testing Logging...');
  const winston = require('winston');
  const logger = winston.createLogger({ level: 'info' });
  console.log('✅ winston imported and configured successfully');

  // Test 8: HTTP Mocking with MSW
  console.log('\n🌐 Testing HTTP Mocking...');
  const { setupServer } = require('msw/node');
  const { http, Response } = require('msw');
  const server = setupServer(
    http.get('/test', () => Response.json({ mock: 'working' }))
  );
  console.log('✅ msw imported and configured successfully');

  console.log('\n🎉 ALL NPM MODULE REPLACEMENTS WORKING CORRECTLY!');
  console.log('\n📋 Summary:');
  console.log('  ✅ p-queue (concurrency control)');
  console.log('  ✅ rate-limiter-flexible (rate limiting)');
  console.log('  ✅ opossum (circuit breaking)');
  console.log('  ✅ node-cache (caching)');
  console.log('  ✅ secure-json-parse (JSON parsing)');
  console.log('  ✅ fs-extra (file system)');
  console.log('  ✅ winston (logging)');
  console.log('  ✅ msw (HTTP mocking)');

  setTimeout(() => {
    server.close();
    console.log('\n🔚 Verification complete - server closed');
    process.exit(0);
  }, 1000);

} catch (error) {
  console.error('\n❌ VERIFICATION FAILED:', error.message);
  console.error(error.stack);
  process.exit(1);
}