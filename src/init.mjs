import { socket } from './socket'
import { http } from './http'

const env = process.env.NODE_ENV || 'development'

export const init = async (props = {}) => ({
  socket: await socket(props),
  http: await http(props),
})

init.socket = socket
init.http = http

export default init
