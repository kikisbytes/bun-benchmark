import 'dotenv/config';
import express from 'express';
import { collectDefaultMetrics, Gauge, Registry } from 'prom-client';
import sequelize from './db/db.js';
import Book from './db/models/Book.js';


// prometheus metrics exporter
const register = new Registry();
register.setDefaultLabels({
    app: 'node-express',
    serviceName: 'node-express',
});
// collectDefaultMetrics({ register });

const currentMemoryUsageGauge = new Gauge({
    name: 'nodejs_memory_usage_in_bytes',
    help: 'Current memory usage of the Node.js process',
});

register.registerMetric(currentMemoryUsageGauge);


const expressPort = 9092;
const prometheusExporter = express();
prometheusExporter.get('/metrics', async (req, res) => {
    currentMemoryUsageGauge.set(process.memoryUsage().heapUsed);

    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

prometheusExporter.listen(expressPort, () => {
    console.log(`Prometheus exporter is running on port ${expressPort}`);
});


const app = express();
const port = process.env.PORT || 4000;

sequelize
    .sync()
    .then(async () => {
        const books = await Book.findAll();

        if (!books.length) {
            await Book.bulkCreate([
                { title: 'Book 1', author: 'Author 1' },
                { title: 'Book 2', author: 'Author 2' },
                { title: 'Book 3', author: 'Author 3' },
            ]);

            console.log('created some mock data');
        }

        console.log('Database connected and synced');
    })
    .catch((err) => {
        console.log('Failed to sync models', err);
    });


app.get('/api/books', async (req, res) => {
    currentMemoryUsageGauge.set(process.memoryUsage().heapUsed);

    const books = await Book.findAll();
    return res.json(books);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
