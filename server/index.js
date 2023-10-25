// Setting up the expressJS server and mongoDB connection and socketIO server
const express = require('express')
const { connect } = require('mongoose')
const cors = require('cors')
const { createServer } = require('node:http')
const { Server } = require('socket.io')

const app = express()
app.use(cors({
    origin: "*"
}))

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 60 * 1000,
    }
})

require('dotenv').config()
app.use(express.json())

connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));



// Adding SocketIO events
const onMessage = require('./socket/onMessage')
const onConnect = require('./socket/onConnect')
const onDisconnect = require('./socket/onDisconnect')

io.on('connect', (socket) => {
    
    socket.on('connected', onConnect)

    socket.on('message', onMessage)

    socket.on('disconnect', onDisconnect)

});


// Adding request handlers
const userRouter = require('./routes/userRouter')
const messageRouter = require('./routes/messageRouter')
const fileRouter = require('./routes/fileRouter')

app.use('/user', userRouter)
app.use('/message', messageRouter)
app.use('/file', fileRouter)

server.listen(process.env.SERVER_PORT, () => console.log("listening..."))
