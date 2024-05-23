import { Router } from 'express'
import authMiddleware from '../middlewares/auth-middleware.js'
import messagesController from '../controllers/messages-controller.js'
const router = Router()

router.get('/messages/get/:messagesId',authMiddleware, messagesController.getMessages)
router.post(
	'/messages/:messagesId/send/message',
	authMiddleware,
	messagesController.sendMessage
)
router.delete(
	'/messages/:messagesId/delete/message/:messageId',
	authMiddleware,
	messagesController.deleteMessage
)
router.patch(
	'/messages/:messagesId/update/message/:messageId',
	authMiddleware,
	messagesController.updateMessage
)

export default router
