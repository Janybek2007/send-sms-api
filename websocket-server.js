// /websocket-server.js
import { Server } from 'socket.io'

export default function websocketServer(httpServer) {
	const io = new Server(httpServer, {
		cors: {
			origin: '*',
			methods: ['POST', 'GET', 'PATCH', 'DELETE']
		}
	})

	io.on('connection', socket => {
		console.log('WebSocket Client Connected')

		socket.on('disconnect', () => {
			console.log('WebSocket Client Disconnected')
		})
	})
}
