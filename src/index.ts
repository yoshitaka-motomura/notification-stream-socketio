import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST'],
  })
)
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

io.on('connection', (socket) => {
  //connection
  console.log('New client connected')

  // message event from client
  socket.on('message', (msg) => {
    console.log('Message received: ', msg)
    io.emit('message', msg)
  })

  // disconnect event from client
  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

httpServer.listen(PORT, () => {
  console.log('Server is running on http://localhost:%d', PORT)
})

export default app
