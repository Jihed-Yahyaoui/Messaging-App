const conversationModel = require("../models/conversationModel");
const messageModel = require("../models/messageModel");
const connectedUsers = require("./connnectedUsers")
const mongoose = require('mongoose')

// Add message to the DB
async function addMessage(senderId, secondUserId, text) {
    const mongooseSenderId = new mongoose.Types.ObjectId(senderId)
    const mongooseSecondUserId = new mongoose.Types.ObjectId(secondUserId)

    // Find conversation
    const result = await conversationModel.findOne({
        users: {
            $all: [
                mongooseSenderId,
                mongooseSecondUserId
            ]
        }
    })

    // If conversation not found then create one
    const conversation = result || await conversationModel.create({
        users: [mongooseSenderId, mongooseSecondUserId]
    })

    // Create Text message
    const newMessage = await messageModel.create({
        senderId: mongooseSenderId,
        receiverId: mongooseSecondUserId,
        text
    })

    // Save text message to DB
    conversation.messages.push(newMessage)
    await conversation.save()

}

// Get Receiver and broadcast the message to all their socketIds
// Get sender and broadcast the message to all their socketIds except for the sender SocketId
// Meaning that if a user has multiple active browser tabs and sends from one tab
// That tab won't receive the message as it already sent the msg but all other tabs will
function onMessage(data) {
    const socket = this
    const { senderId, secondUserId, text, file } = data
    
    const receiver = connectedUsers.getUserByMongoId(secondUserId)
    if (receiver)
        for (let i = 0; i < receiver.socketIds.length; i++)
            socket.broadcast.to(receiver.socketIds[i])
                .emit('message', { text, senderId, file })

    const sender = connectedUsers.getUserByMongoId(senderId)
    for (let i = 0; i < sender.socketIds.length; i++)
        socket.broadcast.to(sender.socketIds[i])
            .emit('message', { text, senderId, file })

    // If the message contains text, do stuff
    if (text) addMessage(senderId, secondUserId, text)

    // If the message contains files, it is handle by controllers/fileController.js
    // Because only that file has access to both original name and new name
}

module.exports = onMessage