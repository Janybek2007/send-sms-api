// /index.js
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import Pusher from 'pusher'
import sendSmsServices from './services/send_sms-services.js'

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

app.post('/send_sms', async (req, res) => {
	try {
		const { from, to, message } = req.body

		await sendSmsServices.send(message, to, from)

		res.status(200).json({
			type: 'success',
			sendData: req.body
		})
	} catch (error) {}
})

app.get('/', (req, res) => {
	const { name = 'world' } = req.query
	res.json({
		msg: `hello ${name}`
	})
})

const start = async () => {
	try {
		app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
	} catch (e) {
		console.log(e)
	}
}

start().then(r => r)

export default app
