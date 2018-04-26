import HC_SOCKET from './sockets'
import HC_HTTP from './http'

const env = process.env.NODE_ENV || 'development'

const quiet = e => {
  console.error(e)
}

const loud = e => {
  if (e instanceof Error) {
    throw e
  } else {
    throw new Error(JSON.stringify(e))
  }
}

const defaultProps = {
  error: env === 'development' ? loud : quiet,
  host: 'localhost',
  actions: {},
}

const init = async (props = {}) => {
  const socket = await HC_SOCKET(props)
  const http = await HC_HTTP(props)

  return { socket, http }
}

init.socket = HC_SOCKET
init.http = HC_HTTP

export default init
