import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { createAdapter } from 'socket.io-redis'
import Redis from 'ioredis'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3000

const pubClient = new Redis('redis://:mysecretpassword@localhost:6379/1')
//const subClient = new Redis('redis://:mysecretpassword@localhost:6379/1')

// subClient.psubscribe('your-channel-*', (err, count) => {
//   if (err) {
//     console.error('Failed to subscribe', err)
//     return
//   }
//   console.log(`Subscribed to ${count} channel(s).`)
// })

// subClient.on('pmessage', (pattern, channel, message) => {
//   console.log(`Message received: ${message} from channel: ${channel}`)
// })

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

const namespaces = io.of(/^\/[a-z]{3}$/)
namespaces.on('connection', (socket) => {
  const namespace = socket.nsp

  socket.on('participated', async (data) => {
    const { id, name } = data
    const hkey = `namespace:${namespace.name}`
    await pubClient.hset(hkey, socket.id, JSON.stringify({ id, name }))
    const users = await pubClient.hgetall(hkey)
    const userList = Object.values(users).map((user) => JSON.parse(user))
    io.of(namespace.name).emit('users', userList)
  })

  // disconnect event from client
  socket.on('disconnect', async () => {
    const hkey = `namespace:${namespace.name}`
    await pubClient.hdel(hkey, socket.id)
    const users = await pubClient.hgetall(hkey)
    const userList = Object.values(users).map((user) => JSON.parse(user))
    io.of(namespace.name).emit('users', userList)
  })
})

httpServer.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`)
})

export default app
