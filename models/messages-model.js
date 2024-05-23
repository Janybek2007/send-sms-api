import { model, Schema, Types } from 'mongoose'

const MessagesSchema = new Schema({
	messageId: { type: String, required: true,  },
	messages: [
		{
			text: { type: String, required: false },
			img: { type: String, required: false },
			date: { type: Number, default: Date.now() },
			senderId: { type: Types.ObjectId, ref: 'User' }
		}
	]
})

export default model('Messages', MessagesSchema)
