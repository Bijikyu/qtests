/** Core Method Stubbing Functions */
import*as sinon from'sinon';import{withErrorLogging}from'../../lib/errorHandling/index.js';
export type StubRestoreFunction=()=>void;export type StubFunction=(...args:any[])=>any;
export type SinonSpy=sinon.SinonSpy;export type SinonStub=sinon.SinonStub;export type SinonMock=sinon.SinonMock;

const validateStub=(data:{obj:any,methodName:string,stubFn:StubFunction})=>{
  if(typeof data.obj!=='object'||data.obj===null)throw new Error(`stubMethod expected object but received ${data.obj}`);
  if(typeof data.methodName!=='string'||!data.methodName?.trim())throw new Error(`stubMethod methodName must be a non-empty string, received ${data.methodName}`);
  if(!(data.methodName in data.obj))throw new Error(`stubMethod could not find ${data.methodName} on provided object`);
  if(typeof data.obj[data.methodName]!=='function')throw new Error(`stubMethod ${data.methodName} exists but is not a function on provided object`);
  const descriptor=Object.getOwnPropertyDescriptor(data.obj,data.methodName);
  if(!descriptor)throw new Error(`stubMethod cannot find property descriptor for ${data.methodName}`);
  if(typeof descriptor!=='object'||descriptor===null)throw new Error(`stubMethod invalid property descriptor for ${data.methodName}`);
  if(descriptor?.value!==undefined?(!descriptor.configurable||!descriptor.writable):!descriptor?.configurable)throw new Error(`stubMethod cannot stub non-configurable property ${data.methodName}`);
  if(typeof data.stubFn!=='function')throw new Error('stubMethod stubFn must be a Function');
};

export const stubMethod=(data:{obj:any,methodName:string,stubFn:StubFunction}):{restore:StubRestoreFunction}=>{
  const restoreFunction=withErrorLogging(()=>{
    validateStub(data);
    let stub;
    try{stub=sinon.stub(data.obj,data.methodName).callsFake(data.stubFn);}
    catch(sinonError){throw new Error(`stubMethod failed to create Sinon stub for ${data.methodName}: ${(sinonError as Error).message}`);}
    return():void=>{
      try{stub&&typeof stub.restore==='function'&&stub.restore();}
      catch(restoreError){console.warn(`stubMethod: Failed to restore stub for ${data.methodName}:`,restoreError);}
    };
  },'stubMethod');
  return{restore:restoreFunction};
};

export const createStubMethod=(data:{obj:any,methodName:string,stubFn:Function}):{restore:()=>void}=>stubMethod({obj:data.obj,methodName:data.methodName,stubFn:data.stubFn as StubFunction});