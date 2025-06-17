/**
 * Mock Models Tests
 * 
 * This test suite verifies the in-memory Mongoose model replacement functionality
 * that provides database-free testing for Node.js applications. Tests cover
 * CRUD operations, query chaining, and compatibility with Mongoose patterns.
 * 
 * Test coverage includes:
 * - BaseMockModel functionality and inheritance
 * - Pre-built model classes (ApiKey, ApiLog)
 * - CRUD operations (create, read, update, delete)
 * - Query operations with chaining (find, sort, skip, limit)
 * - Collection management and test isolation
 * - Mongoose API compatibility
 */

const {
  BaseMockModel,
  ApiKey,
  ApiLog,
  createMockModel,
  resetAllCollections,
  mockApiKeys,
  mockLogs
} = require('../utils/mockModels');

describe('Mock Models Framework', () => {
  
  beforeEach(() => {
    // Reset all collections before each test for isolation
    resetAllCollections();
  });
  
  describe('BaseMockModel', () => {
    
    let TestModel;
    
    beforeEach(() => {
      TestModel = createMockModel('TestModel');
    });
    
    test('creates instances with provided data', () => {
      const data = { name: 'test', value: 123 };
      const instance = new TestModel(data);
      
      expect(instance.name).toBe('test');
      expect(instance.value).toBe(123);
      expect(instance._id).toBeDefined();
      expect(typeof instance._id).toBe('string');
    });
    
    test('generates unique IDs for each instance', () => {
      const instance1 = new TestModel({ name: 'first' });
      const instance2 = new TestModel({ name: 'second' });
      
      expect(instance1._id).toBeDefined();
      expect(instance2._id).toBeDefined();
      expect(instance1._id).not.toBe(instance2._id);
    });
    
    test('saves instances to collection', async () => {
      const instance = new TestModel({ name: 'test', value: 42 });
      
      const saved = await instance.save();
      
      expect(saved).toBe(instance);
      expect(TestModel.getCollection()).toHaveLength(1);
      expect(TestModel.getCollection()[0]).toBe(instance);
    });
    
    test('updates existing instances on save', async () => {
      const instance = new TestModel({ name: 'original' });
      await instance.save();
      
      // Modify and save again
      instance.name = 'updated';
      await instance.save();
      
      expect(TestModel.getCollection()).toHaveLength(1);
      expect(TestModel.getCollection()[0].name).toBe('updated');
    });
    
    test('removes instances from collection', async () => {
      const instance = new TestModel({ name: 'to-delete' });
      await instance.save();
      
      expect(TestModel.getCollection()).toHaveLength(1);
      
      const removed = await instance.remove();
      
      expect(removed).toEqual(instance);
      expect(TestModel.getCollection()).toHaveLength(0);
    });
  });
  
  describe('Static query methods', () => {
    
    let TestModel;
    
    beforeEach(() => {
      TestModel = createMockModel('TestModel');
    });
    
    test('findOne returns first matching document', async () => {
      await new TestModel({ name: 'first', type: 'A' }).save();
      await new TestModel({ name: 'second', type: 'B' }).save();
      await new TestModel({ name: 'third', type: 'A' }).save();
      
      const result = await TestModel.findOne({ type: 'A' });
      
      expect(result).toBeDefined();
      expect(result.name).toBe('first');
      expect(result.type).toBe('A');
    });
    
    test('findOne returns null when no match found', async () => {
      await new TestModel({ name: 'test', type: 'A' }).save();
      
      const result = await TestModel.findOne({ type: 'B' });
      
      expect(result).toBeNull();
    });
    
    test('findOneAndDelete removes and returns document', async () => {
      await new TestModel({ name: 'keep', status: 'active' }).save();
      await new TestModel({ name: 'delete', status: 'inactive' }).save();
      
      const deleted = await TestModel.findOneAndDelete({ status: 'inactive' });
      
      expect(deleted).toBeDefined();
      expect(deleted.name).toBe('delete');
      expect(TestModel.getCollection()).toHaveLength(1);
      expect(TestModel.getCollection()[0].name).toBe('keep');
    });
    
    test('findOneAndDelete returns null when no match', async () => {
      await new TestModel({ name: 'test' }).save();
      
      const result = await TestModel.findOneAndDelete({ name: 'nonexistent' });
      
      expect(result).toBeNull();
      expect(TestModel.getCollection()).toHaveLength(1);
    });
    
    test('findOneAndUpdate modifies and returns document', async () => {
      await new TestModel({ name: 'original', status: 'draft' }).save();
      
      const updated = await TestModel.findOneAndUpdate(
        { name: 'original' },
        { status: 'published' }
      );
      
      expect(updated).toBeDefined();
      expect(updated.name).toBe('original');
      expect(updated.status).toBe('published');
      expect(TestModel.getCollection()[0].status).toBe('published');
    });
    
    test('findOneAndUpdate returns null when no match', async () => {
      const result = await TestModel.findOneAndUpdate(
        { name: 'nonexistent' },
        { status: 'updated' }
      );
      
      expect(result).toBeNull();
    });
    
    test('findOneAndUpdate creates document with upsert option', async () => {
      const result = await TestModel.findOneAndUpdate(
        { name: 'new' },
        { status: 'created' },
        { upsert: true }
      );
      
      expect(result).toBeDefined();
      expect(result.name).toBe('new');
      expect(result.status).toBe('created');
      expect(TestModel.getCollection()).toHaveLength(1);
    });
  });
  
  describe('Query chaining with find()', () => {
    
    let TestModel;
    
    beforeEach(async () => {
      TestModel = createMockModel('TestModel');
      
      // Create test data
      await new TestModel({ name: 'alice', age: 25, type: 'user' }).save();
      await new TestModel({ name: 'bob', age: 30, type: 'admin' }).save();
      await new TestModel({ name: 'charlie', age: 35, type: 'user' }).save();
      await new TestModel({ name: 'david', age: 20, type: 'user' }).save();
    });
    
    test('find() returns all documents by default', async () => {
      const result = await TestModel.find().lean();
      
      expect(result).toHaveLength(4);
      expect(result.map(r => r.name)).toEqual(['alice', 'bob', 'charlie', 'david']);
    });
    
    test('find() filters by query', async () => {
      const result = await TestModel.find({ type: 'user' }).lean();
      
      expect(result).toHaveLength(3);
      expect(result.every(r => r.type === 'user')).toBe(true);
    });
    
    test('sort() orders results ascending', async () => {
      const result = await TestModel.find().sort({ age: 1 }).lean();
      
      expect(result.map(r => r.age)).toEqual([20, 25, 30, 35]);
      expect(result.map(r => r.name)).toEqual(['david', 'alice', 'bob', 'charlie']);
    });
    
    test('sort() orders results descending', async () => {
      const result = await TestModel.find().sort({ age: -1 }).lean();
      
      expect(result.map(r => r.age)).toEqual([35, 30, 25, 20]);
      expect(result.map(r => r.name)).toEqual(['charlie', 'bob', 'alice', 'david']);
    });
    
    test('skip() skips specified number of documents', async () => {
      const result = await TestModel.find()
        .sort({ age: 1 })
        .skip(2)
        .lean();
      
      expect(result).toHaveLength(2);
      expect(result.map(r => r.name)).toEqual(['bob', 'charlie']);
    });
    
    test('limit() restricts number of results', async () => {
      const result = await TestModel.find()
        .sort({ age: 1 })
        .limit(2)
        .lean();
      
      expect(result).toHaveLength(2);
      expect(result.map(r => r.name)).toEqual(['david', 'alice']);
    });
    
    test('combines query, sort, skip, and limit', async () => {
      const result = await TestModel.find({ type: 'user' })
        .sort({ age: -1 })
        .skip(1)
        .limit(1)
        .lean();
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('alice');
    });
    
    test('exec() works as alias for lean()', async () => {
      const result = await TestModel.find({ type: 'user' }).exec();
      
      expect(result).toHaveLength(3);
      expect(result.every(r => r.type === 'user')).toBe(true);
    });
  });
  
  describe('Bulk operations', () => {
    
    let TestModel;
    
    beforeEach(async () => {
      TestModel = createMockModel('TestModel');
      
      await new TestModel({ name: 'alice', status: 'active' }).save();
      await new TestModel({ name: 'bob', status: 'inactive' }).save();
      await new TestModel({ name: 'charlie', status: 'active' }).save();
    });
    
    test('deleteMany() removes matching documents', async () => {
      const result = await TestModel.deleteMany({ status: 'inactive' });
      
      expect(result.deletedCount).toBe(1);
      expect(result.acknowledged).toBe(true);
      expect(TestModel.getCollection()).toHaveLength(2);
      expect(TestModel.getCollection().every(doc => doc.status === 'active')).toBe(true);
    });
    
    test('deleteMany() with empty query removes all documents', async () => {
      const result = await TestModel.deleteMany({});
      
      expect(result.deletedCount).toBe(3);
      expect(TestModel.getCollection()).toHaveLength(0);
    });
    
    test('updateMany() modifies matching documents', async () => {
      const result = await TestModel.updateMany(
        { status: 'active' },
        { status: 'verified' }
      );
      
      expect(result.modifiedCount).toBe(2);
      expect(result.acknowledged).toBe(true);
      
      const docs = TestModel.getCollection();
      expect(docs.filter(d => d.status === 'verified')).toHaveLength(2);
      expect(docs.filter(d => d.status === 'inactive')).toHaveLength(1);
    });
    
    test('countDocuments() returns matching count', async () => {
      const activeCount = await TestModel.countDocuments({ status: 'active' });
      const totalCount = await TestModel.countDocuments({});
      
      expect(activeCount).toBe(2);
      expect(totalCount).toBe(3);
    });
  });
  
  describe('ApiKey model', () => {
    
    test('creates ApiKey instances with defaults', () => {
      const apiKey = new ApiKey({ key: 'test-key', userId: '123' });
      
      expect(apiKey.key).toBe('test-key');
      expect(apiKey.userId).toBe('123');
      expect(apiKey.createdAt).toBeInstanceOf(Date);
      expect(apiKey.isActive).toBe(true);
      expect(apiKey._id).toBeDefined();
    });
    
    test('saves to mockApiKeys array', async () => {
      const apiKey = new ApiKey({ key: 'test-key' });
      
      await apiKey.save();
      
      expect(mockApiKeys).toHaveLength(1);
      expect(mockApiKeys[0]).toBe(apiKey);
    });
    
    test('findOne works with legacy interface', async () => {
      const apiKey = new ApiKey({ key: 'search-key', userId: '456' });
      await apiKey.save();
      
      const found = await ApiKey.findOne({ key: 'search-key' });
      
      expect(found).toBe(apiKey);
      expect(found.userId).toBe('456');
    });
    
    test('findOneAndDelete removes key', async () => {
      const apiKey = new ApiKey({ key: 'delete-key' });
      await apiKey.save();
      
      const deleted = await ApiKey.findOneAndDelete({ key: 'delete-key' });
      
      expect(deleted).toBe(apiKey);
      expect(mockApiKeys).toHaveLength(0);
    });
    
    test('findOneAndUpdate modifies key', async () => {
      const apiKey = new ApiKey({ key: 'update-key', isActive: true });
      await apiKey.save();
      
      const updated = await ApiKey.findOneAndUpdate(
        { key: 'update-key' },
        { isActive: false }
      );
      
      expect(updated).toBe(apiKey);
      expect(updated.isActive).toBe(false);
    });
    
    test('find() returns chain with lean() method', async () => {
      await new ApiKey({ key: 'key1' }).save();
      await new ApiKey({ key: 'key2' }).save();
      
      const chain = ApiKey.find();
      expect(typeof chain.sort).toBe('function');
      expect(typeof chain.lean).toBe('function');
      
      const results = await chain.lean();
      expect(results).toHaveLength(2);
    });
  });
  
  describe('ApiLog model', () => {
    
    test('creates ApiLog instances with defaults', () => {
      const log = new ApiLog({ 
        message: 'test log', 
        allowedApi: 'service1' 
      });
      
      expect(log.message).toBe('test log');
      expect(log.allowedApi).toBe('service1');
      expect(log.timestamp).toBeInstanceOf(Date);
      expect(log.level).toBe('info');
      expect(log._id).toBeDefined();
    });
    
    test('saves to mockLogs array', async () => {
      const log = new ApiLog({ message: 'test log' });
      
      await log.save();
      
      expect(mockLogs).toHaveLength(1);
      expect(mockLogs[0]).toBe(log);
    });
    
    test('find() filters by allowedApi', async () => {
      await new ApiLog({ message: 'log1', allowedApi: 'service1' }).save();
      await new ApiLog({ message: 'log2', allowedApi: 'service2' }).save();
      await new ApiLog({ message: 'log3', allowedApi: 'service1' }).save();
      
      const results = await ApiLog.find({ allowedApi: 'service1' }).lean();
      
      expect(results).toHaveLength(2);
      expect(results.every(log => log.allowedApi === 'service1')).toBe(true);
    });
    
    test('find() returns all logs without query', async () => {
      await new ApiLog({ message: 'log1' }).save();
      await new ApiLog({ message: 'log2' }).save();
      
      const results = await ApiLog.find().lean();
      
      expect(results).toHaveLength(2);
    });
    
    test('supports method chaining', async () => {
      await new ApiLog({ message: 'log1' }).save();
      
      const chain = ApiLog.find();
      const chainedResult = chain.sort().skip().limit();
      
      expect(chainedResult).toBe(chain);
      
      const results = await chain.lean();
      expect(results).toHaveLength(1);
    });
  });
  
  describe('createMockModel factory', () => {
    
    test('creates new model class with specified name', () => {
      const User = createMockModel('User');
      
      expect(User.name).toBe('User');
      expect(User.prototype instanceof BaseMockModel).toBe(true);
    });
    
    test('different models have separate collections', async () => {
      const User = createMockModel('User');
      const Post = createMockModel('Post');
      
      await new User({ name: 'John' }).save();
      await new Post({ title: 'Hello' }).save();
      
      expect(User.getCollection()).toHaveLength(1);
      expect(Post.getCollection()).toHaveLength(1);
      expect(User.getCollection()[0].name).toBe('John');
      expect(Post.getCollection()[0].title).toBe('Hello');
    });
    
    test('models can be used independently', async () => {
      const Product = createMockModel('Product');
      const Category = createMockModel('Category');
      
      await new Product({ name: 'Widget', price: 10 }).save();
      await new Category({ name: 'Tools' }).save();
      
      const products = await Product.find().lean();
      const categories = await Category.find().lean();
      
      expect(products).toHaveLength(1);
      expect(categories).toHaveLength(1);
      expect(products[0].price).toBe(10);
      expect(categories[0].name).toBe('Tools');
    });
  });
  
  describe('Collection management', () => {
    
    test('resetAllCollections clears all data', async () => {
      const User = createMockModel('User');
      await new User({ name: 'John' }).save();
      await new ApiKey({ key: 'test-key' }).save();
      await new ApiLog({ message: 'test log' }).save();
      
      expect(User.getCollection()).toHaveLength(1);
      expect(mockApiKeys).toHaveLength(1);
      expect(mockLogs).toHaveLength(1);
      
      resetAllCollections();
      
      expect(User.getCollection()).toHaveLength(0);
      expect(mockApiKeys).toHaveLength(0);
      expect(mockLogs).toHaveLength(0);
    });
    
    test('clearCollection clears specific model', async () => {
      const User = createMockModel('User');
      const Post = createMockModel('Post');
      
      await new User({ name: 'John' }).save();
      await new Post({ title: 'Hello' }).save();
      
      User.clearCollection();
      
      expect(User.getCollection()).toHaveLength(0);
      expect(Post.getCollection()).toHaveLength(1);
    });
  });
  
  describe('Edge cases and error handling', () => {
    
    test('handles empty queries correctly', async () => {
      const TestModel = createMockModel('TestModel');
      await new TestModel({ name: 'test' }).save();
      
      const allDocs = await TestModel.find({}).lean();
      const foundDoc = await TestModel.findOne({});
      
      expect(allDocs).toHaveLength(1);
      expect(foundDoc).toBeDefined();
    });
    
    test('handles non-existent fields in queries', async () => {
      const TestModel = createMockModel('TestModel');
      await new TestModel({ name: 'test' }).save();
      
      const result = await TestModel.findOne({ nonExistentField: 'value' });
      
      expect(result).toBeNull();
    });
    
    test('maintains instance equality after operations', async () => {
      const TestModel = createMockModel('TestModel');
      const instance = new TestModel({ name: 'test' });
      
      const saved = await instance.save();
      expect(saved).toBe(instance);
      
      const found = await TestModel.findOne({ name: 'test' });
      expect(found).toBe(instance);
    });
  });
});