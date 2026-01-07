/** Offline Mode Utility - TypeScript Implementation */
import{CODEX,OFFLINE_MODE,NODE_ENV}from'../config/localVars.js';import qerrors from'qerrors';import path from'path';
interface EnvironmentState{codexFlag:boolean;offlineFlagExplicit:boolean;testEnvironment:boolean;isOffline:boolean;environmentDetected:boolean;}
interface EnvironmentAdapters{isOffline:boolean;axios:any;qerrors:any;}
let isOfflineFlag=false;let cachedAxios:any=null;let cachedQerrors:any=null;

function setOfflineMode(offline:boolean):void{const changed=isOfflineFlag!==offline;isOfflineFlag=offline;changed&&clearOfflineCache();}
function isOfflineMode():boolean{return isOfflineFlag;}
function clearOfflineCache():void{cachedAxios=null;cachedQerrors=null;}

async function getAxiosModule():Promise<any>{
  if(!cachedAxios){
    if(isOfflineFlag){
      try{
        const axiosPath=require.resolve('../stubs/axios.js');
        const resolvedPath=path.normalize(path.resolve(axiosPath));
        const expectedDir=path.normalize(path.resolve(process.cwd(),'stubs'));
        if(!resolvedPath.startsWith(expectedDir+path.sep)&&resolvedPath!==expectedDir)throw new Error('Invalid stub module path - outside expected directory');
        const relativePath=path.relative(expectedDir,resolvedPath);
        if(relativePath.startsWith('..')||relativePath.includes(path.sep+'..'))throw new Error('Invalid stub module path - directory traversal detected');
        const module=await import(axiosPath);
        cachedAxios=module.default||module;
      }catch(error){
        qerrors(error instanceof Error?error:new Error(String(error)),'offlineMode.getEnvironment: stub axios import failed',{modulePath:'../stubs/axios.js',environment:'offline'});
        throw error;
      }
    }else{
      try{
        const axios=await import('axios');
        cachedAxios=axios.default||axios;
      }catch(error){
        const errorObj=error instanceof Error?error:new Error(String(error));
        qerrors(errorObj,'offlineMode.getEnvironment: real axios import failed',{modulePath:'axios',errorType:errorObj.constructor?.name||'unknown'});
        try{
          const fallbackAxiosPath=require.resolve('../stubs/axios.js');
          const fallbackResolvedPath=path.normalize(path.resolve(fallbackAxiosPath));
          const fallbackExpectedDir=path.normalize(path.resolve(process.cwd(),'stubs'));
          if(!fallbackResolvedPath.startsWith(fallbackExpectedDir+path.sep)&&fallbackResolvedPath!==fallbackExpectedDir)throw new Error('Invalid fallback stub path - outside expected directory');
          const stubAxios=await import('../stubs/axios.js');
          cachedAxios=stubAxios.default||stubAxios;
        }catch(fallbackError){
          const fallbackErrorObj=fallbackError instanceof Error?fallbackError:new Error(String(fallbackError));
          qerrors(fallbackErrorObj as Error,'offlineMode.getEnvironment: fallback axios import failed',{modulePath:'../stubs/axios.js',originalError:errorObj&&errorObj instanceof Error?errorObj.message:'Unknown error'});
          cachedAxios={get:()=>Promise.resolve({}),post:()=>Promise.resolve({})};
        }
      }
    }
  }
  return cachedAxios;
}

async function getQerrors():Promise<any>{
  if(!cachedQerrors){
    if(isOfflineFlag){
      cachedQerrors={qerrors:()=>{}};
    }else{
      try{
        cachedQerrors={qerrors:()=>{}};
      }catch(e){
        cachedQerrors={qerrors:()=>{}};
      }
    }
  }
  return cachedQerrors;
}

function getEnvironmentState():EnvironmentState{
  const codexFlag=CODEX?.toLowerCase()==='true';
  const offlineFlagExplicit=OFFLINE_MODE?.toLowerCase()==='true';
  const testEnvironment=NODE_ENV==='test';
  return{codexFlag,offlineFlagExplicit,testEnvironment,isOffline:isOfflineFlag,environmentDetected:codexFlag||offlineFlagExplicit};
}

async function createEnvironmentAdapters():Promise<EnvironmentAdapters>{
  return{isOffline:isOfflineFlag,axios:await getAxiosModule(),qerrors:await getQerrors()};
}

export{setOfflineMode,isOfflineMode,getAxiosModule as getAxios,getQerrors,getEnvironmentState,createEnvironmentAdapters,clearOfflineCache};