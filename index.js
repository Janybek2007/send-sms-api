// /index.js
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import Pusher from 'pusher'

import errorMiddleware from './middlewares/err-middleware.js'
import userRouter from './routers/user-router.js'
import userChatsRouter from './routers/user_chats-router.js'
import messagesRouter from './routers/messages-router.js'

dotenv.config()

const PORT = process.env.PORT || 6500
const app = express()

export const pusher = new Pusher({
	appId: '1807931',
	key: '0785683114fb438a6719',
	secret: 'f3a3132a0fb16b28822a',
	cluster: 'ap2',
	useTLS: true
})

app.use(express.json())
app.use(
	cors({
		origin: '*'
	})
)

app.use(errorMiddleware)

app.use('/api', userRouter)
app.use('/api', userChatsRouter)
app.use('/api', messagesRouter)

app.get('/', (req, res) => {
	const { name = 'world' } = req.query
	res.json({
		msg: `hello ${name}`
	})
})

const start = async () => {
	try {
		await mongoose.connect(process.env.DB_URI)
		app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
	} catch (e) {
		console.log(e)
	}
}

start().then(r => r)

export default app
