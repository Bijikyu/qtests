// __mocks__/mongoose.js - Jest manual mock for mongoose to prevent real DB access
// Provides a models map and common model methods as jest.fn() stubs

const models = {};

module.exports = {
  connect: jest.fn().mockResolvedValue(undefined),
  connection: { on: jest.fn(), once: jest.fn() },
  models,
  Schema: jest.fn().mockImplementation(() => ({
    // Chainable no-op methods to mimic Mongoose schema API
    virtual: jest.fn().mockReturnThis(),
    pre: jest.fn().mockReturnThis(),
    post: jest.fn().mockReturnThis(),
    index: jest.fn().mockReturnThis(),
  })),
  model: jest.fn().mockImplementation((name) => {
    if (!models[name]) {
      models[name] = {
        find: jest.fn().mockResolvedValue([]),
        findById: jest.fn().mockResolvedValue(null),
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(async (doc = {}) => ({ _id: 'mock-object-id', ...(doc || {}) })),
        findByIdAndUpdate: jest.fn().mockResolvedValue({}),
        findByIdAndDelete: jest.fn().mockResolvedValue({}),
        save: jest.fn().mockResolvedValue({}),
      };
    }
    return models[name];
  }),
  Types: { ObjectId: jest.fn().mockImplementation((id) => id || 'mock-object-id') },
};
