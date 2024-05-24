// /websocket-server.js
import { Server } from 'socket.io';

export default function websocketServer(httpServer) {
    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        console.log('WebSocket Client Connected');

        socket.on('disconnect', () => {
            console.log('WebSocket Client Disconnected');
        });
    });
}
