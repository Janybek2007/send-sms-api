import {model, Schema} from 'mongoose'

const UserSchema = new Schema({
    username: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    avatar: {type: String, required: true},
})

export default model('User', UserSchema)

