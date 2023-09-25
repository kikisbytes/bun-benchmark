const webSocketPort = 4000;
const clients = new Map();

const server = Bun.serve({
    fetch(req, server) {
        // upgrade the request to a WebSocket
        if (server.upgrade(req)) {
            return; // do not return a Response
        }
        return new Response('Upgrade failed :(', { status: 500 });
    },
    port: webSocketPort,
    websocket: {
        open(ws) {
            console.log('Client connected');
        },
        message(ws, data) {
            data = JSON.parse(data);

            switch (data.event) {
                case 'SETUP':
                    ws.userId = data.userId;
                    clients.set(ws.userId, ws);
                    console.log(`User "${ws.userId}" joined the chat`);
                    break;
                case 'SAY':
                    console.log(`User "${ws.userId}" said: ${data.message}`);
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
                    console.log(`User "${ws.userId}" left the chat`);
                    ws.terminate();
                    clients.delete(ws.userId);
                default:
                    break;
            }
        },

        close(ws, code, message) {
            console.log('Client disconnected');
        },
    },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
