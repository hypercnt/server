import { Server } from 'ws'

import { mapActions } from './lib'

export const defaultProps = {
  host: 'localhost',
  port: 3001,
  protocol: 'ws',
  actions: {},
}

export const socket = props => {
  props = { ...defaultProps, ...props }
  const server = new Server(props)

  server.on('connection', client => {
    client.on('message', msg => {
      try {
        msg = JSON.parse(msg)
      } catch (err) {
        props.error(err)
      }

      const [name, body] = msg
      console.log('receive', name, body)

      const request = {
        name,
        body,
        client,
      }

      const response = {
        send: data => {
          const res = [name.replace('v0.', '')]

          if (data) {
            res.push(data)
          }

          console.log('send', res)

          client.send(JSON.stringify(res.filter(e => typeof e !== 'undefined')))
        },
      }

      const action = mapActions({ actions: props.actions, name: request.name })

      if (typeof action === 'function') {
        if (props.db) {
          response.db = props.db
        }

        action(request, response)
      } else {
        client.send('Unknown Action')
      }
    })
  })

  console.log(`socket server listening on ${props.port}`)
  return server
}

export default socket
