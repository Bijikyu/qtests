/** Environment Manager - Consolidated Environment Variable Utilities */
import { backupEnvVars, restoreEnvVars, withSavedEnv, loadEnv, configureEnv, snapshotEnv, handleSnapshotError } from '../helpers/envManager.js';
import{logStart,logReturn,setLogging}from'../../lib/logUtils.js';
import{withErrorLogging}from'../../lib/errorHandling/index.js';
import{nodeEnv}from'../../config/localVars.js';

nodeEnv!=='test'&&setLogging(false);
interface DefaultEnv{GOOGLE_API_KEY:string;GOOGLE_CX:string;OPENAI_TOKEN:string;}
const getEnvConfig=():DefaultEnv=>{const googleApiKey=process.env.GOOGLE_API_KEY||'',googleCx=process.env.GOOGLE_CX||'',openaiToken=process.env.OPENAI_TOKEN||'';return{GOOGLE_API_KEY:googleApiKey,GOOGLE_CX:googleCx,OPENAI_TOKEN:openaiToken};};
const defaultEnv:DefaultEnv=getEnvConfig();
const validateEnvKey=(key:string):boolean=>/^[A-Z_][A-Z0-9_]*$/.test(key);
const sanitizeEnvValue=(value:string):string=>typeof value!=='string'?'':value.trim();

export const setTestEnv=():boolean=>{logStart('setTestEnv','default values');return withErrorLogging(()=>{try{loadEnv();}catch(error){console.warn('Failed to load .env file:',error);}const defaultsAsRecord:Record<string,string>={};Object.entries(defaultEnv).forEach(([key,value])=>{defaultsAsRecord[key]=value||'';});configureEnv(defaultsAsRecord,{});logReturn('setTestEnv',true);return true;},'setTestEnv');};

export const saveEnv=():Record<string,string|undefined>=>{logStart('saveEnv');return withErrorLogging(()=>{const savedEnv=backupEnvVars();logReturn('saveEnv',`${Object.keys(savedEnv).length} env vars`);return savedEnv;},'saveEnv');};
export const restoreEnv=(savedEnv:Record<string,string|undefined>):boolean=>{logStart('restoreEnv',savedEnv);return withErrorLogging(()=>{if(!savedEnv||typeof savedEnv!=='object'){console.log(`restoreEnv: invalid saved environment`);return false;}restoreEnvVars(savedEnv);logReturn('restoreEnv',true);return true;},'restoreEnv');};

export { backupEnvVars, restoreEnvVars, withSavedEnv, loadEnv, configureEnv, defaultEnv, snapshotEnv, handleSnapshotError };