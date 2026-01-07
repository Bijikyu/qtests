/** Environment Manager - Unified Environment Variable Utilities */
import dotenv from'dotenv';
export interface EnvBackup{[key:string]:string|undefined;}
export const backupEnvVars=(keys?:string[]):EnvBackup=>{const backup:EnvBackup={};(keys?keys:Object.keys(process.env)).forEach(key=>backup[key]=process.env[key]);return backup;};

export const restoreEnvVars=(backup:EnvBackup,keys?:string[]):void=>{(keys?keys:Object.keys(backup)).forEach(key=>key in backup?process.env[key]=backup[key]:delete process.env[key]);};
export const withSavedEnv=<T>(fn:()=>T,envVars:Record<string,string|undefined>={}):T=>{const backup=backupEnvVars(Object.keys(envVars));try{Object.entries(envVars).forEach(([key,value])=>value!==undefined?process.env[key]=value:delete process.env[key]);return fn();}finally{restoreEnvVars(backup);}};

export const loadEnv=(path?:string):Record<string,string>=>{const result=dotenv.config({path});if(result.error)throw result.error;return result.parsed||{};};
export const configureEnv=(defaults:Record<string,string>={},overrides:Record<string,string>={},envPath?:string):void=>{if(envPath)try{Object.assign(defaults,loadEnv(envPath));}catch(error){console.warn('Failed to load .env file:',error);}Object.entries(defaults).forEach(([key,value])=>process.env[key]===undefined&&(process.env[key]=value));Object.entries(overrides).forEach(([key,value])=>process.env[key]=value);};
export{dotenv};