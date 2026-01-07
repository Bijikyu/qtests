/** Enhanced Testing Support for Modern Frameworks */
import qerrors from '../lib/qerrorsFallback.js';
import { promiseWithTimeout } from './helpers/promiseUtils.js';
export interface EnhancedTestConfig{enablePerformance?:boolean;enableMemoryProfiling?:boolean;enableErrorCapture?:boolean;timeout?:number;}
export interface TestMetrics{duration:number;memoryBefore:number;memoryAfter:number;success:boolean;error?:string;}

const getMemoryUsage=():number=>{try{const usage=process.memoryUsage();return Math.round(usage.heapUsed/1024/1024);}catch{return 0;}};

const createTestRunner=(config:EnhancedTestConfig={})=>{
  const{enableMemoryProfiling=false,enableErrorCapture=true,timeout=5000}=config;
  return{
    async runTest<T>(testName:string,testFn:()=>Promise<T>):Promise<{result:T;metrics:TestMetrics}>{
      const startTime=Date.now();const memoryBefore=enableMemoryProfiling?getMemoryUsage():0;
      try{
        const result=await promiseWithTimeout(testFn(),timeout,`Test timeout after ${timeout}ms`);
        const endTime=Date.now();const memoryAfter=enableMemoryProfiling?getMemoryUsage():0;
        return{result,metrics:{duration:endTime-startTime,memoryBefore,memoryAfter,success:true}};}
      catch(error){
        const endTime=Date.now();const memoryAfter=enableMemoryProfiling?getMemoryUsage():0;
        enableErrorCapture&&qerrors(error as Error,'enhancedTesting.runTest: test failed',{testName,duration:endTime-startTime,memoryDelta:(memoryAfter||0)-memoryBefore});
        return{result:undefined as T,metrics:{duration:endTime-startTime,memoryBefore,memoryAfter,success:false,error:error instanceof Error?error.message:String(error)}};}},
    assertPerformance:{
      withinDuration:(metrics:TestMetrics,maxMs:number)=>{if(metrics.duration>maxMs)throw new Error(`Test took ${metrics.duration}ms, exceeding maximum of ${maxMs}ms`);},
      memoryLeak:(metrics:TestMetrics,maxIncreaseMB:number=10)=>{const memoryIncrease=(metrics.memoryAfter-metrics.memoryBefore)/1024/1024;if(memoryIncrease>maxIncreaseMB)throw new Error(`Potential memory leak detected: ${memoryIncrease.toFixed(2)}MB increase`);},
      fasterThan:(currentMetrics:TestMetrics,baselineMs:number)=>{const improvement=((baselineMs-currentMetrics.duration)/baselineMs)*100;if(currentMetrics.duration>=baselineMs)throw new Error(`Test is ${improvement.toFixed(1)}% slower than baseline of ${baselineMs}ms`);}}};};

export const createEnhancedTest=(config:EnhancedTestConfig={})=>{const runner=createTestRunner(config);return{...runner,async runTests<T>(tests:Array<{name:string;fn:()=>Promise<T>}>):Promise<{results:Array<{result:T;metrics:TestMetrics}>;summary:any}>{const results:Array<{result:T;metrics:TestMetrics}>=[];const startTime=Date.now();for(const test of tests){const testResult=await runner.runTest(test.name,test.fn);results.push(testResult);if(!testResult.metrics.success)break;}const endTime=Date.now();const totalDuration=endTime-startTime;const summary={total:results.length,passed:results.filter(r=>r.metrics.success).length,failed:results.filter(r=>!r.metrics.success).length,totalDuration,averageDuration:results.length>0?totalDuration/results.length:0,slowestTest:results.reduce((slowest,r)=>r.metrics.duration>slowest.metrics.duration?r:slowest,results[0]),fastestTest:results.reduce((fastest,r)=>r.metrics.duration<fastest.metrics.duration?r:fastest,results[0]),totalMemoryDelta:results.reduce((sum,r)=>sum+(r.metrics.memoryAfter-r.metrics.memoryBefore),0)};return{results,summary};}};};

export const EnhancedTestingPatterns={createDataTest:<T,TestData>(testName:string,testData:TestData[],testFn:(data:TestData)=>Promise<T>)=>({name:testName,run:()=>createEnhancedTest().runTest(testName,()=>testFn(testData[Math.floor(Math.random()*testData.length)]))}),createPropertyTest:<T,Component>(testName:string,component:Component,property:string,value:any)=>({name:testName,run:()=>createEnhancedTest().runTest(testName,async()=>{const beforeValue=(component as any)[property];(component as any)[property]=value;return Promise.resolve({beforeValue,afterValue:value,property,component}as T);})}),createStateTest:<T,Component>(testName:string,component:Component,action:()=>Promise<void>,expectedState:any)=>({name:testName,run:()=>createEnhancedTest().runTest(testName,async()=>{const beforeState=(component as any).state;await action();const afterState=(component as any).state;return Promise.resolve({beforeState,afterState,expectedState}as T);})})};

export default createEnhancedTest;