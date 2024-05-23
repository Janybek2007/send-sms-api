import { Router } from 'express'
import authMiddleware from '../middlewares/auth-middleware.js'
import messagesController from '../controllers/messages-controller.js'
const router = Router()

router.get('/messages/get/:messagesId', messagesController.getMessages)
router.post(
	'/messages/:messagesId/send/text',
	messagesController.sendTextMessage
)
router.post('/messages/:messagesId/send/img', messagesController.sendImgMessage)
router.post(
	'/messages/:messagesId/send/img_and_text',
	messagesController.sendImgAndTextMessage
)
router.delete(
	'/messages/:messagesId/delete/message/:messageId',
	messagesController.deleteMessage
)
router.patch(
	'/messages/:messagesId/update/message/:messageId',
	messagesController.updateMessage
)

export default router
