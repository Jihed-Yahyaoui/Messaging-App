const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    receiverId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        default: ""
    },
    file: {
        type: mongoose.Types.ObjectId,
        ref: 'files'
    }
}, { timestamps: true })

module.exports = mongoose.model('messages', messageSchema)

