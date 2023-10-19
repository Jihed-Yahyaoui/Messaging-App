const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }],
    messages: [{ type: mongoose.Types.ObjectId, ref: 'messages' }],

}, { timestamps: true })

module.exports = mongoose.model('conversations', conversationSchema)

