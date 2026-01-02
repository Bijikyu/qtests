"use strict";
/**
 * Memory Pressure Detection and Adaptive Scaling System
 *
 * Monitors system memory usage and automatically adjusts application behavior
 * to prevent out-of-memory errors and maintain optimal performance under
 * varying load conditions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalMemoryPressureMonitor = exports.MemoryPressureMonitor = void 0;
exports.createMemoryPressureMonitor = createMemoryPressureMonitor;
const events_1 = require("events");
/**
 * Memory Pressure Monitor with Adaptive Scaling
 */
class MemoryPressureMonitor extends events_1.EventEmitter {
    constructor(config = {}) {
        super();
        this.isMonitoring = false;
        this.currentStats = null;
        this.scalingHistory = [];
        this.lastScalingTime = 0;
        this.scalingCooldown = 30000; // 30 seconds between scaling actions
        // Component registry for adaptive scaling
        this.components = new Map();
        this.currentSize = component.getCurrentSize();
        this.newSize = Math.max(1, Math.floor(currentSize * (1 - reductionFactor)));
        this.config = {
            checkInterval: config.checkInterval || 5000, // 5 seconds
            lowMemoryThreshold: config.lowMemoryThreshold || 0.7, // 70%
            highMemoryThreshold: config.highMemoryThreshold || 0.85, // 85%
            criticalMemoryThreshold: config.criticalMemoryThreshold || 0.95, // 95%
            enableAutoScaling: config.enableAutoScaling !== false,
            enableGarbageCollection: config.enableGarbageCollection !== false,
            scalingFactor: config.scalingFactor || 0.5
        };
        this.scalingConfig = {
            cacheSizeReduction: 0.3, // Reduce by 30%
            connectionPoolReduction: 0.2, // Reduce by 20%
            queueSizeReduction: 0.4, // Reduce by 40%
            requestRejectionThreshold: 0.9, // Reject requests above 90%
            gcTriggerThreshold: 0.8 // Force GC above 80%
        };
    }
    /**
     * Start memory pressure monitoring
     */
    start() {
        if (this.isMonitoring) {
            return;
        }
        this.isMonitoring = true;
        this.monitoringInterval = setInterval(() => {
            this.checkMemoryPressure();
        }, this.config.checkInterval);
        this.emit('monitoring:started');
        console.log('Memory pressure monitoring started');
    }
    /**
     * Stop memory pressure monitoring
     */
    stop() {
        if (!this.isMonitoring) {
            return;
        }
        this.isMonitoring = false;
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = undefined;
        }
        this.emit('monitoring:stopped');
        console.log('Memory pressure monitoring stopped');
    }
    /**
     * Register a component for adaptive scaling
     */
    registerComponent(name, type, getCurrentSize, setMaxSize, getCurrentLoad = () => 0) {
        this.components.set(name, {
            type,
            getCurrentSize,
            setMaxSize,
            getCurrentLoad
        });
        console.debug(`Registered component for adaptive scaling: ${name} (${type})`);
    }
    /**
     * Unregister a component
     */
    unregisterComponent(name) {
        this.components.delete(name);
        console.debug(`Unregistered component: ${name}`);
    }
    /**
     * Get current memory statistics
     */
    getMemoryStats() {
        return this.currentStats ? { ...this.currentStats } : null;
    }
    /**
     * Get scaling action history
     */
    getScalingHistory(durationMs) {
        if (!durationMs) {
            return [...this.scalingHistory];
        }
        const cutoff = Date.now() - durationMs;
        return this.scalingHistory.filter(action => action.timestamp >= cutoff);
    }
    /**
     * Force a memory pressure check
     */
    async forceCheck() {
        await this.checkMemoryPressure();
    }
    /**
     * Check memory pressure and trigger adaptive scaling
     */
    async checkMemoryPressure() {
        try {
            const stats = this.collectMemoryStats();
            this.currentStats = stats;
            // Emit memory stats update
            this.emit('memory:stats', stats);
            // Determine pressure level
            const pressure = this.determinePressureLevel(stats.percentage);
            // Trigger adaptive scaling if enabled
            if (this.config.enableAutoScaling) {
                await this.performAdaptiveScaling(stats, pressure);
            }
            // Force garbage collection if enabled and under pressure
            if (this.config.enableGarbageCollection && stats.percentage > this.scalingConfig.gcTriggerThreshold) {
                this.forceGarbageCollection();
            }
            // Emit pressure level change
            this.emit('memory:pressure', { stats, pressure });
        }
        catch (error) {
            console.error('Memory pressure check failed:', error);
            this.emit('memory:error', error);
        }
    }
    /**
     * Collect comprehensive memory statistics
     */
    collectMemoryStats() {
        try {
            const memUsage = process.memoryUsage();
            const totalMem = require('os').totalmem();
            const freeMem = require('os').freemem();
            const usedMem = totalMem - freeMem;
            const percentage = usedMem / totalMem;
            const heapPercentage = memUsage.heapUsed / memUsage.heapTotal;
            return {
                total: totalMem,
                used: usedMem,
                free: freeMem,
                percentage,
                pressure: this.determinePressureLevel(percentage),
                heapUsed: memUsage.heapUsed,
                heapTotal: memUsage.heapTotal,
                heapPercentage,
                external: memUsage.external,
                arrayBuffers: memUsage.arrayBuffers,
                timestamp: Date.now()
            };
        }
        catch (error) {
            console.error('Failed to collect memory stats:', error);
            throw error;
        }
    }
    /**
     * Determine memory pressure level
     */
    determinePressureLevel(percentage) {
        if (percentage >= this.config.criticalMemoryThreshold) {
            return 'critical';
        }
        else if (percentage >= this.config.highMemoryThreshold) {
            return 'high';
        }
        else if (percentage >= this.config.lowMemoryThreshold) {
            return 'medium';
        }
        else {
            return 'low';
        }
    }
    /**
     * Perform adaptive scaling based on memory pressure
     */
    async performAdaptiveScaling(stats, pressure) {
        const now = Date.now();
        // Respect scaling cooldown to prevent oscillation
        if (now - this.lastScalingTime < this.scalingCooldown) {
            return;
        }
        let scalingPerformed = false;
        switch (pressure) {
            case 'critical':
                scalingPerformed = await this.handleCriticalMemory(stats);
                break;
            case 'high':
                scalingPerformed = await this.handleHighMemory(stats);
                break;
            case 'medium':
                scalingPerformed = await this.handleMediumMemory(stats);
                break;
            case 'low':
                scalingPerformed = await this.handleLowMemory(stats);
                break;
        }
        if (scalingPerformed) {
            this.lastScalingTime = now;
        }
    }
    /**
     * Handle critical memory pressure
     */
    async handleCriticalMemory(stats) {
        console.warn('CRITICAL memory pressure detected, performing emergency scaling');
        let actionsPerformed = 0;
        // Aggressive cache reduction
        actionsPerformed += await this.scaleComponents('cache', 0.5, 'critical');
        // Aggressive connection pool reduction
        actionsPerformed += await this.scaleComponents('connection_pool', 0.3, 'critical');
        // Aggressive queue reduction
        actionsPerformed += await this.scaleComponents('queue', 0.6, 'critical');
        // Force garbage collection
        this.forceGarbageCollection();
        // Emit critical alert
        this.emit('memory:critical', { stats, actionsPerformed });
        return actionsPerformed > 0;
    }
    /**
     * Handle high memory pressure
     */
    async handleHighMemory(stats) {
        console.warn('High memory pressure detected, performing scaling');
        let actionsPerformed = 0;
        // Moderate cache reduction
        actionsPerformed += await this.scaleComponents('cache', this.scalingConfig.cacheSizeReduction, 'high');
        // Moderate connection pool reduction
        actionsPerformed += await this.scaleComponents('connection_pool', this.scalingConfig.connectionPoolReduction, 'high');
        // Moderate queue reduction
        actionsPerformed += await this.scaleComponents('queue', this.scalingConfig.queueSizeReduction, 'high');
        // Emit high pressure alert
        this.emit('memory:high', { stats, actionsPerformed });
        return actionsPerformed > 0;
    }
    /**
     * Handle medium memory pressure
     */
    async handleMediumMemory(stats) {
        console.log('Medium memory pressure detected, performing light scaling');
        let actionsPerformed = 0;
        // Light cache reduction
        actionsPerformed += await this.scaleComponents('cache', 0.15, 'medium');
        // Light queue reduction
        actionsPerformed += await this.scaleComponents('queue', 0.2, 'medium');
        // Emit medium pressure alert
        this.emit('memory:medium', { stats, actionsPerformed });
        return actionsPerformed > 0;
    }
    /**
     * Handle low memory pressure (recovery)
     */
    async handleLowMemory(stats) {
        // Gradually restore component sizes if we've been scaling down
        let actionsPerformed = 0;
        for (const [name, component] of this.components) {
            const currentLoad = component.getCurrentLoad();
            const currentSize = component.getCurrentSize();
            // Only restore if load is low and we've previously scaled down
            if (currentLoad < 0.5 && this.hasBeenScaledDown(name)) {
                const newSize = Math.floor(currentSize * 1.1); // Increase by 10%
                component.setMaxSize(newSize);
                this.recordScalingAction(name, 'restore', `Increased size to ${newSize}`, 'low');
                actionsPerformed++;
            }
        }
        if (actionsPerformed > 0) {
            this.emit('memory:recovery', { stats, actionsPerformed });
        }
        return actionsPerformed > 0;
    }
    /**
     * Scale components of a specific type
     */
    async scaleComponents(type, reductionFactor, severity) {
        let actionsPerformed = 0;
        for (const [name, component] of this.components) {
            if (component.type !== type) {
                continue;
            }
            const currentSize = component.getCurrentSize();
            const newSize = Math.max(1, Math.floor(currentSize * (1 - reductionFactor)));
            // Check if component supports setMaxSize method
            if (component.setMaxSize && typeof component.setMaxSize === 'function') {
                component.setMaxSize(newSize);
                this.recordScalingAction(name, 'reduce', `Reduced size from ${currentSize} to ${newSize}`, severity);
                actionsPerformed++;
            }
            else {
                // Alternative: log the scaling action but don't fail
                console.warn(`Component ${name} does not support dynamic resizing, but scaling action recorded`);
                this.recordScalingAction(name, 'size_change_attempt', `Size change recorded for ${name} from ${currentSize} to ${newSize}`, severity);
            }
        }
        this.recordScalingAction('system', 'scale', `Scaled ${actionsPerformed} components of type ${type}`, severity);
        return actionsPerformed;
    }
    if(newSize, , currentSize) {
        component.setMaxSize(newSize);
        const message = `Reduced size from ${currentSize} to ${newSize}`;
        this.recordScalingAction(name, 'reduce', message, severity);
        actionsPerformed++;
    }
}
exports.MemoryPressureMonitor = MemoryPressureMonitor;
return actionsPerformed;
hasBeenScaledDown(componentName, string);
boolean;
{
    const recentActions = this.getScalingHistory(300000); // Last 5 minutes
    return recentActions.some(action => action.component === componentName &&
        action.type === 'reduce');
}
recordScalingAction(component, string, type, 'reduce' | 'restore' | 'force_gc' | 'reject_requests', action, string, severity, 'low' | 'medium' | 'high' | 'critical');
void {
    const: scalingAction, ScalingAction = {
        type,
        component,
        action,
        severity,
        timestamp: Date.now()
    },
    this: .scalingHistory.push(scalingAction),
    : .scalingHistory.length > 1000
};
{
    this.scalingHistory = this.scalingHistory.slice(-1000);
}
this.emit('scaling:action', scalingAction);
forceGarbageCollection();
void {
    try: {
        if(global) { }, : .gc
    }
};
{
    const beforeGC = process.memoryUsage();
    global.gc();
    const afterGC = process.memoryUsage();
    const memoryFreed = beforeGC.heapUsed - afterGC.heapUsed;
    this.recordScalingAction('system', 'force_gc', `Freed ${memoryFreed} bytes`, 'medium');
    console.debug(`Forced garbage collection, freed ${memoryFreed} bytes`);
    this.emit('memory:gc', { before: beforeGC, after: afterGC, freed: memoryFreed });
}
try { }
catch (error) {
    console.warn('Failed to force garbage collection:', error);
}
/**
 * Get system recommendations based on current memory state
 */
getRecommendations();
string[];
{
    if (!this.currentStats) {
        return ['Memory monitoring not active'];
    }
    const recommendations = [];
    const { percentage, pressure } = this.currentStats;
    switch (pressure) {
        case 'critical':
            recommendations.push('CRITICAL: Immediate action required - consider restarting the application');
            recommendations.push('Reduce all cache sizes and connection pools to minimum');
            recommendations.push('Enable request rejection to prevent overload');
            break;
        case 'high':
            recommendations.push('Reduce cache sizes by at least 30%');
            recommendations.push('Consider reducing connection pool sizes');
            recommendations.push('Monitor for potential memory leaks');
            break;
        case 'medium':
            recommendations.push('Light reduction of cache sizes recommended');
            recommendations.push('Monitor memory usage trends');
            break;
        case 'low':
            recommendations.push('Memory usage is normal');
            if (this.hasBeenScaledDown('cache')) {
                recommendations.push('Consider gradually restoring cache sizes');
            }
            break;
    }
    // Add heap-specific recommendations
    if (this.currentStats.heapPercentage > 0.9) {
        recommendations.push('Heap usage is very high - check for memory leaks');
    }
    return recommendations;
}
/**
 * Create a memory pressure monitor with default configuration
 */
function createMemoryPressureMonitor(config) {
    return new MemoryPressureMonitor(config);
}
/**
 * Global memory pressure monitor instance
 */
exports.globalMemoryPressureMonitor = createMemoryPressureMonitor();
exports.default = MemoryPressureMonitor;
