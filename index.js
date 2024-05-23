import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import errorMiddleware from './middlewares/err-middleware.js'
import userRouter from './routers/user-router.js'
import userChatsRouter from './routers/user_chats-router.js'
import messagesRouter from './routers/messages-router.js'

dotenv.config()

const PORT = process.env.PORT || 6500
const app = express()

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
		await mongoose.connect(process.env.DB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
	} catch (e) {
		console.log(e)
	}
}

start().then(r => r)

// module.exports = app
