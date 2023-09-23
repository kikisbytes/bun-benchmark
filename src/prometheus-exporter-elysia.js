import { Elysia } from 'elysia';
import { cpu } from 'node-os-utils';
import {
    register,
    currentMemoryUsageGauge,
    currentCPUUsageGauge,
} from './prometheus-register.js';

register.setDefaultLabels({
    app: 'bun-elysia',
    serviceName: 'bun-elysia',
});

const prometheusExporter = new Elysia()
    .get('/metrics', async ({ set }) => {
        currentMemoryUsageGauge.set(process.memoryUsage().heapUsed);
        currentCPUUsageGauge.set(await cpu.usage());
        set.headers['Content-Type'] = register.contentType;
        return await register.metrics();
    })
    .listen(9092);

export default prometheusExporter;
