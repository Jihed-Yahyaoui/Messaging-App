const connectedUsers = require("./connnectedUsers")

function onDisconnect() {
    const { id: socketId } = this
    connectedUsers.deleteUser(socketId)
}

module.exports = onDisconnect