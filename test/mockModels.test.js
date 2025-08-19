/**
 * Mock Models Integration Tests - Focused functionality verification
 */

const {
  BaseMockModel,
  ApiKey,
  createMockModel,
  resetAllCollections
} = require('../utils/mockModels');

describe('Mock Models Integration', () => {
  
  beforeEach(() => {
    resetAllCollections();
  });
  
  test('BaseMockModel creates and saves instances', async () => {
    const TestModel = createMockModel('TestModel');
    const instance = new TestModel({ name: 'test', value: 123 });
    
    expect(instance.name).toBe('test');
    expect(instance._id).toBeDefined();
    
    const saved = await instance.save();
    expect(saved).toBe(instance);
    expect(TestModel.getCollection()).toHaveLength(1);
  });
  
  test('ApiKey model works correctly', () => {
    const apiKey = new ApiKey({ 
      key: 'test-key', 
      name: 'Test API Key',
      permissions: ['read', 'write']
    });
    
    expect(apiKey.key).toBe('test-key');
    expect(apiKey.name).toBe('Test API Key');
    expect(apiKey.permissions).toEqual(['read', 'write']);
    expect(apiKey._id).toBeDefined();
  });

  test('resetAllCollections clears data', async () => {
    const TestModel = createMockModel('TestModel');
    await new TestModel({ name: 'test' }).save();
    
    expect(TestModel.getCollection()).toHaveLength(1);
    
    resetAllCollections();
    expect(TestModel.getCollection()).toHaveLength(0);
  });
});