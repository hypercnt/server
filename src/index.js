export { socket } from './sockets'
export { http } from './http'

const env = process.env.NODE_ENV || 'development'

const quiet = e => {
  console.error(e)
}

const loud = e => {
  if (e instanceof Error) {
    throw e
  } else {
    if (typeof e === 'string' || typeof e === 'number' || e instanceof Date) {
      throw new Error(e)
    }

    throw new Error(JSON.stringify(e))
  }
}

const init = async (props = {}) => {
  const socketServer = await socket(props)
  const httpServer = await http(props)

  return { socket: socketServer, http: httpServer }
}

init.socket = socket
init.http = http

export default init
