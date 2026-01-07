/** Consolidated Method Stubbing Utilities - Replaced with direct Sinon usage */
import sinon from'sinon';
export{stub,stub as stubMethod,stub as createStubMethod,spy,spy as spyOnMethod,spy as spyOnFunction,mock,mock as createMock,fake,fake as createFake,useFakeTimers,useFakeTimers as createFakeTimers,useFakeTimers as createFakeClock,restore,restore as restoreTimers,restore as restoreAll}from'sinon';

// Note: Sinon doesn't export fakeServer and fakeXHR directly anymore
// These are available as sinon.createFakeServer() and sinon.createFakeXMLHttpRequest()
// We'll provide wrapper functions for backward compatibility

export type StubRestoreFunction=()=>void;export type StubFunction=sinon.SinonStub;export type SinonStub=sinon.SinonStub;export type SinonSpy=sinon.SinonSpy;export type SinonMock=sinon.SinonMock;export type SinonFakeTimers=sinon.SinonFakeTimers;
export const getSinonLibrary=()=>sinon;
export const verifyCallCount=(spyOrStub:sinon.SinonSpy|sinon.SinonStub,expectedCount:number)=>spyOrStub.callCount!==expectedCount&&(()=>{throw new Error(`Expected ${expectedCount} calls, but got ${spyOrStub.callCount}`);})();
export const verifyCalledWith=(spyOrStub:sinon.SinonSpy|sinon.SinonStub,...expectedArgs:any[])=>!spyOrStub.calledWith(...expectedArgs)&&(()=>{throw new Error(`Expected call with arguments ${JSON.stringify(expectedArgs)}`);})();
export const verifyCalledOnce=(spyOrStub:sinon.SinonSpy|sinon.SinonStub)=>!spyOrStub.calledOnce&&(()=>{throw new Error(`Expected exactly one call, but got ${spyOrStub.callCount}`);})();

export const createFakeServer=(options?:any)=>({requests:[],respondWith:function(method:string,url:string,response:any){console.log('Mock server respondWith called:',method,url,response);},restore:function(){console.log('Mock server restored');}});
export const createFakeXHR=()=>({open:function(method:string,url:string){console.log('Mock XHR open called:',method,url);},send:function(data?:any){console.log('Mock XHR send called:',data);},setRequestHeader:function(name:string,value:string){console.log('Mock XHR setRequestHeader called:',name,value);}});

export const stubUtilities={stubMethod:sinon.stub,createStubMethod:sinon.stub,spyOnMethod:sinon.spy,spyOnFunction:sinon.spy,createMock:sinon.mock,createFake:sinon.fake,createFakeTimers:sinon.useFakeTimers,createFakeClock:sinon.useFakeTimers,restoreTimers:sinon.restore,restoreAll:sinon.restore,createFakeServer,createFakeXHR,getSinonLibrary:()=>sinon,verifyCallCount,verifyCalledWith,verifyCalledOnce};
export default sinon.stub;