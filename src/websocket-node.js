import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { configurePrometheusExporter } from './prometheus-exporter-express.js';

configurePrometheusExporter('websocket');

const webSocketPort = 4000;
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
