// Replace with Sinon.js for superior mocking capabilities
import sinon from 'sinon';

// Modern implementation using Sinon.js
const createStubMethod = (obj: any, methodName: string, stubFn: Function): (() => void) => {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error(`createStubMethod expected object but received ${obj}`);
  }
  if (!(methodName in obj)) {
    throw new Error(`createStubMethod could not find ${methodName} on provided object`);
  }
  if (typeof stubFn !== 'function') {
    throw new Error('createStubMethod stubFn must be a Function');
  }
  
  const stub = sinon.stub(obj, methodName).callsFake(stubFn as (...args: unknown[]) => unknown);
  return () => stub.restore();
};

export default createStubMethod;