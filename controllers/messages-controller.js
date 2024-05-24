import Messages from '../models/messages-model.js'
import { pusher } from '../index.js'

async function findAndCreate(Id) {
	const messages = await Messages.findOne({ messageId: Id })
	if (!messages) {
		await Messages.create({
			messageId: Id,
			messages: []
		})
	}
}

class MessagesController {
	async getMessages(req, res) {
		const { messagesId } = req.params
		try {
			await findAndCreate(messagesId)
			const messages = await Messages.findOne({ messageId: messagesId })
			if (!messages) {
				return res.status(404).json({ message: 'Messages not found' })
			}
			pusher.trigger('messages', 'get-message', {
				messages
			})
			res.status(200).json(messages)
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: 'Server Error' })
		}
	}

	async sendMessage(req, res) {
		const { messagesId } = req.params
		const { text, img, senderId } = req.body
		try {
			await findAndCreate(messagesId)
			const messages = await Messages.findOne({ messageId: messagesId })
			if (!messages) {
				return res.status(404).json({ message: 'Messages not found' })
			}
			let newMessage = {
				text: text ? text : '',
				img: img ? img : '',
				senderId
			}
			messages.messages.push(newMessage)
			pusher.trigger('messages', 'new-message', {
				messages
			})
			await messages.save()
			res.status(200).json(messages)
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: 'Server Error' })
		}
	}

	async deleteMessage(req, res) {
		const { messagesId, messageId } = req.params
		try {
			await findAndCreate(messagesId)
			const messages = await Messages.findOne({ messageId: messagesId })
			if (!messages) {
				return res.status(404).json({ message: 'Messages not found' })
			}
			messages.messages = messages.messages.filter(
				msg => msg._id.toString() !== messageId
			)
			await messages.save()
			pusher.trigger('messages', 'delete-message', {
				messages
			})
			res.status(200).json(messages)
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: 'Server Error' })
		}
	}

	async updateMessage(req, res) {
		const { messagesId, messageId } = req.params
		const { text, img } = req.body
		try {
			await findAndCreate(messagesId)
			const messages = await Messages.findOne({ messageId: messagesId })
			if (!messages) {
				return res.status(404).json({ message: 'Messages not found' })
			}
			const messageToUpdate = messages.messages.find(
				msg => msg._id.toString() === messageId
			)
			if (!messageToUpdate) {
				return res.status(404).json({ message: 'Message not found' })
			}
			if (text) {
				messageToUpdate.text = text
			}
			if (img) {
				messageToUpdate.img = img
			}
			pusher.trigger('messages', 'update-message', {
				messages
			})
			await messages.save()
			res.status(200).json(messages)
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: 'Server Error' })
		}
	}
}

export default new MessagesController()
