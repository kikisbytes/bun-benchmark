import { Gauge, Registry } from 'prom-client';

const register = new Registry();
register.setDefaultLabels({
    app: 'default',
    serviceName: 'default',
});
const currentMemoryUsageGauge = new Gauge({
    name: 'nodejs_memory_usage_in_bytes',
    help: 'Current memory usage of the process',
});

const currentCPUUsageGauge = new Gauge({
    name: 'nodejs_cpu_usage_in_percentage',
    help: 'Current CPU usage of the process',
});

register.registerMetric(currentMemoryUsageGauge);
register.registerMetric(currentCPUUsageGauge);

export { register, currentMemoryUsageGauge, currentCPUUsageGauge };
