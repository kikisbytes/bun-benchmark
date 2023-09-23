import { Elysia } from 'elysia';
import sequelize from './db/db.js';
import Book from './db/models/Book.js';
import './prometheus-exporter-elysia.js';

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

const app = new Elysia()
    .get('/api/books', () => {
        return Book.findAll();
    })
    .listen(port);
