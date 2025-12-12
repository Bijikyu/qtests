import sinon from 'sinon';

export type StubRestoreFunction = () => void;
export type StubFunction = (...args: any[]) => any;

function stubMethod(obj: any, methodName: string, stubFn: StubFunction): StubRestoreFunction {
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

    const stub = sinon.stub(obj, methodName).callsFake(stubFn);
    
    return function restore(): void {
      stub.restore();
    };
  } catch (error: any) {
    console.log(`stubMethod error: ${error.message}`);
    throw error;
  }
}

function spyOnMethod(obj: any, methodName: string): sinon.SinonSpy {
  try {
    return sinon.spy(obj, methodName);
  } catch (error: any) {
    console.log(`spyOnMethod error: ${error.message}`);
    throw error;
  }
}

function createMock<T extends object>(template: Partial<T> = {}): T {
  try {
    return sinon.mock(template) as any;
  } catch (error: any) {
    console.log(`createMock error: ${error.message}`);
    throw error;
  }
}

function createFakeTimers(): sinon.SinonFakeTimers {
  try {
    return sinon.useFakeTimers();
  } catch (error: any) {
    console.log(`createFakeTimers error: ${error.message}`);
    throw error;
  }
}

function getSinonLibrary(): typeof sinon {
  return sinon;
}

export {
  stubMethod,
  spyOnMethod,
  createMock,
  createFakeTimers,
  getSinonLibrary
};

export default stubMethod;

export type SinonSpy = sinon.SinonSpy;
export type SinonStub = sinon.SinonStub;
export type SinonMock = sinon.SinonMock;