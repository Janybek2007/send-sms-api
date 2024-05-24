import userModel from '../models/user-model.js'
import userChatsModel from '../models/user_chats-model.js'
import { ApiError } from '../exteptions/api-error.js'
import { pusher } from '../index.js'

async function verifiUser(userId) {
	const user = await userModel.findById(userId)
	return !!user
}

class UserChatsController {
	async getChats(req, res, next) {
		try {
			const { userId } = req.params
			const isFindUser = await verifiUser(userId)

			if (!isFindUser) {
				return ApiError.UnauthorizedError()
			}

			const result = await userChatsModel.findOne({ userId })

			if (!result) {
				return res
					.status(404)
					.json({ message: `No data for identifier ${userId} found` })
			}
			pusher.trigger('chat-events', `get-chats-${userId}`, {
				chats: result
			})
			res.status(200).json({ chats: result })
		} catch (error) {
			next(error)
		}
	}

	async updateChat(req, res, next) {
		try {
			const { chatId, userId } = req.params
			const updateData = req.body

			const isFindUser = await verifiUser(userId)
			if (!isFindUser) {
				return ApiError.UnauthorizedError()
			}

			const result = await userChatsModel.findOne({ userId })

			if (!result) {
				return res
					.status(404)
					.json({ message: `No data for identifier ${userId} found` })
			}

			result.chats = result.chats.map(chat =>
				chat.chatId === chatId ? { ...chat, ...updateData } : chat
			)

			await result.save()
			pusher.trigger('chat-events', 'update-chat', { chats: result })
			res.status(200).json({ chats: result })
		} catch (error) {
			next(error)
		}
	}

	async createChat(req, res, next) {
		try {
			const { userId } = req.params

			const isFindUser = await verifiUser(userId)
			if (!isFindUser) {
				return ApiError.UnauthorizedError()
			}

			let userChats = await userChatsModel.findOne({ userId })

			if (!userChats) {
				userChats = await userChatsModel.create({
					userId,
					chats: []
				})
			}

			const { chatId, lastMessage, date, interlocutorId } = req.body

			if (interlocutorId === userId) {
				return res.status(400).json({
					message: `Error: interlocutorId cannot be the same as userId. [${interlocutorId} === ${userId}]`
				})
			}

			const existingChat = userChats.chats.find(chat => chat.chatId === chatId)
			if (existingChat) {
				return res
					.status(400)
					.json({ message: 'Chat room with this chatId already exists' })
			}

			const newChat = {
				chatId,
				lastMessage,
				date,
				interlocutorId
			}

			userChats.chats.push(newChat)
			pusher.trigger('chat-events', 'new-chat', { chat: newChat })
			await userChats.save()
			res.status(200).json({ chats: userChats })
		} catch (error) {
			next(error)
		}
	}

	async deleteChat(req, res, next) {
		try {
			const { chatId, userId } = req.params

			const isFindUser = await verifiUser(userId)
			if (!isFindUser) {
				return ApiError.UnauthorizedError()
			}

			const result = await userChatsModel.findOne({ userId })
			if (!result) {
				return res
					.status(404)
					.json({ message: `No data for identifier ${userId} found` })
			}

			const findChatIndex = result.chats.findIndex(
				chat => chat.chatId === chatId
			)
			if (findChatIndex !== -1) {
				result.chats.splice(findChatIndex, 1)
				pusher.trigger('chat-events', 'delete-chat', { chats: result })
				await result.save()
				res.status(200).json({ chats: result })
			} else {
				return ApiError.BadRequest('No chat on this id was found')
			}
		} catch (error) {
			next(error)
		}
	}
}

export default new UserChatsController()
