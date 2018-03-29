import HC_SOCKET, { defaultProps as wsDefaultProps } from "./sockets"
import HC_HTTP, { defaultProps as httpDefaultProps } from "./http"

const env = process.env.NODE_ENV || "development"

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
  error: env === "development" ? loud : quiet,
  host: "localhost",
  actions: {}
}

const init = async (props = {}) => {
  props = Object.assign({}, defaultProps, props)

  const wsProps = Object.assign({}, defaultProps, wsDefaultProps, props)
  const httpProps = Object.assign({}, defaultProps, httpDefaultProps, props)

  const socket = await HC_SOCKET(wsProps)
  const http = await HC_HTTP(httpProps)

  return { socket, http }
}

export default init
