import { Elysia } from 'elysia';
import osu from 'node-os-utils';
import {
    register,
    currentMemoryUsageGauge,
    currentCPUUsageGauge,
} from './prometheus-register.js';

const port = 9092;
let prometheusExporter;

function configurePrometheusExporter(serviceName = 'elysia') {
    const runTimeName = process.versions?.bun ? 'bun' : 'node';
    serviceName = `${serviceName}-${runTimeName}}`;

    register.setDefaultLabels({
        app: serviceName,
        serviceName,
    });

    prometheusExporter = new Elysia()
        .get('/metrics', async ({ set }) => {
            currentMemoryUsageGauge.set(process.memoryUsage().heapUsed);
            currentCPUUsageGauge.set(await osu.cpu.usage());
            set.headers['Content-Type'] = register.contentType;
            return await register.metrics();
        })
        .listen(port);
}

export { configurePrometheusExporter, prometheusExporter };
