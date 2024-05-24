import { Router } from 'express'
import authMiddleware from '../middlewares/auth-middleware.js'
import userChatsController from '../controllers/user_chats-controller.js'
const router = Router()

router.get('/chats/get/:userId', authMiddleware, userChatsController.getChats)
router.delete(
	'/chat/:userId/delete/:chatId',
	authMiddleware,
	userChatsController.getChats
)
router.patch(
	'/chat/:userId/update/:chatId',
	authMiddleware,
	userChatsController.updateChat
)
router.post(
	'/chat/:userId/create',
	authMiddleware,
	userChatsController.createChat
)

export default router
