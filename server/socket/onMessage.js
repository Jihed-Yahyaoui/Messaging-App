const conversationModel = require("../models/conversationModel");
const messageModel = require("../models/messageModel");
const connectedUsers = require("./connnectedUsers")
const mongoose = require('mongoose')

// Get Receiver and broadcast the message to all their socketIds
// Get sender and broadcast the message to all their socketIds except for the sender SocketId
// Meaning that if a user has multiple active browser tabs and sends from one tab
// That tab won't receive the message as it already sent the msg but all other tabs will
async function onMessage(data) {
    const socket = this
    const { senderId, secondUserId, text } = data

    const receiver = connectedUsers.getUserByMongoId(secondUserId)
    if (receiver)
        for (let i = 0; i < receiver.socketIds.length; i++)
            socket.broadcast.to(receiver.socketIds[i]).emit('message', { text, senderId })

    const sender = connectedUsers.getUserByMongoId(senderId)
    for (let i = 0; i < sender.socketIds.length; i++)
        if (sender.socketIds[i] !== socket.id)
            socket.broadcast.to(sender.socketIds[i]).emit('message', { text, senderId })


    // Create message in DB
    const newMsg = await messageModel.create({
        senderId: new mongoose.Types.ObjectId(senderId),
        receiverId: new mongoose.Types.ObjectId(secondUserId),
        text
    })

    // Find conversation where user ids are the same as those in the DB and add msg
    const conversation = await conversationModel.findOneAndUpdate(
        {
            users: {
                $all: [
                    new mongoose.Types.ObjectId(senderId),
                    new mongoose.Types.ObjectId(secondUserId)
                ]
            }
        }
        , { $push: { messages: newMsg._id } })

    // If conversation doesn't exist, create it with new msg
    if (!conversation)
        return await conversationModel.create({
            users: [
                new mongoose.Types.ObjectId(senderId),
                new mongoose.Types.ObjectId(secondUserId)
            ],
            messages: [newMsg._id]
        })
}

module.exports = onMessage