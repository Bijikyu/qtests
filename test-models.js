// Quick test of the mock models functionality
require('./setup');

const { mockModels } = require('./lib/envUtils');

async function testModels() {
  console.log('=== Mock Models Test ===');
  
  // Test custom model creation
  const User = mockModels.createMockModel('User');
  const user = new User({ name: 'Alice', email: 'alice@example.com' });
  await user.save();
  
  console.log('✓ Created user:', user.name, user._id);
  
  // Test pre-built ApiKey model
  const apiKey = new mockModels.ApiKey({ key: 'test-key-123', userId: 'user-456' });
  await apiKey.save();
  
  const foundKey = await mockModels.ApiKey.findOne({ key: 'test-key-123' });
  console.log('✓ Found API key:', foundKey.key, 'for user:', foundKey.userId);
  
  // Test pre-built ApiLog model
  const log = new mockModels.ApiLog({ 
    message: 'API request processed', 
    allowedApi: 'userService' 
  });
  await log.save();
  
  const logs = await mockModels.ApiLog.find({ allowedApi: 'userService' }).lean();
  console.log('✓ Found', logs.length, 'logs for userService');
  
  // Test query chaining
  await new User({ name: 'Bob', age: 30 }).save();
  await new User({ name: 'Charlie', age: 25 }).save();
  
  const sortedUsers = await User.find().sort({ age: -1 }).limit(2).lean();
  console.log('✓ Sorted users by age:', sortedUsers.map(u => `${u.name} (${u.age})`));
  
  // Test cleanup
  mockModels.resetAllCollections();
  const remainingUsers = await User.find().lean();
  console.log('✓ Collections reset, remaining users:', remainingUsers.length);
  
  console.log('All mock models tests passed!');
}

testModels().catch(console.error);