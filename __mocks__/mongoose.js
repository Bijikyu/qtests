// __mocks__/mongoose.js - Jest manual mock for mongoose to prevent real DB access

const models = {};

function createFallbackFn(impl) {
  let implementation = impl;
  const f = (...args) => (typeof implementation === 'function' ? implementation(...args) : undefined);
  f.mockImplementation = (next) => {
    implementation = next;
    return f;
  };
  f.mockReturnThis = () => f.mockImplementation(function () { return this; });
  f.mockResolvedValue = (v) => f.mockImplementation(() => Promise.resolve(v));
  return f;
}

const jestRef = globalThis.jest;
const fn = jestRef && typeof jestRef.fn === 'function' ? jestRef.fn.bind(jestRef) : createFallbackFn;

module.exports = {
  connect: fn().mockResolvedValue(undefined),
  connection: { on: fn(), once: fn() },
  models,
  Schema: fn().mockImplementation(() => ({
    virtual: fn().mockReturnThis(),
    pre: fn().mockReturnThis(),
    post: fn().mockReturnThis(),
    index: fn().mockReturnThis()
  })),
  model: fn().mockImplementation((name) => {
    if (!models[name]) {
      models[name] = {
        find: fn().mockResolvedValue([]),
        findById: fn().mockResolvedValue(null),
        findOne: fn().mockResolvedValue(null),
        create: fn().mockImplementation(async (doc = {}) => ({ _id: 'mock-object-id', ...(doc || {}) })),
        findByIdAndUpdate: fn().mockResolvedValue({}),
        findByIdAndDelete: fn().mockResolvedValue({}),
        save: fn().mockResolvedValue({})
      };
    }
    return models[name];
  }),
  Types: { ObjectId: fn().mockImplementation((id) => id || 'mock-object-id') }
};
