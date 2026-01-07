/** Rate Limiting Implementation using rate-limiter-flexible */
import{RateLimiterRedis,RateLimiterMemory,RateLimiterAbstract}from'rate-limiter-flexible';
import{redisUrl,redisCloudUrl}from'../config/localVars.js';
import qerrors from'qerrors';

export interface RateLimitConfig{windowMs:number;maxRequests:number;keyGenerator?:(req:any)=>string;points?:number;duration?:number;}
export interface RateLimitResult{allowed:boolean;remaining:number;resetTime:number;retryAfter?:number;}
export interface RateLimitStats{isDistributed:boolean;redisConnected:boolean;}

export const createDistributedRateLimiter=async(config:RateLimitConfig):Promise<RateLimiterAbstract>=>{try{const redisUrlToUse=redisUrl||redisCloudUrl;if(redisUrlToUse){const{createClient}=await import('redis'),redis=createClient(redisUrlToUse);await redis.connect();const limiter=new RateLimiterRedis({storeClient:redis,keyPrefix:'rlflx',points:config.points||config.maxRequests,duration:config.duration||Math.ceil(config.windowMs/1000)});console.log('Redis rate limiter initialized');return limiter;}else throw new Error('Redis not configured');}catch(error){qerrors(error as Error,'createDistributedRateLimiter: Redis setup failed, falling back to memory',{redisUrl:redisUrl||redisCloudUrl,errorType:(error as Error).constructor.name});return new RateLimiterMemory({points:config.points||config.maxRequests,duration:config.duration||Math.ceil(config.windowMs/1000)});}};

export const createInMemoryRateLimiter=(config:RateLimitConfig):RateLimiterMemory=>new RateLimiterMemory({points:config.points||config.maxRequests,duration:config.duration||Math.ceil(config.windowMs/1000)});

export const checkRateLimit=async(limiter:RateLimiterAbstract,req:any,config:RateLimitConfig):Promise<RateLimitResult>=>{const key=config.keyGenerator?config.keyGenerator(req):`rate_limit:${req.ip||'unknown'}:${req.path||'default'}`;try{const result=await limiter.consume(key);return{allowed:true,remaining:result.remainingPoints||0,resetTime:Date.now()+(result.msBeforeNext||0)};}catch(rejRes:any){if(rejRes instanceof Error){qerrors(rejRes,'checkRateLimit: unexpected error',{key});return{allowed:true,remaining:0,resetTime:Date.now()+config.windowMs};}return{allowed:false,remaining:0,resetTime:Date.now()+(rejRes.msBeforeNext||0),retryAfter:Math.ceil((rejRes.msBeforeNext||0)/1000)};}};

export const resetRateLimitKey=async(limiter:RateLimiterAbstract,key:string):Promise<void>=>{try{await limiter.delete(key);}catch(error){qerrors(error as Error,'resetRateLimitKey: failed',{key});}};

export const getRateLimitStats=(limiter:RateLimiterAbstract):RateLimitStats=>({isDistributed:limiter instanceof RateLimiterRedis,redisConnected:limiter instanceof RateLimiterRedis});

export const getDistributedRateLimiter=async(config:RateLimitConfig):Promise<RateLimiterAbstract>=>createDistributedRateLimiter(config);
export const getInMemoryRateLimiter=(config:RateLimitConfig):RateLimiterMemory=>createInMemoryRateLimiter(config);

export class DistributedRateLimiter{private limiter:RateLimiterAbstract;private config:RateLimitConfig;constructor(config:RateLimitConfig){this.config=config;this.limiter=new RateLimiterMemory({});this.setupLimiter();}private async setupLimiter():Promise<void>{this.limiter=await createDistributedRateLimiter(this.config);}async isAllowed(req:any):Promise<RateLimitResult>{if(this.limiter instanceof RateLimiterMemory&&this.limiter.points===0)await this.setupLimiter();return checkRateLimit(this.limiter,req,this.config);}async resetKey(key:string):Promise<void>{return resetRateLimitKey(this.limiter,key);}getStats():RateLimitStats{return getRateLimitStats(this.limiter);}get rateLimiter():RateLimiterAbstract{return this.limiter;}}

export class InMemoryRateLimiter{private limiter:RateLimiterMemory;private config:RateLimitConfig;constructor(config:RateLimitConfig){this.config=config;this.limiter=createInMemoryRateLimiter(config);}async isAllowed(req:any):Promise<RateLimitResult>{return checkRateLimit(this.limiter,req,this.config);}async resetKey(key:string):Promise<void>{return resetRateLimitKey(this.limiter,key);}getStats():RateLimitStats{return getRateLimitStats(this.limiter);}get rateLimiter():RateLimiterMemory{return this.limiter;}}

export{RateLimiterRedis,RateLimiterMemory,RateLimiterAbstract};export default{createDistributedRateLimiter,createInMemoryRateLimiter,checkRateLimit,resetRateLimitKey,getRateLimitStats,getDistributedRateLimiter,getInMemoryRateLimiter,DistributedRateLimiter,InMemoryRateLimiter,RateLimiterRedis,RateLimiterMemory,RateLimiterAbstract};