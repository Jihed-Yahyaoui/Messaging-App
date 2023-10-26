const fileModel = require("../models/fileModel")
const messageModel = require("../models/messageModel")
const conversationModel = require("../models/conversationModel")
const mongoose = require("mongoose")

module.exports = {
    // Loop through files and add them to the DB
    createFile: async (req, res) => {
        const { senderId } = req.query
        const secondUserId = req.params.id
        const mongooseSenderId = new mongoose.Types.ObjectId(senderId)
        const mongooseSecondUserId = new mongoose.Types.ObjectId(secondUserId)
        const sentFiles = []

        // Find conversation
        const result = await conversationModel.findOne({
            users: {
                $all: [mongooseSenderId, mongooseSecondUserId]
            }
        })

        // If conversation not found then create one
        const conversation = result || await conversationModel.create({
            users: [mongooseSenderId, mongooseSecondUserId]
        })

        for (let i = 0; i < req.files.length; i++) {
            const { originalname, filename } = req.files[i]

            // Adds file to the DB
            const newFile = await fileModel.create({
                filename, originalname
            })

            // Handling DB stuff
            const newMessage = await messageModel.create({
                senderId: mongooseSenderId,
                receiverId: mongooseSecondUserId,
                file: newFile._id
            })

            conversation.messages.push(newMessage._id)
            await conversation.save()

            sentFiles.push(originalname)
        }

        res.send({ sentFiles })
    }
}