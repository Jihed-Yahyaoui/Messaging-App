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
        type: String,
        default: ""
    },
    fileType: {
        type: String,
        default: ""
    }
}, { timestamps: true })

module.exports = mongoose.model('messages', messageSchema)

