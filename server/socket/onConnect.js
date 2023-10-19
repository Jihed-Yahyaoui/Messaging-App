const connectedUsers = require("./connnectedUsers")

function onConnect(mongoId) {
    const { id: socketId } = this
    connectedUsers.addUser(mongoId, socketId)
}

module.exports = onConnect