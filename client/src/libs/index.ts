import { io } from 'socket.io-client'
import { reactive } from 'vue'

const URL = 'http://localhost:3300'
export const socketState = reactive({
  connected: false,
  socketId: '',
  users: []
})
export const manage = (userData: any) => {
  const socket = io(`${URL}/abc`, {
    retries: 3,
  })
  // connection
  socket.on('connect', () => {
    socketState.connected = true
    socketState.socketId = socket.id
    socket.emit('participated', userData)
  })

  socket.on('users',(users) => {
    console.log(users)
    socketState.users = users
  })

  socket.on('disconnect', () => {
    socketState.connected = false
  })

}
