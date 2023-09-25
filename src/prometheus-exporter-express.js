import express from 'express';
import { cpu } from 'node-os-utils';
import {
    register,
    currentMemoryUsageGauge,
    currentCPUUsageGauge,
} from './prometheus-register.js';

const port = 9092;
let prometheusExporter;
function configurePrometheusExporter(serviceName = 'express') {
    const runTimeName = process.versions?.bun ? 'bun' : 'node';
    serviceName = `${serviceName}-${runTimeName}}`;

    register.setDefaultLabels({
        app: serviceName,
        serviceName
    });

    prometheusExporter = express();
    prometheusExporter.get('/metrics', async (req, res) => {
        currentMemoryUsageGauge.set(process.memoryUsage().heapUsed);
        currentCPUUsageGauge.set(await cpu.usage());

        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    });

    prometheusExporter.listen(port, () => {
        console.log(`Prometheus exporter is running on port ${port}`);
    });

    return prometheusExporter;
}

export {
    configurePrometheusExporter,
    prometheusExporter
}
