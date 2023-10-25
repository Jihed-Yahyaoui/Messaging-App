module.exports = {
    // Loop through files and add them to the DB
    createFile: async (req, res) => {
        const { senderId } = req.query
        const secondUserId = req.params.id

        for (let i = 0; i < req.files.length; i++) {
            const { filename, mimetype } = req.files[i]

            const newMsg = await messageModel.create({
                senderId: new mongoose.Types.ObjectId(senderId),
                receiverId: new mongoose.Types.ObjectId(secondUserId),
                filename, mimetype
            })
            
        }
    }
}