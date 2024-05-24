import Messages from '../models/messages-model.js';
import { Server } from 'socket.io';

const io = new Server();

async function findAndCreate(Id) {
    const messages = await Messages.findOne({ messageId: Id });
    if (!messages) {
        await Messages.create({
            messageId: Id,
            messages: []
        });
    }
}

class MessagesController {
    async getMessages(req, res) {
        const { messagesId } = req.params;
        try {
            await findAndCreate(messagesId);
            const messages = await Messages.findOne({ messageId: messagesId });
            if (!messages) {
                return res.status(404).json({ message: 'Messages not found' });
            }
            res.status(200).json(messages);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async sendMessage(req, res) {
        const { messagesId } = req.params;
        const { text, img, senderId } = req.body;
        try {
            await findAndCreate(messagesId);
            const messages = await Messages.findOne({ messageId: messagesId });
            if (!messages) {
                return res.status(404).json({ message: 'Messages not found' });
            }
            let newMessage = {
                text: text ? text : '',
                img: img ? img : '',
                senderId
            };
            messages.messages.push(newMessage);
            await messages.save();
            io.emit('newMessage', messages); 
            res.status(200).json(messages);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async deleteMessage(req, res) {
        const { messagesId, messageId } = req.params;
        try {
            await findAndCreate(messagesId);
            const messages = await Messages.findOne({ messageId: messagesId });
            if (!messages) {
                return res.status(404).json({ message: 'Messages not found' });
            }
            messages.messages = messages.messages.filter(
                msg => msg._id.toString() !== messageId
            );
            await messages.save();
            io.emit('messageDeleted', messages);
            res.status(200).json(messages);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async updateMessage(req, res) {
        const { messagesId, messageId } = req.params;
        const { text, img } = req.body;
        try {
            await findAndCreate(messagesId);
            const messages = await Messages.findOne({ messageId: messagesId });
            if (!messages) {
                return res.status(404).json({ message: 'Messages not found' });
            }
            const messageToUpdate = messages.messages.find(
                msg => msg._id.toString() === messageId
            );
            if (!messageToUpdate) {
                return res.status(404).json({ message: 'Message not found' });
            }
            if (text) {
                messageToUpdate.text = text;
            }
            if (img) {
                messageToUpdate.img = img;
            }
            await messages.save();
            io.emit('messageUpdated', messages);
            res.status(200).json(messages);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }
}

export default new MessagesController();
