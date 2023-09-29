import {
    randomString,
    randomIntBetween,
} from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import ws from 'k6/ws';
import { check } from 'k6';

const sessionDuration = randomIntBetween(10000, 60000); // user session between 10s and 1m

export const options = {
    vus: 290,
    duration: '30s',
};

function generateMessage(eventName, userId, message) {
    return {
        event: eventName,
        userId,
        message,
    };
}
export default function () {
    const url = 'ws://localhost:4000';
    const params = { tags: { my_tag: 'node-websocket-test' } };

    const res = ws.connect(url, params, function (socket) {
        console.log('what is session duration', sessionDuration);

        socket.on('open', function open() {
            console.log(`VU ${__VU}: connected`);

            socket.send(JSON.stringify(generateMessage('SETUP', __VU)));

            socket.setInterval(
                function timeout() {
                    socket.send(
                        JSON.stringify(
                            generateMessage('SAY', __VU, randomString(10))
                        )
                    );
                },
                randomIntBetween(2000, 8000)
            );
        });

        socket.on('close', function () {
            console.log(`VU ${__VU}: disconnected`);
        });

        socket.on('message', function (data) {
            data = JSON.parse(data);

            if (data.event === 'CHAT_MSG') {
                console.log(
                    `VU ${__VU} received: ${data.userId} says: ${data.message}`
                );
            } else {
                console.log(
                    `VU ${__VU} received unhandled message: ${data.message}`
                );
            }
        });

        socket.setTimeout(function () {
            console.log(
                `VU ${__VU}: ${sessionDuration}ms passed, leaving the chat`
            );
            socket.send(JSON.stringify({ event: 'LEAVE' }));
        }, sessionDuration);

        socket.setTimeout(function () {
            console.log(
                `Closing the socket forcefully 3s after graceful LEAVE`
            );
            socket.close();
        }, sessionDuration + 3000);
    });

    check(res, { 'WebSocket connected': (r) => r && r.status === 101 });
}
