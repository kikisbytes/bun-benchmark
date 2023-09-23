import { collectDefaultMetrics, Registry } from 'prom-client';
import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import express from 'express';

// prometheus metrics exporter
const register = new Registry();
register.setDefaultLabels({
    app: 'node-websocket',
    serviceName: 'node-websocket',
});
collectDefaultMetrics({ register });

const expressPort = 9092;
const app = express();
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.listen(expressPort, () => {
    console.log(`Prometheus exporter is running on port ${expressPort}`);
});

// websocket server
const webSocketPort = 8080;

const clients = new Map();
const wss = new WebSocketServer({ port: webSocketPort });

wss.on('connection', (ws) => {
    const clientId = uuidv4();
    clients.set(clientId, ws);

    ws.on('message', async (data) => {
        data = JSON.parse(data);

        switch (data.event) {
            case 'SETUP':
                ws.userId = data.userId;
                console.log(
                    `User "${ws.userId}" (ID: ${clientId}) joined the chat`
                );
                break;
            case 'SAY':
                console.log(
                    `User "${ws.userId}" (ID: ${clientId}) said: ${data.message}`
                );
                clients.forEach((client) => {
                    if (
                        client.readyState === WebSocket.OPEN &&
                        client.userId !== ws.userId
                    ) {
                        client.send(
                            JSON.stringify({
                                event: 'CHAT_MSG',
                                userId: ws.userId,
                                message: data.message,
                            })
                        );
                    }
                });
                break;
            case 'LEAVE':
                console.log(
                    `User "${ws.userId}" (ID: ${clientId}) left the chat`
                );
                ws.terminate();
                clients.delete(clientId);
            default:
                break;
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
