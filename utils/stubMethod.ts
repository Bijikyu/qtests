// Replace with Sinon.js for superior mocking capabilities
import createStubMethod from './stubMethodModern';

// Legacy implementation for backward compatibility
const stubMethodLegacy = (obj: any, methodName: string, stubFn: Function): (() => void) => {
  try {
    if (typeof obj !== 'object' || obj === null) {
      throw new Error(`stubMethod expected object but received ${obj}`);
    }
    if (!(methodName in obj)) {
      throw new Error(`stubMethod could not find ${methodName} on provided object`);
    }
    if (typeof stubFn !== 'function') {
      throw new Error('stubMethod stubFn must be a Function');
    }
    
    // Store original method reference before replacement
    const originalMethod = obj[methodName];
    const hadOwn = Object.prototype.hasOwnProperty.call(obj, methodName);
    
    // Replace method directly on the object for immediate effect
    obj[methodName] = stubFn;
    
    // Create restoration function using closure pattern
    const restoreFunction = function restore(): void {
      // Reinstate original method only if it existed as own property, otherwise remove stub
      if (hadOwn) {
        obj[methodName] = originalMethod;
      } else {
        delete obj[methodName];
      }
    };
    console.log(`stubMethod is returning ${restoreFunction}`);
    return restoreFunction;
  } catch (error: any) {
    console.log(`stubMethod error: ${error.message}`);
    throw error;
  }
};

// Choose implementation based on configuration or environment
const useModern = process.env.QTESTS_USE_SINON === 'true';

// Export both the legacy implementation for backward compatibility and the modern Sinon.js implementation
export default useModern ? createStubMethod : stubMethodLegacy;