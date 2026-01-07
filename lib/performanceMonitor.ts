/** Performance Monitor Implementation */
import{EventEmitter}from'events';
import*as os from'os';

export interface PerformanceMetrics{cpu:{usage:number;loadAverage:number[];};memory:{used:number;total:number;percentage:number;heapUsed:number;heapTotal:number;};eventLoop:{utilization:number;latency:number;};custom:{[key:string]:number;};}
export interface AlertThresholds{cpu?:number;memory?:number;eventLoop?:number;custom?:{[key:string]:number;};}
export interface PerformanceMonitorOptions{samplingInterval?:number;historySize?:number;adaptiveSampling?:boolean;alertThresholds?:AlertThresholds;}

export class PerformanceMonitor extends EventEmitter{private metrics:PerformanceMetrics={cpu:{usage:0,loadAverage:[]},memory:{used:0,total:0,percentage:0,heapUsed:0,heapTotal:0},eventLoop:{utilization:0,latency:0},custom:{}};private history:{[path:string]:Array<{value:number;timestamp:number;}>}={};private circularBuffers=new Map<string,any>();private performanceBaseline:PerformanceMetrics|null=null;private samplingRate=1.0;private lastSamplingAdjustment=0;private config:Required<PerformanceMonitorOptions>;private monitoringInterval?:NodeJS.Timeout;constructor(private options:PerformanceMonitorOptions={}){super();this.config={samplingInterval:options.samplingInterval||1000,historySize:options.historySize||1000,adaptiveSampling:options.adaptiveSampling||false,alertThresholds:options.alertThresholds||{}};this.startMonitoring();}

startMonitoring():void{if(this.monitoringInterval)return;this.monitoringInterval=setInterval(()=>this.collectMetrics(),this.config.samplingInterval);}
stopMonitoring():void{if(this.monitoringInterval){clearInterval(this.monitoringInterval);this.monitoringInterval=undefined;}}
getMetrics():PerformanceMetrics{return{...this.metrics};}
getHistory(path:string,limit?:number):Array<{value:number;timestamp:number;}>{const history=this.history[path]||[];return limit?history.slice(-limit):history;}
addMetric(name:string,value:number):void{this.metrics.custom[name]=value;this.updateHistory(`custom.${name}`,value,Date.now());this.checkAlertThresholds(`custom.${name}`,value);}

private collectMetrics():void{if(!this.shouldCollectMetrics())return;const now=Date.now();this.collectCPUMetrics(now);this.collectMemoryMetrics(now);this.collectEventLoopMetrics(now);!this.performanceBaseline&&(this.performanceBaseline={...this.metrics});this.config.adaptiveSampling&&this.adjustSamplingRate();this.checkAllAlertThresholds();}

private collectCPUMetrics(timestamp:number):void{const loadAvg=os.loadavg();this.metrics.cpu={usage:this.calculateCPUUsage(),loadAverage:loadAvg};this.updateHistory('cpu.usage',this.metrics.cpu.usage,timestamp);this.updateHistory('cpu.loadAverage',loadAvg[0],timestamp);}
private collectMemoryMetrics(timestamp:number):void{const memUsage=process.memoryUsage(),totalMem=os.totalmem(),freeMem=os.freemem(),usedMem=totalMem-freeMem;this.metrics.memory={used:usedMem,total:totalMem,percentage:(usedMem/totalMem)*100,heapUsed:memUsage.heapUsed,heapTotal:memUsage.heapTotal};this.updateHistory('memory.percentage',this.metrics.memory.percentage,timestamp);this.updateHistory('memory.heapUsed',this.metrics.memory.heapUsed,timestamp);}
private collectEventLoopMetrics(timestamp:number):void{const start=process.hrtime.bigint();setImmediate(()=>{const end=process.hrtime.bigint(),latency=Number(end-start)/1000000;this.metrics.eventLoop.utilization=this.calculateEventLoopUtilization();this.metrics.eventLoop.latency=latency;this.updateHistory('eventLoop.utilization',this.metrics.eventLoop.utilization,timestamp);this.updateHistory('eventLoop.latency',latency,timestamp);});}

private calculateCPUUsage():number{const cpus=os.cpus();let totalIdle=0,totalTick=0;cpus.forEach(cpu=>{for(const type in cpu.times)totalTick+=(cpu.times as any)[type];totalIdle+=cpu.times.idle;});return Math.max(0,100-(totalIdle/totalTick)*100);}
private calculateEventLoopUtilization():number{return Math.random()*20;}

private shouldCollectMetrics():boolean{return!this.performanceBaseline||Math.random()<this.samplingRate;}
private adjustSamplingRate():void{const now=Date.now();if(now-this.lastSamplingAdjustment<10000)return;this.lastSamplingAdjustment=now;const memoryLoad=this.metrics.memory.percentage/100,cpuLoad=Math.min(this.metrics.cpu.usage/100,1),eventLoopLoad=Math.min(this.metrics.eventLoop.utilization,1),overallLoad=(memoryLoad+cpuLoad+eventLoopLoad)/3;this.samplingRate=Math.max(0.1,1-overallLoad);}

private updateHistory(path:string,value:number,timestamp:number):void{if(!this.history[path])this.history[path]=[];this.history[path].push({value,timestamp});const maxSize=this.config.historySize;if(this.history[path].length>maxSize)this.history[path]=this.history[path].slice(-maxSize);}
private checkAlertThresholds(path:string,value:number):void{const threshold=this.getThresholdForPath(path);threshold&&value>threshold&&this.emit('alert',{path,value,threshold,timestamp:Date.now()});}
private checkAllAlertThresholds():void{this.checkAlertThresholds('cpu.usage',this.metrics.cpu.usage);this.checkAlertThresholds('memory.percentage',this.metrics.memory.percentage);this.checkAlertThresholds('eventLoop.utilization',this.metrics.eventLoop.utilization);for(const[name,value]of Object.entries(this.metrics.custom))this.checkAlertThresholds(`custom.${name}`,value);}
private getThresholdForPath(path:string):number|undefined{const thresholds=this.config.alertThresholds;if(path.startsWith('custom.')){const customName=path.substring(7);return thresholds.custom?.[customName]as number;}const[category]=path.split('.');return thresholds[category as keyof typeof thresholds]as number;}
}