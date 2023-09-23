import express from 'express';
import { cpu } from 'node-os-utils';
import {
    register,
    currentMemoryUsageGauge,
    currentCPUUsageGauge,
} from './prometheus-register.js';

register.setDefaultLabels({
    app: 'express',
    serviceName: 'express',
});

const prometheusExporter = express();
prometheusExporter.get('/metrics', async (req, res) => {
    currentMemoryUsageGauge.set(process.memoryUsage().heapUsed);
    currentCPUUsageGauge.set(await cpu.usage());

    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

prometheusExporter.listen(9092, () => {
    console.log(`Prometheus exporter is running on port 9092`);
});

export default prometheusExporter;
