let ws = {}

export const cache = []
export let open = false
export let apiVersion = "v0"

let error = (...msg) => console.error(...msg)

const stringify = msg => {
  try {
    if (typeof msg === "string") {
      msg = JSON.parse(msg)
    }

    msg[0] = `${apiVersion}.${msg[0]}`

    return JSON.stringify(msg)
  } catch (e) {
    error(e)
  }
}

const parse = msg => {
  if (typeof msg !== "string") {
    return msg
  }

  try {
    return JSON.parse(msg)
  } catch (e) {
    return msg
  }
}

const reactions = actions => ({
  onmessage: e => {
    if (e.data === "Unknown Action") {
      error("Unknown Action", e)
      return
    }

    const [path, data] = parse(e.data)
    let action = actions

    path.split(".").forEach(key => {
      const fnName = `${key}_done`
      const sub = action[fnName]
      if (typeof sub === "function") {
        action = sub
        return
      } else {
        action = actions[key]
      }
    })

    if (typeof action === "function") {
      return action(data)
    }
  },
  open: () => {
    open = true

    while (cache.length) {
      const msg = cache.shift()
      send(msg)
    }
  },
  close: () => {
    open = false
  }
})

export const connect = (actions, options = {}) => {
  const host = options.host || location.hostname
  const port = options.port || location.port
  const protocol = options.protocol || "ws"

  apiVersion = options.apiVersion || "v0"
  error = options.error || error

  ws = new WebSocket(`${protocol}://${host}:${port}`)

  open = false

  const react = reactions(actions)

  ws.onopen = react.open
  ws.onclose = react.close
  ws.onmessage = react.onmessage

  return ws
}

export const send = msg => (open ? ws.send(stringify(msg)) : cache.push(msg))

export default connect
