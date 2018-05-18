import log from '@magic/log'

export { socket } from './sockets'
export { http } from './http'

const env = process.env.NODE_ENV || 'development'

const init = async (props = {}) => {
  const socketServer = await socket(props)
  const httpServer = await http(props)

  return { socket: socketServer, http: httpServer }
}

export default init
