import { model, Schema, Types } from 'mongoose'

const UserChatsSchema = new Schema({
	userId: { type: Types.ObjectId, ref: 'User' },
	chats: [
		{
			chatId: {
				type: String,
				required: true,
				unique: true
			},
			lastMessage: {
				img: { type: Boolean, default: false },
				text: { type: String, default: '' }
			},
			date: { type: Number, default: 0 },
			interlocutorId: { type: Types.ObjectId, ref: 'User' }
		}
	]
})

export default model('UserChats', UserChatsSchema)