import * as ws from "ws"

import mapActions from "./mapActions"

const { Server } = ws

export const defaultProps = {
  host: "localhost",
  port: 3001,
  protocol: "ws",
  actions: {}
}

export const init = async props => {
  const server = await new Server(props)

  server.on("connection", client => {
    client.on("message", msg => {
      try {
        msg = JSON.parse(msg)
      } catch (err) {
        props.error(err)
      }

      const [name, body] = msg

      const request = {
        name,
        body,
        client
      }

      console.log("receive", name, body)

      const response = {
        send: data => {
          const res = [name.replace("v0.", "")]

          if (data) {
            res.push(data)
          }

          console.log("send", res)

          client.send(JSON.stringify(res))
        }
      }

      const action = mapActions({ actions: props.actions, name: request.name })

      if (typeof action === "function") {
        action(request, response)
      } else {
        client.send("Unknown Action")
      }
    })
  })

  console.log(`socket server listening on ${props.port}`)
  return server
}

export default init
