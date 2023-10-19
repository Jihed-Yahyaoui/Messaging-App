// This object contains all users connected to SocketIO
// In a key-value Map like this: Map(mongoId: {[socketIds], mongoId})
// This object contains methods to add, get, and delete users
// A user can have multiple socket Ids (example: a user has two active tabs)

var connectedUsers = {
    users: new Map(),

    addUser: function (mongoId, socketId) {
        if (!mongoId) return;
        const foundUser = this.users.get(mongoId)
        // If user is newly connected, simply add the user
        if (!foundUser)
            return this.users.set(mongoId, { mongoId, socketIds: [socketId] })

        // If user has opened a new tab or smth, add his new socketId
        if (!foundUser.socketIds.find(id => socketId === id)) {
            return this.users.set(mongoId, { mongoId, socketIds: [...foundUser.socketIds, socketId] })
        }
    },

    getUserByMongoId: function (mongoId) {
        return this.users.get(mongoId)
    },

    getUserBySocketId: function (socketId) {
        // Iterate through users values and find the value
        // That contains the proper socketId
        const iterator = this.users.entries()
        while (entry = iterator.next().value[1]) {
            if (entry[1].socketId.find(id => id === socketId))
                return entry
        }
    },

    deleteUser: function (socketId) {
        // Iterate through users values and find the value
        // That contains the proper socketId
        // And remove that socketId from the user
        // If the user has no socketId (no more open tabs) remove them
        const iterator = this.users.entries()
        while (entry = iterator.next().value) {
            const [mongoId, { socketIds: userSockets }] = entry

            this.users.set(mongoId, { mongoId, socketIds: userSockets.filter(id => id !== socketId) })

            if (!userSockets.length)
                this.users.delete(entry.mongoId)
        }
    }
}

module.exports = connectedUsers