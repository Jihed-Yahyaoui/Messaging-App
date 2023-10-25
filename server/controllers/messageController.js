const conversationModel = require("../models/conversationModel")
const mongoose = require('mongoose')

module.exports = {
    getConversation: async (req, res) => {
        const { senderId } = req.query
        const secondUserId = req.params.id

        // Search for and populate conversation
        const conversation = await conversationModel.findOne(
            {
                users: {
                    $all: [
                        new mongoose.Types.ObjectId(senderId),
                        new mongoose.Types.ObjectId(secondUserId)
                    ]
                }
            }
        )
            .select('-_id messages')
            .populate({
                path: 'messages',
                select: '-_id senderId text filename mimetype'
            })

        if (!conversation) return res.status(204).json({})
        res.status(200).json(conversation)

    }
}