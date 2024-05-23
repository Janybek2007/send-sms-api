import { ApiError } from '../exteptions/api-error.js'
import userModel from '../models/user-model.js'
import userChatsModel from '../models/user_chats-model.js'

async function verifiUser(userId) {
	const user = await userModel.findById(userId)
	if (user) {
		return true
	} else {
		return false
	}
}
class UserChatsController {
	async getChats(req, res, next) {
		try {
			const { userId } = req.params
			const isFindUser = await verifiUser(userId)

			if (!isFindUser) {
				return ApiError.UnauthorizedError()
			}

			const result = await userChatsModel.findOne({
				userId
			})

			if (!result) {
				return res
					.status(404)
					.json({ message: `No data for identifier ${userId} found` })
			}

			res.status(200).json({ chats: result })
		} catch (error) {
			next(error)
		}
	}

	async updateChat(req, res, next) {
		try {
			const { chatId, userId, updateData } = req.params

			const isFindUser = await verifiUser(userId)
			if (!isFindUser) {
				return ApiError.UnauthorizedError()
			}

			const result = await userChatsModel.findOne({
				userId
			})

			if (!result) {
				return res
					.status(404)
					.json({ message: `No data for identifier ${userId} found` })
			}

			result.chats.map(chat =>
				chat.chatId === chatId ? { ...chat, ...updateData } : chat
			)
			await result.save()
			res.status(200).json({ chats: result })
		} catch (error) {
			next(error)
		}
	}

	async creatChat(req, res, next) {
		try {
			const { userId } = req.params

			const isFindUser = await verifiUser(userId)
			if (!isFindUser) {
				return ApiError.UnauthorizedError()
			}
			const userChats = await userChatsModel.findOne({ userId })
			if (!userChats) {
				await userChatsModel.create({
					userId,
					chats: []
				})
			}
			const { chatId, lastMessage, date, interlocutorId } = req.body
			if (interlocutorId === userId) {
				return res
					.status(404)
					.json({
						message: `error [interlocutorId !== userId] | [${interlocutorId} !== ${userId}]`
					})
			}

			const conditionChatId = userChats.chats.find(
				chat => chat.chatId === chatId
			)
			if (conditionChatId && userChats.chats.length !== 0) {
				return res
					.status(404)
					.json({ message: 'Such a chat room already exists' })
			}

			const newChat = {
				chatId,
				lastMessage,
				date,
				interlocutorId
			}

			userChats.chats.push(newChat)
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

			const result = await userChatsModel.findOne({
				userId
			})
			if (!result) {
				return res
					.status(404)
					.json({ message: `No data for identifier ${userId} found` })
			}

			const findChat = result.chats.find(chat => chat.chatId === chatId)
			if (findChat) {
				result.chats.filter(chat => chat.chatId !== chatId)
			} else {
				return ApiError.BadRequest('No chat on this id was found')
			}
			await result.save()
			res.status(200).json({ chats: result })
		} catch (error) {
			next(error)
		}
	}
}

export default new UserChatsController()
